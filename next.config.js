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
    // Desabilitando otimizações experimentais que podem causar problemas
    // optimizeCss: true,
    // optimizeServerReact: true,
    // optimizePackageImports: [''],
  },
  webpack: (config, { dev, isServer }) => {
    // Lidar com o erro 'self is not defined'
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Ignorar erros de 'window is not defined' e 'document is not defined' no servidor
    if (isServer) {
      config.externals = [...(config.externals || []), 'canvas', 'jsdom'];
    }

    // Otimizações apenas para ambiente de produção
    if (!dev) {
      // Simplificando a configuração de splitChunks para evitar problemas
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
      };

      // Comentando configuração avançada de otimização
      /*
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
      */
    }
    
    return config;
  },
};

module.exports = nextConfig; 