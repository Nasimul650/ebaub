'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Loader2, UploadCloud, FileCheck2, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  bucket: string;
  accept?: string;
  label?: string;
}

export function FileUpload({ onUploadSuccess, bucket, accept, label }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      setSuccess(false);
      return;
    }

    setError(null);
    setSuccess(false);
    setIsUploading(true);

    try {
      const supabase = createClient();
      
      // Generate safe unique filename
      const fileExt = file.name.split('.').pop();
      const safeName = file.name.replace(/[^a-zA-Z0-9]/g, '_').replace(`_${fileExt}`, '');
      const fileName = `${Date.now()}-${safeName}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Retrieve the public URL
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
      
      onUploadSuccess(urlData.publicUrl);
      setSuccess(true);
      
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setIsUploading(false);
      // Reset input value so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-bold text-slate-700">{label}</label>}
      
      <div className="relative">
        <div className={`
          border-2 border-dashed rounded-xl p-6 text-center transition-colors
          ${isUploading ? 'bg-slate-50 border-slate-300' : 'bg-slate-50/50 border-slate-300 hover:bg-slate-50 hover:border-campus-400'}
          ${success ? 'border-green-300 bg-green-50/30' : ''}
          ${error ? 'border-red-300 bg-red-50/30' : ''}
        `}>
          <input
            type="file"
            accept={accept}
            onChange={handleUpload}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          
          <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 text-campus-600 animate-spin" />
                <span className="text-sm font-medium text-slate-600">Uploading...</span>
              </>
            ) : success ? (
              <>
                <FileCheck2 className="w-8 h-8 text-green-500" />
                <span className="text-sm font-medium text-green-700">Upload Complete!</span>
                <span className="text-xs text-slate-500">Click or drag to replace</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-slate-400" />
                <span className="text-sm font-medium text-slate-600">
                  <span className="text-campus-700 font-semibold">Click to upload</span> or drag and drop
                </span>
                <span className="text-xs text-slate-400">
                  {accept ? `Supported: ${accept} ` : ''}(Max 5MB)
                </span>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-red-600">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
