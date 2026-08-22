import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { NewsItem } from '@/types';

interface Props {
  news: NewsItem[];
}

export default function NewsArticlesGrid({ news }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {news.map(item => (
        <Link
          key={item.id}
          href={`/news/${item.slug}`}
          className="clean-card bg-white rounded-3xl overflow-hidden flex flex-col justify-between group"
        >
          {item.coverImage && (
            <div className="h-60 relative overflow-hidden">
              <img
                src={item.coverImage}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="text-emerald-700 font-bold">{item.category}</span>
                <span>•</span>
                <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {item.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>Read Full Article</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
