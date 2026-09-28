# AGENTS.md

Lib de design system em **vanilla CSS** (`@ahmartecnologias/ahmardesign`), inspirada no DaisyUI. CSS puro, zero dependência de runtime, 10 temas.
Documentação (`README.md`), changelog e comentários do código são em **pt-BR**. Este arquivo também.

---

## 1. Arquitetura de arquivos

| Arquivo | Papel |
| :--- | :--- |
| `src/css/variables.css` | Tokens e temas (`[data-theme="..."]`). **Fonte única** de cor, raio, espaçamento, borda e animação. |
| `src/css/base.css` | Reset e baseline (elementos, `prefers-reduced-motion`, `focus-visible`). |
| `src/css/components.css` | Componentes semânticos (`.btn`, `.card`, `.input`, `.select`, `.alert`, `.table`, `.modal`…). |
| `src/css/utilities.css` | Utilitários **estáticos** escritos à mão (raio, cursor, sombra, lista, `container`, transitions). |
| `scripts/build.js` | Gerador das **escalas dinâmicas** de utilitários (spacing, cores, tamanhos, inset, responsivo, `hover:`). |
| `scripts/audit-usage.mjs` | Audita quais classes de um app consumidor não existem no bundle. |
| `src/css/ahmardesign.css` | **Bundle gerado.** Nunca editar à mão — só muda via `npm run build`. |
| `src/js/ahmardesign.js` | Helper JS opcional (tema, `AHMAR.toast`, modais, `init()`), só cliente. |
| `index.html` | Playground/docs. Não é entrypoint de app. |

Ordem do bundle: `variables.css` → `base.css` → `components.css` → `utilities.css` → utilitários dinâmicos → utilitários `hover:` → variantes responsivas. A lista é **hardcoded** em `build()` (`scripts/build.js`): criar um novo `.css` fonte exige editar essa função também.

## 2. Onde mexer para cada tipo de mudança

| Mudança | Onde |
| :--- | :--- |
| Utilitário de **escala** (`p-4`, `inset-2`, `border-t-2`, `w-fit`, `text-3xl`, `hover:*`) | config + loop em `scripts/build.js` (`generateRules`, `generateHoverRules`) |
| Utilitário **estático** sem escala (`shadow-md`, `rounded-box`, `cursor-pointer`) | `src/css/utilities.css` |
| Componente, variante ou tamanho (`.select-ghost`, `.btn-outline`, `.table-bordered`) | `src/css/components.css` |
| Token ou ajuste de tema | `src/css/variables.css`, **replicado em todos os 10 temas** |
| Comportamento JS | `src/js/ahmardesign.js` |
| **Documentação** de qualquer utilitário novo | `README.md` (tabelas) + `CHANGELOG.md` |

Utilitários gerados (todos com `!important`): spacing (`p/m/px/mx/...`), display, overflow, flex (direction/wrap/items/justify/grow/shrink), grid (`grid-cols-N`, `col-span-N`), `gap-*`, `space-y-*`, tipografia (tamanhos, pesos, alinhamento, `font-sans/mono`, itálico, decoração, `tracking-*`, `leading-*`, `line-clamp-*`), `bg-/text-/border-/divide-` (cores, incluindo por lado: `border-t-primary`), `w-*`/`h-*` (inclusive frações `w-1/2`, `w-fit`), `min-h-*`, `min-w-*`, `max-w-*`, `max-h-*`, position, inset (`top-*/right-*/bottom-*/left-*/inset-*` e negativos `-top-4`), z-index, opacity, bordas (`border`, `border-0|2|4|8`, `border-t/r/b/l`, `border-t-2`, `border-x`, `border-x-2`, `border-y`, `border-y-4`, `border-collapse`), divide, float, transformações via propriedades nativas (`translate-*`, `scale-*`, `rotate-*`), `object-*`, white-space/`truncate`/`break-words`/`break-all`, `bg-transparent` — **tudo repetido** para os prefixes `sm:` `md:` `lg:` `xl:` `2xl:` (`breakpoints` no topo do `build.js`).

> Cor por borda composta (`border-x-primary`) foi **omitida de propósito**: as 2×18 cores custam ~3 KB gzip e o efeito se obtém com `border-l-primary border-r-primary`. Antes de adicionar uma escala cara assim, meça o delta de gzip.

## 3. Regras inegociáveis de CSS

1. **Nunca hardcodar o que o tema controla.** Cor → `hsl(var(--p))` / `hsla(var(--bc) / 0.15)`. Raio → `var(--rounded-box|--rounded-btn|--rounded-badge)` (temas quadrados como `brutalist` são `0px`). Transição → `var(--animation-input)` / `var(--animation-btn)` quando existir. `#hex`/`rgb()` é proibido em regra de componente, com **duas exceções já decididas**:
   - o data-URI do check do `.checkbox:checked` (ícone precisa de contraste fixo sobre `--p`);
   - `rgba(0,0,0,…)` em `box-shadow` e no backdrop do `.modal` (`.card`, `.navbar`, `.tabs-boxed .tab-active`, `.dropdown-content`, `.modal-box`, `.shadow-*`). Decisão explícita: igual ao DaisyUI, vale o custo de sombra preta em tema escuro para não multiplicar tokens pelos 10 temas. **Não "conserte" isso sem pedido** — se virar prioridade, é 1.3.0 com validação visual nos 10 temas.
