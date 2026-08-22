import React from 'react';
import { BookOpen, Download, FileText } from 'lucide-react';
import { getTeachingMaterials } from '@/lib/mock/mockServices';

export default async function StudyHubPage() {
  const materials = await getTeachingMaterials();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      <div>
        <h1 className="text-2xl font-extrabold text-white">Student Study Hub</h1>
        <p className="text-xs text-slate-400 mt-1">Download published lecture notes, code samples, and course syllabus files</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {materials.map(mat => (
          <div key={mat.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 font-bold text-[11px]">
                {mat.subject}
              </span>
              <h3 className="text-base font-bold text-white pt-1">{mat.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{mat.description}</p>
              <div className="text-[11px] text-slate-400 pt-2">Provided by: {mat.teacherName}</div>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow">
              <Download className="w-4 h-4" /> Download PDF / Resource
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
