'use client'

import { memo } from 'react';
import SimpleIcon from './SimpleIcon';

// Dados do FAQ extraídos para evitar re-renderizações desnecessárias
const faqItems = [
  {
    question: "Quanto tempo dura a EcoEsponja Mágica?",
    answer: "Com os cuidados adequados, a EcoEsponja Mágica pode durar até 12 meses de uso diário, substituindo até 12 esponjas tradicionais nesse período. Isso representa uma economia significativa e muito menos lixo no meio ambiente."
  },
  {
    question: "Como devo lavar e conservar minha EcoEsponja Mágica?",
    answer: "Para uma durabilidade máxima, após o uso, enxágue bem com água corrente, esprema suavemente (sem torcer) e deixe secar naturalmente em local arejado. Para limpeza profunda, você pode lavar com sabão neutro e água morna uma vez por semana. Evite deixá-la em ambientes fechados e úmidos."
  },
  {
    question: "A EcoEsponja Mágica é adequada para todas as superfícies?",
    answer: "Sim! A EcoEsponja Mágica é segura para uso em vidros, espelhos, cerâmicas, inox, madeira tratada, plásticos, panelas antiaderentes e muito mais. Sua textura suave não risca nem danifica superfícies delicadas, sendo ideal para limpar até mesmo cristais e objetos valiosos."
  },
  {
    question: "Posso usar com produtos químicos de limpeza?",
    answer: "Sim, a EcoEsponja Mágica é compatível com a maioria dos produtos de limpeza. No entanto, sua tecnologia avançada permite limpar eficientemente usando apenas água em muitos casos, reduzindo sua exposição a químicos. Para maior durabilidade, recomendamos evitar alvejantes concentrados ou solventes fortes."
  },
  {
    question: "Qual o prazo de entrega?",
    answer: "As entregas são realizadas em todo Brasil, com prazo médio de 3 a 7 dias úteis para capitais e regiões metropolitanas, e de 7 a 15 dias para demais localidades. Todas as compras incluem código de rastreamento que será enviado para seu email."
  },
  {
    question: "Como funciona a garantia de 7 dias?",
    answer: "Oferecemos uma garantia incondicional de 7 dias. Se por qualquer motivo você não ficar 100% satisfeito com sua EcoEsponja, basta entrar em contato conosco através do email contato@ecosponja.com.br e solicitar o reembolso. Sem perguntas, sem burocracia! Você receberá seu dinheiro de volta em até 7 dias úteis."
  }
];

// Item individual do FAQ memoizado para evitar re-renderizações
const FAQItem = memo(({ question, answer }: { question: string, answer: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-md transform transition-transform hover:scale-[1.01]">
    <h3 className="text-xl font-bold text-green-700 mb-3 flex items-center">
      <SimpleIcon name="fas fa-question-circle" className="text-green-500 mr-3" />
      {question}
    </h3>
    <p className="text-gray-700">{answer}</p>
  </div>
));

// Memoizando o componente FAQ inteiro
const FAQ = memo(() => {
  return (
    <section className="py-16 bg-gray-50">
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
          {faqItems.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>

        <div className="text-center mt-10">
          <a href="#comprar" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block shadow-md">
            ESTOU CONVENCIDO, QUERO COMPRAR AGORA
          </a>
        </div>
      </div>
    </section>
  );
});

FAQ.displayName = 'FAQ';

export default FAQ; 