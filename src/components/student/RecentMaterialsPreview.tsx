import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { TeachingMaterial } from '@/types';

interface Props {
  materials: TeachingMaterial[];
}

export default function RecentMaterialsPreview({ materials }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" /> Recent Course Handouts
        </h2>
        <Link href="/student/study" className="text-xs text-blue-700 font-bold hover:underline">
          View All Materials
        </Link>
      </div>

      <div className="space-y-3">
        {materials.map(mat => (
          <div key={mat.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-blue-700">{mat.subject}</div>
              <div className="text-sm font-semibold text-slate-900 mt-0.5">{mat.title}</div>
              <div className="text-[11px] text-slate-500 mt-1">Instructor: {mat.teacherName}</div>
            </div>
            <button className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs">
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
