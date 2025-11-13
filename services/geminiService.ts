import { GoogleGenAI, Type } from "@google/genai";
import type { SWOTData, AnalysisResultData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Fix: Removed `nullable: true` from `suggestion` properties as it is not a supported field in the Gemini API's response schema.
// The optionality of the field is handled by not including it in the `required` array.
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    strengths: {
      type: Type.OBJECT,
      properties: {
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              item: { type: Type.STRING },
              isCorrect: { type: Type.BOOLEAN },
              reasoning: { type: Type.STRING },
              suggestion: { type: Type.STRING },
            },
            required: ['item', 'isCorrect', 'reasoning']
          }
        }
      }
    },
    weaknesses: {
      type: Type.OBJECT,
      properties: {
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              item: { type: Type.STRING },
              isCorrect: { type: Type.BOOLEAN },
              reasoning: { type: Type.STRING },
              suggestion: { type: Type.STRING },
            },
            required: ['item', 'isCorrect', 'reasoning']
          }
        }
      }
    },
    opportunities: {
      type: Type.OBJECT,
      properties: {
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              item: { type: Type.STRING },
              isCorrect: { type: Type.BOOLEAN },
              reasoning: { type: Type.STRING },
              suggestion: { type: Type.STRING },
            },
            required: ['item', 'isCorrect', 'reasoning']
          }
        }
      }
    },
    threats: {
      type: Type.OBJECT,
      properties: {
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              item: { type: Type.STRING },
              isCorrect: { type: Type.BOOLEAN },
              reasoning: { type: Type.STRING },
              suggestion: { type: Type.STRING },
            },
            required: ['item', 'isCorrect', 'reasoning']
          }
        }
      }
    },
    overallFeedback: {
      type: Type.STRING,
      description: "Un resumen breve y general de la calidad del análisis FODA."
    }
  },
  required: ['strengths', 'weaknesses', 'opportunities', 'threats', 'overallFeedback']
};


export const analyzeSwot = async (swotData: SWOTData): Promise<AnalysisResultData> => {
  const { strengths, weaknesses, opportunities, threats } = swotData;

  const prompt = `
    Eres un estratega de negocios experto especializado en análisis FODA. Tu tarea es evaluar la corrección del análisis FODA enviado por un usuario. Identifica los elementos colocados en la categoría incorrecta y proporciona comentarios claros y concisos en español.

    Aquí están las definiciones a utilizar para tu análisis:
    - Fortalezas (Strengths): Atributos internos y positivos de la empresa. Cosas que controlan y hacen bien.
    - Debilidades (Weaknesses): Atributos internos y negativos de la empresa. Cosas que controlan pero que hacen mal o de las que carecen.
    - Oportunidades (Opportunities): Factores externos y positivos que la empresa puede aprovechar. Tendencias del mercado, vulnerabilidades de la competencia, etc.
    - Amenazas (Threats): Factores externos y negativos que podrían dañar a la empresa. Recesiones económicas, nuevas regulaciones, fuerte competencia, etc.

    Analiza la entrada del usuario a continuación, que se proporciona como listas separadas por saltos de línea para cada categoría. Si una categoría está vacía, analízala como tal.

    Fortalezas:
    ${strengths || 'No se proporcionó ninguna entrada.'}

    Debilidades:
    ${weaknesses || 'No se proporcionó ninguna entrada.'}

    Oportunidades:
    ${opportunities || 'No se proporcionó ninguna entrada.'}

    Amenazas:
    ${threats || 'No se proporcionó ninguna entrada.'}

    Proporciona tu análisis en el formato JSON estructurado que he especificado. Para cada elemento, indica si es correcto (isCorrect: true). Si es incorrecto, proporciona una razón y sugiere la categoría correcta (suggestion: 'Strengths', 'Weaknesses', 'Opportunities', o 'Threats'). Además, proporciona un breve comentario general sobre el análisis. Si un usuario no proporcionó elementos para una categoría, devuelve un array 'items' vacío para ella. Toda la salida de texto (reasoning, overallFeedback) debe estar en español.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as AnalysisResultData;
    return result;
  } catch (error) {
    console.error("Error analyzing SWOT with Gemini API:", error);
    throw new Error("No se pudo obtener el análisis de la IA. Por favor, verifica la entrada e inténtalo de nuevo.");
  }
};
