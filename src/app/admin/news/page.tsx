import React from 'react';
import Link from 'next/link';
import { Newspaper, Plus, Trash2 } from 'lucide-react';
import { getLatestNews } from '@/utils/supabase/queries';
import { deleteNews } from '@/app/actions/cms';

// We fetch more news for the admin page
export default async function AdminNewsPage() {
  // Pass a larger limit for the admin dashboard
  const newsList = await getLatestNews(50);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 heading-display flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-campus-800" /> News & Press Release CMS
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage and publish press releases and campus news</p>
        </div>
        <Link 
          href="/admin/news/create"
          className="flex items-center gap-2 px-4 py-2 bg-campus-800 hover:bg-campus-900 text-white text-sm font-bold rounded-xl transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          Create Article
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden text-xs shadow-xs">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-900">
          Published Articles ({newsList.length})
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-campus-50 text-slate-500 border-b border-slate-200 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Published Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {newsList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No articles found. Click "Create Article" to write one.
                  </td>
                </tr>
              ) : (
                newsList.map(item => (
                  <tr key={item.id} className="hover:bg-campus-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{item.title}</td>
                    <td className="p-4 text-slate-500">
                      <span className="bg-slate-100 px-2 py-1 rounded-md text-[10px] uppercase font-bold text-slate-600">
                        {item.category || 'News'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <Link
                        href={`/admin/news/${item.id}/edit`}
                        className="p-1.5 rounded bg-campus-50 text-campus-700 hover:bg-campus-100 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </Link>
                      <form action={deleteNews} className="inline-block">
                        <input type="hidden" name="id" value={item.id} />
                        <button
                          type="submit"
                          className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
