import React from 'react';
import { getNotices, getTeachingMaterials } from '@/lib/mock/mockServices';
import StudentWelcomeBanner from '@/components/student/StudentWelcomeBanner';
import StudentStatsGrid from '@/components/student/StudentStatsGrid';
import RecentMaterialsPreview from '@/components/student/RecentMaterialsPreview';

export default async function StudentDashboard() {
  const [notices, materials] = await Promise.all([
    getNotices(),
    getTeachingMaterials()
  ]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <StudentWelcomeBanner />
      <StudentStatsGrid materialCount={materials.length} noticeCount={notices.length} />
      <RecentMaterialsPreview materials={materials} />
    </div>
  );
}
