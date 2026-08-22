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
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider">
          Student Workspace
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-display">
          Welcome back, CSE Student!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Access your enrolled course materials, download class files, and ask your Student AI Study Assistant for conceptual explanations.
        </p>
      </div>

      {/* Quick Action Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-2 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Available Materials</div>
          <div className="text-3xl font-extrabold text-slate-900 heading-display">{materials.length} Documents</div>
          <Link href="/student/study" className="text-xs text-blue-700 font-bold hover:underline flex items-center gap-1 pt-2">
            Open Study Hub &rarr;
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-2 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">AI Study Assistant</div>
          <div className="text-3xl font-extrabold text-emerald-700 heading-display">Ready</div>
          <Link href="/student/ai" className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1 pt-2">
            Launch AI Study Tutor &rarr;
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-2 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Active Notices</div>
          <div className="text-3xl font-extrabold text-amber-700 heading-display">{notices.length} Notices</div>
          <Link href="/student/notices" className="text-xs text-amber-700 font-bold hover:underline flex items-center gap-1 pt-2">
            View Announcements &rarr;
          </Link>
        </div>
      </div>

      {/* Course Materials Preview */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" /> Recent Course Handouts
          </h2>
          <Link href="/student/study" className="text-xs text-blue-700 font-bold hover:underline">
            View All Materials
          </Link>
        </div>

        <div className="space-y-3">
          {materials.map(mat => (
            <div key={mat.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-blue-700">{mat.subject}</div>
                <div className="text-sm font-semibold text-slate-900 mt-0.5">{mat.title}</div>
                <div className="text-[11px] text-slate-500 mt-1">Instructor: {mat.teacherName}</div>
              </div>
              <button className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs">
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
