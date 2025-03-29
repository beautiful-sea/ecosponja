'use client'

import React, { memo } from 'react';
import SimpleIcon from '../SimpleIcon';

// Array com os dados dos benefícios para evitar repetição de código e melhorar performance
const benefits = [
  {
    color: 'blue',
    icon: 'fas fa-tint',
    title: 'Super Absorção',
    description: 'Absorve até <strong>10x mais líquido</strong> que esponjas comuns, facilitando a limpeza e reduzindo o tempo gasto em tarefas domésticas.',
    features: [
      'Captura derramamentos rapidamente',
      'Seca superfícies em segundos'
    ]
  },
  {
    color: 'green',
    icon: 'fas fa-calendar-alt',
    title: 'Durabilidade Incrível',
    description: 'Dura até <strong>12 meses</strong> sem perder a qualidade, substituindo dezenas de esponjas tradicionais e economizando seu dinheiro.',
    features: [
      'Não desfaz mesmo com uso intenso',
      'Mantém a eficiência por 1 ano'
    ]
  },
  {
    color: 'purple',
    icon: 'fas fa-shield-alt',
    title: 'Anti-Bacteriana',
    description: 'Material especial que <strong>elimina 99,9% das bactérias</strong>, mantendo sua cozinha mais segura e protegendo a saúde da sua família.',
    features: [
      'Previne contaminação cruzada',
      'Não desenvolve odores desagradáveis'
    ]
  },
  {
    color: 'yellow',
    icon: 'fas fa-layer-group',
    title: 'Multiuso',
    description: 'Funciona em <strong>qualquer superfície</strong> - vidros, cerâmica, aço inox, madeira e muito mais, sem riscar ou danificar.',
    features: [
      'Ideal para panelas antiaderentes',
      'Perfeita para superfícies delicadas'
    ]
  },
  {
    color: 'red',
    icon: 'fas fa-recycle',
    title: 'Ecológica',
    description: 'Produzida com materiais <strong>sustentáveis e biodegradáveis</strong>, reduzindo significativamente seu impacto ambiental.',
    features: [
      'Reduz resíduos plásticos',
      'Decomposição natural após o descarte'
    ]
  },
  {
    color: 'teal',
    icon: 'fas fa-spray-can',
    title: 'Limpa Sem Químicos',
    description: 'Seu design especial permite <strong>limpeza eficiente</strong> usando apenas água, reduzindo o uso de produtos químicos em sua casa.',
    features: [
      'Ideal para famílias com crianças',
      'Perfeita para pessoas com alergias'
    ]
  }
];

// Componente de benefício individual memoizado
const BenefitCard = memo(({ benefit }: { benefit: typeof benefits[0] }) => {
  const { color, icon, title, description, features } = benefit;
  
  return (
    <div className={`bg-${color}-50 rounded-lg shadow-md p-8 border-t-4 border-${color}-500 transform transition hover:scale-105`}>
      <div className={`text-4xl mb-4 text-${color}-500`}>
        <SimpleIcon name={icon} />
      </div>
      <h3 className={`text-xl font-bold mb-3 text-${color}-700`}>{title}</h3>
      <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: description }}></p>
      <ul className="mt-4 space-y-2">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center text-gray-700">
            <SimpleIcon name="fas fa-check" className="text-green-500 mr-2" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
});

BenefitCard.displayName = 'BenefitCard';

const BenefitsSection = () => {
  return (
    <section className="py-16 bg-white" id="beneficios">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-green-100 text-green-600 font-bold px-4 py-1 rounded-full mb-3">
            BENEFÍCIOS EXCLUSIVOS
          </span>
          <h2 className="text-3xl font-bold mb-4 text-gray-800 flex items-center justify-center">
            <SimpleIcon name="fas fa-star" className="text-yellow-400 mr-3 text-4xl" /> 6 Motivos Para Escolher a EcoEsponja Agora
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Descubra por que mais de 50.000 famílias brasileiras já substituíram suas esponjas comuns pela revolucionária EcoEsponja Mágica:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} benefit={benefit} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#comprar" 
             className="bg-green-600 hover:bg-green-700 text-white py-4 px-10 rounded-lg font-bold transition duration-300 inline-block text-xl shadow-lg hover:shadow-xl">
            QUERO TODOS ESSES BENEFÍCIOS <SimpleIcon name="fas fa-arrow-right" className="ml-2" />
          </a>
          <p className="text-gray-500 mt-3 text-sm">
            <SimpleIcon name="fas fa-lock" className="mr-1" /> Compra 100% segura | Entrega para todo Brasil | Garantia de 7 dias
          </p>
        </div>
      </div>
    </section>
  );
};

export default memo(BenefitsSection); 