# AHMAR Design

> **AHMAR Design** é uma biblioteca de componentes semânticos moderna, leve e premium construída inteiramente em **Vanilla CSS**, inspirada nos conceitos do Daisy UI. Ela permite criar interfaces responsivas e elegantes sem poluir o seu HTML com centenas de classes utilitárias, mantendo a flexibilidade e o controle do CSS puro.

---

## Funcionalidades Principais

- **Componentes Semânticos**: Botões, cards, modais, formulários, alertas, menus, breadcrumbs, etc., com classes legíveis (`.btn`, `.card`, `.modal`).
- **Sistema de Temas Dinâmico**: Suporte nativo a 8 temas prontos para uso (`light`, `dark`, `cupcake`, `retro`, `cyberpunk`, `synthwave`, `aqua`, `valentine`) ativados via atributo `data-theme`.
- **Utilitários Gerados Dinamicamente**: Um script de build gera utilitários de espaçamento, cores, tipografia, grid, flexbox e visibilidade de forma automatizada.
- **Responsividade Out-of-the-Box**: Suporte a breakpoints com prefixos (ex: `md:flex-row`, `lg:grid-cols-4`).
- **Utilitários JavaScript**: Helper global `AHMAR` para controle de temas, exibição de modais programaticamente e criação de alertas Toast interativos.

---

## Estrutura do Projeto

Abaixo está a organização dos diretórios do projeto:

```text
ahmardesign/
├── scripts/
│   └── build.js          # Script Node.js que compila o CSS e gera utilitários dinâmicos
├── src/
│   ├── css/
│   │   ├── ahmardesign.css   # Arquivo final CSS compilado (gerado pelo build)
│   │   ├── base.css          # Reset de CSS básico e estilos base globais
│   │   ├── components.css    # Definições de componentes semânticos (.btn, .card, etc.)
│   │   ├── utilities.css     # Utilitários estáticos (sombras, bordas arredondadas, etc.)
│   │   └── variables.css     # Variáveis CSS e definições de tokens dos 8 temas
│   └── js/
│       └── ahmardesign.js    # Utilitários JavaScript helper (gerenciamento de temas, toasts, etc.)
├── index.html            # Playground e página de documentação interativa do projeto
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

Para alterar o tema programaticamente via JS:
```javascript
AHMAR.setTheme('dark'); // Define o tema para dark e salva no localStorage
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

---

## Resumo de Componentes Disponíveis

| Componente | Classe Base | Modificadores de Estilo / Cores | Modificadores de Tamanho / Forma |
| :--- | :--- | :--- | :--- |
| **Botões** | `.btn` | `.btn-primary`, `.btn-secondary`, `.btn-accent`, `.btn-neutral`, `.btn-info`, `.btn-success`, `.btn-warning`, `.btn-error`, `.btn-outline`, `.btn-ghost`, `.btn-link` | `.btn-lg`, `.btn-sm`, `.btn-xs`, `.btn-wide`, `.btn-block`, `.btn-square`, `.btn-circle` |
| **Badges** | `.badge` | `.badge-primary`, `.badge-secondary`, `.badge-accent`, `.badge-neutral`, `.badge-info`, `.badge-success`, `.badge-warning`, `.badge-error`, `.badge-outline` | `.badge-lg`, `.badge-md`, `.badge-sm`, `.badge-xs` |
| **Cards** | `.card` | `.card-bordered`, `.card-side` (layout horizontal) | Utiliza classes adicionais: `.card-body`, `.card-title`, `.card-actions` |
| **Alertas** | `.alert` | `.alert-info`, `.alert-success`, `.alert-warning`, `.alert-error` | Layout flexível para ícones e textos |
| **Formulários** | `.form-control` | `.input-primary`, `.select-primary`, `.checkbox-primary`, `.radio-primary`, `.toggle-primary` | `.input-bordered`, `.textarea-bordered`, `.select-bordered`, `.range` |
| **Navegação** | `.navbar`, `.menu`, `.tabs`, `.breadcrumbs` | `.menu-horizontal`, `.tab-active`, `.tabs-bordered`, `.tabs-boxed` | Menus e abas responsivas e estilizadas |
| **Layout** | `.divider`, `.hero`, `.footer` | `.divider-horizontal` | Helpers para divisão, banners e rodapés |
| **Overlays** | `.dropdown`, `.modal`, `.tooltip`, `.collapse`, `.toast` | `.dropdown-end`, `.dropdown-top`, `.tooltip-bottom`, `.tooltip-left`, `.tooltip-right`, `.collapse-open` | Elementos interativos baseados em CSS ou JS |

---

## Utilitários Dinâmicos e Breakpoints

O script de compilação gera automaticamente classes utilitárias para facilitar ajustes finos de layout. Todas as classes dinâmicas possuem suporte a variações responsivas utilizando os seguintes breakpoints prefixados:

- `sm:` (`@media (min-width: 640px)`)
- `md:` (`@media (min-width: 768px)`)
- `lg:` (`@media (min-width: 1024px)`)
- `xl:` (`@media (min-width: 1280px)`)
- `2xl:` (`@media (min-width: 1536px)`)

*Exemplo de uso:* `.flex-col md:flex-row` (coluna em telas pequenas, linha em telas médias e maiores).

---

## Tecnologias Utilizadas

1. **Vanilla CSS** - Design flexível, moderno e modular sem frameworks pesados.
2. **Node.js** - Scripting de compilação customizado.
3. **Vite** - Servidor de desenvolvimento rápido e empacotador de assets.
