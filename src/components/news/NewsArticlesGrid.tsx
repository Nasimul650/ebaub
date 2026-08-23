import React from 'react';
import Link from 'next/link';
import { ArrowRight, Newspaper } from 'lucide-react';
import { NewsItem } from '@/utils/supabase/queries';

interface Props {
  news: NewsItem[];
}

export default function NewsArticlesGrid({ news }: Props) {
  if (!news || news.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
        No news articles have been published yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {news.map(item => (
        <Link
          key={item.id}
          href={`/news/${item.id}`}
          className="clean-card bg-white rounded-3xl overflow-hidden flex flex-col justify-between group shadow-xl hover:translate-y-[-2px] transition-transform border border-slate-200/80"
        >
          {item.image_url ? (
            <div className="h-60 relative overflow-hidden bg-slate-100">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ) : (
            <div className="h-48 relative overflow-hidden bg-campus-50 flex items-center justify-center border-b border-campus-100">
              <Newspaper className="w-12 h-12 text-campus-200" />
            </div>
          )}

          <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-campus-100 text-slate-700 border border-slate-200">
                  {item.category || 'News'}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-campus-800 transition-colors leading-snug">
                {item.title}
              </h3>
              {item.summary && (
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {item.summary}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-campus-800">
              <span>Read Full Article</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
