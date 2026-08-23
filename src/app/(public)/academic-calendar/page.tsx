import React from 'react';
import { Calendar as CalendarIcon, Clock, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { getAcademicCalendar } from '@/utils/supabase/queries';

export const metadata = {
  title: 'Academic Calendar | EBAUB',
  description: 'View the full academic calendar for EXIM Bank Agricultural University Bangladesh',
};

export default async function AcademicCalendarPage() {
  const events = await getAcademicCalendar();

  // Group events by month/year
  const groupedEvents: Record<string, typeof events> = {};
  
  events.forEach(event => {
    const date = new Date(event.start_date);
    const key = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!groupedEvents[key]) groupedEvents[key] = [];
    groupedEvents[key].push(event);
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
      <PageHeader
        badge="Academic Calendar"
        headline="Important Dates & Deadlines"
        description="Stay on track with our official university schedule, including semester starts, exams, and holidays."
      />

      <div className="space-y-12 relative">
        {Object.keys(groupedEvents).length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200">
            <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700">No Events Scheduled</h3>
            <p className="text-slate-500 mt-2">The academic calendar will be updated shortly.</p>
          </div>
        ) : (
          <div className="absolute left-4 sm:left-[120px] top-0 bottom-0 w-px bg-slate-200 -z-10"></div>
        )}

        {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
          <div key={monthYear} className="relative">
            <div className="sticky top-20 z-10 bg-white/80 backdrop-blur-md py-4 mb-6 -ml-4 pl-4 sm:ml-0 sm:pl-0 flex items-center gap-4">
              <div className="bg-campus-800 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                {monthYear}
              </div>
            </div>

            <div className="space-y-6">
              {monthEvents.map(event => {
                const startDate = new Date(event.start_date);
                const endDate = event.end_date ? new Date(event.end_date) : null;
                
                return (
                  <div key={event.id} className="group flex flex-col sm:flex-row gap-4 sm:gap-8 items-start relative pl-8 sm:pl-0">
                    {/* Timeline Dot */}
                    <div className="absolute left-[13px] sm:left-[116px] top-6 w-2.5 h-2.5 rounded-full bg-campus-600 border-4 border-white shadow-sm -ml-4 sm:ml-0 z-10 group-hover:scale-150 transition-transform"></div>

                    {/* Date Block */}
                    <div className="w-full sm:w-[100px] shrink-0 pt-4 sm:text-right">
                      <div className="text-2xl font-extrabold text-slate-900 leading-none">
                        {startDate.getDate()}
                      </div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                        {startDate.toLocaleString('default', { month: 'short' })}
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group-hover:border-campus-200">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                        <div>
                          <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 ${
                            event.category === 'Holiday' ? 'bg-emerald-50 text-emerald-700' :
                            event.category === 'Exam' ? 'bg-red-50 text-red-700' :
                            'bg-blue-50 text-blue-700'
                          }`}>
                            {event.category || 'Event'}
                          </span>
                          <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                            {event.title}
                          </h3>
                        </div>
                        {endDate && (
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg shrink-0">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Until {endDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                          </div>
                        )}
                      </div>
                      
                      {event.description && (
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
