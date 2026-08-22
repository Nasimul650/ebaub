import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react';
import { getEventById } from '@/utils/supabase/queries';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-campus-900 text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/events" className="inline-flex items-center gap-2 text-campus-200 hover:text-white font-semibold mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
              event.status === 'Ongoing' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
              event.status === 'Completed' ? 'bg-slate-500/20 text-slate-300 border border-slate-500/30' :
              event.status === 'Cancelled' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
              'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {event.status || 'Upcoming'}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold heading-display mb-8 leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-campus-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-campus-300" />
              <span>{new Date(event.event_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            {event.time && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-campus-300" />
                <span>{event.time}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-campus-300" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {event.image_url && (
          <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden shadow-2xl mb-12 border-4 border-white bg-white">
            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className={`bg-white rounded-2xl shadow-xl p-8 md:p-12 ${!event.image_url ? 'mt-8' : ''}`}>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">About the Event</h2>
          <div className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-a:text-campus-700">
            {event.description.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-slate-600 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
