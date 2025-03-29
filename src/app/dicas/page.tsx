'use client'

import React, { useState } from 'react'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import Banner, { AnalyticsData } from '../../components/Banner'
import Link from 'next/link'

export default function Dicas() {
  // Estado para armazenar logs de analytics (apenas para demonstração)
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsData[]>([]);
  
  // Função para lidar com eventos de visualização do banner
  const handleBannerView = (data: AnalyticsData) => {
    setAnalyticsEvents(prev => [...prev, data]);
    // Aqui você pode adicionar lógica adicional, como enviar para um backend
    console.log('Banner visualizado:', data);
  };
  
  // Função para lidar com cliques em CTAs
  const handleCtaClick = (data: AnalyticsData) => {
    setAnalyticsEvents(prev => [...prev, data]);
    // Aqui você pode adicionar lógica adicional, como registrar conversões
    console.log('CTA clicado:', data);
  };

  // Array de dicas de limpeza sustentável
  const dicas = [
    {
      id: 1,
      titulo: "Como limpar vidros sem produtos químicos",
      resumo: "Aprenda a deixar seus vidros brilhando usando apenas ingredientes naturais que você já tem em casa.",
      categoria: "Cozinha",
      icone: "fa-wine-glass",
      cor: "blue"
    },
    {
      id: 2,
      titulo: "Limpeza de panelas queimadas com ingredientes naturais",
      resumo: "Recupere suas panelas queimadas usando bicarbonato de sódio e vinagre, sem produtos tóxicos.",
      categoria: "Cozinha", 
      icone: "fa-utensils",
      cor: "green"
    },
    {
      id: 3,
      titulo: "Como remover manchas de tecidos sem alvejante",
      resumo: "Técnicas eficientes para remover manchas difíceis de roupas e estofados usando ingredientes naturais.",
      categoria: "Lavanderia",
      icone: "fa-tshirt",
      cor: "purple"
    },
    {
      id: 4,
      titulo: "Aromatizadores naturais para sua casa",
      resumo: "Crie aromatizadores caseiros com óleos essenciais e ingredientes naturais para um ambiente agradável e saudável.",
      categoria: "Ambiente",
      icone: "fa-home",
      cor: "yellow"
    },
    {
      id: 5,
      titulo: "Descarte correto de resíduos de limpeza",
      resumo: "Aprenda a descartar corretamente embalagens e resíduos de produtos de limpeza para minimizar o impacto ambiental.",
      categoria: "Sustentabilidade",
      icone: "fa-recycle",
      cor: "green"
    },
    {
      id: 6,
      titulo: "Desinfetando superfícies com ingredientes naturais",
      resumo: "Como preparar soluções desinfetantes eficazes e seguras usando vinagre, álcool e óleos essenciais.",
      categoria: "Saúde",
      icone: "fa-shield-virus",
      cor: "red"
    }
  ];

  // Categorias para filtragem
  const categorias = ["Todas", "Cozinha", "Lavanderia", "Ambiente", "Sustentabilidade", "Saúde"];

  return (
    <main>
      <Navigation />
      
      {/* Banner principal usando o componente Banner */}
      <Banner
        title="Dicas Sustentáveis para um Lar Mais Limpo"
        subtitle="Guia Completo"
        colorTheme="green"
        ctaText="Ver Todas as Dicas"
        ctaLink="#todas-dicas"
        ctaIcon="fa-leaf"
        onView={handleBannerView}
        onCtaClick={handleCtaClick}
        bannerId="dicas-hero"
        bannerPosition="topo"
      >
        <p className="text-lg md:text-xl max-w-3xl mx-auto">
          Descubra como manter sua casa impecável usando técnicas eco-friendly e 
          produtos que não prejudicam o meio ambiente nem a saúde da sua família.
        </p>
      </Banner>

      {/* Introdução */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <span className="inline-block bg-green-100 text-green-600 font-bold px-4 py-1 rounded-full mb-3">
                  POR QUE LIMPEZA SUSTENTÁVEL?
                </span>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Proteja Sua Família e o Planeta</h2>
                <p className="text-gray-700 mb-4">
                  Produtos de limpeza convencionais contêm químicos agressivos que podem causar irritações, 
                  alergias e danos à saúde a longo prazo. Além disso, seu descarte inadequado polui rios e oceanos.
                </p>
                <p className="text-gray-700 mb-6">
                  Nossas dicas mostram como limpar eficientemente usando alternativas naturais e a EcoEsponja Mágica, 
                  reduzindo a exposição a toxinas e o impacto ambiental.
                </p>
                
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 shadow-sm">
                  <p className="text-green-700 font-medium">
                    <i className="fas fa-lightbulb text-green-600 mr-2"></i>
                    Você sabia? Uma família média utiliza mais de 40 litros de produtos químicos de limpeza por ano, 
                    a maioria desnecessária quando se conhece as alternativas corretas.
                  </p>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <img 
                  src="/img/dicas/limpeza-natural.jpg" 
                  alt="Produtos de limpeza naturais" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lista de Dicas */}
      <section id="todas-dicas" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 text-blue-600 font-bold px-4 py-1 rounded-full mb-3">
              BIBLIOTECA DE DICAS
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Nossas Melhores Dicas de Limpeza</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Explore nossa coleção de técnicas e receitas para uma limpeza mais eficiente, saudável e amiga do meio ambiente
            </p>
          </div>

          {/* Filtros de categoria */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                className="px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-colors"
              >
                {categoria === "Todas" ? categoria : (
                  <><i className={`fas ${
                    categoria === "Cozinha" ? "fa-utensils" : 
                    categoria === "Lavanderia" ? "fa-tshirt" :
                    categoria === "Ambiente" ? "fa-home" :
                    categoria === "Sustentabilidade" ? "fa-leaf" : "fa-heart"
                  } mr-2`}></i>{categoria}</>
                )}
              </button>
            ))}
          </div>

          {/* Grade de cards de dicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {dicas.map((dica) => (
              <div 
                key={dica.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-2 duration-300"
              >
                <div className={dica.cor === "green" ? "bg-green-100 p-6" : 
                                dica.cor === "blue" ? "bg-blue-100 p-6" : 
                                dica.cor === "purple" ? "bg-purple-100 p-6" : 
                                dica.cor === "yellow" ? "bg-yellow-100 p-6" : 
                                dica.cor === "red" ? "bg-red-100 p-6" : "bg-gray-100 p-6"}>
                  <div className="flex justify-between items-start">
                    <span className={dica.cor === "green" ? "inline-block bg-green-200 text-green-700 px-3 py-1 rounded-full text-sm font-medium" : 
                                     dica.cor === "blue" ? "inline-block bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm font-medium" : 
                                     dica.cor === "purple" ? "inline-block bg-purple-200 text-purple-700 px-3 py-1 rounded-full text-sm font-medium" : 
                                     dica.cor === "yellow" ? "inline-block bg-yellow-200 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium" : 
                                     dica.cor === "red" ? "inline-block bg-red-200 text-red-700 px-3 py-1 rounded-full text-sm font-medium" : 
                                     "inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"}>
                      {dica.categoria}
                    </span>
                    <i className={`fas ${dica.icone} text-2xl ${
                      dica.cor === "green" ? "text-green-500" : 
                      dica.cor === "blue" ? "text-blue-500" : 
                      dica.cor === "purple" ? "text-purple-500" : 
                      dica.cor === "yellow" ? "text-yellow-500" : 
                      dica.cor === "red" ? "text-red-500" : "text-gray-500"
                    }`}></i>
                  </div>
                  <h3 className="text-xl font-bold mt-4 text-gray-800">{dica.titulo}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">{dica.resumo}</p>
                  <div className="mt-4 flex justify-end">
                    <Link href={`/dicas/${dica.id}`} className={`font-medium inline-flex items-center ${
                      dica.cor === "green" ? "text-green-600 hover:text-green-800" : 
                      dica.cor === "blue" ? "text-blue-600 hover:text-blue-800" : 
                      dica.cor === "purple" ? "text-purple-600 hover:text-purple-800" : 
                      dica.cor === "yellow" ? "text-yellow-600 hover:text-yellow-800" : 
                      dica.cor === "red" ? "text-red-600 hover:text-red-800" : "text-gray-600 hover:text-gray-800"
                    }`}>
                      Ler mais <i className="fas fa-arrow-right ml-2"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA para Newsletter */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Receba Dicas Semanais</h2>
            <p className="text-lg mb-8 text-white/90">
              Assine nossa newsletter e receba dicas exclusivas de limpeza sustentável diretamente em seu email.
            </p>
            
            <form className="flex flex-col md:flex-row gap-3 mb-6">
              <input
                type="email"
                placeholder="Seu melhor email"
                className="flex-1 px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium shadow-md transition-colors"
              >
                Inscrever-me
              </button>
            </form>
            
            <p className="text-sm text-white/80">
              <i className="fas fa-shield-alt mr-1"></i>
              Seus dados estão seguros conosco. Comprometemo-nos a nunca compartilhar suas informações.
            </p>
          </div>
        </div>
      </section>

      {/* Depoimentos sobre as dicas */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-yellow-100 text-yellow-600 font-bold px-4 py-1 rounded-full mb-3">
              RESULTADOS REAIS
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">O Que Nossos Leitores Dizem</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Veja como nossas dicas e a EcoEsponja Mágica transformaram a rotina de limpeza de nossos clientes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md border-t-4 border-yellow-500">
              <div className="flex justify-between mb-4">
                <div className="text-yellow-400">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">
                "A dica de limpeza de panelas com bicarbonato e vinagre salvou minhas panelas antigas. 
                Incrível como algo tão simples pode ser tão eficaz. Nunca mais uso produtos químicos agressivos!"
              </p>
              <div className="flex items-center">
                <img 
                  src="https://randomuser.me/api/portraits/women/45.jpg" 
                  alt="Juliana Mendes" 
                  className="w-10 h-10 rounded-full mr-3" 
                />
                <div>
                  <p className="font-medium">Juliana Mendes</p>
                  <p className="text-sm text-gray-500">Florianópolis, SC</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-md border-t-4 border-green-500">
              <div className="flex justify-between mb-4">
                <div className="text-yellow-400">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">
                "Os aromatizadores naturais transformaram minha casa. O ar está mais leve, não tenho mais 
                reações alérgicas e minha família adorou os aromas. Muito obrigado pelas dicas!"
              </p>
              <div className="flex items-center">
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="Carlos Eduardo" 
                  className="w-10 h-10 rounded-full mr-3" 
                />
                <div>
                  <p className="font-medium">Carlos Eduardo</p>
                  <p className="text-sm text-gray-500">São Paulo, SP</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-md border-t-4 border-blue-500">
              <div className="flex justify-between mb-4">
                <div className="text-yellow-400">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">
                "A combinação da EcoEsponja Mágica com as dicas de limpeza natural deste site é imbatível. 
                Economizo dinheiro, protejo minha família e ainda ajudo o planeta. Parabéns pelo conteúdo!"
              </p>
              <div className="flex items-center">
                <img 
                  src="https://randomuser.me/api/portraits/women/68.jpg" 
                  alt="Amanda Costa" 
                  className="w-10 h-10 rounded-full mr-3" 
                />
                <div>
                  <p className="font-medium">Amanda Costa</p>
                  <p className="text-sm text-gray-500">Belo Horizonte, MG</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner de CTA para comprar a EcoEsponja */}
      <Banner
        title="Torne Suas Limpezas Ainda Mais Eficientes"
        subtitle="Produto Recomendado"
        colorTheme="blue"
        ctaText="Conhecer a EcoEsponja Mágica"
        ctaLink="/#comprar"
        ctaIcon="fa-shopping-cart"
        backgroundImage="/img/banner-ecofriendly.jpg"
        height="h-96"
        onView={handleBannerView}
        onCtaClick={handleCtaClick}
        bannerId="dicas-footer-cta"
        bannerPosition="rodape"
      >
        <p className="text-lg max-w-2xl mx-auto">
          Combine nossas dicas sustentáveis com a incrível EcoEsponja Mágica, o complemento perfeito 
          para uma limpeza mais eficiente, econômica e amigável ao meio ambiente.
        </p>
      </Banner>

      <Footer />
    </main>
  )
} 