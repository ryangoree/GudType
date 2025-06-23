import { command } from 'clide-js';
import { writeFileSync } from 'fs';
import { gudTypeScale, rounder, type TypeScaleUnit } from '../index.js';

declare module 'clide-js' {
  interface OptionCustomTypeMap {
    roundDirection: 'up' | 'down' | 'nearest';
    unit: TypeScaleUnit;
  }
}

export default command({
  description: 'Generate a CSS type scale based on a hierarchy of font styles.',

  options: {
    hierarchy: {
      alias: ['h'],
      description: 'Hierarchy of font styles to generate.',
      type: 'array',
      default: ['footnote', 'caption', 'p', 'h6', 'h5', 'h4', 'h3', 'h2', 'h1'],
    },
    base: {
      alias: ['b'],
      description: 'Base font size.',
      type: 'number',
      default: 16,
    },
    baseIndex: {
      alias: ['i'],
      description: 'Index of the base font size in the hierarchy.',
      type: 'number',
      default: 2,
    },
    multiplier: {
      alias: ['m'],
      description: 'Increment multiplier.',
      type: 'number',
      default: 2,
    },
    steps: {
      alias: ['s'],
      description: 'Steps between multiples.',
      type: 'number',
      default: 5,
    },
    round: {
      alias: ['r'],
      description: 'Font size rounding factor.',
      type: 'number',
      default: '0.25',
    },
    roundDirection: {
      alias: ['d'],
      description: 'Rounding direction.',
      type: 'string',
      customType: 'roundDirection',
      choices: ['up', 'down', 'nearest'],
      default: 'up',
    },
    gridHeight: {
      alias: ['g'],
      description: 'Line height grid size.',
      type: 'number',
      default: 8,
    },
    lineHeightMultiplier: {
      alias: ['l'],
      description: 'Line height multiplier.',
      type: 'number',
      default: 1.3,
    },
    unit: {
      alias: ['u'],
      description: 'CSS unit to append to font sizes and line heights.',
      type: 'string',
      customType: 'unit',
      default: 'rem',
    },
    prefix: {
      alias: ['p'],
      description: 'Prefix for utility classes.',
      type: 'string',
    },
    output: {
      alias: ['o'],
      description: 'Output file path.',
      type: 'string',
      default: 'typescale.css',
      required: true,
    },
  },

  handler: async ({ options }) => {
    const hierarchy = await options.hierarchy();
    const base = await options.base();
    const baseIndex = await options.baseIndex();
    const multiplier = await options.multiplier();
    const steps = await options.steps();
    const round = await options.round();
    const roundDirection = await options.roundDirection();
    const gridHeight = await options.gridHeight();
    const lineHeightMultiplier = await options.lineHeightMultiplier();
    const unit = await options.unit();
    const prefix = await options.prefix();
    const output = await options.output();

    const typeScale = gudTypeScale({
      hierarchy,
      base,
      baseIndex,
      multiplier,
      steps,
      round: round ? rounder(round, roundDirection) : undefined,
      gridHeight,
      lineHeightMultiplier,
      unit,
    });

    let css = `/* Generated Gud TypeScale */\n:root {\n`;

    // Generate CSS custom properties
    Object.entries(typeScale).forEach(([key, value]) => {
      css += `  --font-size-${key}: ${value.fontSize};\n`;
      css += `  --line-height-${key}: ${value.lineHeight};\n`;
    });

    css += `}\n`;

    // Generate utility classes
    Object.entries(typeScale).forEach(([key]) => {
      css += `.${prefix ? prefix : ''}text-${key} {\n`;
      css += `  font-size: var(--font-size-${key});\n`;
      css += `  line-height: var(--line-height-${key});\n`;
      css += `}\n`;
      css += `.${prefix ? prefix : ''}leading-${key} {\n`;
      css += `  line-height: var(--line-height-${key});\n`;
      css += `}\n`;
    });

    writeFileSync(output, css, 'utf8');
    console.log(`✅ Type scale CSS generated and saved to ${output}`);
  },
});
