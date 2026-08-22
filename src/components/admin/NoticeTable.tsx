'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { NoticeItem } from '@/types';

export interface NoticeTableProps {
  notices: NoticeItem[];
  onDelete: (id: string) => void;
}

export default function NoticeTable({ notices, onDelete }: NoticeTableProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden text-xs shadow-xs">
      <div className="p-4 border-b border-slate-100 font-bold text-slate-900">
        Active Notices ({notices.length})
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase text-[10px]">
          <tr>
            <th className="p-4">Title</th>
            <th className="p-4">Category</th>
            <th className="p-4">Audience</th>
            <th className="p-4">Published</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {notices.map(n => (
            <tr key={n.id} className="hover:bg-slate-50/80">
              <td className="p-4 font-bold text-slate-900">
                {n.title}
                {n.isImportant && <span className="ml-2 text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">Important</span>}
              </td>
              <td className="p-4 text-slate-500">{n.category}</td>
              <td className="p-4 text-slate-500">{n.targetAudience}</td>
              <td className="p-4 text-slate-500">{new Date(n.publishedAt).toLocaleDateString()}</td>
              <td className="p-4 text-right">
                <button
                  onClick={() => onDelete(n.id)}
                  className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
