import Link from 'next/link'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'

export default function PoliticaDeTrocas() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />

      <section className="py-12 flex-1">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800">Política de Trocas e Devoluções</h2>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Garantia de Satisfação</h3>
                  <p className="text-gray-700">Na EcoEsponja Mágica, oferecemos garantia de satisfação de 7 dias. Se você não estiver completamente satisfeito com seu produto, poderá solicitar a devolução ou troca dentro deste período.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Como Solicitar uma Troca ou Devolução</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                    <li>Entre em contato através do e-mail contato@ecoesponja.com.br</li>
                    <li>Informe o número do pedido e o motivo da solicitação</li>
                    <li>Aguarde as instruções para envio do produto</li>
                    <li>Envie o produto em sua embalagem original</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Condições para Troca ou Devolução</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>O produto deve estar em sua embalagem original</li>
                    <li>Não pode apresentar sinais de uso</li>
                    <li>Deve estar acompanhado da nota fiscal</li>
                    <li>A solicitação deve ser feita dentro do prazo de 7 dias após o recebimento</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Reembolso</h3>
                  <p className="text-gray-700">O reembolso será processado em até 7 dias úteis após o recebimento e análise do produto devolvido. O valor será estornado na mesma forma de pagamento utilizada na compra.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Custos de Envio</h3>
                  <p className="text-gray-700">Em caso de defeito do produto, os custos de envio para devolução serão cobertos pela EcoEsponja Mágica. Para devoluções por desistência, os custos de envio são de responsabilidade do cliente.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Produtos com Defeito</h3>
                  <p className="text-gray-700">Se você receber um produto com defeito, entre em contato imediatamente através do nosso e-mail. Envie fotos do produto e uma descrição detalhada do problema. Nossa equipe analisará o caso e providenciará a substituição do produto.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Dúvidas</h3>
                  <p className="text-gray-700">Para mais informações ou dúvidas sobre nossa política de trocas e devoluções, entre em contato através do e-mail contato@ecoesponja.com.br</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
} 