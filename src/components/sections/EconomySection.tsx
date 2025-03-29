'use client'

import React, { memo } from 'react';
import SimpleIcon from '../SimpleIcon';

const EconomySection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-yellow-100 text-yellow-700 font-bold px-4 py-1 rounded-full mb-3">
            ECONOMIA COMPROVADA
          </span>
          <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <SimpleIcon name="fas fa-coins" className="text-yellow-500 mr-3 text-4xl" /> Economize Mais de R$100 Por Ano
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            O investimento inteligente que protege seu bolso e sua família ao mesmo tempo. Veja a comparação:
          </p>
        </div>
        
        {/* Tabela econômica responsiva */}
        <div className="max-w-3xl mx-auto overflow-x-auto bg-white rounded-lg shadow-lg mb-12">
          <table className="w-full min-w-full">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-4 px-3 md:px-6 text-left font-bold text-sm md:text-lg">Tipo de Esponja</th>
                <th className="py-4 px-2 md:px-6 text-center font-bold text-sm md:text-lg">Duração</th>
                <th className="py-4 px-3 md:px-6 text-right font-bold text-sm md:text-lg">Gasto Anual</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b bg-red-50">
                <td className="py-4 md:py-5 px-3 md:px-6 text-left">
                  <div className="flex items-center">
                    <SimpleIcon name="fas fa-times-circle" className="text-red-500 mr-2" />
                    <span className="text-sm md:text-base">Esponja comum</span>
                  </div>
                </td>
                <td className="py-4 md:py-5 px-2 md:px-6 text-center text-sm md:text-base">1 semana</td>
                <td className="py-4 md:py-5 px-3 md:px-6 text-right font-semibold text-red-600 text-lg md:text-xl">R$ 144,00</td>
              </tr>
              <tr className="bg-green-50">
                <td className="py-4 md:py-5 px-3 md:px-6 text-left font-semibold text-green-700">
                  <div className="flex items-center">
                    <SimpleIcon name="fas fa-check-circle" className="text-green-500 mr-2" />
                    <span className="text-sm md:text-base">EcoEsponja Mágica</span>
                  </div>
                </td>
                <td className="py-4 md:py-5 px-2 md:px-6 text-center text-sm md:text-base">12 meses</td>
                <td className="py-4 md:py-5 px-3 md:px-6 text-right font-bold text-green-700 text-lg md:text-2xl">R$ 39,90</td>
              </tr>
            </tbody>
            <tfoot className="bg-gray-100">
              <tr>
                <td colSpan={2} className="py-3 md:py-4 px-3 md:px-6 text-right font-bold text-sm md:text-base">Sua economia anual:</td>
                <td className="py-3 md:py-4 px-3 md:px-6 text-right font-bold text-green-600 text-lg md:text-xl">R$ 104,10</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Versão alternativa para dispositivos muito pequenos */}
        <div className="md:hidden max-w-xs mx-auto mb-8">
          <div className="mb-4 bg-white rounded-lg shadow-md p-4">
            <h4 className="font-bold text-lg text-center mb-2">Economia Comparativa</h4>
            <p className="text-center text-gray-700 mb-2">Veja quanto você economiza ao ano:</p>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-medium">Esponjas comuns:</span>
              <span className="text-red-600 font-bold">R$ 144,00</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-medium">EcoEsponja Mágica:</span>
              <span className="text-green-700 font-bold">R$ 39,90</span>
            </div>
            <div className="flex justify-between items-center pt-2 mt-2 border-t border-green-500">
              <span className="font-bold">Sua economia:</span>
              <span className="text-green-600 font-bold text-xl">R$ 104,10</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="bg-white p-5 rounded-lg shadow-md flex flex-col items-center text-center transform transition-transform hover:scale-105">
            <div className="text-4xl text-green-500 mb-3">
              <SimpleIcon name="fas fa-wallet" />
            </div>
            <h3 className="font-bold text-lg mb-2">Economia para Seu Bolso</h3>
            <p className="text-gray-700">Reduza seus gastos com produtos de limpeza em mais de R$100 por ano.</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md flex flex-col items-center text-center transform transition-transform hover:scale-105">
            <div className="text-4xl text-green-500 mb-3">
              <SimpleIcon name="fas fa-heart" />
            </div>
            <h3 className="font-bold text-lg mb-2">Proteção para Sua Família</h3>
            <p className="text-gray-700">Material antibacteriano que elimina 99,9% dos germes nocivos à saúde.</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md flex flex-col items-center text-center transform transition-transform hover:scale-105">
            <div className="text-4xl text-green-500 mb-3">
              <SimpleIcon name="fas fa-globe-americas" />
            </div>
            <h3 className="font-bold text-lg mb-2">Menos Lixo no Planeta</h3>
            <p className="text-gray-700">Reduza seu impacto ambiental eliminando dezenas de esponjas descartáveis.</p>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto bg-yellow-50 p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-6 border-l-4 border-yellow-500">
          <div className="text-5xl text-yellow-500">
            <SimpleIcon name="fas fa-lightbulb" />
          </div>
          <div>
            <p className="text-2xl font-bold text-green-700 mb-2">Uma família média gasta R$432 por ano com esponjas!</p>
            <p className="text-gray-700">Com o kit família da EcoEsponja Mágica (3 unidades), você economiza mais de R$330 anualmente enquanto protege a saúde da sua família.</p>
            <div className="flex items-center mt-3 text-green-600">
              <SimpleIcon name="fas fa-check-circle" className="mr-2" />
              <span className="font-medium">Investimento inteligente que se paga em menos de 1 mês</span>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <a href="#comprar" 
             className="bg-green-600 hover:bg-green-700 text-white py-4 px-10 rounded-lg font-bold transition-colors inline-block text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            QUERO ECONOMIZAR R$100+ POR ANO
          </a>
        </div>
      </div>
    </section>
  );
};

export default memo(EconomySection); 