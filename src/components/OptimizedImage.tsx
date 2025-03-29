'use client'

import { useState, useEffect, memo } from 'react'
import Image, { ImageProps } from 'next/image'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError' | 'loading'> {
  lowQualityPlaceholder?: boolean;
  loadPriority?: 'eager' | 'lazy' | 'critical';
}

/**
 * Componente de imagem otimizado que:
 * 1. Carrega de forma progressiva (de baixa para alta qualidade)
 * 2. Prioriza imagens críticas acima da dobra
 * 3. Adia o carregamento de imagens não essenciais
 */
const OptimizedImage = memo(({
  src,
  alt,
  width,
  height,
  className = '',
  lowQualityPlaceholder = false,
  loadPriority = 'lazy',
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(loadPriority === 'critical' || loadPriority === 'eager');

  // Para imagens com carregamento adiado, iniciamos o carregamento após a renderização inicial
  useEffect(() => {
    if (loadPriority === 'lazy') {
      // Atraso pequeno para dar prioridade a outras operações críticas
      const timer = setTimeout(() => {
        setShouldLoad(true);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [loadPriority]);

  if (!shouldLoad) {
    // Placeholder para imagens ainda não carregadas
    return (
      <div 
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{ width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height }}
        aria-label={alt}
      />
    );
  }

  // Apenas define priority se for crítico, sem definir propriedade loading
  const imgProps: Partial<ImageProps> = {
    ...props,
  };
  
  if (loadPriority === 'critical') {
    imgProps.priority = true;
  }
  
  return (
    <Image
      src={src}
      alt={alt || ''}
      width={width}
      height={height}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      onLoadingComplete={() => setIsLoaded(true)}
      {...imgProps}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage; 