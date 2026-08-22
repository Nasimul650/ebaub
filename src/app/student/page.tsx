import React from 'react';
import Link from 'next/link';
import { BookOpen, FolderDown, Bot, Bell, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { getNotices, getTeachingMaterials } from '@/lib/mock/mockServices';

export default async function StudentDashboard() {
  const [notices, materials] = await Promise.all([
    getNotices(),
    getTeachingMaterials()
  ]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-sky-500/30 space-y-3">
        <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider">
          Student Workspace
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Welcome back, CSE Student!
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Access your enrolled course materials, download class files, and ask your Student AI Study Assistant for conceptual explanations.
        </p>
      </div>

      {/* Quick Action Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="text-xs font-semibold text-slate-400">Available Materials</div>
          <div className="text-3xl font-extrabold text-white">{materials.length} Documents</div>
          <Link href="/student/study" className="text-xs text-sky-400 font-bold hover:underline flex items-center gap-1 pt-2">
            Open Study Hub &rarr;
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="text-xs font-semibold text-slate-400">AI Study Assistant</div>
          <div className="text-3xl font-extrabold text-emerald-400">Ready</div>
          <Link href="/student/ai" className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1 pt-2">
            Launch AI Study Tutor &rarr;
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="text-xs font-semibold text-slate-400">Active Notices</div>
          <div className="text-3xl font-extrabold text-amber-400">{notices.length} Notices</div>
          <Link href="/student/notices" className="text-xs text-amber-400 font-bold hover:underline flex items-center gap-1 pt-2">
            View Announcements &rarr;
          </Link>
        </div>
      </div>

      {/* Course Materials Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-400" /> Recent Course Handouts
          </h2>
          <Link href="/student/study" className="text-xs text-sky-400 font-bold hover:underline">
            View All Materials
          </Link>
        </div>

        <div className="space-y-3">
          {materials.map(mat => (
            <div key={mat.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-sky-300">{mat.subject}</div>
                <div className="text-sm font-semibold text-white mt-0.5">{mat.title}</div>
                <div className="text-[11px] text-slate-400 mt-1">Instructor: {mat.teacherName}</div>
              </div>
              <button className="px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow">
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
