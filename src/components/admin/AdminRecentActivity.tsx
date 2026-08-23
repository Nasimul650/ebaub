import React from 'react';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';

export default function AdminRecentActivity({ notices, news, events }: { notices: any[], news: any[], events: any[] }) {
  const recentItems = [
    ...notices.slice(0, 3).map(n => ({...n, type: 'Notice', link: '/admin/notices/' + n.id + '/edit'})), 
    ...news.slice(0, 3).map(n => ({...n, type: 'News', link: '/admin/news/' + n.id + '/edit'})),
    ...events.slice(0, 3).map(e => ({...e, type: 'Event', link: '/admin/events/' + e.id + '/edit'}))
  ]
  .sort((a,b) => new Date(b.created_at || b.date).getTime() - new Date(a.created_at || a.date).getTime())
  .slice(0, 4);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs h-full">
      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
        <Clock className="w-5 h-5 text-emerald-600" /> Recent Updates
      </h2>
      <div className="space-y-4">
        {recentItems.length === 0 ? (
          <p className="text-sm text-slate-500">No recent activity found.</p>
        ) : (
          recentItems.map((item, idx) => (
            <Link key={idx} href={item.link} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors group">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{item.type}</div>
                <div className="text-sm font-semibold text-slate-900 group-hover:text-campus-800 transition-colors line-clamp-1">{item.title}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-campus-600 group-hover:translate-x-1 transition-all" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
