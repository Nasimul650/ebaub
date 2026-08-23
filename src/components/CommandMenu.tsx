'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { Search, FileText, User, BookOpen, Bell, Newspaper, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useDebounce } from 'use-debounce';

type SearchResult = {
  id: string;
  title: string;
  type: string;
  url: string;
};

export default function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Fetch results when debounced query changes
  useEffect(() => {
    async function search() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();
        setResults(data || []);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    }
    search();
  }, [debouncedQuery]);

  const handleSelect = (url: string) => {
    setOpen(false);
    setQuery('');
    router.push(url);
  };

  const programs = results.filter((r) => r.type === 'Program');
  const faculties = results.filter((r) => r.type === 'Faculty');
  const notices = results.filter((r) => r.type === 'Notice');
  const news = results.filter((r) => r.type === 'News');

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        [cmdk-overlay] {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          z-index: 100;
        }
        [cmdk-dialog] {
          position: fixed;
          top: 15%;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 640px;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          z-index: 101;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          font-family: inherit;
        }
        [cmdk-input] {
          width: 100%;
          padding: 1.25rem 1rem 1.25rem 3rem;
          font-size: 1rem;
          border: none;
          outline: none;
          background: transparent;
          border-bottom: 1px solid #e2e8f0;
          color: #0f172a;
        }
        [cmdk-input]::placeholder {
          color: #94a3b8;
        }
        [cmdk-list] {
          max-height: 400px;
          overflow-y: auto;
          background: #f8fafc;
        }
        [cmdk-empty] {
          padding: 3rem;
          text-align: center;
          color: #64748b;
          font-size: 0.875rem;
        }
        [cmdk-group-heading] {
          padding: 1rem 1rem 0.5rem 1rem;
          font-size: 0.7rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        [cmdk-item] {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          color: #334155;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.15s ease;
          margin: 0 0.5rem;
        }
        [cmdk-item][data-selected="true"] {
          background: #e2e8f0;
          color: #0f172a;
        }
        .custom-nav-item[data-selected="true"] {
          transform: scale(1.02);
        }
      `}} />
      <Command.Dialog 
        open={open} 
        onOpenChange={setOpen}
        label="Global Search"
        shouldFilter={false}
      >
        <div className="relative bg-white z-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Command.Input 
            value={query}
            onValueChange={setQuery}
            placeholder="Type a command or search (e.g. CSE, notices, faculty, admissions)..." 
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <kbd className="hidden sm:inline-flex items-center gap-1 bg-slate-100 text-slate-500 px-2 py-1 rounded text-[10px] font-semibold border border-slate-200">
              <span className="text-xs">⌘</span>K
            </kbd>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-slate-100 rounded text-slate-400 transition-colors">
              <ArrowRight className="w-4 h-4 rotate-45" style={{ display: 'none' }} />
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </button>
          </div>
        </div>
        
        <Command.List>
          {loading && (
            <div className="p-8 text-center text-slate-500 flex justify-center items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-campus-700" />
              <span>Searching EBAUB...</span>
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <Command.Empty>No results found for "{query}".</Command.Empty>
          )}

          {!loading && !query && (
            <div className="p-4 sm:p-6">
              <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-4 px-2">Quick Navigation Commands</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <Command.Item value="nav-academics" onSelect={() => handleSelect('/academics')} className="custom-nav-item !m-0 !p-4 !rounded-2xl !bg-white hover:!border-campus-200 !border !border-slate-200 flex items-center justify-between shadow-sm group">
                  <span className="flex items-center gap-3 font-semibold text-slate-900 group-hover:text-campus-800">
                    <BookOpen className="w-5 h-5 text-campus-700" /> Academic Programs
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-campus-700 group-hover:translate-x-1 transition-transform" />
                </Command.Item>

                <Command.Item value="nav-notices" onSelect={() => handleSelect('/notices')} className="custom-nav-item !m-0 !p-4 !rounded-2xl !bg-white hover:!border-amber-200 !border !border-slate-200 flex items-center justify-between shadow-sm group">
                  <span className="flex items-center gap-3 font-semibold text-slate-900 group-hover:text-amber-700">
                    <Bell className="w-5 h-5 text-amber-500" /> Notice Board
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-transform" />
                </Command.Item>

                <Command.Item value="nav-faculty" onSelect={() => handleSelect('/faculty')} className="custom-nav-item !m-0 !p-4 !rounded-2xl !bg-white hover:!border-blue-200 !border !border-slate-200 flex items-center justify-between shadow-sm group">
                  <span className="flex items-center gap-3 font-semibold text-slate-900 group-hover:text-blue-700">
                    <User className="w-5 h-5 text-blue-500" /> Faculty Directory
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-transform" />
                </Command.Item>

                <Command.Item value="nav-admissions" onSelect={() => handleSelect('/admissions')} className="custom-nav-item !m-0 !p-4 !rounded-2xl !bg-white hover:!border-purple-200 !border !border-slate-200 flex items-center justify-between shadow-sm group">
                  <span className="flex items-center gap-3 font-semibold text-slate-900 group-hover:text-purple-700">
                    <ShieldCheck className="w-5 h-5 text-purple-500" /> Admissions Office
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-transform" />
                </Command.Item>
              </div>

              <div className="text-center text-xs text-slate-400">
                Type keywords like <span className="text-campus-800 font-semibold font-mono">"CSE"</span>, <span className="text-amber-700 font-semibold font-mono">"Anniversary"</span>, or <span className="text-blue-700 font-semibold font-mono">"Exam"</span> to search campus records.
              </div>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="pb-2">
              {programs.length > 0 && (
                <Command.Group heading="Academic Programs">
                  {programs.map((item) => (
                    <Command.Item key={item.id} value={item.id} onSelect={() => handleSelect(item.url)}>
                      <BookOpen className="w-4 h-4 text-campus-600" />
                      {item.title}
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {faculties.length > 0 && (
                <Command.Group heading="Faculties & Departments">
                  {faculties.map((item) => (
                    <Command.Item key={item.id} value={item.id} onSelect={() => handleSelect(item.url)}>
                      <User className="w-4 h-4 text-blue-600" />
                      {item.title}
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {notices.length > 0 && (
                <Command.Group heading="Official Notices">
                  {notices.map((item) => (
                    <Command.Item key={item.id} value={item.id} onSelect={() => handleSelect(item.url)}>
                      <Bell className="w-4 h-4 text-amber-600" />
                      {item.title}
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {news.length > 0 && (
                <Command.Group heading="Campus News">
                  {news.map((item) => (
                    <Command.Item key={item.id} value={item.id} onSelect={() => handleSelect(item.url)}>
                      <Newspaper className="w-4 h-4 text-slate-600" />
                      {item.title}
                    </Command.Item>
                  ))}
                </Command.Group>
              )}
            </div>
          )}
        </Command.List>

        <div className="p-3 border-t border-slate-200 bg-white text-[11px] text-slate-400 flex justify-between items-center">
          <span>Use <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-mono border border-slate-200">ESC</kbd> to close</span>
          <span>EBAUB Command Center</span>
        </div>
      </Command.Dialog>
    </>
  );
}
