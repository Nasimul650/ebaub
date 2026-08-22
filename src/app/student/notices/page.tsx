import React from 'react';
import { getNotices } from '@/lib/mock/mockServices';
import StudentNoticeList from '@/components/student/StudentNoticeList';

export default async function StudentNoticesPage() {
  const notices = await getNotices();
  const studentNotices = notices.filter(n => n.targetAudience === 'ALL' || n.targetAudience === 'STUDENTS');

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 heading-display">Student Notice Board</h1>
        <p className="text-xs text-slate-500 mt-1">Filtered announcements for registered students</p>
      </div>

      <StudentNoticeList notices={studentNotices} />
    </div>
  );
}
