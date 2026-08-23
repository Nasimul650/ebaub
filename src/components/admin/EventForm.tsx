'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Calendar } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';

export default function EventForm({ action, initialData }: { action: any, initialData?: any }) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>(initialData?.image_url || '');
  const [state, formAction, isPending] = useActionState<{ error?: string, success?: boolean, message?: string } | null, FormData>(action, null);

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.push('/admin/events');
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
          <label htmlFor="title" className="block text-sm font-bold text-slate-700">Event Title <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            defaultValue={initialData?.title}
            required
            placeholder="e.g. Annual Tech Symposium 2026"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900"
            disabled={isPending || state?.success}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="event_date" className="block text-sm font-bold text-slate-700">Event Date <span className="text-red-500">*</span></label>
              <input 
                type="date" 
                id="event_date" 
                name="event_date"
                required
                defaultValue={initialData?.event_date ? new Date(initialData.event_date).toISOString().split('T')[0] : ''}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900"
                disabled={isPending || state?.success}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="time" className="block text-sm font-bold text-slate-700">Time</label>
              <input 
                type="text" 
                id="time" 
                name="time"
                placeholder="e.g. 10:00 AM - 4:00 PM"
                defaultValue={initialData?.time}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900"
                disabled={isPending || state?.success}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-bold text-slate-700">Location</label>
              <input 
                type="text" 
                id="location" 
                name="location"
                placeholder="e.g. Main Auditorium"
                defaultValue={initialData?.location}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900"
                disabled={isPending || state?.success}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-bold text-slate-700">Status</label>
              <select 
                id="status" 
                name="status"
                defaultValue={initialData?.status || 'Upcoming'}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900 bg-white"
                disabled={isPending || state?.success}
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2 h-full flex flex-col">
              <label htmlFor="description" className="block text-sm font-bold text-slate-700">Event Description</label>
              <textarea 
                id="description" 
                name="description" 
                defaultValue={initialData?.description}
                rows={6}
                placeholder="Write the event details here..."
                className="w-full flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900 resize-y"
                disabled={isPending || state?.success}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-100">
          <input type="hidden" name="image_url" value={imageUrl || ''} />
          
          {imageUrl && (
            <div className="mb-3 relative w-full h-40 md:w-1/2 rounded-xl overflow-hidden border border-slate-200">
              <img src={imageUrl} alt="Event Preview" className="w-full h-full object-cover" />
            </div>
          )}
          
          <div className="md:w-1/2">
            <FileUpload 
              bucket="public_media" 
              accept="image/*"
              label={imageUrl ? "Replace Event Image" : "Event Image"}
              onUploadSuccess={setImageUrl}
            />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button 
            type="submit" 
            disabled={isPending || state?.success}
            className="flex items-center gap-2 px-6 py-3 bg-campus-800 hover:bg-campus-900 text-white font-bold rounded-xl transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
            ) : (
              <><Calendar className="w-5 h-5" /> {initialData ? 'Update Event' : 'Publish Event'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
