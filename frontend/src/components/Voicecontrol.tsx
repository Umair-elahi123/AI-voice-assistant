// Voice Control Component
// Author: Umair Elahi

'use client';

import { useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useVoice } from '@/hooks/useVoice';
import { useWebSocket } from '@/hooks/useWebSocket';
import useChatStore from '@/store/chatStore';

interface VoiceControlProps {
  clientId: string;
}

export default function VoiceControl({ clientId }: VoiceControlProps) {
  const {
    isListening,
    isSpeaking,
    transcript,
    error,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    resetTranscript,
  } = useVoice();

  const { sendMessage } = useWebSocket(clientId);
  const { conversationId, isConnected, messages } = useChatStore();

  // Handle transcript completion
  useEffect(() => {
    if (!isListening && transcript && transcript.length > 0) {
      // Send voice input to server
      sendMessage({
        type: 'voice_input',
        transcript: transcript,
        conversation_id: conversationId,
      });

      resetTranscript();
    }
  }, [isListening, transcript, sendMessage, conversationId, resetTranscript]);

  // Auto-speak assistant responses
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant') {
      speak(lastMessage.content);
    }
  }, [messages, speak]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const toggleSpeaking = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === 'assistant') {
        speak(lastMessage.content);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Status Display */}
      <div className="text-center space-y-2">
        {!isConnected && (
          <p className="text-sm text-red-500 font-medium">
            Connecting to server...
          </p>
        )}
        {error && (
          <p className="text-sm text-red-500 font-medium">
            {error}
          </p>
        )}
        {isListening && (
          <div className="flex flex-col items-center gap-2">
            <div className="voice-wave text-blue-500">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Listening...
            </p>
            {transcript && (
              <p className="text-sm text-gray-900 dark:text-white max-w-md">
                "{transcript}"
              </p>
            )}
          </div>
        )}
        {isSpeaking && (
          <div className="flex items-center gap-2">
            <div className="voice-wave text-purple-500">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Speaking...
            </p>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-4">
        {/* Microphone Button */}
        <button
          onClick={toggleListening}
          disabled={!isConnected || isSpeaking}
          className={`
            relative group
            w-16 h-16 rounded-full
            flex items-center justify-center
            transition-all duration-300
            ${
              isListening
                ? 'bg-gradient-to-br from-red-500 to-pink-600 shadow-lg shadow-red-500/50 scale-110'
                : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {/* Pulse Ring */}
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full bg-red-500 animate-pulse-ring opacity-75" />
              <div className="absolute inset-0 rounded-full bg-red-500 animate-pulse-ring opacity-50" style={{ animationDelay: '0.3s' }} />
            </>
          )}

          {isListening ? (
            <MicOff className="w-8 h-8 text-white relative z-10" />
          ) : (
            <Mic className="w-8 h-8 text-white relative z-10" />
          )}
        </button>

        {/* Speaker Button */}
        <button
          onClick={toggleSpeaking}
          disabled={!isConnected || messages.length === 0}
          className={`
            w-16 h-16 rounded-full
            flex items-center justify-center
            transition-all duration-300
            ${
              isSpeaking
                ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/50 scale-110'
                : 'bg-gradient-to-br from-purple-500 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isSpeaking ? (
            <VolumeX className="w-8 h-8 text-white" />
          ) : (
            <Volume2 className="w-8 h-8 text-white" />
          )}
        </button>
      </div>

      {/* Instructions */}
      <div className="text-center max-w-md">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Click the microphone to start speaking. Your voice will be transcribed
          and sent to the AI assistant.
        </p>
      </div>
    </div>
  );
}