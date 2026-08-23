import React from 'react';
import { getTeachingMaterials } from '@/lib/mock/mockServices';
import MaterialUploadForm from '@/components/teacher/MaterialUploadForm';
import TeacherMaterialsGrid from '@/components/teacher/TeacherMaterialsGrid';

export default async function TeacherMaterialsPage() {
  const materials = await getTeachingMaterials();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 heading-display">Course Materials Manager</h1>
        <p className="text-xs text-slate-500 mt-1">Publish lecture slides, lab manuals, and syllabus files for students</p>
      </div>

      <MaterialUploadForm />
      <TeacherMaterialsGrid materials={materials} />
    </div>
  );
}
