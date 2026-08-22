'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, BookOpen, Bell, Newspaper, Calendar, User, ArrowRight, Command, ShieldCheck, Sparkles } from 'lucide-react';
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

  // Handle Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or state trigger
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-start justify-center p-4 sm:pt-20 animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Command Search Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/90">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search (e.g. CSE, notices, faculty, admissions)..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
            <Command className="w-3 h-3" /> K
          </kbd>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results / Navigation Shortcuts */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6 text-xs">
          
          {/* Quick Navigation Commands */}
          {!query.trim() && (
            <div className="space-y-4">
              <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Quick Navigation Commands</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => navigateTo('/academics')}
                  className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-left flex items-center justify-between text-slate-200 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2 font-semibold">
                    <BookOpen className="w-4 h-4 text-emerald-400" /> Academic Programs
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => navigateTo('/notices')}
                  className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-left flex items-center justify-between text-slate-200 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2 font-semibold">
                    <Bell className="w-4 h-4 text-amber-400" /> Notice Board
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => navigateTo('/faculty')}
                  className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-left flex items-center justify-between text-slate-200 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2 font-semibold">
                    <User className="w-4 h-4 text-sky-400" /> Faculty Directory
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => navigateTo('/admissions')}
                  className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-left flex items-center justify-between text-slate-200 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-purple-400" /> Admissions Office
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>

              <div className="pt-2 text-center text-slate-500">
                Type keywords like <span className="text-amber-400 font-semibold font-mono">"CSE"</span>, <span className="text-emerald-400 font-semibold font-mono">"Anniversary"</span>, or <span className="text-sky-400 font-semibold font-mono">"Exam"</span> to search campus records.
              </div>
            </div>
          )}

          {query.trim() && !loading && !hasResults && (
            <div className="text-center py-8 text-slate-400">
              No matching information found for "{query}".
            </div>
          )}

          {/* Programs */}
          {results.programs.length > 0 && (
            <div>
              <div className="font-semibold text-emerald-400 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Programs
              </div>
              <div className="space-y-1.5">
                {results.programs.map(p => (
                  <button
                    key={p.id}
                    onClick={() => navigateTo('/academics')}
                    className="w-full text-left p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/40 transition-colors"
                  >
                    <div className="font-bold text-white text-sm">{p.title}</div>
                    <div className="text-slate-400 text-xs mt-0.5 line-clamp-1">{p.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notices */}
          {results.notices.length > 0 && (
            <div>
              <div className="font-semibold text-amber-400 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" /> Notices
              </div>
              <div className="space-y-1.5">
                {results.notices.map(n => (
                  <button
                    key={n.id}
                    onClick={() => navigateTo(`/notices/${n.slug}`)}
                    className="w-full text-left p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/40 transition-colors"
                  >
                    <div className="font-semibold text-amber-300 flex items-center justify-between">
                      <span>{n.title}</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">{n.category}</span>
                    </div>
                    <div className="text-slate-400 text-xs mt-0.5 line-clamp-1">{n.summary}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Faculty */}
          {results.faculty.length > 0 && (
            <div>
              <div className="font-semibold text-sky-400 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Faculty Members
              </div>
              <div className="space-y-1.5">
                {results.faculty.map(f => (
                  <button
                    key={f.id}
                    onClick={() => navigateTo('/faculty')}
                    className="w-full text-left p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/40 transition-colors"
                  >
                    <div className="font-bold text-white">{f.name}</div>
                    <div className="text-slate-400 text-xs">{f.designation}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Command Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 text-[11px] text-slate-500 flex justify-between">
          <span>Use <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-mono">ESC</kbd> to close</span>
          <span>EBAUB Command Center</span>
        </div>

      </div>
    </div>
  );
}
