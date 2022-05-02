import {
  gudTypeScale,
  rounder,
  gudFontSize,
  gudLineHeight,
  gudTypeScaleIndex,
} from './index'

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

const styles = gudTypeScale(hierarchy)

test('rounds correctly', () => {
  const round = rounder(5)
  expect(round(1)).toBe(0)
  expect(round(4)).toBe(5)
  const roundUp = rounder(5, 'up')
  expect(roundUp(1)).toBe(5)
  const roundDown = rounder(5, 'down')
  expect(roundDown(4)).toBe(0)
})

test('generates a style for each hierarchy item', () => {
  expect(Object.keys(styles).length).toBe(hierarchy.length)
})

test('calculates consistently across functions', () => {
  const compareStyles: typeof styles = {}
  for (let i = 0; i < hierarchy.length; i++) {
    const scaleIndex = gudTypeScaleIndex(i)
    const fontSize = gudFontSize(scaleIndex)
    compareStyles[hierarchy[i]] = {
      fontSize,
      lineHeight: gudLineHeight(fontSize),
    }
  }
  expect(compareStyles).toEqual(styles)
})

test('generates the right types based on options', () => {
  const {
    x: { fontSize: numberFontSize },
  } = gudTypeScale(['x'])
  expect(typeof numberFontSize).toBe('number')
  const {
    x: { fontSize: stringFontSize },
  } = gudTypeScale(['x'], { unit: 'px' })
  expect(typeof stringFontSize).toBe('string')
})
