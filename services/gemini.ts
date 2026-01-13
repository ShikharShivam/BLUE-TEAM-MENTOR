import { GoogleGenAI, Chat, type GenerateContentResponse } from "@google/genai";
import { INITIAL_SYSTEM_INSTRUCTION, getPersonaUpdate } from "../constants";
import { Message, TeachingTone, Language } from "../types";

let chatSession: Chat | null = null;
let currentApiKey: string | null = null;

export const initializeChat = (apiKey: string) => {
  const ai = new GoogleGenAI({ apiKey });
  currentApiKey = apiKey;
  
  // We initialize the chat with a base instruction. 
  // We will send updated system instructions as "System Messages" in the flow or via context updates if supported,
  // but for the simple Chat API, we can reinforce context in the prompt or assume the initial instruction holds.
  // Ideally, we start a fresh chat or use a persistent one. Here we create a fresh one.
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: INITIAL_SYSTEM_INSTRUCTION,
      temperature: 0.7, // Creativity balance for analogies
    },
  });
  return chatSession;
};

export const sendMessageToGemini = async (
  text: string, 
  context: { level: number; topicId: string | null; tone: TeachingTone; lang: Language },
  history: Message[]
): Promise<string> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized. API Key missing.");
  }

  // Inject context into the message to ensure the model stays in character dynamically
  const contextPrompt = getPersonaUpdate(context.level, context.topicId, context.tone, context.lang);
  const fullMessage = `
  ${contextPrompt}
  
  User Message: "${text}"
  `;

  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({
      message: fullMessage
    });
    
    return response.text || "I'm having trouble connecting to my knowledge base. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection error. Please check your API key and internet.";
  }
};
