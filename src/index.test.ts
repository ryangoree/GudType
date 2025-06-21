import assert from 'node:assert';
import test from 'node:test';
import { gudTypeScale, rounder } from './index.js';

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
const styles = gudTypeScale(hierarchy, { baseIndex: 2 });

console.log(styles);

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
  hierarchy.forEach((item) => {
    assert.ok(styles[item], `Style for ${item} is missing`);
    assert.strictEqual(
      typeof styles[item].fontSize,
      'number',
      `Font size for ${item} should be a number`,
    );
    assert.strictEqual(
      typeof styles[item].lineHeight,
      'number',
      `Line height for ${item} should be a number`,
    );
    assert.strictEqual(
      typeof styles[item].relativeSize,
      'number',
      `Relative size for ${item} should be a number`,
    );
  });
});

test('generates the right types based on options', () => {
  const {
    x: { fontSize: numberFontSize },
  } = gudTypeScale(['x']);
  assert.strictEqual(
    typeof numberFontSize,
    'number',
    'Font size should be a number',
  );
  const {
    x: { fontSize: stringFontSize },
  } = gudTypeScale(['x'], { unit: 'px' });
  assert.strictEqual(
    typeof stringFontSize,
    'string',
    'Font size should be a string when unit is px',
  );
});
