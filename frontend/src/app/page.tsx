// Main Page Component
// Author: Umair Elahi

'use client';

import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import VoiceControl from '@/components/VoiceControl';
import PDFUploader from '@/components/PDFUploader';
import useChatStore from '@/store/chatStore';
import { generateId } from '@/lib/utils';
import { Sparkles, Github, MessageSquare, FileText } from 'lucide-react';

export default function Home() {
  const [clientId] = useState(() => generateId());
  const { clearMessages } = useChatStore();
  const [showUploader, setShowUploader] = useState(true);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass border-b border-white/20 dark:border-gray-700/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">
                AI Voice Assistant
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                by Umair Elahi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUploader(!showUploader)}
              className="px-4 py-2 rounded-full glass hover:bg-white/30 dark:hover:bg-gray-700/30 transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">
                {showUploader ? 'Hide' : 'Show'} Uploader
              </span>
            </button>
            
            <button
              onClick={clearMessages}
              className="px-4 py-2 rounded-full glass hover:bg-white/30 dark:hover:bg-gray-700/30 transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">
                Clear Chat
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row container mx-auto p-4 gap-4">
        {/* Left Sidebar - PDF Uploader */}
        {showUploader && (
          <aside className="lg:w-96 flex-shrink-0">
            <div className="glass rounded-2xl p-6 h-full">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-500" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Document Upload
                </h2>
              </div>
              <PDFUploader />
            </div>
          </aside>
        )}

        {/* Center - Chat Interface */}
        <div className="flex-1 flex flex-col glass rounded-2xl overflow-hidden">
          <ChatInterface />
        </div>

        {/* Right Sidebar - Voice Controls */}
        <aside className="lg:w-80 flex-shrink-0">
          <div className="glass rounded-2xl p-6 sticky top-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Voice Controls
              </h2>
            </div>
            
            <VoiceControl clientId={clientId} />

            {/* Info Box */}
            <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                💡 Quick Tips
              </h3>
              <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
                <li>• Upload a PDF first</li>
                <li>• Click mic to speak</li>
                <li>• Ask about the document</li>
                <li>• AI will respond with voice</li>
              </ul>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold gradient-text">
                  100%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Free AI
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800">
                <div className="text-2xl font-bold gradient-text">
                  ∞
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Unlimited
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="glass border-t border-white/20 dark:border-gray-700/50 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Built with ❤️ by{' '}
            <span className="font-semibold gradient-text">Umair Elahi</span>
          </p>
          
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/umair-elahi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <span className="text-xs text-gray-500 dark:text-gray-500">
              Powered by OpenRouter
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}