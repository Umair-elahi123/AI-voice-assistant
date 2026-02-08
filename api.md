# 📚 API Documentation

Complete API reference for the AI Voice Assistant backend.

## Base URL

```
http://localhost:8000
```

## Endpoints

### Health Check

#### GET `/`
Basic health check endpoint.

**Response:**
```json
{
  "status": "online",
  "service": "AI Voice Assistant",
  "author": "Umair Elahi",
  "version": "1.0.0"
}
```

---

#### GET `/health`
Detailed health check with component status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "components": {
    "vector_store": true,
    "ai_agent": true,
    "pdf_processor": true
  }
}
```

---

### PDF Upload

#### POST `/upload`
Upload and process a PDF document.

**Request:**
- Content-Type: `multipart/form-data`
- Body: FormData with `file` field

**Example (curl):**
```bash
curl -X POST http://localhost:8000/upload \
  -F "file=@document.pdf"
```

**Example (JavaScript):**
```javascript
const formData = new FormData();
formData.append('file', pdfFile);

const response = await fetch('http://localhost:8000/upload', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
```

**Response (200 OK):**
```json
{
  "success": true,
  "filename": "document.pdf",
  "pages": 25,
  "chunks": 48,
  "message": "Successfully processed document.pdf"
}
```

**Error Response (400 Bad Request):**
```json
{
  "detail": "Only PDF files are allowed"
}
```

**Constraints:**
- File must be PDF format
- Maximum size: 10MB (configurable)
- File is saved and indexed in vector database

---

### Chat

#### POST `/chat`
Send a message and get AI response.

**Request:**
```json
{
  "message": "What is this document about?",
  "conversation_id": "optional-conversation-id"
}
```

**Example:**
```javascript
const response = await fetch('http://localhost:8000/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Summarize the document',
    conversation_id: null,
  }),
});

const result = await response.json();
```

**Response (200 OK):**
```json
{
  "response": "This document discusses...",
  "conversation_id": "abc-123-def-456",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Error Response (500):**
```json
{
  "detail": "Error generating response: ..."
}
```

---

### WebSocket Connection

#### WS `/ws/{client_id}`
Real-time bidirectional communication for voice assistant.

**Connection:**
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/unique-client-id');

ws.onopen = () => {
  console.log('Connected');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};
```

**Message Types:**

##### Client → Server

**Voice Input:**
```json
{
  "type": "voice_input",
  "transcript": "What is this document about?",
  "conversation_id": "optional-id"
}
```

**Ping:**
```json
{
  "type": "ping"
}
```

##### Server → Client

**System Message:**
```json
{
  "type": "system",
  "message": "Connected to AI Voice Assistant by Umair Elahi",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Voice Response:**
```json
{
  "type": "voice_response",
  "transcript": "What is this document about?",
  "response": "This document discusses...",
  "conversation_id": "abc-123",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Typing Indicator:**
```json
{
  "type": "typing",
  "status": true
}
```

**Error:**
```json
{
  "type": "error",
  "message": "Error message here"
}
```

**Pong:**
```json
{
  "type": "pong",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

---

### Statistics

#### GET `/stats`
Get system statistics.

**Response:**
```json
{
  "active_connections": 3,
  "documents_count": 150,
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

---

### Clear Vector Store

#### DELETE `/clear`
Clear all documents from vector database.

**Response:**
```json
{
  "success": true,
  "message": "Vector store cleared"
}
```

**Error Response (500):**
```json
{
  "detail": "Error clearing vector store: ..."
}
```

---

## Error Handling

All endpoints return standard HTTP status codes:

- **200 OK**: Request successful
- **400 Bad Request**: Invalid request (e.g., wrong file type)
- **500 Internal Server Error**: Server error

Error responses follow this format:
```json
{
  "detail": "Error description"
}
```

---

## Rate Limiting

Currently, there are no rate limits on the free tier. However, OpenRouter may have their own rate limits on API calls.

---

## WebSocket Best Practices

1. **Reconnection**: Implement exponential backoff for reconnection
2. **Heartbeat**: Send ping messages every 30 seconds
3. **Error Handling**: Always handle connection errors gracefully
4. **Cleanup**: Close connections when component unmounts

Example:
```javascript
let ws;
let reconnectTimeout;

function connect() {
  ws = new WebSocket('ws://localhost:8000/ws/client-id');
  
  ws.onclose = () => {
    reconnectTimeout = setTimeout(connect, 3000);
  };
  
  // Heartbeat
  setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'ping' }));
    }
  }, 30000);
}

// Cleanup
function disconnect() {
  clearTimeout(reconnectTimeout);
  ws?.close();
}
```

---

## CORS Configuration

The backend allows requests from origins specified in the `.env` file:

```env
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

Add additional origins as comma-separated values.

---

## Examples

### Complete Upload and Chat Flow

```javascript
// 1. Upload PDF
const formData = new FormData();
formData.append('file', pdfFile);

const uploadResponse = await fetch('http://localhost:8000/upload', {
  method: 'POST',
  body: formData,
});

const uploadResult = await uploadResponse.json();
console.log(`Processed ${uploadResult.chunks} chunks`);

// 2. Ask question
const chatResponse = await fetch('http://localhost:8000/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'What is this document about?',
  }),
});

const chatResult = await chatResponse.json();
console.log('AI:', chatResult.response);
```

### WebSocket Voice Flow

```javascript
const ws = new WebSocket('ws://localhost:8000/ws/my-client');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'voice_response') {
    console.log('User said:', data.transcript);
    console.log('AI responded:', data.response);
    
    // Use Text-to-Speech
    const utterance = new SpeechSynthesisUtterance(data.response);
    speechSynthesis.speak(utterance);
  }
};

// Send voice input
function sendVoiceInput(transcript) {
  ws.send(JSON.stringify({
    type: 'voice_input',
    transcript: transcript,
    conversation_id: currentConversationId,
  }));
}
```

---

Built with ❤️ by **Umair Elahi**