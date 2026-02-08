// Voice Recognition Hook using Web Speech API
// Author: Umair Elahi

import { useState, useEffect, useCallback, useRef } from 'react';
import { VoiceState } from '@/types';

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const useVoice = () => {
  const [state, setState] = useState<VoiceState>({
    isListening: false,
    isSpeaking: false,
    transcript: '',
    error: null,
  });

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');

          setState((prev) => ({ ...prev, transcript }));
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setState((prev) => ({
            ...prev,
            isListening: false,
            error: event.error,
          }));
        };

        recognitionRef.current.onend = () => {
          setState((prev) => ({ ...prev, isListening: false }));
        };
      } else {
        setState((prev) => ({
          ...prev,
          error: 'Speech recognition not supported in this browser',
        }));
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Start listening
  const startListening = useCallback(() => {
    if (recognitionRef.current && !state.isListening) {
      setState((prev) => ({
        ...prev,
        isListening: true,
        transcript: '',
        error: null,
      }));
      recognitionRef.current.start();
    }
  }, [state.isListening]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop();
      setState((prev) => ({ ...prev, isListening: false }));
    }
  }, [state.isListening]);

  // Speak text using TTS
  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        setState((prev) => ({ ...prev, isSpeaking: true }));
      };

      utterance.onend = () => {
        setState((prev) => ({ ...prev, isSpeaking: false }));
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setState((prev) => ({
          ...prev,
          isSpeaking: false,
          error: 'Speech synthesis failed',
        }));
      };

      synthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setState((prev) => ({ ...prev, isSpeaking: false }));
    }
  }, []);

  // Reset transcript
  const resetTranscript = useCallback(() => {
    setState((prev) => ({ ...prev, transcript: '' }));
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    resetTranscript,
  };
};