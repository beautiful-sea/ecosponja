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

      // Adiciona otimização de minificação e melhora tree-shaking
      config.optimization.usedExports = true;
      config.optimization.providedExports = true;
      config.optimization.sideEffects = true;

      // Reduzir as avaliações e a análise de scripts
      if (!isServer) {
        // Adicionar TerserPlugin com configurações otimizadas para reduzir a avaliação de script
        config.optimization.minimizer = config.optimization.minimizer || [];
        config.optimization.minimizer.push(
          new (require('terser-webpack-plugin'))({
            terserOptions: {
              parse: {
                // Reduzir o trabalho de parsing
                ecma: 8,
              },
              compress: {
                ecma: 5,
                warnings: false,
                comparisons: false,
                inline: 2,
                drop_console: true, // Remove console.log
              },
              mangle: {
                safari10: true,
              },
              output: {
                ecma: 5,
                comments: false,
                ascii_only: true,
              },
            },
            parallel: true, // Use múltiplos processadores
          })
        );
      }
    }
    
    return config;
  },
};

module.exports = nextConfig; 