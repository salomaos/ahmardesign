#!/usr/bin/env node
/**
 * audit-usage.mjs <caminho-do-app-consumidor>
 *
 * Extrai todas as classes usadas em um app consumidor (Svelte, React, Vue, HTML,
 * Astro, etc.) e reporta quais delas NÃO existem no bundle da lib.
 *
 * O objetivo é deixar a lib auto-verificável por qualquer consumidor: rode o
 * script contra um app, olhe a lista de "ausentes" e decida se cada uma é
 * (a) gap real da lib -> estender a escala genérica, ou
 * (b) classe local do app / artefato de parser -> não pertence à lib.
 *
 * Uso:
 *   node scripts/audit-usage.mjs ../mcurso
 *   node scripts/audit-usage.mjs ../mcurso --ext svelte,ts,js,html
 *   node scripts/audit-usage.mjs ../mcurso --strict   # sai com código 1 se houver ausentes
 *
 * Opções:
 *   --ext <lista>   Extensões varridas (padrão: svelte,html,jsx,tsx,vue,astro,js,ts,mdx)
 *   --ignore <padrões>  Padrões de caminho ignorados (regex, separados por vírgula)
 *   --strict        Sai com código 1 quando existe classe ausente
 *   --all           Lista também as classes ENCONTRADAS (verbose)
 *   --help          Mostra esta ajuda
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BUNDLE = path.join(ROOT, 'src', 'css', 'ahmardesign.css');

// ---------------------------------------------------------------------------
// Argumentos
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const positional = args.filter((a) => !a.startsWith('--'));

function flagValue(name, fallback) {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1 || !args[idx + 1]) return fallback;
  return args[idx + 1];
}

if (flags.has('--help') || positional.length === 0) {
  const help = fs
    .readFileSync(fileURLToPath(import.meta.url), 'utf8')
    .replace(/^#!.*\r?\n/, '')
    .split('*/')[0]
    .replace(/^\/\*\*?/, '')
    .replace(/^ \* ?/gm, '')
    .trim();
  console.log(help);
  process.exit(positional.length === 0 ? 1 : 0);
}

const target = path.resolve(process.cwd(), positional[0]);
const EXTENSIONS = flagValue('ext', 'svelte,html,jsx,tsx,vue,astro,js,ts,mdx').split(',').map((e) => e.trim().replace(/^\./, ''));
const IGNORE_PATTERNS = flagValue('ignore', 'node_modules,/.git,/.svelte-kit,/dist,/build,/coverage,/.next,package-lock,pnpm-lock,/\.output')
  .split(',')
  .map((p) => p.trim())
  .filter(Boolean)
  .map((p) => new RegExp(p));
const STRICT = flags.has('--strict');
const SHOW_ALL = flags.has('--all');

const SKIP_DIRS = new Set(['node_modules', '.git', '.svelte-kit', 'dist', 'build', 'coverage', '.next', '.output', '.vercel', 'target']);

// ---------------------------------------------------------------------------
// Artefatos de parser /não- classes/: nunca são classes reais.
// O Svelte escapa o prefixo de diretivas com ":", logo qualquer token que
// contenha ":" vindo de dentro de class:xyz={...} é lixo do scanner, exceto
// os prefixos responsivos e de estado que a lib realmente define
// (sm:, md:, lg:, xl:, 2xl:, hover:, focus:, etc).
// ---------------------------------------------------------------------------
const KNOWN_VARIANT_PREFIXES = new Set([
  'sm', 'md', 'lg', 'xl', '2xl', 'hover', 'focus', 'focus-visible', 'active',
  'disabled', 'group-hover', 'dark', 'first', 'last', 'odd', 'even'
]);

/** Tokens que são artefato do scanner Svelte (diretivas) e devem ser ignorados. */
function isParserArtifact(token) {
  // "class:cursor={x}" -> o ":" é o separador da diretiva, não faz parte da classe.
  // Quando o scanner junta o nome da diretiva com o valor, sobra algo como
  // "cursor-pointer:" ou "bloco.correta" -> usamos estas regras pra descartar.
  if (token.includes(':')) {
    const parts = token.split(':').filter(Boolean);
    if (parts.length === 0) return true;
    // Todos os segmentos precisam ser prefixos conhecidos para ser variante real.
    return !parts.every((p) => KNOWN_VARIANT_PREFIXES.has(p));
  }
  // Classes locais com ponto (módulo CSS / Svelte style) não são utilitários.
  // Mantemos apenas pontos escapados que o lib realmente gera (1.5, 1/2).
  if (token.includes('.')) {
    const normalized = token.replace(/\\\./g, '.').replace(/\\\//g, '/');
    return !/^[a-z0-9-]+(\d+(\.\d+)?|\/\d+)$/.test(normalized);
  }
  return false;
}

/** Coleta arquivos relevantes do app consumidor. */
function collectFiles(dir, acc = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (IGNORE_PATTERNS.some((re) => re.test(full))) continue;
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      collectFiles(full, acc);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).slice(1);
      if (EXTENSIONS.includes(ext)) acc.push(full);
    }
  }
  return acc;
}

