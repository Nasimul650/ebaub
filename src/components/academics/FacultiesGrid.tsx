import React from 'react';
import { Building2 } from 'lucide-react';
import { Faculty } from '@/types';

interface Props {
  faculties: Faculty[];
}

export default function FacultiesGrid({ faculties }: Props) {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-emerald-700" /> University Faculties
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {faculties.map(faculty => (
          <div key={faculty.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between">
            {faculty.imageUrl && (
              <div className="h-44 relative">
                <img src={faculty.imageUrl} alt={faculty.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-6 space-y-3 flex-1">
              <h3 className="font-bold text-base text-slate-900">{faculty.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{faculty.description}</p>
              <div className="text-[11px] text-amber-700 font-bold pt-2">
                Dean: {faculty.deanName}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
