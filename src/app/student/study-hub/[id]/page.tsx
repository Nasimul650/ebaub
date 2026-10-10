import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getStudySession } from '@/app/actions/study-hub';
import StudyHubWorkspace from '@/components/student/study-hub/StudyHubWorkspace';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StudyHubSessionPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?portal=student');
  }

  const { success, session, error } = await getStudySession(id);

  if (!success || !session) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
          <BookOpen className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Study Session Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {error || 'The requested study session does not exist or you may not have permission to view it.'}
        </p>
        <div className="pt-2">
          <Link
            href="/student/study-hub"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Study Hub</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-4">
      <StudyHubWorkspace session={session} />
    </div>
  );
}
