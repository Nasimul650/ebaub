import React from 'react';
import Link from 'next/link';
import { Sparkles, BookOpenCheck, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getQuizzes, getTeachingMaterials } from '@/lib/mock/mockServices';

export default async function TeacherDashboard() {
  const [quizzes, materials] = await Promise.all([
    getQuizzes(),
    getTeachingMaterials()
  ]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 space-y-3">
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
          Teacher Workspace & AI Tools
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Welcome back, Sabrina Chowdhury!
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Use the AI Question / Quiz Generator to build instant quizzes for your classes, upload course materials, and manage student assessments.
        </p>
        <div className="pt-2">
          <Link
            href="/teacher/ai"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
          >
            <Sparkles className="w-4 h-4" /> Open AI Question Generator &rarr;
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="text-xs font-semibold text-slate-400">Generated AI Quizzes</div>
          <div className="text-3xl font-extrabold text-amber-400">{quizzes.length} Quizzes</div>
          <Link href="/teacher/ai" className="text-xs text-amber-400 font-bold hover:underline flex items-center gap-1 pt-2">
            Generate New Quiz &rarr;
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="text-xs font-semibold text-slate-400">Published Materials</div>
          <div className="text-3xl font-extrabold text-emerald-400">{materials.length} Documents</div>
          <Link href="/teacher/materials" className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1 pt-2">
            Upload Material &rarr;
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="text-xs font-semibold text-slate-400">Assigned Courses</div>
          <div className="text-3xl font-extrabold text-white">2 Courses</div>
          <Link href="/teacher/teaching" className="text-xs text-sky-400 font-bold hover:underline flex items-center gap-1 pt-2">
            View Courses &rarr;
          </Link>
        </div>
      </div>

      {/* Recent Generated Quizzes */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> Recent AI-Generated Quizzes
          </h2>
          <Link href="/teacher/ai" className="text-xs text-amber-400 font-bold hover:underline">
            Launch Generator
          </Link>
        </div>

        <div className="space-y-4">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-amber-400 font-bold">{quiz.subject}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 font-medium">Difficulty: {quiz.difficulty}</span>
                </div>
                <h3 className="font-bold text-white text-sm mt-1">{quiz.title}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{quiz.questions.length} Questions generated for topic: {quiz.topic}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                  Published
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
