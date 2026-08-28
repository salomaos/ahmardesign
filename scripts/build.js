const fs = require('fs');
const path = require('path');

// Target directories and output paths
const srcDir = path.join(__dirname, '..', 'src', 'css');
const outputDir = path.join(__dirname, '..', 'src', 'css');
const outputPath = path.join(outputDir, 'ahmardesign.css');

// Theme breakpoints
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Utilities configuration to generate
const spacingKeys = {
  p: 'padding',
  px: ['padding-left', 'padding-right'],
  py: ['padding-top', 'padding-bottom'],
  pt: 'padding-top',
  pb: 'padding-bottom',
  pl: 'padding-left',
  pr: 'padding-right',
  m: 'margin',
  mx: ['margin-left', 'margin-right'],
  my: ['margin-top', 'margin-bottom'],
  mt: 'margin-top',
  mb: 'margin-bottom',
  ml: 'margin-left',
  mr: 'margin-right'
};

const spacingValues = {
  '0': '0px',
  '1': '0.25rem',   // 4px
  '1.5': '0.375rem', // 6px
  '2': '0.5rem',    // 8px
  '2.5': '0.625rem', // 10px
  '3': '0.75rem',   // 12px
  '3.5': '0.875rem', // 14px
  '4': '1rem',      // 16px
  '5': '1.25rem',   // 20px
  '6': '1.5rem',    // 24px
  '8': '2rem',      // 32px
  '10': '2.5rem',   // 40px
  '12': '3rem',     // 48px
  '16': '4rem',     // 64px
  '20': '5rem',     // 80px
  '24': '6rem',     // 96px
  'auto': 'auto'
};

const displayValues = ['block', 'inline-block', 'inline', 'flex', 'inline-flex', 'grid', 'inline-grid', 'hidden'];

const overflows = {
  'overflow-auto': 'auto',
  'overflow-hidden': 'hidden',
  'overflow-visible': 'visible',
  'overflow-scroll': 'scroll',
  'overflow-x-auto': 'auto',
  'overflow-y-auto': 'auto',
  'overflow-x-hidden': 'hidden',
  'overflow-y-hidden': 'hidden',
  'overflow-x-scroll': 'scroll',
  'overflow-y-scroll': 'scroll'
};

const flexDirections = {
  'flex-row': 'row',
  'flex-col': 'column',
  'flex-row-reverse': 'row-reverse',
  'flex-col-reverse': 'column-reverse'
};

const flexWraps = {
  'flex-wrap': 'wrap',
  'flex-nowrap': 'nowrap',
  'flex-wrap-reverse': 'wrap-reverse'
};

const flexAligns = {
  'items-start': 'flex-start',
  'items-center': 'center',
  'items-end': 'flex-end',
  'items-baseline': 'baseline',
  'items-stretch': 'stretch'
};

const flexJustifies = {
  'justify-start': 'flex-start',
  'justify-center': 'center',
  'justify-end': 'flex-end',
  'justify-between': 'space-between',
  'justify-around': 'space-around',
  'justify-evenly': 'space-evenly'
};

const flexGrows = {
  'flex-1': '1 1 0%',
  'flex-auto': '1 1 auto',
  'flex-initial': '0 1 auto',
  'flex-none': 'none',
  'grow': '1',
  'grow-0': '0',
  'shrink': '1',
  'shrink-0': '0'
};

const textSizes = {
  'text-xs': '0.75rem',
  'text-sm': '0.875rem',
  'text-base': '1rem',
  'text-lg': '1.125rem',
  'text-xl': '1.25rem',
  'text-2xl': '1.5rem',
  'text-3xl': '1.875rem',
  'text-4xl': '2.25rem',
  'text-5xl': '3rem',
  'text-6xl': '3.75rem'
};

const textWeights = {
  'font-thin': '100',
  'font-light': '300',
  'font-normal': '400',
  'font-medium': '500',
  'font-semibold': '600',
  'font-bold': '700',
  'font-extrabold': '800'
};

const textAlignments = ['left', 'center', 'right', 'justify'];

const colors = {
  'primary': 'var(--p)',
  'primary-content': 'var(--pc)',
  'secondary': 'var(--s)',
  'secondary-content': 'var(--sc)',
  'accent': 'var(--a)',
  'accent-content': 'var(--ac)',
  'neutral': 'var(--n)',
  'neutral-content': 'var(--nc)',
  'base-100': 'var(--b1)',
  'base-200': 'var(--b2)',
  'base-300': 'var(--b3)',
  'base-content': 'var(--bc)',
  'info': 'var(--in)',
  'info-content': 'var(--inc)',
  'success': 'var(--su)',
  'success-content': 'var(--suc)',
  'warning': 'var(--wa)',
  'warning-content': 'var(--wac)',
  'error': 'var(--er)',
  'error-content': 'var(--erc)'
};

