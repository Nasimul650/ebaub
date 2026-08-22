'use client';

import React, { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Send, Paperclip } from 'lucide-react';
import { createNotice } from '@/app/actions/cms';

export default function NewNoticePage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createNotice, null);

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.push('/admin/notices');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state?.success, router]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/notices" 
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Issue Notice</h1>
          <p className="text-sm text-slate-500 font-medium">Publish an official campus circular or notice.</p>
        </div>
      </div>

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
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900"
                disabled={isPending || state?.success}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-bold text-slate-700">Category</label>
              <select 
                id="category" 
                name="category"
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
            <label className="block text-sm font-bold text-slate-700">Attachment (PDF)</label>
            <div className="relative">
              <input 
                type="file" 
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-400 cursor-not-allowed file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-600"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                <Paperclip className="w-3 h-3" />
                Coming Soon via Supabase Storage
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-bold text-slate-700">Description</label>
            <textarea 
              id="description" 
              name="description" 
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
                  Issuing...
                </>
              ) : state?.success ? (
                <>Issued successfully!</>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Issue Notice
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
