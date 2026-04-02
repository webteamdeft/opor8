
import { BusinessProfile, QuestionnaireAnswers } from "../types";
import { api } from './api';

/**
 * OPOR8 AI Synthesis Bridge
 * 
 * NOTE: We are now calling the backend API
 * to handle AI synthesis. This ensures better security and performance.
 */

export const generateSOPContent = async (
  profile: BusinessProfile,
  answers: QuestionnaireAnswers,
  docTitle: string,
  department: string
) => {
  try {
    const response = await api.post('/generate-sop', { profile, answers, docTitle, department });
    return response.content || "Failed to generate content. Please try again.";
  } catch (error) {
    console.error("API Synthesis Error:", error);
    return `Error connecting to the OPOR8 Synthesis Engine. Details: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};

export const getSOPListForPack = async (departments: string[]) => {
  try {
    return await api.post('/sop-titles', { departments });
  } catch (error) {
    console.error("API Title Generation Error:", error);
    return [
      { title: "Standard Operating Continuity Plan", department: departments[0] || "Operations" },
      { title: "Digital Security & Data Governance", department: "Compliance" }
    ];
  }
};
