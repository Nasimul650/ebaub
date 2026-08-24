import React from 'react';
import Link from 'next/link';
import { Calendar, Plus } from 'lucide-react';
import { getAcademicCalendar } from '@/utils/supabase/queries';

export default async function AdminCalendarPage() {
  const events = await getAcademicCalendar();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 heading-display flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-600" /> Academic Calendar CMS
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage important dates, holidays, and semester schedules.</p>
        </div>
        
        <Link 
          href="/admin/calendar/create"
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden text-xs shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-campus-50 text-slate-500 border-b border-slate-200 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-4 w-[40%]">Event Title</th>
                <th className="p-4 w-[20%]">Start Date</th>
                <th className="p-4 w-[20%]">End Date</th>
                <th className="p-4 w-[20%]">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {events.map(event => (
                <tr key={event.id} className="hover:bg-campus-50/80 transition-colors">
                  <td className="p-4 font-extrabold text-slate-900">{event.title}</td>
                  <td className="p-4 text-slate-600">{new Date(event.start_date).toLocaleDateString()}</td>
                  <td className="p-4 text-slate-600">{event.end_date ? new Date(event.end_date).toLocaleDateString() : '-'}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md font-bold text-[10px]">
                      {event.category || 'General'}
                    </span>
                  </td>
                </tr>
              ))}
              
              {events.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 font-medium">
                    No calendar events found. Click "Add Event" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
