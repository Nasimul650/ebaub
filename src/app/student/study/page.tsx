import React from 'react';
import { getTeachingMaterials } from '@/lib/mock/mockServices';
import StudyMaterialsGrid from '@/components/student/StudyMaterialsGrid';

export default async function StudyHubPage() {
  const materials = await getTeachingMaterials();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-campus-950 to-campus-900 text-white shadow-xs">
        <div>
          <h2 className="text-base font-extrabold">Interactive Split-Screen Study Hub Available!</h2>
          <p className="text-xs text-campus-200 mt-0.5">Study PDFs side-by-side with our rich text notepad, extract highlights, and export notes.</p>
        </div>
        <a
          href="/student/study-hub"
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white text-campus-950 font-bold text-xs shrink-0 hover:bg-slate-100 transition-colors"
        >
          Open Interactive Workspace &rarr;
        </a>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 heading-display">Course Materials Library</h1>
        <p className="text-xs text-slate-500 mt-1">Download published lecture notes, code samples, and course syllabus files</p>
      </div>

      <StudyMaterialsGrid materials={materials} />

    </div>
  );
}
