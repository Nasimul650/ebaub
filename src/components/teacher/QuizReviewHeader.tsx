'use client';

import React from 'react';
import { Save, Check } from 'lucide-react';

interface Props {
  quizTitle: string;
  setQuizTitle: (v: string) => void;
  published: boolean;
  onPublish: () => void;
}

export default function QuizReviewHeader({ quizTitle, setQuizTitle, published, onPublish }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
      <div>
        <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Step 2: Teacher Review & Edit</div>
        <input
          type="text"
          value={quizTitle}
          onChange={e => setQuizTitle(e.target.value)}
          className="text-lg font-bold text-slate-900 bg-transparent border-b border-slate-300 focus:outline-none focus:border-emerald-600 mt-1 w-full"
        />
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onPublish}
          disabled={published}
          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow flex items-center gap-2 transition-colors disabled:opacity-60"
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
  );
}
