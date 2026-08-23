import React from 'react';
import { getNotices, getNews, getEvents, getPrograms } from '@/lib/mock/mockServices';
import AdminWelcomeBanner from '@/components/admin/AdminWelcomeBanner';
import AdminMetricsGrid from '@/components/admin/AdminMetricsGrid';
import AdminQuickActions from '@/components/admin/AdminQuickActions';

export default async function CMSDashboardPage() {
  const [notices, news, events, programs] = await Promise.all([
    getNotices(),
    getNews(),
    getEvents(),
    getPrograms()
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

      {/* Quick CMS Shortcuts */}
      <AdminQuickActions />
    </div>
  );
}
