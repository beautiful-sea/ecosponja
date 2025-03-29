'use client'

import { useState, memo, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Links da navegação extraídos para evitar re-renderizações
const navigationLinks = [
  { href: "/", label: "Início" },
  { href: "/sobre-nos", label: "Sobre Nós" },
  { href: "https://seguro.vitrinedaserra.com.br/r/H8EGQ51RUZ", label: "Comprar", external: true },
  { href: "/politica-de-trocas", label: "Política de Trocas" }
];

// Item individual do menu memoizado
const MenuItem = memo(({ href, label, external, onClick }: { href: string, label: string, external?: boolean, onClick?: () => void }) => {
  if (external) {
    return (
      <a 
        href={href} 
        className="text-gray-700 hover:text-green-600 font-medium"
        onClick={onClick}
      >
        {label}
      </a>
    );
  }
  
  return (
    <Link 
      href={href} 
      className="text-gray-700 hover:text-green-600 font-medium"
      onClick={onClick}
    >
      {label}
    </Link>
  );
});

MenuItem.displayName = 'MenuItem';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Memoizamos a função que fecha o menu
  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Memoizamos a função que alterna o estado do menu
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  return (
    <nav className="bg-white py-4 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-green-600">EcoEsponja Mágica</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navigationLinks.map((link, index) => (
              <MenuItem 
                key={index} 
                href={link.href} 
                label={link.label} 
              />
            ))}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-gray-700 hover:text-green-600 focus:outline-none"
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {navigationLinks.map((link, index) => (
                <MenuItem 
                  key={index} 
                  href={link.href} 
                  label={link.label} 
                  onClick={handleCloseMenu}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default memo(Navigation); 