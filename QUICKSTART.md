# ⚡ Quick Start Guide

Get up and running in 5 minutes!

## Step 1: Get OpenRouter API Key (1 minute)

1. Go to [openrouter.ai](https://openrouter.ai/)
2. Sign up (free, no credit card)
3. Create an API key
4. Copy the key (starts with `sk-or-v1-...`)

## Step 2: Backend Setup (2 minutes)

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env and paste your API key
python main.py
```

## Step 3: Frontend Setup (2 minutes)

Open a new terminal:

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

## Step 4: Use the App! 🎉

1. Open [http://localhost:3000](http://localhost:3000)
2. Allow microphone access
3. Upload a PDF
4. Click mic and ask questions!

## That's It!

You now have a fully working AI voice assistant with PDF analysis capabilities.

### Example Questions to Try:

- "What is this document about?"
- "Summarize the main points"
- "What does it say about [specific topic]?"
- "Can you explain [concept] from the document?"

---

For detailed setup and troubleshooting, see [INSTALLATION.md](./INSTALLATION.md)