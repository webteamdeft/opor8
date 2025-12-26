
import { GoogleGenAI, Type } from "@google/genai";
import { BusinessProfile, QuestionnaireAnswers } from "../types";

/**
 * OPOR8 AI Synthesis Bridge
 * 
 * NOTE: We are calling the Gemini API directly from the frontend here to ensure
 * the app works in the preview environment without requiring a local Node.js server.
 * In a production environment, you may route these through your server.ts for 
 * additional logging, safety, and rate-limiting.
 */

export const generateSOPContent = async (
  profile: BusinessProfile,
  answers: QuestionnaireAnswers,
  docTitle: string,
  department: string
) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Act as a world-class Operations Consultant. 
      Create a high-fidelity, industrial-standard Standard Operating Procedure (SOP).
      
      BUSINESS CONTEXT:
      - Company: ${profile.name}
      - Industry: ${profile.industry}
      - Tone: ${profile.tone} (Strictly adhere to this tone)
      
      SOP METADATA:
      - Department: ${department}
      - Document Title: ${docTitle}
      
      PROCEDURAL DETAILS:
      - Specific Requirements: ${answers.specifics || 'Standard industry best practices.'}
      - Tech Stack/Tools used: ${answers.tools?.join(", ") || 'General office software'}
      - Compliance Standards: ${answers.compliance?.join(", ") || 'General business laws'}
      - Review Cycle: ${answers.cycle}
      - Final Approver: ${answers.approver}

      DOCUMENT STRUCTURE:
      1. Purpose (The "Why")
      2. Scope (Who it applies to)
      3. Definitions (Key terms)
      4. Responsibilities (Roles involved)
      5. Step-by-Step Procedure (The core logic)
      6. Quality Control / Audit Points
      7. Revision History
      
      Format the output in clean, professional Markdown. Use bolding for emphasis and tables where appropriate for data.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Optimized for procedural writing and speed
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    
    return response.text || "Failed to generate content. Please try again.";
  } catch (error) {
    console.error("Gemini Synthesis Error:", error);
    return `Error connecting to the OPOR8 Synthesis Engine. Details: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};

export const getSOPListForPack = async (departments: string[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      You are an organizational architect. 
      Generate a comprehensive list of 5 essential, high-impact SOP titles for a business in these departments: ${departments.join(", ")}. 
      Ensure the titles are professional, specific, and relevant to modern enterprise standards.
      Return the result as a JSON array of objects with "title" and "department" keys.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { 
                type: Type.STRING,
                description: "The full formal title of the SOP document."
              },
              department: { 
                type: Type.STRING,
                description: "The department this SOP belongs to."
              }
            },
            required: ["title", "department"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Title Generation Error:", error);
    return [
      { title: "Standard Operating Continuity Plan", department: departments[0] || "Operations" },
      { title: "Digital Security & Data Governance", department: "Compliance" }
    ];
  }
};
