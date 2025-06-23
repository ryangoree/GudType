# Gud TypeScale

[![GitHub](https://img.shields.io/badge/ryangoree%2Fgud--typescale-151b23?logo=github)](https://github.com/ryangoree/gud-typescale)
[![NPM
Version](https://img.shields.io/badge/%40gud%2Ftypescale-cb3837?logo=npm)](https://npmjs.com/package/@gud/typescale)
[![License:
Apache-2.0](https://img.shields.io/badge/License:%20MIT-23454d)](./LICENSE)

A type scale generator heavily inspired by the [Typographic Scale
Calculator](http://layoutgridcalculator.com/typographic-scale/) from [Jean-Lou
Désiré](http://www.jeanlou.net/).

## Installation

```bash
npm install --save-dev @gud/typescale
```

## CLI Usage

Generate CSS for use with Tailwind CSS v4 or any CSS framework:

```bash
# Basic usage
npx typescale

# Remote usage
npx @gud/typescale

# Custom hierarchy
npx typescale --hierarchy xs sm base lg xl 2xl 3xl 4xl 5xl 6xl

# Advanced usage
npx typescale \
  --hierarchy xs sm base lg xl 2xl 3xl 4xl 5xl 6xl \
  --multiplier 1.618 \
  --steps 4 \
  --unit px \
  --output ./typescale.css
```

### CLI Options

- `--help`: Show help information.
- `--hierarchy` (`-h`): Hierarchy of font styles to generate. (default:
  `footnote, caption, p, h6, h5, h4, h3, h2, h1`)
- `--base` (`-b`): Base font size. (default: `16`)
- `--baseIndex` (`-i`): Index of the base font size in the hierarchy. (default:
  `2`)
- `--multiplier` (`-m`): Increment multiplier. (default: `2`)
- `--steps` (`-s`): Steps between multiples. (default: `5`)
- `--round` (`-r`): Font size rounding factor. (default: `0.25`)
- `--roundDirection` (`-d`): Rounding method: up, down, nearest. (default: `up`)
- `--gridHeight` (`-g`): Line height grid size. (default: `8`)
- `--lineHeightMultiplier` (`-l`): Line height multiplier. (default: `1.3`)
- `--unit` (`-u`): CSS unit to append to font sizes and line heights. (default:
  `rem`)
- `--prefix` (`-p`): Prefix for utility classes.
- `--tailwind` (`-t`): Generate CSS with Tailwind CSS directives. (default: `false`)
- `--output` (`-o`): Output file path. (default: `typescale.css`)

## Integrating with Tailwind CSS v4

Since [Tailwind CSS](https://tailwindcss.com/) v4 no longer uses JavaScript
configuration files, use the CLI to generate CSS at build time:

1. **Add a generation script to your build process:**
   ```json
   {
     "scripts": {
       "generate:typescale": "typescale --tailwind --output src/typescale.css",
       "build": "npm run generate:typescale && <your-current-build-command>"
     }
   }
   ```

2. **Import in your CSS:**
   ```css
    /* src/index.css */
   @import "./typescale.css";
   ```

3. **Use the generated utilities:**
   ```html

   <h1 class="text-6xl">Large Heading</h1>
   <p class="text-base">Body text</p>
   <small class="text-xs">Small text</small>
   ```

With the `tailwind` flag enabled, the CLI generates `text` and `leading`
properties under the `@theme` directive for seamless integration with Tailwind
v4.


## Programmatic Usage

```js
import { gudTypeScale } from '@gud/typescale';

const typeScale = gudTypeScale();
// {
//   footnote: {
//     fontSize: 11.25,
//     lineHeight: 16,
//   },
//   caption: {
//     fontSize: 14,
//     lineHeight: 24,
//   },
//   p: {
//     fontSize: 16,
//     lineHeight: 24,
//   },
//   h6: {
//     fontSize: 18.5,
//     lineHeight: 32,
//   },
//   h5: {
//     fontSize: 23.25,
//     lineHeight: 32,
//   },
//   h4: {
//     fontSize: 30.75,
//     lineHeight: 40,
//   },
//   h3: {
//     fontSize: 42.25,
//     lineHeight: 56,
//   },
//   h2: {
//     fontSize: 60,
//     lineHeight: 80,
//   },
//   h1: {
//     fontSize: 88,
//     lineHeight: 120,
//   },
// }
```

## Options

### `hierarchy?: string[]`

The hierarchy of font styles to generate.

This is an array of strings representing the font styles in the order they
should be generated. The first item in the array will be the smallest font size,
and the last item will be the largest.

**Default**: `['footnote', 'caption', 'p', 'h6', 'h5', 'h4', 'h3', 'h2', 'h1']`

### `base?: number`


The base font size.

**Default**: `16`

### `multiplier?: number`


The increment multiplier.

**Default**: `2`

### `steps?: number`


The number steps it takes to go from one multiple to the next.

**Default**: `5`

### `round?: (size: number) => number`


The function used to round font sizes.

**Default**: `rounder(0.25, 'up')`


### `baseIndex?: number`

The index of the base font size in the hierarchy.

This is useful if you want some styles smaller than the base.

For example, if the hierarchy is `[footnote, body, ...]`, then the `baseIndex`
would be `1` to make the body font size the base font size.

**Default**: `0`

### `getScaleIndex?: (hierarchyIndex: number) => number`

A function to convert hierarchy indexes to scale indexes

#### Example

given the following hierarchy: `['body', 'h6', 'h5', 'h4', 'h3', 'h2', 'h1']`
and the following scale: `[12, 14, 16, 18.25, 21, 24, 27.75, 31.75, 36.5, 42,
48]` *(base: 12, multiplier: 2, steps: 5)*

A 1 to 1 fn of `(i) => i` would mean `"body"` *(hierarchy index 0)* would be
`12` *(scale index 0)*, and `"h1"` *(hierarchy index 6)* would be `27.75`
*(scale index 6)*.

Using `(i) => i * 1.5`, `"body"` *(hierarchy index 0)* would be `12` *(scale
index 0)*, and `"h1"` *(hierarchy index 6)* would be `42` *(scale index 9)*.

**Default**: `(i) => gudTypeScaleIndex(i)`

### `lineHeightMultiplier?: number`

The multiplier to use when deciding the line height of a given font size. The
resulting line height will be rounded up to the closest factor of the
`gridHeight`.

**Default**: `1.3`

### `unit?: TUnit`

An optional unit to add to the returned values. This will change the values from
numbers to strings. If provided a relative unit (`rem` or `em`), the font sizes
will be relative to the base font size.

**Default**: `undefined`