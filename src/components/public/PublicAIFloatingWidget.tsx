'use client';

import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { askPublicAI } from '@/lib/mock/mockServices';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export default function PublicAIFloatingWidget({ isOpen, onClose }: Props) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'Hello! I am the EBAUB Public AI Assistant. Ask me anything about our academic programs, admissions requirements, CSE 2-Year Anniversary event, or campus notices.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await askPublicAI(query);
      const aiMsg: ChatMessage = {
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'I apologize, I encountered an issue retrieving university information. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 animate-widget-spring">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/90 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              EBAUB Public AI <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Official</span>
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">Institutional Assistant</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Prompts */}
      <div className="p-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-slate-500 shrink-0 font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> Try:
        </span>
        <button
          onClick={() => setInput('What programs does EBAUB offer?')}
          className="shrink-0 px-3 py-1 rounded-full bg-white hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200 hover:border-emerald-200 transition-all hover:scale-105 active:scale-95"
        >
          Programs
        </button>
        <button
          onClick={() => setInput('CSE 2-Year Anniversary event info')}
          className="shrink-0 px-3 py-1 rounded-full bg-white hover:bg-amber-50 text-amber-800 border border-amber-200 transition-all hover:scale-105 active:scale-95"
        >
          Anniversary
        </button>
        <button
          onClick={() => setInput('Admission requirements B.Sc. CSE')}
          className="shrink-0 px-3 py-1 rounded-full bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 transition-all hover:scale-105 active:scale-95"
        >
          Admissions
        </button>
      </div>

      {/* Messages Window */}
      <div className="h-80 p-4 overflow-y-auto space-y-3.5 text-xs bg-slate-50/50">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-message`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-br-none shadow-md'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none whitespace-pre-line shadow-2xs'
              }`}
            >
              <div>{msg.text}</div>
              <div className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-slate-400' : 'text-slate-400'}`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-message">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-3 text-slate-500 flex items-center gap-2 shadow-2xs">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Fetching EBAUB records...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
        >
          <Send className="w-4 h-4 text-emerald-400" />
        </button>
      </form>

    </div>
  );
}
