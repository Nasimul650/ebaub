'use client';

import React, { useState } from 'react';
import { Bot, Send, Sparkles, Loader2, BookOpen } from 'lucide-react';
import { askStudentAI } from '@/lib/mock/mockServices';

interface Message {
  sender: 'student' | 'ai';
  text: string;
}

export default function StudentAIPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Hello! I am your AI Study Tutor. Ask me any conceptual question about Data Structures, Artificial Intelligence, Database Systems, or Algorithms.'
    }
  ]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const prompt = input.trim();
    if (!prompt || loading) return;

    const userMsg: Message = { sender: 'student', text: prompt };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await askStudentAI(prompt);
      setMessages(prev => [...prev, { sender: 'ai', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Error generating response.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto flex flex-col h-[80vh]">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 heading-display flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-600" /> Student AI Study Tutor
        </h1>
        <p className="text-xs text-slate-500 mt-1">Get instant academic explanations, code breakdowns, and study summaries</p>
      </div>

      {/* Suggested Prompts */}
      <div className="flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => setInput('Explain Binary Search Tree (BST) worst case complexity')}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-blue-800 border border-slate-200 shadow-2xs font-medium"
        >
          🌲 Binary Search Tree Complexity
        </button>
        <button
          onClick={() => setInput('What is Recursion and Divide & Conquer?')}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-emerald-800 border border-slate-200 shadow-2xs font-medium"
        >
          🔄 Recursion & Divide-and-Conquer
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 overflow-y-auto space-y-4 text-xs shadow-xs">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] p-4 rounded-2xl leading-relaxed ${
                m.sender === 'student'
                  ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                  : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-bl-none whitespace-pre-line shadow-2xs'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-slate-500 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Analyzing academic concepts...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask your study question..."
          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-xs"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs shadow-xs"
        >
          <Send className="w-4 h-4 text-emerald-400" />
        </button>
      </form>

    </div>
  );
}
