import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, ArrowRight, Users, Sparkles } from 'lucide-react';
import { getAllEvents, getPageSiteSettings } from '@/utils/supabase/queries';
import PageHeader from '@/components/shared/PageHeader';
import type { StudentLifePageSettings } from '@/types/settings';
import { PAGE_SETTINGS_DEFAULTS } from '@/types/settings';

export const metadata = {
  title: 'Campus Events & Student Life | EBAUB',
  description: 'Upcoming events and campus activities at EXIM Bank Agricultural University Bangladesh',
};

export default async function EventsPage() {
  const [events, studentLifeSettings] = await Promise.all([
    getAllEvents(20),
    getPageSiteSettings<StudentLifePageSettings>('student_life')
  ]);

  const fallback = PAGE_SETTINGS_DEFAULTS.student_life;
  const badge = studentLifeSettings?.header_badge || fallback.header_badge;
  const headline = studentLifeSettings?.header_headline || fallback.header_headline;
  const description = studentLifeSettings?.header_description || fallback.header_description;
  const clubs = studentLifeSettings?.clubs_highlight_text || fallback.clubs_highlight_text;
  const facilities = studentLifeSettings?.facilities_snippet || fallback.facilities_snippet;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12">
      <PageHeader
        badge={badge}
        headline={headline}
        description={description}
      />

      {/* Student Life & Extracurricular Highlights */}
      {(clubs || facilities) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-emerald-50/50 border border-emerald-200/60 rounded-3xl p-6 text-xs text-slate-700">
          {clubs && (
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">Student Clubs & Societies</span>
                <span className="font-bangla leading-relaxed">{clubs}</span>
              </div>
            </div>
          )}
          {facilities && (
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">Campus Facilities & Infrastructure</span>
                <span className="font-bangla leading-relaxed">{facilities}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="h-48 bg-slate-100 relative overflow-hidden">
              {event.image_url ? (
                <img 
                  src={event.image_url} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-campus-50">
                  <Calendar className="w-12 h-12 text-campus-200" />
                </div>
              )}
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${
                  event.status === 'Ongoing' ? 'bg-green-500' :
                  event.status === 'Completed' ? 'bg-slate-400' :
                  event.status === 'Cancelled' ? 'bg-red-500' :
                  'bg-amber-500'
                }`}></span>
                {event.status || 'Upcoming'}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-campus-800 transition-colors line-clamp-2 font-bangla">
                {event.title}
              </h3>

              <div className="space-y-2 mt-auto mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600 font-bangla">
                  <Calendar className="w-4 h-4 text-campus-600" />
                  <span>{new Date(event.event_date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                {event.time && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-bangla">
                    <Clock className="w-4 h-4 text-campus-600" />
                    <span>{event.time}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-bangla">
                    <MapPin className="w-4 h-4 text-campus-600" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-campus-800">
                <span>View Event Details</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}

        {events.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 font-bangla">No Events Scheduled</h3>
            <p className="text-slate-500 mt-2 font-bangla">Check back later for upcoming campus events.</p>
          </div>
        )}
      </div>
    </div>
  );
}
