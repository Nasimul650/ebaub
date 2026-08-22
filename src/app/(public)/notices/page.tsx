import React from 'react';
import { getAllNotices } from '@/utils/supabase/queries';
import PageHeader from '@/components/shared/PageHeader';
import NoticeListFeed from '@/components/notices/NoticeListFeed';

export default async function NoticesPage() {
  const notices = await getAllNotices();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <PageHeader
        badge="Official Announcement Board"
        headline="EBAUB University Notices & Circulars"
        description="Stay informed with official academic notices, exam routines, admission circulars, and departmental announcements."
      />
      <NoticeListFeed notices={notices} />
    </div>
  );
}
