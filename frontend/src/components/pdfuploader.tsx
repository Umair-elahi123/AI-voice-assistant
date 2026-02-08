// PDF Uploader Component
// Author: Umair Elahi

'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function PDFUploader() {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadStatus({
          success: true,
          message: `Successfully processed ${data.filename} (${data.pages} pages, ${data.chunks} chunks)`,
        });
      } else {
        setUploadStatus({
          success: false,
          message: data.detail || 'Upload failed',
        });
      }
    } catch (error) {
      setUploadStatus({
        success: false,
        message: 'Failed to upload file. Please try again.',
      });
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden
          border-2 border-dashed rounded-2xl p-8
          transition-all duration-300 cursor-pointer
          ${
            isDragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
          }
          ${uploading ? 'cursor-not-allowed opacity-60' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10" />

        <div className="relative flex flex-col items-center justify-center gap-4 text-center">
          {uploading ? (
            <>
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  Processing PDF...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Please wait while we analyze your document
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-float">
                {isDragActive ? (
                  <Upload className="w-8 h-8 text-white" />
                ) : (
                  <FileText className="w-8 h-8 text-white" />
                )}
              </div>
              
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {isDragActive ? 'Drop your PDF here' : 'Upload PDF Document'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Drag & drop or click to select (Max 10MB)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upload Status */}
      {uploadStatus && (
        <div
          className={`mt-4 p-4 rounded-xl flex items-start gap-3 ${
            uploadStatus.success
              ? 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-200 border border-green-300 dark:border-green-700'
              : 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-700'
          }`}
        >
          {uploadStatus.success ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <p className="text-sm">{uploadStatus.message}</p>
        </div>
      )}
    </div>
  );
}