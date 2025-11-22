import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from '../types';

const API_KEY = process.env.API_KEY || '';

let aiClient: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

export const initializeGemini = () => {
  if (!aiClient && API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: API_KEY });
  }
};

export const getChatSession = (systemInstruction: string) => {
  if (!aiClient) initializeGemini();
  if (!aiClient) throw new Error("AI Client not initialized. Check API Key.");

  if (!chatSession) {
    chatSession = aiClient.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
      }
    });
  }
  return chatSession;
};

export const sendMessageToCoach = async (message: string): Promise<string> => {
  const chat = getChatSession(`
    You are a supportive, empathetic, and motivating Vaping Cessation Coach. 
    Your goal is to help the user quit vaping. 
    Be concise, mobile-friendly (short paragraphs), and encouraging.
    Offer coping mechanisms for cravings (breathing, drinking water, distraction).
    Celebrate their streaks. 
    If they mention a craving, suggest a specific 2-minute activity.
  `);

  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Keep going, I'm here for you.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting right now, but remember: You are stronger than the craving.";
  }
};

export const generateDailyTip = async (): Promise<string> => {
  if (!aiClient) initializeGemini();
  if (!aiClient) return "Breathe deep. This moment will pass.";

  try {
    const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Give me a one-sentence motivational tip for someone quitting vaping today.',
    });
    return response.text || "Stay strong.";
  } catch (e) {
    return "One day at a time.";
  }
};
