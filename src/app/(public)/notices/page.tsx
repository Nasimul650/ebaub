import React from 'react';
import { getNotices } from '@/lib/mock/mockServices';
import PageHeader from '@/components/shared/PageHeader';
import NoticeListFeed from '@/components/notices/NoticeListFeed';

export default async function NoticesPage() {
  const notices = await getNotices();

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200/80 p-8 sm:p-14 lg:p-16 space-y-12">
      <PageHeader
        badge="Official Announcement Board"
        headline="EBAUB University Notices & Circulars"
        description="Stay informed with official academic notices, exam routines, admission circulars, and departmental announcements."
      />
      <NoticeListFeed notices={notices} />
    </div>
  );
}
