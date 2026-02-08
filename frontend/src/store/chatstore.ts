// Chat Store using Zustand
// Author: Umair Elahi

import { create } from 'zustand';
import { ChatState, Message } from '@/types';

const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isConnected: false,
  isTyping: false,
  conversationId: null,

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
        },
      ],
    })),

  setIsConnected: (connected) =>
    set({ isConnected: connected }),

  setIsTyping: (typing) =>
    set({ isTyping: typing }),

  setConversationId: (id) =>
    set({ conversationId: id }),

  clearMessages: () =>
    set({ messages: [], conversationId: null }),
}));

export default useChatStore;