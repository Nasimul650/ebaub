import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { getEvents } from '@/lib/mock/mockServices';

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
          Campus Events Calendar
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 heading-display tracking-tight">
          Upcoming Ceremonies, Tech Workshops & Conferences
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Stay up to date with major university events, workshops, and ceremonial gatherings.
        </p>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {events.map(event => (
          <div
            key={event.id}
            className="clean-card bg-white rounded-3xl overflow-hidden p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-center"
          >
            {event.bannerImage && (
              <div className="w-full md:w-1/3 h-52 rounded-2xl overflow-hidden shrink-0">
                <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-amber-700 font-bold">
                  <Calendar className="w-4 h-4" /> {new Date(event.startTime).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <Clock className="w-4 h-4 text-emerald-600" /> {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <MapPin className="w-4 h-4 text-blue-600" /> {event.location}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900">{event.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
