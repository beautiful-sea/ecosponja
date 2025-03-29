'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

// Carregamento dinâmico do FAQ com chunk separado
const FAQ = dynamic(() => import('./FAQ'), {
  loading: () => <div className="py-16 bg-gray-50"><div className="container mx-auto px-4 text-center">Carregando...</div></div>,
  ssr: false
})

export default function LazyFAQSection() {
  const [isMounted, setIsMounted] = useState(false)
  const { ref, isVisible } = useIntersectionObserver({
    rootMargin: '200px', // Precarregar quando estiver a 200px de distância
    triggerOnce: true
  })

  // Evita hidratação incorreta
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Componente de placeholder enquanto o FAQ não é carregado
  const PlaceholderContent = () => (
    <div className="py-16 bg-gray-50">
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
          {/* Placeholders para as perguntas */}
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (!isMounted) return null

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} id="faq-section">
      {isVisible ? <FAQ /> : <PlaceholderContent />}
    </div>
  )
} 