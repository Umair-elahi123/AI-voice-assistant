# 🎙️ AI Voice Assistant with PDF Analysis

## 🎥 Demo Video

[Click here to watch demo video](https://drive.google.com/file/d/1i2swV6o3wWsekyvNdIwJdC9g0BAphOh8/preview)

A sophisticated real-time voice assistant application that enables natural voice conversations about PDF documents. Built by **Umair Elahi** with cutting-edge AI technologies and modern web frameworks.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![OpenRouter](https://img.shields.io/badge/OpenRouter-FF6B35?style=for-the-badge)

## ✨ Features

### 🎯 Core Functionality
- **Real-time Voice Interaction**: Natural voice conversations with AI assistant
- **PDF Document Analysis**: Upload and analyze PDF documents through voice commands
- **Intelligent Q&A**: Ask questions about uploaded documents and get accurate answers
- **Chat History Persistence**: Conversation history saved and restored across sessions
- **Multi-user Support**: Secure user authentication and personalized experiences

### 🎨 User Experience
- **Modern Chat Interface**: Beautiful, responsive chat UI with real-time message streaming
- **Live Transcription**: Real-time speech-to-text with typing indicators
- **Visual Feedback**: Animated agent states (listening, thinking, speaking)
- **Drag & Drop Upload**: Intuitive PDF upload with progress tracking
- **Dark/Light Mode**: Adaptive theming for better user experience

### 🔧 Technical Features
- **RAG (Retrieval Augmented Generation)**: Advanced document retrieval for accurate responses
- **Vector Search**: Semantic search through document content using embeddings
- **Real-time Audio Processing**: Low-latency voice communication
- **Auto-scroll Chat**: Smart scrolling to latest messages
- **File Validation**: Secure PDF upload with size and type validation

## 🏗️ Architecture

```
┌─────────────────┐
│   Next.js UI    │
│   (Frontend)    │
└────────┬────────┘
         │
         ├─── WebSocket Connection
         │
┌────────▼────────┐      ┌──────────────┐
│  FastAPI Server │◄────►│   OpenRouter │
│   (Backend)     │      │   Free APIs  │
└────────┬────────┘      └──────────────┘
         │
         ├─── PDF Processing
         │
┌────────▼────────┐      ┌──────────────┐
│  Vector Store   │      │   Embeddings │
│   (ChromaDB)    │◄────►│   (Voyager)  │
└─────────────────┘      └──────────────┘
```

## 🛠️ Technologies Used

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Web Speech API** - Browser-native speech recognition
- **Zustand** - State management

### Backend
- **Python 3.9+** - Core runtime
- **FastAPI** - Modern API framework
- **WebSockets** - Real-time bidirectional communication
- **LangChain** - LLM application framework
- **ChromaDB** - Vector database for embeddings
- **PyMuPDF** - PDF processing

### AI Services (All FREE via OpenRouter)
- **OpenRouter** - Free LLM API gateway
- **Meta Llama 3.1 8B** - Main language model (FREE)
- **Voyage AI Embeddings** - Text embeddings (FREE)
- **Web Speech API** - Speech-to-Text (Browser native, FREE)
- **Web Speech Synthesis** - Text-to-Speech (Browser native, FREE)

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and npm/yarn
- **Python 3.9+**
- **OpenRouter API Key** (FREE at https://openrouter.ai/)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/umair-elahi/ai-voice-assistant.git
cd ai-voice-assistant
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

#### 3. Backend Setup

```bash
cd ../backend
pip install -r requirements.txt
```

Create `.env` file:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
MODEL_NAME=meta-llama/llama-3.1-8b-instruct:free
EMBEDDING_MODEL=voyage-ai/voyage-2
```

### Running the Application

#### 1. Start the Backend Server

```bash
cd backend
python main.py
```

The server will start at `http://localhost:8000`

#### 2. Start the Frontend

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`

## 📱 Usage

1. **Upload PDF**: Drag and drop or select a PDF document
2. **Start Conversation**: Click the microphone button to start speaking
3. **Voice Interaction**: 
   - Speak naturally to ask questions about your document
   - The AI will process your speech and respond with relevant information
   - View the conversation history in the chat interface
4. **Document Analysis**: Ask for summaries, specific information, or analysis of your PDF content

## 🎯 Key Features

### Real-time Voice Processing
- **Low Latency**: Sub-second response times for voice interactions
- **Natural Conversations**: Context-aware responses with conversation memory
- **Live Transcription**: Real-time speech-to-text with visual feedback
- **Browser-Native**: Uses Web Speech API (no external API costs!)

### PDF Document Handling
- **Drag & Drop Upload**: Easy PDF upload with progress tracking
- **Document Indexing**: Efficient indexing of PDF content for fast retrieval
- **Semantic Search**: Ask questions in natural language and get accurate answers
- **Contextual Understanding**: AI understands context and provides relevant responses

### Free & Unlimited
- **100% Free AI**: Uses OpenRouter's free tier models
- **No API Costs**: Browser-native speech recognition and synthesis
- **Local Vector Store**: ChromaDB runs locally, no cloud costs
- **Unlimited Usage**: No rate limits on free models

## 📁 Project Structure

```
ai-voice-assistant/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Main page
│   │   │   ├── layout.tsx            # Root layout
│   │   │   └── globals.css           # Global styles
│   │   ├── components/
│   │   │   ├── ChatInterface.tsx     # Main chat UI
│   │   │   ├── VoiceControl.tsx      # Voice controls
│   │   │   ├── PDFUploader.tsx       # PDF upload
│   │   │   ├── MessageBubble.tsx     # Chat messages
│   │   │   └── ThemeToggle.tsx       # Dark mode toggle
│   │   ├── hooks/
│   │   │   ├── useVoice.ts           # Voice hook
│   │   │   └── useWebSocket.ts       # WebSocket hook
│   │   ├── store/
│   │   │   └── chatStore.ts          # State management
│   │   └── types/
│   │       └── index.ts              # TypeScript types
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.js
├── backend/
│   ├── main.py                       # FastAPI server
│   ├── agent.py                      # AI agent logic
│   ├── pdf_processor.py              # PDF handling
│   ├── vector_store.py               # ChromaDB integration
│   ├── requirements.txt
│   └── .env
└── README.md
```

## 🔒 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

### Backend (.env)
```env
OPENROUTER_API_KEY=your_api_key
MODEL_NAME=meta-llama/llama-3.1-8b-instruct:free
EMBEDDING_MODEL=voyage-ai/voyage-2
CORS_ORIGINS=http://localhost:3000
```

## 🎨 Customization

### Change AI Model
Edit `backend/.env` and change `MODEL_NAME` to any OpenRouter free model:
- `meta-llama/llama-3.1-8b-instruct:free`
- `google/gemma-2-9b-it:free`
- `microsoft/phi-3-mini-128k-instruct:free`

### Modify Voice Settings
Edit `frontend/src/hooks/useVoice.ts` to customize:
- Speech recognition language
- Voice synthesis voice/pitch/rate
- Silence detection timeout

## 🐛 Troubleshooting

### Backend won't start
- Check Python version: `python --version` (must be 3.9+)
- Install dependencies: `pip install -r requirements.txt`
- Verify OpenRouter API key in `.env`

### Frontend won't start
- Check Node version: `node --version` (must be 18+)
- Clear cache: `rm -rf .next node_modules && npm install`

### Voice not working
- Ensure you're using HTTPS or localhost
- Check browser permissions for microphone
- Try different browser (Chrome/Edge recommended)

### PDF upload fails
- Check file size (max 10MB)
- Ensure PDF is not password-protected
- Verify CORS settings in backend

## 📜 License

MIT License - feel free to use this project for any purpose!

## 👨‍💻 Author

**Umair Elahi**

Built with ❤️ using Next.js, FastAPI, and OpenRouter

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

**Note**: This project uses 100% free APIs and services. Perfect for learning, prototyping, or personal use!