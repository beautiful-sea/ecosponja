import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

// Carregamento da fonte com subconjunto para reduzir o tamanho
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Melhor desempenho de carregamento
  preload: true,
  weight: ['400', '500', '600', '700'], // Carregar apenas os pesos necessários
})

export const metadata: Metadata = {
  title: 'EcoEsponja Mágica | A única esponja que dura 12x mais',
  description: 'Descubra a revolucionária EcoEsponja Mágica que dura até 12 meses, é antibacteriana e ajuda você a economizar mais de R$100 por ano. Proteção para sua família, economia para seu bolso!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Preconnect para recursos externos - reduz o tempo de execução de scripts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        
        {/* Preload da imagem da hero section para melhorar LCP */}
        <link 
          rel="preload" 
          href="/img/esponjaetexto.webp" 
          as="image" 
          type="image/webp"
        />

        {/* Estilos críticos inline para ícones comuns - evita bloqueio de renderização */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Mini subset do Font Awesome com apenas os ícones essenciais */
          @font-face {
            font-family: 'Font Awesome 5 Free';
            font-style: normal;
            font-weight: 900;
            font-display: swap;
            src: url("data:application/font-woff2;charset=utf-8;base64,d09GMgABAAAAAAO0AAsAAAAAB7QAAANlAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGVgCDHAqDIIJ3ATYCJAMQCwoABCAFhGcHSBvIBsg+QCa3noNEjxSzLI/VY3wTD/+N37fPzKrfpPGimTSaPp1EolOJRIJENBrRQqGRzv9d03/AkkMC9iasSATrFrZlt5+R+kTJm3bXaRcqFyqX9D89l08DVvO0l80BFeXF4emzgAYU1Q1gA46h/Q/8A76AgDeMAz3XnDSwAmeFcVPAxnC1tIArOMdFzMJSqJumeTHuYamW7ml6AHc+348fQOQKSZUZN7zyoTwHhT/jZ2V7zDPrCATjWUF7jIw5oBDXGi2XwTycA5rWIuouUFtJwr93d6k/4//HI4CHmor2H54gyQpRC3L7InwDKnyWUsifFUl4wwvmEbwTgcQrRCQfYB8n6jlv36aT6fS86ehOMp3KxS5e7Jzw8Gx2/vbtapaW1LXL5/Rk5/X9dNzISbevnDnUbq+x3bx7rePYieROTpw8fvV6+/n7m67dWHvq9Orrt1ZdvbH68s31Z6/0Xr3TefwKl5e3xvCe5bnrGVJYtq/x3NXl2eXZ3KzRWD5bGJdD1wUfYo5lsjZnF62gTdK+e1r7jGnLl00/GG3TaJvGXTsmr62/du3KpuUHduxYOa/RyE3qPnh9z579V8SxQ5cGDh4ePM6lCZxeODR85OLQYP/u+rvU1J36O1YsXyAHKMCHwbL9VXWkxv5R9f+8AyuvAFR9xt7v6qN9wHfYr6HVnhxKbX3HF0B+E6ZqVhCuvppNtf3XVFVTc8WsQJf/5qWCmnb5rYQmxr8FLQmNz8HCoWNZ7S3Mxfh4IQlrvXmFQVP+h3vSrf8NIQ5jhBLZcaBHjlGaKQ6UHjkCCQyQChVqAFRoYg5UadYeqnFE0lGNGdBDdAGEVs5A0sxTyFq5RmnmFlTo5j1UaaUfVFkJnwbVOB/zhlLGKKSwAK2jmk6onJHmIc9D3KWbRkVFCW2jBDFP9aKmxjbY1D2Gb2OaME+ZQUSpqXCP0HVd4TmqaVSDQpKa6MhV57QaVBrM4BRGQhQsAFodqtIRKs6Q1ofnIdz39DYySijRBM81gSF81JcKTZpsXuxF9VrcHpZRCeYpZiBEUprkcSgRusNc4PGoRoaqQUIS1Ug9yKmJRdSoP719we15t8BK7CVkKFGZqVZ7vJoTm1LJZJqxUJJrNJNRasoSAAA=") format('woff2');
          }

          .fas {
            font-family: 'Font Awesome 5 Free';
            font-weight: 900;
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased;
            display: inline-block;
            font-style: normal;
            font-variant: normal;
            text-rendering: auto;
            line-height: 1;
          }

          .fa-check-circle:before{content:"\\f058";}
          .fa-shopping-cart:before{content:"\\f07a";}
          .fa-eye:before{content:"\\f06e";}
          .fa-times:before{content:"\\f00d";}
          .fa-shield-alt:before{content:"\\f3ed";}
          .fa-lock:before{content:"\\f023";}
          .fa-info-circle:before{content:"\\f05a";}
          
          /* Estilos críticos para o hero e cabeçalho */
          .hero-gradient { 
            background: linear-gradient(to right, rgba(240, 249, 240, 1), rgba(240, 249, 255, 1)); 
          }
          
          .hero-title { 
            font-size: 2.5rem; 
            line-height: 1.2; 
            font-weight: 700; 
            color: #1a202c; 
            margin-bottom: 1rem; 
          }
          
          @media (min-width: 768px) {
            .hero-title { 
              font-size: 3rem; 
            }
          }
        `}} />
      </head>
      <body className={inter.className}>
        {children}
        
        {/* Carregamento diferido do Font Awesome completo - após renderização inicial */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
} 