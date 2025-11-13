
export interface AnalysisItem {
  item: string;
  isCorrect: boolean;
  reasoning: string;
  suggestion?: 'Strengths' | 'Weaknesses' | 'Opportunities' | 'Threats';
}

export interface AnalysisCategory {
  items: AnalysisItem[];
}

export interface AnalysisResultData {
  strengths: AnalysisCategory;
  weaknesses: AnalysisCategory;
  opportunities: AnalysisCategory;
  threats: AnalysisCategory;
  overallFeedback: string;
}

export interface SWOTData {
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
}
