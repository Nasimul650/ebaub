'use client';

import React from 'react';
import { EditorContent, type Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Highlighter,
  Undo,
  Redo,
  Sparkles,
} from 'lucide-react';

export interface NoteEditorProps {
  editor: Editor | null;
  printRef: React.RefObject<HTMLDivElement | null>;
  title: string;
  sourceMaterial?: {
    course_code?: string;
    title?: string;
  } | null;
  fileFormat?: string;
}

export function NoteEditor({
  editor,
  printRef,
  title,
  sourceMaterial,
  fileFormat,
}: NoteEditorProps) {
  return (
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
            {sourceMaterial && (
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                Source Material: {sourceMaterial.course_code} - {sourceMaterial.title}
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
          <span>
            {fileFormat === 'image'
              ? 'Type your notes directly as you study'
              : 'Select text in the document to extract quotes directly'}
          </span>
        </div>
        <span>Auto-saves every few seconds</span>
      </div>
    </div>
  );
}
