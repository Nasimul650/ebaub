import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { NewsItem } from '@/utils/supabase/queries';

export default function NewsDetailView({ item }: { item: NewsItem & { content?: string } }) {
  return (
    <div className="space-y-8">
      <Link href="/news" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to News Archive
      </Link>

      <article className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs">
            <span className="px-3 py-1 rounded-full bg-campus-50 border border-campus-200 text-campus-900 font-bold">
              {item.category || 'News'}
            </span>
            <span className="text-slate-500 font-medium">
              Published: {new Date(item.created_at).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 heading-display leading-tight">
            {item.title}
          </h1>

          {item.summary && (
            <p className="text-base text-slate-700 font-medium leading-relaxed border-l-2 border-campus-700 pl-4 py-1">
              {item.summary}
            </p>
          )}
        </div>

        {item.image_url && (
          <div className="rounded-2xl overflow-hidden max-h-[480px] shadow-lg">
            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-4 whitespace-pre-line border-t border-slate-100 pt-6">
          {item.content || "No content provided."}
        </div>
      </article>
    </div>
  );
}
