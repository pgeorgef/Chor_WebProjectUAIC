module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'class-methods-use-this': 'off',
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    'no-loop-func': 'off',
    'max-len': ['error', { code: 200 }],
  },
};
