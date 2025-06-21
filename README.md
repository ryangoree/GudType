# Gud TypeScale

[![GitHub](https://img.shields.io/badge/ryangoree%2Fgud--typescale-151b23?logo=github)](https://github.com/ryangoree/gud-typescale)
[![NPM Version](https://img.shields.io/badge/%40gud%2Ftypescale-cb3837?logo=npm)](https://npmjs.com/package/@gud/typescale)
[![License: Apache-2.0](https://img.shields.io/badge/License:%20MIT-23454d)](./LICENSE)

A type scale generator heavily inspired by the
[Typographic Scale Calculator](http://layoutgridcalculator.com/typographic-scale/)
from [Jean-Lou Désiré](http://www.jeanlou.net/).

## Basic Usage

```js
const typeScale = gudTypeScale(
  ['footnote', 'caption', 'p', 'h6', 'h5', 'h4', 'h3', 'h2', 'h1'],
  { baseIndex: 2 }
);

console.log(typeScale)
// {
//   footnote: {
//     fontSize: 11.25,
//     lineHeight: 16,
//     relativeSize: 0.7031,
//   },
//   caption: {
//     fontSize: 14,
//     lineHeight: 24,
//     relativeSize: 0.875,
//   },
//   p: {
//     fontSize: 16,
//     lineHeight: 24,
//     relativeSize: 1,
//   },
//   h6: {
//     fontSize: 18.5,
//     lineHeight: 32,
//     relativeSize: 1.1563,
//   },
//   h5: {
//     fontSize: 23.25,
//     lineHeight: 32,
//     relativeSize: 1.4531,
//   },
//   h4: {
//     fontSize: 30.75,
//     lineHeight: 40,
//     relativeSize: 1.9219,
//   },
//   h3: {
//     fontSize: 42.25,
//     lineHeight: 56,
//     relativeSize: 2.6406,
//   },
//   h2: {
//     fontSize: 60,
//     lineHeight: 80,
//     relativeSize: 3.75,
//   },
//   h1: {
//     fontSize: 88,
//     lineHeight: 120,
//     relativeSize: 5.5,
//   },
// }
```

## Options

### `base?: number`


The starting point for the scale.

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

For example, if the hierarchy is `[footnote, body, ...]`, then the
`baseIndex` would be `1` to make the body font size the base font size.

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

The multiplier to use when deciding the line height of a given font size.
The resulting line height will be rounded up to the closest factor of the
`gridHeight`.

**Default**: `1.3`

### `unit?: TUnit`

An optional unit to add to the returned values. This will change the values
from numbers to strings.

**Default**: `undefined`
