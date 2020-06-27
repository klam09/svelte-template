module.exports = function babelConfig(api) {
    api.cache(true);

    const presets = [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'entry',
                corejs: 3,
                // debug: true
            },
        ],
    ];

    const babelrcRoots = [
        '.',
        'node_module/svelte',
    ];

    return {
        presets,
        babelrcRoots
    };
};
