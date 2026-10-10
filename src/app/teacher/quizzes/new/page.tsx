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
  Save, 
  RotateCcw, 
  Check, 
  AlertCircle, 
  BookOpen, 
  Layers, 
  HelpCircle,
  Clock,
  Send,
  CheckCheck
} from 'lucide-react';
import { saveGeneratedQuiz, GeneratedQuestionInput } from '@/app/actions/quiz';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

type EditableQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
};

export default function NewQuizGeneratorPage() {
  const router = useRouter();

  // Step state: 1 = Configure & Generate, 2 = Review & Edit, 3 = Successfully Saved
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [courseCode, setCourseCode] = useState('');
  const [title, setQuizTitle] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  // Loading & Feedback states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Generated Questions state
  const [questions, setQuestions] = useState<EditableQuestion[]>([]);

  // Sample course quick-fill pills
  const sampleCourseSuggestions = ['CSE-301', 'AG-204', 'MATH-102', 'BBA-205', 'ENG-101'];

  // Handle Step 1: AI Generation
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const trimmedTopic = sourceText.trim();
    if (!trimmedTopic) {
      setErrorMessage('Please provide a topic or paste lecture notes/material for the quiz generator.');
      return;
    }

    if (!courseCode.trim()) {
      setErrorMessage('Please enter a course code (e.g. CSE-301).');
      return;
    }

    setIsGenerating(true);

    // Auto-generate title if left blank
    const resolvedTitle = title.trim() || `${courseCode.trim().toUpperCase()} - ${trimmedTopic.slice(0, 30)} Quiz`;
    if (!title.trim()) {
      setQuizTitle(resolvedTitle);
    }

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: trimmedTopic,
          sourceText: trimmedTopic,
          courseCode: courseCode.trim().toUpperCase(),
          count: questionCount,
          difficulty: difficulty
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate quiz. Please try again.');
      }

      // Format questions with unique client IDs
      const formatted: EditableQuestion[] = (data.questions || []).map((q: any, idx: number) => ({
        id: `q-${Date.now()}-${idx}`,
        question: q.question || '',
        options: Array.isArray(q.options) && q.options.length === 4 
          ? q.options 
          : ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: q.correctAnswer || q.options?.[0] || 'Option A'
      }));

      if (formatted.length === 0) {
        throw new Error('AI returned an empty set of questions. Please adjust your source material and try again.');
      }

      setQuestions(formatted);
      setStep(2); // Advance to Review & Edit step

    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred while communicating with the AI service.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Modify question prompt
  const updateQuestionText = (id: string, text: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, question: text } : q));
  };

  // Modify an option text
  const updateOptionText = (questionId: string, optionIndex: number, newOptionText: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q;

      const oldOption = q.options[optionIndex];
      const newOptions = [...q.options];
      newOptions[optionIndex] = newOptionText;

      // Keep correctAnswer in sync if this option was the current correct answer
      let newCorrect = q.correctAnswer;
      if (q.correctAnswer === oldOption) {
        newCorrect = newOptionText;
      }

      return {
        ...q,
        options: newOptions,
        correctAnswer: newCorrect
      };
    }));
  };

  // Designate the correct answer
  const setCorrectAnswer = (questionId: string, answerText: string) => {
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, correctAnswer: answerText } : q));
  };

  // Remove a question
  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  // Add a blank question
  const addQuestion = () => {
    const newQ: EditableQuestion = {
      id: `q-${Date.now()}-${questions.length}`,
      question: 'Enter your new academic question here...',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option A'
    };
    setQuestions(prev => [...prev, newQ]);
  };

  // Step 3: Save to Database
  const handleSaveQuiz = async () => {
    setErrorMessage(null);

    // Validation
    if (!courseCode.trim()) {
      setErrorMessage('Course code is required before saving.');
      return;
    }
    if (!title.trim()) {
      setErrorMessage('Quiz title is required before saving.');
      return;
    }
    if (questions.length === 0) {
      setErrorMessage('You must have at least one question in the quiz.');
      return;
    }

    // Validate that questions are not blank
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setErrorMessage(`Question ${i + 1} cannot have an empty prompt.`);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          setErrorMessage(`Question ${i + 1}, Option ${String.fromCharCode(65 + j)} cannot be empty.`);
          return;
        }
      }
      if (!q.options.includes(q.correctAnswer)) {
        setErrorMessage(`Question ${i + 1} does not have a valid correct answer selected.`);
        return;
      }
    }

    setIsSaving(true);

    try {
      const payload = {
        course_code: courseCode.trim().toUpperCase(),
        title: title.trim(),
        questions: questions.map(q => ({
          question: q.question.trim(),
          options: q.options.map(opt => opt.trim()),
          correctAnswer: q.correctAnswer.trim()
        }))
      };

      const result = await saveGeneratedQuiz(payload);

      if (!result.success) {
        throw new Error(result.error || 'Failed to save quiz to database.');
      }

      setSuccessMessage(result.message || 'Quiz successfully saved to your course question bank!');
      setStep(3); // Success Screen

    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save quiz to database.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/teacher"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200/60"
            title="Back to Teacher Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-campus-700 bg-campus-50 border border-campus-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-campus-600" /> Vercel AI SDK
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-medium text-slate-500">Teacher Dashboard</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
              AI-Powered Quiz Generator
            </h1>
          </div>
        </div>

        {/* Stepper Indicator */}
        <div className="flex items-center gap-2 text-xs font-bold self-start sm:self-auto bg-slate-50 border border-slate-200/80 p-1.5 rounded-xl">
          <div className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
            step === 1 ? 'bg-campus-900 text-white shadow-xs' : 'text-slate-500'
          }`}>
            <span>1</span>
            <span>Configure</span>
          </div>
          <span className="text-slate-300">&rarr;</span>
          <div className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
            step === 2 ? 'bg-campus-900 text-white shadow-xs' : 'text-slate-500'
          }`}>
            <span>2</span>
            <span>Review & Edit</span>
          </div>
          <span className="text-slate-300">&rarr;</span>
          <div className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
            step === 3 ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-500'
          }`}>
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Saved</span>
          </div>
        </div>
      </div>

      {/* Global Error Alert */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold">Attention Required</div>
            <div className="text-red-700 mt-0.5 leading-relaxed">{errorMessage}</div>
          </div>
          <button 
            onClick={() => setErrorMessage(null)} 
            className="text-red-400 hover:text-red-700 text-sm font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* STEP 1: CONFIGURATION & GENERATION */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in">
          <Card className="border-slate-200/80 shadow-2xs overflow-hidden">
            <CardHeader className="bg-slate-50/70 border-b border-slate-200/60 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-campus-800 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4 text-campus-300" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg">Step 1: Course & Source Material</CardTitle>
                  <CardDescription className="text-xs">
                    Define course parameters and provide context notes or a topic prompt for academic AI synthesis.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 space-y-6">
              <form onSubmit={handleGenerate} className="space-y-6">
                
                {/* Course Code & Title Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Course Code <span className="text-red-500">*</span></span>
                      <span className="text-[11px] text-slate-400 font-normal">e.g. CSE-301</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. CSE-301"
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
                      className="font-mono uppercase font-bold text-slate-800 tracking-wider h-11"
                      required
                    />
                    {/* Quick suggestion pills */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[10px] text-slate-400 font-medium">Quick select:</span>
                      {sampleCourseSuggestions.map(code => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => setCourseCode(code)}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-campus-100 hover:text-campus-900 text-slate-600 transition-colors"
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Quiz Title <span className="text-slate-400 font-normal">(Optional)</span></span>
                      <span className="text-[11px] text-slate-400 font-normal">Auto-generated if empty</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Chapter 4: Data Structures & Trees"
                      value={title}
                      onChange={(e) => setQuizTitle(e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Question Count & Difficulty Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-campus-700" />
                      <span>Number of Questions</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[3, 5, 8, 10].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setQuestionCount(n)}
                          className={`py-2 rounded-xl text-xs font-extrabold transition-all ${
                            questionCount === n
                              ? 'bg-campus-900 text-white shadow-xs'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {n} Questions
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-campus-700" />
                      <span>Academic Rigor / Difficulty</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Easy', 'Medium', 'Hard'] as const).map(lvl => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setDifficulty(lvl)}
                          className={`py-2 rounded-xl text-xs font-extrabold transition-all ${
                            difficulty === lvl
                              ? lvl === 'Hard' ? 'bg-amber-700 text-white shadow-xs' : 'bg-campus-900 text-white shadow-xs'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Source Material or Topic Textarea */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-campus-700" />
                      <span>Source Material or Topic <span className="text-red-500">*</span></span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {sourceText.length} characters
                    </span>
                  </div>
                  <Textarea
                    rows={8}
                    placeholder="Enter a topic or paste reference notes, such as:&#10;&#10;&bull; 'Binary search tree balancing, AVL rotations, and time complexity in worst vs average cases'&#10;&bull; 'Photosynthesis: light reactions, photosystem II, Z-scheme, and Calvin cycle stoichiometry'&#10;&bull; Or paste a paragraph directly from your lecture slide notes..."
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    className="text-xs sm:text-sm font-sans leading-relaxed resize-y"
                    required
                  />
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Tip: The more detailed your excerpt or topic description, the more relevant and challenging the synthesized question bank will be.
                  </p>
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex items-center justify-between gap-4">
                  <div className="text-xs text-slate-400 font-medium hidden sm:block">
                    Uses Gemini 1.5 Flash via Vercel AI SDK
                  </div>
                  <Button
                    type="submit"
                    disabled={isGenerating || !sourceText.trim() || !courseCode.trim()}
                    size="lg"
                    className="w-full sm:w-auto min-w-[220px] bg-campus-900 hover:bg-campus-800 text-white font-extrabold shadow-sm"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                        <span>Synthesizing Questions...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-campus-300" />
                        <span>Generate with AI</span>
                      </>
                    )}
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>

          {/* Loading Skeleton Indicator when generating */}
          {isGenerating && (
            <div className="space-y-4 animate-pulse p-6 bg-white border border-campus-200 rounded-3xl shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="space-y-2">
                  <div className="h-4 bg-campus-200 rounded-md w-48" />
                  <div className="h-3 bg-slate-200 rounded-md w-80" />
                </div>
                <div className="h-8 bg-campus-100 rounded-xl w-24" />
              </div>

              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 border border-slate-200/60 rounded-2xl space-y-3 bg-slate-50/50">
                  <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    <div className="h-9 bg-slate-200 rounded-xl" />
                    <div className="h-9 bg-slate-200 rounded-xl" />
                    <div className="h-9 bg-slate-200 rounded-xl" />
                    <div className="h-9 bg-slate-200 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP 2: REVIEW & EDIT QUESTIONS */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Review Header Banner */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs bg-campus-100 text-campus-900 border border-campus-200 px-2.5 py-0.5 rounded-lg">
                  {courseCode}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  &bull; {questions.length} Generated Questions
                </span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                  {difficulty}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                {title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review and tweak questions before saving to the database. Click the green badge to designate the correct answer.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep(1)}
                className="text-xs font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                Edit Parameters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={addQuestion}
                className="text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5 text-campus-700" />
                Add Question
              </Button>
              <Button
                onClick={handleSaveQuiz}
                disabled={isSaving || questions.length === 0}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-xs"
              >
                {isSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                    <span>Saving Quiz...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Quiz to Database</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* List of Editable Question Cards */}
          <div className="space-y-5">
            {questions.map((q, qIndex) => (
              <Card key={q.id} className="border-slate-200/80 shadow-xs hover:border-campus-300 transition-colors">
                
                {/* Question Card Header */}
                <CardHeader className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-200/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-campus-900 text-white flex items-center justify-center font-extrabold text-xs shadow-2xs">
                      {qIndex + 1}
                    </span>
                    <span className="font-extrabold text-xs text-slate-700 uppercase tracking-wider">
                      Question #{qIndex + 1}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeQuestion(q.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </CardHeader>

                <CardContent className="p-5 sm:p-6 space-y-4">
                  {/* Question Prompt Editor */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Question Prompt
                    </label>
                    <Textarea
                      rows={2}
                      value={q.question}
                      onChange={(e) => updateQuestionText(q.id, e.target.value)}
                      className="text-xs sm:text-sm font-medium leading-relaxed"
                      placeholder="Type question prompt..."
                    />
                  </div>

                  {/* 4 Options Grid */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">
                        Answer Options (Select the correct answer)
                      </label>
                      <span className="text-[11px] text-slate-400">
                        Click the checkmark to change correct option
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, optIndex) => {
                        const isCorrect = q.correctAnswer === opt;
                        const optionLetter = String.fromCharCode(65 + optIndex); // A, B, C, D

                        return (
                          <div
                            key={optIndex}
                            className={`p-3 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 ${
                              isCorrect 
                                ? 'border-emerald-500 bg-emerald-50/50 shadow-2xs' 
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
                                isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {optionLetter}
                              </span>

                              {/* Toggle Correct Answer Radio */}
                              <button
                                type="button"
                                onClick={() => setCorrectAnswer(q.id, opt)}
                                className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full transition-all inline-flex items-center gap-1 ${
                                  isCorrect 
                                    ? 'bg-emerald-600 text-white shadow-2xs' 
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                }`}
                              >
                                {isCorrect ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    <span>Correct Answer</span>
                                  </>
                                ) : (
                                  <span>Set Correct</span>
                                )}
                              </button>
                            </div>

                            <Input
                              type="text"
                              value={opt}
                              onChange={(e) => updateOptionText(q.id, optIndex, e.target.value)}
                              className={`text-xs font-medium h-9 ${
                                isCorrect ? 'border-emerald-300 bg-white' : ''
                              }`}
                              placeholder={`Option ${optionLetter} text...`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom Save Action Bar */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600 font-medium">
              Ready to publish? All <span className="font-bold text-slate-900">{questions.length} questions</span> will be stored in your teacher question bank.
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                size="default"
                onClick={addQuestion}
                className="w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 text-campus-700" />
                Add Another Question
              </Button>
              <Button
                onClick={handleSaveQuiz}
                disabled={isSaving || questions.length === 0}
                size="default"
                className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold shadow-xs"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                    <span>Saving Quiz...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Quiz to Database</span>
                  </>
                )}
              </Button>
            </div>
          </div>

        </div>
      )}

      {/* STEP 3: SUCCESS CONFIRMATION VIEW */}
      {step === 3 && (
        <Card className="border-emerald-200 bg-white shadow-sm overflow-hidden animate-in zoom-in-95">
          <CardContent className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="text-2xl font-black text-slate-900">
                Quiz Successfully Saved!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {successMessage || `Your quiz for ${courseCode} (${questions.length} questions) has been recorded in the database.`}
              </p>
            </div>

            {/* Quiz Summary Pill */}
            <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 mx-auto">
              <span className="font-mono font-bold text-campus-800 bg-campus-50 border border-campus-200 px-2 py-0.5 rounded-md">
                {courseCode}
              </span>
              <span>&bull;</span>
              <span className="font-bold text-slate-900">{title}</span>
              <span>&bull;</span>
              <span>{questions.length} Questions</span>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setStep(1);
                  setSourceText('');
                  setQuizTitle('');
                  setQuestions([]);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="w-full sm:w-auto text-xs font-bold"
              >
                <Sparkles className="w-4 h-4 text-campus-600" />
                Generate Another Quiz
              </Button>

              <Link href="/teacher/quizzes" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full bg-campus-900 hover:bg-campus-800 text-white font-extrabold text-xs shadow-xs"
                >
                  <BookOpen className="w-4 h-4" />
                  View All Quizzes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
