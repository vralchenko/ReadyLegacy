export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  time: string;
  sources?: ChatSource[];
  followUps?: string[];
}

export interface ChatSource {
  id: string;
  route: string | null;
  score: number;
}

export interface ChatApiResponse {
  answer: string;
  sources: ChatSource[];
  type: 'greeting' | 'result' | 'fallback';
  followUps?: string[];
}

export interface QuickQuestion {
  key: string;
  en: string;
  de: string;
  ru: string;
  ua: string;
}
