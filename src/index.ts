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
 * Returns a new rounding function for rounding to a target multiple.
 *
 * @param targetMultiple - The multiple to which the new function will round.
 * @param direction - The direction to round.
 */
export function rounder(
  targetMultiple: number,
  direction?: 'up' | 'down',
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

interface TypeScaleOptions {
  /**
   * The starting point for the scale.
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

interface LineHeightOptions {
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

export type TypeScaleValue<TUnit> = TUnit extends undefined ? number : string;

export type TypeScale<
  THierarchy extends string = string,
  TUnit extends string | undefined = undefined,
> = Record<
  THierarchy,
  {
    fontSize: TypeScaleValue<TUnit>;
    lineHeight: TypeScaleValue<TUnit>;
    relativeSize: number;
  }
>;

export interface GenerateTypeScaleOptions<
  TUnit extends string | undefined = undefined,
> extends TypeScaleOptions,
    Omit<LineHeightOptions, 'multiplier'> {
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
   * from numbers to strings.
   *
   * @default undefined
   */
  unit?: TUnit;
}

/**
 * Generate font sizes and line heights for a given hierarchy of font styles.
 *
 * @param hierarchy - An array of font style names to generate font sizes and
 * line heights for.
 * @param options - Options for the type scale.
 */
export function gudTypeScale<
  THierarchy extends string = string,
  TUnit extends string | undefined = undefined,
>(
  hierarchy: readonly THierarchy[],
  options?: GenerateTypeScaleOptions<TUnit>,
): TypeScale<THierarchy, TUnit> {
  const {
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
  const typeScale = {} as TypeScale<THierarchy, TUnit>;
  for (let i = 0; i < hierarchy.length; i++) {
    const scaleIndex = getScaleIndex(i - baseIndex);
    const fontSize = gudFontSize(scaleIndex, {
      base,
      multiplier,
      steps,
      round,
    });
    const lineHeight = gudLineHeight(fontSize, {
      gridHeight,
      multiplier: lineHeightMultiplier,
    });
    typeScale[hierarchy[i]] = {
      fontSize: (unit
        ? `${fontSize}${unit}`
        : fontSize) as TypeScaleValue<TUnit>,
      lineHeight: (unit
        ? `${lineHeight}${unit}`
        : lineHeight) as TypeScaleValue<TUnit>,
      relativeSize: parseFloat((fontSize / base).toFixed(4)),
    };
  }
  return typeScale;
}
