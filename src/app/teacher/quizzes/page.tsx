import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Plus, 
  BookOpen, 
  Calendar, 
  HelpCircle, 
  CheckCircle2, 
  Layers, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { getTeacherQuizzes } from '@/app/actions/quiz';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function TeacherQuizzesPage() {
  const quizzes = await getTeacherQuizzes();

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-campus-700 bg-campus-50 border border-campus-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-campus-600" /> Academic Assessments
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-medium text-slate-500">Teacher Question Bank</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-display">
            Course Quizzes & Assessments
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Manage your AI-generated multiple choice quizzes, review saved question banks, or generate new exams from course materials.
          </p>
        </div>

        <Link href="/teacher/quizzes/new">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-campus-900 hover:bg-campus-800 text-white font-extrabold shadow-xs gap-2"
          >
            <Sparkles className="w-4 h-4 text-campus-300" />
            <span>Generate New AI Quiz</span>
          </Button>
        </Link>
      </div>

      {/* Quizzes List or Empty State */}
      {quizzes.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-10 sm:p-16 text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-campus-50 text-campus-800 flex items-center justify-center mx-auto shadow-2xs border border-campus-200/80">
            <BookOpen className="w-8 h-8" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900">
              No Quizzes Created Yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Use our Vercel AI SDK generator to automatically create academic multiple-choice quizzes from your lecture notes or topic prompts.
            </p>
          </div>

          <Link href="/teacher/quizzes/new">
            <Button className="bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs">
              <Plus className="w-4 h-4" />
              Create Your First AI Quiz
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quizzes.map((quiz: any) => {
            const questionCount = quiz.quiz_questions?.length || 0;
            const formattedDate = quiz.created_at 
              ? new Date(quiz.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : 'Recent';

            return (
              <div 
                key={quiz.id}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs hover:shadow-xs hover:border-campus-400 transition-all flex flex-col justify-between gap-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg bg-campus-100 text-campus-900 border border-campus-200">
                      {quiz.course_code}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3" />
                      {formattedDate}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug line-clamp-2">
                    {quiz.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1 font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                      <Layers className="w-3.5 h-3.5 text-campus-700" />
                      {questionCount} Questions
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  </div>
                </div>

                {/* Sample Question Preview */}
                {quiz.quiz_questions?.[0] && (
                  <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs text-slate-600 line-clamp-2 italic">
                    &ldquo;{quiz.quiz_questions[0].question_text}&rdquo;
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
