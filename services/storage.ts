import { AppState, Message } from '../types';

const STORAGE_KEY = 'cipher_blue_team_mentor_v1';

export interface SavedSession {
  state: AppState;
  messages: Message[];
  apiKey: string;
  lastActive: number;
}

export const loadSession = (): SavedSession | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load session", err);
    return null;
  }
};

export const saveSession = (data: SavedSession) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save session", err);
  }
};

export const clearSession = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};
