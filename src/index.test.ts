import * as gudType from './index'

const hierarchy = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
]

const styles = gudType.generateTypeScale(hierarchy)

test('rounds correctly', () => {
  const round = gudType.rounder(1)
  expect(round(1.1)).toBe(1)
  expect(round(1.9)).toBe(2)
  const roundUp = gudType.rounder(1, 'up')
  expect(roundUp(1.1)).toBe(2)
  const roundDown = gudType.rounder(1, 'down')
  expect(roundDown(1.9)).toBe(1)
})

test('generates a style for each hierarchy item', () => {
  expect(Object.keys(styles).length).toBe(10)
})

test('calculates consistently across functions.', () => {
  const compareStyles: typeof styles = {}
  for (let i = 0; i < hierarchy.length; i++) {
    const scaleIndex = gudType.getTypeScaleIndex(i);
    const fontSize = gudType.getFontSize(scaleIndex);
    compareStyles[hierarchy[i]] = {
      fontSize,
      lineHeight: gudType.getLineHeight(fontSize)
    }
  }
  expect(compareStyles).toEqual(styles)
})
