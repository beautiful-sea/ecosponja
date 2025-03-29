import { memo } from 'react';

interface SimpleIconProps {
  name: string;
  className?: string;
}

/**
 * Componente de ícone simplificado que usa Font Awesome
 * Este componente é otimizado para evitar problemas com carregamento de ícones
 */
const SimpleIcon = memo(({ name, className = '' }: SimpleIconProps) => {
  // Verifica se recebemos um nome de ícone Font Awesome válido
  const isFontAwesome = name.startsWith('fa') || name.startsWith('fab');
  
  if (isFontAwesome) {
    return (
      <i
        className={`${name} ${className}`}
        aria-hidden="true"
        style={{ display: 'inline-block' }}
      />
    );
  }
  
  // Fallback para exibir texto em vez do ícone se não for válido
  return <span className={className}>{name}</span>;
});

SimpleIcon.displayName = 'SimpleIcon';

export default SimpleIcon; 