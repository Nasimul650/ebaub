'use client';

import React, { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CalendarPlus, Loader2, Save } from 'lucide-react';
import { createCalendarEvent } from '@/app/actions/cms';

export default function CreateCalendarEventPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createCalendarEvent, null);

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.push('/admin/calendar');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state?.success, router]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/calendar" 
          className="p-2 rounded-full hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 heading-display flex items-center gap-2">
            <CalendarPlus className="w-6 h-6 text-amber-600" /> Add Calendar Event
          </h1>
          <p className="text-xs text-slate-500 mt-1">Create a new academic calendar entry</p>
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

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-bold text-slate-700">Event Title *</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                required
                placeholder="e.g. Fall Semester Begins"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900"
                disabled={isPending || state?.success}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="start_date" className="block text-sm font-bold text-slate-700">Start Date *</label>
                <input 
                  type="date" 
                  id="start_date" 
                  name="start_date"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900 bg-white"
                  disabled={isPending || state?.success}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="end_date" className="block text-sm font-bold text-slate-700">End Date (Optional)</label>
                <input 
                  type="date" 
                  id="end_date" 
                  name="end_date"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900 bg-white"
                  disabled={isPending || state?.success}
                />
              </div>
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
                <option value="Holiday">Holiday</option>
                <option value="Exam">Exam</option>
                <option value="Event">Campus Event</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-bold text-slate-700">Description</label>
              <textarea 
                id="description" 
                name="description" 
                rows={4}
                placeholder="Additional details..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900 resize-y"
                disabled={isPending || state?.success}
              ></textarea>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button 
              type="submit" 
              disabled={isPending || state?.success}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
              ) : (
                <><Save className="w-5 h-5" /> Save Event</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
