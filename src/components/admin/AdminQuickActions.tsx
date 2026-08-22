import React from 'react';
import Link from 'next/link';
import { Database, Plus } from 'lucide-react';

export default function AdminQuickActions() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
        <Database className="w-5 h-5 text-amber-600" /> CMS Entity Quick Actions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/notices"
          className="p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors space-y-2 group block"
        >
          <div className="font-bold text-slate-900 text-sm group-hover:text-amber-700 flex items-center justify-between">
            <span>Publish Official Notice</span>
            <Plus className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xs text-slate-500">Create urgent circulars or academic notices</p>
        </Link>

        <Link
          href="/admin/news"
          className="p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors space-y-2 group block"
        >
          <div className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 flex items-center justify-between">
            <span>Publish News Story</span>
            <Plus className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xs text-slate-500">Add press releases and research achievements</p>
        </Link>

        <Link
          href="/admin/events"
          className="p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors space-y-2 group block"
        >
          <div className="font-bold text-slate-900 text-sm group-hover:text-blue-700 flex items-center justify-between">
            <span>Add Campus Event</span>
            <Plus className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xs text-slate-500">Schedule ceremony dates and tech workshops</p>
        </Link>
      </div>
    </div>
  );
}
