'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { QuizQuestion } from '@/types';

interface Props {
  questions: QuizQuestion[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

export default function QuestionEditorList({ questions, onDelete, onUpdate }: Props) {
  return (
    <div className="space-y-6">
      {questions.map((q, idx) => (
        <div key={q.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                {idx + 1}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                {q.type}
              </span>
            </div>

            <button
              onClick={() => onDelete(q.id)}
              className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600"
              title="Remove Question"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-[11px] text-slate-600 font-semibold mb-1">Question Statement:</label>
            <input
              type="text"
              value={q.question}
              onChange={e => onUpdate(q.id, e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {q.options && (
            <div className="space-y-2 pt-1">
              <span className="text-[11px] text-slate-600 font-semibold">Options:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt, oIdx) => (
                  <div
                    key={oIdx}
                    className={`p-2.5 rounded-xl border text-xs ${
                      opt === q.correctAnswer
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    {opt === q.correctAnswer && <span className="text-emerald-600 font-bold mr-1">✓</span>}
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-[11px] space-y-1">
            <span className="font-bold text-slate-900">Correct Answer / Explanation:</span>
            <p className="text-slate-600">{q.explanation}</p>
          </div>

        </div>
      ))}
    </div>
  );
}
