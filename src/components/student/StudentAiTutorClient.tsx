'use client';

import React, { useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Search, 
  BookOpenCheck, 
  ExternalLink, 
  RotateCcw, 
  User, 
  StopCircle, 
  GraduationCap,
  Building2,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface StudentAiTutorClientProps {
  studentName: string;
  departmentName: string;
}

export default function StudentAiTutorClient({
  studentName,
  departmentName
}: StudentAiTutorClientProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    reload,
    setMessages,
    setInput
  } = useChat({
    api: '/api/study-assistant',
    body: {
      studentName,
      departmentName
    },
    initialMessages: [
      {
        id: 'welcome-tutor',
        role: 'assistant',
        content: `Hello **${studentName}**! 👋\n\nI am your **EBAUB AI Study Assistant** for the **${departmentName}** department. I'm here to help you:\n\n* **Master tough concepts** through Socratic, guided problem solving\n* **Prepare for upcoming exams & quizzes**\n* **Search your department's course files, lecture notes, and syllabi**\n\nWhat would you like to explore today?`
      }
    ]
  });

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Suggested starter prompts
  const starterPrompts = [
    'Explain the difference between a while loop and a do-while loop.',
    'Search course materials for lecture slides or notes.',
    'Act as a Socratic tutor: test my knowledge on database normalization.',
    'Help me prepare a revision plan for my upcoming exam.'
  ];

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSubmit(e as any);
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] max-w-5xl mx-auto bg-white border border-slate-200/90 rounded-3xl shadow-xs overflow-hidden">
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-white shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-campus-900 text-white flex items-center justify-center shadow-xs shrink-0">
            <Bot className="w-5 h-5 text-campus-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm sm:text-base text-slate-900">
                AI Study Tutor
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-campus-50 border border-campus-200 text-campus-900 text-[10px] font-bold uppercase tracking-wider">
                Gemini 2.5
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <GraduationCap className="w-3.5 h-3.5 text-campus-700" />
                {studentName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-500">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {departmentName}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMessages([
                  {
                    id: 'welcome-tutor-reset',
                    role: 'assistant',
                    content: `Welcome back, **${studentName}**! How can I assist you with your studies in **${departmentName}** today?`
                  }
                ]);
              }}
              className="text-xs text-slate-600 hover:text-slate-900 rounded-xl border-slate-200 h-9"
              title="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">New Chat</span>
            </Button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/40 custom-scrollbar">
        {messages.map((message) => {
          const isUser = message.role === 'user';

          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-2xs ${
                  isUser
                    ? 'bg-campus-800 text-white'
                    : 'bg-white border border-slate-200 text-campus-900'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-campus-700" />}
              </div>

              {/* Message Bubble Container */}
              <div
                className={`flex flex-col space-y-2 max-w-[88%] sm:max-w-[80%] ${
                  isUser ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`rounded-2xl p-4 sm:p-5 shadow-2xs ${
                    isUser
                      ? 'bg-campus-900 text-white rounded-tr-xs'
                      : 'bg-white border border-slate-200/90 text-slate-900 rounded-tl-xs'
                  }`}
                >
                  {/* Tool Invocations Display */}
                  {message.toolInvocations && message.toolInvocations.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {message.toolInvocations.map((toolInv) => {
                        const isDone = toolInv.state === 'result';
                        const queryArg = toolInv.args?.query || '';

                        return (
                          <div key={toolInv.toolCallId} className="w-full">
                            {!isDone ? (
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-campus-50 border border-campus-200 text-campus-900 text-xs font-semibold animate-pulse">
                                <Search className="w-3.5 h-3.5 text-campus-700 animate-spin" />
                                <span>Searching course library for &quot;{queryArg}&quot;...</span>
                              </div>
                            ) : (
                              <div className="p-3 rounded-xl bg-campus-50/80 border border-campus-200 space-y-2 text-xs">
                                <div className="font-bold text-campus-950 flex items-center justify-between">
                                  <span className="flex items-center gap-1.5">
                                    <BookOpenCheck className="w-4 h-4 text-campus-700" />
                                    <span>Course Files Found for &quot;{queryArg}&quot;:</span>
                                  </span>
                                  <span className="text-[11px] font-semibold text-campus-800 px-2 py-0.5 rounded-full bg-white border border-campus-200">
                                    {toolInv.result?.found ?? 0} files
                                  </span>
                                </div>

                                {toolInv.result?.materials && toolInv.result.materials.length > 0 ? (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                    {toolInv.result.materials.map((file: any, fIdx: number) => (
                                      <a
                                        key={fIdx}
                                        href={file.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-campus-400 hover:shadow-2xs transition-all flex items-center justify-between gap-2 group text-left"
                                        title={`Open ${file.title}`}
                                      >
                                        <div className="min-w-0">
                                          <div className="font-bold text-slate-900 truncate group-hover:text-campus-900">
                                            {file.title}
                                          </div>
                                          <div className="text-[10px] text-slate-500 font-mono">
                                            {file.course_code}
                                          </div>
                                        </div>
                                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-campus-700 shrink-0" />
                                      </a>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-[11px] text-slate-500">
                                    No direct files matched &quot;{queryArg}&quot;. The AI will explain conceptually.
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Message Markdown Content */}
                  {isUser ? (
                    <div className="text-sm font-medium whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-800 leading-relaxed space-y-3 prose-study">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-slate-900 mt-3 mb-1" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-base font-bold text-slate-900 mt-2 mb-1" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-sm font-bold text-slate-900 mt-2 mb-1" {...props} />,
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1 mb-2" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-1 mb-2" {...props} />,
                          li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-extrabold text-slate-900" {...props} />,
                          code: ({ node, inline, ...props }: any) => 
                            inline ? (
                              <code className="px-1.5 py-0.5 rounded bg-slate-100 text-campus-900 font-mono text-xs font-semibold" {...props} />
                            ) : (
                              <code className="block p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto my-2" {...props} />
                            ),
                          blockquote: ({ node, ...props }) => (
                            <blockquote className="border-l-4 border-campus-600 pl-3 italic text-slate-600 my-2" {...props} />
                          ),
                          table: ({ node, ...props }) => (
                            <div className="overflow-x-auto my-2 border border-slate-200 rounded-xl">
                              <table className="min-w-full text-xs divide-y divide-slate-200" {...props} />
                            </div>
                          ),
                          th: ({ node, ...props }) => <th className="bg-slate-100 p-2 font-bold text-left text-slate-700" {...props} />,
                          td: ({ node, ...props }) => <td className="p-2 border-t border-slate-100" {...props} />,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-campus-900 flex items-center justify-center shrink-0 shadow-2xs">
              <Bot className="w-4 h-4 text-campus-700 animate-pulse" />
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-xs bg-white border border-slate-200/90 text-xs text-slate-500 flex items-center gap-2 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-campus-600 animate-spin" />
              <span>AI Tutor is thinking & crafting your response...</span>
              <button
                type="button"
                onClick={stop}
                className="text-[11px] font-bold text-red-600 hover:underline ml-2"
              >
                Stop
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Chips */}
      {messages.length <= 1 && (
        <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-campus-700" /> Suggested:
          </span>
          {starterPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePromptClick(p)}
              className="px-3 py-1 rounded-full bg-slate-50 hover:bg-campus-50 border border-slate-200/80 hover:border-campus-300 text-slate-700 hover:text-campus-900 text-xs font-medium whitespace-nowrap transition-colors shrink-0"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Pinned Area */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-100 shrink-0">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Ask your AI Tutor about any academic topic, or search course materials (e.g. "Find CSE-1201 notes")...`}
              rows={2}
              className="resize-none min-h-[52px] max-h-[140px] text-xs py-3 pr-4 rounded-2xl bg-slate-50/70 hover:bg-slate-50 focus:bg-white border-slate-200 focus:border-campus-700"
            />
          </div>

          {isLoading ? (
            <Button
              type="button"
              onClick={stop}
              variant="outline"
              className="h-[52px] px-4 rounded-2xl border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs shrink-0"
            >
              <StopCircle className="w-4 h-4 mr-1" />
              Stop
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!input.trim()}
              className="h-[52px] px-5 rounded-2xl bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs shadow-xs transition-all disabled:opacity-50 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline ml-1.5">Ask Tutor</span>
            </Button>
          )}
        </form>
        <div className="text-[10px] text-slate-400 text-center mt-1.5 flex items-center justify-center gap-1">
          <span>Press Enter to send, Shift + Enter for a new line. Official EBAUB Academic Tutor.</span>
        </div>
      </div>
    </div>
  );
}
