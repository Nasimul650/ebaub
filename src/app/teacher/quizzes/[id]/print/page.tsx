import React from 'react';
import { notFound } from 'next/navigation';
import { getQuizById } from '@/app/actions/quiz';
import ExamPrintView from '@/components/teacher/ExamPrintView';

export const dynamic = 'force-dynamic';

interface PrintQuizPageProps {
  params: Promise<{ id: string }>;
}

export default async function PrintQuizPage({ params }: PrintQuizPageProps) {
  const { id } = await params;
  const quiz = await getQuizById(id);

  if (!quiz) {
    notFound();
  }

  return <ExamPrintView quiz={quiz as any} />;
}
