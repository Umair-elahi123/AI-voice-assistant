"""
AI Voice Assistant Backend Server
Author: Umair Elahi
Description: FastAPI server with WebSocket support for real-time voice assistant
"""

import os
import json
import asyncio
from datetime import datetime
from typing import List, Dict, Optional
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv

from agent import AIAgent
from pdf_processor import PDFProcessor
from vector_store import VectorStore

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="AI Voice Assistant API",
    description="Real-time voice assistant with PDF analysis capabilities by Umair Elahi",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
pdf_processor = PDFProcessor()
vector_store = VectorStore()
ai_agent = AIAgent(vector_store)

# Create upload directory
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "./uploads"))
UPLOAD_DIR.mkdir(exist_ok=True)

# Store active WebSocket connections
active_connections: Dict[str, WebSocket] = {}


# Pydantic models
class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: Optional[str] = None


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    timestamp: str


class UploadResponse(BaseModel):
    success: bool
    filename: str
    pages: int
    chunks: int
    message: str


# Health check endpoint
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "AI Voice Assistant",
        "author": "Umair Elahi",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "components": {
            "vector_store": vector_store.is_initialized(),
            "ai_agent": True,
            "pdf_processor": True
        }
    }


@app.post("/upload", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload and process a PDF file
    """
    try:
        # Validate file
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Check file size
        max_size = int(os.getenv("MAX_FILE_SIZE", 10485760))  # 10MB default
        contents = await file.read()
        if len(contents) > max_size:
            raise HTTPException(status_code=400, detail=f"File size exceeds {max_size/1024/1024}MB limit")
        
        # Save file
        file_path = UPLOAD_DIR / file.filename
        with open(file_path, "wb") as f:
            f.write(contents)
        
        # Process PDF
        print(f"Processing PDF: {file.filename}")
        text_chunks = pdf_processor.process_pdf(str(file_path))
        
        # Store in vector database
        print(f"Storing {len(text_chunks)} chunks in vector database")
        vector_store.add_documents(text_chunks, metadata={"filename": file.filename})
        
        # Get page count
        import fitz  # PyMuPDF
        doc = fitz.open(str(file_path))
        page_count = len(doc)
        doc.close()
        
        return UploadResponse(
            success=True,
            filename=file.filename,
            pages=page_count,
            chunks=len(text_chunks),
            message=f"Successfully processed {file.filename}"
        )
    
    except Exception as e:
        print(f"Error uploading PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process a chat message and return AI response
    """
    try:
        # Generate response
        response = await ai_agent.generate_response(
            message=request.message,
            conversation_id=request.conversation_id
        )
        
        return ChatResponse(
            response=response["response"],
            conversation_id=response["conversation_id"],
            timestamp=datetime.now().isoformat()
        )
    
    except Exception as e:
        print(f"Error in chat: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """
    WebSocket endpoint for real-time voice communication
    """
    await websocket.accept()
    active_connections[client_id] = websocket
    
    try:
        print(f"Client {client_id} connected")
        
        # Send welcome message
        await websocket.send_json({
            "type": "system",
            "message": "Connected to AI Voice Assistant by Umair Elahi",
            "timestamp": datetime.now().isoformat()
        })
        
        while True:
            # Receive message
            data = await websocket.receive_json()
            message_type = data.get("type")
            
            if message_type == "voice_input":
                # Process voice input
                transcript = data.get("transcript", "")
                conversation_id = data.get("conversation_id")
                
                print(f"Received voice input from {client_id}: {transcript}")
                
                # Send typing indicator
                await websocket.send_json({
                    "type": "typing",
                    "status": True
                })
                
                try:
                    # Generate AI response
                    response = await ai_agent.generate_response(
                        message=transcript,
                        conversation_id=conversation_id
                    )
                    
                    # Send response
                    await websocket.send_json({
                        "type": "voice_response",
                        "transcript": transcript,
                        "response": response["response"],
                        "conversation_id": response["conversation_id"],
                        "timestamp": datetime.now().isoformat()
                    })
                
                except Exception as e:
                    print(f"Error generating response: {str(e)}")
                    await websocket.send_json({
                        "type": "error",
                        "message": f"Error: {str(e)}"
                    })
                
                finally:
                    # Stop typing indicator
                    await websocket.send_json({
                        "type": "typing",
                        "status": False
                    })
            
            elif message_type == "ping":
                # Respond to ping
                await websocket.send_json({
                    "type": "pong",
                    "timestamp": datetime.now().isoformat()
                })
    
    except WebSocketDisconnect:
        print(f"Client {client_id} disconnected")
        active_connections.pop(client_id, None)
    
    except Exception as e:
        print(f"WebSocket error for {client_id}: {str(e)}")
        active_connections.pop(client_id, None)
        try:
            await websocket.close()
        except:
            pass


@app.delete("/clear")
async def clear_vector_store():
    """
    Clear all documents from vector store
    """
    try:
        vector_store.clear()
        return {"success": True, "message": "Vector store cleared"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing vector store: {str(e)}")


@app.get("/stats")
async def get_stats():
    """
    Get system statistics
    """
    return {
        "active_connections": len(active_connections),
        "documents_count": vector_store.count_documents(),
        "timestamp": datetime.now().isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    
    print(f"""
    ╔═══════════════════════════════════════════════════════╗
    ║   AI Voice Assistant Backend Server                   ║
    ║   Author: Umair Elahi                                 ║
    ║   Running on: http://{host}:{port}                    ║
    ╚═══════════════════════════════════════════════════════╝
    """)
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )