'use client';

import React, { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Save, FileImage } from 'lucide-react';

export default function NewsForm({ action, initialData }: { action: any, initialData?: any }) {
  const router = useRouter();
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
            <label className="block text-sm font-bold text-slate-700">Cover Image</label>
            <div className="relative">
              <input 
                type="file" 
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-400 cursor-not-allowed file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-600"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                <FileImage className="w-3 h-3" />
                Coming Soon via Supabase Storage
              </div>
            </div>
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
