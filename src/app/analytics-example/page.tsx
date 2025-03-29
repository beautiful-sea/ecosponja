'use client'

import React, { useState, useEffect } from 'react'
import Banner, { AnalyticsData } from '../../components/Banner'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'

/**
 * Este é um componente de exemplo para demonstrar diferentes formas
 * de implementar e rastrear analytics com o componente Banner
 */
export default function AnalyticsExample() {
  // 1. Rastreamento com estado local (para depuração/demonstração)
  const [eventosRegistrados, setEventosRegistrados] = useState<AnalyticsData[]>([]);
  
  // 2. Exemplo de contador de conversões
  const [totalVisualizacoes, setTotalVisualizacoes] = useState(0);
  const [totalCliques, setTotalCliques] = useState(0);
  const [taxaConversao, setTaxaConversao] = useState(0);

  // Atualizar taxa de conversão quando as contagens mudarem
  useEffect(() => {
    if (totalVisualizacoes > 0) {
      setTaxaConversao((totalCliques / totalVisualizacoes) * 100);
    }
  }, [totalVisualizacoes, totalCliques]);

  // 3. Exemplo de rastreamento para o primeiro banner (básico)
  const handleBannerView = (data: AnalyticsData) => {
    // Adicionar ao estado local para demonstração
    setEventosRegistrados(prev => [...prev, data]);
    
    // Incrementar contadores
    setTotalVisualizacoes(prev => prev + 1);
    
    // Logica para backend
    console.log('Banner visualizado:', data);
    
    // Exemplo: enviar para um endpoint de API
    // fetch('/api/analytics/banner-view', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
  };
  
  const handleCtaClick = (data: AnalyticsData) => {
    // Adicionar ao estado local para demonstração
    setEventosRegistrados(prev => [...prev, data]);
    
    // Incrementar contadores
    setTotalCliques(prev => prev + 1);
    
    // Lógica para backend
    console.log('CTA clicado:', data);
    
    // Exemplo: enviar para um endpoint de API
    // fetch('/api/analytics/banner-click', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
  };

  // 4. Exemplo de rastreamento para o segundo banner (avançado)
  const handlePromocaoBannerView = (data: AnalyticsData) => {
    // Você pode ter lógica específica para cada banner
    console.log('Banner promocional visualizado', data);
    
    // Exemplo: Registrar segmento de usuário em um CRM
    if (typeof window !== 'undefined' && window.localStorage) {
      // Salvar que o usuário viu esta promoção
      localStorage.setItem('viu_promocao_banner', 'true');
      localStorage.setItem('timestamp_viu_promocao', Date.now().toString());
    }
    
    // Exemplo: Iniciar um timer para mostrar um popup após 30 segundos
    // se o usuário viu o banner mas não clicou
    setTimeout(() => {
      // Verificar se o usuário viu mas não clicou
      const viu = localStorage.getItem('viu_promocao_banner');
      const clicou = localStorage.getItem('clicou_promocao_banner');
      
      if (viu === 'true' && clicou !== 'true') {
        console.log('Usuário viu a promoção mas não clicou - mostrar popup');
        // Mostrar popup de lembrete
      }
    }, 30000);
  };

  const handlePromocaoCtaClick = (data: AnalyticsData) => {
    console.log('Banner promocional clicado', data);
    
    // Salvar que o usuário clicou
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('clicou_promocao_banner', 'true');
      localStorage.setItem('timestamp_clicou_promocao', Date.now().toString());
    }
    
    // Exemplo: Adicionar ao carrinho automaticamente via API
    // fetch('/api/carrinho/adicionar-item', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ 
    //     id_produto: 'eco-esponja-magic',
    //     quantidade: 1,
    //     origem: 'banner',
    //     banner_id: data.bannerId
    //   })
    // });
  };

  // 5. Exemplo com uso de hooks personalizados para analytics
  const useBannerAnalytics = (bannerName: string, category: string) => {
    return {
      onView: (data: AnalyticsData) => {
        console.log(`[${category}] Banner ${bannerName} visualizado`);
        
        // Exemplo: Enviar evento para serviço específico como Mixpanel
        if (typeof window !== 'undefined' && (window as any).mixpanel) {
          (window as any).mixpanel.track('Banner View', {
            banner_name: bannerName,
            category: category,
            ...data
          });
        }
      },
      onCtaClick: (data: AnalyticsData) => {
        console.log(`[${category}] Banner ${bannerName} CTA clicado`);
        
        // Exemplo: Enviar evento para serviço específico como Mixpanel
        if (typeof window !== 'undefined' && (window as any).mixpanel) {
          (window as any).mixpanel.track('Banner Click', {
            banner_name: bannerName,
            category: category,
            ...data
          });
        }
      }
    };
  };

  // Usar o hook personalizado para o terceiro banner
  const bannerAnalytics = useBannerAnalytics('black-friday', 'promotional');

  return (
    <main>
      <Navigation />
      
      <div className="space-y-8 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Exemplos de Analytics com Banner</h1>
        
        {/* Painel de Analytics */}
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto mb-8">
          <h2 className="text-xl font-bold mb-4">Painel de Analytics (Demo)</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600">{totalVisualizacoes}</div>
              <div className="text-sm text-gray-500">Visualizações</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600">{totalCliques}</div>
              <div className="text-sm text-gray-500">Cliques</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-600">{taxaConversao.toFixed(1)}%</div>
              <div className="text-sm text-gray-500">Taxa de Conversão</div>
            </div>
          </div>
          
          <h3 className="font-bold text-gray-700 mb-2">Últimos Eventos:</h3>
          <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
            {eventosRegistrados.length === 0 ? (
              <p className="text-gray-500 italic">Sem eventos registrados ainda. Interaja com os banners abaixo.</p>
            ) : (
              <ul className="space-y-2">
                {eventosRegistrados.slice(-5).reverse().map((evento, i) => (
                  <li key={i} className="text-sm border-b border-gray-200 pb-2">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-white mr-2 ${
                      evento.eventType === 'view' ? 'bg-blue-500' : 'bg-green-500'
                    }`}>
                      {evento.eventType === 'view' ? 'VIEW' : 'CLICK'}
                    </span>
                    <strong>{evento.bannerId}</strong> - {evento.title}
                    <span className="text-gray-500 text-xs ml-2">
                      {new Date(evento.timestamp).toLocaleTimeString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Exemplo 1: Banner com rastreamento básico */}
        <Banner
          title="Banner com Rastreamento Básico"
          subtitle="Exemplo 1"
          colorTheme="green"
          ctaText="Clique Aqui"
          ctaLink="#exemplo-clicado"
          ctaIcon="fa-rocket"
          bannerId="exemplo-basico"
          bannerPosition="topo"
          onView={handleBannerView}
          onCtaClick={handleCtaClick}
        >
          <p className="text-lg max-w-2xl mx-auto">
            Este banner usa callbacks simples para rastrear visualizações e cliques,
            registrando eventos no console e atualizando contadores.
          </p>
        </Banner>
        
        {/* Exemplo 2: Banner com rastreamento avançado para promoções */}
        <Banner
          title="Oferta Especial - 30% OFF"
          subtitle="Promoção Limitada"
          colorTheme="red"
          ctaText="Aproveitar Agora"
          ctaLink="#promo-clicada"
          ctaIcon="fa-tag"
          bannerId="promocao-30off"
          bannerPosition="meio"
          onView={handlePromocaoBannerView}
          onCtaClick={handlePromocaoCtaClick}
          backgroundImage="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000"
          height="h-72"
        >
          <p className="text-lg max-w-2xl mx-auto">
            Este banner implementa lógica avançada de rastreamento, incluindo armazenamento
            local e potencial integração com APIs de carrinho.
          </p>
        </Banner>
        
        {/* Exemplo 3: Banner usando hook personalizado */}
        <Banner
          title="Banner com Hook Personalizado"
          subtitle="Exemplo 3"
          colorTheme="blue"
          ctaText="Saiba Mais"
          ctaLink="#hook-clicado"
          ctaIcon="fa-info-circle"
          bannerId="exemplo-hook"
          bannerPosition="rodape"
          onView={bannerAnalytics.onView}
          onCtaClick={bannerAnalytics.onCtaClick}
        >
          <p className="text-lg max-w-2xl mx-auto">
            Este banner usa um hook personalizado de analytics, que encapsula a lógica
            de rastreamento e pode ser reutilizado em vários banners.
          </p>
        </Banner>
        
        {/* Documentação de código de exemplo */}
        <div className="max-w-3xl mx-auto mt-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Como Implementar Analytics</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-800">1. Configuração Básica</h3>
              <pre className="bg-gray-800 text-white p-4 rounded-md text-sm overflow-x-auto">
{`// Exemplo básico
<Banner
  title="Meu Banner"
  bannerId="banner-home"
  bannerPosition="topo"
  onView={(data) => console.log('Visualizado:', data)}
  onCtaClick={(data) => console.log('Clicado:', data)}
/>`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-800">2. Integração com Google Analytics</h3>
              <pre className="bg-gray-800 text-white p-4 rounded-md text-sm overflow-x-auto">
{`// O componente Banner já envia eventos para o GA4 automaticamente
// Certifique-se de ter o script do GA configurado no seu layout:

// Em layout.tsx ou _document.tsx:
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
/>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-800">3. Rastreamento de Conversões no Backend</h3>
              <pre className="bg-gray-800 text-white p-4 rounded-md text-sm overflow-x-auto">
{`// Em app/api/analytics/route.ts
export async function POST(request: Request) {
  const data = await request.json();
  
  // Salvar no banco de dados
  await prisma.analyticsEvent.create({
    data: {
      bannerId: data.bannerId,
      eventType: data.eventType,
      timestamp: new Date(data.timestamp),
      // outros campos
    }
  });
  
  return Response.json({ success: true });
}

// No componente que utiliza o Banner:
const handleBannerClick = (data) => {
  fetch('/api/analytics', {
    method: 'POST', 
    body: JSON.stringify(data)
  });
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
} 