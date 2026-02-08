// Type definitions for AI Voice Assistant
// Author: Umair Elahi

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ChatState {
  messages: Message[];
  isConnected: boolean;
  isTyping: boolean;
  conversationId: string | null;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setIsConnected: (connected: boolean) => void;
  setIsTyping: (typing: boolean) => void;
  setConversationId: (id: string) => void;
  clearMessages: () => void;
}

export interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  error: string | null;
}

export interface UploadResult {
  success: boolean;
  filename: string;
  pages: number;
  chunks: number;
  message: string;
}

export interface WebSocketMessage {
  type: 'system' | 'voice_response' | 'typing' | 'error' | 'pong';
  message?: string;
  transcript?: string;
  response?: string;
  conversation_id?: string;
  timestamp?: string;
  status?: boolean;
}

export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}