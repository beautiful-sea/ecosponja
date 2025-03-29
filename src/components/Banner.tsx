'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'

interface BannerProps {
  /** Título principal do banner */
  title: string;
  /** Subtítulo ou descrição */
  subtitle?: string;
  /** URL da imagem de fundo */
  backgroundImage?: string;
  /** Cor de fundo quando não há imagem (ex: "green", "blue", "purple") */
  colorTheme?: 'green' | 'blue' | 'purple' | 'yellow' | 'red';
  /** Texto do botão CTA */
  ctaText?: string;
  /** Link para onde o botão CTA deve apontar */
  ctaLink?: string;
  /** Ícone FontAwesome para o botão CTA (ex: "fa-leaf") */
  ctaIcon?: string;
  /** Altura do banner em classes tailwind (ex: "h-64", "h-96") */
  height?: string;
  /** Conteúdo adicional a ser renderizado no banner */
  children?: React.ReactNode;
  /** ID único para o banner, usado para analytics */
  bannerId?: string;
  /** Localização do banner na página */
  bannerPosition?: string;
  /** Função de callback para evento de visualização */
  onView?: (data: AnalyticsData) => void;
  /** Função de callback para evento de clique no CTA */
  onCtaClick?: (data: AnalyticsData) => void;
}

export interface AnalyticsData {
  /** ID do banner */
  bannerId: string;
  /** Título do banner */
  title: string;
  /** Posição do banner na página */
  position: string;
  /** Cor do tema */
  theme: string;
  /** Texto do CTA (se aplicável) */
  ctaText?: string;
  /** Timestamp do evento */
  timestamp: number;
  /** Tipo de evento: 'view' ou 'click' */
  eventType: 'view' | 'click';
}

export default function Banner({
  title,
  subtitle,
  backgroundImage,
  colorTheme = 'green',
  ctaText,
  ctaLink,
  ctaIcon,
  height = 'h-80',
  children,
  bannerId = 'default-banner',
  bannerPosition = 'unknown',
  onView,
  onCtaClick
}: BannerProps) {
  // Configurações de tema com base na cor escolhida
  const themes = {
    green: {
      gradient: 'from-green-50 to-green-500/20',
      accent: 'bg-green-100 text-green-600',
      button: 'bg-green-600 hover:bg-green-700',
      border: 'border-green-200'
    },
    blue: {
      gradient: 'from-blue-50 to-blue-500/20',
      accent: 'bg-blue-100 text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
      border: 'border-blue-200'
    },
    purple: {
      gradient: 'from-purple-50 to-purple-500/20',
      accent: 'bg-purple-100 text-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700',
      border: 'border-purple-200'
    },
    yellow: {
      gradient: 'from-yellow-50 to-yellow-500/20',
      accent: 'bg-yellow-100 text-yellow-600',
      button: 'bg-yellow-600 hover:bg-yellow-700',
      border: 'border-yellow-200'
    },
    red: {
      gradient: 'from-red-50 to-red-500/20',
      accent: 'bg-red-100 text-red-600',
      button: 'bg-red-600 hover:bg-red-700',
      border: 'border-red-200'
    }
  };

  const currentTheme = themes[colorTheme];

  // Determina o estilo de fundo
  const backgroundStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};

  // Função para registrar eventos de analytics
  const logAnalytics = (eventType: 'view' | 'click') => {
    const analyticsData: AnalyticsData = {
      bannerId,
      title,
      position: bannerPosition,
      theme: colorTheme,
      ctaText: ctaText || undefined,
      timestamp: Date.now(),
      eventType
    };

    // Enviar para o callback correspondente
    if (eventType === 'view' && onView) {
      onView(analyticsData);
    } else if (eventType === 'click' && onCtaClick) {
      onCtaClick(analyticsData);
    }

    // Implementação padrão fallback (envio para console em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      console.log('Banner Analytics:', analyticsData);
    }

    // Aqui você pode integrar com seu sistema de analytics
    // Exemplo: Google Analytics, Mixpanel, etc.
    if (typeof window !== 'undefined') {
      try {
        // Google Analytics (GA4)
        if (window.gtag) {
          window.gtag('event', eventType === 'view' ? 'banner_view' : 'banner_click', {
            banner_id: bannerId,
            banner_title: title,
            banner_position: bannerPosition,
            banner_theme: colorTheme,
            cta_text: ctaText
          });
        }
        
        // Facebook Pixel
        if (window.fbq) {
          window.fbq('trackCustom', eventType === 'view' ? 'BannerView' : 'BannerClick', {
            banner_id: bannerId,
            banner_title: title,
            banner_position: bannerPosition
          });
        }
      } catch (error) {
        console.error('Erro ao enviar dados para analytics:', error);
      }
    }
  };

  // Registrar visualização do banner quando o componente for montado
  useEffect(() => {
    // Usar IntersectionObserver para detectar quando o banner está visível
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          logAnalytics('view');
          // Desconecta o observer após a primeira visualização
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 }); // 50% do banner deve estar visível
    
    // Selecionar o elemento a ser observado
    const bannerElement = document.getElementById(`banner-${bannerId}`);
    if (bannerElement) {
      observer.observe(bannerElement);
    }
    
    return () => {
      // Limpar o observer quando o componente for desmontado
      observer.disconnect();
    };
  }, [bannerId, title]);

  // Handler para cliques no CTA
  const handleCtaClick = () => {
    logAnalytics('click');
  };

  return (
    <section 
      id={`banner-${bannerId}`}
      className={`py-16 md:py-24 relative overflow-hidden ${height} ${!backgroundImage ? `bg-gradient-to-r ${currentTheme.gradient}` : ''}`}
      style={backgroundStyle}
      data-banner-id={bannerId}
      data-banner-position={bannerPosition}
    >
      {/* Overlay para imagens de fundo */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tag Accent */}
          {subtitle && (
            <span className={`inline-block ${currentTheme.accent} font-bold px-4 py-1 rounded-full mb-4`}>
              {subtitle.toUpperCase()}
            </span>
          )}
          
          {/* Título */}
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${backgroundImage ? 'text-white' : 'text-gray-800'}`}>
            {title}
          </h1>
          
          {/* Conteúdo adicional */}
          {children && (
            <div className={`mb-8 ${backgroundImage ? 'text-white text-opacity-90' : 'text-gray-700'}`}>
              {children}
            </div>
          )}
          
          {/* Botão CTA */}
          {ctaText && ctaLink && (
            <div className="flex justify-center">
              <Link
                href={ctaLink}
                className={`${currentTheme.button} text-white font-medium py-3 px-8 rounded-lg shadow-md transition-all hover:-translate-y-1 inline-flex items-center`}
                onClick={handleCtaClick}
                data-banner-cta={ctaText}
              >
                {ctaIcon && <i className={`fas ${ctaIcon} mr-2`}></i>}
                {ctaText}
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full opacity-10 transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full opacity-10 transform -translate-x-1/2 translate-y-1/3"></div>
    </section>
  )
} 