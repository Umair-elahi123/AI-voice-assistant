"""
PDF Processor Module
Author: Umair Elahi
Description: Processes PDF files and extracts text for analysis
"""

import os
from typing import List
from pathlib import Path

import fitz  # PyMuPDF


class PDFProcessor:
    """Processes PDF files and extracts text content"""
    
    def __init__(self):
        self.chunk_size = int(os.getenv("CHUNK_SIZE", 1000))
        self.chunk_overlap = int(os.getenv("CHUNK_OVERLAP", 200))
        print(f"PDF Processor initialized (chunk_size={self.chunk_size}, overlap={self.chunk_overlap})")
    
    def process_pdf(self, file_path: str) -> List[str]:
        """
        Extract text from PDF and split into chunks
        
        Args:
            file_path: Path to PDF file
            
        Returns:
            List of text chunks
        """
        try:
            # Open PDF
            doc = fitz.open(file_path)
            
            # Extract text from all pages
            full_text = ""
            for page_num in range(len(doc)):
                page = doc[page_num]
                text = page.get_text()
                full_text += f"\n\n--- Page {page_num + 1} ---\n\n{text}"
            
            doc.close()
            
            # Split into chunks
            chunks = self._split_text(full_text)
            
            print(f"Extracted {len(chunks)} chunks from PDF")
            return chunks
        
        except Exception as e:
            print(f"Error processing PDF: {str(e)}")
            raise
    
    def _split_text(self, text: str) -> List[str]:
        """
        Split text into overlapping chunks
        
        Args:
            text: Full text to split
            
        Returns:
            List of text chunks
        """
        chunks = []
        
        # Remove extra whitespace
        text = " ".join(text.split())
        
        # Split by sentences (simple approach)
        sentences = text.replace("! ", "!|").replace("? ", "?|").replace(". ", ".|").split("|")
        
        current_chunk = ""
        
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
            
            # Check if adding this sentence exceeds chunk size
            if len(current_chunk) + len(sentence) > self.chunk_size:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                
                # Start new chunk with overlap
                if chunks and self.chunk_overlap > 0:
                    # Take last part of previous chunk for overlap
                    words = current_chunk.split()
                    overlap_words = words[-min(len(words), self.chunk_overlap // 5):]
                    current_chunk = " ".join(overlap_words) + " " + sentence
                else:
                    current_chunk = sentence
            else:
                current_chunk += " " + sentence
        
        # Add final chunk
        if current_chunk.strip():
            chunks.append(current_chunk.strip())
        
        return chunks
    
    def extract_metadata(self, file_path: str) -> dict:
        """
        Extract metadata from PDF
        
        Args:
            file_path: Path to PDF file
            
        Returns:
            Dictionary of metadata
        """
        try:
            doc = fitz.open(file_path)
            metadata = doc.metadata
            
            info = {
                "title": metadata.get("title", ""),
                "author": metadata.get("author", ""),
                "subject": metadata.get("subject", ""),
                "pages": len(doc),
                "file_size": os.path.getsize(file_path)
            }
            
            doc.close()
            return info
        
        except Exception as e:
            print(f"Error extracting metadata: {str(e)}")
            return {}