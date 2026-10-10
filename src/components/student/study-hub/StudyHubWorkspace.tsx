'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/navigation';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const StudyHubPdfViewer = dynamic(
  () => import('./StudyHubPdfViewer'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center text-slate-400 text-xs">
        Loading PDF Viewer...
      </div>
    ),
  }
);

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import { useReactToPrint } from 'react-to-print';

import {
  ArrowLeft,
  Sparkles,
  Printer,
  Save,
  Check,
  Clock,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Highlighter,
  Undo,
  Redo,
  Heading2,
  Heading3,
  FileText,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Download,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { StudySessionRecord } from '@/app/actions/study-hub';
import { saveStudySessionNotes } from '@/app/actions/study-hub';

interface Props {
  session: StudySessionRecord;
}

export default function StudyHubWorkspace({ session }: Props) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [title, setTitle] = useState(session.title || 'Untitled Study Session');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const [isPdfCollapsed, setIsPdfCollapsed] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Determine PDF URL
  const rawFileUrl = session.personal_file_url || session.source_material?.file_url || '';
  const pdfUrl = rawFileUrl ? `/api/pdf-proxy?url=${encodeURIComponent(rawFileUrl)}` : '';

  // Setup TipTap Editor
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: session.notes_content || '<p>Start typing your study notes, or highlight text in the PDF on the left and click <strong>Extract to Notes</strong>...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[380px] p-4 text-slate-800 leading-relaxed custom-editor-content',
      },
    },
    onUpdate: ({ editor }) => {
      setSaveStatus('unsaved');
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        handleAutoSave(editor.getHTML(), title);
      }, 2500);
    },
  });

  // Auto-Save Function
  const handleAutoSave = useCallback(async (contentToSave: string, currentTitle: string) => {
    try {
      setSaveStatus('saving');
      const res = await saveStudySessionNotes({
        id: session.id,
        notesContent: contentToSave,
        title: currentTitle,
      });

      if (res.success) {
        setSaveStatus('saved');
        const now = new Date();
        setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } else {
        setSaveStatus('unsaved');
      }
    } catch (err) {
      console.error('Failed to auto-save notes:', err);
      setSaveStatus('unsaved');
    }
  }, [session.id]);

  // Handle Title Change with debounce
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setSaveStatus('unsaved');
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      if (editor) {
        handleAutoSave(editor.getHTML(), newTitle);
      }
    }, 2000);
  };

  // Extract selected text from PDF into TipTap editor
  const handleExtractToNotes = useCallback((selectedText: string) => {
    if (!editor || !selectedText) return;

    const trimmed = selectedText.trim();
    if (!trimmed) return;

    // Sanitize for basic HTML injection prevention
    const escaped = trimmed
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Programmatically append blockquote citation
    const blockquoteHtml = `<blockquote><p>${escaped}</p></blockquote><p></p>`;
    editor.commands.insertContent(blockquoteHtml);
    editor.commands.focus('end');

    // Trigger save
    setSaveStatus('unsaved');
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      handleAutoSave(editor.getHTML(), title);
    }, 1500);
  }, [editor, handleAutoSave, title]);


  // Print notes as PDF via react-to-print
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: title.replace(/[^a-zA-Z0-9-]/g, '_') || 'Study_Notes',
  });

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-[600px] text-slate-400 text-sm">
        <span>Initializing Study Workspace...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] bg-white border border-slate-200/90 rounded-3xl shadow-xs overflow-hidden">
      {/* Top Header Bar */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-3 bg-white shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/student/study-hub')}
            className="p-2 h-9 w-9 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 shrink-0"
            title="Back to Study Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="min-w-0 flex items-center gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Session Title..."
              className="font-extrabold text-sm sm:text-base text-slate-900 bg-transparent hover:bg-slate-50 focus:bg-slate-50 px-2 py-1 rounded-lg border border-transparent hover:border-slate-200 focus:border-campus-600 focus:outline-none transition-colors truncate max-w-xs sm:max-w-md"
            />
            {session.source_material && (
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-campus-50 border border-campus-200 text-campus-900 text-[10px] font-bold">
                <BookOpen className="w-3 h-3 text-campus-700" />
                {session.source_material.course_code}
              </span>
            )}
            {session.personal_file_url && (
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                <FileText className="w-3 h-3 text-slate-500" />
                Personal PDF
              </span>
            )}
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Auto-Save Status Badge */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/80">
            {saveStatus === 'saving' ? (
              <>
                <Clock className="w-3.5 h-3.5 text-campus-600 animate-spin" />
                <span className="text-campus-800 font-semibold">Saving...</span>
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-slate-600 font-medium">
                  Saved {lastSavedTime ? `at ${lastSavedTime}` : ''}
                </span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-slate-500 font-medium">Unsaved changes</span>
              </>
            )}
          </div>

          {/* Explicit Manual Save Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor && handleAutoSave(editor.getHTML(), title)}
            className="h-8 px-2.5 rounded-xl border-slate-200 text-slate-700 hover:text-campus-900 text-xs hidden sm:flex items-center gap-1"
            title="Save Notes"
          >
            <Save className="w-3.5 h-3.5 text-campus-700" />
            <span>Save</span>
          </Button>

          {/* Download Notes as PDF Button */}
          <Button
            onClick={() => handlePrint()}
            className="h-8 px-3 rounded-xl bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs shadow-2xs flex items-center gap-1.5"
            title="Download Notes as PDF via Print"
          >
            <Printer className="w-3.5 h-3.5 text-campus-300" />
            <span className="hidden sm:inline">Export PDF</span>
          </Button>

          {/* Toggle PDF Collapse on smaller displays */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPdfCollapsed(!isPdfCollapsed)}
            className="p-1.5 h-8 w-8 rounded-xl lg:hidden text-slate-600"
            title={isPdfCollapsed ? 'Show PDF' : 'Hide PDF'}
          >
            {isPdfCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Split-Screen Main Workspace Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Side: PDF Viewer (60% width) */}
        <div
          className={`h-full border-r border-slate-200 bg-slate-100 flex flex-col transition-all duration-300 ${
            isPdfCollapsed
              ? 'hidden'
              : 'w-full lg:w-[60%] flex-1'
          }`}
        >
          <StudyHubPdfViewer
            pdfUrl={pdfUrl}
            onExtractToNotes={handleExtractToNotes}
          />
        </div>

        {/* Right Side: Rich Text Notepad (40% width) */}
        <div className="w-full lg:w-[40%] h-full flex flex-col bg-white overflow-hidden">
          {/* Notepad Toolbar */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              disabled={!editor}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                editor?.isActive('bold')
                  ? 'bg-campus-900 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              disabled={!editor}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                editor?.isActive('italic')
                  ? 'bg-campus-900 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              disabled={!editor}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                editor?.isActive('heading', { level: 2 })
                  ? 'bg-campus-900 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
              title="Heading 2"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
              disabled={!editor}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                editor?.isActive('heading', { level: 3 })
                  ? 'bg-campus-900 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
              title="Heading 3"
            >
              <Heading3 className="w-3.5 h-3.5" />
            </button>

            <div className="w-px h-4 bg-slate-200 mx-0.5" />

            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              disabled={!editor}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                editor?.isActive('bulletList')
                  ? 'bg-campus-900 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
              title="Bullet List"
            >
              <List className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              disabled={!editor}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                editor?.isActive('orderedList')
                  ? 'bg-campus-900 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
              title="Numbered List"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              disabled={!editor}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                editor?.isActive('blockquote')
                  ? 'bg-campus-900 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
              title="Blockquote"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleHighlight().run()}
              disabled={!editor}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                editor?.isActive('highlight')
                  ? 'bg-amber-400 text-slate-900 font-bold'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
              title="Highlight Text"
            >
              <Highlighter className="w-3.5 h-3.5" />
            </button>

            <div className="w-px h-4 bg-slate-200 mx-0.5" />

            <button
              type="button"
              onClick={() => editor?.chain().focus().undo().run()}
              disabled={!editor?.can().undo()}
              className="p-1.5 rounded-lg text-xs text-slate-500 hover:bg-slate-200/70 disabled:opacity-30"
              title="Undo"
            >
              <Undo className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => editor?.chain().focus().redo().run()}
              disabled={!editor?.can().redo()}
              className="p-1.5 rounded-lg text-xs text-slate-500 hover:bg-slate-200/70 disabled:opacity-30"
              title="Redo"
            >
              <Redo className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* TipTap Editor Scrollable Area & Printable Notes Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-white">
            <div ref={printRef} className="print-content max-w-2xl mx-auto">
              {/* Header for Printed PDF */}
              <div className="print-only mb-6 pb-4 border-b border-slate-200 hidden print:block">
                <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                <p className="text-xs text-slate-500 mt-1">
                  EBAUB Student Study Hub Notes • Exported on {new Date().toLocaleDateString()}
                </p>
                {session.source_material && (
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">
                    Source Material: {session.source_material.course_code} - {session.source_material.title}
                  </p>
                )}
              </div>

              {/* The TipTap Editor View */}
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Notepad Footer with Quick Hint */}
          <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-campus-600" />
              <span>Select text in the PDF to extract quotes directly</span>
            </div>
            <span>Auto-saves every few seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
}
