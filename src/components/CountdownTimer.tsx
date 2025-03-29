'use client'

import { useState, useEffect, memo } from 'react'

interface CountdownTimerProps {
  deadline?: Date;
}

const CountdownTimer = memo(({ deadline }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  useEffect(() => {
    // Definir a data de término (padrão: 24h a partir do carregamento)
    const countdownDate = deadline || new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = countdownDate.getTime() - now;
      
      // Cálculos de tempo
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      // Atualização do estado com os valores calculados
      setTimeLeft({
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      });
    };

    // Atualiza imediatamente
    updateCountdown();
    
    // Configura o intervalo para atualizar a cada segundo
    const interval = setInterval(updateCountdown, 1000);
    
    // Limpeza quando o componente for desmontado
    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <div className="flex justify-center gap-4">
      <div className="flex flex-col items-center bg-white px-4 py-2 rounded-lg shadow-md w-20">
        <span className="text-2xl font-bold text-green-600">{timeLeft.days}</span>
        <p className="text-sm text-gray-600">Dias</p>
      </div>
      <div className="flex flex-col items-center bg-white px-4 py-2 rounded-lg shadow-md w-20">
        <span className="text-2xl font-bold text-green-600">{timeLeft.hours}</span>
        <p className="text-sm text-gray-600">Horas</p>
      </div>
      <div className="flex flex-col items-center bg-white px-4 py-2 rounded-lg shadow-md w-20">
        <span className="text-2xl font-bold text-green-600">{timeLeft.minutes}</span>
        <p className="text-sm text-gray-600">Minutos</p>
      </div>
      <div className="flex flex-col items-center bg-white px-4 py-2 rounded-lg shadow-md w-20">
        <span className="text-2xl font-bold text-green-600">{timeLeft.seconds}</span>
        <p className="text-sm text-gray-600">Segundos</p>
      </div>
    </div>
  );
});

CountdownTimer.displayName = 'CountdownTimer';

export default CountdownTimer; 