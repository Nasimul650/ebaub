import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { QuizGeneration } from '@/types';

interface Props {
  quizzes: QuizGeneration[];
}

export default function RecentQuizzesList({ quizzes }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-campus-500" /> Recent AI-Generated Quizzes
        </h2>
        <Link href="/teacher/ai" className="text-xs text-amber-700 font-bold hover:underline">
          Launch Generator
        </Link>
      </div>

      <div className="space-y-4">
        {quizzes.map(quiz => (
          <div key={quiz.id} className="p-4 rounded-2xl bg-campus-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-campus-800 font-bold">{quiz.subject}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 font-medium">Difficulty: {quiz.difficulty}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mt-1">{quiz.title}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{quiz.questions.length} Questions generated for topic: {quiz.topic}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-campus-100 text-campus-900 text-xs font-bold">
                Published
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
