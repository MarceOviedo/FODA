import React from 'react';
import type { AnalysisResultData, AnalysisItem } from '../types';

const CheckIcon: React.FC<{ className: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const XCircleIcon: React.FC<{ className: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const LightbulbIcon: React.FC<{ className: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-4.665a5.98 5.98 0 0 0-1.5-3.545M12 18h.008M12 18h-.008m-2.25-4.5a5.981 5.981 0 0 1-1.5-3.545m1.5 4.665a6.01 6.01 0 0 1-1.5-4.665m0 0a5.98 5.98 0 0 1 1.5-3.545m1.5 4.665a6.01 6.01 0 0 0-1.5-4.665" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a2.25 2.25 0 0 0-2.25 2.25v.75a.75.75 0 0 1-1.5 0v-.75A3.75 3.75 0 0 1 12 1.5a3.75 3.75 0 0 1 3.75 3.75v.75a.75.75 0 0 1-1.5 0v-.75A2.25 2.25 0 0 0 12 3Z" />
  </svg>
);

const translationMap: { [key in 'Strengths' | 'Weaknesses' | 'Opportunities' | 'Threats']: string } = {
  Strengths: 'Fortalezas',
  Weaknesses: 'Debilidades',
  Opportunities: 'Oportunidades',
  Threats: 'Amenazas',
};

const ResultItem: React.FC<{ item: AnalysisItem }> = ({ item }) => (
  <div className={`p-4 rounded-lg mb-3 ${item.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
    <div className="flex items-start">
      {item.isCorrect ? (
        <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0 mr-3 mt-0.5" />
      ) : (
        <XCircleIcon className="h-6 w-6 text-red-500 flex-shrink-0 mr-3 mt-0.5" />
      )}
      <div>
        <p className="font-semibold text-gray-800">{item.item}</p>
        <p className={`mt-1 text-sm ${item.isCorrect ? 'text-green-700' : 'text-red-700'}`}>{item.reasoning}</p>
        {!item.isCorrect && item.suggestion && (
          <p className="mt-2 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-md p-2 inline-block">
            Sugerencia: Mover a <span className="font-bold">{translationMap[item.suggestion]}</span>
          </p>
        )}
      </div>
    </div>
  </div>
);


interface ResultCategoryProps {
  title: string;
  items: AnalysisItem[];
  color: string;
}

const ResultCategory: React.FC<ResultCategoryProps> = ({ title, items, color }) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <h3 className={`text-xl font-bold mb-4 ${color}`}>{title}</h3>
    {items.length > 0 ? (
      items.map((item, index) => <ResultItem key={index} item={item} />)
    ) : (
      <p className="text-gray-500 italic">No se proporcionaron elementos para esta categoría.</p>
    )}
  </div>
);

interface AnalysisResultProps {
  results: AnalysisResultData;
  onReset: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ results, onReset }) => {
  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-4">Resultados del Análisis</h2>
      <p className="text-center text-lg text-gray-600 mb-8">Aquí está la evaluación de tu análisis FODA impulsada por IA.</p>

      {results.overallFeedback && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-6 rounded-r-lg mb-8 shadow-lg flex items-start">
           <LightbulbIcon className="h-8 w-8 text-blue-500 flex-shrink-0 mr-4" />
          <div>
            <h4 className="font-bold text-lg mb-1">Comentarios Generales</h4>
            <p>{results.overallFeedback}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ResultCategory title="Fortalezas" items={results.strengths.items} color="text-green-600" />
        <ResultCategory title="Debilidades" items={results.weaknesses.items} color="text-red-600" />
        <ResultCategory title="Oportunidades" items={results.opportunities.items} color="text-blue-600" />
        <ResultCategory title="Amenazas" items={results.threats.items} color="text-yellow-600" />
      </div>

      <div className="text-center mt-12">
        <button
          onClick={onReset}
          className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Comenzar un Nuevo Análisis
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult;