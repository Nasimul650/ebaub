'use client';

import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { getEvents, createEvent } from '@/lib/mock/mockServices';
import { EventItem } from '@/types';
import EventScheduleForm from '@/components/admin/EventScheduleForm';
import EventList from '@/components/admin/EventList';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  const handleCreate = async (eventData: Partial<EventItem>) => {
    const newEvent = await createEvent(eventData as Omit<EventItem, 'id' | 'createdAt'>);
    setEvents(prev => [newEvent, ...prev]);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 heading-display flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" /> Events CMS Manager
        </h1>
        <p className="text-xs text-slate-500 mt-1">Schedule ceremonies, workshops, and campus events</p>
      </div>

      {/* Form */}
      <EventScheduleForm onSubmit={handleCreate} />

      {/* List */}
      <EventList events={events} />
    </div>
  );
}
