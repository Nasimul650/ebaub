import React from 'react';
import { getQuizzes, getTeachingMaterials } from '@/lib/mock/mockServices';
import TeacherWelcomeBanner from '@/components/teacher/TeacherWelcomeBanner';
import TeacherStatsGrid from '@/components/teacher/TeacherStatsGrid';
import RecentQuizzesList from '@/components/teacher/RecentQuizzesList';

export default async function TeacherDashboard() {
  const [quizzes, materials] = await Promise.all([
    getQuizzes(),
    getTeachingMaterials()
  ]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <TeacherWelcomeBanner />
      <TeacherStatsGrid quizCount={quizzes.length} materialCount={materials.length} courseCount={2} />
      <RecentQuizzesList quizzes={quizzes} />
    </div>
  );
}
