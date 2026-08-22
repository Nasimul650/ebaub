import React from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { getNotices } from '@/lib/mock/mockServices';

export default async function StudentNoticesPage() {
  const notices = await getNotices();
  const studentNotices = notices.filter(n => n.targetAudience === 'ALL' || n.targetAudience === 'STUDENTS');

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Student Notice Board</h1>
        <p className="text-xs text-slate-400 mt-1">Filtered announcements for registered students</p>
      </div>

      <div className="space-y-4">
        {studentNotices.map(notice => (
          <div key={notice.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="text-amber-400 font-semibold">{notice.category}</span>
              <span>{new Date(notice.publishedAt).toLocaleDateString()}</span>
            </div>
            <h3 className="text-base font-bold text-white">{notice.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{notice.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
