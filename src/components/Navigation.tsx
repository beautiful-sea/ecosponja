'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white py-4 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-green-600">EcoEsponja Mágica</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-green-600 font-medium">
              Início
            </Link>
            <Link href="/sobre-nos" className="text-gray-700 hover:text-green-600 font-medium">
              Sobre Nós
            </Link>
            <a href="https://seguro.vitrinedaserra.com.br/r/H8EGQ51RUZ" className="text-gray-700 hover:text-green-600 font-medium">
              Comprar
            </a>
            <Link href="/politica-de-trocas" className="text-gray-700 hover:text-green-600 font-medium">
              Política de Trocas
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
              <Link 
                href="/" 
                className="text-gray-700 hover:text-green-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              <Link 
                href="/sobre-nos" 
                className="text-gray-700 hover:text-green-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre Nós
              </Link>
              <a
                href="https://seguro.vitrinedaserra.com.br/r/H8EGQ51RUZ" 
                className="text-gray-700 hover:text-green-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Comprar
              </a>
              <Link 
                href="/politica-de-trocas" 
                className="text-gray-700 hover:text-green-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Política de Trocas
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 