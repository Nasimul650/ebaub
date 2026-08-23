import React from 'react';
import { getAllNotices, getAllNews, getAllEvents, getAllPrograms } from '@/utils/supabase/queries';
import AdminWelcomeBanner from '@/components/admin/AdminWelcomeBanner';
import AdminMetricsGrid from '@/components/admin/AdminMetricsGrid';
import AdminQuickActions from '@/components/admin/AdminQuickActions';
import AdminRecentActivity from '@/components/admin/AdminRecentActivity';

export default async function CMSDashboardPage() {
  const [notices, news, events, programs] = await Promise.all([
    getAllNotices(),
    getAllNews(),
    getAllEvents(50),
    getAllPrograms(50)
  ]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <AdminWelcomeBanner />

      {/* Metrics Cards */}
      <AdminMetricsGrid 
        noticeCount={notices.length} 
        newsCount={news.length} 
        eventCount={events.length} 
        programCount={programs.length} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick CMS Shortcuts */}
        <AdminQuickActions />

        {/* Dynamic Recent Activity */}
        <AdminRecentActivity notices={notices} news={news} events={events} />
      </div>
    </div>
  );
}
