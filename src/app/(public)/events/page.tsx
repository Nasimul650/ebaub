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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
      <PageHeader
        badge={badge}
        headline={headline}
        description={description}
      />

      {/* Student Life & Campus Highlights */}
      {(clubs || facilities) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clubs && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xs hover:shadow-md transition-all duration-300 flex items-start gap-5 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 heading-display">
                    Student Clubs & Societies
                  </h3>
                  <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full shrink-0">
                    Extracurriculars
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-bangla">
                  {clubs}
                </p>
              </div>
            </div>
          )}

          {facilities && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xs hover:shadow-md transition-all duration-300 flex items-start gap-5 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <Sparkles className="w-6 h-6 text-amber-600" />
              </div>
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 heading-display">
                    Campus Facilities & Technology
                  </h3>
                  <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full shrink-0">
                    Infrastructure
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-bangla">
                  {facilities}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Editorial Events List */}
      <div>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/70">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-display font-bangla">
            Academic & Events Calendar
          </h2>
          <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {events.length} Upcoming
          </span>
        </div>

        <div className="space-y-6">
          {events.map((event) => {
            const eventDate = new Date(event.event_date);
            const monthStr = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            const dayStr = eventDate.toLocaleDateString('en-US', { day: '2-digit' });
            
            return (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group flex flex-col md:flex-row bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Date Block (Editorial Style) */}
                <div className="md:w-48 bg-campus-900 text-white flex flex-row md:flex-col items-center md:justify-center p-6 shrink-0 relative overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Calendar className="w-40 h-40" />
                  </div>
                  
                  <div className="flex md:flex-col items-center gap-3 md:gap-0 relative z-10 w-full md:w-auto">
                    <div className="text-center">
                      <span className="block text-sm font-bold text-amber-400 tracking-widest leading-none mb-1">
                        {monthStr}
                      </span>
                      <span className="block text-4xl sm:text-5xl font-extrabold tracking-tight leading-none">
                        {dayStr}
                      </span>
                    </div>
                    
                    <div className="ml-auto md:ml-0 md:mt-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        event.status === 'Ongoing' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        event.status === 'Completed' ? 'bg-slate-500/20 text-slate-300 border border-slate-500/30' :
                        event.status === 'Cancelled' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                        'bg-white/10 text-white border border-white/20'
                      }`}>
                        {event.status || 'Upcoming'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Event Image (Optional but looks great if exists) */}
                {event.image_url && (
                  <div className="hidden lg:block w-56 shrink-0 overflow-hidden relative border-r border-slate-100">
                    <img 
                      src={event.image_url} 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}

                {/* Content Details */}
                <div className="p-6 md:p-8 flex-1 flex flex-col min-w-0">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-campus-800 transition-colors line-clamp-2 mb-4 font-bangla">
                    {event.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-slate-600 font-medium mb-6 font-bangla">
                    {event.time && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-campus-600 shrink-0" />
                        <span>{event.time}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-campus-600 shrink-0" />
                        <span className="truncate max-w-[200px] sm:max-w-xs">{event.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between text-sm font-bold text-campus-800 border-t border-slate-100 pt-4">
                    <span className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                      View Full Details <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          {events.length === 0 && (
            <div className="py-24 text-center bg-slate-50/50 rounded-3xl border border-slate-100">
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-5" />
              <h3 className="text-xl font-extrabold text-slate-700 font-bangla">No Events Scheduled</h3>
              <p className="text-slate-500 mt-2 font-bangla">Check back later for upcoming campus events and academic dates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
