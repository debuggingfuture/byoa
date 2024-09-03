const webpack = require('webpack');

module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {


            webpackConfig.resolve.fallback = {
                process: require.resolve("process"),
                // events: require.resolve("events/"),
                stream: require.resolve("stream-browserify"),
                buffer: require.resolve("buffer/"),
                crypto: require.resolve("crypto-browserify"),
            };

            webpackConfig.plugins.push(
                new webpack.ProvidePlugin({
                    process: 'process',
                    Buffer: ['buffer', 'Buffer'],
                })
            );

            return webpackConfig;
        },
    },
};