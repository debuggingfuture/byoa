const webpack = require('webpack');

module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            webpackConfig.resolve.fallback = {
                stream: require.resolve("stream-browserify"),
                buffer: require.resolve("buffer/"),
                crypto: require.resolve("crypto-browserify"),
            };

            webpackConfig.plugins.push(
                new webpack.ProvidePlugin({
                    process: 'process/browser',
                    Buffer: ['buffer', 'Buffer'],
                })
            );

            return webpackConfig;
        },
    },
};