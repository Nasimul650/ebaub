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
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
        <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
          <ShieldCheck className="w-4 h-4 text-amber-600" /> EBAUB Custom Headless CMS
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-display">
          Content Management Control Panel
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Manage public university notices, news releases, campus events, degree programs, and media assets without touching source code.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Notices</span>
            <Bell className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 heading-display">{notices.length}</div>
          <Link href="/admin/notices" className="text-xs text-amber-700 font-bold hover:underline flex items-center gap-1">
            Manage Notices &rarr;
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">News Articles</span>
            <Newspaper className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 heading-display">{news.length}</div>
          <Link href="/admin/news" className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1">
            Manage News &rarr;
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Campus Events</span>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 heading-display">{events.length}</div>
          <Link href="/admin/events" className="text-xs text-blue-700 font-bold hover:underline flex items-center gap-1">
            Manage Events &rarr;
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Programs Offered</span>
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 heading-display">{programs.length}</div>
          <Link href="/admin/programs" className="text-xs text-purple-700 font-bold hover:underline flex items-center gap-1">
            Manage Programs &rarr;
          </Link>
        </div>

      </div>

      {/* Quick CMS Shortcuts */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Database className="w-5 h-5 text-amber-600" /> CMS Entity Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/notices"
            className="p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors space-y-2 group block"
          >
            <div className="font-bold text-slate-900 text-sm group-hover:text-amber-700 flex items-center justify-between">
              <span>Publish Official Notice</span>
              <Plus className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xs text-slate-500">Create urgent circulars or academic notices</p>
          </Link>

          <Link
            href="/admin/news"
            className="p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors space-y-2 group block"
          >
            <div className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 flex items-center justify-between">
              <span>Publish News Story</span>
              <Plus className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs text-slate-500">Add press releases and research achievements</p>
          </Link>

          <Link
            href="/admin/events"
            className="p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors space-y-2 group block"
          >
            <div className="font-bold text-slate-900 text-sm group-hover:text-blue-700 flex items-center justify-between">
              <span>Add Campus Event</span>
              <Plus className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs text-slate-500">Schedule ceremony dates and tech workshops</p>
          </Link>
        </div>
      </div>

    </div>
  );
}
