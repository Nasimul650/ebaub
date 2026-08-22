import React from 'react';
import Link from 'next/link';
import { Bell, Plus, Trash2 } from 'lucide-react';
import { getActiveNotices } from '@/utils/supabase/queries';
import { deleteNotice } from '@/app/actions/cms';

export default async function AdminNoticesPage() {
  const notices = await getActiveNotices(50);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 heading-display flex items-center gap-2">
            <Bell className="w-6 h-6 text-campus-500" /> Notices CMS Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">Create, publish, and delete official university circulars</p>
        </div>
        <Link 
          href="/admin/notices/new"
          className="flex items-center gap-2 px-4 py-2 bg-campus-800 hover:bg-campus-900 text-white text-sm font-bold rounded-xl transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          Issue Notice
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden text-xs shadow-xs">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-900">
          Active Notices ({notices.length})
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-campus-50 text-slate-500 border-b border-slate-200 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {notices.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No active notices found. Click "Issue Notice" to create one.
                  </td>
                </tr>
              ) : (
                notices.map(n => (
                  <tr key={n.id} className="hover:bg-campus-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900">
                      {n.title}
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        n.priority === 'High' 
                          ? 'bg-red-50 text-red-700 border-red-200' 
                          : n.priority === 'Medium' 
                            ? 'bg-amber-50 text-amber-700 border-amber-200' 
                            : 'bg-campus-100 text-slate-700 border-slate-200'
                      }`}>
                        {n.priority || 'Normal'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{n.date ? new Date(n.date).toLocaleDateString() : 'N/A'}</td>
                    <td className="p-4 text-right">
                      <form action={deleteNotice} className="inline-block">
                        <input type="hidden" name="id" value={n.id} />
                        <button
                          type="submit"
                          className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
