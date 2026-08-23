import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar } from 'lucide-react';
import EventForm from '@/components/admin/EventForm';
import { updateEvent } from '@/app/actions/cms';
import { getEventById } from '@/utils/supabase/queries';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const eventData = await getEventById(id);

  if (!eventData) {
    notFound();
  }

  // Bind the action with the id
  const updateAction = updateEvent.bind(null, id);

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
            <Calendar className="w-6 h-6 text-campus-800" /> Edit Event
          </h1>
          <p className="text-xs text-slate-500 mt-1">Make changes to the scheduled event</p>
        </div>
      </div>

      <EventForm action={updateAction} initialData={eventData} />
    </div>
  );
}
