'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    // Script do contador (equivalente ao script.js)
    const countdownDate = new Date();
    countdownDate.setDate(countdownDate.getDate() + 3);

    const countdown = () => {
      const now = new Date().getTime();
      const distance = countdownDate.getTime() - now;
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      const daysElement = document.getElementById("days");
      if (daysElement) {
        daysElement.innerText = days.toString().padStart(2, '0');
      }
      
      const hoursElement = document.getElementById("hours");
      if (hoursElement) {
        hoursElement.innerText = hours.toString().padStart(2, '0');
      }
      
      const minutesElement = document.getElementById("minutes");
      if (minutesElement) {
        minutesElement.innerText = minutes.toString().padStart(2, '0');
      }
      
      const secondsElement = document.getElementById("seconds");
      if (secondsElement) {
        secondsElement.innerText = seconds.toString().padStart(2, '0');
      }
    };

    const interval = setInterval(countdown, 1000);
    
    // Notificações de compras recentes
    const compradores = [
      { nome: "Maria Silva", local: "Belo Horizonte, MG" },
      { nome: "João Pereira", local: "São Paulo, SP" },
      { nome: "Ana Oliveira", local: "Porto Alegre, RS" },
      { nome: "Carlos Santos", local: "Recife, PE" },
      { nome: "Juliana Costa", local: "Brasília, DF" },
      { nome: "Roberto Lima", local: "Salvador, BA" },
      { nome: "Fernanda Souza", local: "Curitiba, PR" },
      { nome: "Marcos Andrade", local: "Fortaleza, CE" },
      { nome: "Patrícia Gomes", local: "Florianópolis, SC" },
      { nome: "Lucas Martins", local: "Manaus, AM" },
      { nome: "Camila Almeida", local: "Goiânia, GO" },
      { nome: "Rodrigo Mendes", local: "Vitória, ES" },
      { nome: "Beatriz Castro", local: "Belém, PA" },
      { nome: "Felipe Nunes", local: "Natal, RN" },
      { nome: "Tatiana Rocha", local: "Campo Grande, MS" },
      { nome: "Eduardo Cardoso", local: "João Pessoa, PB" },
      { nome: "Amanda Ferreira", local: "Teresina, PI" },
      { nome: "Gustavo Ribeiro", local: "Aracaju, SE" },
      { nome: "Mariana Lopes", local: "Maceió, AL" },
      { nome: "Thiago Moreira", local: "Cuiabá, MT" },
      { nome: "Bianca Torres", local: "Palmas, TO" },
      { nome: "Ricardo Vieira", local: "Rio Branco, AC" },
      { nome: "Daniela Pinto", local: "Macapá, AP" },
      { nome: "Leonardo Barbosa", local: "Boa Vista, RR" },
      { nome: "Aline Teixeira", local: "Londrina, PR" },
      { nome: "Bruno Duarte", local: "Campinas, SP" },
      { nome: "Elisa Monteiro", local: "Juiz de Fora, MG" },
      { nome: "Renato Carvalho", local: "Niterói, RJ" },
      { nome: "Laís Barros", local: "Joinville, SC" },
      { nome: "Victor Melo", local: "Uberlândia, MG" }
    ];
    
    let notificationTimeout: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;
    
    const showNotification = () => {
      const notification = document.getElementById('recent-purchase');
      if (notification) {
        const comprador = compradores[Math.floor(Math.random() * compradores.length)];
        const notificationText = document.getElementById('notification-text');
        if (notificationText) {
          notificationText.innerHTML = `<strong>${comprador.nome}</strong> de ${comprador.local} acabou de comprar`;
        }
        
        notification.classList.remove('translate-x-full');
        notification.classList.add('translate-x-0');
        
        // Esconde a notificação após 4 segundos
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
          notification.classList.remove('translate-x-0');
          notification.classList.add('translate-x-full');
        }, 4000);
        
        // Programa a próxima notificação (entre 15 e 30 segundos)
        clearTimeout(notificationTimeout);
        const nextInterval = Math.floor(Math.random() * (30000 - 15000) + 15000);
        notificationTimeout = setTimeout(showNotification, nextInterval);
      }
    };
    
    // Inicia o ciclo de notificações após 5 segundos
    notificationTimeout = setTimeout(showNotification, 5000);

    // Popup de captura de leads após 5 segundos na página
    const popupTimeout = setTimeout(() => {
      setShowPopup(true);
    }, 5000);

    // Gerar número aleatório de visualizações entre 15 e 30
    const randomViews = Math.floor(Math.random() * (30 - 15 + 1)) + 15;
    setViewerCount(randomViews);

    // Simular flutuação de visualizações
    const viewerInterval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newCount = prev + change;
        return newCount < 10 ? 10 : (newCount > 35 ? 35 : newCount);
      });
    }, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(notificationTimeout);
      clearTimeout(hideTimeout);
      clearTimeout(popupTimeout);
      clearInterval(viewerInterval);
    };
  }, []);

  const handleSubmitLead = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aqui seria implementada a lógica de envio do lead para o backend
    setFormSubmitted(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <main>
      <Navigation />

      {/* Pop-up de Captura de Leads */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md relative animate-fadeIn">
            <button 
              onClick={closePopup} 
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              aria-label="Fechar popup"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
            
            {!formSubmitted ? (
              <>
                <div className="text-center mb-6">
                  <div className="inline-block bg-yellow-100 text-yellow-800 font-bold px-4 py-1 rounded-full mb-4">
                    OFERTA EXCLUSIVA!
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Ganhe 10% OFF</h3>
                  <p className="text-gray-600">Na sua primeira compra da EcoEsponja Mágica</p>
                </div>
                
                <form onSubmit={handleSubmitLead} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input 
                      type="email" 
                      id="email"
                      placeholder="Seu melhor email" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp (opcional)
                    </label>
                    <input 
                      type="tel" 
                      id="whatsapp"
                      placeholder="(DDD) Número" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
                  >
                    QUERO MEU DESCONTO!
                  </button>
                </form>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  Nós respeitamos sua privacidade. Seus dados nunca serão compartilhados.
                </p>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-5xl text-green-500 mb-4">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Desconto Garantido!</h3>
                <p className="text-gray-600">Seu cupom <strong>PRIMEIRA10</strong> foi enviado para seu email.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notificação de compra recente */}
      <div id="recent-purchase" className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-3 z-50 transform translate-x-full transition-transform duration-500 ease-in-out flex items-center max-w-xs">
        <div className="bg-green-100 rounded-full p-2 mr-3">
          <i className="fas fa-shopping-cart text-green-600"></i>
        </div>
        <p id="notification-text" className="text-gray-700 text-sm"></p>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-50 to-blue-50 py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
                <span className="relative inline-block">
                  <span className="relative z-10">A Esponja</span>
                  <span className="absolute bottom-0 left-0 w-full h-3 bg-yellow-300 z-0 opacity-60"></span>
                </span> que 
                <span className="text-green-600 block mt-1">Revoluciona</span> 
                sua Limpeza
              </h1>
              
              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl">
                Substitua até <span className="font-bold text-green-600">12 esponjas comuns</span> com uma única 
                <span className="bg-green-600 text-white px-2 py-1 rounded mx-1 whitespace-nowrap">EcoEsponja Mágica</span>
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8 max-w-xl">
                <div className="flex items-center">
                  <div className="text-green-600 mr-2">
                    <i className="fas fa-check-circle text-xl"></i>
                  </div>
                  <span className="text-gray-700">Super Durável</span>
                </div>
                <div className="flex items-center">
                  <div className="text-green-600 mr-2">
                    <i className="fas fa-check-circle text-xl"></i>
                  </div>
                  <span className="text-gray-700">Ecológica</span>
                </div>
                <div className="flex items-center">
                  <div className="text-green-600 mr-2">
                    <i className="fas fa-check-circle text-xl"></i>
                  </div>
                  <span className="text-gray-700">Antibacteriana</span>
                </div>
                <div className="flex items-center">
                  <div className="text-green-600 mr-2">
                    <i className="fas fa-check-circle text-xl"></i>
                  </div>
                  <span className="text-gray-700">Não Risca Superfícies</span>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md mb-8 border-l-4 border-yellow-500">
                <div className="flex items-center">
                  <div className="text-yellow-500 mr-3">
                    <i className="fas fa-shipping-fast text-2xl"></i>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Frete Grátis</p>
                    <p className="text-sm text-gray-600">Em compras acima de R$ 99,90</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
                <a href="https://seguro.vitrinedaserra.com.br/r/H8EGQ51RUZ" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg inline-flex items-center justify-center transition-all transform hover:scale-105 text-lg">
                  <i className="fas fa-shopping-cart mr-2"></i> 
                  Comprar Agora
                </a>
                <a href="#beneficios" className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-6 rounded-lg inline-flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <i className="fas fa-info-circle mr-2"></i>
                  Saiba Mais
                </a>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
            <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden">
              <img
                src="/img/esponjaetexto.png"
                alt="EcoEsponja Mágica em uso" 
                className="w-full object-contain"
              />
              
              <div className="absolute top-4 right-4 bg-red-500 text-white font-bold text-sm py-1 px-3 rounded-full transform rotate-12 shadow-md">
                50% OFF
              </div>
            </div>
            
            <div className="mt-6 bg-white rounded-lg p-4 shadow-md mx-auto max-w-sm text-center">
              <div className="flex justify-between mb-1">
                <span className="font-bold">⭐⭐⭐⭐⭐</span>
                <span className="text-green-600 font-semibold">3.521 avaliações</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: '97%' }}></div>
              </div>
            </div>
            
            {/* Contador de visualizações em tempo real */}
            <div className="mt-4 bg-red-50 border border-red-100 rounded-md p-3 flex items-center justify-center animate-pulse">
              <div className="text-red-500 mr-2">
                <i className="fas fa-eye"></i>
              </div>
              <p className="text-sm font-medium text-gray-700">
                <span className="font-bold">{viewerCount} pessoas</span> estão vendo este produto agora!
              </p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-6 bg-wave-pattern bg-repeat-x opacity-20"></div>
      </section>

      {/* Problemas das Esponjas Comuns */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">O Problema das Esponjas Comuns</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-red-50 p-6 rounded-lg shadow-md border-t-4 border-red-600">
              <div className="text-red-600 text-5xl mb-4 flex justify-center">
                <i className="fas fa-trash-alt"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-red-700 text-center">Desperdício</h3>
              <p className="text-gray-700">Esponjas tradicionais se desgastam rapidamente e acabam no lixo em poucas semanas</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md border-t-4 border-blue-600">
              <div className="text-blue-600 text-5xl mb-4 flex justify-center">
                <i className="fas fa-tint-slash"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-700 text-center">Pouca Absorção</h3>
              <p className="text-gray-700">Baixa capacidade de reter líquidos, tornando a limpeza ineficiente e demorada</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg shadow-md border-t-4 border-yellow-600">
              <div className="text-yellow-600 text-5xl mb-4 flex justify-center">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-yellow-700 text-center">Danos às Superfícies</h3>
              <p className="text-gray-700">Riscam e danificam superfícies delicadas como vidros, espelhos e eletrodomésticos</p>
            </div>
          </div>
        </div>
      </section>

      {/* O Perigo Invisível das Esponjas Comuns */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-red-100 border-l-4 border-red-500 p-6">
              <h2 className="text-3xl font-bold text-red-600 mb-6 flex items-center">
                <i className="fas fa-biohazard text-red-600 mr-3"></i> 
                O Perigo Invisível das Esponjas Comuns
              </h2>
              <p className="text-lg text-gray-700 mb-8">Você sabia que a esponja de lavar louça que está na sua pia pode ser um dos itens mais contaminados da sua casa?</p>
            </div>
            
            <div className="p-6 flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <img 
                  src="/img/bacterias.png" 
                  alt="Bactérias em esponjas comuns"
                  className="rounded-lg w-full"
                />
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-700 mb-4">Segundo um estudo publicado na revista científica Nature, uma esponja convencional pode abrigar mais de <strong className="text-red-600 font-bold">362 tipos de bactérias</strong>, incluindo algumas potencialmente perigosas para a saúde.</p>
                
                <p className="text-gray-700 mb-2">Essas esponjas:</p>
                <ul className="mb-6 space-y-4">
                  <li className="flex items-start gap-3">
                    <i className="fas fa-virus text-red-600 mt-1 text-xl"></i> 
                    <span>Retêm umidade constantemente, criando o ambiente perfeito para bactérias se multiplicarem</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fas fa-broom text-red-600 mt-1 text-xl"></i> 
                    <span>São difíceis de limpar corretamente</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fas fa-hand-sparkles text-red-600 mt-1 text-xl"></i> 
                    <span>Acabam espalhando sujeira ao invés de limpar</span>
                  </li>
                </ul>
                
                <div className="bg-pink-50 p-5 rounded-lg border-l-4 border-red-300 mb-6">
                  <i className="fas fa-quote-left text-red-400 mb-2 text-xl"></i>
                  <p className="text-gray-700 mb-2">"Esponjas de cozinha são verdadeiros reservatórios de micro-organismos. A troca frequente e correta higienização são negligenciadas pela maioria dos lares."</p>
                  <p className="text-sm text-gray-500">— Estudo da Universidade de Furtwangen, Alemanha</p>
                </div>
                
                <p className="text-green-600 font-medium flex items-center">
                  <i className="fas fa-heart mr-2"></i> 
                  Com a EcoEsponja Mágica, você elimina esse risco! Ela não retém odores, seca rápido e é super fácil de higienizar — protegendo você e sua família.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apresentando a Solução */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Apresentando a Solução:</h2>
          <div className="max-w-4xl mx-auto rounded-lg overflow-hidden shadow-xl">
            <div className="aspect-w-16 aspect-h-9 bg-black">
              <video 
                className="w-full" 
                controls 
                poster="/img/Generated Image March 26, 2025 - 2_38AM (3).jpeg"
              >
                <source src="/videos/ads.mp4" type="video/mp4" />
                Seu navegador não suporta a reprodução de vídeos.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Economize de Verdade */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <i className="fas fa-coins text-yellow-500 mr-3 text-4xl"></i> Economize de Verdade ao Escolher Melhor
            </h2>
            <p className="text-lg text-gray-700">Parece que esponja é tudo igual, né? Mas olha só esse comparativo:</p>
          </div>
          
          <div className="max-w-3xl mx-auto overflow-hidden bg-white rounded-lg shadow-md">
            <table className="w-full">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="py-4 px-6 text-left font-bold text-lg">Tipo de Esponja</th>
                  <th className="py-4 px-6 text-center font-bold text-lg">Duração Média</th>
                  <th className="py-4 px-6 text-right font-bold text-lg">Gasto Anual Estimado</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-red-50">
                  <td className="py-5 px-6 text-left">Esponja comum (mercado)</td>
                  <td className="py-5 px-6 text-center">1 semana</td>
                  <td className="py-5 px-6 text-right font-semibold text-red-600 text-lg">R$ 144,00</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="py-5 px-6 text-left font-semibold text-green-700">EcoEsponja Mágica</td>
                  <td className="py-5 px-6 text-center">6 a 12 meses</td>
                  <td className="py-5 px-6 text-right font-bold text-green-700 text-xl">R$ 39,90</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="max-w-3xl mx-auto mt-10 bg-yellow-50 p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-6 border-l-4 border-yellow-500">
            <div className="text-5xl text-yellow-500">
              <i className="fas fa-chart-line"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700 mb-2">Economia de mais de R$ 100 por ano!</p>
              <p className="text-gray-700">Além de economizar, você reduz o lixo doméstico e ainda cuida da sua saúde.</p>
              <p className="text-green-600 mt-2 font-medium">Uma escolha inteligente e consciente — pro seu bolso e pro planeta. <i className="fas fa-seedling"></i></p>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <a href="https://seguro.vitrinedaserra.com.br/r/H8EGQ51RUZ" 
               className="bg-green-600 hover:bg-green-700 text-white py-4 px-10 rounded-lg font-bold transition-colors inline-block text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Garantir Minha Economia Agora!
            </a>
          </div>
        </div>
      </section>

      {/* Benefícios da EcoEsponja */}
      <section className="py-16 bg-gray-50" id="beneficios">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 flex items-center justify-center">
              <i className="fas fa-star text-yellow-400 mr-3 text-4xl"></i> Por Que a EcoEsponja é Revolucionária?
            </h2>
            <p className="text-lg text-gray-700">Conheça os diferenciais que fazem da EcoEsponja 
            a solução definitiva para sua cozinha:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefício 1 */}
            <div className="bg-blue-50 rounded-lg shadow-md p-8 border-t-4 border-blue-500 transform transition hover:scale-105">
              <div className="text-4xl mb-4 text-blue-500">
                <i className="fas fa-tint"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-blue-700">Super Absorção</h3>
              <p className="text-gray-700">Absorve até 10x mais líquido que esponjas comuns, facilitando a limpeza de 
              qualquer superfície ou utensílio.</p>
            </div>

            {/* Benefício 2 */}
            <div className="bg-green-50 rounded-lg shadow-md p-8 border-t-4 border-green-500 transform transition hover:scale-105">
              <div className="text-4xl mb-4 text-green-500">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-green-700">Durabilidade Incrível</h3>
              <p className="text-gray-700">Dura até 12 meses sem perder a qualidade, substituindo 
              dezenas de esponjas comuns e gerando menos lixo.</p>
            </div>

            {/* Benefício 3 */}
            <div className="bg-purple-50 rounded-lg shadow-md p-8 border-t-4 border-purple-500 transform transition hover:scale-105">
              <div className="text-4xl mb-4 text-purple-500">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-purple-700">Anti-Bacteriana</h3>
              <p className="text-gray-700">Material especial que impede a proliferação de bactérias, 
              mantendo sua cozinha mais segura e higiênica.</p>
            </div>

            {/* Benefício 4 */}
            <div className="bg-yellow-50 rounded-lg shadow-md p-8 border-t-4 border-yellow-500 transform transition hover:scale-105">
              <div className="text-4xl mb-4 text-yellow-500">
                <i className="fas fa-layer-group"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-yellow-700">Multiuso</h3>
              <p className="text-gray-700">Funciona em qualquer superfície - vidros, cerâmica, aço inox, 
              madeira e muito mais, sem riscar ou danificar.</p>
            </div>

            {/* Benefício 5 */}
            <div className="bg-red-50 rounded-lg shadow-md p-8 border-t-4 border-red-500 transform transition hover:scale-105">
              <div className="text-4xl mb-4 text-red-500">
                <i className="fas fa-recycle"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-700">Ecológica</h3>
              <p className="text-gray-700">Produzida com materiais sustentáveis e biodegradáveis, 
              reduzindo significativamente seu impacto ambiental.</p>
            </div>

            {/* Benefício 6 */}
            <div className="bg-teal-50 rounded-lg shadow-md p-8 border-t-4 border-teal-500 transform transition hover:scale-105">
              <div className="text-4xl mb-4 text-teal-500">
                <i className="fas fa-spray-can"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-teal-700">Limpa Sem Químicos</h3>
              <p className="text-gray-700">Seu design especial permite limpeza eficiente usando 
              apenas água, reduzindo o uso de produtos químicos.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <a href="https://seguro.vitrinedaserra.com.br/r/H8EGQ51RUZ" 
               className="bg-green-600 hover:bg-green-700 text-white py-4 px-10 rounded-lg font-bold transition duration-300 inline-block text-xl shadow-lg hover:shadow-xl">
              Experimentar Agora <i className="fas fa-arrow-right ml-2"></i>
            </a>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-blue-600 font-semibold text-lg block mb-1">DEPOIMENTOS REAIS</span>
            <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <i className="fas fa-comments text-yellow-500 mr-3 text-4xl"></i> 
              O Que Nossos Clientes Dizem
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Mais de 3.500 avaliações 5 estrelas. Veja como a EcoEsponja transformou a rotina de limpeza 
              de milhares de pessoas:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Depoimento 1 */}
            <div className="bg-white rounded-lg shadow-lg p-8 transform transition duration-300 hover:scale-105 border-b-4 border-blue-500">
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
                "Nunca imaginei que uma esponja pudesse fazer tanta diferença! Já estou no quarto mês 
                usando a mesma EcoEsponja e ela continua perfeita. Economizei uma fortuna em produtos de limpeza!"
              </p>
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-blue-700 font-bold text-lg">MC</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Maria Cristina</h4>
                  <p className="text-sm text-gray-500">São Paulo, SP</p>
                </div>
              </div>
            </div>

            {/* Depoimento 2 */}
            <div className="bg-white rounded-lg shadow-lg p-8 transform transition duration-300 hover:scale-105 border-b-4 border-purple-500">
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
                "Comprei por impulso e me surpreendi. A EcoEsponja realmente limpa melhor que as 
                esponjas normais e ainda não risca nenhuma superfície. Já comprei para toda a família!"
              </p>
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-purple-700 font-bold text-lg">RS</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Roberto Silva</h4>
                  <p className="text-sm text-gray-500">Recife, PE</p>
                </div>
              </div>
            </div>

            {/* Depoimento 3 */}
            <div className="bg-white rounded-lg shadow-lg p-8 transform transition duration-300 hover:scale-105 border-b-4 border-green-500">
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
                "Sou alérgica e sempre tive problemas com as esponjas comuns. A EcoEsponja foi uma 
                salvação, não acumula bactérias e não causa reações na minha pele sensível!"
              </p>
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-green-700 font-bold text-lg">JA</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Juliana Alves</h4>
                  <p className="text-sm text-gray-500">Curitiba, PR</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto border-l-4 border-yellow-500">
            <div className="flex items-center text-yellow-500 mb-3">
              <i className="fas fa-award text-3xl mr-3"></i>
              <span className="font-bold text-lg">GARANTIA DE SATISFAÇÃO</span>
            </div>
            <p className="text-gray-700">
              Acreditamos tanto na qualidade da EcoEsponja que oferecemos 7 dias de garantia. Nossos clientes adoram o produto desde o primeiro uso - 98% das pessoas continuam usando após o período de teste!
            </p>
          </div>

          <div className="text-center mt-10">
            <a href="https://seguro.vitrinedaserra.com.br/r/H8EGQ51RUZ" 
               className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white py-4 px-10 rounded-lg font-bold text-xl shadow-lg transform transition duration-300 hover:-translate-y-1 inline-flex items-center">
              <i className="fas fa-check-circle mr-2"></i> Quero Ver Resultados Também
            </a>
          </div>
        </div>
      </section>

      {/* Oferta Especial de Lançamento */}
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
                <div className="flex justify-center gap-4">
                  <div className="flex flex-col items-center bg-white px-4 py-2 rounded-lg shadow-md w-20">
                    <span id="days" className="text-2xl font-bold text-green-600">02</span>
                    <p className="text-sm text-gray-600">Dias</p>
                  </div>
                  <div className="flex flex-col items-center bg-white px-4 py-2 rounded-lg shadow-md w-20">
                    <span id="hours" className="text-2xl font-bold text-green-600">12</span>
                    <p className="text-sm text-gray-600">Horas</p>
                  </div>
                  <div className="flex flex-col items-center bg-white px-4 py-2 rounded-lg shadow-md w-20">
                    <span id="minutes" className="text-2xl font-bold text-green-600">45</span>
                    <p className="text-sm text-gray-600">Minutos</p>
                  </div>
                  <div className="flex flex-col items-center bg-white px-4 py-2 rounded-lg shadow-md w-20">
                    <span id="seconds" className="text-2xl font-bold text-green-600">30</span>
                    <p className="text-sm text-gray-600">Segundos</p>
                  </div>
                </div>
              </div>
              
              {/* Tabela comparativa simplificada */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-center text-gray-800 mb-4">Por que escolher a EcoEsponja?</h3>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    {/* EcoEsponja */}
                    <div className="border-2 border-green-500 rounded-lg p-4">
                      <div className="bg-green-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <img 
                          src="/img/esponja1.png" 
                          alt="EcoEsponja Mágica" 
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                      <h4 className="text-xl font-bold text-green-700 mb-2">EcoEsponja Mágica</h4>
                      <ul className="space-y-2 text-left">
                        <li className="flex items-center">
                          <i className="fas fa-check-circle text-green-600 mr-2 text-lg"></i>
                          <span>Dura até 1 ano</span>
                        </li>
                        <li className="flex items-center">
                          <i className="fas fa-check-circle text-green-600 mr-2 text-lg"></i>
                          <span>Super absorvente</span>
                        </li>
                        <li className="flex items-center">
                          <i className="fas fa-check-circle text-green-600 mr-2 text-lg"></i>
                          <span>Não acumula bactérias</span>
                        </li>
                        <li className="flex items-center">
                          <i className="fas fa-check-circle text-green-600 mr-2 text-lg"></i>
                          <span>Ecológica</span>
                        </li>
                        <li className="flex items-center mt-4">
                          <i className="fas fa-coins text-yellow-500 mr-2 text-lg"></i>
                          <span className="font-bold">R$ 39,90 por ano</span>
                        </li>
                      </ul>
                    </div>
                    
                    {/* Esponja Comum */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <i className="fas fa-times-circle text-red-500 text-4xl"></i>
                      </div>
                      <h4 className="text-xl font-bold text-gray-700 mb-2">Esponja Comum</h4>
                      <ul className="space-y-2 text-left">
                        <li className="flex items-center">
                          <i className="fas fa-times-circle text-red-500 mr-2 text-lg"></i>
                          <span>Dura apenas 1 semana</span>
                        </li>
                        <li className="flex items-center">
                          <i className="fas fa-times-circle text-red-500 mr-2 text-lg"></i>
                          <span>Pouco absorvente</span>
                        </li>
                        <li className="flex items-center">
                          <i className="fas fa-times-circle text-red-500 mr-2 text-lg"></i>
                          <span>Acumula bactérias</span>
                        </li>
                        <li className="flex items-center">
                          <i className="fas fa-times-circle text-red-500 mr-2 text-lg"></i>
                          <span>Prejudica o meio ambiente</span>
                        </li>
                        <li className="flex items-center mt-4">
                          <i className="fas fa-coins text-yellow-500 mr-2 text-lg"></i>
                          <span className="font-bold">R$ 156,00 por ano</span>
                        </li>
                      </ul>
                    </div>
                    
                    {/* Esponja Premium */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <i className="fas fa-minus-circle text-yellow-500 text-4xl"></i>
                      </div>
                      <h4 className="text-xl font-bold text-gray-700 mb-2">Esponja Premium</h4>
                      <ul className="space-y-2 text-left">
                        <li className="flex items-center">
                          <i className="fas fa-minus-circle text-yellow-500 mr-2 text-lg"></i>
                          <span>Dura 1-2 meses</span>
                        </li>
                        <li className="flex items-center">
                          <i className="fas fa-minus-circle text-yellow-500 mr-2 text-lg"></i>
                          <span>Absorção média</span>
                        </li>
                        <li className="flex items-center">
                          <i className="fas fa-minus-circle text-yellow-500 mr-2 text-lg"></i>
                          <span>Reduz bactérias</span>
                        </li>
                        <li className="flex items-center">
                          <i className="fas fa-times-circle text-red-500 mr-2 text-lg"></i>
                          <span>Prejudica o meio ambiente</span>
                        </li>
                        <li className="flex items-center mt-4">
                          <i className="fas fa-coins text-yellow-500 mr-2 text-lg"></i>
                          <span className="font-bold">R$ 120,00 por ano</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <p className="text-lg font-bold text-green-700">
                      Economize mais de R$ 100 por ano com a EcoEsponja!
                    </p>
                  </div>
                </div>
              </div>

              {/* Opções de pacotes com desconto progressivo - SIMPLIFICADO */}
              <h3 className="text-xl font-bold text-center text-gray-800 mb-6">Escolha a melhor opção para você:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-gray-50 p-6 rounded-lg">
                {/* Pacote Básico */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-blue-50 p-4 text-center">
                    <h3 className="font-bold text-xl text-blue-700">1 UNIDADE</h3>
                    <p className="text-sm text-blue-500">Para experimentar</p>
                  </div>
                  <div className="p-6 flex flex-col items-center">
                    <div className="w-32 h-32 mb-4">
                      <img 
                        src="/img/esponja1.png" 
                        alt="EcoEsponja Mágica" 
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
                      <img 
                        src="/img/esponja1.png" 
                        alt="EcoEsponja Mágica" 
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
                      <img 
                        src="/img/esponja1.png" 
                        alt="EcoEsponja Mágica" 
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

      {/* Nosso Compromisso com o Planeta */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Nosso Compromisso com o Planeta</h2>
            <p className="text-lg text-gray-700">Descubra como a EcoEsponja Mágica está ajudando a transformar o meio ambiente</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-10">
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold text-green-700 mb-4">Uma Pequena Esponja, Um Grande Impacto</h3>
              <p className="text-gray-700 mb-4">Cada EcoEsponja Mágica que você usa substitui até 10 esponjas tradicionais, reduzindo significativamente o volume de lixo nos aterros sanitários e oceanos.</p>
              <p className="text-gray-700 mb-6">Nosso material PVA de alta densidade é biodegradável e produzido com tecnologias sustentáveis que consomem menos água e energia em comparação com esponjas convencionais.</p>
              
              <h3 className="text-xl font-bold text-green-700 mb-3">Impacto Ambiental em Números:</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <i className="fas fa-water text-blue-500 mt-1"></i>
                  <span className="text-gray-700">Economia de até 500 litros de água por ano por domicílio</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-trash-alt text-blue-500 mt-1"></i>
                  <span className="text-gray-700">Redução de 2kg de resíduos plásticos por família anualmente</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-seedling text-blue-500 mt-1"></i>
                  <span className="text-gray-700">Apoiamos projetos de reflorestamento e limpeza de oceanos</span>
                </li>
              </ul>
              
              <p className="text-green-600 font-medium">Ao escolher a EcoEsponja Mágica, você não está apenas melhorando sua experiência de limpeza, mas também fazendo parte de um movimento global por um futuro mais sustentável.</p>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <img 
                src="/img/Generated Image March 26, 2025 - 2_38AM (3).jpeg" 
                alt="Impacto ambiental positivo"
                className="rounded-lg shadow-lg w-full max-w-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Como Comprar */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Como Comprar</h2>
            <p className="text-lg text-gray-700">Processo simples, rápido e seguro para você</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center gap-8 mb-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">1</div>
              <div className="text-4xl text-green-600 mb-3">
                <i className="fas fa-mouse-pointer"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Escolha</h3>
              <p className="text-gray-700">Clique em "Comprar Agora" para ir ao checkout seguro</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
              <div className="text-4xl text-green-600 mb-3">
                <i className="fas fa-credit-card"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Pagamento</h3>
              <p className="text-gray-700">Escolha sua forma de pagamento preferida e finalize sua compra com segurança</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
              <div className="text-4xl text-green-600 mb-3">
                <i className="fas fa-box"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Entrega</h3>
              <p className="text-gray-700">Receba seu produto em casa com frete grátis para todo Brasil</p>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto bg-green-50 p-6 rounded-lg shadow-md flex items-center gap-6">
            <div className="text-4xl text-green-600">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-700 mb-2">Garantia de Satisfação 100%</h3>
              <p className="text-gray-700">Experimente a EcoEsponja Mágica por 7 dias. Acreditamos tanto na qualidade do nosso produto que oferecemos garantia de satisfação. Nossos índices de devolução são mínimos, pois 98% dos clientes se apaixonam pelo produto logo no primeiro uso.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Perguntas Frequentes */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Perguntas Frequentes</h2>
            <p className="text-lg text-gray-700">Tire suas dúvidas sobre a EcoEsponja Mágica</p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-green-700 mb-3">Quanto tempo dura a EcoEsponja Mágica?</h3>
              <p className="text-gray-700">Com os cuidados adequados, a EcoEsponja Mágica pode durar até 6 meses de uso diário, substituindo até 10 esponjas tradicionais nesse período.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-green-700 mb-3">Como devo lavar e conservar minha EcoEsponja Mágica?</h3>
              <p className="text-gray-700">Após o uso, enxágue bem com água corrente, esprema suavemente (sem torcer) e deixe secar naturalmente em local arejado. Para limpeza profunda, você pode lavar com sabão neutro e água morna.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-green-700 mb-3">A EcoEsponja Mágica é adequada para todas as superfícies?</h3>
              <p className="text-gray-700">Sim! A EcoEsponja Mágica é segura para uso em vidros, espelhos, cerâmicas, inox, madeira tratada, plásticos e muito mais. Sua textura suave não risca nem danifica superfícies delicadas.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-green-700 mb-3">Posso usar com produtos químicos de limpeza?</h3>
              <p className="text-gray-700">Sim, a EcoEsponja Mágica é compatível com a maioria dos produtos de limpeza. No entanto, recomendamos evitar o uso com alvejantes concentrados ou solventes fortes, que podem degradar o material.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-green-700 mb-3">Qual o prazo de entrega?</h3>
              <p className="text-gray-700">As entregas são realizadas em todo Brasil, com prazo médio de 3 a 7 dias úteis, dependendo da sua localização. Todas as compras incluem código de rastreamento.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-b from-green-50 to-green-100 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-sm font-bold bg-green-600 text-white rounded-full px-4 py-1 mb-4">
              OFERTA POR TEMPO LIMITADO
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Leve sua EcoEsponja Mágica hoje com <span className="text-green-600">50% de desconto</span>
            </h2>
            
            <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-6">
                <div className="text-left">
                  <p className="text-lg text-gray-700 mb-2">Pacote com 1 unidade</p>
                  <div className="flex items-center mb-3">
                    <span className="text-gray-400 line-through text-lg mr-3">De R$ 59,90</span>
                    <span className="text-3xl font-bold text-green-600">Por R$ 39,90</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                      <i className="fas fa-fire mr-1"></i> Últimas 37 unidades
                    </div>
                  </div>
                </div>
                
                <img 
                  src="/img/esponja1.png" 
                  alt="EcoEsponja Mágica" 
                  className="w-32 h-32 md:w-40 md:h-40 object-contain"
                />
                
                <div className="text-center md:text-right">
                  <div className="bg-yellow-100 text-yellow-700 p-3 rounded-lg mb-3">
                    <i className="fas fa-credit-card mr-2"></i>
                    <span className="font-semibold">Até 12x sem juros</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2"><i className="fas fa-lock mr-1"></i> Compra 100% segura</p>
                  <div className="flex justify-center md:justify-end">
                    <i className="fab fa-cc-visa mx-1 text-gray-600 text-2xl"></i>
                    <i className="fab fa-cc-mastercard mx-1 text-gray-600 text-2xl"></i>
                    <i className="fab fa-cc-amex mx-1 text-gray-600 text-2xl"></i>
                  </div>
                </div>
              </div>
              
              <a 
                href="https://seguro.vitrinedaserra.com.br/r/H8EGQ51RUZ" 
                className="block w-full bg-green-600 hover:bg-green-700 text-white text-xl font-bold py-4 rounded-lg text-center shadow-lg transition-all transform hover:-translate-y-1">
                <i className="fas fa-shopping-cart mr-2"></i> GARANTIR MINHA ECOESPONJA AGORA
              </a>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <div className="flex items-center">
                <div className="text-green-600 mr-3">
                  <i className="fas fa-truck-fast text-2xl"></i>
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-800">Entrega Rápida</p>
                  <p className="text-sm text-gray-600">7-15 dias para todo Brasil</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="text-green-600 mr-3">
                  <i className="fas fa-undo text-2xl"></i>
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-800">7 Dias de Garantia</p>
                  <p className="text-sm text-gray-600">98% dos clientes se apaixonam no primeiro uso</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="text-green-600 mr-3">
                  <i className="fas fa-shield-alt text-2xl"></i>
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-800">Compra Segura</p>
                  <p className="text-sm text-gray-600">Site protegido e verificado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-green-300 rounded-full opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-green-300 rounded-full opacity-20 transform translate-x-1/3 translate-y-1/3"></div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <i className="fas fa-leaf text-green-400 mr-2"></i> EcoEsponja
              </h3>
              <p className="text-gray-300 mb-4">
                Soluções sustentáveis e eficientes para sua limpeza diária.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <i className="fab fa-facebook text-xl mr-1"></i>
                  <span>Facebook</span>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <i className="fab fa-instagram text-xl mr-1"></i>
                  <span>Instagram</span>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <i className="fab fa-youtube text-xl mr-1"></i>
                  <span>YouTube</span>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Links Úteis</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Contato</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <i className="fas fa-envelope mr-2 text-green-400"></i>
                  <span>contato@ecosponja.com.br</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-phone mr-2 text-green-400"></i>
                  <span>(11) 98765-4321</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-clock mr-2 text-green-400"></i>
                  <span>Seg-Sex: 9h às 18h</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} EcoEsponja. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
} 