// Root Layout Component
// Author: Umair Elahi

import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Fira_Code } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: 'AI Voice Assistant | Umair Elahi',
  description: 'Intelligent voice assistant with PDF analysis powered by AI - Created by Umair Elahi',
  keywords: ['AI', 'Voice Assistant', 'PDF Analysis', 'Umair Elahi', 'OpenRouter', 'LLM'],
  authors: [{ name: 'Umair Elahi' }],
  openGraph: {
    title: 'AI Voice Assistant',
    description: 'Intelligent voice assistant with PDF analysis',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${firaCode.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}