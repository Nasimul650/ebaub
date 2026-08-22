'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, BookOpen, Bell, Newspaper, Calendar, User, ArrowRight, Command, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { globalSearch } from '@/lib/mock/mockServices';
import { Program, NoticeItem, NewsItem, FacultyMember, EventItem } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandMenuModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    programs: Program[];
    notices: NoticeItem[];
    news: NewsItem[];
    faculty: FacultyMember[];
    events: EventItem[];
  }>({ programs: [], notices: [], news: [], faculty: [], events: [] });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ programs: [], notices: [], news: [], faculty: [], events: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await globalSearch(query);
      setResults(res);
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const hasResults =
    results.programs.length > 0 ||
    results.notices.length > 0 ||
    results.news.length > 0 ||
    results.faculty.length > 0 ||
    results.events.length > 0;

  const navigateTo = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 backdrop-blur-md flex items-start justify-center p-4 sm:pt-20 animate-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900 animate-modal-zoom">
        
        {/* Command Search Header */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-campus-700 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search (e.g. CSE, notices, faculty, admissions)..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {loading && <Loader2 className="w-4 h-4 animate-spin text-campus-700" />}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-campus-50 text-[10px] text-slate-500 font-mono border border-slate-200 shadow-2xs">
            <Command className="w-3 h-3" /> K
          </kbd>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-campus-50 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results / Navigation Shortcuts */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-6 text-xs bg-campus-50/50">
          
          {/* Quick Navigation Commands */}
          {!query.trim() && (
            <div className="space-y-4">
              <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Quick Navigation Commands</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => navigateTo('/academics')}
                  className="p-3.5 rounded-2xl bg-white hover:bg-campus-50 hover:border-campus-200 border border-slate-200 text-left flex items-center justify-between text-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xs group"
                >
                  <span className="flex items-center gap-2.5 font-semibold text-slate-900 group-hover:text-campus-800">
                    <BookOpen className="w-4 h-4 text-campus-700" /> Academic Programs
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-campus-700 group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => navigateTo('/notices')}
                  className="p-3.5 rounded-2xl bg-white hover:bg-amber-50 hover:border-amber-200 border border-slate-200 text-left flex items-center justify-between text-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xs group"
                >
                  <span className="flex items-center gap-2.5 font-semibold text-slate-900 group-hover:text-amber-700">
                    <Bell className="w-4 h-4 text-amber-600" /> Notice Board
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => navigateTo('/faculty')}
                  className="p-3.5 rounded-2xl bg-white hover:bg-blue-50 hover:border-blue-200 border border-slate-200 text-left flex items-center justify-between text-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xs group"
                >
                  <span className="flex items-center gap-2.5 font-semibold text-slate-900 group-hover:text-blue-700">
                    <User className="w-4 h-4 text-blue-600" /> Faculty Directory
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => navigateTo('/admissions')}
                  className="p-3.5 rounded-2xl bg-white hover:bg-purple-50 hover:border-purple-200 border border-slate-200 text-left flex items-center justify-between text-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xs group"
                >
                  <span className="flex items-center gap-2.5 font-semibold text-slate-900 group-hover:text-purple-700">
                    <ShieldCheck className="w-4 h-4 text-purple-600" /> Admissions Office
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>

              <div className="pt-2 text-center text-slate-400">
                Type keywords like <span className="text-campus-800 font-semibold font-mono">"CSE"</span>, <span className="text-amber-700 font-semibold font-mono">"Anniversary"</span>, or <span className="text-blue-700 font-semibold font-mono">"Exam"</span> to search campus records.
              </div>
            </div>
          )}

          {query.trim() && !loading && !hasResults && (
            <div className="text-center py-8 text-slate-500">
              No matching information found for "{query}".
            </div>
          )}

          {/* Programs */}
          {results.programs.length > 0 && (
            <div className="space-y-2">
              <div className="font-semibold text-campus-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Programs
              </div>
              <div className="space-y-1.5">
                {results.programs.map(p => (
                  <button
                    key={p.id}
                    onClick={() => navigateTo('/academics')}
                    className="w-full text-left p-3.5 rounded-2xl bg-white hover:bg-campus-50 border border-slate-200 hover:border-campus-200 transition-all shadow-2xs hover:scale-[1.01]"
                  >
                    <div className="font-bold text-slate-900 text-sm">{p.title}</div>
                    <div className="text-slate-500 text-xs mt-0.5 line-clamp-1">{p.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notices */}
          {results.notices.length > 0 && (
            <div className="space-y-2">
              <div className="font-semibold text-amber-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" /> Notices
              </div>
              <div className="space-y-1.5">
                {results.notices.map(n => (
                  <button
                    key={n.id}
                    onClick={() => navigateTo(`/notices/${n.slug}`)}
                    className="w-full text-left p-3.5 rounded-2xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-200 transition-all shadow-2xs hover:scale-[1.01]"
                  >
                    <div className="font-semibold text-slate-900 flex items-center justify-between">
                      <span>{n.title}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">{n.category}</span>
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5 line-clamp-1">{n.summary}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Faculty */}
          {results.faculty.length > 0 && (
            <div className="space-y-2">
              <div className="font-semibold text-blue-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Faculty Members
              </div>
              <div className="space-y-1.5">
                {results.faculty.map(f => (
                  <button
                    key={f.id}
                    onClick={() => navigateTo('/faculty')}
                    className="w-full text-left p-3.5 rounded-2xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all shadow-2xs hover:scale-[1.01]"
                  >
                    <div className="font-bold text-slate-900">{f.name}</div>
                    <div className="text-slate-500 text-xs">{f.designation}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Command Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-white text-[11px] text-slate-500 flex justify-between">
          <span>Use <kbd className="px-1.5 py-0.5 bg-campus-50 rounded text-slate-600 font-mono border border-slate-200">ESC</kbd> to close</span>
          <span>EBAUB Command Center</span>
        </div>

      </div>
    </div>
  );
}
