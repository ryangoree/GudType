/**
 * Returns a new rounding function for rounding to a target multiple.
 *
 * @param targetMultiple - The multiple to which the new function will round.
 * @param direction - The direction to round.
 */
export function rounder(
  targetMultiple: number,
  direction?: 'up' | 'down' | 'nearest',
): (n: number) => number {
  switch (direction) {
    case 'up':
      return (n: number) => Math.ceil(n / targetMultiple) * targetMultiple;
    case 'down':
      return (n: number) => Math.floor(n / targetMultiple) * targetMultiple;
    default:
      return (n: number) => Math.round(n / targetMultiple) * targetMultiple;
  }
}

export interface TypeScaleOptions {
  /**
   * The base font size.
   *
   * @default 16
   */
  base?: number;

  /**
   * The increment multiplier.
   *
   * @default 2
   */
  multiplier?: number;

  /**
   * The number steps it takes to go from one multiple to the next.
   *
   * @default 5
   */
  steps?: number;

  /**
   * The function used to round font sizes.
   *
   * @default rounder(0.25, 'up')
   */
  round?: (size: number) => number;
}

/**
 * A function to get a single font size in a type scale at a given index.
 *
 * @param scaleIndex - The index of the font size to calculate.
 * @param options - Options for the type scale.
 */
export function gudFontSize(
  scaleIndex: number,
  options?: TypeScaleOptions,
): number {
  const {
    base = 16,
    multiplier = 2,
    steps = 5,
    round = rounder(0.25, 'up'),
  } = options || {};
  return round(base * multiplier ** (scaleIndex / steps));
}

export interface LineHeightOptions {
  /**
   * The multiplier to use when deciding the line height of a given font size.
   * The resulting line height will be rounded up to the closest factor of the
   * `gridHeight`.
   *
   * @default 1.3
   */
  multiplier?: number;

  /**
   * The desired grid height which will be used to round the line heights.
   *
   * @default 8
   */
  gridHeight?: number;
}

/**
 * A function to get a line height for a font size on a given baseline grid.
 *
 * @param fontSize - The font size for which a line height will be calculated.
 * @param options - Options for the baseline grid.
 */
export function gudLineHeight(
  fontSize: number,
  options?: LineHeightOptions,
): number {
  const { multiplier = 1.3, gridHeight = 8 } = options || {};
  return rounder(gridHeight, 'up')(fontSize * multiplier);
}

/**
 * A util function for getting an index on a scale for a given hierarchy index.
 * Uses a power function to ensure that the scale is not linear, with special
 * handling for negative indexes.
 *
 * @param index - The hierarchy index of the type style.
 */
export function gudTypeScaleIndex(index: number): number {
  const abs = Math.abs(index) ** 1.4;
  return index < 0 ? -abs : abs;
}

/**
 * The unit of measurement used in the type scale.
 *
 * ### Absolute Length Units
 *
 * | Unit   | Name                | Equivalent to            |
 * | :----- | :------------------ | :----------------------- |
 * | **cm** | Centimeters         | 1cm = 37.8px = 25.2/64in |
 * | **mm** | Millimeters         | 1mm = 1/10th of 1cm      |
 * | **Q**  | Quarter-millimeters | 1Q = 1/40th of 1cm       |
 * | **in** | Inches              | 1in = 2.54cm = 96px      |
 * | **pc** | Picas               | 1pc = 1/6th of 1in       |
 * | **pt** | Points              | 1pt = 1/72nd of 1in      |
 * | **px** | Pixels              | 1px = 1/96th of 1in      |
 *
 * ### Relative Length Units
 *
 * | Unit    | Description                                                                                                   |
 * | :------ | :------------------------------------------------------------------------------------------------------------ |
 * | **em**  | is relative to the font size of this element, or the font size of the parent element when used for font-size. |
 * | **rem** | is relative to the font size of the root element.                                                             |
 *
 * @see [MDN - Values And Units - Lengths](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units#lengths)
 */
export type TypeScaleUnit =
  | 'cm'
  | 'mm'
  | 'Q'
  | 'in'
  | 'pc'
  | 'pt'
  | 'px'
  | 'em'
  | 'rem';

export type TypeScaleValue<TUnit extends TypeScaleUnit | undefined> =
  TUnit extends undefined ? number : string;

export type TypeScale<
  THierarchy extends string = string,
  TUnit extends TypeScaleUnit | undefined = undefined,
> = Record<
  THierarchy,
  {
    fontSize: TypeScaleValue<TUnit>;
    lineHeight: TypeScaleValue<TUnit>;
  }
>;

export interface GenerateTypeScaleOptions<
  THierarchy extends string = string,
  TUnit extends TypeScaleUnit | undefined = undefined,
