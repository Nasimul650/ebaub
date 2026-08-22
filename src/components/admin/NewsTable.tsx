'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { NewsItem } from '@/types';

export interface NewsTableProps {
  newsList: NewsItem[];
  onDelete: (id: string) => void;
}

export default function NewsTable({ newsList, onDelete }: NewsTableProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden text-xs shadow-xs">
      <div className="p-4 border-b border-slate-100 font-bold text-slate-900">
        News Articles ({newsList.length})
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase text-[10px]">
          <tr>
            <th className="p-4">Title</th>
            <th className="p-4">Category</th>
            <th className="p-4">Published Date</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {newsList.map(item => (
            <tr key={item.id} className="hover:bg-slate-50/80">
              <td className="p-4 font-bold text-slate-900">{item.title}</td>
              <td className="p-4 text-slate-500">{item.category}</td>
              <td className="p-4 text-slate-500">{new Date(item.publishedAt).toLocaleDateString()}</td>
              <td className="p-4 text-right">
                <button
                  onClick={() => onDelete(item.id)}
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
