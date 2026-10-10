'use client';

import React, { useState, useMemo } from 'react';
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
  Clock, 
  CheckCheck, 
  FileText, 
  Upload, 
  FileCheck, 
  X, 
  Search, 
  Building2, 
  FolderDown, 
  HelpCircle,
  Lightbulb,
  FileSpreadsheet,
  Globe,
  Share2
} from 'lucide-react';
import { saveGeneratedQuiz, updateQuiz, QuestionType, QuizStatus } from '@/app/actions/quiz';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { CourseMaterial } from '@/types';

export type EditableQuestion = {
  id: string;
  question: string;
  question_type: QuestionType;
  options: string[];
  correctAnswer: string;
  suggestedAnswer: string;
};

// Faculty definitions with specific university course codes
const FACULTY_PRESETS = [
  {
    id: 'agriculture',
    name: 'Faculty of Agriculture',
    icon: '🌾',
    shortName: 'Agriculture',
    sampleCourses: ['AG-101', 'AGRON-201', 'SOIL-301', 'HORT-202', 'ENTO-301', 'PATH-302', 'AGEC-101'],
    sampleTopics: [
      'Photosynthesis light reactions & Calvin cycle stoichiometry',
      'Soil nutrient management & NPK fertilizer application',
      'Cereal crop production & agronomic water management',
      'Horticultural crop propagation and grafting techniques'
    ]
  },
  {
    id: 'cse',
    name: 'Faculty of Computer Science & Engineering',
    icon: '💻',
    shortName: 'CSE & EEE',
    sampleCourses: ['CSE-1201', 'CSE-1211', 'CSE-2101', 'CSE-3101', 'EEE-1201', 'SWE-2201', 'MATH-102'],
    sampleTopics: [
      'Binary Search Trees, AVL balance factors & traversal complexity',
      'Relational database normalization & B+ tree indexing',
      'Structured C programming loops, arrays & pointer arithmetic',
      'Operating systems deadlock prevention & CPU scheduling algorithms'
    ]
  },
  {
    id: 'business',
    name: 'Faculty of Business Administration',
    icon: '📊',
    shortName: 'Business Admin',
    sampleCourses: ['BBA-101', 'FIN-201', 'MKT-301', 'ACT-102', 'MGT-201', 'HRM-301', 'BUS-105'],
    sampleTopics: [
      'Capital budgeting, Net Present Value & Internal Rate of Return',
      'Marketing mix (4Ps), market segmentation & consumer behavior',
      'Financial accounting principles & balance sheet reconciliation',
      'Strategic human resource management & organizational behavior'
    ]
  },
  {
    id: 'law',
    name: 'Faculty of Law',
    icon: '⚖️',
    shortName: 'Faculty of Law',
    sampleCourses: ['LAW-101', 'LAW-201', 'JUR-301', 'CIV-401', 'CON-202', 'CRIM-301'],
    sampleTopics: [
      'Constitutional law fundamental rights & judicial review doctrine',
      'Law of Contract offer, acceptance & consideration essentials',
      'Criminal procedure, bailable offenses & charge sheet framing',
      'Jurisprudence theories of natural law vs legal positivism'
    ]
  }
];

interface QuizGeneratorWizardProps {
  materials?: CourseMaterial[];
  defaultFacultyId?: string;
  initialQuiz?: any; // For editing an existing exam
}

