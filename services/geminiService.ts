
import { GoogleGenAI, Type } from "@google/genai";
import { AppState, ViralityAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeVirality = async (state: AppState): Promise<ViralityAnalysis> => {
  const prompt = `
    As an EdTech UI/UX expert, analyze this math challenge post for social media virality.
    
    Post Details:
    - Question: ${state.question}
    - Difficulty: ${state.difficulty}
    - Platform: ${state.platform}
    - Background Style: ${state.bgStyle}
    - Font Family: ${state.fontFamily}
    
    Evaluate visual contrast, curiosity gap, and engagement potential.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Virality score from 0-100" },
            suggestion: { type: Type.STRING, description: "Improvement tip" },
            bestHeadline: { type: Type.STRING, description: "A high-converting headline" }
          },
          required: ["score", "suggestion", "bestHeadline"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis failed", error);
    return {
      score: 75,
      suggestion: "Try using a higher contrast background color for better readability on small screens.",
      bestHeadline: "Only Geniuses Can Solve This! 🧠"
    };
  }
};
