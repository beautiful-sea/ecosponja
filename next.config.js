/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    minimumCacheTTL: 31536000, // 1 ano em segundos
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  swcMinify: true,
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
    optimizePackageImports: [''],
  },
  webpack: (config, { dev, isServer }) => {
    // Otimizações apenas para ambiente de produção
    if (!dev) {
      // Otimização de bundle splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Componentes comuns
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            reuseExistingChunk: true,
          },
          // Pacotes de terceiros
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // Pega o nome do pacote sem a versão
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `npm.${packageName.replace('@', '')}`;
            },
            chunks: 'all',
          },
        },
      };
    }
    
    return config;
  },
};

module.exports = nextConfig; 