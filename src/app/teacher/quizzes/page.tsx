import React from 'react';
import { getTeacherQuizzes } from '@/app/actions/quiz';
import TeacherQuizzesManager from '@/components/teacher/TeacherQuizzesManager';

export const dynamic = 'force-dynamic';

export default async function TeacherQuizzesPage() {
  const quizzes = await getTeacherQuizzes();

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      <TeacherQuizzesManager initialQuizzes={quizzes} />
    </div>
  );
}
