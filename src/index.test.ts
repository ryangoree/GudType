import assert from 'node:assert';
import test from 'node:test';
import {
  gudFontSize,
  gudLineHeight,
  gudTypeScale,
  gudTypeScaleIndex,
  rounder,
} from './index';

const hierarchy = [
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
const baseIndex = 2;
const styles = gudTypeScale(hierarchy, {
  baseIndex,
  base: 16,
  getScaleIndex: (i) => {
    const abs = Math.abs(i) ** 1.4;
    return i < 0 ? -abs : abs;
  },
});

for (const style of hierarchy.toReversed()) {
  console.log(
    `${style}: ${styles[style].fontSize} (${styles[style].lineHeight})`
  );
}
// console.log(styles);

test('rounds correctly', () => {
  const round = rounder(5);
  assert.strictEqual(round(1), 0);
  assert.strictEqual(round(4), 5);
  const roundUp = rounder(5, 'up');
  assert.strictEqual(roundUp(1), 5);
  const roundDown = rounder(5, 'down');
  assert.strictEqual(roundDown(4), 0);
});

test('generates a style for each hierarchy item', () => {
  assert.equal(Object.keys(styles).length, hierarchy.length);
});

test('calculates consistently across functions', () => {
  const compareStyles = {} as typeof styles;
  for (let i = 0; i < hierarchy.length; i++) {
    const hierarchyIndex = i - baseIndex;
    const scaleIndex = gudTypeScaleIndex(hierarchyIndex);
    const fontSize = gudFontSize(scaleIndex);
    compareStyles[hierarchy[i]] = {
      fontSize,
      lineHeight: gudLineHeight(fontSize),
      scaleIndex,
      relativeSize: fontSize / 16,
    };
  }
  assert.deepStrictEqual(compareStyles, styles);
});

test('generates the right types based on options', () => {
  const {
    x: { fontSize: numberFontSize },
  } = gudTypeScale(['x']);
  assert.strictEqual(typeof numberFontSize, 'number');
  const {
    x: { fontSize: stringFontSize },
  } = gudTypeScale(['x'], { unit: 'px' });
  assert.strictEqual(typeof stringFontSize, 'string');
});
