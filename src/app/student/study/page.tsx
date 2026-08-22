import React from 'react';
import { getTeachingMaterials } from '@/lib/mock/mockServices';
import StudyMaterialsGrid from '@/components/student/StudyMaterialsGrid';

export default async function StudyHubPage() {
  const materials = await getTeachingMaterials();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 heading-display">Student Study Hub</h1>
        <p className="text-xs text-slate-500 mt-1">Download published lecture notes, code samples, and course syllabus files</p>
      </div>

      <StudyMaterialsGrid materials={materials} />

    </div>
  );
}
