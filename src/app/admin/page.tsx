import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Bell, 
  Newspaper, 
  Calendar, 
  BookOpen, 
  Plus, 
  ArrowRight,
  Database
} from 'lucide-react';
import { getNotices, getNews, getEvents, getPrograms } from '@/lib/mock/mockServices';

export default async function CMSDashboardPage() {
  const [notices, news, events, programs] = await Promise.all([
    getNotices(),
    getNews(),
    getEvents(),
    getPrograms()
  ]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/40 space-y-3">
        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
          <ShieldCheck className="w-4 h-4" /> EBAUB Custom Headless CMS
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Content Management Control Panel
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Manage public university notices, news releases, campus events, degree programs, and media assets without touching source code.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Notices</span>
            <Bell className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{notices.length}</div>
          <Link href="/admin/notices" className="text-xs text-amber-400 font-bold hover:underline flex items-center gap-1">
            Manage Notices &rarr;
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">News Articles</span>
            <Newspaper className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{news.length}</div>
          <Link href="/admin/news" className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1">
            Manage News &rarr;
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Campus Events</span>
            <Calendar className="w-5 h-5 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{events.length}</div>
          <Link href="/admin/events" className="text-xs text-sky-400 font-bold hover:underline flex items-center gap-1">
            Manage Events &rarr;
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Programs Offered</span>
            <BookOpen className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{programs.length}</div>
          <Link href="/admin/programs" className="text-xs text-purple-400 font-bold hover:underline flex items-center gap-1">
            Manage Programs &rarr;
          </Link>
        </div>

      </div>

      {/* Quick CMS Shortcuts */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Database className="w-5 h-5 text-amber-400" /> CMS Entity Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/notices"
            className="p-5 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition-colors space-y-2 group"
          >
            <div className="font-bold text-white text-sm group-hover:text-amber-400 flex items-center justify-between">
              <span>Publish Official Notice</span>
              <Plus className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xs text-slate-400">Create urgent circulars or academic notices</p>
          </Link>

          <Link
            href="/admin/news"
            className="p-5 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition-colors space-y-2 group"
          >
            <div className="font-bold text-white text-sm group-hover:text-emerald-400 flex items-center justify-between">
              <span>Publish News Story</span>
              <Plus className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-slate-400">Add press releases and research achievements</p>
          </Link>

          <Link
            href="/admin/events"
            className="p-5 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition-colors space-y-2 group"
          >
            <div className="font-bold text-white text-sm group-hover:text-sky-400 flex items-center justify-between">
              <span>Add Campus Event</span>
              <Plus className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-xs text-slate-400">Schedule ceremony dates and tech workshops</p>
          </Link>
        </div>
      </div>

    </div>
  );
}
