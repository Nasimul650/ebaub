'use client';

import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import { askStudentAI } from '@/lib/mock/mockServices';
import SuggestedPrompts from '@/components/student/SuggestedPrompts';
import AIChatFeed from '@/components/student/AIChatFeed';
import AIChatInput from '@/components/student/AIChatInput';

interface Message {
  role: string;
  content: string;
}

export default function StudentAIPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: 'Hello! I am your AI Study Tutor. Ask me any conceptual question about Data Structures, Artificial Intelligence, Database Systems, or Algorithms.'
    }
  ]);

  const handleSend = async () => {
    const prompt = input.trim();
    if (!prompt || loading) return;

    const userMsg: Message = { role: 'student', content: prompt };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await askStudentAI(prompt);
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Error generating response.' }]);
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

      <SuggestedPrompts onSelect={(prompt) => setInput(prompt)} />
      
      <AIChatFeed messages={messages} loading={loading} />
      
      <AIChatInput 
        value={input} 
        onChange={setInput} 
        onSubmit={handleSend} 
        disabled={!input.trim() || loading} 
      />

    </div>
  );
}
