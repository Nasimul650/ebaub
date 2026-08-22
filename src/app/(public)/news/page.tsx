import React from 'react';
import Link from 'next/link';
import { Newspaper, Calendar, User, ArrowRight } from 'lucide-react';
import { getNews } from '@/lib/mock/mockServices';

export default async function NewsPage() {
  const newsList = await getNews();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          University News & Press Releases
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          EBAUB Stories, Achievements & Research News
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Read the latest stories regarding departmental updates, faculty awards, student tech accomplishments, and campus breakthroughs.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {newsList.map(item => (
          <Link
            key={item.id}
            href={`/news/${item.slug}`}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all flex flex-col justify-between group"
          >
            {item.coverImage && (
              <div className="h-56 relative overflow-hidden">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-amber-400 font-semibold">{item.category}</span>
                  <span>•</span>
                  <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {item.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>Read Full Article</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
