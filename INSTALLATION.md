# 🚀 Installation Guide

Complete step-by-step guide to set up the AI Voice Assistant.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.9 or higher) - [Download](https://python.org/)
- **npm** or **yarn** (comes with Node.js)
- **pip** (comes with Python)

## Quick Start (5 minutes)

### 1. Get OpenRouter API Key (FREE)

1. Visit [https://openrouter.ai/](https://openrouter.ai/)
2. Click "Sign Up" (you can use Google/GitHub)
3. Go to "Keys" section
4. Click "Create Key"
5. Copy your API key (starts with `sk-or-v1-...`)

**Note**: OpenRouter offers free tier models with no credit card required!

### 2. Clone/Download the Project

```bash
# If you have the zip file
unzip ai-voice-assistant.zip
cd ai-voice-assistant

# Or if using git
git clone <repository-url>
cd ai-voice-assistant
```

### 3. Backend Setup

```bash
# Navigate to backend
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your OpenRouter API key
# On Windows: notepad .env
# On Mac/Linux: nano .env
```

Your `.env` file should look like:
```env
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
MODEL_NAME=meta-llama/llama-3.1-8b-instruct:free
EMBEDDING_MODEL=voyage-ai/voyage-2
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:3000
```

### 4. Frontend Setup

```bash
# Open a new terminal
cd frontend

# Install Node dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local
```

Your `.env.local` file should contain:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```

You should see:
```
╔═══════════════════════════════════════════════════════╗
║   AI Voice Assistant Backend Server                   ║
║   Author: Umair Elahi                                 ║
║   Running on: http://0.0.0.0:8000                    ║
╚═══════════════════════════════════════════════════════╝
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
✓ Ready in 2.3s
○ Local:   http://localhost:3000
```

### 6. Open in Browser

Open your browser and go to:
```
http://localhost:3000
```

**🎉 You're ready to go!**

## First Use

1. **Allow Microphone Access**: Your browser will ask for microphone permission - click "Allow"
2. **Upload a PDF**: Drag and drop a PDF file or click to select
3. **Wait for Processing**: The system will process your PDF (this may take a few seconds)
4. **Start Talking**: Click the microphone button and ask questions about your document!

## Common Issues & Solutions

### Backend Won't Start

**Problem**: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**:
```bash
cd backend
pip install -r requirements.txt --upgrade
```

---

**Problem**: `Error: OPENROUTER_API_KEY not found`

**Solution**: Make sure you've created `.env` file in the `backend` folder with your API key.

---

### Frontend Won't Start

**Problem**: `Error: Cannot find module 'next'`

**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

**Problem**: Port 3000 already in use

**Solution**:
```bash
# Use a different port
npm run dev -- -p 3001
```
Then update `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

---

### Voice Not Working

**Problem**: Microphone button does nothing

**Solution**:
1. Make sure you're using **Chrome** or **Edge** browser
2. Check browser permissions (click lock icon in address bar)
3. Make sure you're on `localhost` or `https://` (required for mic access)
4. Try refreshing the page

---

**Problem**: Speech recognition error

**Solution**:
- Web Speech API requires Chrome/Edge browser
- Make sure you have internet connection (API needs connectivity)
- Check your microphone is working in other apps

---

### PDF Upload Fails

**Problem**: "Upload failed" error

**Solution**:
1. Check file size - must be under 10MB
2. Make sure file is a valid PDF
3. Ensure backend is running (`http://localhost:8000/health` should work)
4. Check CORS settings in backend `.env`

---

### WebSocket Connection Issues

**Problem**: "Connecting to server..." never disappears

**Solution**:
1. Make sure backend is running
2. Check WebSocket URL in frontend `.env.local`
3. Restart both frontend and backend
4. Check firewall/antivirus settings

## Updating the Project

### Update Python Dependencies
```bash
cd backend
pip install -r requirements.txt --upgrade
```

### Update Node Dependencies
```bash
cd frontend
npm update
```

## Environment Variables Reference

### Backend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENROUTER_API_KEY` | ✅ Yes | - | Your OpenRouter API key |
| `MODEL_NAME` | No | `meta-llama/llama-3.1-8b-instruct:free` | LLM model to use |
| `EMBEDDING_MODEL` | No | `voyage-ai/voyage-2` | Embedding model |
| `HOST` | No | `0.0.0.0` | Server host |
| `PORT` | No | `8000` | Server port |
| `CORS_ORIGINS` | No | `http://localhost:3000` | Allowed origins |
| `UPLOAD_DIR` | No | `./uploads` | Upload directory |
| `CHROMA_DIR` | No | `./chroma_db` | Vector DB directory |
| `MAX_FILE_SIZE` | No | `10485760` | Max file size (bytes) |
| `CHUNK_SIZE` | No | `1000` | Text chunk size |
| `CHUNK_OVERLAP` | No | `200` | Chunk overlap |

### Frontend (.env.local)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | ✅ Yes | - | Backend API URL |
| `NEXT_PUBLIC_WS_URL` | ✅ Yes | - | WebSocket URL |

## Development Tips

### Run in Production Mode

**Backend:**
```bash
cd backend
python main.py
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

### Debug Mode

**Backend with verbose logging:**
```bash
cd backend
python main.py --reload --log-level debug
```

**Frontend with debug info:**
```bash
cd frontend
npm run dev
```
Then check browser console (F12) for debug messages.

### Clear Vector Database

If you want to start fresh with documents:
```bash
# Stop backend
# Delete chroma_db folder
rm -rf backend/chroma_db
# Restart backend
```

Or use the API:
```bash
curl -X DELETE http://localhost:8000/clear
```

## Testing

### Test Backend API

```bash
# Health check
curl http://localhost:8000/health

# Upload a PDF
curl -X POST http://localhost:8000/upload \
  -F "file=@path/to/your/file.pdf"

# Chat endpoint
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is this document about?"}'
```

### Test Frontend

1. Open `http://localhost:3000`
2. Open browser console (F12)
3. Check for any errors in console
4. Test PDF upload
5. Test voice controls

## Need Help?

1. Check this installation guide
2. Look at error messages carefully
3. Try the troubleshooting section
4. Check that all prerequisites are installed
5. Make sure API keys are correct

## Next Steps

After successful installation:

1. ✅ Upload a test PDF
2. ✅ Try asking questions about it
3. ✅ Explore different voice commands
4. ✅ Check out the code and customize!

---

Built with ❤️ by **Umair Elahi**