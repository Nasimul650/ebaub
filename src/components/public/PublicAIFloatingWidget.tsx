'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useChat } from 'ai/react';
import { Bot, X, Send, Sparkles, Loader2, ArrowUp } from 'lucide-react';

export default function PublicAIFloatingWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: '/api/chat',
    maxSteps: 5
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Global event listener for navbar triggering
  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    const handleOpen = () => setIsOpen(true);
    
    window.addEventListener('toggle-ai-chat', handleToggle);
    window.addEventListener('open-ai-chat', handleOpen);
    
    return () => {
      window.removeEventListener('toggle-ai-chat', handleToggle);
      window.removeEventListener('open-ai-chat', handleOpen);
    };
  }, []);

  // Back to top visibility logic
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  return (
    <>
      {/* Floating Action Buttons Container */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[70] flex flex-col-reverse md:flex-row items-center gap-3">
        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-slate-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:border-campus-200 text-slate-500 hover:text-campus-900 transition-all duration-300 ${showBackToTop && !isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90 pointer-events-none'}`}
          aria-label="Back to Top"
        >
          <ArrowUp className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* AI Trigger Button (New Premium Design) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 group relative ${
            isOpen 
              ? 'bg-white text-slate-600 scale-95 border border-slate-200 hover:bg-slate-50 opacity-0 md:opacity-100 md:pointer-events-auto pointer-events-none' 
              : 'bg-gradient-to-br from-campus-800 to-campus-950 text-white hover:shadow-[0_12px_40px_rgba(27,94,32,0.3)] hover:-translate-y-1'
          }`}
          aria-label="Toggle AI Assistant"
        >
          {/* Subtle pulse ring behind button when closed */}
          {!isOpen && (
            <div className="absolute inset-0 rounded-full border-2 border-campus-500 opacity-20 animate-ping group-hover:animate-none"></div>
          )}
          {isOpen ? (
            <X className="w-5 h-5 md:w-6 md:h-6" />
          ) : (
            <div className="relative">
              <Bot className="w-5 h-5 md:w-6 md:h-6" />
              <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 text-amber-400 absolute -top-1 -right-1 md:-right-2 animate-pulse" />
            </div>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 left-4 right-4 z-[60] h-[80vh] md:left-auto md:w-[400px] md:h-[600px] md:bottom-24 md:right-6 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 animate-widget-spring">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-campus-50/90 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-campus-800 to-campus-950 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5 text-campus-200" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  EBAUB Public AI <span className="text-[10px] bg-campus-200/50 text-campus-900 font-bold px-2 py-0.5 rounded-full">Official</span>
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">Powered by Gemini</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Suggested Prompts */}
          <div className="p-2.5 bg-campus-50/70 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            <span className="text-slate-500 shrink-0 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Try:
            </span>
            <button
              onClick={() => setInput('What programs does EBAUB offer?')}
              className="shrink-0 px-3 py-1 rounded-full bg-white hover:bg-campus-50 hover:text-campus-900 text-slate-700 border border-slate-200 hover:border-campus-200 transition-all hover:scale-105 active:scale-95"
            >
              Programs
            </button>
            <button
              onClick={() => setInput('Admission requirements')}
              className="shrink-0 px-3 py-1 rounded-full bg-white hover:bg-amber-50 text-amber-800 border border-amber-200 transition-all hover:scale-105 active:scale-95"
            >
              Admissions
            </button>
            <button
              onClick={() => setInput('Tell me about the CSE Faculty')}
              className="shrink-0 px-3 py-1 rounded-full bg-white hover:bg-campus-50 text-campus-900 border border-slate-200 hover:border-campus-200 transition-all hover:scale-105 active:scale-95"
            >
              CSE Faculty
            </button>
          </div>

          {/* Messages Window */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-slate-50/50 scroll-smooth"
          >
            {messages.length === 0 && (
              <div className="text-center text-slate-400 text-sm mt-10">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
                  <Bot className="w-8 h-8 text-slate-300" />
                </div>
                <p className="font-semibold text-slate-600 mb-1">How can I help you today?</p>
                <p className="text-xs text-slate-500">Ask me anything about EBAUB's academics, admissions, or notices.</p>
              </div>
            )}

            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-message`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-campus-900 text-white rounded-br-none shadow-md'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none whitespace-pre-line shadow-sm'
                  }`}
                >
                  <div>{msg.content}</div>
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex justify-start animate-message">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-3 text-slate-500 flex items-center gap-2 shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-campus-700" />
                  <span>Fetching records...</span>
                </div>
              </div>
            )}

            {/* Scroll Anchor */}
            <div ref={messagesEndRef} className="h-0 w-0" />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask a question..."
              disabled={isLoading}
              className="flex-1 bg-slate-100 border-transparent rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-campus-400 focus:ring-2 focus:ring-campus-100 disabled:opacity-50 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-campus-900 hover:bg-campus-800 text-white disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4 text-campus-400" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
