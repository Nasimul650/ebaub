import React from 'react';
import { Download } from 'lucide-react';
import { TeachingMaterial } from '@/types';

interface Props {
  materials: TeachingMaterial[];
}

export default function StudyMaterialsGrid({ materials }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {materials.map(mat => (
        <div key={mat.id} className="clean-card bg-white rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-bold text-[11px]">
              {mat.subject}
            </span>
            <h3 className="text-base font-bold text-slate-900 pt-1">{mat.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{mat.description}</p>
            <div className="text-[11px] text-slate-400 pt-2">Provided by: {mat.teacherName}</div>
          </div>

          <button className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors">
            <Download className="w-4 h-4 text-emerald-400" /> Download PDF / Resource
          </button>
        </div>
      ))}
    </div>
  );
}
