"""
AI Agent Module
Author: Umair Elahi
Description: Handles AI interactions using OpenRouter free models
"""

import os
import uuid
from typing import Dict, List, Optional
from datetime import datetime

import httpx
from dotenv import load_dotenv

load_dotenv()


class AIAgent:
    """AI Agent using OpenRouter free models"""
    
    def __init__(self, vector_store):
        self.vector_store = vector_store
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.model = os.getenv("MODEL_NAME", "meta-llama/llama-3.1-8b-instruct:free")
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        
        # Store conversation history
        self.conversations: Dict[str, List[Dict]] = {}
        
        if not self.api_key:
            raise ValueError("OPENROUTER_API_KEY not found in environment variables")
        
        print(f"AI Agent initialized with model: {self.model}")
    
    def _get_system_prompt(self) -> str:
        """Get the system prompt for the AI"""
        return """You are an intelligent AI assistant created by Umair Elahi. You help users analyze and understand PDF documents through natural conversation.

Your capabilities:
- Answer questions about uploaded PDF documents with high accuracy
- Provide summaries and insights from document content
- Engage in natural, friendly conversation
- Cite specific information from the documents when relevant

Guidelines:
- Be concise but informative
- If you don't know something, admit it honestly
- When answering from documents, mention that you're referencing the uploaded content
- Be helpful, friendly, and professional

Remember: You're designed to make document analysis easy and conversational."""
    
    async def generate_response(
        self,
        message: str,
        conversation_id: Optional[str] = None
    ) -> Dict:
        """
        Generate AI response using OpenRouter
        
        Args:
            message: User's message
            conversation_id: Optional conversation ID for context
            
        Returns:
            Dict with response and conversation_id
        """
        # Create or get conversation ID
        if not conversation_id:
            conversation_id = str(uuid.uuid4())
        
        # Initialize conversation history if needed
        if conversation_id not in self.conversations:
            self.conversations[conversation_id] = []
        
        # Retrieve relevant context from vector store
        context = ""
        if self.vector_store.is_initialized():
            try:
                relevant_docs = self.vector_store.search(message, k=3)
                if relevant_docs:
                    context = "\n\n".join([
                        f"Document excerpt:\n{doc}" for doc in relevant_docs
                    ])
            except Exception as e:
                print(f"Error retrieving context: {str(e)}")
        
        # Build messages for API
        messages = [
            {"role": "system", "content": self._get_system_prompt()}
        ]
        
        # Add conversation history (keep last 6 messages for context)
        messages.extend(self.conversations[conversation_id][-6:])
        
        # Add context if available
        user_message = message
        if context:
            user_message = f"""Based on the following document excerpts, please answer the question.

Document Context:
{context}

Question: {message}

Please provide a clear, accurate answer based on the document content. If the answer isn't in the documents, let me know."""
        
        messages.append({"role": "user", "content": user_message})
        
        # Call OpenRouter API
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    self.base_url,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://github.com/umair-elahi/ai-voice-assistant",
                        "X-Title": "AI Voice Assistant"
                    },
                    json={
                        "model": self.model,
                        "messages": messages,
                        "temperature": 0.7,
                        "max_tokens": 1000,
                        "top_p": 0.9,
                        "frequency_penalty": 0.0,
                        "presence_penalty": 0.0
                    }
                )
                
                response.raise_for_status()
                result = response.json()
                
                # Extract AI response
                ai_response = result["choices"][0]["message"]["content"]
                
                # Update conversation history
                self.conversations[conversation_id].append({
                    "role": "user",
                    "content": message
                })
                self.conversations[conversation_id].append({
                    "role": "assistant",
                    "content": ai_response
                })
                
                return {
                    "response": ai_response,
                    "conversation_id": conversation_id,
                    "model": self.model
                }
        
        except httpx.HTTPStatusError as e:
            error_detail = e.response.text
            print(f"OpenRouter API error: {error_detail}")
            
            # Fallback response
            return {
                "response": "I apologize, but I'm having trouble connecting to my AI service. Please try again in a moment.",
                "conversation_id": conversation_id,
                "error": str(e)
            }
        
        except Exception as e:
            print(f"Error generating response: {str(e)}")
            return {
                "response": "I encountered an error processing your request. Please try again.",
                "conversation_id": conversation_id,
                "error": str(e)
            }
    
    def clear_conversation(self, conversation_id: str):
        """Clear a specific conversation history"""
        if conversation_id in self.conversations:
            del self.conversations[conversation_id]
    
    def get_conversation_count(self) -> int:
        """Get number of active conversations"""
        return len(self.conversations)