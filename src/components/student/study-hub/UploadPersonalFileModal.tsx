'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Upload,
  FileText,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { formatFileSize } from '@/lib/utils';
import { uploadPersonalStudyFile } from '@/app/actions/study-hub';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadPersonalFileModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = (file: File) => {
    setErrorMessage(null);
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Only PDF documents are supported for the split-screen viewer.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 50MB limit.');
      return;
    }
    setSelectedFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await uploadPersonalStudyFile(formData);

      if (res.success && res.sessionId) {
        onClose();
        setSelectedFile(null);
        router.push(`/student/study-hub/${res.sessionId}`);
      } else {
        setErrorMessage(res.error || 'Failed to upload personal study file.');
      }
    } catch (err: any) {
      console.error('Upload exception:', err);
      setErrorMessage(err.message || 'Error uploading file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null);
      setErrorMessage(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-6 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Upload className="w-5 h-5 text-campus-700" />
            Upload Personal Study File
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Upload your own lecture PDF, research article, or textbook chapter to study with split-screen highlights and notes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Hidden native input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleInputChange}
            className="hidden"
          />

          {/* Drag & Drop Box */}
          {!selectedFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                isDragOver
                  ? 'border-campus-600 bg-campus-50/60'
                  : 'border-slate-200 hover:border-campus-400 bg-slate-50/60 hover:bg-slate-50'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-campus-100 text-campus-800 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">
                Click to browse or drag & drop PDF
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Standard PDF documents up to 50MB
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-campus-50/70 border border-campus-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white border border-campus-200 text-campus-800 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-xs truncate max-w-[200px] sm:max-w-[240px]">
                    {selectedFile.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>

              {!isUploading && (
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Error notice */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              onClick={handleClose}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!selectedFile || isUploading}
              onClick={handleUpload}
              className="bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs rounded-xl px-5"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  <span>Uploading & Opening...</span>
                </>
              ) : (
                <span>Open in Study Workspace</span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
