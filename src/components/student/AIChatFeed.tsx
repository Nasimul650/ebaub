'use client';

import React, { useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface Message {
  role: string;
  content: string;
}

interface Props {
  messages: Message[];
  loading: boolean;
}

export default function AIChatFeed({ messages, loading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  return (
    <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 overflow-y-auto space-y-4 text-xs shadow-xs scroll-smooth">
      {messages.map((m, i) => (
        <div key={i} className={`flex ${m.role === 'student' ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`max-w-[85%] p-4 rounded-2xl leading-relaxed ${
              m.role === 'student'
                ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                : 'bg-campus-50 text-slate-800 border border-slate-200 rounded-bl-none whitespace-pre-line shadow-2xs'
            }`}
          >
            {m.content}
          </div>
        </div>
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="bg-campus-50 border border-slate-200 p-3 rounded-2xl text-slate-500 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span>Analyzing academic concepts...</span>
          </div>
        </div>
      )}

      {/* Anchor for auto scroll */}
      <div ref={bottomRef} className="h-0 w-0" />
    </div>
  );
}
