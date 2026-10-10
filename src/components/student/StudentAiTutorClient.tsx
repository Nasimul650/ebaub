'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
  FileText,
  Paperclip,
  X,
  File,
  Check,
  Copy,
  Upload,
  BookOpen,
  FolderOpen,
  FileCode,
  FileSpreadsheet,
  Presentation,
  Archive,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { CourseMaterial } from '@/types';
import { formatFileSize } from '@/lib/utils';

interface StudentAiTutorClientProps {
  studentName: string;
  departmentName: string;
  availableMaterials?: CourseMaterial[];
}

interface FilePreview {
  id: string;
  name: string;
  type: string;
  size: number;
  category: 'image' | 'pdf' | 'word' | 'ppt' | 'sheet' | 'code' | 'archive' | 'file';
  url?: string;
  isCourseMaterial?: boolean;
}

// Copy to clipboard helper for code blocks
function CodeCopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors p-1 rounded"
      title="Copy code"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-emerald-400" />
          <span className="text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

export default function StudentAiTutorClient({
  studentName,
  departmentName,
  availableMaterials = []
}: StudentAiTutorClientProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef<number>(0);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  // Course Materials Modal state
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [librarySearch, setLibrarySearch] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');

  // Attachment states
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [attachedMaterials, setAttachedMaterials] = useState<CourseMaterial[]>([]);
  const [previews, setPreviews] = useState<FilePreview[]>([]);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    reload,
    setMessages,
    setInput,
    error,
    append
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
        content: `Hello **${studentName}**! 👋\n\nI am your **EBAUB AI Study Assistant** for the **${departmentName}** department. I'm here to help you:\n\n* **Master academic concepts** through Socratic, step-by-step problem solving\n* **Analyze any documents or images** (upload PDFs, Word files, lecture slides, code, or homework photos)\n* **Attach course files uploaded by your professors** directly with the Course Library button\n* **Solve complex math & scientific formulas** with full KaTeX LaTeX typesetting\n\nDrop a file, attach a lecture slide, or ask any question to get started!`
      }
    ]
  });

  // Prevent browser from opening dropped files in new tab globally
  useEffect(() => {
    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
    };
    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault();
    };
    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('drop', handleWindowDrop);
    return () => {
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, []);

  // Auto-scroll on new messages or loading
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Determine file category for icons
  const getFileCategory = (fileName: string, mime: string): FilePreview['category'] => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif', 'bmp'].includes(ext) || mime.startsWith('image/')) return 'image';
    if (ext === 'pdf' || mime.includes('pdf')) return 'pdf';
    if (['doc', 'docx'].includes(ext) || mime.includes('word')) return 'word';
    if (['ppt', 'pptx'].includes(ext) || mime.includes('presentation')) return 'ppt';
    if (['xls', 'xlsx', 'csv'].includes(ext) || mime.includes('spreadsheet') || mime.includes('csv')) return 'sheet';
    if (['c', 'cpp', 'java', 'py', 'js', 'ts', 'jsx', 'tsx', 'json', 'sql', 'html', 'css', 'txt', 'md'].includes(ext) || mime.includes('text')) return 'code';
    if (['zip', 'rar', 'tar', 'gz', '7z'].includes(ext) || mime.includes('zip')) return 'archive';
    return 'file';
  };

  // Helper to add files from input or drop
  const addFiles = (newFiles: File[]) => {
    setAttachedFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((file) => {
      const category = getFileCategory(file.name, file.type);
      const previewId = `${file.name}-${file.size}-${Date.now()}`;

      if (category === 'image') {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreviews((prev) => [
            ...prev,
            {
              id: previewId,
              name: file.name,
              type: file.type,
              size: file.size,
              category: 'image',
              url: event.target?.result as string
            }
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviews((prev) => [
          ...prev,
          {
            id: previewId,
            name: file.name,
            type: file.type,
            size: file.size,
            category
          }
        ]);
      }
    });
  };

  // File input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    addFiles(Array.from(e.target.files));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and Drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Attach a teacher-uploaded course material directly
  const attachCourseMaterial = (mat: CourseMaterial) => {
    if (attachedMaterials.some((m) => m.id === mat.id)) return;
    setAttachedMaterials((prev) => [...prev, mat]);
    setIsLibraryOpen(false);
  };

  // Remove uploaded file
  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove attached course material
  const removeMaterial = (materialId: string) => {
    setAttachedMaterials((prev) => prev.filter((m) => m.id !== materialId));
  };

  // Form submission with attachments and teacher materials
  const handleFormSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const hasPrompt = Boolean(input.trim());
    const hasFiles = attachedFiles.length > 0;
    const hasMaterials = attachedMaterials.length > 0;

    if ((!hasPrompt && !hasFiles && !hasMaterials) || isLoading) return;

    try {
      const attachmentsPayload: any[] = [];
      let extraTextContext = '';

      // 1. Process client uploaded files
      for (const file of attachedFiles) {
        const isImage = file.type.startsWith('image/');
        const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        const isTextOrCode = file.type.startsWith('text/') || 
          ['c', 'cpp', 'java', 'py', 'js', 'ts', 'jsx', 'tsx', 'json', 'sql', 'html', 'css', 'txt', 'md', 'csv'].some((ext) =>
            file.name.toLowerCase().endsWith(`.${ext}`)
          );

        if (isImage || isPdf) {
          try {
            const dataUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
            attachmentsPayload.push({
              name: file.name,
              contentType: isImage ? (file.type || 'image/jpeg') : 'application/pdf',
              url: dataUrl
            });
          } catch (readErr) {
            console.warn('Failed reading file data URL:', readErr);
          }
        } else if (isTextOrCode) {
          try {
            const textContent = await file.text();
            extraTextContext += `\n\n--- [Uploaded File: ${file.name}] ---\n\`\`\`\n${textContent.slice(0, 50000)}\n\`\`\``;
          } catch {
            extraTextContext += `\n\n[Uploaded Document: "${file.name}" (${file.type || 'text'})]`;
          }
        } else {
          // Office documents (Word, PPT, Excel, etc.) or archives
          extraTextContext += `\n\n[Uploaded Document: "${file.name}" (${file.type || 'Document'}, ${formatFileSize(file.size)})]`;
        }
      }

      // 2. Process attached university course materials
      if (attachedMaterials.length > 0) {
        for (const mat of attachedMaterials) {
          const isPdf = (mat.file_name || '').toLowerCase().endsWith('.pdf') || (mat.file_type || '').includes('pdf');
          if (isPdf && mat.file_url) {
            try {
              const res = await fetch(mat.file_url);
              if (res.ok) {
                const blob = await res.blob();
                const dataUrl = await new Promise<string>((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result as string);
                  reader.onerror = reject;
                  reader.readAsDataURL(blob);
                });
                attachmentsPayload.push({
                  name: `${mat.course_code}_${mat.title}.pdf`,
                  contentType: 'application/pdf',
                  url: dataUrl
                });
              }
            } catch (fetchErr) {
              console.warn('Could not fetch course material blob:', fetchErr);
            }
          }
          extraTextContext += `\n\n[Attached University Course Material: "${mat.title}" (${mat.course_code}) uploaded by ${mat.teacher_name || 'Faculty'} - Direct Link: ${mat.file_url}]`;
        }
      }

      const promptText = input.trim() || (hasFiles || hasMaterials
        ? 'Please analyze and explain this attached academic material step-by-step.'
        : 'Hello! I need help with my studies.');

      const finalMessageContent = extraTextContext ? `${promptText}${extraTextContext}` : promptText;

      // Clear pending state immediately to prevent duplicate sends
      setInput('');
      setAttachedFiles([]);
      setAttachedMaterials([]);
      setPreviews([]);

      // Submit via append directly to bypass input state lag
      await append(
        {
          role: 'user',
          content: finalMessageContent,
        },
        attachmentsPayload.length > 0
          ? { experimental_attachments: attachmentsPayload }
          : undefined
      );
    } catch (submitErr) {
      console.error('Error submitting chat prompt with attachments:', submitErr);
    }
  };

  // Handle Enter key (without Shift)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if ((input.trim() || attachedFiles.length > 0 || attachedMaterials.length > 0) && !isLoading) {
        handleFormSubmit();
      }
    }
  };

  // Filter available course materials for the library modal
  const filteredLibraryMaterials = useMemo(() => {
    return availableMaterials.filter((mat) => {
      const q = librarySearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        mat.title.toLowerCase().includes(q) ||
        mat.course_code.toLowerCase().includes(q) ||
        mat.file_name.toLowerCase().includes(q) ||
        (mat.teacher_name || '').toLowerCase().includes(q);

      const matchCourse =
        selectedCourseFilter === 'all' ||
        mat.course_code.trim().toUpperCase() === selectedCourseFilter.toUpperCase();

      return matchSearch && matchCourse;
    });
  }, [availableMaterials, librarySearch, selectedCourseFilter]);

  // Distinct courses for course filter pills in modal
  const distinctCourseCodes = useMemo(() => {
    const set = new Set<string>();
    availableMaterials.forEach((m) => {
      if (m.course_code?.trim()) set.add(m.course_code.trim().toUpperCase());
    });
    return Array.from(set).sort();
  }, [availableMaterials]);

  // Icon renderer for file types
  const renderFileIcon = (category: FilePreview['category']) => {
    switch (category) {
      case 'image':
        return <ImageIcon className="w-4 h-4 text-emerald-600" />;
      case 'pdf':
        return <FileText className="w-4 h-4 text-rose-600" />;
      case 'word':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'ppt':
        return <Presentation className="w-4 h-4 text-amber-600" />;
      case 'sheet':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
      case 'code':
        return <FileCode className="w-4 h-4 text-purple-600" />;
      case 'archive':
        return <Archive className="w-4 h-4 text-orange-600" />;
      default:
        return <File className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div 
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="relative flex flex-col h-[calc(100vh-6.5rem)] max-w-5xl mx-auto bg-white border border-slate-200/90 rounded-3xl shadow-xs overflow-hidden"
    >
      {/* Drag & Drop Visual Overlay */}
      {isDragging && (
        <div 
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="absolute inset-0 z-50 bg-campus-950/85 backdrop-blur-xs flex flex-col items-center justify-center border-4 border-dashed border-campus-400 rounded-3xl animate-in fade-in duration-150 p-6 text-center text-white pointer-events-auto"
        >
          <div className="w-16 h-16 rounded-2xl bg-campus-800 flex items-center justify-center mb-3 shadow-xl">
            <Upload className="w-8 h-8 text-campus-300 animate-bounce" />
          </div>
          <h3 className="text-xl font-extrabold heading-display">Drop files to attach to AI Tutor</h3>
          <p className="text-xs text-campus-200 mt-1 max-w-sm">
            Supports PDFs, images, code files, lecture slides, notes, and university documents.
          </p>
        </div>
      )}

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
                Multimodal • Gemini 3.8
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
                    content: `Welcome back, **${studentName}**! How can I assist you with your studies in **${departmentName}** today? You can drag & drop files, attach course lecture notes, or ask any conceptual question.`
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
                className={`flex flex-col space-y-2 max-w-[92%] sm:max-w-[85%] ${
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
                  {/* Attached Files in User Message */}
                  {message.experimental_attachments && message.experimental_attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {message.experimental_attachments.map((att, attIdx) => {
                        const isImage = att.contentType?.startsWith('image/') || att.url?.startsWith('data:image/');
                        return (
                          <div
                            key={attIdx}
                            className={`rounded-xl overflow-hidden border p-1 ${
                              isUser
                                ? 'bg-campus-950/40 border-campus-700/60'
                                : 'bg-slate-100 border-slate-200'
                            }`}
                          >
                            {isImage ? (
                              <img
                                src={att.url}
                                alt={att.name || 'Attachment'}
                                className="max-h-48 max-w-xs object-cover rounded-lg"
                              />
                            ) : (
                              <div className="flex items-center gap-2 px-3 py-2 text-xs">
                                <FileText className={`w-4 h-4 ${isUser ? 'text-campus-300' : 'text-slate-600'}`} />
                                <span className={`font-medium truncate max-w-[200px] ${isUser ? 'text-white' : 'text-slate-800'}`}>
                                  {att.name || 'Document'}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

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
                                    No direct files matched &quot;{queryArg}&quot;.
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Message Content: Rich Markdown with Math & Syntax Highlighting */}
                  {isUser ? (
                    <div className="text-sm font-medium whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                  ) : (
                    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-slate-800 leading-relaxed">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                          h1: ({ node, ...props }) => <h1 className="text-lg font-extrabold text-slate-900 mt-4 mb-2" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-base font-bold text-slate-900 mt-3 mb-1.5" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-sm font-bold text-slate-900 mt-2.5 mb-1" {...props} />,
                          p: ({ node, ...props }) => <p className="mb-2.5 last:mb-0 leading-relaxed" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1 mb-2.5" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-1 mb-2.5" {...props} />,
                          li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-extrabold text-slate-950" {...props} />,
                          blockquote: ({ node, ...props }) => (
                            <blockquote className="border-l-4 border-campus-700 pl-3.5 py-1 italic bg-campus-50/50 rounded-r-xl text-slate-700 my-3" {...props} />
                          ),
                          table: ({ node, ...props }) => (
                            <div className="overflow-x-auto my-3 border border-slate-200 rounded-2xl shadow-2xs">
                              <table className="min-w-full text-xs divide-y divide-slate-200" {...props} />
                            </div>
                          ),
                          th: ({ node, ...props }) => <th className="bg-slate-100/80 p-2.5 font-extrabold text-left text-slate-800 uppercase tracking-wider text-[11px]" {...props} />,
                          td: ({ node, ...props }) => <td className="p-2.5 border-t border-slate-100 text-slate-700" {...props} />,
                          code: ({ node, inline, className, children, ...props }: any) => {
                            const match = /language-(\w+)/.exec(className || '');
                            const lang = match ? match[1] : '';
                            const codeString = String(children).replace(/\n$/, '');

                            if (!inline && (match || codeString.includes('\n'))) {
                              return (
                                <div className="rounded-2xl overflow-hidden border border-slate-800 my-3 shadow-md not-prose">
                                  <div className="bg-slate-900 px-3.5 py-1.5 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                                    <span>{lang || 'code'}</span>
                                    <CodeCopyButton code={codeString} />
                                  </div>
                                  <SyntaxHighlighter
                                    language={lang || 'text'}
                                    style={oneDark}
                                    customStyle={{
                                      margin: 0,
                                      padding: '1rem',
                                      fontSize: '0.78rem',
                                      lineHeight: '1.45',
                                      backgroundColor: '#111827',
                                    }}
                                    wrapLongLines={true}
                                  >
                                    {codeString}
                                  </SyntaxHighlighter>
                                </div>
                              );
                            }

                            return (
                              <code className="px-1.5 py-0.5 rounded bg-slate-100 text-campus-900 font-mono text-xs font-semibold" {...props}>
                                {children}
                              </code>
                            );
                          }
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
              <span>AI Tutor is formulating a step-by-step academic response...</span>
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

        {/* Error Notification */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center justify-between">
            <span>An error occurred while connecting to the AI Tutor. Please try again.</span>
            <button
              type="button"
              onClick={() => reload()}
              className="text-red-900 font-bold underline hover:text-red-950 ml-2"
            >
              Retry
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Pinned Area */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-100 shrink-0">
        {/* Hidden File Input for All Document, Code & Image Types */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,application/pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.json,.sql,.py,.js,.ts,.cpp,.c,.java,.zip,.md,*/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Attachment Previews Area above Input (Both Local Files & Teacher Materials) */}
        {(previews.length > 0 || attachedMaterials.length > 0) && (
          <div className="flex flex-wrap items-center gap-2 p-2.5 bg-slate-50/80 rounded-2xl border border-slate-200/90 mb-2.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Attached ({previews.length + attachedMaterials.length}):
            </div>

            {/* Local Files Preview */}
            {previews.map((file, idx) => (
              <div
                key={file.id}
                className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs"
              >
                {file.url ? (
                  <img src={file.url} alt={file.name} className="w-6 h-6 object-cover rounded-md" />
                ) : (
                  renderFileIcon(file.category)
                )}
                <span className="font-medium text-slate-800 max-w-[130px] truncate text-[11px]">
                  {file.name}
                </span>
                <span className="text-[10px] text-slate-400">
                  {formatFileSize(file.size)}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Remove attachment"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Teacher Course Materials Preview */}
            {attachedMaterials.map((mat) => (
              <div
                key={mat.id}
                className="flex items-center gap-2 pl-2.5 pr-1.5 py-1 rounded-xl bg-campus-50 border border-campus-200 text-campus-900 shadow-2xs text-xs"
              >
                <BookOpenCheck className="w-4 h-4 text-campus-700 shrink-0" />
                <span className="font-bold text-[11px] max-w-[140px] truncate">
                  {mat.title}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-campus-100 text-campus-900 font-mono font-bold">
                  {mat.course_code}
                </span>
                <button
                  type="button"
                  onClick={() => removeMaterial(mat.id)}
                  className="p-1 rounded-md text-campus-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Remove course material"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Form with Paperclip & Course Library Buttons */}
        <form onSubmit={handleFormSubmit} className="flex items-end gap-2">
          {/* File Attachment Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-2xl text-slate-600 hover:text-campus-900 hover:bg-slate-100 border border-slate-200/80 transition-colors shrink-0 flex items-center justify-center h-[52px]"
            title="Attach documents, lecture notes, or images (PDF, DOCX, PPT, code, images)"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Attach Directly from University Course Library Button */}
          <button
            type="button"
            onClick={() => setIsLibraryOpen(true)}
            className="p-3 rounded-2xl text-campus-800 hover:text-campus-950 bg-campus-50/70 hover:bg-campus-100 border border-campus-200 transition-colors shrink-0 flex items-center justify-center h-[52px]"
            title="Attach uploaded faculty course notes & lecture materials directly"
          >
            <BookOpen className="w-5 h-5 text-campus-800" />
          </button>

          {/* Textarea */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={
                attachedFiles.length > 0 || attachedMaterials.length > 0
                  ? `Ask tutor to break down attached file(s) line-by-line...`
                  : `Ask about any concept, drag & drop files, or attach from Course Library...`
              }
              rows={2}
              className="resize-none min-h-[52px] max-h-[140px] text-xs py-3 pr-4 rounded-2xl bg-slate-50/70 hover:bg-slate-50 focus:bg-white border-slate-200 focus:border-campus-700"
            />
          </div>

          {/* Submit / Stop Button */}
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
              disabled={!input.trim() && attachedFiles.length === 0 && attachedMaterials.length === 0}
              className="h-[52px] px-5 rounded-2xl bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs shadow-xs transition-all disabled:opacity-50 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline ml-1.5">Ask Tutor</span>
            </Button>
          )}
        </form>
        <div className="text-[10px] text-slate-400 text-center mt-1.5 flex items-center justify-center gap-1">
          <span>Drag & drop files anytime • KaTeX LaTeX Math ($$...$$) • Official EBAUB Study Assistant.</span>
        </div>
      </div>

      {/* Course Materials Library Attachment Modal */}
      <Dialog open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6 rounded-3xl">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpenCheck className="w-5 h-5 text-campus-700" />
              Attach Course Material from Faculty
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Select any lecture note, syllabus sheet, or slide deck uploaded by your professors to analyze directly with the AI Tutor.
            </DialogDescription>
          </DialogHeader>

          {/* Modal Search & Course Filters */}
          <div className="space-y-3 shrink-0 pt-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                placeholder="Search by topic, document title, or course code..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-campus-700"
              />
            </div>

            {distinctCourseCodes.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
                <button
                  type="button"
                  onClick={() => setSelectedCourseFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors whitespace-nowrap ${
                    selectedCourseFilter === 'all'
                      ? 'bg-campus-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({availableMaterials.length})
                </button>
                {distinctCourseCodes.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setSelectedCourseFilter(code)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors whitespace-nowrap ${
                      selectedCourseFilter === code
                        ? 'bg-campus-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Materials List */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 my-3 custom-scrollbar">
            {filteredLibraryMaterials.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No course materials match your search.
              </div>
            ) : (
              filteredLibraryMaterials.map((mat) => {
                const isAlreadyAttached = attachedMaterials.some((m) => m.id === mat.id);

                return (
                  <div
                    key={mat.id}
                    className="p-3.5 rounded-2xl bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-4 h-4 text-campus-700" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-campus-100 text-campus-900">
                            {mat.course_code}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formatFileSize(mat.file_size)}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs truncate max-w-sm mt-0.5">
                          {mat.title}
                        </h4>
                        <div className="text-[11px] text-slate-500">
                          {mat.teacher_name ? `By ${mat.teacher_name}` : mat.file_name}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isAlreadyAttached ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                          <Check className="w-3.5 h-3.5" /> Attached
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => attachCourseMaterial(mat)}
                          className="bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs rounded-xl h-8 px-3"
                        >
                          Attach to Chat
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
