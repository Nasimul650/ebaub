'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, Circle } from 'lucide-react';
import { ContactMessage } from '@/utils/supabase/queries';
import { updateMessageStatus } from '@/app/actions/contact';

export default function MessageList({ messages }: { messages: ContactMessage[] }) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const toggleStatus = async (id: string, currentStatus: string) => {
    setUpdatingId(id);
    const newStatus = currentStatus === 'unread' ? 'resolved' : 'unread';
    await updateMessageStatus(id, newStatus);
    setUpdatingId(null);
  };

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl">
          <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700">No Messages</h3>
          <p className="text-sm text-slate-500 mt-2">Your inbox is completely clear.</p>
        </div>
      ) : (
        messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`bg-white border rounded-2xl p-6 transition-all ${
              msg.status === 'unread' 
                ? 'border-campus-200 shadow-md ring-1 ring-campus-600/10' 
                : 'border-slate-200 shadow-sm opacity-75 hover:opacity-100'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{msg.subject}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-sm text-slate-700">{msg.name}</span>
                  <span className="text-slate-400 text-xs">•</span>
                  <a href={`mailto:${msg.email}`} className="text-sm text-campus-700 hover:underline">
                    {msg.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-xs font-semibold text-slate-400">
                  {new Date(msg.created_at).toLocaleString()}
                </span>
                <button
                  onClick={() => toggleStatus(msg.id, msg.status)}
                  disabled={updatingId === msg.id}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    msg.status === 'unread' 
                      ? 'bg-campus-100 text-campus-800 hover:bg-campus-200' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  } disabled:opacity-50`}
                >
                  {msg.status === 'unread' ? (
                    <><Circle className="w-3.5 h-3.5" /> Mark Resolved</>
                  ) : (
                    <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Resolved (Undo)</>
                  )}
                </button>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                {msg.message}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
