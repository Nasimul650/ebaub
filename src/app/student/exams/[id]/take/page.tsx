import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getExamForTaking } from '@/app/actions/exam';
import ExamTakeClient from '@/components/student/exams/ExamTakeClient';
import Link from 'next/link';
import { ArrowLeft, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ExamTakePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?portal=student');
  }

  // Fetch student profile name
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, first_name, last_name')
    .eq('id', user.id)
    .maybeSingle();

  const studentName =
    profile?.full_name?.trim() ||
    (profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : '') ||
    user.email?.split('@')[0] ||
    'Student';

  // Fetch exam questions securely (without answers)
  const { success, quiz, questions = [], error } = await getExamForTaking(id);

  if (!success || !quiz || questions.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
          <Award className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Exam Unavailable</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {error || 'This exam could not be loaded or contains no active questions.'}
        </p>
        <div className="pt-2">
          <Link
            href="/student/exams"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Exam Center</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      <ExamTakeClient
        quiz={quiz}
        questions={questions}
        studentName={studentName}
      />
    </div>
  );
}