// Escape a class name prefix so selectors stay valid CSS (e.g. `2xl` -> `\32 xl`).
function escapeCssName(name) {
  return /^[0-9]/.test(name) ? `\\${name.charCodeAt(0).toString(16)} ${name.slice(1)}` : name;
}

// Escape a value segment used inside a class name (e.g. `1.5` -> `1\.5`, `1/2` -> `1\/2`).
function escapeCssValue(name) {
  return name.replace(/[./]/g, (m) => `\\${m}`);
}

const widthValues = {
  '0': '0px', '1': '0.25rem', '2': '0.5rem', '3': '0.75rem', '4': '1rem',
  '5': '1.25rem', '6': '1.5rem', '7': '1.75rem', '8': '2rem', '10': '2.5rem', '12': '3rem',
  '14': '3.5rem', '16': '4rem', '20': '5rem', '24': '6rem', '32': '8rem', '40': '10rem',
  '48': '12rem', '52': '13rem', '56': '14rem', '64': '16rem', '72': '18rem', '96': '24rem',
  '1/2': '50%', '1/3': '33.333333%', '2/3': '66.666667%',
  '1/4': '25%', '2/4': '50%', '3/4': '75%',
  '1/5': '20%', '2/5': '40%', '3/5': '60%', '4/5': '80%',
  '1/6': '16.666667%', '2/6': '33.333333%', '3/6': '50%', '4/6': '66.666667%', '5/6': '83.333333%',
  'full': '100%', 'auto': 'auto', 'screen': '100vw'
};

const heightValues = {
  '0': '0px', '1': '0.25rem', '2': '0.5rem', '3': '0.75rem', '4': '1rem',
  '5': '1.25rem', '6': '1.5rem', '7': '1.75rem', '8': '2rem', '10': '2.5rem', '12': '3rem',
  '14': '3.5rem', '16': '4rem', '20': '5rem', '24': '6rem', '32': '8rem', '40': '10rem',
  '48': '12rem', '52': '13rem', '56': '14rem', '64': '16rem', '72': '18rem', '96': '24rem',
  '1/2': '50%', '1/3': '33.333333%', '2/3': '66.666667%',
  '1/4': '25%', '2/4': '50%', '3/4': '75%',
  'full': '100%', 'auto': 'auto', 'screen': '100vh'
};

const minHeightValues = {
  '0': '0px', '4': '1rem', '6': '1.5rem', '8': '2rem', '10': '2.5rem',
  '12': '3rem', '16': '4rem', '20': '5rem', '24': '6rem', '32': '8rem',
  '40': '10rem', '48': '12rem', '56': '14rem', '64': '16rem',
  'full': '100%', 'screen': '100vh'
};

const maxWidthValues = {
  'xs': '20rem', 'sm': '24rem', 'md': '28rem', 'lg': '32rem', 'xl': '36rem',
  '2xl': '42rem', '3xl': '48rem', '4xl': '56rem', '5xl': '64rem', '6xl': '72rem', '7xl': '80rem',
  'full': '100%', 'none': 'none'
};

const positionValues = {
  'static': 'static',
  'fixed': 'fixed',
  'absolute': 'absolute',
  'relative': 'relative',
  'sticky': 'sticky'
};

const insetSides = ['top', 'right', 'bottom', 'left'];

const zIndexValues = {
  '0': '0', '10': '10', '20': '20', '30': '30', '40': '40', '50': '50', 'auto': 'auto'
};

const opacityValues = {
  '0': '0', '5': '0.05', '10': '0.1', '15': '0.15', '20': '0.2', '25': '0.25',
  '30': '0.3', '40': '0.4', '50': '0.5', '60': '0.6', '70': '0.7', '75': '0.75',
  '80': '0.8', '90': '0.9', '95': '0.95', '100': '1'
};

const borderWidths = { '0': '0px', '2': '2px', '4': '4px', '8': '8px' };

const letterSpacings = {
  'tight': '-0.025em', 'normal': '0em', 'wide': '0.025em', 'wider': '0.05em', 'widest': '0.1em'
};

const lineHeights = {
  'none': '1', 'tight': '1.25', 'snug': '1.375', 'normal': '1.5', 'relaxed': '1.625', 'loose': '2'
};

