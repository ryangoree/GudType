# Gud Type

A type scale generator heavily inspired by the
[Typographic Scale Calculator](http://layoutgridcalculator.com/typographic-scale/)
from [Jean-Lou Désiré](http://www.jeanlou.net/).

## Basic Usage

```js
const typeScale = gudTypeScale(
  [
    'footnote',
    'caption',
    'p',
    'h6',
    'h5',
    'h4',
    'h3',
    'h2',
    'h1',
  ],
  { baseIndex: 2, unit: 'px' },
)

console.log(typeScale)
// {
//   footnote: {
//     fontSize: '12.25px',
//     lineHeight: '16px',
//   },
//   caption: {
//     fontSize: '14px',
//     lineHeight: '24px',
//   },
//   p: {
//     fontSize: '16px',
//     lineHeight: '24px',
//   },
//   h6: {
//     fontSize: '18.5px',
//     lineHeight: '32px',
//   },
//   h5: {
//     fontSize: '21.25px',
//     lineHeight: '32px',
//   },
//   h4: {
//     fontSize: '24.5px',
//     lineHeight: '32px',
//   },
//   h3: {
//     fontSize: '32px',
//     lineHeight: '48px',
//   },
//   h2: {
//     fontSize: '48.75px',
//     lineHeight: '64px',
//   },
//   h1: {
//     fontSize: '97.25px',
//     lineHeight: '128px',
//   },
// }
```

### Using [Tailwind CSS](https://tailwindcss.com/)

```js
const { gudTypeScale } = require('gud-type')

const typeScale = gudTypeScale(
  [
    'footnote',
    'caption',
    'p',
    'h6',
    'h5',
    'h4',
    'h3',
    'h2',
    'h1',
  ],
  { baseIndex: 3, unit: 'px' }
)

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontSize: {
        footnote: typeScale.footnote.fontSize,
        caption: typeScale.caption.fontSize,
        p: typeScale.p.fontSize,
        h6: typeScale.h6.fontSize,
        h5: typeScale.h5.fontSize,
        h4: typeScale.h4.fontSize,
        h3: typeScale.h3.fontSize,
        h2: typeScale.h2.fontSize,
        h1: typeScale.h1.fontSize,
      },
      lineHeight: {
        footnote: typeScale.footnote.lineHeight,
        caption: typeScale.caption.lineHeight,
        p: typeScale.p.lineHeight,
        h6: typeScale.h6.lineHeight,
        h5: typeScale.h5.lineHeight,
        h4: typeScale.h4.lineHeight,
        h3: typeScale.h3.lineHeight,
        h2: typeScale.h2.lineHeight,
        h1: typeScale.h1.lineHeight,
      },
    },
  },
  plugins: [],
}
```

### Using [Styled Components](https://styled-components.com/)

```js
import { gudTypeScale } from 'gud-type'
import styled from 'styled-components'

const styles = gudTypeScale(
  [
    'footnote',
    'caption',
    'p',
    'h6',
    'h5',
    'h4',
    'h3',
    'h2',
    'h1',
  ],
  { baseIndex: 3, unit: 'px' },
)

export const Footnote = styled.p(styles.footnote)
export const Caption = styled.p(styles.caption)
export const P = styled.p(styles.p)
export const H6 = styled.h6(styles.h6)
export const H5 = styled.h5(styles.h5)
export const H4 = styled.h4(styles.h4)
export const H3 = styled.h3(styles.h3)
export const H2 = styled.h2(styles.h2)
export const H1 = styled.h1(styles.h1)
```

## Options

```ts
interface GenerateTypeScaleOptions {
  /**
   * The starting point for the scale.
   * @default 16
   */
  base?: number

  /**
   * The increment multiplier.
   * @default 2
   */
  multiplier?: number

  /**
   * The number steps it takes to go from one multiple to the next.
   * @default 5
   */
  steps?: number

  /**
   * The function used to round font sizes.
   * @default rounder(0.25, 'up')
   */
  round?: (size: number) => number

  /**
   * The multiplier to use when deciding the line height of a given font size.
   * The resulting line height will be rounded up to the closest factor of the
   * `gridHeight`.
   * @default 1.3
   */
  lineHeightMultiplier?: number

  /**
   * The desired grid height which will be used to round the line heights.
   * @default 8
   */
  gridHeight?: number

  /**
   * An optional unit to add to the returned values. This will change the values
   * from numbers to strings and is useful when passed directly to a CSS in JS
   * library like [styled-components](https://github.com/styled-components/styled-components).
   * @default undefined
   */
  unit?: string

  /**
   * The index of the base font size in the hierarchy.
   *
   * This is useful if you want some styles smaller than the base.
   *
   * For example, if the hierarchy is `[footnote, body, ...]`, then the
   * `baseIndex` would be `1` to make the body font size the base font size.
   *
   * @default 0
   */
  baseIndex?: number;

  /**
   * A function to convert hierarchy indexes to scale indexes
   *
   * **Example**
   *
   * given the following hierarchy:
   * `[body, bodyLarge, h6, h5, h4, h3, h2, h1]`
   *
   * and the following scale *(base: 16, multiplier: 2, steps: 4)*:
   * `[12, 15, 18, 21, 24, 30, 36, 42, 48, 56, 64, 80, 96, 120]`
   *
   * A 1 to 1 fn of `(i) => i` would mean body *(hierarchy index 0)* would be 12
   * *(scale index 0)*, and h1 *(hierarchy index 7)* would be 42
   * *(scale index 7)*.
   *
   * Using the fibonacci sequence, `(i) => fibonacci(i)`,
   * body *(hierarchy index 0)* would be 12 *(scale index 0)*, and h1
   * *(hierarchy index 7)* would be 120 *(scale index 13)*.
   * @default fibonacci
   */
  getScaleIndex?: (hierarchyIndex: number) => number
}
```
