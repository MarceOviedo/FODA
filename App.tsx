import React, { useState, useCallback } from 'react';
import SWOTQuadrant from './components/SWOTQuadrant';
import AnalysisResult from './components/AnalysisResult';
import { analyzeSwot } from './services/geminiService';
import type { SWOTData, AnalysisResultData } from './types';

const App: React.FC = () => {
  const [swotData, setSwotData] = useState<SWOTData>({
    strengths: '',
    weaknesses: '',
    opportunities: '',
    threats: '',
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = useCallback((category: keyof SWOTData) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSwotData(prev => ({ ...prev, [category]: e.target.value }));
  }, []);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await analyzeSwot(swotData);
      setAnalysisResult(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error desconocido.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSwotData({ strengths: '', weaknesses: '', opportunities: '', threats: '' });
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  };
  
  // Fix: Add a type guard to ensure `val` is a string before calling `trim()`.
  // This resolves a TypeScript error where `val` was being inferred as `unknown`.
  const isButtonDisabled = Object.values(swotData).every(val => typeof val === 'string' && val.trim() === '') || isLoading;

  if (analysisResult) {
    return <AnalysisResult results={analysisResult} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Validador de FODA con IA
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
            Introduce los puntos de tu análisis FODA a continuación. Nuestra IA verificará si están en la categoría correcta y te dará su opinión.
          </p>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SWOTQuadrant
              title="Fortalezas"
              value={swotData.strengths}
              onChange={handleInputChange('strengths')}
              color="text-green-600"
              placeholder="ej., Fuerte reconocimiento de marca&#x0a;Equipo experimentado&#x0a;Tecnología propia"
            />
            <SWOTQuadrant
              title="Debilidades"
              value={swotData.weaknesses}
              onChange={handleInputChange('weaknesses')}
              color="text-red-600"
              placeholder="ej., Altos costos operativos&#x0a;Falta de presencia en el mercado&#x0a;Sistemas de TI obsoletos"
            />
            <SWOTQuadrant
              title="Oportunidades"
              value={swotData.opportunities}
              onChange={handleInputChange('opportunities')}
              color="text-blue-600"
              placeholder="ej., Mercados emergentes&#x0a;Nuevas tendencias tecnológicas&#x0a;Políticas gubernamentales favorables"
            />
            <SWOTQuadrant
              title="Amenazas"
              value={swotData.threats}
              onChange={handleInputChange('threats')}
              color="text-yellow-600"
              placeholder="ej., Competencia intensa&#x0a;Recesión económica&#x0a;Cambio en las preferencias del consumidor"
            />
          </div>

          <div className="mt-12 text-center">
            {error && <p className="text-red-500 mb-4 bg-red-100 p-3 rounded-lg">{error}</p>}
            <button
              onClick={handleAnalyze}
              disabled={isButtonDisabled}
              className="relative inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-white bg-gray-800 rounded-lg shadow-lg hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105"
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? 'Analizando...' : 'Validar mi FODA'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