const minWidthValues = {
  '0': '0px', 'full': '100%', 'min': 'min-content', 'max': 'max-content',
  'fit': 'fit-content', 'screen': '100vw'
};

const maxHeightValues = {
  '0': '0px', 'full': '100%', 'screen': '100vh'
};

const whitespaces = {
  'whitespace-normal': 'normal',
  'whitespace-nowrap': 'nowrap',
  'whitespace-pre': 'pre',
  'whitespace-pre-line': 'pre-line',
  'whitespace-pre-wrap': 'pre-wrap',
  'whitespace-break-spaces': 'break-spaces'
};

const scales = {
  '0': '0', '50': '0.5', '75': '0.75', '90': '0.9', '95': '0.95', '100': '1',
  '105': '1.05', '110': '1.1', '125': '1.25', '150': '1.5'
};

const rotates = {
  '0': '0deg', '1': '1deg', '2': '2deg', '3': '3deg', '6': '6deg',
  '12': '12deg', '45': '45deg', '90': '90deg', '180': '180deg'
};

const objectFits = {
  'object-contain': 'contain',
  'object-cover': 'cover',
  'object-fill': 'fill',
  'object-none': 'none',
  'object-scale-down': 'scale-down'
};

// Generate CSS helper rules for a specific prefix
function generateRules(prefix = '') {
  let css = '';
  const p = prefix ? `${escapeCssName(prefix)}\\:` : '';

  // 1. Spacing (Margin & Padding)
  for (const [key, prop] of Object.entries(spacingKeys)) {
    for (const [valKey, valVal] of Object.entries(spacingValues)) {
      // Exclude margin: auto on sides that don't make sense or handle auto
      if (valKey === 'auto' && key.startsWith('p')) continue; // padding: auto is invalid
      
      const props = Array.isArray(prop) ? prop : [prop];
      const rules = props.map(pr => `${pr}: ${valVal} !important;`).join(' ');
      css += `.${p}${key}-${escapeCssValue(valKey)} { ${rules} }\n`;
    }
  }

  // 2. Display
  displayValues.forEach(val => {
    const displayVal = val === 'hidden' ? 'none' : val;
    css += `.${p}${val} { display: ${displayVal} !important; }\n`;
  });

  // 2.5. Overflow (responsive variants; static base lives in utilities.css)
  for (const [key, val] of Object.entries(overflows)) {
    const prop = key.startsWith('overflow-x') ? 'overflow-x' : key.startsWith('overflow-y') ? 'overflow-y' : 'overflow';
    css += `.${p}${key} { ${prop}: ${val} !important; }\n`;
  }

  // 3. Flex Direction
  for (const [key, val] of Object.entries(flexDirections)) {
    css += `.${p}${key} { flex-direction: ${val} !important; }\n`;
  }

  // 4. Flex Wrap
  for (const [key, val] of Object.entries(flexWraps)) {
    css += `.${p}${key} { flex-wrap: ${val} !important; }\n`;
  }

  // 5. Align Items
  for (const [key, val] of Object.entries(flexAligns)) {
    css += `.${p}${key} { align-items: ${val} !important; }\n`;
  }

  // 6. Justify Content
  for (const [key, val] of Object.entries(flexJustifies)) {
    css += `.${p}${key} { justify-content: ${val} !important; }\n`;
  }

  // 7. Flex Grows/Shrinks
  for (const [key, val] of Object.entries(flexGrows)) {
    if (key.startsWith('flex-')) {
      css += `.${p}${key} { flex: ${val} !important; }\n`;
    } else if (key.startsWith('grow')) {
      css += `.${p}${key} { flex-grow: ${val} !important; }\n`;
    } else {
      css += `.${p}${key} { flex-shrink: ${val} !important; }\n`;
    }
  }

  // 8. Grid columns (1 to 12)
  for (let i = 1; i <= 12; i++) {
    css += `.${p}grid-cols-${i} { grid-template-columns: repeat(${i}, minmax(0, 1fr)) !important; }\n`;
    css += `.${p}col-span-${i} { grid-column: span ${i} / span ${i} !important; }\n`;
  }
  css += `.${p}col-span-auto { grid-column: auto !important; }\n`;
  css += `.${p}col-span-full { grid-column: 1 / -1 !important; }\n`;

  // 9. Gap (using spacing values)
  for (const [valKey, valVal] of Object.entries(spacingValues)) {
    if (valKey === 'auto') continue;
    css += `.${p}gap-${escapeCssValue(valKey)} { gap: ${valVal} !important; }\n`;
  }

  // 9.5. Vertical stack (space-y-N: margin-top between adjacent children)
  for (const [valKey, valVal] of Object.entries(spacingValues)) {
    if (valKey === 'auto') continue;
    css += `.${p}space-y-${escapeCssValue(valKey)} > * + * { margin-top: ${valVal} !important; }\n`;
  }

  // 10. Typography
  for (const [key, val] of Object.entries(textSizes)) {
    css += `.${p}${key} { font-size: ${val} !important; }\n`;
  }
  for (const [key, val] of Object.entries(textWeights)) {
    css += `.${p}${key} { font-weight: ${val} !important; }\n`;
  }
  textAlignments.forEach(align => {
    css += `.${p}text-${align} { text-align: ${align} !important; }\n`;
  });

  // 11. Colors (Background and Text)
  for (const [name, variable] of Object.entries(colors)) {
    css += `.${p}bg-${name} { background-color: hsl(${variable}) !important; }\n`;
    css += `.${p}text-${name} { color: hsl(${variable}) !important; }\n`;
    css += `.${p}border-${name} { border-color: hsl(${variable}) !important; }\n`;
  }

  // 12. Width & Height
  for (const [valKey, valVal] of Object.entries(widthValues)) {
    css += `.${p}w-${escapeCssValue(valKey)} { width: ${valVal} !important; }\n`;
  }
  for (const [valKey, valVal] of Object.entries(heightValues)) {
    css += `.${p}h-${escapeCssValue(valKey)} { height: ${valVal} !important; }\n`;
  }

  // 13. Min-height & Max-width
  for (const [valKey, valVal] of Object.entries(minHeightValues)) {
    css += `.${p}min-h-${escapeCssValue(valKey)} { min-height: ${valVal} !important; }\n`;
  }
  for (const [valKey, valVal] of Object.entries(maxWidthValues)) {
    css += `.${p}max-w-${escapeCssValue(valKey)} { max-width: ${valVal} !important; }\n`;
  }

  // 14. Position
  for (const [valKey, valVal] of Object.entries(positionValues)) {
    css += `.${p}${valKey} { position: ${valVal} !important; }\n`;
  }

  // 15. Inset (top / right / bottom / left)
  for (const side of insetSides) {
    for (const [valKey, valVal] of Object.entries(spacingValues)) {
      css += `.${p}${side}-${escapeCssValue(valKey)} { ${side}: ${valVal} !important; }\n`;
    }
  }

  // 16. Z-index
  for (const [valKey, valVal] of Object.entries(zIndexValues)) {
    css += `.${p}z-${valKey} { z-index: ${valVal} !important; }\n`;
  }

  // 17. Opacity
  for (const [valKey, valVal] of Object.entries(opacityValues)) {
    css += `.${p}opacity-${valKey} { opacity: ${valVal} !important; }\n`;
  }

  // 18. Border widths (color comes from `border-{color}` in section 11)
  css += `.${p}border { border-width: 1px; border-style: solid; }\n`;
  css += `.${p}border-none { border-style: none; border-width: 0px; }\n`;
  for (const [valKey, valVal] of Object.entries(borderWidths)) {
    css += `.${p}border-${valKey} { border-width: ${valVal}; border-style: solid; }\n`;
  }
  for (const side of ['t', 'r', 'b', 'l']) {
    css += `.${p}border-${side} { border-${side}-width: 1px; border-${side}-style: solid; }\n`;
  }
  css += `.${p}border-x { border-left-width: 1px; border-right-width: 1px; border-left-style: solid; border-right-style: solid; }\n`;
  css += `.${p}border-y { border-top-width: 1px; border-bottom-width: 1px; border-top-style: solid; border-bottom-style: solid; }\n`;
  css += `.${p}border-collapse { border-collapse: collapse; }\n`;

  // 19. Divide
  css += `.${p}divide-y > :not([hidden]) ~ :not([hidden]) { border-top-width: 1px; border-top-style: solid; }\n`;
  css += `.${p}divide-x > :not([hidden]) ~ :not([hidden]) { border-left-width: 1px; border-left-style: solid; }\n`;
  for (const [name, variable] of Object.entries(colors)) {
    css += `.${p}divide-${name} > :not([hidden]) ~ :not([hidden]) { border-color: hsl(${variable}) !important; }\n`;
  }

  // 20. Float
  css += `.${p}float-right { float: right; }\n`;
  css += `.${p}float-left { float: left; }\n`;
  css += `.${p}float-none { float: none; }\n`;

  // 21. Text transform
  css += `.${p}uppercase { text-transform: uppercase; }\n`;
  css += `.${p}lowercase { text-transform: lowercase; }\n`;
  css += `.${p}capitalize { text-transform: capitalize; }\n`;

  // 22. Letter spacing
  for (const [valKey, valVal] of Object.entries(letterSpacings)) {
    css += `.${p}tracking-${valKey} { letter-spacing: ${valVal} !important; }\n`;
  }

  // 23. Line height
  for (const [valKey, valVal] of Object.entries(lineHeights)) {
    css += `.${p}leading-${valKey} { line-height: ${valVal} !important; }\n`;
  }

  // 24. Transparent background
  css += `.${p}bg-transparent { background-color: transparent !important; }\n`;

  // 25. Min-width & Max-height
  for (const [valKey, valVal] of Object.entries(minWidthValues)) {
    css += `.${p}min-w-${escapeCssValue(valKey)} { min-width: ${valVal} !important; }\n`;
  }
  for (const [valKey, valVal] of Object.entries(maxHeightValues)) {
    css += `.${p}max-h-${escapeCssValue(valKey)} { max-height: ${valVal} !important; }\n`;
  }

  // 26. White-space + text wrapping/truncation
  for (const [key, val] of Object.entries(whitespaces)) {
    css += `.${p}${key} { white-space: ${val} !important; }\n`;
  }
  css += `.${p}truncate { overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important; }\n`;
  css += `.${p}break-words { overflow-wrap: break-word !important; }\n`;
  css += `.${p}break-all { word-break: break-all !important; }\n`;

  // 27. Transforms (native individual properties: translate / scale / rotate)
  for (const [valKey, valVal] of Object.entries(spacingValues)) {
    if (valKey === 'auto') continue;
    css += `.${p}translate-x-${escapeCssValue(valKey)} { translate: ${valVal} 0 !important; }\n`;
    css += `.${p}translate-y-${escapeCssValue(valKey)} { translate: 0 ${valVal} !important; }\n`;
  }
  for (const [valKey, valVal] of Object.entries(scales)) {
    css += `.${p}scale-${valKey} { scale: ${valVal} !important; }\n`;
  }
  for (const [valKey, valVal] of Object.entries(rotates)) {
    css += `.${p}rotate-${valKey} { rotate: ${valVal} !important; }\n`;
  }

  // 28. Object-fit
  for (const [key, val] of Object.entries(objectFits)) {
    css += `.${p}${key} { object-fit: ${val} !important; }\n`;
  }

  return css;
}

