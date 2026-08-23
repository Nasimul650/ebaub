'use client';

import React, { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Save, FileImage } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';

export default function NewsForm({ action, initialData }: { action: any, initialData?: any }) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>(initialData?.image_url || '');
  const [state, formAction, isPending] = useActionState<{ error?: string, success?: boolean, message?: string } | null, FormData>(action, null);

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.push('/admin/news');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state?.success, router]);

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200 overflow-hidden">
      <form action={formAction} className="p-6 sm:p-8 space-y-6">
        
        {state?.error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 font-medium">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-sm text-green-700 font-bold">
            {state.message} Redirecting...
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-bold text-slate-700">Article Title <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            defaultValue={initialData?.title}
            required
            placeholder="e.g. Annual Tech Symposium 2026 Announced"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900"
            disabled={isPending || state?.success}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-bold text-slate-700">Category</label>
            <select 
              id="category" 
              name="category"
              defaultValue={initialData?.category || 'Campus News'}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900 bg-white"
              disabled={isPending || state?.success}
            >
              <option value="Campus News">Campus News</option>
              <option value="Academic">Academic</option>
              <option value="Event">Event</option>
              <option value="Achievement">Achievement</option>
              <option value="Research">Research</option>
            </select>
          </div>

          <div className="space-y-2">
            <input type="hidden" name="image_url" value={imageUrl || ''} />
            
            {imageUrl && (
              <div className="mb-3 relative w-full h-32 rounded-xl overflow-hidden border border-slate-200">
                <img src={imageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
              </div>
            )}
            
            <FileUpload 
              bucket="public_media" 
              accept="image/*"
              label={imageUrl ? "Replace Cover Image" : "Cover Image"}
              onUploadSuccess={setImageUrl}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="summary" className="block text-sm font-bold text-slate-700">Brief Summary</label>
          <textarea 
            id="summary" 
            name="summary" 
            defaultValue={initialData?.summary}
            rows={2}
            placeholder="A short snippet to appear on the homepage cards..."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900 resize-y"
            disabled={isPending || state?.success}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="block text-sm font-bold text-slate-700">Full Article Content <span className="text-red-500">*</span></label>
          <textarea 
            id="content" 
            name="content" 
            defaultValue={initialData?.content}
            required
            rows={8}
            placeholder="Write the full article content here..."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900 resize-y"
            disabled={isPending || state?.success}
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button 
            type="submit" 
            disabled={isPending || state?.success}
            className="px-6 py-3 bg-campus-800 hover:bg-campus-900 text-white font-bold rounded-xl shadow-lg shadow-campus-900/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : state?.success ? (
              <>Saved!</>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {initialData ? 'Save Changes' : 'Publish Article'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
