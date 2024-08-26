/** @type {import('next').NextConfig} */
const nextConfig = {
    // webpack: (
    //     config,
    //     { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
    // ) => {

    //     if (!isServer) {
    //         config.resolve.fallback = {
    //             url: require.resolve('url'),
    //             assert: require.resolve('assert'),
    //             crypto: require.resolve('crypto-browserify'),
    //             http: require.resolve('stream-http'),
    //             https: require.resolve('https-browserify'),
    //             os: require.resolve('os-browserify/browser'),
    //             buffer: require.resolve('buffer'),
    //             stream: require.resolve('stream-browserify'),
    //         };

    //         config.plugins.push(
    //             new webpack.ProvidePlugin({
    //                 Buffer: ["buffer", "Buffer"],
    //                 crypto: require.resolve("crypto-browserify"),
    //             })
    //         );
    //     }

    //     console.log('webpack config override', config);
    //     // Important: return the modified config
    //     return config
    // },
    experimental: {
        serverComponentsExternalPackages: ["@xmtp/user-preferences-bindings-wasm"],
    },
    webpack: (config) => {
        config.externals.push("pino-pretty", "lokijs", "encoding");
        return config;
    },


};

export default nextConfig;
