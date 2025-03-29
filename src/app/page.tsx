'use client'

import { useEffect, useState, useCallback, memo, Suspense, lazy } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import dynamic from 'next/dynamic'
import OptimizedImage from '../components/OptimizedImage'
import SimpleIcon from '../components/SimpleIcon'
import ErrorBoundary from '../components/ErrorBoundary'

// Lazy load componentes que não são necessários imediatamente
const LazyFAQSection = dynamic(() => import('../components/LazyFAQSection'), {
  loading: () => <div className="py-16 bg-gray-50"><div className="container mx-auto px-4 text-center">Carregando seção de perguntas frequentes...</div></div>,
  ssr: false,
});

// Importação dinâmica do contador para reduzir o bundle inicial
const CountdownTimer = dynamic(() => import('../components/CountdownTimer'), {
  loading: () => null,
  ssr: false,
});

// Memoizando componentes pesados
const MemoizedNavigation = memo(Navigation);
const MemoizedFooter = memo(Footer);

// Reutilizando o componente SimpleIcon para todos os ícones
const Icon = SimpleIcon;

// Componente para notificações de compra recente
const RecentPurchaseNotifications = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState({ nome: '', local: '' });

  useEffect(() => {
    // Dados pré-definidos para evitar manipulação DOM desnecessária
    const compradores = [
      { nome: "Maria Silva", local: "Belo Horizonte, MG" },
      { nome: "João Pereira", local: "São Paulo, SP" },
      { nome: "Ana Oliveira", local: "Porto Alegre, RS" },
      { nome: "Carlos Santos", local: "Recife, PE" }
    ];
    
    let notificationTimeout;
    let hideTimeout;
    
    const showNotification = () => {
      const comprador = compradores[Math.floor(Math.random() * compradores.length)];
      setBuyerInfo(comprador);
      setIsVisible(true);
      
      // Esconde a notificação após 4 segundos
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 4000);
      
      // Programa a próxima notificação (entre 20 e 40 segundos)
      clearTimeout(notificationTimeout);
      const nextInterval = Math.floor(Math.random() * (40000 - 20000) + 20000);
      notificationTimeout = setTimeout(showNotification, nextInterval);
    };
    
    // Inicia o ciclo de notificações após 10 segundos
    notificationTimeout = setTimeout(showNotification, 10000);

    return () => {
      clearTimeout(notificationTimeout);
      clearTimeout(hideTimeout);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-3 z-50 flex items-center max-w-xs transform ${isVisible ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-500 ease-in-out`}>
      <div className="bg-green-100 rounded-full p-2 mr-3">
        <Icon name="fas fa-shopping-cart" className="text-green-600" />
      </div>
      <p className="text-gray-700 text-sm">
        <strong>{buyerInfo.nome}</strong> de {buyerInfo.local} acabou de comprar
      </p>
    </div>
  );
});

RecentPurchaseNotifications.displayName = 'RecentPurchaseNotifications';

// Componente para indicador de visualizações
const ViewerCounter = memo(({ count }: { count: number }) => (
  <div className="mt-6 bg-red-50 border border-red-100 rounded-md p-3 flex items-center justify-center animate-pulse">
    <div className="text-red-500 mr-2">
      <Icon name="fas fa-eye" />
    </div>
    <p className="text-sm font-medium text-gray-700">
      <span className="font-bold">{count} pessoas</span> estão vendo este produto agora!
    </p>
  </div>
));

ViewerCounter.displayName = 'ViewerCounter';

// Component de fallback para o FAQ quando o lazy loading falha
const StaticFAQSection = () => (
  <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <span className="inline-block bg-yellow-100 text-yellow-600 font-bold px-4 py-1 rounded-full mb-3">
          DÚVIDAS COMUNS
        </span>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Perguntas Frequentes</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Tire todas as suas dúvidas sobre a EcoEsponja Mágica e faça uma escolha informada
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-green-700 mb-3 flex items-center">
            <SimpleIcon name="fas fa-question-circle" className="text-green-500 mr-3" />
            Quanto tempo dura a EcoEsponja Mágica?
          </h3>
          <p className="text-gray-700">Com os cuidados adequados, a EcoEsponja Mágica pode durar até 12 meses de uso diário, substituindo até 12 esponjas tradicionais.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-green-700 mb-3 flex items-center">
            <SimpleIcon name="fas fa-question-circle" className="text-green-500 mr-3" />
            Como conservar minha EcoEsponja?
          </h3>
          <p className="text-gray-700">Após o uso, enxágue bem com água corrente e deixe secar naturalmente em local arejado.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-green-700 mb-3 flex items-center">
            <SimpleIcon name="fas fa-question-circle" className="text-green-500 mr-3" />
            A EcoEsponja Mágica é adequada para todas as superfícies?
          </h3>
          <p className="text-gray-700">Sim! A EcoEsponja Mágica é segura para uso em vidros, espelhos, cerâmicas, inox, madeira tratada, plásticos e panelas antiaderentes.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-green-700 mb-3 flex items-center">
            <SimpleIcon name="fas fa-question-circle" className="text-green-500 mr-3" />
            Qual o prazo de entrega?
          </h3>
          <p className="text-gray-700">As entregas são realizadas em todo Brasil, com prazo médio de 3 a 7 dias úteis para capitais e de 7 a 15 dias para demais localidades.</p>
        </div>
      </div>

      <div className="text-center mt-10">
        <a href="#comprar" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block shadow-md">
          QUERO COMPRAR AGORA
        </a>
      </div>
    </div>
  </section>
);

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [unidadesRestantes, setUnidadesRestantes] = useState(37);
  const [isPageFullyLoaded, setIsPageFullyLoaded] = useState(false);

  // Efeito para inicializar visualizações após carregamento da página
  useEffect(() => {
    // Atrasar esta operação não crítica
    const timer = setTimeout(() => {
      // Gerar número aleatório de visualizações entre 15 e 30
      const randomViews = Math.floor(Math.random() * (30 - 15 + 1)) + 15;
      setViewerCount(randomViews);
      setIsPageFullyLoaded(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Efeito separado para funcionalidades secundárias, executado apenas após carregamento completo
  useEffect(() => {
    if (!isPageFullyLoaded) return;

    // Simulações com intervalos maiores para reduzir o trabalho do thread principal
    const viewerInterval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newCount = prev + change;
        return newCount < 10 ? 10 : (newCount > 35 ? 35 : newCount);
      });
    }, 60000); // Reduzido para uma vez por minuto

    const estoqueInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setUnidadesRestantes(prev => (prev > 1 ? prev - 1 : 1));
      }
    }, 120000); // Reduzido para uma vez a cada 2 minutos

    return () => {
      clearInterval(viewerInterval);
      clearInterval(estoqueInterval);
    };
  }, [isPageFullyLoaded]);

  // Efeito separado para o popup, adiado para não competir com o carregamento inicial
  useEffect(() => {
    if (!isPageFullyLoaded) return;

    // Popup de captura de leads após carregamento da página
    const popupTimeout = setTimeout(() => {
      setShowPopup(true);
    }, 6000);

    return () => clearTimeout(popupTimeout);
  }, [isPageFullyLoaded]);

  const handleSubmitLead = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aqui seria implementada a lógica de envio do lead para o backend
    setFormSubmitted(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  }, []);

  const closePopup = useCallback(() => {
    setShowPopup(false);
  }, []);

  return (
    <main>
      <MemoizedNavigation />

      {/* Pop-up de Captura de Leads - Otimizado para conversão */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md relative animate-fadeIn">
            <button 
              onClick={closePopup} 
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              aria-label="Fechar popup"
            >
              <Icon name="fas fa-times" className="text-xl" />
            </button>
            
            {!formSubmitted ? (
              <>
                <div className="text-center mb-6">
                  <div className="inline-block bg-red-500 text-white font-bold px-4 py-1 rounded-full mb-4 animate-pulse">
                    OFERTA EXCLUSIVA POR TEMPO LIMITADO!
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">GANHE 15% DE DESCONTO</h3>
                  <p className="text-gray-600">Nas suas primeiras EcoEsponjas Mágicas</p>
                </div>
                
                <form onSubmit={handleSubmitLead} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Seu melhor email:
                    </label>
                    <input 
                      type="email" 
                      id="email"
                      placeholder="Seu email para receber o cupom" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp para entrega rápida:
                    </label>
                    <input 
                      type="tel" 
                      id="whatsapp"
                      placeholder="(DDD) Número" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition-colors text-lg"
                  >
                    QUERO MEU DESCONTO AGORA
                  </button>

                  <div className="flex items-center justify-center text-xs text-gray-500 mt-2">
                    <Icon name="fas fa-lock" className="mr-1" />
                    <span>Seus dados estão 100% protegidos</span>
                  </div>
                </form>
                
                <div className="mt-4 border-t pt-4">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                    <span className="text-sm font-medium">3.521 pessoas avaliaram</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-5xl text-green-500 mb-4">
                  <Icon name="fas fa-check-circle" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Desconto Garantido!</h3>
                <p className="text-gray-600">Seu cupom <strong>PRIMEIRA15</strong> foi enviado para seu email.</p>
                <p className="text-gray-600 mt-2">Use-o agora mesmo e economize!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notificação de compra recente - Otimizada com prova social */}
      <RecentPurchaseNotifications />

      {/* Hero Section Otimizada - AIDA (Atenção, Interesse, Desejo, Ação) */}
      <section className="relative bg-gradient-to-r from-green-50 to-blue-50 py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
            <div className="text-left">
              {/* Atenção - Título com 4Us (Único, Útil, Ultraespecífico, Urgente) */}
              <div className="mb-3 inline-block bg-red-500 text-white font-bold px-4 py-1 rounded-full animate-pulse">
                ALERTA: Sua esponja atual pode estar prejudicando sua saúde!
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
                <span className="relative inline-block">
                  <span className="relative z-10">A ÚNICA Esponja</span>
                  <span className="absolute bottom-0 left-0 w-full h-3 bg-yellow-300 z-0 opacity-60"></span>
                </span> que 
                <span className="text-green-600 block mt-1">Protege Sua Família</span> 
                e Dura 12 Meses
              </h1>
              
              {/* Interesse - Uso do modelo PAS (Problema > Agitação > Solução) */}
              <p className="text-lg md:text-xl text-gray-700 mb-6 max-w-xl">
                Você sabia que esponjas comuns acumulam até <span className="font-bold text-red-600">362 tipos de bactérias</span> e podem contaminar toda sua cozinha? A 
                <span className="bg-green-600 text-white px-2 py-1 rounded mx-1 whitespace-nowrap">EcoEsponja Mágica</span> 
                elimina esse risco e ainda faz você <span className="font-bold">economizar mais de R$100 por ano!</span>
              </p>
              
              {/* Desejo - Benefícios claros com ícones */}
              <div className="flex flex-wrap gap-4 mb-8 max-w-xl">
                <div className="flex items-center bg-white py-2 px-3 rounded-lg shadow-sm">
                  <div className="text-green-600 mr-2">
                    <Icon name="fas fa-check-circle" className="text-xl" />
                  </div>
                  <span className="text-gray-700 font-medium">Dura 12 meses</span>
                </div>
                <div className="flex items-center bg-white py-2 px-3 rounded-lg shadow-sm">
                  <div className="text-green-600 mr-2">
                    <Icon name="fas fa-check-circle" className="text-xl" />
                  </div>
                  <span className="text-gray-700 font-medium">Antibacteriana</span>
                </div>
                <div className="flex items-center bg-white py-2 px-3 rounded-lg shadow-sm">
                  <div className="text-green-600 mr-2">
                    <Icon name="fas fa-check-circle" className="text-xl" />
                  </div>
                  <span className="text-gray-700 font-medium">Não risca nada</span>
                </div>
                <div className="flex items-center bg-white py-2 px-3 rounded-lg shadow-sm">
                  <div className="text-green-600 mr-2">
                    <Icon name="fas fa-check-circle" className="text-xl" />
                  </div>
                  <span className="text-gray-700 font-medium">Ecológica</span>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md mb-8 border-l-4 border-yellow-500">
                <div className="flex items-center">
                  <div className="text-yellow-500 mr-3">
                    <Icon name="fas fa-shipping-fast" className="text-2xl" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Frete Grátis em Compras Acima de R$ 99,90</p>
                    <p className="text-sm text-gray-600">+ Garantia de 7 dias ou seu dinheiro de volta</p>
                  </div>
                </div>
              </div>
              
              {/* Ação - Botões CTA Otimizados */}
              <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
                <a href="#comprar" className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg inline-flex items-center justify-center transition-all transform hover:scale-105 text-lg w-full sm:w-auto">
                  <Icon name="fas fa-shopping-cart" className="mr-2" /> 
                  QUERO PROTEGER MINHA FAMÍLIA
                </a>
                <a href="#beneficios" className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-6 rounded-lg inline-flex items-center justify-center hover:bg-gray-50 transition-colors w-full sm:w-auto">
                  <Icon name="fas fa-info-circle" className="mr-2" />
                  Ver Benefícios
                </a>
              </div>

              {/* Contador de visualizações em tempo real - Escassez */}
              <ViewerCounter count={viewerCount} />
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
            <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden">
              {/* Imagem principal otimizada com Next/Image */}
              <Image
                src="/img/esponjaetexto.webp"
                alt="EcoEsponja Mágica em uso"
                width={600}
                height={400}
                priority={true}
                className="w-full object-contain"
              />
              
              <div className="absolute top-4 right-4 bg-red-600 text-white font-bold text-xl py-3 px-4 rounded-full transform rotate-12 shadow-md">
                50% OFF
              </div>

              <div className="absolute top-4 left-4 bg-green-600 text-white text-sm py-1 px-3 rounded-full shadow-md">
                <Icon name="fas fa-shield-alt" className="mr-1" /> Anti-bacteriana
              </div>
            </div>
            
            <div className="mt-6 bg-white rounded-lg p-4 shadow-md mx-auto max-w-sm text-center">
              <div className="flex justify-between mb-1">
                <span className="font-bold text-yellow-500">⭐⭐⭐⭐⭐</span>
                <span className="text-green-600 font-semibold">3.521 avaliações</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: '97%' }}></div>
              </div>
              <p className="text-sm mt-2 text-gray-600 font-medium">97% dos clientes recomendam!</p>
            </div>

            {/* Selos de Credibilidade */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="bg-white p-2 rounded-md shadow-sm flex items-center justify-center">
                <Icon name="fas fa-lock" className="text-green-600 text-2xl" />
                <span className="ml-2 text-sm font-medium">Pagamento Seguro</span>
              </div>
              <div className="bg-white p-2 rounded-md shadow-sm flex items-center justify-center">
                <Icon name="fas fa-leaf" className="text-green-600 text-2xl" />
                <span className="ml-2 text-sm font-medium">Certificado Eco</span>
              </div>
              <div className="bg-white p-2 rounded-md shadow-sm flex items-center justify-center">
                <Icon name="fas fa-shipping-fast" className="text-green-600 text-2xl" />
                <span className="ml-2 text-sm font-medium">Entrega Prime</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-6 bg-wave-pattern bg-repeat-x opacity-20"></div>
      </section>

      {/* Problemas das Esponjas Comuns - Abordagem PAS (Problema > Agitação > Solução) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block bg-red-100 text-red-600 font-bold px-4 py-1 rounded-full mb-3">
              ALERTA DE SAÚDE
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">O Perigo Escondido na Sua Pia</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              A esponja mais contaminada da sua casa não está no banheiro. Está na sua cozinha, tocando pratos, talheres e superfícies onde você prepara alimentos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-red-50 p-6 rounded-lg shadow-md border-t-4 border-red-600 transform transition-transform hover:scale-105">
              <div className="text-red-600 text-5xl mb-4 flex justify-center">
                <Icon name="fas fa-virus" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-red-700 text-center">Foco de Bactérias</h3>
              <p className="text-gray-700">Uma única esponja comum pode abrigar mais de <strong className="text-red-600">362 tipos de bactérias</strong>, incluindo E. coli e Salmonella, que podem causar doenças graves.</p>
            </div>
            
            <div className="bg-red-50 p-6 rounded-lg shadow-md border-t-4 border-red-600 transform transition-transform hover:scale-105">
              <div className="text-red-600 text-5xl mb-4 flex justify-center">
                <Icon name="fas fa-money-bill-wave-alt" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-red-700 text-center">Desperdício Financeiro</h3>
              <p className="text-gray-700">Você troca esponjas a cada semana? Isso custa até <strong className="text-red-600">R$ 144,00 por ano</strong>, dinheiro que poderia economizar para outras necessidades da sua família.</p>
            </div>
            
            <div className="bg-red-50 p-6 rounded-lg shadow-md border-t-4 border-red-600 transform transition-transform hover:scale-105">
              <div className="text-red-600 text-5xl mb-4 flex justify-center">
                <Icon name="fas fa-allergies" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-red-700 text-center">Risco de Alergias</h3>
              <p className="text-gray-700">Esponjas comuns podem desencadear reações alérgicas na pele sensível e problemas respiratórios devido aos resíduos e bactérias acumulados.</p>
            </div>
          </div>

          <div className="text-center mt-10">
            <a href="#comprar" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg inline-flex items-center justify-center transition-all shadow-lg">
              <Icon name="fas fa-shield-alt" className="mr-2" /> PROTEJA SUA FAMÍLIA AGORA
            </a>
          </div>
        </div>
      </section>

      {/* O Perigo Invisível das Esponjas Comuns - Versão Aprimorada */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-red-100 border-l-4 border-red-500 p-6">
              <h2 className="text-3xl font-bold text-red-600 mb-6 flex items-center">
                <Icon name="fas fa-biohazard" className="text-red-600 mr-3 text-4xl" /> 
                Sua Esponja Está Colocando Sua Família em Risco?
              </h2>
              <p className="text-lg text-gray-700 mb-3">A ciência comprova: a esponja de lavar louça que está na sua pia é um dos itens mais contaminados da sua casa, mais sujo que o assento do seu vaso sanitário!</p>
              <p className="text-lg text-gray-700 mb-3"><strong className="text-red-600">Pior:</strong> você a usa para "limpar" pratos, talheres e copos que sua família leva à boca todos os dias.</p>
            </div>
            
            <div className="p-6 flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                {/* Imagem otimizada com next/image */}
                <Image 
                  src="/img/bacterias.webp" 
                  alt="Bactérias em esponjas comuns"
                  width={400}
                  height={300}
                  className="rounded-lg w-full shadow-md"
                />
                <div className="mt-4 bg-yellow-50 p-3 rounded border border-yellow-200">
                  <p className="text-sm text-gray-700 italic">Imagem microscópica real de bactérias encontradas em esponjas de cozinha comuns após apenas 7 dias de uso.</p>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-700 mb-6 text-lg">Segundo um estudo publicado na revista científica <strong>Nature</strong>, uma esponja convencional pode abrigar mais de <strong className="text-red-600 font-bold text-xl">362 tipos diferentes de bactérias</strong>, muitas delas causadoras de doenças graves como:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3">
                    <Icon name="fas fa-virus" className="text-red-600 mt-1 text-xl" /> 
                    <div>
                      <span className="font-bold text-red-800">E. coli</span>
                      <p className="text-sm text-gray-700">Causa infecções intestinais e intoxicações alimentares</p>
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3">
                    <Icon name="fas fa-virus" className="text-red-600 mt-1 text-xl" /> 
                    <div>
                      <span className="font-bold text-red-800">Salmonella</span>
                      <p className="text-sm text-gray-700">Responsável por diarreias graves e febres</p>
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3">
                    <Icon name="fas fa-virus" className="text-red-600 mt-1 text-xl" /> 
                    <div>
                      <span className="font-bold text-red-800">Staphylococcus</span>
                      <p className="text-sm text-gray-700">Pode provocar infecções de pele e intoxicações</p>
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3">
                    <Icon name="fas fa-virus" className="text-red-600 mt-1 text-xl" /> 
                    <div>
                      <span className="font-bold text-red-800">Campylobacter</span>
                      <p className="text-sm text-gray-700">Causa gastroenterite e dores abdominais intensas</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-pink-50 p-5 rounded-lg border-l-4 border-red-300 mb-6">
                  <Icon name="fas fa-quote-left" className="text-red-400 mb-2 text-xl" />
                  <p className="text-gray-700 mb-2">"Esponjas de cozinha são verdadeiros reservatórios de micro-organismos. Um estudo da Universidade de Furtwangen comprovou que nem mesmo ferver ou usar micro-ondas elimina todas as bactérias."</p>
                  <p className="text-sm text-gray-500">— Dr. Markus Egert, Microbiologista</p>
                </div>
                
                <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
                  <h3 className="font-bold text-green-700 text-lg mb-2">A Solução Definitiva Chegou:</h3>
                  <p className="text-green-700 font-medium">
                    A <strong>EcoEsponja Mágica</strong> é feita com material antibacteriano especial que impede a proliferação de bactérias, seca rapidamente e é super fácil de higienizar — protegendo você e sua família contra doenças transmitidas por esponjas contaminadas.
                  </p>
                  <div className="mt-4">
                    <a href="#comprar" 
                      className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md">
                      <Icon name="fas fa-shield-alt" className="mr-2" /> QUERO PROTEÇÃO PARA MINHA FAMÍLIA
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apresentando a Solução - Seção Otimizada */}
      <section className="py-16 bg-white" id="solucao">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block bg-green-100 text-green-600 font-bold px-4 py-1 rounded-full mb-3">
              A SOLUÇÃO DEFINITIVA
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Apresentando a Revolucionária EcoEsponja Mágica</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Desenvolvida com tecnologia antibacteriana avançada para oferecer limpeza superior, durabilidade excepcional e proteção para sua família.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto rounded-lg overflow-hidden shadow-xl mb-12">
            <div className="aspect-w-16 aspect-h-9 bg-black">
              {/* Vídeo otimizado com múltiplos formatos */}
              <video 
                className="w-full" 
                controls 
                poster="/img/background.webp"
                muted
                preload="none"
                loading="lazy"
                playsInline
              >
                <source src="/videos/ads.webm" type="video/webm" />
                <source src="/videos/ads.mp4" type="video/mp4" />
                Seu navegador não suporta a reprodução de vídeos.
              </video>
            </div>
            <div className="bg-black text-white py-2 px-4 text-center text-sm">
              <p><Icon name="fas fa-play-circle" className="mr-1" /> Veja como a EcoEsponja Mágica está transformando a vida de milhares de brasileiros</p>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg shadow-md max-w-3xl mx-auto mb-10">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Icon name="fas fa-lightbulb" className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-blue-800">Você Sabia?</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Uma única <span className="font-bold">EcoEsponja Mágica</span> substitui até <span className="bg-green-600 text-white px-2 py-1 rounded">12 esponjas comuns</span>, 
              economizando seu dinheiro e reduzindo drasticamente o lixo que vai para os oceanos.
            </p>
            <p className="text-gray-700">
              Além disso, nossa tecnologia antibacteriana elimina <span className="font-bold">99,9% das bactérias</span> que normalmente proliferam em esponjas tradicionais, protegendo sua família de contaminações.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <a href="#comprar" className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-lg transition-colors shadow-lg text-xl flex items-center">
              <Icon name="fas fa-check-circle" className="mr-2" /> 
              QUERO EXPERIMENTAR A ECOESPONJA
            </a>
          </div>
        </div>
      </section>

      {/* Economize de Verdade - Seção Otimizada */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-yellow-100 text-yellow-700 font-bold px-4 py-1 rounded-full mb-3">
              ECONOMIA COMPROVADA
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <Icon name="fas fa-coins" className="text-yellow-500 mr-3 text-4xl" /> Economize Mais de R$100 Por Ano
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              O investimento inteligente que protege seu bolso e sua família ao mesmo tempo. Veja a comparação:
            </p>
          </div>
          
          {/* Tabela econômica responsiva */}
          <div className="max-w-3xl mx-auto overflow-x-auto bg-white rounded-lg shadow-lg mb-12">
            <table className="w-full min-w-full">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="py-4 px-3 md:px-6 text-left font-bold text-sm md:text-lg">Tipo de Esponja</th>
                  <th className="py-4 px-2 md:px-6 text-center font-bold text-sm md:text-lg">Duração</th>
                  <th className="py-4 px-3 md:px-6 text-right font-bold text-sm md:text-lg">Gasto Anual</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-red-50">
                  <td className="py-4 md:py-5 px-3 md:px-6 text-left">
                    <div className="flex items-center">
                      <Icon name="fas fa-times-circle" className="text-red-500 mr-2" />
                      <span className="text-sm md:text-base">Esponja comum</span>
                    </div>
                  </td>
                  <td className="py-4 md:py-5 px-2 md:px-6 text-center text-sm md:text-base">1 semana</td>
                  <td className="py-4 md:py-5 px-3 md:px-6 text-right font-semibold text-red-600 text-lg md:text-xl">R$ 144,00</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="py-4 md:py-5 px-3 md:px-6 text-left font-semibold text-green-700">
                    <div className="flex items-center">
                      <Icon name="fas fa-check-circle" className="text-green-500 mr-2" />
                      <span className="text-sm md:text-base">EcoEsponja Mágica</span>
                    </div>
                  </td>
                  <td className="py-4 md:py-5 px-2 md:px-6 text-center text-sm md:text-base">12 meses</td>
                  <td className="py-4 md:py-5 px-3 md:px-6 text-right font-bold text-green-700 text-lg md:text-2xl">R$ 39,90</td>
                </tr>
              </tbody>
              <tfoot className="bg-gray-100">
                <tr>
                  <td colSpan={2} className="py-3 md:py-4 px-3 md:px-6 text-right font-bold text-sm md:text-base">Sua economia anual:</td>
                  <td className="py-3 md:py-4 px-3 md:px-6 text-right font-bold text-green-600 text-lg md:text-xl">R$ 104,10</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Versão alternativa para dispositivos muito pequenos */}
          <div className="md:hidden max-w-xs mx-auto mb-8">
            <div className="mb-4 bg-white rounded-lg shadow-md p-4">
              <h4 className="font-bold text-lg text-center mb-2">Economia Comparativa</h4>
              <p className="text-center text-gray-700 mb-2">Veja quanto você economiza ao ano:</p>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-medium">Esponjas comuns:</span>
                <span className="text-red-600 font-bold">R$ 144,00</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-medium">EcoEsponja Mágica:</span>
                <span className="text-green-700 font-bold">R$ 39,90</span>
              </div>
              <div className="flex justify-between items-center pt-2 mt-2 border-t border-green-500">
                <span className="font-bold">Sua economia:</span>
                <span className="text-green-600 font-bold text-xl">R$ 104,10</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white p-5 rounded-lg shadow-md flex flex-col items-center text-center transform transition-transform hover:scale-105">
              <div className="text-4xl text-green-500 mb-3">
                <Icon name="fas fa-wallet" />
              </div>
              <h3 className="font-bold text-lg mb-2">Economia para Seu Bolso</h3>
              <p className="text-gray-700">Reduza seus gastos com produtos de limpeza em mais de R$100 por ano.</p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-md flex flex-col items-center text-center transform transition-transform hover:scale-105">
              <div className="text-4xl text-green-500 mb-3">
                <Icon name="fas fa-heart" />
              </div>
              <h3 className="font-bold text-lg mb-2">Proteção para Sua Família</h3>
              <p className="text-gray-700">Material antibacteriano que elimina 99,9% dos germes nocivos à saúde.</p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-md flex flex-col items-center text-center transform transition-transform hover:scale-105">
              <div className="text-4xl text-green-500 mb-3">
                <Icon name="fas fa-globe-americas" />
              </div>
              <h3 className="font-bold text-lg mb-2">Menos Lixo no Planeta</h3>
              <p className="text-gray-700">Reduza seu impacto ambiental eliminando dezenas de esponjas descartáveis.</p>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto bg-yellow-50 p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-6 border-l-4 border-yellow-500">
            <div className="text-5xl text-yellow-500">
              <i className="fas fa-lightbulb"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700 mb-2">Uma família média gasta R$432 por ano com esponjas!</p>
              <p className="text-gray-700">Com o kit família da EcoEsponja Mágica (3 unidades), você economiza mais de R$330 anualmente enquanto protege a saúde da sua família.</p>
              <div className="flex items-center mt-3 text-green-600">
                <i className="fas fa-check-circle mr-2"></i>
                <span className="font-medium">Investimento inteligente que se paga em menos de 1 mês</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <a href="#comprar" 
               className="bg-green-600 hover:bg-green-700 text-white py-4 px-10 rounded-lg font-bold transition-colors inline-block text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              QUERO ECONOMIZAR R$100+ POR ANO
            </a>
          </div>
        </div>
      </section>

      {/* Benefícios da EcoEsponja - Seção Otimizada */}
      <section className="py-16 bg-white" id="beneficios">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-green-100 text-green-600 font-bold px-4 py-1 rounded-full mb-3">
              BENEFÍCIOS EXCLUSIVOS
            </span>
            <h2 className="text-3xl font-bold mb-4 text-gray-800 flex items-center justify-center">
              <i className="fas fa-star text-yellow-400 mr-3 text-4xl"></i> 6 Motivos Para Escolher a EcoEsponja Agora
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Descubra por que mais de 50.000 famílias brasileiras já substituíram suas esponjas comuns pela revolucionária EcoEsponja Mágica:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Benefício 1 */}
            <div className="bg-blue-50 rounded-lg shadow-md p-8 border-t-4 border-blue-500 transform transition hover:scale-105">
              <div className="text-4xl mb-4 text-blue-500">
                <i className="fas fa-tint"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-blue-700">Super Absorção</h3>
              <p className="text-gray-700">Absorve até <strong>10x mais líquido</strong> que esponjas comuns, facilitando a limpeza e reduzindo o tempo gasto em tarefas domésticas.</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-gray-700">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Captura derramamentos rapidamente</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Seca superfícies em segundos</span>
                </li>
              </ul>
            </div>

            {/* Benefício 2 */}
            <div className="bg-green-50 rounded-lg shadow-md p-8 border-t-4 border-green-500 transform transition hover:scale-105">
              <div className="text-4xl mb-4 text-green-500">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-green-700">Durabilidade Incrível</h3>
              <p className="text-gray-700">Dura até <strong>12 meses</strong> sem perder a qualidade, substituindo dezenas de esponjas tradicionais e economizando seu dinheiro.</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-gray-700">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Não desfaz mesmo com uso intenso</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Mantém a eficiência por 1 ano</span>
                </li>
              </ul>
            </div>

            {/* Benefício 3 */}
            <div className="bg-purple-50 rounded-lg shadow-md p-8 border-t-4 border-purple-500 transform transition hover:scale-105">
              <div className="text-4xl mb-4 text-purple-500">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-purple-700">Anti-Bacteriana</h3>
              <p className="text-gray-700">Material especial que <strong>elimina 99,9% das bactérias</strong>, mantendo sua cozinha mais segura e protegendo a saúde da sua família.</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-gray-700">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Previne contaminação cruzada</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Não desenvolve odores desagradáveis</span>
                </li>
              </ul>
            </div>

            {/* Benefício 4 - Os outros 3 benefícios foram omitidos para manter a brevidade do código */}
            <div className="bg-yellow-50 rounded-lg shadow-md p-8 border-t-4 border-yellow-500 transform transition hover:scale-105">
              <div className="text-4xl mb-4 text-yellow-500">
                <i className="fas fa-layer-group"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-yellow-700">Multiuso</h3>
              <p className="text-gray-700">Funciona em <strong>qualquer superfície</strong> - vidros, cerâmica, aço inox, madeira e muito mais, sem riscar ou danificar.</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-gray-700">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Ideal para panelas antiaderentes</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Perfeita para superfícies delicadas</span>
                </li>
              </ul>
            </div>

            {/* Benefício 5 */}
            <div className="bg-red-50 rounded-lg shadow-md p-8 border-t-4 border-red-500 transform transition hover:scale-105">
              <div className="text-4xl mb-4 text-red-500">
                <i className="fas fa-recycle"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-700">Ecológica</h3>
              <p className="text-gray-700">Produzida com materiais <strong>sustentáveis e biodegradáveis</strong>, reduzindo significativamente seu impacto ambiental.</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-gray-700">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Reduz resíduos plásticos</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Decomposição natural após o descarte</span>
                </li>
              </ul>
            </div>

            {/* Benefício 6 */}
            <div className="bg-teal-50 rounded-lg shadow-md p-8 border-t-4 border-teal-500 transform transition hover:scale-105">
              <div className="text-4xl mb-4 text-teal-500">
                <i className="fas fa-spray-can"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-teal-700">Limpa Sem Químicos</h3>
              <p className="text-gray-700">Seu design especial permite <strong>limpeza eficiente</strong> usando apenas água, reduzindo o uso de produtos químicos em sua casa.</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-gray-700">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Ideal para famílias com crianças</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Perfeita para pessoas com alergias</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <a href="#comprar" 
               className="bg-green-600 hover:bg-green-700 text-white py-4 px-10 rounded-lg font-bold transition duration-300 inline-block text-xl shadow-lg hover:shadow-xl">
              QUERO TODOS ESSES BENEFÍCIOS <i className="fas fa-arrow-right ml-2"></i>
            </a>
            <p className="text-gray-500 mt-3 text-sm">
              <i className="fas fa-lock mr-1"></i> Compra 100% segura | Entrega para todo Brasil | Garantia de 7 dias
            </p>
          </div>
        </div>
      </section>

      {/* Depoimentos - Seção Otimizada para Prova Social */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-blue-600 font-semibold text-lg block mb-1">HISTÓRIAS REAIS DE CLIENTES</span>
            <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <i className="fas fa-comments text-yellow-500 mr-3 text-4xl"></i> 
              O Que Dizem os +50.000 Clientes Satisfeitos
            </h2>
            <div className="flex items-center justify-center mb-4">
              <span className="text-yellow-500 text-2xl mr-2">⭐⭐⭐⭐⭐</span>
              <span className="text-gray-700 font-bold">4.9/5</span>
              <span className="text-green-600 font-medium ml-2">(3.521 avaliações verificadas)</span>
            </div>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Veja como a EcoEsponja Mágica transformou a rotina de limpeza e a saúde de milhares de famílias brasileiras:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Depoimento 1 - Otimizado com imagens locais */}
            <div className="bg-white rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105 border-b-4 border-blue-500">
              <div className="flex justify-between mb-4">
                <div className="text-yellow-400 flex">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <span className="text-blue-500">
                  <i className="fab fa-facebook text-xl"></i>
                </span>
              </div>
              <p className="text-gray-700 italic mb-5">
                "Meu filho tem alergia respiratória e sempre piorava quando eu limpava a casa. Descobri que as esponjas comuns estavam liberando bactérias e causando as crises. Com a EcoEsponja, já são 3 meses sem nenhuma crise alérgica! Além disso, economizei muito dinheiro."
              </p>
              <div className="flex items-center">
                {/* Imagem otimizada local em vez de API externa */}
                <Image 
                  src="/img/testimonials/user1.webp" 
                  alt="Maria Cristina" 
                  width={48} 
                  height={48} 
                  className="rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-800">Maria Cristina</h4>
                  <p className="text-sm text-gray-500">São Paulo, SP • Cliente há 6 meses</p>
                </div>
              </div>
              <div className="mt-3 bg-blue-50 p-2 rounded-md text-sm">
                <span className="font-medium text-blue-700">
                  <i className="fas fa-thumbs-up mr-1"></i> Comprou: Kit Família (3 unidades)
                </span>
              </div>
            </div>

            {/* Depoimento 2 */}
            <div className="bg-white rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105 border-b-4 border-purple-500">
              <div className="flex justify-between mb-4">
                <div className="text-yellow-400 flex">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <span className="text-purple-500">
                  <i className="fab fa-instagram text-xl"></i>
                </span>
              </div>
              <p className="text-gray-700 italic mb-5">
                "Trabalho com gastronomia e precisava de uma solução que não riscasse minhas panelas caras. A EcoEsponja é simplesmente perfeita! Já tem 8 meses que uso a mesma e ela continua como nova. Já economizei mais de R$120 em esponjas e meus utensílios continuam impecáveis."
              </p>
              <div className="flex items-center">
                {/* Imagem otimizada local */}
                <Image 
                  src="/img/testimonials/user2.webp" 
                  alt="Roberto Silva" 
                  width={48} 
                  height={48}
                  className="rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-800">Roberto Silva</h4>
                  <p className="text-sm text-gray-500">Recife, PE • Cliente há 10 meses</p>
                </div>
              </div>
              <div className="mt-3 bg-purple-50 p-2 rounded-md text-sm">
                <span className="font-medium text-purple-700">
                  <i className="fas fa-thumbs-up mr-1"></i> Comprou: Kit Economia (6 unidades)
                </span>
              </div>
            </div>

            {/* Depoimento 3 */}
            <div className="bg-white rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105 border-b-4 border-green-500">
              <div className="flex justify-between mb-4">
                <div className="text-yellow-400 flex">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <span className="text-green-500">
                  <i className="fab fa-whatsapp text-xl"></i>
                </span>
              </div>
              <p className="text-gray-700 italic mb-5">
                "Sou alérgica e sempre tive problemas com as esponjas comuns que desenvolviam aquele cheiro horrível depois de poucos dias. A EcoEsponja foi uma salvação! Já estou no 5º mês usando a mesma esponja, sem odores e sem reações na minha pele sensível. Recomendo demais!"
              </p>
              <div className="flex items-center">
                {/* Imagem otimizada local */}
                <Image 
                  src="/img/testimonials/user3.webp" 
                  alt="Juliana Alves" 
                  width={48} 
                  height={48}
                  className="rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-800">Juliana Alves</h4>
                  <p className="text-sm text-gray-500">Curitiba, PR • Cliente há 7 meses</p>
                </div>
              </div>
              <div className="mt-3 bg-green-50 p-2 rounded-md text-sm">
                <span className="font-medium text-green-700">
                  <i className="fas fa-thumbs-up mr-1"></i> Comprou: Kit Família (3 unidades)
                </span>
              </div>
            </div>
          </div>

          {/* Prova Social Adicional - Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <div className="bg-white rounded-lg shadow-md p-5 text-center border-t-4 border-green-500">
              <div className="text-green-500 text-3xl font-bold mb-2">50.000+</div>
              <p className="text-gray-700 font-medium">Clientes satisfeitos em todo o Brasil</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 text-center border-t-4 border-green-500">
              <div className="text-green-500 text-3xl font-bold mb-2">98%</div>
              <p className="text-gray-700 font-medium">Taxa de satisfação após o primeiro uso</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 text-center border-t-4 border-green-500">
              <div className="text-green-500 text-3xl font-bold mb-2">600.000+</div>
              <p className="text-gray-700 font-medium">Esponjas comuns não foram para o lixo</p>
            </div>
          </div>

          <div className="mt-12 bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto border-l-4 border-yellow-500">
            <div className="flex items-center text-yellow-500 mb-3">
              <i className="fas fa-award text-3xl mr-3"></i>
              <span className="font-bold text-lg">GARANTIA DE SATISFAÇÃO</span>
            </div>
            <p className="text-gray-700 mb-3">
              Acreditamos tanto na qualidade da EcoEsponja que oferecemos <strong>7 dias de garantia incondicional</strong>. Se por qualquer motivo você não ficar 100% satisfeito, devolvemos seu dinheiro, sem perguntas e sem burocracia.
            </p>
            <div className="flex items-center mt-1 text-green-600">
              <i className="fas fa-check-circle mr-2"></i>
              <span className="font-medium">98% dos clientes continuam usando após o período de garantia</span>
            </div>
          </div>

          <div className="text-center mt-10">
            <a href="#comprar" 
               className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white py-4 px-10 rounded-lg font-bold text-xl shadow-lg transform transition duration-300 hover:-translate-y-1 inline-flex items-center">
              <i className="fas fa-check-circle mr-2"></i> QUERO OS MESMOS RESULTADOS
            </a>
            <p className="text-gray-500 mt-3 text-sm">
              <i className="fas fa-lock mr-1"></i> Compra 100% segura e criptografada
            </p>
          </div>
        </div>
      </section>

      {/* Oferta Especial de Lançamento - Otimizada */}
      <section className="py-16 bg-white" id="comprar">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Oferta Especial de Lançamento</h2>
                <p className="text-lg text-gray-700">Promoção por tempo limitado - Não perca essa oportunidade!</p>
              </div>
              
              <div className="text-center mb-8">
                <p className="text-gray-700 mb-4">Esta oferta termina em:</p>
                <CountdownTimer />
              </div>
              
              {/* Pacotes de produtos - otimizados com imagens Next.js */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-gray-50 p-6 rounded-lg">
                {/* Pacote Básico */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-blue-50 p-4 text-center">
                    <h3 className="font-bold text-xl text-blue-700">1 UNIDADE</h3>
                    <p className="text-sm text-blue-500">Para experimentar</p>
                  </div>
                  <div className="p-6 flex flex-col items-center">
                    <div className="w-32 h-32 mb-4">
                      {/* Imagem otimizada */}
                      <Image 
                        src="/img/esponja1.webp" 
                        alt="EcoEsponja Mágica" 
                        width={128}
                        height={128}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <div className="text-center mb-4">
                      <p className="text-3xl font-bold text-gray-800">R$ 39,90</p>
                      <p className="text-sm text-gray-600">ou 3x de R$ 13,30 sem juros</p>
                    </div>
                    
                    <ul className="w-full mb-6 space-y-2">
                      <li className="flex items-center">
                        <i className="fas fa-check text-green-500 mr-2"></i>
                        <span className="text-gray-700">1 EcoEsponja Mágica</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-check text-green-500 mr-2"></i>
                        <span className="text-gray-700">Manual de instruções</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-check text-green-500 mr-2"></i>
                        <span className="text-gray-700">Garantia de 7 dias</span>
                      </li>
                    </ul>
                    
                    <a href="https://seguro.vitrinedaserra.com.br/r/H8EGQ51RUZ" 
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-4 rounded-md font-bold text-lg">
                      COMPRAR
                    </a>
                  </div>
                </div>
                
                {/* Pacote Família - MAIS POPULAR */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-green-500 transform scale-105 relative z-10">
                  <div className="absolute -top-4 mt-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs md:text-sm font-bold px-4 py-1 rounded-full shadow-md ">
                    MAIS VENDIDO
                  </div>
                  <div className="bg-green-50 p-4 text-center">
                    <h3 className="font-bold text-xl text-green-700">3 UNIDADES</h3>
                    <p className="text-sm text-green-500">Recomendado para famílias</p>
                  </div>
                  <div className="p-6 flex flex-col items-center">
                    <div className="w-32 h-32 mb-4 relative">
                      <div className="absolute -right-4 -top-4 bg-red-500 text-white text-xs font-bold rounded-full h-12 w-12 flex items-center justify-center shadow-md transform rotate-12">
                        15%<br/>OFF
                      </div>
                      {/* Imagem otimizada */}
                      <Image 
                        src="/img/esponja1.webp" 
                        alt="EcoEsponja Mágica" 
                        width={128}
                        height={128}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-500 line-through">De R$ 119,70</p>
                      <p className="text-3xl font-bold text-green-600">Por R$ 99,90</p>
                      <p className="text-sm text-gray-600">ou 3x de R$ 33,30 sem juros</p>
                    </div>
                    
                    <ul className="w-full mb-6 space-y-2">
                      <li className="flex items-center">
                        <i className="fas fa-check text-green-500 mr-2"></i>
                        <span className="text-gray-700 font-semibold">3 EcoEsponjas Mágicas</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-check text-green-500 mr-2"></i>
                        <span className="text-gray-700">Manual de instruções</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-check text-green-500 mr-2"></i>
                        <span className="text-gray-700">Suporte para armazenamento</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-check text-green-500 mr-2"></i>
                        <span className="text-gray-700 font-semibold">FRETE GRÁTIS</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-check text-green-500 mr-2"></i>
                        <span className="text-gray-700">Garantia de 7 dias</span>
                      </li>
                    </ul>
                    
                    <a href="https://seguro.vitrinedaserra.com.br/r/H8EGQ51RUZ" 
                      className="w-full bg-green-500 hover:bg-green-600 text-white text-center py-4 rounded-md font-bold text-lg">
                      COMPRAR AGORA
                    </a>
                  </div>
                </div>
                
                {/* Pacote Economia */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-purple-50 p-4 text-center">
                    <h3 className="font-bold text-xl text-purple-700">6 UNIDADES</h3>
                    <p className="text-sm text-purple-500">Melhor economia</p>
                  </div>
                  <div className="p-6 flex flex-col items-center">
                    <div className="w-32 h-32 mb-4 relative">
                      <div className="absolute -right-4 -top-4 bg-red-500 text-white text-xs font-bold rounded-full h-12 w-12 flex items-center justify-center shadow-md transform rotate-12">
                        25%<br/>OFF
                      </div>
                      {/* Imagem otimizada */}
                      <Image 
                        src="/img/esponja1.webp" 
                        alt="EcoEsponja Mágica" 
                        width={128}
                        height={128}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-500 line-through">De R$ 239,40</p>
                      <p className="text-3xl font-bold text-purple-600">Por R$ 179,90</p>
                      <p className="text-sm text-gray-600">ou 6x de R$ 29,98 sem juros</p>
                    </div>
                    
                    <ul className="w-full mb-6 space-y-2">
                      <li className="flex items-center">
                        <i className="fas fa-check text-green-500 mr-2"></i>
                        <span className="text-gray-700 font-semibold">6 EcoEsponjas Mágicas</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-check text-green-500 mr-2"></i>
                        <span className="text-gray-700">Manual de instruções</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-check text-green-500 mr-2"></i>
                        <span className="text-gray-700">Suporte para armazenamento</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-check text-green-500 mr-2"></i>
                        <span className="text-gray-700 font-semibold">FRETE GRÁTIS</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-check text-green-500 mr-2"></i>
                        <span className="text-gray-700">Garantia de 7 dias</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-gift text-purple-500 mr-2"></i>
                        <span className="text-purple-700 font-semibold">BRINDE EXCLUSIVO</span>
                      </li>
                    </ul>
                    
                    <a href="https://seguro.vitrinedaserra.com.br/r/H8EGQ51RUZ" 
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white text-center py-4 rounded-md font-bold text-lg">
                      COMPRAR
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nosso Compromisso com o Planeta - Seção com lazy loading */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block bg-green-100 text-green-600 font-bold px-4 py-1 rounded-full mb-3">
              RESPONSABILIDADE AMBIENTAL
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Faça Parte do Movimento por um Planeta Mais Limpo</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Ao escolher a EcoEsponja Mágica, você não está apenas melhorando sua experiência de limpeza, 
              mas também contribuindo para um futuro mais sustentável.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-10 max-w-5xl mx-auto">
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold text-green-700 mb-4">Uma Pequena Mudança, Um Grande Impacto</h3>
              <p className="text-gray-700 mb-4 text-lg">Cada EcoEsponja Mágica que você usa <strong>substitui até 12 esponjas tradicionais</strong>, reduzindo significativamente o volume de lixo nos aterros sanitários e oceanos.</p>
              <p className="text-gray-700 mb-6">Nosso material PVA de alta densidade é biodegradável e produzido com tecnologias sustentáveis que consomem menos água e energia em comparação com esponjas convencionais.</p>
              
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-bold text-green-700 mb-4">Impacto Ambiental em Números:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg">
                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                      <i className="fas fa-water text-xl"></i>
                    </div>
                    <div>
                      <span className="font-bold text-gray-800">500+ litros de água</span>
                      <p className="text-sm text-gray-700">Economia por domicílio anualmente</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg">
                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                      <i className="fas fa-trash-alt text-xl"></i>
                    </div>
                    <div>
                      <span className="font-bold text-gray-800">2kg de resíduos plásticos</span>
                      <p className="text-sm text-gray-700">Redução por família a cada ano</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg">
                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                      <i className="fas fa-tree text-xl"></i>
                    </div>
                    <div>
                      <span className="font-bold text-gray-800">1.000+ árvores plantadas</span>
                      <p className="text-sm text-gray-700">Através do nosso programa de reflorestamento</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg">
                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                      <i className="fas fa-industry text-xl"></i>
                    </div>
                    <div>
                      <span className="font-bold text-gray-800">65% menos energia</span>
                      <p className="text-sm text-gray-700">Utilizada na produção comparada a esponjas convencionais</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
                <p className="text-green-700 font-medium flex items-start">
                  <i className="fas fa-leaf text-green-600 mr-2 text-xl mt-1"></i> 
                  <span>Parte do valor de cada EcoEsponja vendida é destinada a projetos de limpeza dos oceanos e preservação ambiental. <strong>Ao comprar, você se torna parte desta missão.</strong></span>
                </p>
              </div>
              
              <div className="mt-6">
                <a href="#comprar" className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors">
                  <i className="fas fa-globe-americas mr-2"></i> FAZER PARTE DO MOVIMENTO
                </a>
              </div>
            </div>
            
            <div className="md:w-1/3 flex justify-center">
              {/* Imagem otimizada */}
              <Image 
                src="/img/background.webp" 
                alt="Impacto ambiental positivo"
                width={400}
                height={500}
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Como Comprar - Seção Otimizada */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 text-blue-600 font-bold px-4 py-1 rounded-full mb-3">
              PROCESSO SIMPLES
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Como Ter Sua EcoEsponja em 3 Passos</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Seu pedido será processado imediatamente e entregue com toda segurança em sua casa
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center gap-8 mb-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center transform transition-transform hover:scale-105">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">1</div>
              <div className="text-4xl text-green-600 mb-3">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Escolha Seu Kit</h3>
              <p className="text-gray-700">Selecione o melhor pacote para suas necessidades e clique em "Comprar Agora"</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center transform transition-transform hover:scale-105">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">2</div>
              <div className="text-4xl text-green-600 mb-3">
                <i className="fas fa-credit-card"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Pagamento Seguro</h3>
              <p className="text-gray-700">Escolha sua forma de pagamento preferida: cartão, boleto ou Pix - ambiente 100% seguro e criptografado</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center transform transition-transform hover:scale-105">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">3</div>
              <div className="text-4xl text-green-600 mb-3">
                <i className="fas fa-box"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Entrega Rápida</h3>
              <p className="text-gray-700">Receba seu produto em casa em até 7 dias úteis (capitais) ou 15 dias (demais localidades)</p>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto bg-green-50 p-6 rounded-lg shadow-md flex items-center gap-6">
            <div className="text-4xl text-green-600 hidden md:block">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-700 mb-2 flex items-center">
                <i className="fas fa-shield-alt text-green-600 mr-2 md:hidden"></i>
                Garantia de Satisfação 100%
              </h3>
              <p className="text-gray-700">Experimente a EcoEsponja Mágica sem riscos por 7 dias. Se por qualquer motivo você não ficar totalmente satisfeito, basta nos contatar para obter reembolso total. Nossos índices de devolução são mínimos: <strong>98% dos clientes se apaixonam pelo produto logo no primeiro uso.</strong></p>
            </div>
          </div>

          <div className="text-center mt-10">
            <a href="#comprar" className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-lg transition-colors inline-block text-xl shadow-lg transform hover:-translate-y-1">
              QUERO EXPERIMENTAR SEM RISCOS <i className="fas fa-arrow-right ml-2"></i>
            </a>
          </div>
        </div>
      </section>

      {/* Perguntas Frequentes - Seção carregada com lazy loading */}
      <StaticFAQSection />

      {/* CTA Final - Seção Otimizada */}
      <section className="py-16 bg-gradient-to-b from-green-50 to-green-100 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-sm font-bold bg-red-500 text-white rounded-full px-4 py-1 mb-4 animate-pulse">
              OFERTA POR TEMPO LIMITADO - ÚLTIMAS UNIDADES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Proteja Sua Família e Economize Mais de <span className="text-green-600">R$100 por Ano</span> com a EcoEsponja Mágica
            </h2>
            
            <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-6">
                <div className="text-left">
                  <p className="text-lg text-gray-700 mb-2">Kit Família - 3 Unidades + Frete Grátis</p>
                  <div className="flex items-center mb-3">
                    <span className="text-gray-400 line-through text-lg mr-3">De R$ 179,70</span>
                    <span className="text-3xl font-bold text-green-600">Por R$ 99,90</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                      <i className="fas fa-fire mr-1"></i> Últimas {unidadesRestantes} unidades
                    </div>
                    <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                      <i className="fas fa-shipping-fast mr-1"></i> Frete Grátis
                    </div>
                  </div>
                </div>
                
                {/* Imagem otimizada do produto */}
                <Image 
                  src="/img/esponja1.webp" 
                  alt="EcoEsponja Mágica" 
                  width={160}
                  height={160}
                  className="object-contain"
                />
                
                <div className="text-center md:text-right">
                  <div className="bg-yellow-100 text-yellow-700 p-3 rounded-lg mb-3">
                    <i className="fas fa-credit-card mr-2"></i>
                    <span className="font-semibold">Até 12x sem juros</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600 mb-1">
                      <i className="fas fa-shield-alt mr-1 text-green-500"></i> Garantia de 7 dias
                    </span>
                    <span className="text-sm text-gray-600 mb-2">
                      <i className="fas fa-lock mr-1"></i> Pagamento 100% seguro
                    </span>
                  </div>
                  <div className="flex justify-center md:justify-end">
                    <i className="fab fa-cc-visa mx-1 text-gray-600 text-2xl"></i>
                    <i className="fab fa-cc-mastercard mx-1 text-gray-600 text-2xl"></i>
                    <i className="fab fa-cc-amex mx-1 text-gray-600 text-2xl"></i>
                    <i className="fab fa-pix mx-1 text-gray-600 text-2xl"></i>
                  </div>
                </div>
              </div>
              
              <a 
                href="https://seguro.vitrinedaserra.com.br/r/H8EGQ51RUZ" 
                className="block w-full bg-green-600 hover:bg-green-700 text-white text-xl font-bold py-4 rounded-lg text-center shadow-lg transition-all transform hover:-translate-y-1">
                <i className="fas fa-shield-alt mr-2"></i> GARANTIR MINHA PROTEÇÃO AGORA
              </a>

              <p className="text-center text-sm text-gray-500 mt-3">
                <i className="fas fa-check-circle text-green-500 mr-1"></i> Mais de 50.000 famílias já estão protegidas
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                <div className="text-green-600 mr-3 text-2xl">
                  <i className="fas fa-truck-fast"></i>
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-800">Entrega Rápida</p>
                  <p className="text-sm text-gray-600">7-15 dias para todo Brasil</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                <div className="text-green-600 mr-3 text-2xl">
                  <i className="fas fa-undo"></i>
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-800">7 Dias de Garantia</p>
                  <p className="text-sm text-gray-600">Satisfação ou dinheiro de volta</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                <div className="text-green-600 mr-3 text-2xl">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-800">Compra Segura</p>
                  <p className="text-sm text-gray-600">Site protegido e verificado</p>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <p className="text-green-700 font-medium text-lg">
                Junte-se a milhares de brasileiros que já economizam, protegem suas famílias e contribuem para um planeta mais limpo com a EcoEsponja Mágica.
              </p>
            </div>
          </div>
        </div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-green-300 rounded-full opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-green-300 rounded-full opacity-20 transform translate-x-1/3 translate-y-1/3"></div>
      </section>
      
      {/* Footer - Seção Otimizada */}
      <MemoizedFooter />
    </main>
  )
}