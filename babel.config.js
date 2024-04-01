module.exports = function getBabelConfig(api) {
    api.cache(true);

    const plugins = [
        [
            require.resolve('babel-plugin-module-resolver'),
            {
                root: ['./'],
                alias: {
                    '@config': './app/config',
                    '@assets': './app/assets',
                    '@data': './app/data',
                    '@domain': './app/domain',
                    '@models': './app/models',
                    '@components': './app/presentation/components',
                    '@modules': './app/presentation/modules',
                    '@localization': './app/presentation/localization',
                    '@navigation': './app/presentation/navigation',
                    '@redux': './app/presentation/redux',
                    '@theme': './app/presentation/theme',
                    '@shared': './app/shared',
                },
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        ],
        'react-native-reanimated/plugin'
    ];

    return {
        presets: ['module:@react-native/babel-preset'],
        env: {
            production: {
                plugins: ['transform-remove-console', 'react-native-paper/babel', ...plugins]
            }
        },
        plugins,
    };
};
