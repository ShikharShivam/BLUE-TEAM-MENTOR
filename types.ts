export interface Topic {
  id: string;
  title: string;
  description: string;
}

export interface Level {
  id: number;
  title: string;
  description: string;
  topics: Topic[];
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: number;
  isTyping?: boolean;
}

export type TeachingTone = 'calm' | 'friendly' | 'serious' | 'motivational';
export type Language = 'english' | 'hinglish';

export interface VoicePersona {
  id: string;
  name: string;
  emoji: string;
  langKeywords: string[]; // Keywords to find the voice (e.g. ['en-US', 'Google'])
  genderHint?: 'male' | 'female';
  pitch: number; // 0.1 to 2.0
  rate: number; // 0.1 to 10.0
}

export interface UserSettings {
  voiceEnabled: boolean;
  activePersonaId: string;
  tone: TeachingTone;
  language: Language;
}

export interface AppState {
  currentLevel: number;
  currentTopicId: string | null;
  settings: UserSettings;
}
