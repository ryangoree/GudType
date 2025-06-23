# @gud/typescale

## 2.0.0-next.0

### Major Changes

- b01ad6f: # Major Release: CLI Support and API Improvements

  ## 🚀 New Features

  ### CLI Tool

  - Added a comprehensive CLI tool for generating CSS type scales
  - Supports Tailwind CSS v4 integration with CSS custom properties and utility classes
  - Extensive command-line options for customizing hierarchy, base size, multipliers, units, and more
  - Default command `npx typescale` for quick CSS generation

  ### Enhanced API

  - **BREAKING**: `gudTypeScale` now takes a single options object instead of separate hierarchy and options parameters
  - Added `hierarchy` option to the main options object (defaults to `['footnote', 'caption', 'p', 'h6', 'h5', 'h4', 'h3', 'h2', 'h1']`)
  - Improved TypeScript types with better unit handling for relative units (`rem`, `em`)
  - Added comprehensive `TypeScaleUnit` type with support for all CSS length units

  ## 💥 Breaking Changes

  - `gudTypeScale(hierarchy, options)` → `gudTypeScale({ hierarchy, ...options })`
  - Removed `relativeSize` property from type scale objects
  - Updated font size and line height calculations for relative units to be relative to base line height

  ## 📚 Documentation

  - Comprehensive README update with CLI usage examples
  - Added Tailwind CSS v4 integration guide
  - Detailed API documentation with examples
  - Added JSDoc comments for better IDE support

  ## 🔧 Internal Improvements

  - Added [`clide-js`](https://www.npmjs.com/package/clide-js) dependency for CLI functionality
  - Enhanced test coverage for new API structure
  - Improved TypeScript configuration
  - Updated package structure for better exports

## 1.0.1

### Patch Changes

- 8cdf6ea: Fixed release to actually include build 🤦‍♂️

## 1.0.0

### Major Changes

- 6dfe780: New package name: `@gud/typescale`. Cleanup up repo and modified `gudTypeScaleIndex` to use a new power function instead of fibonacci.
