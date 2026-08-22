import React from 'react';
import { TeachingMaterial } from '@/types';

interface Props {
  materials: TeachingMaterial[];
}

export default function TeacherMaterialsGrid({ materials }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-slate-900">Published Materials ({materials.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {materials.map(mat => (
          <div key={mat.id} className="clean-card p-5 rounded-3xl bg-white space-y-2">
            <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
              {mat.subject}
            </span>
            <h3 className="font-bold text-slate-900 text-sm mt-1">{mat.title}</h3>
            <p className="text-xs text-slate-500">{mat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
