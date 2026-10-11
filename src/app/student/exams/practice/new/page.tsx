import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import StudentPracticeGeneratorWizard from '@/components/student/exams/StudentPracticeGeneratorWizard';

export const dynamic = 'force-dynamic';

export default async function NewPracticeExamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?portal=student');
  }

  return (
    <div className="py-2">
      <StudentPracticeGeneratorWizard />
    </div>
  );
}
