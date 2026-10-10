'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Printer, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  BookOpen,
  Calendar,
  Layers,
  GraduationCap,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExamPrintViewProps {
  quiz: {
    id: string;
    course_code: string;
    title: string;
    status: string;
    exam_type: string;
    created_at: string;
    quiz_questions: Array<{
      id: string;
      question_type: string;
      question_text: string;
      options: string[] | null;
      correct_answer: string | null;
      suggested_answer: string | null;
      grading_rubric: string | null;
    }>;
  };
}

export default function ExamPrintView({ quiz }: ExamPrintViewProps) {
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const questions = quiz.quiz_questions || [];

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const examTypeLabel = () => {
    switch (quiz.exam_type) {
      case 'short_answer':
        return 'Short Answer Examination';
      case 'creative':
        return 'Creative & Scenario Assessment';
      case 'mcq':
      default:
        return 'Multiple Choice Examination (MCQ)';
    }
  };

  const marksPerQuestion = quiz.exam_type === 'creative' ? 10 : quiz.exam_type === 'short_answer' ? 5 : 1;
  const totalMarks = questions.length * marksPerQuestion;
  const timeAllowed = quiz.exam_type === 'creative' 
    ? `${questions.length * 20} Minutes` 
    : quiz.exam_type === 'short_answer' 
      ? `${questions.length * 10} Minutes` 
      : `${Math.max(15, questions.length * 1.5)} Minutes`;

  return (
    <div className="min-h-screen bg-slate-100/60 print:bg-white text-slate-900 font-sans print:py-0 pb-20">
      
      {/* FLOATING ACTION TOOLBAR (Hidden in Print) */}
      <div className="print:hidden sticky top-4 z-50 max-w-4xl mx-auto px-4 mb-6">
        <div className="bg-white/95 backdrop-blur-md border border-slate-300 shadow-xl rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <Link href="/teacher/quizzes">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs rounded-xl font-bold">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quizzes</span>
              </Button>
            </Link>
            <div className="hidden sm:block h-5 w-px bg-slate-200" />
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                Academic Print Preview
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Standard A4 / Letter Exam Layout
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Answer Key Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAnswerKey(!showAnswerKey)}
              className="text-xs font-bold gap-1.5 rounded-xl border-slate-300 hover:bg-slate-50"
              title="Include or hide model answers & scoring rubric"
            >
              {showAnswerKey ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-amber-700">Hide Answer Key</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>Show Answer Key</span>
                </>
              )}
            </Button>

            {/* Print / Save as PDF Trigger */}
            <Button
              type="button"
              size="sm"
              onClick={handlePrint}
              className="bg-campus-900 hover:bg-campus-800 text-white font-extrabold text-xs gap-2 rounded-xl shadow-sm px-4"
            >
              <Printer className="w-4 h-4 text-campus-200" />
              <span>Print / Save as PDF</span>
            </Button>
          </div>

        </div>
      </div>

      {/* PRINT PAPER CONTAINER (A4 proportion styling) */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 print:border-none shadow-sm print:shadow-none p-8 sm:p-12 md:p-16 print:p-0 rounded-3xl print:rounded-none">
        
        {/* ========================================================================= */}
        {/* 1. UNIVERSITY OFFICIAL HEADER */}
        {/* ========================================================================= */}
        <header className="border-b-2 border-slate-900 pb-5 mb-6 text-center space-y-2">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 uppercase font-serif">
              EXIM Bank Agricultural University Bangladesh
            </h1>
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-slate-700 uppercase font-serif">
              Faculty Examination & Academic Assessment Cell
            </p>
          </div>

          <div className="pt-2">
            <div className="inline-block border border-slate-900 px-4 py-1 rounded-sm text-xs sm:text-sm font-bold uppercase tracking-wider bg-slate-50 print:bg-transparent">
              {examTypeLabel()}
            </div>
          </div>

          {/* Exam Details Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-left pt-3 border-t border-slate-300 font-medium">
            <div>
              <span className="font-bold text-slate-900">Course Code: </span>
              <span className="font-mono">{quiz.course_code}</span>
            </div>
            <div>
              <span className="font-bold text-slate-900">Total Marks: </span>
              <span>{totalMarks} Marks</span>
            </div>
            <div>
              <span className="font-bold text-slate-900">Time Allowed: </span>
              <span>{timeAllowed}</span>
            </div>
            <div>
              <span className="font-bold text-slate-900">Total Questions: </span>
              <span>{questions.length}</span>
            </div>
          </div>

          <div className="text-left text-xs pt-1">
            <span className="font-bold text-slate-900">Examination Title: </span>
            <span className="font-semibold text-slate-800">{quiz.title}</span>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 2. STUDENT IDENTIFICATION DETAILS (Offline filling box) */}
        {/* ========================================================================= */}
        <section className="border border-slate-900 p-4 rounded-sm mb-6 space-y-3 bg-slate-50/40 print:bg-transparent text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 shrink-0">Student Name:</span>
              <div className="border-b border-dotted border-slate-600 flex-1 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 shrink-0">Student ID / Roll:</span>
              <div className="border-b border-dotted border-slate-600 flex-1 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 shrink-0">Department:</span>
              <div className="border-b border-dotted border-slate-600 flex-1 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 shrink-0">Batch / Section:</span>
              <div className="border-b border-dotted border-slate-600 flex-1 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 shrink-0">Date of Exam:</span>
              <div className="border-b border-dotted border-slate-600 flex-1 h-5" />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. CANDIDATE INSTRUCTIONS */}
        {/* ========================================================================= */}
        <section className="mb-6 pb-4 border-b border-slate-200 text-xs text-slate-700 italic space-y-1">
          <p className="font-bold not-italic text-slate-900 uppercase tracking-wide">
            General Instructions to Candidates:
          </p>
          <ul className="list-disc list-inside space-y-0.5 pl-1">
            <li>Answer all questions. Figures in the right-hand margin indicate full marks for each question.</li>
            {quiz.exam_type === 'mcq' && (
              <li>Clearly fill in or circle the correct choice letter corresponding to the most accurate option.</li>
            )}
            {(quiz.exam_type === 'short_answer' || quiz.exam_type === 'creative') && (
              <li>Write concise, legible answers in the dotted response space provided under each question prompt.</li>
            )}
            <li>No extraneous sheets or materials may be brought into the examination hall without invigilator approval.</li>
          </ul>
        </section>

        {/* ========================================================================= */}
        {/* 4. QUESTIONS BODY */}
        {/* ========================================================================= */}
        <section className="space-y-8">
          {questions.map((q, idx) => {
            const isMcq = q.question_type === 'mcq' || (!q.question_type && quiz.exam_type === 'mcq');
            const isCreative = q.question_type === 'creative' || (!q.question_type && quiz.exam_type === 'creative');
            const qMarks = isCreative ? 10 : isMcq ? 1 : 5;

            return (
              <div 
                key={q.id || idx} 
                className="break-inside-avoid space-y-3 pt-2 text-slate-900"
              >
                {/* Question Header & Marks */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-2.5 font-medium text-sm leading-snug">
                    <span className="font-bold font-mono text-slate-950 shrink-0">
                      Q{idx + 1}.
                    </span>
                    <p className="text-slate-900 whitespace-pre-line">
                      {q.question_text}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-500 font-mono shrink-0 pl-2">
                    [{qMarks} {qMarks === 1 ? 'Mark' : 'Marks'}]
                  </span>
                </div>

                {/* Question Type: MCQ Options */}
                {isMcq && Array.isArray(q.options) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 pl-7 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                      const isCorrect = showAnswerKey && q.correct_answer === opt;

                      return (
                        <div 
                          key={optIdx}
                          className={`flex items-start gap-2.5 text-xs py-1 px-2 rounded-md ${
                            isCorrect 
                              ? 'bg-emerald-50 border border-emerald-300 font-bold text-emerald-950' 
                              : 'text-slate-800'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full border border-slate-900 flex items-center justify-center font-bold text-[11px] shrink-0 print:border-black">
                            {letter}
                          </span>
                          <span className="leading-tight pt-0.5">{opt}</span>
                          {isCorrect && (
                            <span className="ml-auto text-[10px] text-emerald-700 uppercase font-extrabold print:inline">
                              ✓ KEY
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Question Type: Short Answer (5 empty dotted lines for offline answer) */}
                {!isMcq && !isCreative && (
                  <div className="pl-7 pt-2 space-y-4">
                    <div className="border-b-2 border-dotted border-slate-400 h-2 w-full" />
                    <div className="border-b-2 border-dotted border-slate-400 h-2 w-full" />
                    <div className="border-b-2 border-dotted border-slate-400 h-2 w-full" />
                    <div className="border-b-2 border-dotted border-slate-400 h-2 w-full" />
                    <div className="border-b-2 border-dotted border-slate-400 h-2 w-full" />
                  </div>
                )}

                {/* Question Type: Creative Question (8 empty dotted lines for offline answer) */}
                {isCreative && (
                  <div className="pl-7 pt-2 space-y-4">
                    <div className="border-b-2 border-dotted border-slate-400 h-2 w-full" />
                    <div className="border-b-2 border-dotted border-slate-400 h-2 w-full" />
                    <div className="border-b-2 border-dotted border-slate-400 h-2 w-full" />
                    <div className="border-b-2 border-dotted border-slate-400 h-2 w-full" />
                    <div className="border-b-2 border-dotted border-slate-400 h-2 w-full" />
                    <div className="border-b-2 border-dotted border-slate-400 h-2 w-full" />
                    <div className="border-b-2 border-dotted border-slate-400 h-2 w-full" />
                    <div className="border-b-2 border-dotted border-slate-400 h-2 w-full" />
                  </div>
                )}

                {/* Optional Model Answer (Shown if Answer Key is toggled on) */}
                {showAnswerKey && (q.suggested_answer || q.grading_rubric) && (
                  <div className="mt-3 pl-7">
                    <div className="p-3 bg-slate-50 border border-slate-300 rounded-md text-xs space-y-1">
                      <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
                        Instructor Grading Rubric & Suggested Model Answer:
                      </span>
                      <p className="text-slate-700 whitespace-pre-line italic">
                        {q.suggested_answer || q.grading_rubric}
                      </p>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </section>

        {/* ========================================================================= */}
        {/* 5. EXAM PAPER FOOTER */}
        {/* ========================================================================= */}
        <footer className="mt-14 pt-6 border-t-2 border-slate-900 text-center space-y-2 text-xs text-slate-500">
          <p className="font-bold text-slate-900 uppercase tracking-widest text-[11px]">
            &mdash; END OF EXAMINATION QUESTION PAPER &mdash;
          </p>
          <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
            <span>EXIM Bank Agricultural University Bangladesh</span>
            <span>Course: {quiz.course_code}</span>
            <span>Generated via EBAUB Faculty Assessment AI</span>
          </div>
        </footer>

      </div>

    </div>
  );
}
