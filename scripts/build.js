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
  '2': '0.5rem',    // 8px
  '3': '0.75rem',   // 12px
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

// Generate CSS helper rules for a specific prefix
function generateRules(prefix = '') {
  let css = '';
  const p = prefix ? `${prefix}\\:` : '';

  // 1. Spacing (Margin & Padding)
  for (const [key, prop] of Object.entries(spacingKeys)) {
    for (const [valKey, valVal] of Object.entries(spacingValues)) {
      // Exclude margin: auto on sides that don't make sense or handle auto
      if (valKey === 'auto' && key.startsWith('p')) continue; // padding: auto is invalid
      
      const props = Array.isArray(prop) ? prop : [prop];
      const rules = props.map(pr => `${pr}: ${valVal} !important;`).join(' ');
      css += `.${p}${key}-${valKey} { ${rules} }\n`;
    }
  }

  // 2. Display
  displayValues.forEach(val => {
    const displayVal = val === 'hidden' ? 'none' : val;
    css += `.${p}${val} { display: ${displayVal} !important; }\n`;
  });

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
    css += `.${p}gap-${valKey} { gap: ${valVal} !important; }\n`;
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
