import React from 'react';
import { getEvents } from '@/lib/mock/mockServices';
import PageHeader from '@/components/shared/PageHeader';
import EventCardFeed from '@/components/events/EventCardFeed';

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200/80 p-8 sm:p-14 lg:p-16 space-y-12">
      <PageHeader
        badge="Campus Events Calendar"
        headline="Upcoming Ceremonies, Tech Workshops & Conferences"
        description="Stay up to date with major university events, workshops, and ceremonial gatherings."
      />
      <EventCardFeed events={events} />
    </div>
  );
}
