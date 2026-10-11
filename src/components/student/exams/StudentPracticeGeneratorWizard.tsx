'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  Plus,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Loader2,
  FileText,
  AlertCircle,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { savePracticeExam } from '@/app/actions/exam';

export type PracticeQuestion = {
  id: string;
  question: string;
  question_type: string;
  options: string[];
  correctAnswer: string;
  suggestedAnswer: string;
};

export default function StudentPracticeGeneratorWizard() {
  const router = useRouter();

  // Step state: 1 = Configure & Generate, 2 = Review & Start
  const [step, setStep] = useState<1 | 2>(1);

  // Form inputs
  const [courseCode, setCourseCode] = useState('CSE-1201');
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [questionType, setQuestionType] = useState<'mcq' | 'short_answer' | 'creative'>('mcq');
  const [count, setCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  // Generation & saving states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generated questions list
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);

  // Common university course code shortcuts
  const sampleCourses = ['CSE-1201', 'CSE-1202', 'MATH-1101', 'EEE-1201', 'ENG-101', 'AG-101', 'BBA-101'];

  // Call /api/generate-quiz
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!topic.trim() && !sourceText.trim()) {
      setErrorMessage('Please provide a topic or paste lecture notes to generate questions.');
      return;
    }

    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseCode: courseCode.trim() || 'PRACTICE',
          topic: topic.trim(),
          sourceText: sourceText.trim(),
          questionType,
          count,
          difficulty,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate practice test.');
      }

      if (!data.questions || data.questions.length === 0) {
        throw new Error('AI did not return any questions. Please try again with a more detailed prompt.');
      }

      const formatted: PracticeQuestion[] = data.questions.map((q: any, idx: number) => ({
        id: `gen-${idx}-${Date.now()}`,
        question: q.question,
        question_type: questionType,
        options: Array.isArray(q.options) ? q.options : [],
        correctAnswer: q.correctAnswer || (q.options ? q.options[0] : ''),
        suggestedAnswer: q.suggestedAnswer || '',
      }));

      setQuestions(formatted);
      if (!title.trim()) {
        setTitle(`${courseCode}: ${topic || 'Practice Quiz'}`);
      }
      setStep(2);
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMessage(err.message || 'Error communicating with AI quiz generator.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Save practice test and route to /student/exams/[id]/take
  const handleSaveAndTake = async () => {
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const res = await savePracticeExam({
        courseCode: courseCode.trim() || 'PRACTICE',
        title: title.trim() || `${courseCode} Practice Test`,
        examType: questionType,
        questions: questions.map((q) => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          suggestedAnswer: q.suggestedAnswer,
        })),
      });

      if (res.success && res.quizId) {
        router.push(`/student/exams/${res.quizId}/take`);
      } else {
        setErrorMessage(res.error || 'Failed to save practice exam.');
      }
    } catch (err: any) {
      console.error('Save error:', err);
      setErrorMessage(err.message || 'Error saving practice exam.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 py-2">
      {/* Top Header */}
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

        <div className="text-xs font-semibold text-slate-500">
          Step {step} of 2: {step === 1 ? 'Configure & Generate' : 'Review & Start'}
        </div>
      </div>

      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white shadow-xs space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-950/40 text-amber-200 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>AI Practice Quiz Generator</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold heading-display">
          Create Custom Practice Exam
        </h1>
        <p className="text-xs text-amber-100/90 leading-relaxed">
          Powered by Gemini 3.8. Create realistic MCQ, Short Answer, or Creative exam questions on any topic.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 1: CONFIGURE & GENERATE FORM                         */}
      {/* ========================================================= */}
      {step === 1 && (
        <form onSubmit={handleGenerate} className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          {/* Course Code with shortcut pills */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Course Code
            </label>
            <Input
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
              placeholder="e.g. CSE-1201, MATH-1101"
              required
              className="font-mono text-sm rounded-xl h-11 uppercase"
            />
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-medium">Quick presets:</span>
              {sampleCourses.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setCourseCode(code)}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border transition-colors ${
                    courseCode === code
                      ? 'bg-campus-900 border-campus-900 text-white font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {/* Topic / Subject Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Topic or Chapter Title *
            </label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Binary Search Trees, Photosynthesis Light Reactions, Ohm's Law"
              required
              className="text-sm rounded-xl h-11"
            />
          </div>

          {/* Source Notes Textarea */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Source Lecture Notes / Textbook Snippets (Optional)</span>
              <span className="text-slate-400 text-[11px] font-normal">Helps AI target specific questions</span>
            </label>
            <Textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Paste any slide bullet points, lecture notes, or key formulas here..."
              rows={4}
              className="text-xs sm:text-sm rounded-2xl bg-slate-50/50"
            />
          </div>

          {/* Grid Settings: Question Type, Count, Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Question Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Question Type
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value as any)}
                className="w-full text-xs h-11 px-3 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-campus-700"
              >
                <option value="mcq">MCQ (Multiple Choice)</option>
                <option value="short_answer">Short Answer</option>
                <option value="creative">Creative / Scenario</option>
              </select>
            </div>

            {/* Question Count */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Question Count
              </label>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full text-xs h-11 px-3 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-campus-700"
              >
                <option value={3}>3 Questions (Quick Test)</option>
                <option value={5}>5 Questions (Standard)</option>
                <option value={8}>8 Questions (Thorough)</option>
                <option value={10}>10 Questions (Full Mock)</option>
              </select>
            </div>

            {/* Rigor / Difficulty */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Difficulty Rigor
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full text-xs h-11 px-3 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-campus-700"
              >
                <option value="Easy">Easy (Fundamental)</option>
                <option value="Medium">Medium (University Level)</option>
                <option value="Hard">Hard (Challenging & Rigorous)</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <Button
              type="submit"
              disabled={isGenerating}
              className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-2xl h-11 px-7 shadow-sm transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>Generating AI Practice Exam...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>Generate Practice Test</span>
                </>
              )}
            </Button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* STEP 2: REVIEW & START EXAM                               */}
      {/* ========================================================= */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Generated Practice Exam:
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
                {title || `${courseCode} Practice Test`}
              </h2>
              <div className="text-xs text-slate-500 mt-1">
                {questions.length} questions • {questionType.toUpperCase()} • {difficulty}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={() => setStep(1)}
                className="text-xs rounded-xl"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                <span>Adjust Parameters</span>
              </Button>

              <Button
                type="button"
                disabled={isSaving}
                onClick={handleSaveAndTake}
                className="bg-campus-900 hover:bg-campus-800 text-white font-extrabold text-xs rounded-xl h-10 px-5 shadow-2xs"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1.5 fill-current" />
                    <span>Start Practice Test</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Questions Preview List */}
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-extrabold">
                    Question {idx + 1}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    {q.question_type}
                  </span>
                </div>

                <p className="font-bold text-sm text-slate-900">
                  {q.question}
                </p>

                {/* MCQ Options */}
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = opt === q.correctAnswer;
                      return (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center font-bold text-[10px] shrink-0">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="truncate">{opt}</span>
                          </div>
                          {isCorrect && (
                            <span className="text-[10px] text-emerald-700 font-bold shrink-0">
                              Correct Key
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Suggested Answer for Open-Ended */}
                {q.suggestedAnswer && (
                  <div className="p-3 rounded-xl bg-campus-50 border border-campus-200 text-xs text-slate-800">
                    <span className="font-bold text-campus-950">Model Solution: </span>
                    <span>{q.suggestedAnswer}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