const CLASS_ATTR_RE = /\bclass(?:Name)?\s*[:=]\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`|\{)/g;
const CLASSLIST_RE = /\bclassList\.(?:add|remove|toggle|contains)\s*\(\s*['"]([^'"]+)['"]/g;

/** Caracteres aceitos em um token de classe CSS. */
const VALID_TOKEN_RE = /^[-_a-zA-Z0-9\\:/.%[\]#!]+$/;

/**
 * Normaliza um token: remove aspas e pontuação de expressão que o scanner
 * acabou colando no token (ex.: `'alert-error'}`, `{resposta`, `===`, `?`).
 */
function cleanToken(raw) {
  return raw
    .trim()
    .replace(/^['"`]+/, '')
    .replace(/['"`]+$/, '')
    .replace(/^[?:{}(),;=]+/, '')
    .replace(/[?:{}(),;=]+$/, '')
    .replace(/-+$/, '') // fragmento de interpolação, ex.: "language-{linguagem}"
    .trim();
}

/**
 * Heurística para tokens que vieram de uma EXPRESSÃO (`class={cond ? 'a' : 'b'}`).
 * Variáveis e operadores (`resposta`, `erro`, `status`) não são classes, então só
 * aceitamos tokens com cara de utilitário: hífen, ou palavra única que já exista
 * no bundle (display/posição: flex, hidden, grid...), ou já conhecida.
 */
function looksLikeUtility(token, bundleClasses) {
  if (token.includes('-')) return true;
  if (bundleClasses.has(token)) return true;
  return SINGLE_WORD_CLASSES.has(token);
}

/** Palavras únicas que a lib define como utilitário (display, position, flex, grid). */
const SINGLE_WORD_CLASSES = new Set([
  'block', 'inline', 'inline-block', 'inline-flex', 'flex', 'grid', 'inline-grid',
  'hidden', 'contents', 'table', 'static', 'fixed', 'absolute', 'relative', 'sticky',
  'italic', 'underline', 'truncate', 'uppercase', 'lowercase', 'capitalize',
  'left', 'right', 'center', 'justify', 'start', 'end', 'top', 'bottom', 'auto',
  'full', 'none', 'normal', 'pre', 'wrap', 'nowrap', 'contain', 'cover', 'fill',
  'reset', 'invisible', 'visible', 'collapse', 'clip', 'ellipsis', 'break-all'
]);

/** Extrai classes de um texto-fonte (qualquer linguagem). */
function extractClasses(source, bundleClasses) {
  const found = new Map(); // classe -> nº de ocorrências
  const dynamic = new Set(); // tokens que vieram de expressão (heurística)

  const record = (token, fromExpression) => {
    if (!token) return;
    if (!VALID_TOKEN_RE.test(token)) return;
    if (!/[a-zA-Z0-9]/.test(token)) return;
    if (token.startsWith('[') || token.endsWith(']')) return; // valores arbitrários
    if (isParserArtifact(token)) return;
    if (fromExpression && !looksLikeUtility(token, bundleClasses)) return;
    found.set(token, (found.get(token) || 0) + 1);
    if (fromExpression) dynamic.add(token);
  };

  /** Adiciona uma lista de classes vinda de um literal (alta confiança). */
  const addLiteral = (raw) => {
    // Svelte/Angular permitem interpolação dentro do literal:
    // class="base {cond ? 'a' : 'b'}". As expressões entram no canal dinâmico.
    for (const part of raw.split(/\{[^}]*\}/)) {
      for (const tok of part.split(/\s+/)) record(cleanToken(tok), false);
    }
    for (const expr of raw.matchAll(/\{([^{}]*)\}/g)) {
      for (const s of expr[1].matchAll(/['"`]([^'"`$<>{}]*)['"`]/g)) record(cleanToken(s[1]), true);
    }
  };

  /** Adiciona classes de uma expressão (chaves balanceadas, canal dinâmico). */
  const addExpression = (expr) => {
    for (const s of expr.matchAll(/(['"`])([^'"`$<>{}]*)\1/g)) record(cleanToken(s[2]), true);
  };

  /** Devolve a expressão que começa em `open` (o `{` já está em `source[open]`). */
  const readBraced = (open) => {
    let depth = 0;
    for (let i = open; i < source.length; i++) {
      const ch = source[i];
      if (ch === "'" || ch === '"' || ch === '`') {
        // pula string para não contar chaves dentro dela
        const quote = ch;
        i++;
        while (i < source.length && source[i] !== quote) {
          if (source[i] === '\\') i++;
          i++;
        }
        continue;
      }
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) return source.slice(open + 1, i);
      }
    }
    return source.slice(open + 1);
  };

  for (const m of source.matchAll(CLASS_ATTR_RE)) {
    const literal = m[1] ?? m[2] ?? m[3];
    if (literal !== undefined) addLiteral(literal);
    else addExpression(readBraced(m.index + m[0].length - 1));
  }
  // classList.add('...')
  for (const m of source.matchAll(CLASSLIST_RE)) addLiteral(m[1]);

  return { found, dynamic };
}

/** Extrai todos os seletores de classe presentes no bundle da lib. */
function extractBundleClasses(css) {
  const classes = new Set();
  // Um nome de classe pode conter escape hexadecimal ("\32 xl" = "2xl") e escapes
  // de caractere ("\:"), além dos caracteres normais. O lookbehind evita que
  // números de medidas ("0.5rem") sejam lidos como classe.
  const CLASS_TOKEN_RE = /(?<![\w\\])\.((?:\\[0-9a-fA-F]{1,6}\s?|\\.|[^\s.,:>+~()[\]"'\\{}])+)/g;
  for (const m of css.matchAll(CLASS_TOKEN_RE)) {
    const cls = m[1]
      .replace(/\\([0-9a-fA-F]{1,6})\s?/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/\\([.:/])/g, '$1');
    classes.add(cls);
    // classes com prefixo responsivo/estado também valem sem o prefixo
    const colonIdx = cls.indexOf(':');
    if (colonIdx > 0) classes.add(cls.slice(colonIdx + 1));
  }
  return classes;
}

// ---------------------------------------------------------------------------
// Execução
// ---------------------------------------------------------------------------
if (!fs.existsSync(target)) {
  console.error(`✗ Caminho não encontrado: ${target}`);
  process.exit(1);
}
if (!fs.existsSync(BUNDLE)) {
  console.error('✗ Bundle não encontrado. Rode `npm run build` primeiro.');
  process.exit(1);
}

const bundleClasses = extractBundleClasses(fs.readFileSync(BUNDLE, 'utf8'));
const files = collectFiles(target);

if (files.length === 0) {
  console.error(`✗ Nenhum arquivo relevante encontrado em ${target}`);
  process.exit(1);
}

const usage = new Map(); // classe -> {count, files:Set, dynamic:boolean}
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const { found, dynamic } = extractClasses(src, bundleClasses);
  for (const [cls, count] of found) {
    if (!usage.has(cls)) usage.set(cls, { count: 0, files: new Set(), dynamic: false });
    const rec = usage.get(cls);
    rec.count += count;
    if (dynamic.has(cls)) rec.dynamic = true;
    if (rec.files.size < 5) rec.files.add(path.relative(target, file));
  }
}

const missing = [];
const found = [];
for (const [cls, info] of usage) {
  if (bundleClasses.has(cls)) found.push([cls, info]);
  else missing.push([cls, info]);
}

missing.sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]));
found.sort((a, b) => a[0].localeCompare(b[0]));

const fmt = (info) => `${info.count}x em ${[...info.files].join(', ')}${info.dynamic ? '  [expressao dinamica]' : ''}`;

console.log(`AHMAR Design — auditoria de uso`);
console.log(`App:    ${target}`);
console.log(`Bundle: ${path.relative(ROOT, BUNDLE)} (${bundleClasses.size} classes)`);
console.log(`Arquivos varridos: ${files.length}`);
console.log(`Classes usadas: ${usage.size}  |  encontradas: ${found.length}  |  ausentes: ${missing.length}`);
console.log('');

if (SHOW_ALL) {
  console.log('--- CLASSES ENCONTRADAS NA LIB ---');
  for (const [cls, info] of found) console.log(`  OK  ${cls}  (${fmt(info)})`);
  console.log('');
}

if (missing.length === 0) {
  console.log('OK  Nenhuma classe ausente.');
  process.exit(0);
}

console.log('--- CLASSES AUSENTES NA LIB ---');
for (const [cls, info] of missing) console.log(`  ??  ${cls}  (${fmt(info)})`);
console.log('');
console.log('Para cada ausente, decida:');
console.log('  - gap real da lib     -> estenda a escala generica correspondente');
console.log('  - classe do app       -> NAO entra na lib (canvas-*, mermaid-*, no-print, etc)');
console.log('  - artefato de parser  -> ja filtrado; se sobrou, refine isParserArtifact()');
console.log('');

process.exit(STRICT ? 1 : 0);
