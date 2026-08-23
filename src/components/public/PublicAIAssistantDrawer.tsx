'use client';

import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, HelpCircle, Loader2 } from 'lucide-react';
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

export default function PublicAIAssistantDrawer({ isOpen, onClose }: Props) {
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
          text: 'I apologize, I encountered a temporary error fetching information. Please try asking again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setInput(promptText);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-campus-950/60 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div className="w-full max-w-md bg-campus-900 border-l border-campus-800 text-campus-100 flex flex-col h-full shadow-2xl">
        
        {/* Header */}
        <div className="p-4 border-b border-campus-800 flex items-center justify-between bg-campus-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-campus-400 to-teal-700 flex items-center justify-center text-white shadow-md">
              <Bot className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                EBAUB AI Assistant <span className="text-[10px] bg-campus-400/20 text-campus-300 font-semibold px-2 py-0.5 rounded-full border border-campus-400/30">Official</span>
              </h3>
              <p className="text-[11px] text-campus-300">Instant University Guidance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-campus-800 text-campus-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Quick Prompts */}
        <div className="p-3 bg-campus-950/50 border-b border-campus-800/60 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-campus-400 shrink-0 flex items-center gap-1 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Quick:
          </span>
          <button
            onClick={() => handleQuickPrompt('What programs does EBAUB offer?')}
            className="shrink-0 px-2.5 py-1 rounded-full bg-campus-800 hover:bg-campus-700 text-campus-200 border border-campus-700/60 transition-colors"
          >
            Academic Programs
          </button>
          <button
            onClick={() => handleQuickPrompt('CSE 2-Year Anniversary event info')}
            className="shrink-0 px-2.5 py-1 rounded-full bg-campus-800 hover:bg-campus-700 text-amber-300 border border-amber-500/30 transition-colors"
          >
            CSE Anniversary
          </button>
          <button
            onClick={() => handleQuickPrompt('Admission requirements for B.Sc. CSE')}
            className="shrink-0 px-2.5 py-1 rounded-full bg-campus-800 hover:bg-campus-700 text-campus-300 border border-campus-400/30 transition-colors"
          >
            Admissions
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-campus-700 text-white rounded-br-none shadow-md shadow-campus-950/30'
                    : 'bg-campus-800 text-campus-100 border border-campus-700/60 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <div
                  className={`text-[10px] mt-1.5 text-right ${
                    msg.sender === 'user' ? 'text-campus-200' : 'text-campus-300'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-campus-800 border border-campus-700/60 rounded-2xl rounded-bl-none p-3 text-xs text-campus-300 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-campus-400" />
                <span>Searching EBAUB university records...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-campus-800 bg-campus-900 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about programs, notices, admissions..."
            className="flex-1 bg-campus-950 border border-campus-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-campus-400 focus:outline-none focus:border-campus-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-campus-700 hover:bg-campus-400 disabled:opacity-50 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
