# AHMAR Design

> **AHMAR Design** é uma biblioteca de componentes semânticos moderna, leve e premium construída inteiramente em **Vanilla CSS**, inspirada nos conceitos do Daisy UI. Ela permite criar interfaces responsivas e elegantes sem poluir o seu HTML com centenas de classes utilitárias, mantendo a flexibilidade e o controle do CSS puro.

---

## Funcionalidades Principais

- **Componentes Semânticos**: Botões, cards, modais, formulários, alertas, menus, breadcrumbs, etc., com classes legíveis (`.btn`, `.card`, `.modal`).
- **Sistema de Temas Dinâmico**: Suporte nativo a 10 temas prontos para uso (`light`, `dark`, `cupcake`, `retro`, `cyberpunk`, `synthwave`, `aqua`, `valentine`, `brutalist`, `brutalist-dark`) ativados via atributo `data-theme`.
- **Utilitários Gerados Dinamicamente**: Um script de build gera utilitários de espaçamento, cores, tipografia, grid, flexbox, dimensões, posicionamento, transformações e visibilidade de forma automatizada — todos com variantes responsivas.
- **Estados e pseudo-classes**: variantes `hover:` (cores, bordas, opacidade, decoração) e prefixos responsivos `sm:` `md:` `lg:` `xl:` `2xl:`.
- **Responsividade Out-of-the-Box**: Suporte a breakpoints com prefixos (ex: `md:flex-row`, `lg:grid-cols-4`, `2xl:w-1/2`).
- **Acessível por padrão**: anel de foco visível via `:focus-visible` e respeito a `prefers-reduced-motion` (tooltips/dropdowns também abrem por teclado).
- **Utilitários JavaScript**: Helper global `AHMAR` para controle de temas, exibição de modais programaticamente e criação de alertas Toast interativos.
- **Leve no fio**: ~49 KB gzip / ~19 KB brotli com 5.500+ classes (o `.css` fonte tem 403 KB porque não é minificado).

---

## Estrutura do Projeto

Abaixo está a organização dos diretórios do projeto:

```text
ahmardesign/
├── scripts/
│   ├── build.js            # Compila o CSS e gera as escalas dinâmicas de utilitários
│   └── audit-usage.mjs     # Audita quais classes de um app consumidor não existem no bundle
├── src/
│   ├── css/
│   │   ├── ahmardesign.css   # Arquivo final CSS compilado (gerado pelo build)
│   │   ├── base.css          # Reset de CSS básico e estilos base globais
│   │   ├── components.css    # Definições de componentes semânticos (.btn, .card, etc.)
│   │   ├── utilities.css     # Utilitários estáticos (sombras, bordas arredondadas, etc.)
│   │   └── variables.css     # Variáveis CSS e definições de tokens dos 10 temas
│   └── js/
│       └── ahmardesign.js    # Utilitários JavaScript helper (gerenciamento de temas, toasts, etc.)
├── index.html            # Playground e página de documentação interativa do projeto
├── AGENTS.md             # Regras de arquitetura e fluxo de trabalho para agentes/maintenedores
├── CHANGELOG.md          # Histórico de versões
├── package.json          # Configurações do npm e scripts de execução/build
└── README.md             # Documentação do projeto (este arquivo)
```

---

## Como Utilizar

### 1. Instalação das Dependências

Para rodar o ambiente de desenvolvimento, você precisará instalar as dependências do projeto (principalmente o Vite para servir a página de documentação):

```bash
npm install
```

### 2. Executando em Desenvolvimento

Para rodar o servidor de desenvolvimento com hot-reload automático do Vite e recompilação inicial do CSS:

```bash
npm run dev
```

O projeto estará disponível por padrão em `http://localhost:5173`.

### 3. Compilando o CSS para Produção

Para gerar uma nova versão compilada e otimizada do arquivo `ahmardesign.css` a partir dos arquivos fonte:

```bash
npm run build
```

Este script concatenará as variáveis de tema, a folha base de reset, os componentes semânticos, os utilitários estáticos e gerará os utilitários dinâmicos normais e responsivos.

> **Consumidores não precisam do `scripts/`.** A pasta `scripts/` e o `build.js` existem apenas para **manutenção da biblioteca** (regenerar `src/css/ahmardesign.css` quando um utilitário/token é adicionado ou alterado). Para usar a lib no seu projeto basta o arquivo compilado `src/css/ahmardesign.css` e, se precisar das interações dinâmicas, o `src/js/ahmardesign.js`. O `build.js` **não** é publicado no pacote npm.

