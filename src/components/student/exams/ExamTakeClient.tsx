'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Award,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Loader2,
  Send,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { ExamQuestionForStudent } from '@/app/actions/exam';
import { submitExam } from '@/app/actions/exam';

interface Props {
  quiz: {
    id: string;
    course_code: string;
    title: string;
    exam_type: string;
    is_practice: boolean;
  };
  questions: ExamQuestionForStudent[];
  studentName: string;
}

export default function ExamTakeClient({
  quiz,
  questions = [],
  studentName,
}: Props) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Handle radio change for MCQ
  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  // Handle text change for open-ended questions
  const handleTextChange = (questionId: string, val: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: val,
    }));
  };

  // Calculate answered count
  const answeredCount = questions.filter(
    (q) => Boolean(answers[q.id]?.trim())
  ).length;

  const progressPercent = questions.length > 0
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;

  // Submit Handler
  const handleFormSubmit = async () => {
    setErrorMsg(null);
    setShowConfirmModal(false);

    startTransition(async () => {
      try {
        const res = await submitExam(quiz.id, answers);

        if (res.success && res.submissionId) {
          router.push(`/student/exams/${quiz.id}/results?submissionId=${res.submissionId}`);
          router.refresh();
        } else {
          setErrorMsg(res.error || 'Failed to submit exam. Please try again.');
        }
      } catch (err: any) {
        console.error('Exam submission error:', err);
        setErrorMsg(err.message || 'An error occurred during submission.');
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24">
      {/* Sticky Header Bar */}
      <div className="sticky top-2 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/student/exams"
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors shrink-0 cursor-pointer select-none active:scale-95"
            title="Exit Exam"
          >
            <ArrowLeft className="w-4 h-4 pointer-events-none" />
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-campus-100 text-campus-900 font-extrabold text-[10px]">
                {quiz.course_code}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                {quiz.exam_type} {quiz.is_practice ? '• Practice Test' : '• Official Live Exam'}
              </span>
            </div>
            <h1 className="font-extrabold text-sm sm:text-base text-slate-900 truncate mt-0.5">
              {quiz.title}
            </h1>
          </div>
        </div>

        {/* Answered progress pill */}
        <div className="text-right shrink-0">
          <div className="text-xs font-bold text-slate-800">
            {answeredCount} / {questions.length} Answered
          </div>
          <div className="w-24 sm:w-32 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-campus-700 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Questions Stack */}
      <div className="space-y-5">
        {questions.map((q, idx) => {
          const isMcq = (q.question_type || 'mcq').toLowerCase() === 'mcq';
          const currentAnswer = answers[q.id] || '';
          const isAnswered = Boolean(currentAnswer.trim());

          return (
            <div
              key={q.id}
              className={`p-6 rounded-3xl bg-white border transition-all ${
                isAnswered
                  ? 'border-campus-300/80 shadow-2xs'
                  : 'border-slate-200/90 shadow-2xs'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-extrabold">
                  Question {idx + 1} of {questions.length}
                </span>

                {isAnswered && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Answered</span>
                  </span>
                )}
              </div>

              {/* Question Text */}
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-relaxed mb-4">
                {q.question_text}
              </h3>

              {/* MCQ Options Radio List */}
              {isMcq && q.options && q.options.length > 0 ? (
                <div className="space-y-2.5">
                  {q.options.map((option, optIdx) => {
                    const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D
                    const isSelected = currentAnswer === option;

                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, option)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 text-left ${
                          isSelected
                            ? 'bg-campus-50/90 border-campus-600 text-campus-950 font-semibold shadow-2xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-campus-900 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {optionLetter}
                        </div>
                        <span className="text-xs sm:text-sm leading-snug flex-1">
                          {option}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Short or Creative Open-Ended Textarea */
                <div>
                  <Textarea
                    value={currentAnswer}
                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                    placeholder="Type your comprehensive solution or answer here..."
                    rows={4}
                    className="text-xs sm:text-sm rounded-2xl bg-slate-50/60 focus:bg-white border-slate-200 focus:border-campus-700"
                  />
                  <div className="text-[11px] text-slate-400 mt-1">
                    Your response will be preserved and evaluated upon submission.
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-4 left-0 right-0 z-30 px-4">
        <div className="max-w-3xl mx-auto bg-campus-950/90 backdrop-blur-md text-white border border-campus-700/60 p-3 sm:p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4">
          <div className="text-xs">
            <span className="font-bold text-campus-200">
              {answeredCount} of {questions.length} answered
            </span>
            {answeredCount < questions.length && (
              <span className="text-amber-300 ml-1.5 hidden sm:inline">
                ({questions.length - answeredCount} remaining)
              </span>
            )}
          </div>

          <Button
            type="button"
            disabled={isPending}
            onClick={() => setShowConfirmModal(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl h-10 px-6 shadow-md transition-all active:scale-95 shrink-0"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                <span>Grading & Submitting...</span>
              </>
            ) : (
              <>
                <span>Submit Exam</span>
                <Send className="w-3.5 h-3.5 ml-1.5" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-campus-100 text-campus-800 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-base text-slate-900">
                Ready to submit your exam?
              </h3>
              <p className="text-xs text-slate-500">
                {answeredCount < questions.length ? (
                  <span className="text-amber-600 font-semibold">
                    Warning: You have answered {answeredCount} out of {questions.length} questions. Are you sure you want to proceed?
                  </span>
                ) : (
                  <span>
                    You have answered all {questions.length} questions. Your answers will be submitted and auto-graded.
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 text-xs rounded-xl"
              >
                Review Answers
              </Button>
              <Button
                type="button"
                disabled={isPending}
                onClick={handleFormSubmit}
                className="flex-1 bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs rounded-xl"
              >
                {isPending ? 'Submitting...' : 'Yes, Submit'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
