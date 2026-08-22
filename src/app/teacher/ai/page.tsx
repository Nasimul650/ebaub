'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { generateAIQuiz, createQuiz } from '@/lib/mock/mockServices';
import { QuizQuestion } from '@/types';
import QuizGeneratorForm from '@/components/teacher/QuizGeneratorForm';
import QuizReviewHeader from '@/components/teacher/QuizReviewHeader';
import QuestionEditorList from '@/components/teacher/QuestionEditorList';

export default function TeacherAIQuizGeneratorPage() {
  const [subject, setSubject] = useState('Data Structures');
  const [topic, setTopic] = useState('Binary Search Tree Operations');
  const [count, setCount] = useState(3);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(false);

  const [generatedQuestions, setGeneratedQuestions] = useState<QuizQuestion[]>([]);
  const [quizTitle, setQuizTitle] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setPublished(false);
    setQuizTitle(`${subject} - ${topic} Quiz`);

    try {
      const questions = await generateAIQuiz({
        subject,
        topic,
        count,
        difficulty
      });
      setGeneratedQuestions(questions);
    } catch (err) {
      alert('Error generating questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (generatedQuestions.length === 0) return;

    await createQuiz({
      teacherId: 'fm-3',
      title: quizTitle || `${subject} Quiz`,
      topic,
      subject,
      difficulty,
      questions: generatedQuestions,
      isPublished: true
    });

    setPublished(true);
  };

  const handleDeleteQuestion = (id: string) => {
    setGeneratedQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleUpdateQuestion = (id: string, newText: string) => {
    setGeneratedQuestions(prev => prev.map(q => q.id === id ? { ...q, question: newText } : q));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
        <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-campus-500" /> AI Quiz Generator (Teacher Core Feature)
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-display">
          Generate Instant Course Quizzes & Question Banks
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
          Select a topic, adjust difficulty parameters, and let AI draft structured questions. You remain the final editor before publishing to students.
        </p>
      </div>

      <QuizGeneratorForm 
        subject={subject} setSubject={setSubject}
        topic={topic} setTopic={setTopic}
        difficulty={difficulty} setDifficulty={setDifficulty}
        count={count} setCount={setCount}
        loading={loading} onGenerate={handleGenerate}
      />

      {/* Generated Questions Review & Editing Area */}
      {generatedQuestions.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in">
          
          <QuizReviewHeader 
            quizTitle={quizTitle} setQuizTitle={setQuizTitle}
            published={published} onPublish={handlePublish}
          />

          {published && (
            <div className="p-4 rounded-2xl bg-campus-50 border border-campus-200 text-campus-900 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-campus-700" />
              <span>Quiz successfully published! Students can now access this quiz in their portal.</span>
            </div>
          )}

          <QuestionEditorList 
            questions={generatedQuestions}
            onDelete={handleDeleteQuestion}
            onUpdate={handleUpdateQuestion}
          />

        </div>
      )}

    </div>
  );
}
