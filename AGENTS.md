# AGENTS.md

DaisyUI-style component library built in vanilla CSS. Docs (README.md) are in Portuguese.

## Build & run

- `npm run dev` — runs `node scripts/build.js` first, then Vite (default `http://localhost:5173`).
- `npm run build` — compiles the CSS only (no bundler, just concatenation + codegen). This is the ONLY verification step; there is no lint/typecheck/test setup.
- No vite config file exists; defaults apply. `index.html` is the docs/playground page, not an app entrypoint.

## `src/css/ahmardesign.css` is generated — never edit it

Build order: `variables.css` → `base.css` → `components.css` → `utilities.css` → generated utilities. `scripts/build.js:233` hardcodes this file list; adding a new source CSS file requires editing `build()` there too.

Generated utilities (all use `!important`): spacing (`p/m/px/...`), display, overflow, flex, grid (`grid-cols-N`, `col-span-N`), gap, typography (sizes, weights, align, tracking, leading, transforms), `bg-/text-/border-/divide-` colors, width/height (`w-*/h-*` incl. fractions `w-1/2`), min-height, min-width, max-width, max-height, position, inset (`top-*/right-*/bottom-*/left-*`), z-index, opacity, border widths (`border`, `border-t/r/b/l/x/y`, `border-N`), divide, float, white-space/`truncate`/`break-words`/`break-all`, transforms via native individual properties (`translate-*/scale-*/rotate-*`), `object-*`, `bg-transparent` — each repeated for every breakpoint prefix `sm:` `md:` `lg:` `xl:` `2xl:` (breakpoints at `build.js:10`).

To add/extend a utility, edit the maps in `scripts/build.js` (`spacingKeys`, `spacingValues`, `flexGrows`, `colors`, `widthValues`, `overflows`, `scales`, etc.), then re-run `npm run build`. Two escaping rules are mandatory or the CSS becomes invalid (breaks Vite/lightningcss minification):
- Breakpoint prefixes starting with a digit (`2xl`) are escaped via `escapeCssName` (`build.js:145`).
- Class-name value segments containing dots or slashes (fractional spacing `1.5`, fractional widths `1/2`) are escaped via `escapeCssValue` (`p-1.5` → `.p-1\.5`, `w-1/2` → `.w-1\/2`; an unescaped dot would parse as two classes, an unescaped slash is invalid — both fail minification). Keep this escaping on any `-${valKey}` interpolation when adding new maps with fractional keys.

## Theme tokens

- Color tokens are space-separated HSL **channels**, not full colors: `--p: 259 94% 51%`. Generated utilities and components wrap them as `hsl(var(--p))`. Never assign a full color value to a token.
- Adding a theme = add a `[data-theme="..."]` block in `variables.css` AND register the name in the `themes` array in `src/js/ahmardesign.js:10` (and in the `isDark` list there if it's dark, plus `color-scheme` in CSS).
- Theme is applied via `data-theme` attribute; the JS helper sets it on `<body>` and persists to `localStorage` key `ahmar-theme`.

## JS helper (`src/js/ahmardesign.js`)

IIFE exporting global `AHMAR`, auto-runs `AHMAR.init()` on load. Exposes `setTheme`, `toast`, `openModal`/`closeModal`, plus declarative behavior via `[data-theme-select]`, `[data-close-modal]`, `.collapse` (checkbox-free ones). No build step — used directly via `<script src="src/js/ahmardesign.js">`.

`init()` is idempotent and uses event delegation on `document` (guarded by `_themeSelectBound`/`_modalBound`/`_collapseBound` flags), so calling it again after an SPA mount is safe and picks up dynamically-rendered elements. Keep it that way when adding new bindings — prefer `document` delegation over per-element listeners.
