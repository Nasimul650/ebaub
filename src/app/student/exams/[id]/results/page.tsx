import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getExamSubmissionResults } from '@/app/actions/exam';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  FileCheck,
  Calendar,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ submissionId?: string }>;
}

export default async function ExamResultsPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { submissionId } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?portal=student');
  }

  const res = await getExamSubmissionResults(id, submissionId);

  if (!res.success || !res.submission) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
          <Award className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Results Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {res.error || 'No submission found for this exam. You may take the exam first to view your scores.'}
        </p>
        <div className="pt-2 flex items-center justify-center gap-2">
          <Button asChild variant="outline" className="rounded-xl text-xs">
            <Link href="/student/exams">Back to Exam Center</Link>
          </Button>
          <Button asChild className="bg-campus-900 hover:bg-campus-800 text-white rounded-xl text-xs">
            <Link href={`/student/exams/${id}/take`}>Take Exam Now</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { submission, quiz, questions = [] } = res;
  const hasScore = typeof submission.score === 'number' && submission.total_questions;
  const scorePercent = hasScore
    ? Math.round((submission.score / submission.total_questions) * 100)
    : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16 py-2">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-xl text-xs border-slate-200"
        >
          <Link href="/student/exams">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Back to Exam Center</span>
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            asChild
            size="sm"
            className="bg-campus-900 hover:bg-campus-800 text-white rounded-xl text-xs shadow-2xs"
          >
            <Link href={`/student/exams/${id}/take`}>
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span>Retake Exam</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Score Summary Card */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-campus-50 border border-campus-200 text-campus-800 flex items-center justify-center mx-auto shadow-2xs">
          <Award className="w-8 h-8 text-campus-700" />
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-campus-100 text-campus-900 text-xs font-bold mb-1">
            <span>{quiz?.course_code}</span>
            <span>•</span>
            <span>{quiz?.is_practice ? 'Practice Test' : 'Official Exam'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 heading-display">
            {quiz?.title}
          </h1>
          <p className="text-xs text-slate-500">
            Submitted on {new Date(submission.submitted_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        {/* Score Display */}
        {hasScore ? (
          <div className="pt-2">
            <div className="inline-block p-6 rounded-3xl bg-slate-50 border border-slate-200/80">
              <div className="text-3xl sm:text-4xl font-extrabold text-campus-950 font-mono">
                {submission.score} <span className="text-lg text-slate-400">/ {submission.total_questions}</span>
              </div>
              <div className="text-xs font-bold text-campus-800 mt-1">
                Score: {scorePercent}% • {scorePercent! >= 80 ? '🌟 Outstanding' : scorePercent! >= 50 ? '👍 Passed' : '📚 Keep Practicing'}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-800 max-w-md mx-auto">
            Your exam answers have been recorded successfully. Open-ended questions will be reviewed with the model answers below.
          </div>
        )}
      </div>

      {/* Question by Question Detailed Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-extrabold text-base text-slate-900 heading-display">
            Question Review & Model Solutions
          </h2>
          <span className="text-xs text-slate-500 font-semibold">
            {questions.length} Questions
          </span>
        </div>

        <div className="space-y-4">
          {questions.map((q: any, idx: number) => {
            const isMcq = (q.question_type || 'mcq').toLowerCase() === 'mcq';
            const isCorrect = q.is_correct === true;
            const isWrong = q.is_correct === false;

            return (
              <div
                key={q.id}
                className={`p-6 rounded-3xl bg-white border transition-all ${
                  isCorrect
                    ? 'border-emerald-200/90 shadow-2xs'
                    : isWrong
                    ? 'border-red-200/90 shadow-2xs'
                    : 'border-slate-200/90 shadow-2xs'
                }`}
              >
                {/* Question Status Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-extrabold">
                    Question {idx + 1}
                  </span>

                  {isCorrect ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Correct (+1)</span>
                    </span>
                  ) : isWrong ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-red-700 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Incorrect (0)</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-500">
                      Submitted
                    </span>
                  )}
                </div>

                {/* Prompt */}
                <h3 className="font-bold text-sm text-slate-900 leading-relaxed mb-4">
                  {q.question_text}
                </h3>

                {/* MCQ Options Display */}
                {isMcq && q.options && q.options.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {q.options.map((opt: string, optIdx: number) => {
                      const isStudentSelected = q.student_answer === opt;
                      const isTargetCorrect = (q.correct_answer || '').trim().toLowerCase() === opt.trim().toLowerCase();

                      let cardStyle = 'bg-white border-slate-200 text-slate-700';
                      if (isTargetCorrect) {
                        cardStyle = 'bg-emerald-50/80 border-emerald-400 text-emerald-950 font-bold';
                      } else if (isStudentSelected && !isTargetCorrect) {
                        cardStyle = 'bg-red-50/80 border-red-400 text-red-950';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-2xl border text-xs sm:text-sm flex items-center justify-between gap-2 ${cardStyle}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="truncate">{opt}</span>
                          </div>

                          <div className="shrink-0 flex items-center gap-1.5 text-[11px]">
                            {isStudentSelected && (
                              <span className="px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-800 font-bold">
                                Your Choice
                              </span>
                            )}
                            {isTargetCorrect && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Correct Answer
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Open Ended Answers Display */}
                {!isMcq && (
                  <div className="space-y-3">
                    {/* Student's Typed Answer */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Your Submitted Response:
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                        {q.student_answer || '<No response submitted>'}
                      </p>
                    </div>

                    {/* Model Solution / Suggested Answer */}
                    {q.suggested_answer && (
                      <div className="p-3.5 rounded-2xl bg-campus-50/80 border border-campus-200">
                        <div className="text-[11px] font-bold text-campus-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-campus-700" />
                          <span>Model Solution & Grading Rubric:</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                          {q.suggested_answer}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
