'use client'

import Link from 'next/link'
import Image from 'next/image'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'

export default function SobreNos() {
  return (
    <main>
      <Navigation />
      
      {/* Banner Hero Otimizado */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-green-50 to-green-500/20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-green-100 text-green-600 font-bold px-4 py-1 rounded-full mb-4">
              NOSSA HISTÓRIA
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-6">Conheça a EcoEsponja Mágica</h1>
            <p className="text-gray-700 text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              Uma empresa brasileira comprometida com a <span className="font-bold">sustentabilidade</span>, 
              <span className="font-bold"> inovação</span> e o <span className="font-bold">bem-estar</span> das famílias
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#historia" className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-colors inline-flex items-center">
                <i className="fas fa-book-open mr-2"></i> Nossa História
              </a>
              <a href="#equipe" className="bg-white hover:bg-gray-100 text-green-600 font-medium py-3 px-6 rounded-lg shadow-md transition-colors inline-flex items-center border border-green-200">
                <i className="fas fa-users mr-2"></i> Conheça Nossa Equipe
              </a>
            </div>
          </div>
        </div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-300 rounded-full opacity-20 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-300 rounded-full opacity-20 transform -translate-x-1/2 translate-y-1/3"></div>
      </section>
      
      {/* História e Conquistas */}
      <section id="historia" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
              <div className="md:w-1/2">
                <span className="inline-block bg-blue-100 text-blue-600 font-bold px-4 py-1 rounded-full mb-3">
                  DESDE 2020
                </span>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Nossa Jornada de Impacto</h2>
                <p className="text-gray-700 mb-4 text-lg">A EcoEsponja Mágica nasceu em 2020, quando um grupo de empreendedores apaixonados por sustentabilidade identificou um problema significativo: o alto desperdício causado por esponjas tradicionais e seu impacto ambiental devastador.</p>
                <p className="text-gray-700 mb-6">Após dois anos de intensa pesquisa e desenvolvimento, em colaboração com especialistas em materiais sustentáveis, criamos uma solução revolucionária que rapidamente se tornou referência em limpeza ecológica no Brasil.</p>
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 shadow-sm mb-6">
                  <p className="text-green-700 font-medium italic">
                    "Nossa missão vai além de criar produtos. Queremos transformar a relação das pessoas com o meio ambiente através de escolhas diárias mais conscientes."
                  </p>
                  <p className="text-sm text-gray-600 mt-2">— Marcela Santos, Fundadora e CEO</p>
                </div>
              </div>
              <div className="md:w-1/2 bg-white p-4 rounded-lg shadow-lg">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  <img 
                    src="/img/sobre-nos/nossa-fabrica.jpg" 
                    alt="Nossa fábrica sustentável" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          
            {/* Métricas de Impacto */}
            <div className="bg-gray-50 rounded-xl shadow-md p-8 mb-16">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-10">Nosso Impacto em Números</h3>
              <div className="flex flex-wrap justify-around gap-y-8">
                <div className="text-center w-full sm:w-1/2 md:w-1/3 px-4">
                  <div className="bg-white rounded-lg shadow-sm px-4 py-6 h-full transform transition-transform hover:scale-105">
                    <div className="text-5xl font-bold text-green-600 mb-2">50.000+</div>
                    <p className="text-gray-700 font-medium">Famílias Beneficiadas</p>
                    <p className="text-sm text-gray-500 mt-2">Clientes satisfeitos em todo o Brasil</p>
                  </div>
                </div>
                <div className="text-center w-full sm:w-1/2 md:w-1/3 px-4">
                  <div className="bg-white rounded-lg shadow-sm px-4 py-6 h-full transform transition-transform hover:scale-105">
                    <div className="text-5xl font-bold text-green-600 mb-2">600.000+</div>
                    <p className="text-gray-700 font-medium">Esponjas Não Descartadas</p>
                    <p className="text-sm text-gray-500 mt-2">Redução de lixo nos oceanos e aterros</p>
                  </div>
                </div>
                <div className="text-center w-full sm:w-1/2 md:w-1/3 px-4">
                  <div className="bg-white rounded-lg shadow-sm px-4 py-6 h-full transform transition-transform hover:scale-105">
                    <div className="text-5xl font-bold text-green-600 mb-2">1.000+</div>
                    <p className="text-gray-700 font-medium">Árvores Plantadas</p>
                    <p className="text-sm text-gray-500 mt-2">Através do nosso programa de reflorestamento</p>
                  </div>
                </div>
              </div>
            </div>
          
            {/* Linha do Tempo */}
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-10">Nossa Evolução</h3>
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-5 md:left-1/2 w-1 bg-green-600 transform md:-translate-x-1/2"></div>
              
              {[
                {
                  year: "2020",
                  title: "O Nascimento da Ideia",
                  desc: "Identificamos o problema do desperdício de esponjas tradicionais e seu impacto ambiental devastador.",
                  align: "right"
                },
                {
                  year: "2021",
                  title: "Pesquisa e Desenvolvimento",
                  desc: "Parceria com laboratórios especializados em materiais sustentáveis para criar nossa solução inovadora.",
                  align: "left"
                },
                {
                  year: "2022",
                  title: "Lançamento da EcoEsponja",
                  desc: "Após testes rigorosos, a EcoEsponja Mágica é finalmente lançada no mercado brasileiro com grande aceitação.",
                  align: "right"
                },
                {
                  year: "2023",
                  title: "Expansão Nacional",
                  desc: "Crescimento exponencial e distribuição em todo o território nacional, com mais de 30.000 clientes satisfeitos.",
                  align: "left"
                },
                {
                  year: "2024",
                  title: "Reconhecimento e Premiações",
                  desc: "Recebemos o prêmio 'Inovação Sustentável' e fomos destacados entre as startups mais promissoras do Brasil.",
                  align: "right"
                },
                {
                  year: "2025",
                  title: "Novos Horizontes",
                  desc: "Início do desenvolvimento de uma linha completa de produtos sustentáveis para o lar, mantendo nossa missão eco-friendly.",
                  align: "left"
                }
              ].map((item, index) => (
                <div key={index} 
                    className={`relative mb-12 md:w-1/2 ${
                      item.align === "left" ? "md:mr-auto md:pr-12 md:text-right" : "md:ml-auto md:pl-12 md:left-0"
                    } ml-12 md:ml-0`}
                >
                  {/* Marcador no celular */}
                  <div className="md:hidden absolute w-5 h-5 bg-green-600 rounded-full left-[-38px] top-1.5"></div>
                  
                  {/* Marcador no desktop */}
                  <div className={`hidden md:block absolute w-5 h-5 bg-green-600 rounded-full top-1.5
                       left-[-42px] md:left-auto ${item.align === "left" ? "md:right-[-45px]" : "md:left-[-45px]"}`}></div>
                  
                  <div className={`bg-white p-5 rounded-lg shadow-md border-t-4 ${
                      index % 2 === 0 ? "border-green-500" : "border-blue-500"
                    } transition-transform hover:scale-[1.03]`}
                  >
                    <div className="font-bold text-green-600 mb-1">{item.year}</div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-700">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Missão e Valores */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-yellow-100 text-yellow-600 font-bold px-4 py-1 rounded-full mb-3">
              NOSSOS PRINCÍPIOS
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Missão, Visão e Valores</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Conheça os princípios fundamentais que orientam todas as nossas decisões e ações
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg p-8 shadow-lg border-t-4 border-blue-500 transform transition-transform hover:scale-105">
              <div className="text-4xl text-blue-500 mb-4 flex justify-center">
                <i className="fas fa-bullseye"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 text-blue-700 text-center">Nossa Missão</h3>
              <p className="text-gray-700">Transformar o mercado de produtos de limpeza com soluções sustentáveis, eficientes e acessíveis, reduzindo o impacto ambiental das atividades domésticas diárias.</p>
              <p className="text-gray-700 mt-3">Buscamos conscientizar consumidores sobre a importância de escolhas sustentáveis no dia a dia.</p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg border-t-4 border-purple-500 transform transition-transform hover:scale-105">
              <div className="text-4xl text-purple-500 mb-4 flex justify-center">
                <i className="fas fa-eye"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 text-purple-700 text-center">Nossa Visão</h3>
              <p className="text-gray-700">Ser reconhecida como a empresa líder em produtos de limpeza sustentáveis no Brasil até 2030, influenciando positivamente os hábitos de consumo da população.</p>
              <p className="text-gray-700 mt-3">Queremos um mundo onde sustentabilidade e eficiência caminhem sempre juntas.</p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg border-t-4 border-green-500 transform transition-transform hover:scale-105">
              <div className="text-4xl text-green-500 mb-4 flex justify-center">
                <i className="fas fa-heart"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 text-green-700 text-center">Nossos Valores</h3>
              <ul className="space-y-3">
                {[
                  {
                    icon: "fas fa-leaf",
                    title: "Sustentabilidade",
                    desc: "Compromisso com práticas eco-friendly"
                  },
                  {
                    icon: "fas fa-flask",
                    title: "Inovação",
                    desc: "Busca contínua por novas tecnologias"
                  },
                  {
                    icon: "fas fa-medal",
                    title: "Qualidade",
                    desc: "Produtos que realmente funcionam"
                  },
                  {
                    icon: "fas fa-heart",
                    title: "Empatia",
                    desc: "Foco nas necessidades reais das famílias"
                  }
                ].map((value, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <i className={`${value.icon} text-green-600 mt-1`}></i>
                    <div>
                      <h4 className="font-semibold">{value.title}</h4>
                      <p className="text-gray-700 text-sm">{value.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Nossa Equipe */}
      <section id="equipe" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-purple-100 text-purple-600 font-bold px-4 py-1 rounded-full mb-3">
              PESSOAS INCRÍVEIS
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Conheça Nossa Equipe</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Os talentos apaixonados que trabalham todos os dias para tornar o mundo mais limpo e sustentável
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                img: "/img/team/marcela.png",
                name: "Marcela Santos",
                role: "Fundadora e CEO",
                desc: "Visionária apaixonada por sustentabilidade e inovação, Marcela lidera nossa missão com determinação e propósito."
              },
              {
                img: "/img/team/ricardo.png",
                name: "Ricardo Oliveira",
                role: "Diretor de Inovação",
                desc: "Especialista em biomateriais sustentáveis, Ricardo é responsável pelo desenvolvimento de todos os nossos produtos revolucionários."
              },
              {
                img: "/img/team/camila.png",
                name: "Camila Ferreira",
                role: "Diretora de Sustentabilidade",
                desc: "Com mestrado em Gestão Ambiental, Camila garante que nossos processos e produtos sigam os mais rígidos padrões ambientais."
              }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg transition-transform hover:-translate-y-2 duration-300">
                <div className="relative overflow-hidden">
                  <div className="aspect-w-1 aspect-h-1">
                    <img 
                      src={member.img} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="font-bold text-xl">{member.name}</h3>
                      <p className="text-white/90 font-medium">{member.role}</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-700">{member.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gray-50 p-6 rounded-lg shadow-md max-w-3xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 rounded-full p-3">
                <i className="fas fa-handshake text-green-600 text-2xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Junte-se à Nossa Equipe</h3>
                <p className="text-gray-700">Estamos sempre em busca de talentos que compartilham nossa paixão por sustentabilidade e inovação.</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <a href="mailto:carreiras@ecosponja.com.br" className="inline-flex items-center text-green-600 hover:text-green-800 font-medium">
                Envie seu currículo <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA - Conhecer Produtos */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Faça Parte da Revolução Sustentável</h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Junte-se a milhares de brasileiros que estão transformando seus lares com produtos que respeitam o meio ambiente
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/#comprar" 
                    className="bg-white text-green-600 hover:bg-gray-100 py-3 px-8 rounded-lg font-bold shadow-lg transition-all transform hover:-translate-y-1 inline-flex items-center">
                <i className="fas fa-shopping-cart mr-2"></i> Conheça Nossos Produtos
              </Link>
              <Link href="/contato" 
                    className="bg-transparent text-white border-2 border-white hover:bg-white/10 py-3 px-8 rounded-lg font-medium transition-colors inline-flex items-center">
                <i className="fas fa-envelope mr-2"></i> Entre em Contato
              </Link>
            </div>
            
            <div className="mt-10 flex justify-center space-x-6">
              <a href="#" className="text-white hover:text-white/80 transition-colors" aria-label="Facebook">
                <i className="fab fa-facebook text-2xl" aria-hidden="true"></i>
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-white hover:text-white/80 transition-colors" aria-label="Instagram">
                <i className="fab fa-instagram text-2xl" aria-hidden="true"></i>
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-white hover:text-white/80 transition-colors" aria-label="YouTube">
                <i className="fab fa-youtube text-2xl" aria-hidden="true"></i>
                <span className="sr-only">YouTube</span>
              </a>
              <a href="#" className="text-white hover:text-white/80 transition-colors" aria-label="LinkedIn">
                <i className="fab fa-linkedin text-2xl" aria-hidden="true"></i>
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
} 