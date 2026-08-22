import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, User, Newspaper } from 'lucide-react';
import { getNewsBySlug } from '@/lib/mock/mockServices';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      
      <Link href="/news" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to News Archive
      </Link>

      <article className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs space-y-8 p-6 sm:p-10">
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs">
            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
              {item.category}
            </span>
            <span className="text-slate-500">
              By {item.authorName}
            </span>
            <span className="text-slate-500 font-medium">
              Published: {new Date(item.publishedAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 heading-display leading-tight">
            {item.title}
          </h1>

          <p className="text-sm text-slate-700 font-medium leading-relaxed border-l-2 border-emerald-600 pl-4 py-1">
            {item.summary}
          </p>
        </div>

        {item.coverImage && (
          <div className="rounded-2xl overflow-hidden max-h-[450px]">
            <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-line border-t border-slate-100 pt-6">
          {item.content}
        </div>

      </article>

    </div>
  );
}