> extends TypeScaleOptions,
    Omit<LineHeightOptions, 'multiplier'> {
  /**
   * The hierarchy of font styles to generate.
   *
   * This is an array of strings representing the font styles in the order
   * they should be generated. The first item in the array will be the smallest
   * font size, and the last item will be the largest.
   *
   * @default ['footnote', 'caption', 'p', 'h6', 'h5', 'h4', 'h3', 'h2', 'h1']
   */
  hierarchy?: readonly THierarchy[];

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
   * given the following hierarchy: `['body', 'h6', 'h5', 'h4', 'h3', 'h2',
   * 'h1']` and the following scale: `[12, 14, 16, 18.25, 21, 24, 27.75, 31.75,
   * 36.5, 42, 48]` *(base: 12, multiplier: 2, steps: 5)*
   *
   * A 1 to 1 fn of `(i) => i` would mean `"body"` *(hierarchy index 0)* would
   * be `12` *(scale index 0)*, and `"h1"` *(hierarchy index 6)* would be
   * `27.75` *(scale index 6)*.
   *
   * Using `(i) => i * 1.5`, `"body"` *(hierarchy index 0)* would be `12`
   * *(scale index 0)*, and `"h1"` *(hierarchy index 6)* would be `42` *(scale
   * index 9)*.
   *
   * @default (i) => gudTypeScaleIndex(i)
   */
  getScaleIndex?: (hierarchyIndex: number) => number;

  /**
   * The multiplier to use when deciding the line height of a given font size.
   * The resulting line height will be rounded up to the closest factor of the
   * `gridHeight`.
   *
   * @default 1.3
   */
  lineHeightMultiplier?: number;

  /**
   * An optional unit to add to the returned values. This will change the values
   * from numbers to strings. If provided a relative unit (`rem` or `em`),
   * the font sizes will be relative to the base font size.
   *
   * @default undefined
   */
  unit?: TUnit;
}

/**
 * The default hierarchy of font styles used by {@linkcode gudTypeScale}.
 */
export const DEFAULT_HIERARCHY = [
  'footnote',
  'caption',
  'p',
  'h6',
  'h5',
  'h4',
  'h3',
  'h2',
  'h1',
] as const;

/**
 * Generate font sizes and line heights for a given hierarchy of font styles.
 *
 * @param hierarchy - An array of font style names to generate font sizes and
 * line heights for.
 * @param options - Options for the type scale.
 */
export function gudTypeScale<
  THierarchy extends string = (typeof DEFAULT_HIERARCHY)[number],
  TUnit extends TypeScaleUnit | undefined = undefined,
>(
  options?: GenerateTypeScaleOptions<THierarchy, TUnit>,
): TypeScale<THierarchy, TUnit> {
  const {
    hierarchy = DEFAULT_HIERARCHY as unknown as THierarchy[],
    baseIndex = 0,
    getScaleIndex = gudTypeScaleIndex,
    base = 16,
    multiplier = 2,
    steps = 5,
    round = rounder(0.25, 'up'),
    gridHeight = 8,
    lineHeightMultiplier = 1.3,
    unit,
  } = options || {};

  const baseLineHeight = gudLineHeight(base, {
    gridHeight,
    multiplier: lineHeightMultiplier,
  });

  return hierarchy.reduce(
    (typeScale, style, i) => {
      const scaleIndex = getScaleIndex(i - baseIndex);
      const rawFontSize = gudFontSize(scaleIndex, {
        base,
        multiplier,
        steps,
        round,
      });
      const rawLineHeight =
        i === baseIndex
          ? baseLineHeight
          : gudLineHeight(rawFontSize, {
              gridHeight,
              multiplier: lineHeightMultiplier,
            });

      let fontSize = rawFontSize as TypeScaleValue<TUnit>;
      let lineHeight = rawLineHeight as TypeScaleValue<TUnit>;
      if (unit === 'rem' || unit === 'em') {
        fontSize =
          `${parseFloat((rawFontSize / base).toFixed(4))}${unit}` as TypeScaleValue<TUnit>;
        lineHeight =
          `${parseFloat((rawLineHeight / baseLineHeight).toFixed(4))}${unit}` as TypeScaleValue<TUnit>;
      } else if (unit) {
        fontSize = `${rawFontSize}${unit}` as TypeScaleValue<TUnit>;
        lineHeight = `${rawLineHeight}${unit}` as TypeScaleValue<TUnit>;
      }

      typeScale[style] = {
        fontSize,
        lineHeight,
      };

      return typeScale;
    },
    {} as TypeScale<THierarchy, TUnit>,
  );
}
