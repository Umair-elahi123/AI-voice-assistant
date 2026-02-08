// WebSocket Hook for real-time communication
// Author: Umair Elahi

import { useEffect, useRef, useCallback } from 'react';
import { WebSocketMessage } from '@/types';
import useChatStore from '@/store/chatStore';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

export const useWebSocket = (clientId: string) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { setIsConnected, setIsTyping, addMessage, setConversationId } = useChatStore();

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(`${WS_URL}/ws/${clientId}`);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        
        // Clear reconnection timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);

          switch (data.type) {
            case 'system':
              addMessage({
                role: 'system',
                content: data.message || '',
              });
              break;

            case 'voice_response':
              if (data.transcript) {
                addMessage({
                  role: 'user',
                  content: data.transcript,
                });
              }
              if (data.response) {
                addMessage({
                  role: 'assistant',
                  content: data.response,
                });
              }
              if (data.conversation_id) {
                setConversationId(data.conversation_id);
              }
              break;

            case 'typing':
              setIsTyping(data.status || false);
              break;

            case 'error':
              addMessage({
                role: 'system',
                content: `Error: ${data.message}`,
              });
              break;

            default:
              console.log('Unknown message type:', data.type);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);

        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, 3000);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
    }
  }, [clientId, setIsConnected, setIsTyping, addMessage, setConversationId]);

  const sendMessage = useCallback((data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected');
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    sendMessage,
    disconnect,
  };
};