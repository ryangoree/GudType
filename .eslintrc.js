module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  overrides: [
    {
      files: ['**/*.test.[jt]s', '**/__tests__'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
      env: {
        node: true,
        'jest/globals': true,
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
  ignorePatterns: ['lib/**/*'],
}
