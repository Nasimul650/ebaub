import React from 'react';
import { NoticeItem } from '@/types';

interface Props {
  notices: NoticeItem[];
}

export default function StudentNoticeList({ notices }: Props) {
  return (
    <div className="space-y-4">
      {notices.map(notice => (
        <div key={notice.id} className="clean-card bg-white rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="text-amber-700 font-bold">{notice.category}</span>
            <span>{new Date(notice.publishedAt).toLocaleDateString()}</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">{notice.title}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">{notice.summary}</p>
        </div>
      ))}
    </div>
  );
}
