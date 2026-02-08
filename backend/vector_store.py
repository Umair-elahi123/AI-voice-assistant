"""
Vector Store Module
Author: Umair Elahi
Description: Manages document embeddings and semantic search using ChromaDB
"""

import os
from typing import List, Dict, Optional
from pathlib import Path

import chromadb
from chromadb.config import Settings
import httpx
from dotenv import load_dotenv

load_dotenv()


class VectorStore:
    """Manages document embeddings and semantic search"""
    
    def __init__(self):
        self.chroma_dir = Path(os.getenv("CHROMA_DIR", "./chroma_db"))
        self.chroma_dir.mkdir(exist_ok=True)
        
        # Initialize ChromaDB
        self.client = chromadb.PersistentClient(
            path=str(self.chroma_dir),
            settings=Settings(anonymized_telemetry=False)
        )
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name="documents",
            metadata={"description": "PDF document chunks"}
        )
        
        # OpenRouter settings for embeddings
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.embedding_url = "https://openrouter.ai/api/v1/embeddings"
        
        self._initialized = False
        print("Vector store initialized")
    
    async def _get_embedding(self, text: str) -> List[float]:
        """
        Get embedding for text using OpenRouter
        
        Note: For production, consider using a local embedding model
        or cached embeddings to reduce API calls
        """
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.embedding_url,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "text-embedding-ada-002",
                        "input": text
                    }
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return result["data"][0]["embedding"]
                else:
                    # Fallback: use simple TF-IDF style embedding
                    return self._simple_embedding(text)
        
        except Exception as e:
            print(f"Error getting embedding: {str(e)}")
            # Fallback to simple embedding
            return self._simple_embedding(text)
    
    def _simple_embedding(self, text: str, dim: int = 384) -> List[float]:
        """
        Create a simple embedding using character-based hashing
        This is a fallback when API embeddings fail
        """
        import hashlib
        import numpy as np
        
        # Use hash to create deterministic embedding
        hash_obj = hashlib.sha256(text.encode())
        hash_bytes = hash_obj.digest()
        
        # Convert to float array
        embedding = []
        for i in range(0, len(hash_bytes), 2):
            if len(embedding) >= dim:
                break
            val = int.from_bytes(hash_bytes[i:i+2], 'big') / 65535.0
            embedding.append(val)
        
        # Pad if needed
        while len(embedding) < dim:
            embedding.append(0.0)
        
        # Normalize
        norm = np.linalg.norm(embedding)
        if norm > 0:
            embedding = (np.array(embedding) / norm).tolist()
        
        return embedding
    
    def add_documents(self, texts: List[str], metadata: Optional[Dict] = None):
        """
        Add documents to vector store
        
        Args:
            texts: List of text chunks
            metadata: Optional metadata for documents
        """
        try:
            # Prepare documents
            ids = [f"doc_{i}" for i in range(len(texts))]
            metadatas = [metadata or {} for _ in texts]
            
            # For simplicity, we'll use ChromaDB's default embedding function
            # In production, you might want to use custom embeddings
            self.collection.add(
                documents=texts,
                metadatas=metadatas,
                ids=ids
            )
            
            self._initialized = True
            print(f"Added {len(texts)} documents to vector store")
        
        except Exception as e:
            print(f"Error adding documents: {str(e)}")
            raise
    
    def search(self, query: str, k: int = 3) -> List[str]:
        """
        Search for relevant documents
        
        Args:
            query: Search query
            k: Number of results to return
            
        Returns:
            List of relevant document texts
        """
        try:
            if not self._initialized or self.collection.count() == 0:
                return []
            
            results = self.collection.query(
                query_texts=[query],
                n_results=min(k, self.collection.count())
            )
            
            if results and results["documents"]:
                return results["documents"][0]
            
            return []
        
        except Exception as e:
            print(f"Error searching documents: {str(e)}")
            return []
    
    def clear(self):
        """Clear all documents from vector store"""
        try:
            # Delete collection
            self.client.delete_collection(name="documents")
            
            # Recreate collection
            self.collection = self.client.get_or_create_collection(
                name="documents",
                metadata={"description": "PDF document chunks"}
            )
            
            self._initialized = False
            print("Vector store cleared")
        
        except Exception as e:
            print(f"Error clearing vector store: {str(e)}")
            raise
    
    def count_documents(self) -> int:
        """Get count of documents in store"""
        try:
            return self.collection.count()
        except:
            return 0
    
    def is_initialized(self) -> bool:
        """Check if vector store has documents"""
        return self._initialized and self.collection.count() > 0