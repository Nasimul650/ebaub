import React from 'react';
import { getTeachingMaterials } from '@/lib/mock/mockServices';
import CourseFilesTable from '@/components/student/CourseFilesTable';

export default async function StudentFilesPage() {
  const materials = await getTeachingMaterials();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 heading-display">Course Files Library</h1>
        <p className="text-xs text-slate-500 mt-1">Direct file repository for enrolled department courses</p>
      </div>

      <CourseFilesTable materials={materials} />
    </div>
  );
}
