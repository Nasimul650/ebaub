import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createNews } from '@/app/actions/cms';
import NewsForm from '@/components/admin/NewsForm';

export default function NewNewsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/news" 
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Publish News</h1>
          <p className="text-sm text-slate-500 font-medium">Create a new article for the campus newsfeed.</p>
        </div>
      </div>

      <NewsForm action={createNews} />
    </div>
  );
}
