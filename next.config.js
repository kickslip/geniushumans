/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Enable needed experiments
    config.experiments = {
      ...config.experiments,
      layers: true,
      asyncWebAssembly: true,
    };

    // Add WASM support
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    // Externalize argon2 on server
    if (isServer) {
      config.externals = [...(config.externals || []), "@node-rs/argon2"];
    }

    return config;
  },
};

module.exports = nextConfig;
