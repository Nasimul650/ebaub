import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { updateNotice } from '@/app/actions/cms';
import { getNoticeById } from '@/utils/supabase/queries';
import NoticeForm from '@/components/admin/NoticeForm';

export default async function EditNoticePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const noticeItem = await getNoticeById(id);

  if (!noticeItem) {
    notFound();
  }

  // Bind the ID to the update action
  const updateNoticeWithId = updateNotice.bind(null, id);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/notices" 
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Edit Notice</h1>
          <p className="text-sm text-slate-500 font-medium">Update the details of this official circular.</p>
        </div>
      </div>

      <NoticeForm action={updateNoticeWithId} initialData={noticeItem} />
    </div>
  );
}
