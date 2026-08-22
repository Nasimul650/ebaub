import React from 'react';
import { getEvents } from '@/lib/mock/mockServices';
import PageHeader from '@/components/shared/PageHeader';
import EventCardFeed from '@/components/events/EventCardFeed';

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <PageHeader
        badge="Campus Events Calendar"
        headline="Upcoming Ceremonies, Tech Workshops & Conferences"
        description="Stay up to date with major university events, workshops, and ceremonial gatherings."
      />
      <EventCardFeed events={events} />
    </div>
  );
}
