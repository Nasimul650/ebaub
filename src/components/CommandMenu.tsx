'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { Search, FileText, User, BookOpen, Bell, Newspaper, Loader2, ArrowRight } from 'lucide-react';
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
          padding: 0.5rem;
        }
        [cmdk-empty] {
          padding: 3rem;
          text-align: center;
          color: #64748b;
          font-size: 0.875rem;
        }
        [cmdk-group-heading] {
          padding: 0.5rem 0.75rem;
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
        }
        [cmdk-item][data-selected="true"] {
          background: #f8fafc;
          color: #0f172a;
        }
      `}} />
      <Command.Dialog 
        open={open} 
        onOpenChange={setOpen}
        label="Global Search"
        shouldFilter={false} // We handle filtering on backend
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Command.Input 
            value={query}
            onValueChange={setQuery}
            placeholder="Search programs, faculties, notices..." 
          />
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

          {!loading && results.length > 0 && (
            <>
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
            </>
          )}
        </Command.List>
      </Command.Dialog>
    </>
  );
}
