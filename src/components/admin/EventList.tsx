'use client';

import React from 'react';
import { EventItem } from '@/types';

export interface EventListProps {
  events: EventItem[];
}

export default function EventList({ events }: EventListProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
      <h2 className="text-base font-bold text-slate-900">Scheduled Events ({events.length})</h2>
      <div className="space-y-3 text-xs">
        {events.map(ev => (
          <div key={ev.id} className="p-4 rounded-2xl bg-campus-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">{ev.title}</div>
              <div className="text-slate-500 text-[11px] mt-0.5">Location: {ev.location} | Date: {new Date(ev.startTime).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