export default function QuizGeneratorWizard({
  materials = [],
  defaultFacultyId = 'cse',
  initialQuiz = null
}: QuizGeneratorWizardProps) {
  const router = useRouter();

  // Wizard Step: 1 = Configure & Generate, 2 = Review & Edit, 3 = Successfully Saved
  const [step, setStep] = useState<1 | 2 | 3>(initialQuiz ? 2 : 1);

  // Faculty selection
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>(() => {
    return FACULTY_PRESETS.some(f => f.id === defaultFacultyId) ? defaultFacultyId : 'cse';
  });

  // Question Type selection
  const [questionType, setQuestionType] = useState<QuestionType>(() => {
    return (initialQuiz?.exam_type as QuestionType) || 'mcq';
  });

  // Source Material Input Mode: 'saved' | 'upload' | 'manual'
  const [sourceMode, setSourceMode] = useState<'saved' | 'upload' | 'manual'>('manual');

  // Form Fields
  const [courseCode, setCourseCode] = useState(() => initialQuiz?.course_code || '');
  const [title, setQuizTitle] = useState(() => initialQuiz?.title || '');
  const [sourceText, setSourceText] = useState('');
  const [questionCount, setQuestionCount] = useState<number>(() => {
    if (initialQuiz?.quiz_questions?.length) return initialQuiz.quiz_questions.length;
    return questionType === 'creative' ? 3 : 5;
  });
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  // Attached Material / Document state
  const [attachedMaterial, setAttachedMaterial] = useState<CourseMaterial | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: number;
    type: string;
    base64?: string;
  } | null>(null);

  // Material Search in picker
  const [materialSearch, setMaterialSearch] = useState('');

  // Loading & Feedback
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savingStatus, setSavingStatus] = useState<QuizStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [savedQuizId, setSavedQuizId] = useState<string | null>(() => initialQuiz?.id || null);

  // Questions State
  const [questions, setQuestions] = useState<EditableQuestion[]>(() => {
    if (initialQuiz?.quiz_questions) {
      return initialQuiz.quiz_questions.map((q: any, idx: number) => ({
        id: q.id || `q-${idx}`,
        question: q.question_text || '',
        question_type: (q.question_type || initialQuiz.exam_type || 'mcq') as QuestionType,
        options: Array.isArray(q.options) && q.options.length === 4 
          ? q.options 
          : ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: q.correct_answer || q.options?.[0] || 'Option A',
        suggestedAnswer: q.suggested_answer || q.grading_rubric || ''
      }));
    }
    return [];
  });

  // Get active faculty preset
  const activeFaculty = useMemo(() => {
    return FACULTY_PRESETS.find(f => f.id === selectedFacultyId) || FACULTY_PRESETS[0];
  }, [selectedFacultyId]);

  // Filtered materials for current search
  const filteredMaterials = useMemo(() => {
    if (!materialSearch.trim()) return materials;
    const q = materialSearch.toLowerCase();
    return materials.filter(m => 
      m.title.toLowerCase().includes(q) ||
      m.course_code.toLowerCase().includes(q) ||
      m.file_name.toLowerCase().includes(q)
    );
  }, [materials, materialSearch]);

  // Handle choosing a saved course material
  const handleSelectSavedMaterial = (mat: CourseMaterial) => {
    setAttachedMaterial(mat);
    setUploadedFile(null);

    if (mat.course_code) {
      const cleanCode = mat.course_code.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();
      setCourseCode(cleanCode || mat.course_code.trim().toUpperCase());
    }

    if (!title.trim() || title.includes('Exam') || title.includes('Quiz')) {
      const typeLabel = questionType === 'mcq' ? 'MCQ Exam' : questionType === 'short_answer' ? 'Short Questions' : 'Creative Assessment';
      setQuizTitle(`${typeLabel}: ${mat.title}`);
    }

    if (!sourceText.trim()) {
      setSourceText(`Assessment based on course material: ${mat.title} (${mat.file_name})`);
    }

    setErrorMessage(null);
  };

  const handleRemoveAttachedMaterial = () => {
    setAttachedMaterial(null);
  };

  // Handle uploading a local file (.txt, .md, .pdf)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachedMaterial(null);

    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.csv')) {
      const text = await file.text();
      setSourceText(text.slice(0, 8000));
      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type || 'text/plain'
      });

      if (!title.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
        setQuizTitle(`Exam: ${cleanName}`);
      }
    } 
    else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;
        setUploadedFile({
          name: file.name,
          size: file.size,
          type: 'application/pdf',
          base64: base64Data
        });

        if (!title.trim()) {
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
          setQuizTitle(`Exam: ${cleanName}`);
        }

        if (!sourceText.trim()) {
          setSourceText(`Academic examination testing key concepts from ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setErrorMessage('Please upload a PDF or plain text document (.pdf, .txt, .md).');
    }
  };

  const handleRemoveUploadedFile = () => {
    setUploadedFile(null);
  };

  // Step 1: Trigger AI Generation
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (!courseCode.trim()) {
      setErrorMessage('Please specify a Course Code (e.g. CSE-1201 or AG-204).');
      return;
    }

    const trimmedText = sourceText.trim();
    const hasAttachment = attachedMaterial !== null || uploadedFile !== null;

    if (!trimmedText && !hasAttachment) {
      setErrorMessage('Please provide a topic/notes or attach a course material file for the AI to analyze.');
      return;
    }

    setIsGenerating(true);

    const typeName = questionType === 'mcq' ? 'MCQ Exam' : questionType === 'short_answer' ? 'Short Questions Exam' : 'Creative Problem Assessment';
    const resolvedTitle = title.trim() || `${courseCode.trim().toUpperCase()} - ${typeName}`;
    if (!title.trim()) {
      setQuizTitle(resolvedTitle);
    }

    try {
      const payload: any = {
        questionType: questionType,
        topic: trimmedText || (attachedMaterial ? attachedMaterial.title : uploadedFile?.name),
        sourceText: trimmedText,
        courseCode: courseCode.trim().toUpperCase(),
        count: questionCount,
        difficulty: difficulty,
        faculty: activeFaculty.name
      };

      if (attachedMaterial) {
        payload.fileUrl = attachedMaterial.file_url;
        payload.fileName = attachedMaterial.file_name;
        payload.fileType = attachedMaterial.file_type;
      }

      if (uploadedFile?.base64) {
        payload.fileBase64 = uploadedFile.base64;
        payload.fileName = uploadedFile.name;
        payload.fileType = uploadedFile.type;
      }

      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate examination. Please try again.');
      }

      const formatted: EditableQuestion[] = (data.questions || []).map((q: any, idx: number) => ({
        id: `q-${Date.now()}-${idx}`,
        question: q.question || '',
        question_type: questionType,
        options: Array.isArray(q.options) && q.options.length === 4 
          ? q.options 
          : ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: q.correctAnswer || q.options?.[0] || 'Option A',
        suggestedAnswer: q.suggestedAnswer || q.suggested_answer || ''
      }));

      if (formatted.length === 0) {
        throw new Error('No questions could be synthesized. Please adjust the material or topic.');
      }

      setQuestions(formatted);
      setStep(2);

    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during exam generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Step 2: Question Editing Helpers
  const updateQuestionText = (id: string, text: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, question: text } : q));
  };

  const updateSuggestedAnswer = (id: string, answerText: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, suggestedAnswer: answerText } : q));
  };

  const updateOptionText = (questionId: string, optionIndex: number, newOptionText: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q;

      const oldOption = q.options[optionIndex];
      const newOptions = [...q.options];
      newOptions[optionIndex] = newOptionText;

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

  const setCorrectAnswer = (questionId: string, answerText: string) => {
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, correctAnswer: answerText } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const addQuestion = () => {
    const isMcq = questionType === 'mcq';
    const newQ: EditableQuestion = {
      id: `q-${Date.now()}-${questions.length}`,
      question: isMcq ? 'Enter question prompt...' : 'Enter examination prompt / scenario...',
      question_type: questionType,
      options: isMcq ? ['Option A', 'Option B', 'Option C', 'Option D'] : [],
      correctAnswer: isMcq ? 'Option A' : '',
      suggestedAnswer: isMcq ? '' : 'Model Answer & Grading Rubric...'
    };
    setQuestions(prev => [...prev, newQ]);
  };

  // Step 3: Save to Database as Draft or Published
  const handleSaveExam = async (statusToSave: QuizStatus) => {
    setErrorMessage(null);

    if (!courseCode.trim() || !title.trim() || questions.length === 0) {
      setErrorMessage('Please ensure Course Code, Title, and at least one question exist.');
      return;
    }

    setIsSaving(true);
    setSavingStatus(statusToSave);

    try {
      const payload = {
        course_code: courseCode.trim().toUpperCase(),
        title: title.trim(),
        status: statusToSave,
        exam_type: questionType,
        questions: questions.map(q => ({
          question: q.question.trim(),
          question_type: q.question_type || questionType,
          options: q.question_type === 'mcq' ? q.options.map(opt => opt.trim()) : null,
          correctAnswer: q.question_type === 'mcq' ? q.correctAnswer.trim() : null,
          suggestedAnswer: q.suggestedAnswer ? q.suggestedAnswer.trim() : null
        }))
      };

      let result;
      if (initialQuiz?.id) {
        result = await updateQuiz(initialQuiz.id, payload);
      } else {
        result = await saveGeneratedQuiz(payload);
      }

      if (!result.success) {
        throw new Error(result.error || 'Failed to save exam to database.');
      }

      setSavedQuizId(result.quizId || initialQuiz?.id);
      setSuccessMessage(result.message || `Exam successfully ${statusToSave === 'published' ? 'published' : 'saved as draft'}!`);
      setStep(3);

    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save exam to database.');
    } finally {
      setIsSaving(false);
      setSavingStatus(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      
      {/* Top Header & Stepper */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/teacher/quizzes"
            className="p-2.5 rounded-2xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200/60"
            title="Back to Exam Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-campus-700 bg-campus-50 border border-campus-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-campus-600" /> Academic AI Generator
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-medium text-slate-500">Teacher Workspace</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
              {initialQuiz ? 'Edit Course Exam' : 'AI Exam & Question Paper Generator'}
            </h1>
          </div>
        </div>

        {/* Stepper Status */}
        <div className="flex items-center gap-2 text-xs font-bold self-start sm:self-auto bg-slate-50 border border-slate-200/80 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              step === 1 ? 'bg-campus-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>1</span>
            <span>Configure</span>
          </button>
          <span className="text-slate-300">&rarr;</span>
          <button
            type="button"
            disabled={questions.length === 0}
            onClick={() => setStep(2)}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              step === 2 ? 'bg-campus-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>2</span>
            <span>Review & Edit</span>
          </button>
          <span className="text-slate-300">&rarr;</span>
          <div className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
            step === 3 ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-500'
          }`}>
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Saved</span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold">Attention Required</div>
            <div className="text-red-700 mt-0.5 leading-relaxed">{errorMessage}</div>
          </div>
          <button 
            onClick={() => setErrorMessage(null)} 
            className="text-red-400 hover:text-red-700 font-bold text-base"
          >
            &times;
          </button>
        </div>
      )}

      {/* STEP 1: CONFIGURE & GENERATE */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in">
          
          <Card className="border-slate-200/80 shadow-2xs overflow-hidden rounded-3xl">
            
            {/* Faculty Selection Header */}
            <CardHeader className="bg-gradient-to-r from-slate-50 via-campus-50/40 to-slate-50 border-b border-slate-200/60 p-6 sm:p-7">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-campus-800 text-white flex items-center justify-center shadow-xs">
                      <Building2 className="w-4 h-4 text-campus-300" />
                    </div>
                    <div>
                      <CardTitle className="text-base sm:text-lg">Faculty Curriculum Alignment</CardTitle>
                      <CardDescription className="text-xs">
                        Select your university faculty to align question formats and course codes.
                      </CardDescription>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-campus-800 bg-white border border-campus-200 px-3 py-1 rounded-xl shadow-2xs">
                    {activeFaculty.icon} {activeFaculty.name}
                  </span>
                </div>

                {/* Faculty Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {FACULTY_PRESETS.map(faculty => {
                    const isSelected = selectedFacultyId === faculty.id;
                    return (
                      <button
                        key={faculty.id}
                        type="button"
                        onClick={() => {
                          setSelectedFacultyId(faculty.id);
                          if (!courseCode || FACULTY_PRESETS.some(f => f.sampleCourses.includes(courseCode))) {
                            setCourseCode(faculty.sampleCourses[0]);
                          }
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-campus-900 text-white border-campus-900 shadow-xs'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span className="text-lg">{faculty.icon}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate leading-tight">
                            {faculty.shortName}
                          </div>
                          <div className={`text-[10px] truncate ${isSelected ? 'text-campus-200' : 'text-slate-400'}`}>
                            {faculty.sampleCourses[0]} &middot; {faculty.sampleCourses.length} codes
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 space-y-7">
              <form onSubmit={handleGenerate} className="space-y-7">
                
                {/* QUESTION TYPE SELECTOR */}
                <div className="space-y-2.5 bg-slate-50/90 border border-slate-200/80 p-5 rounded-3xl">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-campus-700" />
                      <span>Select Question Paper Type <span className="text-red-500">*</span></span>
                    </label>
                    <span className="text-[11px] font-bold text-campus-800">
                      {questionType === 'mcq' ? 'Objective Test' : questionType === 'short_answer' ? '3-5 Mark Questions' : 'Scenario Analysis'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {/* Option 1: MCQ */}
                    <div
                      onClick={() => setQuestionType('mcq')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        questionType === 'mcq'
                          ? 'border-campus-800 bg-white shadow-xs ring-2 ring-campus-800/10'
                          : 'border-slate-200/80 bg-white/70 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">🔘</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          questionType === 'mcq' ? 'bg-campus-100 text-campus-900' : 'bg-slate-100 text-slate-500'
                        }`}>
                          Standard MCQ
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-900">
                          Multiple Choice (MCQ)
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          4 options (A, B, C, D) with single verified answer key. Perfect for rapid quizzes.
                        </p>
                      </div>
                    </div>

                    {/* Option 2: Short Answer */}
                    <div
                      onClick={() => setQuestionType('short_answer')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        questionType === 'short_answer'
                          ? 'border-campus-800 bg-white shadow-xs ring-2 ring-campus-800/10'
                          : 'border-slate-200/80 bg-white/70 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">📝</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          questionType === 'short_answer' ? 'bg-campus-100 text-campus-900' : 'bg-slate-100 text-slate-500'
                        }`}>
                          3 &ndash; 5 Marks
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-900">
                          Short Questions
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          Conceptual definitions, mechanisms, and differences with teacher grading rubric.
                        </p>
                      </div>
                    </div>

                    {/* Option 3: Creative Questions */}
                    <div
                      onClick={() => setQuestionType('creative')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        questionType === 'creative'
                          ? 'border-campus-800 bg-white shadow-xs ring-2 ring-campus-800/10'
                          : 'border-slate-200/80 bg-white/70 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">💡</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          questionType === 'creative' ? 'bg-campus-100 text-campus-900' : 'bg-slate-100 text-slate-500'
                        }`}>
                          Higher-Order
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-900">
                          Creative / Scenario
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          Case study scenario stems followed by structured sub-questions (a, b, c) and solution keys.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Code & Title Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Course Code <span className="text-red-500">*</span></span>
                      <span className="text-[11px] text-slate-400 font-normal">e.g. {activeFaculty.sampleCourses[0]}</span>
                    </label>
                    <Input
                      type="text"
                      placeholder={`e.g. ${activeFaculty.sampleCourses[0]}`}
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
                      className="font-mono uppercase font-bold text-slate-800 tracking-wider h-11 rounded-xl"
                      required
                    />

                    {/* Faculty-tailored quick badges */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                        <span>{activeFaculty.shortName} Course Codes:</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {activeFaculty.sampleCourses.map(code => (
                          <button
                            key={code}
                            type="button"
                            onClick={() => setCourseCode(code)}
                            className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg transition-colors ${
                              courseCode === code
                                ? 'bg-campus-800 text-white shadow-2xs'
                                : 'bg-slate-100 hover:bg-campus-100 hover:text-campus-900 text-slate-700 border border-slate-200/60'
                            }`}
                          >
                            {code}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Exam Title <span className="text-slate-400 font-normal">(Optional)</span></span>
                      <span className="text-[11px] text-slate-400 font-normal">Auto-generated if empty</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Final Examination: Spring Semester"
                      value={title}
                      onChange={(e) => setQuizTitle(e.target.value)}
                      className="h-11 rounded-xl"
                    />

                    {/* Sample topic quick fills */}
                    <div className="space-y-1 pt-1">
                      <div className="text-[10px] text-slate-400 font-medium">
                        Popular Syllabus Topics for {activeFaculty.shortName}:
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {activeFaculty.sampleTopics.slice(0, 2).map((topic, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSourceText(topic);
                              if (!title) setQuizTitle(`${courseCode || activeFaculty.sampleCourses[0]} Exam`);
                            }}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60 truncate max-w-[200px]"
                            title={topic}
                          >
                            &bull; {topic}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Question Count & Difficulty Selector */}
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

                {/* COURSE MATERIAL INTEGRATION SECTION */}
                <div className="space-y-4 pt-1">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-campus-700" />
                        <span>Source Material or Lecture Notes</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Choose how to supply lecture content so AI generates questions directly from the syllabus.
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setSourceMode('saved')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                          sourceMode === 'saved' ? 'bg-white text-campus-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <FolderDown className="w-3.5 h-3.5 text-campus-700" />
                        <span>Saved Materials ({materials.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSourceMode('upload')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                          sourceMode === 'upload' ? 'bg-white text-campus-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5 text-blue-600" />
                        <span>Upload File</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSourceMode('manual')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                          sourceMode === 'manual' ? 'bg-white text-campus-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                        <span>Topic / Text</span>
                      </button>
                    </div>
                  </div>

                  {/* ACTIVE ATTACHED MATERIAL CARD */}
                  {(attachedMaterial || uploadedFile) && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center justify-between gap-4 animate-in fade-in">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-md">
                              Attached to Exam Generator
                            </span>
                            {attachedMaterial?.course_code && (
                              <span className="text-[10px] font-mono font-bold text-emerald-800">
                                {attachedMaterial.course_code}
                              </span>
                            )}
                          </div>
                          <div className="font-bold text-xs sm:text-sm text-emerald-950 truncate mt-0.5">
                            {attachedMaterial?.title || uploadedFile?.name}
                          </div>
                          <div className="text-[11px] text-emerald-700 truncate">
                            {attachedMaterial?.file_name || `${(uploadedFile?.size ? uploadedFile.size / 1024 : 0).toFixed(1)} KB`} &bull; AI will synthesize {questionType.toUpperCase()} questions directly from this document
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={attachedMaterial ? handleRemoveAttachedMaterial : handleRemoveUploadedFile}
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-200/60 hover:text-emerald-900 transition-colors shrink-0"
                        title="Remove attached file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* SAVED COURSE MATERIALS PICKER */}
                  {sourceMode === 'saved' && (
                    <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <span>Select From Your Uploaded Course Materials</span>
                          <span className="text-[11px] text-slate-500 font-normal">
                            (Click to attach to AI generator)
                          </span>
                        </div>
                        <div className="relative w-48">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <Input
                            type="text"
                            placeholder="Search materials..."
                            value={materialSearch}
                            onChange={(e) => setMaterialSearch(e.target.value)}
                            className="h-8 pl-8 text-xs rounded-xl bg-white"
                          />
                        </div>
                      </div>

                      {filteredMaterials.length === 0 ? (
                        <div className="p-6 text-center bg-white rounded-xl border border-dashed border-slate-200 space-y-2">
                          <FolderDown className="w-6 h-6 text-slate-400 mx-auto" />
                          <p className="text-xs text-slate-500">
                            {materialSearch ? 'No matching materials found.' : 'You have not uploaded any course materials yet.'}
                          </p>
                          <Link href="/teacher/materials">
                            <Button size="sm" variant="outline" className="text-xs font-bold mt-1">
                              Upload Course Materials &rarr;
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                          {filteredMaterials.map(mat => {
                            const isAttached = attachedMaterial?.id === mat.id;
                            const isPdf = mat.file_type?.includes('pdf') || mat.file_name.endsWith('.pdf');

                            return (
                              <div
                                key={mat.id}
                                onClick={() => handleSelectSavedMaterial(mat)}
                                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-left ${
                                  isAttached 
                                    ? 'border-emerald-500 bg-emerald-50/70 shadow-2xs ring-1 ring-emerald-500' 
                                    : 'border-slate-200 bg-white hover:border-campus-300 hover:shadow-2xs'
                                }`}
                              >
                                <div className="min-w-0 space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono font-bold text-[10px] bg-campus-50 text-campus-800 px-1.5 py-0.5 rounded">
                                      {mat.course_code}
                                    </span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                      isPdf ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                                    }`}>
                                      {isPdf ? 'PDF' : 'DOC'}
                                    </span>
                                  </div>
                                  <div className="text-xs font-bold text-slate-900 truncate">
                                    {mat.title}
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate">
                                    {mat.file_name}
                                  </div>
                                </div>

                                <div className="shrink-0">
                                  {isAttached ? (
                                    <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-100 px-2 py-1 rounded-md">
                                      <Check className="w-3 h-3" /> Attached
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold text-campus-700 hover:underline">
                                      Attach &rarr;
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* LOCAL FILE UPLOADER */}
                  {sourceMode === 'upload' && (
                    <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-3 animate-in fade-in">
                      <label 
                        className="border-2 border-dashed border-slate-300 hover:border-campus-400 bg-white hover:bg-slate-50/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center"
                      >
                        <div className="w-10 h-10 rounded-xl bg-campus-50 text-campus-800 flex items-center justify-center">
                          <Upload className="w-5 h-5 text-campus-700" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-slate-800">
                            Click to upload or drag & drop lecture notes
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Supports PDF documents (.pdf) or text files (.txt, .md, .csv)
                          </p>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.txt,.md,.csv"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                  {/* SOURCE NOTES TEXTAREA */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-campus-700" />
                        <span>
                          {attachedMaterial || uploadedFile 
                            ? 'Additional Guidance / Specific Questions Focus (Optional)' 
                            : 'Source Material, Lecture Transcript, or Syllabus Content *'}
                        </span>
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {sourceText.length} characters
                      </span>
                    </div>

                    <Textarea
                      rows={attachedMaterial || uploadedFile ? 4 : 7}
                      placeholder={
                        attachedMaterial || uploadedFile
                          ? `Provide optional prompt instructions, e.g.:&#10;&bull; 'Focus questions on Section 2 calculations and avoid introductory history'&#10;&bull; 'Ensure at least one question covers real-world application'`
                          : `Enter a topic, paste lecture notes, or syllabus content, such as:&#10;&#10;&bull; 'Photosynthesis: light reactions, photosystem II, Z-scheme, and Calvin cycle stoichiometry'&#10;&bull; 'Binary search tree balancing, AVL rotations, and time complexity in worst vs average cases'&#10;&bull; Or paste a paragraph directly from your lecture slide notes...`
                      }
                      value={sourceText}
                      onChange={(e) => setSourceText(e.target.value)}
                      className="text-xs sm:text-sm font-sans leading-relaxed resize-y rounded-2xl"
                    />
                  </div>

                </div>

                {/* Submit Action */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                  <div className="text-xs text-slate-500 font-medium">
                    Synthesizing <span className="font-bold text-slate-800">{questionType.toUpperCase()} Questions</span> via Gemini 1.5 Flash
                  </div>

                  <Button
                    type="submit"
                    disabled={isGenerating || (!sourceText.trim() && !attachedMaterial && !uploadedFile) || !courseCode.trim()}
                    size="lg"
                    className="w-full sm:w-auto min-w-[240px] bg-campus-900 hover:bg-campus-800 text-white font-extrabold shadow-sm rounded-xl"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                        <span>Generating {questionType.toUpperCase()} Exam...</span>
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

          {/* Skeleton Loader during Generation */}
          {isGenerating && (
            <div className="space-y-4 animate-pulse p-6 bg-white border border-campus-200 rounded-3xl shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="space-y-2">
                  <div className="h-4 bg-campus-200 rounded-md w-56" />
                  <div className="h-3 bg-slate-200 rounded-md w-80" />
                </div>
                <div className="h-8 bg-campus-100 rounded-xl w-28" />
              </div>

              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 border border-slate-200/60 rounded-2xl space-y-3 bg-slate-50/50">
                  <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                  <div className="h-16 bg-slate-200 rounded-xl mt-2" />
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* STEP 2: REVIEW & EDIT QUESTIONS DYNAMICALLY */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Review Header Banner */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-xs bg-campus-100 text-campus-900 border border-campus-200 px-2.5 py-0.5 rounded-lg">
                  {courseCode}
                </span>
                <span className="text-xs font-bold text-white bg-slate-900 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  {questionType === 'mcq' ? 'MCQ Exam' : questionType === 'short_answer' ? 'Short Questions' : 'Creative Scenario Exam'}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  &bull; {questions.length} Questions
                </span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                  {difficulty}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                {title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review and customize questions before saving. Save as Draft to continue editing later, or Publish immediately.
              </p>
            </div>

            {/* Top Action Buttons: Save as Draft & Publish Exam */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep(1)}
                className="text-xs font-semibold rounded-xl"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                Parameters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={addQuestion}
                className="text-xs font-semibold rounded-xl"
              >
                <Plus className="w-3.5 h-3.5 text-campus-700" />
                Add Question
              </Button>

              {/* ACTION 1: SAVE AS DRAFT */}
              <Button
                onClick={() => handleSaveExam('draft')}
                disabled={isSaving || questions.length === 0}
                variant="secondary"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs shadow-2xs rounded-xl border border-slate-200"
              >
                {isSaving && savingStatus === 'draft' ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin shrink-0" />
                    <span>Saving Draft...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-slate-600" />
                    <span>Save as Draft</span>
                  </>
                )}
              </Button>

              {/* ACTION 2: PUBLISH EXAM */}
              <Button
                onClick={() => handleSaveExam('published')}
                disabled={isSaving || questions.length === 0}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-xs rounded-xl"
              >
                {isSaving && savingStatus === 'published' ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 text-white" />
                    <span>Publish Exam</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* List of Dynamic Question Cards */}
          <div className="space-y-5">
            {questions.map((q, qIndex) => {
              const isMcq = q.question_type === 'mcq';
              const isShort = q.question_type === 'short_answer';
              const isCreative = q.question_type === 'creative';

              return (
                <Card key={q.id} className="border-slate-200/80 shadow-xs hover:border-campus-300 transition-colors rounded-3xl overflow-hidden">
                  
                  {/* Card Header */}
                  <CardHeader className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-200/60 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-xl bg-campus-900 text-white flex items-center justify-center font-extrabold text-xs shadow-2xs">
                        {qIndex + 1}
                      </span>
                      <span className="font-extrabold text-xs text-slate-700 uppercase tracking-wider">
                        {isMcq ? `Multiple Choice Question #${qIndex + 1}` : isShort ? `Short Question #${qIndex + 1} (3-5 Marks)` : `Creative Scenario Problem #${qIndex + 1}`}
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
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>{isCreative ? 'Scenario Stem & Sub-Questions' : 'Question Prompt'}</span>
                        <span className="text-[11px] text-slate-400">
                          {isShort ? '3-5 Marks Expected' : isCreative ? 'Structured Parts (a, b, c)' : '1 Mark'}
                        </span>
                      </label>
                      <Textarea
                        rows={isCreative ? 4 : 2}
                        value={q.question}
                        onChange={(e) => updateQuestionText(q.id, e.target.value)}
                        className="text-xs sm:text-sm font-medium leading-relaxed rounded-xl"
                        placeholder="Type question prompt..."
                      />
                    </div>

                    {/* DYNAMIC SECTION BASED ON QUESTION TYPE */}
                    {isMcq ? (
                      /* MCQ 4-OPTIONS GRID */
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700">
                            Answer Options (Select the correct answer key)
                          </label>
                          <span className="text-[11px] text-slate-400">
                            Click &ldquo;Set Correct&rdquo; to designate the answer
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {q.options.map((opt, optIndex) => {
                            const isCorrect = q.correctAnswer === opt;
                            const optionLetter = String.fromCharCode(65 + optIndex);

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
                                        <Check className="w-3 dot3" />
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
                                  className={`text-xs font-medium h-9 rounded-xl ${
                                    isCorrect ? 'border-emerald-300 bg-white' : ''
                                  }`}
                                  placeholder={`Option ${optionLetter} text...`}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      /* SHORT ANSWER & CREATIVE: SUGGESTED ANSWER & RUBRIC (NO A/B/C/D INPUTS) */
                      <div className="space-y-1.5 pt-1 bg-amber-50/50 border border-amber-200/60 p-4 rounded-2xl">
                        <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                          <Lightbulb className="w-4 h-4 text-amber-700" />
                          <span>Suggested Model Answer & Grading Rubric (Teacher Reference)</span>
                        </label>
                        <Textarea
                          rows={3}
                          value={q.suggestedAnswer}
                          onChange={(e) => updateSuggestedAnswer(q.id, e.target.value)}
                          className="text-xs sm:text-sm font-medium leading-relaxed rounded-xl bg-white border-amber-200"
                          placeholder="Expected model answer points, scoring rubric, and criteria for awarding full marks..."
                        />
                        <p className="text-[11px] text-amber-800">
                          This model answer serves as reference scoring criteria for faculty evaluators and won&apos;t appear as blank lines on student offline question papers.
                        </p>
                      </div>
                    )}

                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Bottom Dual Save Bar */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600 font-medium">
              Ready to finalize? You can save as a draft or publish immediately to your question bank.
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                size="default"
                onClick={addQuestion}
                className="w-full sm:w-auto rounded-xl"
              >
                <Plus className="w-4 h-4 text-campus-700" />
                Add Question
              </Button>

              {/* SAVE AS DRAFT */}
              <Button
                onClick={() => handleSaveExam('draft')}
                disabled={isSaving || questions.length === 0}
                variant="secondary"
                size="default"
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-200 rounded-xl"
              >
                {isSaving && savingStatus === 'draft' ? (
                  <span>Saving Draft...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-slate-600" />
                    <span>Save as Draft</span>
                  </>
                )}
              </Button>

              {/* PUBLISH EXAM */}
              <Button
                onClick={() => handleSaveExam('published')}
                disabled={isSaving || questions.length === 0}
                size="default"
                className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold shadow-xs rounded-xl"
              >
                {isSaving && savingStatus === 'published' ? (
                  <span>Publishing...</span>
                ) : (
                  <>
                    <Globe className="w-4 h-4 text-white" />
                    <span>Publish Exam</span>
                  </>
                )}
              </Button>
            </div>
          </div>

        </div>
      )}

      {/* STEP 3: SUCCESS CONFIRMATION VIEW */}
      {step === 3 && (
        <Card className="border-emerald-200 bg-white shadow-sm overflow-hidden rounded-3xl animate-in zoom-in-95">
          <CardContent className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="text-2xl font-black text-slate-900">
                {successMessage?.includes('draft') ? 'Exam Saved as Draft!' : 'Exam Published Successfully!'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {successMessage || `Your examination for ${courseCode} (${questions.length} questions) is stored in the database.`}
              </p>
            </div>

            {/* Exam Summary Pill */}
            <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 mx-auto flex-wrap justify-center">
              <span className="font-mono font-bold text-campus-800 bg-campus-50 border border-campus-200 px-2 py-0.5 rounded-md">
                {courseCode}
              </span>
              <span>&bull;</span>
              <span className="font-bold text-slate-900">{title}</span>
              <span>&bull;</span>
              <span className="uppercase text-[11px] font-bold text-slate-600 bg-slate-200/60 px-2 py-0.5 rounded">
                {questionType.replace('_', ' ')}
              </span>
              <span>&bull;</span>
              <span>{questions.length} Questions</span>
            </div>

            {/* Actions: Print View, View All, Create Another */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
              {savedQuizId && (
                <Link href={`/teacher/quizzes/${savedQuizId}/print`} target="_blank" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-xs rounded-xl"
                  >
                    <FileText className="w-4 h-4 text-slate-300" />
                    <span>Print Exam / PDF</span>
                  </Button>
                </Link>
              )}

              <Link href="/teacher/quizzes" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full text-xs font-bold rounded-xl"
                >
                  <BookOpen className="w-4 h-4" />
                  Exam Dashboard
                </Button>
              </Link>

              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setStep(1);
                  setSourceText('');
                  setQuizTitle('');
                  setQuestions([]);
                  setAttachedMaterial(null);
                  setUploadedFile(null);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="w-full sm:w-auto text-xs font-bold rounded-xl"
              >
                <Sparkles className="w-4 h-4 text-campus-600" />
                Create Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
