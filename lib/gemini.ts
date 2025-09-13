import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  // In a real production environment, you would want to handle this more gracefully.
  // For this project, we assume the key is always present during runtime.
  console.warn("API_KEY environment variable is not set. The application will not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const geminiModel = 'gemini-2.5-flash';

export default ai;