---

## Como Integrar no seu HTML

Para utilizar o **AHMAR Design** em qualquer página HTML, basta importar o CSS compilado e o arquivo JavaScript (caso necessite de interações dinâmicas):

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Minha Aplicação</title>
  <!-- Link para o CSS compilado -->
  <link rel="stylesheet" href="src/css/ahmardesign.css">
</head>
<body data-theme="light">

  <div class="container py-8">
    <h1 class="text-3xl font-bold text-primary mb-4">Olá, AHMAR Design!</h1>
    
    <div class="card card-bordered p-6 mb-4">
      <h2 class="card-title">Título do Card</h2>
      <p class="opacity-80">Este é um exemplo simples de card com um botão semântico.</p>
      <div class="card-actions">
        <button class="btn btn-primary" onclick="AHMAR.toast('Sucesso!', 'success')">Clique-me</button>
      </div>
    </div>
  </div>

  <!-- Scripts Helpers -->
  <script src="src/js/ahmardesign.js"></script>
</body>
</html>
```

---

## Integração com Bundlers e Frameworks (Vite, Svelte, React, Next.js)

A biblioteca é **agnóstica de framework**: os componentes são CSS puro e o `AHMAR` usa apenas APIs do browser (eventos delegados no `document`, `localStorage`, `CustomEvent`), portanto não entra em conflito com a reatividade/estado do Svelte, React ou Vue.

### Importação via package exports

O `package.json` expõe o CSS e o JS através de subcaminhos (funciona com Vite e bundlers que respeitam o mapa de `exports`):

```js
import '@ahmartecnologias/ahmardesign/ahmardesign.css';
import '@ahmartecnologias/ahmardesign/ahmardesign.js'; // expõe window.AHMAR e já roda AHMAR.init()
```

### SPA: elementos renderizados dinamicamente

O `init()` é idempotente e os eventos são delegados no `document`, então componentes criados após o mount (ex.: `{#if}` no Svelte) já são cobertos sem re-binding:

```js
// Svelte: em onMount (opcional — init() já roda automaticamente no load)
import { onMount } from 'svelte';
onMount(() => AHMAR.init());
```

### ⚠️ SSR (SvelteKit / Next.js / Nuxt) — carregar só no cliente

O `ahmardesign.js` executa `AHMAR.init()` **imediatamente ao ser carregado**, e `init()` acessa `document.body` e `localStorage` — APIs que **não existem no servidor**. Em ambientes SSR, importe o JS **apenas no cliente**:

- **SvelteKit**: adicione `<script src="/path/ahmardesign.js"></script>` no `src/app.html` (fora do corpo renderizado por componente), **ou** importe dinamicamente dentro de `onMount`:

```js
// +page.svelte
import { onMount } from 'svelte';
onMount(async () => {
  await import('@ahmartecnologias/ahmardesign/ahmardesign.js');
});
```

- **Next.js**: use `import('@ahmartecnologias/ahmardesign/ahmardesign.js')` dentro de um `useEffect`, ou o componente `<Script>` com `strategy="afterInteractive"`.

O **CSS** pode (e deve) ser importado normalmente, mesmo no servidor — é só estilo.

### Sincronizando o tema com o estado do framework

Toda chamada a `AHMAR.setTheme()` dispara o evento customizado `ahmar-theme-change` no `window`. Use-o para manter o estado reativo do framework em sincronia:

```js
// Svelte
window.addEventListener('ahmar-theme-change', (e) => {
  currentTheme.set(e.detail.theme); // writable store
});
```

---

## Espaçamento entre Componentes

Os componentes **não possuem margem padrão** — o espaçamento é sempre responsabilidade de quem consome, de forma explícita e portável (sem resets em projetos). Use `gap` (flex/grid) ou a utilitária `.space-y-*`:

- **Linha**: `.flex items-center gap-2` (ou `gap-N` com qualquer medida do scale).
- **Coluna / stack**: `flex flex-col gap-3`, ou `.space-y-3` para empilhar **irmãos que não são flex** (ex.: parágrafos, blocos, campos soltos).
- **Grid**: `grid gap-4 grid-cols-*`.

```html
<!-- Linha: use gap -->
<div class="flex items-center gap-2">
  <button class="btn btn-primary">Salvar</button>
  <button class="btn btn-ghost">Cancelar</button>
</div>

<!-- Coluna flex: use gap -->
<form class="flex flex-col gap-3">
  <input class="input" placeholder="Nome">
  <input class="input" placeholder="E-mail">
  <textarea class="textarea" placeholder="Mensagem"></textarea>
  <button class="btn btn-primary btn-block">Enviar</button>
</form>

<!-- Irmãos não-flex (blocos): use space-y -->
<section class="space-y-4">
  <p>Primeiro parágrafo.</p>
  <p>Segundo parágrafo.</p>
  <div class="alert alert-info">Aviso.</div>
</section>
```

`.space-y-*` aplica `margin-top` entre irmãos diretamente adjacentes (`> * + *`), sem criar margem no primeiro nem no último elemento. Para listas sem marcador, use `.list-none`.

> Escolha sempre **um** mecanismo por container: `gap` **ou** `.space-y-*`, nunca os dois juntos — caso contrário o espaçamento soma (duplica).

---

## Mecanismo de Temas

A biblioteca utiliza variáveis CSS reativas. O tema é determinado pelo atributo `data-theme` na tag `body`.

### Temas Disponíveis:
- `light` (Padrão)
- `dark`
- `cupcake`
- `retro`
- `cyberpunk`
- `synthwave`
- `aqua`
- `valentine`
- `brutalist` (quadrado, preto e branco)
- `brutalist-dark` (quadrado, preto e branco, variante escura)

Para alterar o tema programaticamente via JS:
```javascript
AHMAR.setTheme('dark'); // Define o tema para dark e salva no localStorage
```

Toda troca de tema (via `AHMAR.setTheme` ou `[data-theme-select]`) dispara o evento customizado `ahmar-theme-change` no `window` com o tema em `detail.theme` — útil para sincronizar com o estado de frameworks:

```javascript
window.addEventListener('ahmar-theme-change', (e) => {
  console.log('Tema ativo:', e.detail.theme);
});
```

---

## API do Helper JavaScript (`AHMAR`)

O arquivo [ahmardesign.js](file:///c:/Users/salomaon/Documents/code/AHMAR/ahmardesign/src/js/ahmardesign.js) expõe um objeto global `AHMAR` no objeto `window` com as seguintes funcionalidades:

### 1. `AHMAR.setTheme(themeName)`
Altera o tema atual do documento e salva a escolha no `localStorage`.
- **Parâmetros:** `themeName` (String). Deve ser um dos temas válidos.

### 2. `AHMAR.toast(message, type, duration)`
Gera dinamicamente uma notificação Toast animada no canto inferior direito.
- **Parâmetros:**
  - `message` (String): A mensagem a ser exibida.
  - `type` (String, opcional): `'info'` (padrão), `'success'`, `'warning'`, `'error'`.
  - `duration` (Number, opcional): Duração em milissegundos (padrão: `3000`).

```javascript
AHMAR.toast('Operação realizada com sucesso!', 'success', 4000);
```

### 3. `AHMAR.openModal(id)` e `AHMAR.closeModal(id)`
Abre ou fecha um elemento de modal pelo seu `id`.
- **Parâmetros:** `id` (String): ID do elemento HTML do modal.

### 4. `AHMAR.init()`
Executado automaticamente no load do script. É **seguro e idempotente chamar de novo** — por isso pode (e deve) ser invocado após o mount em frameworks SPA (Svelte, React, Vue) quando elementos como `.collapse` (sem checkbox) são renderizados depois do load. A biblioteca usa delegação de eventos no `document`, então elementos criados dinamicamente já são cobertos sem re-binding manual:

```javascript
// Exemplo: dentro de onMount / useEffect
AHMAR.init();
```

---

## Resumo de Componentes Disponíveis

| Componente | Classe Base | Modificadores de Estilo / Cores | Modificadores de Tamanho / Forma |
| :--- | :--- | :--- | :--- |
| **Botões** | `.btn` | `.btn-primary`, `.btn-secondary`, `.btn-accent`, `.btn-neutral`, `.btn-info`, `.btn-success`, `.btn-warning`, `.btn-error`, `.btn-outline`, `.btn-ghost`, `.btn-link`, estado `:disabled` / `.btn-disabled` | `.btn-lg`, `.btn-sm`, `.btn-xs`, `.btn-wide`, `.btn-block`, `.btn-square`, `.btn-circle` |
| **Badges** | `.badge` | `.badge-primary`, `.badge-secondary`, `.badge-accent`, `.badge-neutral`, `.badge-info`, `.badge-success`, `.badge-warning`, `.badge-error`, `.badge-outline`, `.badge-ghost` | `.badge-lg`, `.badge-md`, `.badge-sm`, `.badge-xs` |
| **Cards** | `.card` | `.card-bordered`, `.card-side` (horizontal), `.card-compact` | `.card-body`, `.card-title`, `.card-actions` |
| **Alertas** | `.alert` | `.alert-info`, `.alert-success`, `.alert-warning`, `.alert-error` | Layout flexível para ícones e textos |
| **Formulários** | `.form-control`, `.label`, `.fieldset`, `.input`, `.textarea`, `.select`, `.checkbox`, `.radio`, `.toggle`, `.range`, `.file-input` | `.input-primary`, `.select-primary`, `.checkbox-primary`, `.radio-primary`, `.toggle-primary`, `.range-primary`, `.input-error`–`.input-success`–`.input-warning`–`.input-info` (também para textarea/select/file-input/checkbox/radio/toggle), `.fieldset-legend`, `.fieldset-label`, estado `:disabled` | `.input-bordered`, `.textarea-bordered`, `.select-bordered`, `.file-input-bordered`, `.input-xs`–`.input-lg`, `.select-xs`–`.select-lg`, `.file-input-xs`–`.file-input-lg`, `.radio-sm`, `.toggle-sm`, `.input-ghost`, `.textarea-ghost`, `.select-ghost`, `.file-input-ghost`, `.join`, `.join-vertical`, `.input-group`, `.input-group-vertical` |
| **Links** | `.link` | sublinhado semântico | — |
| **Navegação** | `.navbar`, `.menu`, `.tabs`, `.breadcrumbs` | `.menu-horizontal`, `.active`, `.tab-active`, `.tabs-bordered`, `.tabs-boxed` | Menus e abas responsivas e estilizadas |
| **Layout** | `.divider`, `.hero`, `.footer` | `.divider-horizontal`, `.footer-title` | Helpers para divisão, banners e rodapés |
| **Overlays** | `.dropdown`, `.modal`, `.tooltip`, `.collapse`, `.toast` | `.dropdown-end`, `.dropdown-top`, `.dropdown-left`, `.dropdown-right`, `.tooltip-top`, `.tooltip-bottom`, `.tooltip-left`, `.tooltip-right`, `.collapse-open`, `.modal-open` | Abrem via `:focus-within`, `:hover` ou checkbox (collapse/modal) |
| **Loading** | `.loading`, `.progress`, `.skeleton` | `.loading-primary`, `.loading-dots`, `.loading-bars`, `.loading-ball`, `.btn.loading`, `.progress-primary`, `.progress-indeterminate` | `.loading-xs`–`.loading-lg`, `.progress-xs`–`.progress-xl` |
| **Tabelas** | `.table` | `.table-zebra`, `.table-hover`, `.table-bordered`, `.table-pin-rows`, `.table-pin-cols` | `.table-xs`–`.table-lg` |
| **Avatar / Kbd / Indicator** | `.avatar`, `.kbd`, `.indicator` | `.avatar-placeholder`, `.avatar-online`, `.avatar-offline`, `.avatar-error`, `.avatar-group`, `.indicator-item`, `.indicator-start`–`.indicator-center`–`.indicator-end`, `.indicator-top`–`.indicator-middle`–`.indicator-bottom` | `.avatar-xs`–`.avatar-4xl`, `.kbd-xs`–`.kbd-lg` |

---

## Utilitários Dinâmicos e Breakpoints

O script de compilação gera automaticamente classes utilitárias para facilitar ajustes finos de layout. Todas as classes dinâmicas possuem suporte a variações responsivas utilizando os seguintes breakpoints prefixados:

- `sm:` (`@media (min-width: 640px)`)
- `md:` (`@media (min-width: 768px)`)
- `lg:` (`@media (min-width: 1024px)`)
- `xl:` (`@media (min-width: 1280px)`)
- `2xl:` (`@media (min-width: 1536px)`)

*Exemplo de uso:* `.flex-col md:flex-row` (coluna em telas pequenas, linha em telas médias e maiores).

### Famílias de utilitários

| Família | Exemplos |
| :--- | :--- |
| **Espaçamento** | `p-4`, `px-2`, `py-1.5`, `p-0.5`, `m-auto`, `mt-8`, `gap-4`, `space-y-4` |
| **Exibição & Layout** | `block`, `flex`, `grid`, `hidden`, `flex-row`, `items-center`, `justify-between`, `flex-1`, `grid-cols-12`, `col-span-4`, `list-none` |
| **Alinhamento de caixa** | `self-center`, `self-end`, `place-items-center`, `place-content-between`, `justify-items-start`, `justify-self-end` |
| **Dimensões** | `w-64`, `w-full`, `w-fit`, `w-1/2`, `w-screen`, `h-screen`, `min-h-36`, `min-h-screen`, `min-w-28`, `min-w-full`, `max-w-2xl`, `max-h-screen` |
| **Posicionamento** | `static`, `fixed`, `absolute`, `relative`, `sticky`, `top-0`, `top-16`, `-top-4`, `inset-4`, `-inset-2`, `z-50`, `float-right` |
| **Tipografia** | `text-sm`–`text-6xl`, `font-bold`, `font-sans`, `font-mono`, `text-center`, `tracking-tight`, `leading-none`, `uppercase`, `truncate`, `line-clamp-2`, `break-words`, `whitespace-nowrap` |
| **Estilo de texto** | `italic`, `not-italic`, `underline`, `line-through`, `no-underline`, `tabular-nums` |
| **Cores** | `bg-primary`, `text-base-200`, `border-info`, `border-t-primary`, `divide-y`, `divide-base-200`, `bg-transparent` |
| **Bordas** | `border`, `border-2`, `border-t`, `border-b-2`, `border-l-info`, `border-x`, `border-y`, `border-x-2`, `border-y-4`, `border-collapse` |
| **Estados `hover:`** | `hover:bg-primary`, `hover:text-error`, `hover:border-base-content`, `hover:bg-transparent`, `hover:underline`, `hover:border-2`, `hover:opacity-70` |
| **Efeitos** | `opacity-50`, `z-50`, `shadow-md`, `rounded-box`, `scale-95`, `translate-y-4`, `rotate-45`, `object-cover` |
| **Overflow** | `overflow-auto`, `overflow-x-hidden`, `overflow-y-auto` |

> Prefixos responsivos (`sm:` `md:` `lg:` `xl:` `2xl:`) valem para **todas** as
> famílias acima, exceto onde indicado o contrário (ex.: `shadow-*` e
> `rounded-*` são estáticos, em `utilities.css`).

### Como estender a lib (mantendo a lib genérica)

Duas regras evitam que a lib vire colecionadora de caso isolado:

1. **Escala, não caso isolado.** Antes de criar uma classe, verifique se ela
   pertence a uma escala existente e **estenda a escala** (o mapa em
   `scripts/build.js`) em vez de inventar nome. Faltou `min-w-24`? Adicione a
   chave `'24': '6rem'` em `minWidthValues` — nasce em todos os breakpoints.
2. **Nenhum nome de domínio.** A lib serve a qualquer projeto. Regras de
   negócio (`canvas-*`, `mermaid-*`, `editor-*`, `no-print`) são CSS do
   **app**, não da lib. Se o caso é genérico e falta, estenda a escala; se é
   específico, ele não entra.

O utilitário de escala nasce em `scripts/build.js` (config + loop); o
utilitário sem escala vai em `utilities.css`; componente/variante vai em
`components.css`; token novo vai em `variables.css` **replicado em todos os
10 temas**. Depois de qualquer mudança: `npm run build` e confira o diff do
bundle. Detalhes em [`AGENTS.md`](AGENTS.md).

### Auditando o uso da lib em um app consumidor

```bash
node scripts/audit-usage.mjs ../meu-app
```

Varre Svelte/HTML/JSX/TSX/Vue/Astro/JS/TS, extrai as classes dos literais e
das expressões (`class={cond ? 'a' : 'b'}`, `class:xyz={...}`) e reporta as
que **não existem** no bundle, já filtrando artefatos de parser. Serve para
responder "falta alguma coisa na lib?" sem caçar no CSS na mão.

Opções úteis: `--ext tsx,jsx` (só certaines extensões), `--ignore <regexes>`,
`--all` (lista também as encontradas) e `--strict` (sai com código 1 se
houver ausentes — bom para CI).

> O script é ferramenta de **manutenção**: `scripts/` não é publicado no pacote.

---

## Tecnologias Utilizadas

1. **Vanilla CSS** - Design flexível, moderno e modular sem frameworks pesados.
2. **Node.js** - Scripting de compilação customizado.
3. **Vite** - Servidor de desenvolvimento rápido e empacotador de assets.
