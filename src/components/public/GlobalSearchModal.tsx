'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, BookOpen, Bell, Newspaper, Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import { globalSearch } from '@/lib/mock/mockServices';
import { Program, NoticeItem, NewsItem, FacultyMember, EventItem } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: Props) {
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
    if (!query.trim()) {
      setResults({ programs: [], notices: [], news: [], faculty: [], events: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await globalSearch(query);
      setResults(res);
      setLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const hasResults =
    results.programs.length > 0 ||
    results.notices.length > 0 ||
    results.news.length > 0 ||
    results.faculty.length > 0 ||
    results.events.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-start justify-center p-4 sm:pt-20 animate-in fade-in">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900">
        
        {/* Search Bar Header */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-campus-700 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search programs, CSE department, notices, faculty, news..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {loading && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-campus-50 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6 text-xs bg-campus-50/50">
          
          {!query.trim() && (
            <div className="text-center py-8 text-slate-500 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-400" />
              <p>Type to search official EBAUB digital assets</p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <button onClick={() => setQuery('CSE')} className="px-2.5 py-1 rounded-md bg-white hover:bg-campus-50 border border-slate-200 text-slate-700">CSE</button>
                <button onClick={() => setQuery('Notice')} className="px-2.5 py-1 rounded-md bg-white hover:bg-campus-50 border border-slate-200 text-slate-700">Notices</button>
                <button onClick={() => setQuery('B.Sc')} className="px-2.5 py-1 rounded-md bg-white hover:bg-campus-50 border border-slate-200 text-slate-700">B.Sc. Programs</button>
                <button onClick={() => setQuery('Anniversary')} className="px-2.5 py-1 rounded-md bg-white hover:bg-amber-50 border border-amber-200 text-amber-800">Anniversary</button>
              </div>
            </div>
          )}

          {query.trim() && !loading && !hasResults && (
            <div className="text-center py-8 text-slate-500">
              No matching information found for "{query}".
            </div>
          )}

          {/* Academic Programs */}
          {results.programs.length > 0 && (
            <div>
              <h4 className="font-semibold text-campus-900 uppercase tracking-wider text-[11px] mb-2.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Academic Programs
              </h4>
              <div className="space-y-2">
                {results.programs.map(p => (
                  <Link
                    key={p.id}
                    href={`/academics`}
                    onClick={onClose}
                    className="block p-3 rounded-xl bg-white hover:bg-campus-50 border border-slate-200 transition-colors"
                  >
                    <div className="font-bold text-slate-900 text-sm">{p.title}</div>
                    <div className="text-slate-500 text-xs mt-1">{p.description}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Notices */}
          {results.notices.length > 0 && (
            <div>
              <h4 className="font-semibold text-amber-800 uppercase tracking-wider text-[11px] mb-2.5 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" /> Official Notices
              </h4>
              <div className="space-y-2">
                {results.notices.map(n => (
                  <Link
                    key={n.id}
                    href={`/notices/${n.slug}`}
                    onClick={onClose}
                    className="block p-3 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 transition-colors"
                  >
                    <div className="font-semibold text-slate-900 flex items-center justify-between">
                      <span>{n.title}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">{n.category}</span>
                    </div>
                    <div className="text-slate-500 text-xs mt-1 line-clamp-1">{n.summary}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Faculty Members */}
          {results.faculty.length > 0 && (
            <div>
              <h4 className="font-semibold text-blue-800 uppercase tracking-wider text-[11px] mb-2.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Faculty Members
              </h4>
              <div className="space-y-2">
                {results.faculty.map(f => (
                  <Link
                    key={f.id}
                    href={`/faculty`}
                    onClick={onClose}
                    className="block p-3 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 transition-colors"
                  >
                    <div className="font-bold text-slate-900">{f.name}</div>
                    <div className="text-slate-500 text-xs">{f.designation}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* News & Achievements */}
          {results.news.length > 0 && (
            <div>
              <h4 className="font-semibold text-purple-800 uppercase tracking-wider text-[11px] mb-2.5 flex items-center gap-1.5">
                <Newspaper className="w-3.5 h-3.5" /> News & Media
              </h4>
              <div className="space-y-2">
                {results.news.map(nw => (
                  <Link
                    key={nw.id}
                    href={`/news/${nw.slug}`}
                    onClick={onClose}
                    className="block p-3 rounded-xl bg-white hover:bg-purple-50 border border-slate-200 transition-colors"
                  >
                    <div className="font-semibold text-slate-900">{nw.title}</div>
                    <div className="text-slate-500 text-xs mt-1 line-clamp-1">{nw.summary}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-200 bg-white text-[11px] text-slate-500 flex justify-between">
          <span>Press <kbd className="px-1.5 py-0.5 bg-campus-50 rounded text-slate-600 border border-slate-200">ESC</kbd> to close</span>
          <span>EBAUB Search Engine</span>
        </div>

      </div>
    </div>
  );
}
