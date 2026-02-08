# 🎨 Customization Guide

Learn how to customize your AI Voice Assistant.

## Table of Contents

1. [Change AI Model](#change-ai-model)
2. [Customize UI Design](#customize-ui-design)
3. [Modify Voice Settings](#modify-voice-settings)
4. [Adjust PDF Processing](#adjust-pdf-processing)
5. [Add New Features](#add-new-features)

---

## Change AI Model

### Available Free Models on OpenRouter

Edit `backend/.env`:

```env
# Fast and capable (recommended)
MODEL_NAME=meta-llama/llama-3.1-8b-instruct:free

# Alternative options:
# MODEL_NAME=google/gemma-2-9b-it:free
# MODEL_NAME=microsoft/phi-3-mini-128k-instruct:free
# MODEL_NAME=mistralai/mistral-7b-instruct:free
```

### Change Response Style

Edit `backend/agent.py`, find the `_get_system_prompt()` method:

```python
def _get_system_prompt(self) -> str:
    return """You are a helpful AI assistant...
    
    Personality: [Add your personality here]
    - Be more casual/formal
    - Use emojis/no emojis
    - Be brief/detailed
    
    Guidelines:
    - Your custom guidelines here
    """
```

---

## Customize UI Design

### Change Colors

Edit `frontend/tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Change these to your brand colors
        500: '#0ea5e9',  // Main blue
        600: '#0284c7',  // Darker blue
      },
      accent: {
        500: '#d946ef',  // Main purple
        600: '#c026d3',  // Darker purple
      },
    },
  },
}
```

### Change Fonts

Edit `frontend/src/app/layout.tsx`:

```typescript
import { Inter, Poppins, Roboto } from 'next/font/google';

const mainFont = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-main',
});
```

Then update `tailwind.config.js`:

```javascript
fontFamily: {
  sans: ['var(--font-main)', 'system-ui', 'sans-serif'],
}
```

### Modify Layout

Edit `frontend/src/app/page.tsx`:

```typescript
// Hide/show sidebar by default
const [showUploader, setShowUploader] = useState(false); // Change to false

// Change responsive breakpoints
<div className="flex-1 flex flex-col xl:flex-row"> // Change lg to xl
```

### Custom Animations

Add to `frontend/src/app/globals.css`:

```css
@keyframes your-animation {
  0% { /* starting state */ }
  100% { /* ending state */ }
}

.your-class {
  animation: your-animation 1s ease-in-out;
}
```

---

## Modify Voice Settings

### Change Speech Recognition Language

Edit `frontend/src/hooks/useVoice.ts`:

```typescript
recognitionRef.current.lang = 'es-ES'; // Spanish
// Options: 'en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', etc.
```

### Change Voice Synthesis Settings

Edit `frontend/src/hooks/useVoice.ts`:

```typescript
const speak = useCallback((text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Customize these
  utterance.rate = 1.2;    // Speed (0.1 to 10)
  utterance.pitch = 1.0;   // Pitch (0 to 2)
  utterance.volume = 0.8;  // Volume (0 to 1)
  
  // Select specific voice
  const voices = window.speechSynthesis.getVoices();
  utterance.voice = voices.find(v => v.name === 'Google US English') || voices[0];
  
  window.speechSynthesis.speak(utterance);
}, []);
```

### Adjust Silence Detection

Edit `frontend/src/hooks/useVoice.ts`:

```typescript
// Add after recognitionRef.current initialization
recognitionRef.current.maxAlternatives = 3; // More alternatives
```

---

## Adjust PDF Processing

### Change Chunk Size

Edit `backend/.env`:

```env
# Smaller chunks = more precise, more API calls
CHUNK_SIZE=500
CHUNK_OVERLAP=100

# Larger chunks = more context, fewer API calls
CHUNK_SIZE=2000
CHUNK_OVERLAP=400
```

### Modify Text Extraction

Edit `backend/pdf_processor.py`:

```python
def process_pdf(self, file_path: str) -> List[str]:
    doc = fitz.open(file_path)
    full_text = ""
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        
        # Get text with custom options
        text = page.get_text(
            "text",
            sort=True,  # Sort text by reading order
            flags=fitz.TEXT_PRESERVE_WHITESPACE
        )
        
        # Your custom processing here
        # Example: Remove page numbers
        # text = re.sub(r'Page \d+', '', text)
        
        full_text += f"\n\n--- Page {page_num + 1} ---\n\n{text}"
    
    doc.close()
    return self._split_text(full_text)
```

### Add Metadata Extraction

Edit `backend/pdf_processor.py`:

```python
# In process_pdf method, after extracting text:
metadata = self.extract_metadata(file_path)

# Add metadata to chunks
for i, chunk in enumerate(chunks):
    chunks[i] = f"[Document: {metadata['title']}]\n{chunk}"
```

---

## Add New Features

### Add Image Upload Support

1. **Backend** - Edit `backend/main.py`:

```python
@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    # Validate image
    if not file.content_type.startswith('image/'):
        raise HTTPException(400, "Only images allowed")
    
    # Process image (use OCR, image analysis, etc.)
    # ...
    
    return {"success": True}
```

2. **Frontend** - Create `ImageUploader.tsx`:

```typescript
export default function ImageUploader() {
  const onDrop = useCallback(async (files: File[]) => {
    // Similar to PDFUploader
    const formData = new FormData();
    formData.append('file', files[0]);
    
    await fetch(`${API_URL}/upload-image`, {
      method: 'POST',
      body: formData,
    });
  }, []);
  
  // ... rest of component
}
```

### Add Chat History Persistence

1. **Backend** - Add database support:

```python
# Install: pip install sqlalchemy

from sqlalchemy import create_engine, Column, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class ChatMessage(Base):
    __tablename__ = 'messages'
    
    id = Column(String, primary_key=True)
    conversation_id = Column(String)
    role = Column(String)
    content = Column(Text)
    timestamp = Column(DateTime)

# In main.py
engine = create_engine('sqlite:///chat_history.db')
Base.metadata.create_all(engine)
```

2. **Frontend** - Add localStorage:

```typescript
// In chatStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useChatStore = create(
  persist(
    (set) => ({
      // ... state
    }),
    {
      name: 'chat-storage',
    }
  )
);
```

### Add Export Chat Feature

Edit `frontend/src/components/ChatInterface.tsx`:

```typescript
const exportChat = () => {
  const chatText = messages
    .map(m => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n\n');
  
  const blob = new Blob([chatText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chat-${Date.now()}.txt`;
  a.click();
};

// Add button
<button onClick={exportChat}>
  Export Chat
</button>
```

### Add Dark Mode Toggle

Create `frontend/src/components/ThemeToggle.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);
  
  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 rounded-full glass"
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
```

Then add to header in `page.tsx`:

```typescript
import ThemeToggle from '@/components/ThemeToggle';

// In header
<ThemeToggle />
```

---

## Performance Optimization

### Backend Caching

```python
from functools import lru_cache

@lru_cache(maxsize=100)
def get_embedding(text: str):
    # Cached embeddings
    pass
```

### Frontend Optimization

```typescript
// Use React.memo for expensive components
import { memo } from 'react';

const MessageBubble = memo(({ message }) => {
  // Component code
});

// Lazy load components
const PDFUploader = lazy(() => import('./PDFUploader'));
```

---

## Environment-Specific Settings

### Development vs Production

Create `backend/config.py`:

```python
import os

class Config:
    DEBUG = os.getenv('DEBUG', 'False') == 'True'
    LOG_LEVEL = 'DEBUG' if DEBUG else 'INFO'
    
class DevelopmentConfig(Config):
    DEBUG = True
    
class ProductionConfig(Config):
    DEBUG = False

config = DevelopmentConfig() if os.getenv('ENV') == 'dev' else ProductionConfig()
```

---

## Testing Your Customizations

Always test after making changes:

```bash
# Backend
cd backend
python main.py

# Frontend
cd frontend
npm run dev
```

Check browser console (F12) for errors!

---

Built with ❤️ by **Umair Elahi**