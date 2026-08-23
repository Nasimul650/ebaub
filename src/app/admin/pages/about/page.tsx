import React from 'react';
import { getPageBySlug } from '@/utils/supabase/queries';
import PageBlockBuilder from '@/components/admin/page-builder/PageBlockBuilder';

export default async function AboutPageAdmin() {
  const page = await getPageBySlug('about');

  if (!page) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h1>
        <p className="text-slate-600">The page with slug "about" does not exist in the database.</p>
      </div>
    );
  }

  let blocks = page.content_blocks || [];
  if (typeof blocks === 'string') {
    try {
      blocks = JSON.parse(blocks);
    } catch (e) {
      blocks = [];
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Edit Page: {page.title}</h1>
        <p className="text-slate-600 mt-1">Manage the content blocks for the about page.</p>
      </div>

      <PageBlockBuilder initialBlocks={blocks} slug={page.slug} />
    </div>
  );
}
