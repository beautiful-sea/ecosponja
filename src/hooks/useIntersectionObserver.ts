import { useEffect, useState, useRef } from 'react';

interface UseIntersectionObserverProps {
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

/**
 * Hook personalizado para observar interseção de elementos com o viewport
 * Usado para implementar carregamento lazy (preguiçoso) de componentes pesados
 */
export const useIntersectionObserver = ({
  rootMargin = '0px',
  threshold = 0,
  triggerOnce = true
}: UseIntersectionObserverProps = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Se já foi acionado e a opção triggerOnce está ativa, não precisamos continuar observando
    if (hasTriggered && triggerOnce) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementVisible = entry.isIntersecting;
        setIsVisible(isElementVisible);
        
        if (isElementVisible && triggerOnce) {
          setHasTriggered(true);
        }
      },
      { rootMargin, threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [rootMargin, threshold, triggerOnce, hasTriggered]);

  return { ref, isVisible, setRef: (node: HTMLElement | null) => { ref.current = node; } };
};

export default useIntersectionObserver; 