2. **Semântica DaisyUI/Tailwind e ordem previsível de modificadores**: `btn btn-sm btn-primary btn-ghost` (base → tamanho → cor → forma). Estados sempre completos: `hover`, `focus-visible`, `disabled`, `aria-*`.
3. **Componentes não têm margem padrão.** Espaçamento é do consumidor: `gap-*` ou `space-y-*`.
4. **Toda classe gerada leva `!important`** (padrão Tailwind). Manter.
5. **Não remover nem renomear classe existente** — isso é breaking = major. Só acrescentar.
6. **Toda classe nova entra na documentação** (`README.md` + `CHANGELOG.md`).

### Escala, não caso isolado

Regra de ouro: antes de criar uma classe, verifique se ela pertence a uma escala existente e **estenda a escala** em vez de inventar nome. Faltou `min-w-24`? Acrescente `'24': '6rem'` em `minWidthValues` — nasce inclusive em todos os breakpoints. Uma classe que serve a um caso só (`bloco-correta`, `canvas-titulo`) não pertence à lib.

### Proibição de classe de domínio

A lib serve a **qualquer** projeto. Nada de nome de domínio do consumidor: `canvas-*`, `mermaid-*`, `apostila-*`, `bloco-*`, `editor-*`, `no-print`, `modo-visualizacao`. Se o app precisa, é CSS do app. Solo **artefatos de parser** (`:`, `bloco.correta`) e classes locais do app são esperados na saída do `audit-usage.mjs`; qualquer outra ausente é gap real da escala genérica.

### Escapamento obrigatório no gerador

Duas regras; ignorá-las gera CSS inválido (quebra a minificação do Vite/lightningcss):

- Prefixo de breakpoint que começa com dígito (`2xl`) → `escapeCssName` (no `build.js`).
- Segmento de valor com ponto ou barra (`1.5`, `1/2`) → `escapeCssValue` (`p-1.5` → `.p-1\.5`, `w-1/2` → `.w-1\/2`; ponto não escapado vira duas classes, barra solta é inválido). Manter o escape em **qualquer** interpolação `-${valKey}` ao adicionar mapa com chave fracionária.

## 4. Tokens de tema

- Tokens de cor são **canais HSL separados por espaço**, não cor completa: `--p: 259 94% 51%`. Utilitários e componentes embrulham em `hsl(var(--p))`. Nunca atribuir cor completa a um token.
- Novo tema = bloco `[data-theme="..."]` em `variables.css` **e** registro no array `themes` em `src/js/ahmardesign.js`, mais a lista `isDark` (se escuro) e `color-scheme` no CSS.
- O tema é aplicado via atributo `data-theme`; o JS grava em `<body>` e persiste em `localStorage` na chave `ahmar-theme`.

## 5. Helper JS (`src/js/ahmardesign.js`)

IIFE que expõe o global `AHMAR` e roda `AHMAR.init()` no load. API: `setTheme`, `toast`, `openModal`/`closeModal`, `init`, mais comportamento declarativo via `[data-theme-select]`, `[data-close-modal]`, `.collapse` (sem checkbox). Sem build step — consumido como `<script src=".../ahmardesign.js">`.

`init()` é **idempotente** e usa delegação de evento no `document` (guardada por `_themeSelectBound`/`_modalBound`/`_collapseBound`), então chamar de novo após mount de SPA é seguro e pega elementos renderizados depois. Ao adicionar binding, mantenha a delegação no `document` em vez de listener por elemento. O script toca `document.body` e `localStorage` — em SSR importe só no cliente.

## 6. Fluxo de validação (antes de dizer "pronto")

1. `npm run build` sem erro. Esta é a **única** verificação automatizada — não há lint/typecheck/test na lib.
2. `git diff --stat` deve tocar apenas `scripts/build.js`, `scripts/audit-usage.mjs`, `src/css/*.css` (fonte **e** bundle), `src/js/ahmardesign.js`, `README.md`, `CHANGELOG.md`, `AGENTS.md` e `package.json` (só `version`).
3. `grep` no `src/css/ahmardesign.css` confirmando **cada** classe nova presente (fonte e bundle são o mesmo arquivo concatenated — confira as duas camadas).
4. Nenhum `--p`/`--bc`/`--rounded-*` hardcoded fora de `variables.css`; nenhum `#hex`/`rgb()` em regra de componente (exceção: data-URI de ícone, e mesmo assim preferir token).
5. Zero classe duplicada no bundle.
6. Se tocou JS: `node --check src/js/ahmardesign.js`.
7. `git diff --check` sem erro (ignorar avisos de LF/CRLF).
8. Cobertura: `node scripts/audit-usage.mjs <app-consumidor>` e confirme que as ausentes são só artefatos de parser e classes do app.

## 7. Tamanho do bundle (referência)

`.css` fonte ≈ 403 KB (não minificado, 5.500+ classes) → minificado 332 KB → **gzip 49,3 KB** → brotli 18,6 KB. O número que importa é o gzip. As variantes responsivas (~5 dos ~6.300 rules) são mantidas de propósito: removê-las quebraria consumidores silenciosamente e economizaria pouco sobre o gzip.

## 8. Limites de escopo

- **Não commitar, não dar push, não publicar (`npm publish`)** sem "ok" explícito do responsável.
- **Não editar apps consumidores** (ex.: `../mcurso`) — só a lib. Leitura para auditoria é ok.
- `scripts/` é ferramenta de manutenção e **não é publicado** no pacote npm (o consumidor recebe só `src/css/ahmardesign.css`, `src/js/ahmardesign.js`, README e LICENSE).
- Sem dependência de runtime: nada de Tailwind, DaisyUI ou qualquer lib.
