import React from 'react';
import { requireAdmin } from '@/app/actions/cms';
import { getAllMessages } from '@/utils/supabase/queries';
import MessageList from '@/components/admin/MessageList';

export const metadata = {
  title: 'Contact Inbox | Admin Dashboard',
};

export default async function MessagesInboxPage() {
  await requireAdmin();
  const messages = await getAllMessages();

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Contact Inbox</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage inquiries and messages sent from the public website.
          </p>
        </div>
        <div className="bg-campus-100 text-campus-800 px-4 py-2 rounded-xl text-sm font-bold border border-campus-200">
          {unreadCount} Unread Message{unreadCount !== 1 ? 's' : ''}
        </div>
      </div>

      <MessageList messages={messages} />
    </div>
  );
}
