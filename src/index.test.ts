import assert from 'node:assert';
import test from 'node:test';
import { gudTypeScale, rounder } from './index.js';

test('rounds correctly', () => {
  const round = rounder(5);
  const roundUp = rounder(5, 'up');
  const roundDown = rounder(5, 'down');
  assert.strictEqual(round(1), 0);
  assert.strictEqual(round(4), 5);
  assert.strictEqual(roundUp(1), 5);
  assert.strictEqual(roundDown(4), 0);
});

test('generates a style for each hierarchy item', () => {
  const hierarchy = ['xs', 's', 'm', 'l', 'xl'] as const;
  const typeScale = gudTypeScale({ hierarchy });
  hierarchy.forEach((style) => {
    assert.ok(typeScale[style], `Entry for ${style} is missing`);
    assert.strictEqual(
      typeof typeScale[style].fontSize,
      'number',
      `Font size for ${style} should be a number`,
    );
    assert.strictEqual(
      typeof typeScale[style].lineHeight,
      'number',
      `Line height for ${style} should be a number`,
    );
  });
});

test('generates the right types based on options', () => {
  const {
    p: { fontSize: numberFontSize },
  } = gudTypeScale();
  const {
    p: { fontSize: stringFontSize },
  } = gudTypeScale({ unit: 'px' });
  assert.strictEqual(
    typeof numberFontSize,
    'number',
    'Font size should be a number',
  );
  assert.match(
    stringFontSize,
    /^\d+(\.\d+)?px$/,
    'Font size should be a string with px unit',
  );
});
