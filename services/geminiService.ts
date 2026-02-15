import { GoogleGenAI, Type } from "@google/genai";
import { Message, CertificateType } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TRIAGE_MODEL = "gemini-3-flash-preview";

export const getTriageResponse = async (
  history: Message[],
  userMessage: string,
  certType: CertificateType
): Promise<string> => {
  try {
    const systemInstruction = `
      You are MedFast AI, a medical triage assistant. 
      Your goal is to gather information from a patient requesting a "${certType}".
      
      Rules:
      1. Be professional, empathetic, and concise.
      2. Ask 1-2 relevant questions at a time about symptoms, duration, and severity.
      3. DO NOT provide a diagnosis.
      4. If you detect severe "red flag" symptoms (chest pain, difficulty breathing, severe bleeding), advise immediate emergency care.
      5. Keep responses short (under 50 words) to mimic a chat interface.
      6. Continue the conversation naturally based on previous messages.
    `;

    // Convert app history to API format
    // Filter out system messages for the API context if handled via config, 
    // but here we just pass the user/model turn.
    const contents = history
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const response = await ai.models.generateContent({
      model: TRIAGE_MODEL,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 150,
      }
    });

    return response.text || "I apologize, I didn't quite catch that. Could you clarify your symptoms?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently experiencing high traffic. Please describe your main symptom again.";
  }
};

export const generateCaseSummary = async (
  chatHistory: Message[],
  certType: CertificateType
): Promise<{ summary: string; redFlags: string[] }> => {
  try {
    // Construct the transcript
    const transcript = chatHistory
      .map(m => `${m.role.toUpperCase()}: ${m.text}`)
      .join('\n');

    const prompt = `
      Analyze the following medical triage chat transcript for a "${certType}" request.
      
      Transcript:
      ${transcript}
      
      Task:
      1. Create a professional medical summary for a doctor to review (max 50 words).
      2. Identify any "Red Flags" or contraindications.
      
      Output JSON format.
    `;

    const response = await ai.models.generateContent({
      model: TRIAGE_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Professional medical summary for the doctor." },
            redFlags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of potential red flags or severe symptoms." 
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Summary Generation Error:", error);
    return {
      summary: "Error generating summary. Please review chat transcript manually.",
      redFlags: ["System Error: AI Summary Failed"]
    };
  }
};
