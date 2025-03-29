import Link from 'next/link'
import { memo } from 'react'
import SimpleIcon from './SimpleIcon'

// Reutilizando o componente SimpleIcon para todos os ícones
const Icon = SimpleIcon;

// Dados extraídos para evitar re-renderizações e cálculos desnecessários
const currentYear = new Date().getFullYear();

const quickLinks = [
  { href: "/", label: "Início" },
  { href: "/sobre-nos", label: "Sobre Nós" },
  { href: "/politica-de-trocas", label: "Política de Trocas" }
];

const socialLinks = [
  { icon: "fab fa-facebook-f", ariaLabel: "Facebook" },
  { icon: "fab fa-instagram", ariaLabel: "Instagram" },
  { icon: "fab fa-youtube", ariaLabel: "YouTube" }
];

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">EcoEsponja Mágica</h3>
            <p className="text-gray-300 mb-4">Limpeza Eficiente, Consciência Sustentável</p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="text-gray-300 hover:text-white" 
                  aria-label={link.ariaLabel}
                >
                  <Icon name={link.icon} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-300 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <p className="text-gray-300 mb-2">
              <Icon name="fas fa-envelope" className="mr-2" /> contato@ecoesponja.com.br
            </p>
            <p className="text-gray-300">
              <Icon name="fas fa-phone" className="mr-2" /> (11) 9999-9999
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} EcoEsponja Mágica. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default memo(Footer) 