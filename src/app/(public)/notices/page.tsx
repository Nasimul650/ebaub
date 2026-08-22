import React from 'react';
import { getNotices } from '@/lib/mock/mockServices';
import PageHeader from '@/components/shared/PageHeader';
import NoticeListFeed from '@/components/notices/NoticeListFeed';

export default async function NoticesPage() {
  const notices = await getNotices();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <PageHeader
        badge="Official Announcement Board"
        headline="EBAUB University Notices & Circulars"
        description="Stay informed with official academic notices, exam routines, admission circulars, and departmental announcements."
      />
      <NoticeListFeed notices={notices} />
    </div>
  );
}
