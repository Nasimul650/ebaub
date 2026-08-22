import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarPlus } from 'lucide-react';
import EventForm from '@/components/admin/EventForm';
import { createEvent } from '@/app/actions/cms';

export default function CreateEventPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/events" 
          className="p-2 rounded-full hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 heading-display flex items-center gap-2">
            <CalendarPlus className="w-6 h-6 text-campus-800" /> Publish New Event
          </h1>
          <p className="text-xs text-slate-500 mt-1">Fill out the details below to schedule an event</p>
        </div>
      </div>

      <EventForm action={createEvent} />
    </div>
  );
}
