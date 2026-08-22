'use client';

import React from 'react';
import { Bot, Sparkles, Loader2 } from 'lucide-react';

interface Props {
  subject: string;
  setSubject: (v: string) => void;
  topic: string;
  setTopic: (v: string) => void;
  difficulty: string;
  setDifficulty: (v: 'Easy' | 'Medium' | 'Hard') => void;
  count: number;
  setCount: (v: number) => void;
  loading: boolean;
  onGenerate: (e: React.FormEvent) => void;
}

export default function QuizGeneratorForm({
  subject, setSubject,
  topic, setTopic,
  difficulty, setDifficulty,
  count, setCount,
  loading, onGenerate
}: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
        <Bot className="w-5 h-5 text-emerald-600" /> Step 1: Configure AI Generation Parameters
      </h2>

      <form onSubmit={onGenerate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        
        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">Subject / Course</label>
          <select
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-600"
          >
            <option value="Data Structures">Data Structures</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Database Systems">Database Systems</option>
            <option value="Software Engineering">Software Engineering</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">Topic / Sub-chapter</label>
          <input
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="e.g. Binary Search Trees"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">Difficulty Level</label>
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value as any)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-600"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">Question Count</label>
          <select
            value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-600"
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
            className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>AI Engine Draft Processing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Generate Quiz Draft Now</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