function build() {
  console.log('Starting AHMAR Design CSS Build...');
  
  // Read source files
  const variablesCSS = fs.readFileSync(path.join(srcDir, 'variables.css'), 'utf8');
  const baseCSS = fs.readFileSync(path.join(srcDir, 'base.css'), 'utf8');
  const componentsCSS = fs.readFileSync(path.join(srcDir, 'components.css'), 'utf8');
  const utilitiesCSS = fs.readFileSync(path.join(srcDir, 'utilities.css'), 'utf8');

  let combinedCSS = `/* AHMAR Design - Compiled Library */\n\n`;
  
  // Append static parts
  combinedCSS += `/* --- Themes & Variables --- */\n${variablesCSS}\n\n`;
  combinedCSS += `/* --- Reset & Baseline --- */\n${baseCSS}\n\n`;
  combinedCSS += `/* --- Components --- */\n${componentsCSS}\n\n`;
  combinedCSS += `/* --- Core Static Utilities --- */\n${utilitiesCSS}\n\n`;

  // Append dynamic standard utilities
  combinedCSS += `/* --- Dynamic Standard Utilities --- */\n`;
  combinedCSS += generateRules('');
  
  // Append dynamic responsive utilities grouped inside media queries
  combinedCSS += `\n/* --- Dynamic Responsive Utilities --- */\n`;
  for (const [breakpoint, width] of Object.entries(breakpoints)) {
    combinedCSS += `\n@media (min-width: ${width}) {\n`;
    const responsiveRules = generateRules(breakpoint);
    // Indent the rules for readability
    combinedCSS += responsiveRules.split('\n').map(line => line ? `  ${line}` : '').join('\n');
    combinedCSS += `}\n`;
  }

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write file
  fs.writeFileSync(outputPath, combinedCSS, 'utf8');
  console.log(`Successfully compiled CSS to: ${outputPath}`);
  console.log(`Bundle size: ${(combinedCSS.length / 1024).toFixed(2)} KB`);
}

// Run build
build();
