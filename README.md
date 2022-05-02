# Gud Type

A type scale generator heavily inspired by the
[Typographic Scale Calculator](http://layoutgridcalculator.com/typographic-scale/)
from [Jean-Lou Désiré](http://www.jeanlou.net/).

## Example (using [styled-components](https://github.com/styled-components/styled-components))

```jsx
import { gudTypeScale } from 'gud-type'
import styled from 'styled-components'

const styles = gudTypeScale(
  [
    'footnote',
    'endnote',
    'caption',
    'p',
    'blockquote',
    'h6',
    'h5',
    'h4',
    'h3',
    'h2',
    'h1',
  ],
  { startingIndex: -3, unit: 'px' },
)

export const Footnote = styled.p(styles.footnote)
export const Endnote = styled.p(styles.endnote)
export const Caption = styled.p(styles.caption)
export const P = styled.p(styles.p)
export const Blockquote = styled.p(styles.blockquote)
export const H6 = styled.h6(styles.h6)
export const H5 = styled.h5(styles.h5)
export const H4 = styled.h4(styles.h4)
export const H3 = styled.h3(styles.h3)
export const H2 = styled.h2(styles.h2)
export const H1 = styled.h1(styles.h1)

console.log(styles)
// {
//   footnote: {
//     fontSize: '12.25px',
//     lineHeight: '16px',
//   },
//   endnote: {
//     fontSize: '14px',
//     lineHeight: '24px',
//   },
//   caption: {
//     fontSize: '14px',
//     lineHeight: '24px',
//   },
//   p: {
//     fontSize: '16px',
//     lineHeight: '24px',
//   },
//   blockquote: {
//     fontSize: '18.5px',
//     lineHeight: '32px',
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
   * starting hierarchy index
   *
   * This is useful if you want some styles smaller than the base.
   *
   * For example, if the hierarchy is `[footnote, body, ...]`, and body should be
   * equal to the base, than the `startingIndex` would be `-1`.
   * @default 0
   */
  startingIndex?: number

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
   * Using the fibonacci sequence *(the default method)*, `(i) => fibonacci(i)`,
   * body *(hierarchy index 0)* would be 12 *(scale index 0)*, and h1
   * *(hierarchy index 7)* would be 120 *(scale index 13)*.
   * @default fibonacci
   */
  getScaleIndex?: (hierarchyIndex: number) => number
}
```
