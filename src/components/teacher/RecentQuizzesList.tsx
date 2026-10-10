import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Printer, 
  Edit3, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Layers, 
  FileQuestion,
  Plus
} from 'lucide-react';

export interface DashboardQuizItem {
  id: string;
  course_code: string;
  title: string;
  status?: string;
  exam_type?: string;
  created_at?: string;
  quiz_questions?: Array<any>;
}

interface Props {
  quizzes: DashboardQuizItem[];
}

export default function RecentQuizzesList({ quizzes }: Props) {
  // Show the most recent 5 quizzes on the dashboard
  const displayQuizzes = quizzes.slice(0, 5);

  const getExamTypeBadge = (type?: string) => {
    switch (type) {
      case 'short_answer':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
            Short Answer
          </span>
        );
      case 'creative':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200/80">
            Creative / Broad
          </span>
        );
      case 'mcq':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200/80">
            Multiple Choice (MCQ)
          </span>
        );
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" /> Recent AI-Generated Exams
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Your recently crafted assessments, quizzes, and examination papers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href="/teacher/quizzes" 
            className="text-xs text-slate-600 hover:text-slate-900 font-bold hover:underline flex items-center gap-1"
          >
            View All ({quizzes.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link 
            href="/teacher/quizzes/new" 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs shadow-2xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> New Exam
          </Link>
        </div>
      </div>

      {displayQuizzes.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-campus-50/50 border border-dashed border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-campus-100 text-campus-900 mx-auto flex items-center justify-center shadow-2xs">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">No Exams Generated Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven&apos;t created any quizzes or exams yet. Use our Gemini-powered AI generator to build MCQs, short answers, or creative questions in seconds.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/teacher/quizzes/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs shadow-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-campus-300" /> Launch AI Exam Generator &rarr;
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {displayQuizzes.map((quiz) => {
            const isPublished = quiz.status === 'published';
            const questionCount = quiz.quiz_questions?.length ?? 0;
            const dateDisplay = formatDate(quiz.created_at);

            return (
              <div 
                key={quiz.id} 
                className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 hover:border-campus-300/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-md bg-campus-100 text-campus-900 font-extrabold tracking-wide">
                      {quiz.course_code}
                    </span>
                    {getExamTypeBadge(quiz.exam_type)}
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 font-medium flex items-center gap-1 text-[11px]">
                      <Layers className="w-3 h-3 text-slate-400" />
                      {questionCount} {questionCount === 1 ? 'Question' : 'Questions'}
                    </span>
                    {dateDisplay && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400 text-[11px] font-medium">{dateDisplay}</span>
                      </>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-campus-900 transition-colors truncate">
                    {quiz.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60 shrink-0">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                    isPublished 
                      ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-200/80' 
                      : 'bg-amber-100/80 text-amber-800 border border-amber-200/80'
                  }`}>
                    {isPublished ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Published
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 text-amber-600" /> Draft
                      </>
                    )}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/teacher/quizzes/${quiz.id}/edit`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors shadow-2xs"
                      title="Edit Exam"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>
                    <Link
                      href={`/teacher/quizzes/${quiz.id}/print`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors shadow-2xs"
                      title="Print / Save PDF"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
