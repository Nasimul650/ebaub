import React from 'react';
import Link from 'next/link';
import { ArrowRight, Newspaper, AlertCircle } from 'lucide-react';
import { NewsItem } from '@/utils/supabase/queries';

export default function HomeNewsGridSection({ news }: { news: NewsItem[] }) {
  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-amber-700">Latest Updates</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 heading-display mt-1">
            Campus News & Highlights
          </h2>
        </div>
        <Link href="/news" className="text-xs font-bold text-slate-900 hover:text-campus-800 flex items-center gap-1.5 transition-colors">
          <span>View All News</span>
          <ArrowRight className="w-4 h-4 text-campus-700" />
        </Link>
      </div>

      {!news || news.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-slate-100 rounded-2xl text-center">
          <AlertCircle className="w-8 h-8 text-slate-400 mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No recent news</h3>
          <p className="text-xs text-slate-500 mt-1">Check back later for updates from the campus.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map(article => (
            <Link
              key={article.id}
              href={`/news/${article.id}`}
              className="rounded-2xl bg-white border border-slate-200/80 shadow-xl hover:translate-y-[-2px] transition-transform group block overflow-hidden flex flex-col"
            >
              {article.image_url ? (
                <div className="w-full h-48 bg-slate-200 relative overflow-hidden">
                  <img 
                    src={article.image_url} 
                    alt={article.title} 
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-campus-50 flex items-center justify-center border-b border-campus-100 relative overflow-hidden">
                  <Newspaper className="w-12 h-12 text-campus-200" />
                </div>
              )}
              
              <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-campus-100 text-slate-700 border border-slate-200">
                    {article.category || 'News'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(article.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-extrabold text-lg text-slate-900 leading-snug group-hover:text-campus-800 transition-colors">
                  {article.title}
                </h3>
                
                {article.summary && (
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 flex-1">
                    {article.summary}
                  </p>
                )}
                
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-campus-800 mt-auto">
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
