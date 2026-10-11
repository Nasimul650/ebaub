import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getExamSubmissions } from '@/app/actions/grading';
import SubmissionsListClient from '@/components/teacher/SubmissionsListClient';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ExamSubmissionsPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?portal=teacher');
  }

  const res = await getExamSubmissions(id);

  if (!res.success || !res.quiz) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Exam Submissions Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {res.error || 'The requested exam could not be located or you do not have permission to view its submissions.'}
        </p>
        <div className="pt-2">
          <Button asChild variant="outline" className="rounded-xl text-xs">
            <Link href="/teacher/overview">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Back to Teaching Overview</span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      <SubmissionsListClient
        quiz={res.quiz}
        initialSubmissions={res.submissions}
      />
    </div>
  );
}
