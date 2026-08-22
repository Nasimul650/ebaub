'use client';

import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { getNotices, createNotice, deleteNotice } from '@/lib/mock/mockServices';
import { NoticeItem } from '@/types';
import NoticeCreateForm from '@/components/admin/NoticeCreateForm';
import NoticeTable from '@/components/admin/NoticeTable';

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);

  useEffect(() => {
    getNotices().then(setNotices);
  }, []);

  const handleCreate = async (noticeData: Partial<NoticeItem>) => {
    const newNotice = await createNotice(noticeData as Omit<NoticeItem, 'id' | 'createdAt' | 'publishedAt'>);
    setNotices(prev => [newNotice, ...prev]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    await deleteNotice(id);
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 heading-display flex items-center gap-2">
          <Bell className="w-6 h-6 text-amber-500" /> Notices CMS Manager
        </h1>
        <p className="text-xs text-slate-500 mt-1">Create, publish, and delete official university notices</p>
      </div>

      {/* Create Form */}
      <NoticeCreateForm onSubmit={handleCreate} />

      {/* Notices Table */}
      <NoticeTable notices={notices} onDelete={handleDelete} />
    </div>
  );
}
