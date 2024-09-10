module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
        'prettier/prettier': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
};
