'use client'

import Link from 'next/link'
import Image from 'next/image'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'

export default function SobreNos() {
  return (
    <main>
      <Navigation />
      
      <section className="py-16 bg-gradient-to-r from-white/95 to-green-500/20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-green-700 mb-4">Sobre a EcoEsponja Mágica</h1>
          <p className="text-gray-700 text-lg">Conheça nossa história, missão e os valores que guiam nossa empresa</p>
        </div>
      </section>
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Nossa História</h2>
          <p className="text-gray-700 mb-4">A EcoEsponja Mágica surgiu em 2020, quando um grupo de amigos apaixonados por sustentabilidade e inovação resolveu enfrentar um problema cotidiano: o desperdício causado por esponjas tradicionais e produtos de limpeza descartáveis.</p>
          <p className="text-gray-700 mb-8">Após dois anos de pesquisa e desenvolvimento, em parceria com especialistas em materiais sustentáveis, nasceu nossa revolucionária EcoEsponja Mágica - um produto que rapidamente se tornou referência em limpeza sustentável no Brasil.</p>
          
          <div className="flex flex-wrap justify-around my-10 gap-5">
            <div className="text-center flex-1 min-w-[180px]">
              <div className="text-4xl font-bold text-green-600 mb-2">50.000+</div>
              <p className="text-gray-700">Clientes Satisfeitos</p>
            </div>
            <div className="text-center flex-1 min-w-[180px]">
              <div className="text-4xl font-bold text-green-600 mb-2">500.000+</div>
              <p className="text-gray-700">Esponjas Tradicionais Evitadas</p>
            </div>
            <div className="text-center flex-1 min-w-[180px]">
              <div className="text-4xl font-bold text-green-600 mb-2">1.000+</div>
              <p className="text-gray-700">Litros de Água Economizados</p>
            </div>
          </div>
          
          <div className="mt-12 relative">
            <div className="absolute top-0 bottom-0 left-5 w-1 bg-green-600"></div>
            
            {[
              {
                year: "2020",
                title: "O início da ideia",
                desc: "Nascimento do conceito da EcoEsponja Mágica a partir da observação do desperdício de esponjas tradicionais."
              },
              {
                year: "2021",
                title: "Pesquisa e desenvolvimento",
                desc: "Parceria com laboratórios especializados em materiais sustentáveis para criar uma solução inovadora."
              },
              {
                year: "2022",
                title: "Lançamento do produto",
                desc: "Após testes rigorosos, a EcoEsponja Mágica é finalmente lançada no mercado brasileiro."
              },
              {
                year: "2023",
                title: "Expansão nacional",
                desc: "Crescimento rápido e ampliação da distribuição para todo o território nacional."
              },
              {
                year: "2024",
                title: "Reconhecimento e premiações",
                desc: "Recebemos reconhecimentos por nossa inovação e contribuição para a sustentabilidade."
              },
              {
                year: "2025",
                title: "Novas fronteiras",
                desc: "Início do desenvolvimento de novos produtos sustentáveis para complementar nossa linha."
              }
            ].map((item, index) => (
              <div key={index} className="ml-12 mb-12 relative">
                <div className="absolute w-5 h-5 bg-green-600 rounded-full left-[-38px] top-1.5"></div>
                <div className="font-bold text-green-600 mb-1">{item.year}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-8">
            <div className="flex-1 min-w-[300px] bg-white rounded-lg p-8 shadow-md border-l-4 border-green-600">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Nossa Missão</h2>
              <p className="text-gray-700 mb-4">Transformar o mercado de produtos de limpeza com soluções sustentáveis, eficientes e acessíveis, reduzindo o impacto ambiental das atividades domésticas diárias.</p>
              <p className="text-gray-700">Buscamos conscientizar os consumidores sobre a importância de escolhas mais sustentáveis no dia a dia, provando que é possível aliar eficiência, economia e responsabilidade ambiental.</p>
            </div>
            <div className="flex-1 min-w-[300px] bg-white rounded-lg p-8 shadow-md border-l-4 border-green-600">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Nossos Valores</h2>
              <ul className="space-y-4 mt-5">
                {[
                  {
                    icon: "fas fa-leaf",
                    title: "Sustentabilidade",
                    desc: "Compromisso constante com práticas eco-friendly em toda a cadeia produtiva."
                  },
                  {
                    icon: "fas fa-flask",
                    title: "Inovação",
                    desc: "Busca contínua por novas tecnologias e materiais que reduzam o impacto ambiental."
                  },
                  {
                    icon: "fas fa-medal",
                    title: "Qualidade",
                    desc: "Produtos de excelência que realmente cumprem o que prometem."
                  },
                  {
                    icon: "fas fa-heart",
                    title: "Empatia",
                    desc: "Desenvolvimento centrado nas reais necessidades das famílias brasileiras."
                  }
                ].map((value, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <i className={`${value.icon} text-green-600 mt-1`}></i>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{value.title}</h3>
                      <p className="text-gray-700">{value.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Nossa Equipe</h2>
          <p className="text-center text-gray-700 mb-10">Conheça as pessoas apaixonadas que trabalham todos os dias para tornar o mundo mais limpo e sustentável.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                img: "/img/team/marcela.png",
                name: "Marcela Santos",
                role: "Fundadora e CEO",
                desc: "Visionária apaixonada por sustentabilidade e inovação, lidera nossa missão com determinação."
              },
              {
                img: "/img/team/ricardo.png",
                name: "Ricardo Oliveira",
                role: "Diretor de Inovação",
                desc: "Especialista em biomateriais, responsável pelo desenvolvimento de nossos produtos revolucionários."
              },
              {
                img: "/img/team/camila.png",
                name: "Camila Ferreira",
                role: "Diretora de Sustentabilidade",
                desc: "Garante que nossos processos e produtos sigam os mais rígidos padrões ambientais."
              }
            ].map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-xl overflow-hidden shadow-md transition-transform hover:-translate-y-2 duration-300">
                <div className="overflow-hidden rounded-t-xl">
                  <div className="w-full h-64">
                    <img 
                      src={member.img} 
                      alt={member.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="p-5 text-center">
                  <p className="text-green-600 font-semibold mb-2">{member.role}</p>
                  <p className="text-gray-700">{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-800 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Faça Parte da Revolução Sustentável</h2>
          <p className="mb-8">Junte-se a nós nessa jornada por um futuro mais limpo e consciente</p>
          <Link href="/#comprar" 
                className="bg-white text-green-600 hover:bg-gray-100 py-3 px-8 rounded-lg font-medium transition-colors inline-block">
            Conheça Nossos Produtos
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
} 