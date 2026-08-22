import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { NewsItem } from '@/types';

export default function NewsDetailView({ item }: { item: NewsItem }) {
  return (
    <div className="space-y-8">
      <Link href="/news" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to News Archive
      </Link>

      <article className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs">
            <span className="px-3 py-1 rounded-full bg-campus-50 border border-campus-200 text-campus-900 font-bold">
              {item.category}
            </span>
            <span className="text-slate-500">
              By {item.authorName}
            </span>
            <span className="text-slate-500 font-medium">
              Published: {new Date(item.publishedAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 heading-display leading-tight">
            {item.title}
          </h1>

          <p className="text-base text-slate-700 font-medium leading-relaxed border-l-2 border-campus-700 pl-4 py-1">
            {item.summary}
          </p>
        </div>

        {item.coverImage && (
          <div className="rounded-2xl overflow-hidden max-h-[480px] shadow-lg">
            <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-4 whitespace-pre-line border-t border-slate-100 pt-6">
          {item.content}
        </div>
      </article>
    </div>
  );
}
