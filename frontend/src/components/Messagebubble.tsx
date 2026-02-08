// Message Bubble Component
// Author: Umair Elahi

'use client';

import { Message } from '@/types';
import { formatTimestamp } from '@/lib/utils';
import { User, Bot, Info } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <div
      className={`flex items-start gap-3 message-enter ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      } ${isSystem ? 'justify-center' : ''}`}
    >
      {/* Avatar */}
      {!isSystem && (
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-purple-600'
              : 'bg-gradient-to-br from-purple-500 to-pink-600'
          }`}
        >
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>
      )}

      {/* Message Content */}
      <div
        className={`flex flex-col max-w-[70%] ${
          isUser ? 'items-end' : 'items-start'
        } ${isSystem ? 'max-w-md' : ''}`}
      >
        {/* Message Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
              : isSystem
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700'
              : 'glass text-gray-900 dark:text-white'
          } ${
            isUser
              ? 'rounded-tr-md'
              : isSystem
              ? 'rounded-md'
              : 'rounded-tl-md'
          }`}
        >
          {isSystem && (
            <div className="flex items-center gap-2 mb-1">
              <Info className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                System
              </span>
            </div>
          )}
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </div>
  );
}