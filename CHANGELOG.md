# Changelog

Todas as mudanças relevantes da lib `@ahmartecnologias/ahmardesign`.
O versionamento segue [SemVer](https://semver.org/lang/pt-BR/): nada de remover
ou renomear classe existente sem breaking change (major).

## [1.2.0] — 2026-09-25

Feature compatível (minor): completa escalas de utilitários e fecha gaps de
componentes pedidos por apps consumidores. **Nenhuma classe existente foi
removida ou renomeada.**

### Componentes

| Classe | Descrição |
| :--- | :--- |
| `.select-ghost` | Select transparente (fundo/borda) mantendo a seta — usado por seletores de tema. |
| `.input-ghost`, `.textarea-ghost`, `.file-input-ghost` | Completa a família `ghost` de campos, alinhada a `.btn-ghost` / `.badge-ghost`. |
| `.input-xs` / `.input-sm` / `.input-md` / `.input-lg` | Escala de tamanho que faltava nos inputs (antes só existia o tamanho padrão). |
| `.radio-sm` | Radio compacto (1.125rem). |
| `.toggle-sm` | Toggle compacto. |
| `.badge-ghost` | Badge transparente com cor temática. |
| `.table-bordered` | Borda vertical + horizontal em todas as células. |

### Seta do `.select` — corrigida para temas escuros

O `data-URI` do caret usava `stroke='%23666'`, invisível nos temas escuros.
Substituído por **dois gradientes CSS puros usando `currentColor`** (nenhum
hex, nenhum `mask`, nenhum pseudo-elemento — `<select>` não renderiza
`::before`/`::after`). A seta agora segue `--bc` nos 10 temas, inclusive em
`brutalist`/`brutalist-dark`, onde o raio do campo é `0`.

Efeito colateral: o `padding-right` do `.select` aumentou (1rem → 2.25rem) para
abrigar a seta, e os tamanhos `-xs`–`-lg` foram reajustados na mesma proporção.
Não há quebra de API — apenas o recuo interno do texto.

### Correções

- `.btn-outline:hover` sem modificador de cor caía em `color: #fff` (branco),
  ficando invisível em temas claros. Agora o fallback é `hsl(var(--bc))`.
- `scripts/audit-usage.mjs`: o extrator de classes do bundle quebrava no escape
  CSS `\32 xl` (prefixo `2xl:`), o que fazia utilitários `2xl:*` serem
  reportados como inexistentes e media como `0.5rem` serem lidas como classe.

### Decidido: sombra e overlay continuam com preto translúcido

As 6 regras de componente que usam `rgba(0,0,0,…)` — `.card`, `.navbar`,
`.tabs-boxed .tab-active`, `.dropdown-content`, `.modal` (backdrop) e
`.modal-box` — mais as 6 classes `shadow-*` de `utilities.css` **mantêm preto
translúcido em vez de token de tema**, por decisão explícita.

Motivo: é o que o DaisyUI faz, e a contrapartida (sombra preta tem pouco
contraste em tema escuro) custa 2–3 tokens novos replicados em 10 temas para um
ganho de profundidade que nenhum consumidor pediu. O caso realmente visível
desse grupo — o backdrop do modal — funciona igual em qualquer tema, porque
escurecer com preto é independente do tema.

Se um dia isso virar prioridade, é **1.3.0** (mudança visual em 6 componentes
para todos os consumidores), com validação visual nos 10 temas.

### Utilitários novos (gerados por `scripts/build.js`)

- **Espaçamento**: escala `0.5` (2px) — `p-0.5`, `gap-0.5`, `space-y-0.5`, `top-0.5`…
- **Inset negativo e shorthand**: `-top-4`, `-left-2`, `inset-4`, `-inset-2`
- **Bordas por lado e cor por lado**: `border-t-2`, `border-b-0`, `border-l-4`, `border-t-primary`, `border-x-info`
- **Borda composta por espessura**: `border-x-2`, `border-y-4`, `border-x-0`
  (a cor composta `border-x-primary` foi deliberadamente **omitida**: custa
  ~3 KB gzip e se expressa por `border-l-primary border-r-primary`)
- **Largura**: `w-fit` (`fit-content`)
- **Altura mínima**: `min-h-36`
- **Largura mínima**: `min-w-12`, `min-w-20`, `min-w-28`, `min-w-36`, `min-w-48`, `min-w-64`
- **Alinhamento de caixa**: `self-auto|start|center|end|stretch`, `place-items-*`,
  `place-content-*`, `justify-items-*`, `justify-self-*`
- **Tipografia**: `font-sans`, `font-mono`, `italic`, `not-italic`, `underline`,
  `line-through`, `no-underline`, `tabular-nums`, `line-clamp-1`–`line-clamp-6`
- **Estados `hover:`**: cores (`bg-`, `text-`, `border-`), `underline`,
  `no-underline`, `bg-transparent`, espessuras (`border-0|2|4|8`) e `opacity-0`–`opacity-100`

### Base

- `prefers-reduced-motion`: o override de `transition-duration` agora exclui
  `svg` e descendentes. Bibliotecas de diagrama que usam transição para medir
  labels (ex.: Mermaid) infilavam a layout ao ter toda transição zerada.

### Ferramentas

- **`scripts/audit-usage.mjs`**: novo script que extrai as classes usadas em
  qualquer app consumidor (inclusive `class:xyz={}` e literais dentro de
  `class={...}`) e reporta as que não existem no bundle, ignorando artefatos de
  parser e valores arbitrários. Deixa a lib auto-verificável por qualquer
  consumidor:

  ```bash
  node scripts/audit-usage.mjs ../mcurso
  node scripts/audit-usage.mjs ../app-react --ext tsx,jsx --strict
  ```

  Nada disso vai para o pacote npm — o consumidor só precisa do CSS e do JS.

### Tamanho do bundle

| Métrica | Tamanho |
| :--- | ---: |
| `ahmardesign.css` fonte (o que o build gera) | 403 KB |
| minificado | 332 KB |
| minificado + gzip | **49,3 KB** |
| minificado + brotli | 18,6 KB |

O número de 403 KB é o arquivo **não minificado** com 5.509 classes. O que
trafega em produção é o gzip (≈49 KB). As variantes responsivas (~5 dos ~6.300
rules) foram mantidas: cortá-las quebraria consumidores silenciosamente e
economizaria pouco sobre o gzip. Onde a adição de uma escala inteira era
caramente cara, ela foi **não** adicionada (ver `border-x-<cor>` acima).

## [1.1.1] — 2026-09-20

Patch sem mudança de CSS. Correção de metadados de publicação (`package-lock`
e `version` do pacote).

## [1.1.0]

Ajuste de espaçamentos e padrões visuais. Sem changelog publicado até esta
versão — consulte o histórico do git para o detalhamento.
