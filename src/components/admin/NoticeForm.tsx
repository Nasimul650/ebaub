'use client';

import React, { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Send, Paperclip } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';

export default function NoticeForm({ action, initialData }: { action: any, initialData?: any }) {
  const router = useRouter();
  const [attachmentUrl, setAttachmentUrl] = useState<string>(initialData?.attachment_url || '');
  const [state, formAction, isPending] = useActionState<{ error?: string, success?: boolean, message?: string } | null, FormData>(action, null);

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.push('/admin/notices');
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
          <label htmlFor="title" className="block text-sm font-bold text-slate-700">Notice Title <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            defaultValue={initialData?.title}
            required
            placeholder="e.g. Schedule for Mid-Term Examinations"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900"
            disabled={isPending || state?.success}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-bold text-slate-700">Effective Date</label>
            <input 
              type="date" 
              id="date" 
              name="date"
              defaultValue={initialData?.date || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900"
              disabled={isPending || state?.success}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-bold text-slate-700">Category</label>
            <select 
              id="category" 
              name="category"
              defaultValue={initialData?.category || 'General'}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900 bg-white"
              disabled={isPending || state?.success}
            >
              <option value="Academic">Academic</option>
              <option value="Administrative">Administrative</option>
              <option value="Examination">Examination</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="priority" className="block text-sm font-bold text-slate-700">Priority Level</label>
            <select 
              id="priority" 
              name="priority"
              defaultValue={initialData?.priority || 'Normal'}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900 bg-white"
              disabled={isPending || state?.success}
            >
              <option value="Normal">Normal</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <input type="hidden" name="attachment_url" value={attachmentUrl || ''} />
          {attachmentUrl && (
            <div className="mb-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
              <Paperclip className="w-5 h-5 text-slate-400" />
              <a href={attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-campus-700 hover:underline truncate">
                View Attached File
              </a>
            </div>
          )}
          
          <FileUpload 
            bucket="public_media" 
            accept=".pdf,.doc,.docx"
            label={attachmentUrl ? "Replace Attachment (PDF/Word)" : "Attachment (PDF/Word)"}
            onUploadSuccess={setAttachmentUrl}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-bold text-slate-700">Description</label>
          <textarea 
            id="description" 
            name="description" 
            defaultValue={initialData?.description}
            rows={4}
            placeholder="Provide further details regarding the notice..."
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
                <Send className="w-5 h-5" />
                {initialData ? 'Save Changes' : 'Issue Notice'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
