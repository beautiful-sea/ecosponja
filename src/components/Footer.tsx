import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">EcoEsponja Mágica</h3>
            <p className="text-gray-300 mb-4">Limpeza Eficiente, Consciência Sustentável</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white">Início</Link></li>
              <li><Link href="/sobre-nos" className="text-gray-300 hover:text-white">Sobre Nós</Link></li>
              <li><Link href="/politica-de-trocas" className="text-gray-300 hover:text-white">Política de Trocas</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <p className="text-gray-300 mb-2">
              <i className="fas fa-envelope mr-2"></i> contato@ecoesponja.com.br
            </p>
            <p className="text-gray-300">
              <i className="fas fa-phone mr-2"></i> (11) 9999-9999
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} EcoEsponja Mágica. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
} 