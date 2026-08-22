'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  Plus, 
  Save, 
  Download, 
  Loader2,
  HelpCircle,
  Check
} from 'lucide-react';
import { generateAIQuiz, createQuiz } from '@/lib/mock/mockServices';
import { QuizQuestion, QuizGeneration } from '@/types';

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
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 space-y-3">
        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
          <Sparkles className="w-3.5 h-3.5" /> AI Quiz Generator (Teacher Core Feature)
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Generate Instant Course Quizzes & Question Banks
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
          Select a topic, adjust difficulty parameters, and let AI draft structured questions. You remain the final editor before publishing to students.
        </p>
      </div>

      {/* Generator Configuration Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Bot className="w-5 h-5 text-amber-400" /> Step 1: Configure AI Generation Parameters
        </h2>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Subject / Course</label>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Data Structures">Data Structures</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Database Systems">Database Systems</option>
              <option value="Software Engineering">Software Engineering</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Topic / Sub-chapter</label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Binary Search Trees"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Question Count</label>
            <select
              value={count}
              onChange={e => setCount(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
            >
              <option value={3}>3 Questions</option>
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-4 pt-2">
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>AI Engine Draft Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Quiz Draft Now</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Generated Questions Review & Editing Area */}
      {generatedQuestions.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 animate-in fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Step 2: Teacher Review & Edit</div>
              <input
                type="text"
                value={quizTitle}
                onChange={e => setQuizTitle(e.target.value)}
                className="text-lg font-bold text-white bg-transparent border-b border-slate-700 focus:outline-none focus:border-emerald-500 mt-1 w-full"
              />
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handlePublish}
                disabled={published}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center gap-2 transition-colors disabled:opacity-60"
              >
                {published ? (
                  <>
                    <Check className="w-4 h-4" /> Published to Students
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Publish Quiz
                  </>
                )}
              </button>
            </div>
          </div>

          {published && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Quiz successfully published! Students can now access this quiz in their portal.</span>
            </div>
          )}

          {/* Question List */}
          <div className="space-y-6">
            {generatedQuestions.map((q, idx) => (
              <div key={q.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {q.type}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400"
                    title="Remove Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 font-semibold mb-1">Question Statement:</label>
                  <input
                    type="text"
                    value={q.question}
                    onChange={e => handleUpdateQuestion(q.id, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {q.options && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] text-slate-400 font-semibold">Options:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-xl border text-xs ${
                            opt === q.correctAnswer
                              ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 font-semibold'
                              : 'bg-slate-900 border-slate-800 text-slate-300'
                          }`}
                        >
                          {opt === q.correctAnswer && <span className="text-emerald-400 font-bold mr-1">✓</span>}
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <span className="font-bold text-amber-400">Correct Answer / Explanation:</span>
                  <p className="text-slate-300">{q.explanation}</p>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
