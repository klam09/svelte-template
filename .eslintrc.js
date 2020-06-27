module.exports = {
    extends: './node_modules/lint-config/eslint.js',
    overrides: [
        {
            files: [
                './src/**/*.js',
                './src/**/*.svelte',
            ],
            processor: 'svelte3/svelte3',
            excludedFiles: '*.test.js',
        }
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        APPCONFIG: 'readonly',
    },
    plugins: [
        'svelte3',
    ],
    rules: {
        'import/prefer-default-export': 0,
        'import/no-mutable-exports': 0,
    },
    settings: {
        'svelte3/ignore-styles': (attr) => attr.lang === 'scss',
    },
};
