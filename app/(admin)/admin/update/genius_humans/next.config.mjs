/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add WASM support
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    }

    // Add rule for WASM files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    })

    // Externalize argon2 on the server
    if (isServer) {
      config.externals = [...(config.externals || []), '@node-rs/argon2'];
    }

    return config;
  }
};

export default nextConfig;