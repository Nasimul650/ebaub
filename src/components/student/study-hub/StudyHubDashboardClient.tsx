'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  Upload,
  Plus,
  Clock,
  FileText,
  Trash2,
  ArrowRight,
  Search,
  Sparkles,
  GraduationCap,
  Calendar,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { StudySessionRecord } from '@/app/actions/study-hub';
import { deleteStudySession } from '@/app/actions/study-hub';
import type { CourseMaterial } from '@/types';
import StudyMaterialsPickerModal from './StudyMaterialsPickerModal';
import UploadPersonalFileModal from './UploadPersonalFileModal';

interface Props {
  initialSessions: StudySessionRecord[];
  materials: CourseMaterial[];
  studentName: string;
  departmentName: string;
}

export default function StudyHubDashboardClient({
  initialSessions = [],
  materials = [],
  studentName,
  departmentName,
}: Props) {
  const router = useRouter();
  const [sessions, setSessions] = useState<StudySessionRecord[]>(initialSessions);
  const [isMaterialsModalOpen, setIsMaterialsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Format date
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  // Strip HTML tags for clean snippet preview
  const stripHtml = (html: string | null | undefined) => {
    if (!html) return 'No notes drafted yet. Open session to begin extracting quotes and writing notes.';
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.length > 140 ? text.substring(0, 140) + '...' : text || 'Empty notes.';
  };

  // Filtered sessions
  const filteredSessions = sessions.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.title.toLowerCase().includes(q) ||
      (s.source_material?.course_code || '').toLowerCase().includes(q) ||
      (s.source_material?.title || '').toLowerCase().includes(q)
    );
  });

  // Handle Delete
  const handleDeleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this study session and its notes?')) return;

    setDeletingId(id);
    try {
      const res = await deleteStudySession(id);
      if (res.success) {
        setSessions((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert(res.error || 'Failed to delete study session.');
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-campus-950 via-campus-900 to-campus-800 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-campus-800/80 border border-campus-700/60 text-campus-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-campus-300" />
              <span>Interactive Split-Screen Study Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold heading-display tracking-tight text-white">
              Smart Study & Notes Workspace
            </h1>
            <p className="text-xs sm:text-sm text-campus-200/90 leading-relaxed">
              Open teacher lecture PDFs or your personal files side-by-side with an interactive notepad. Highlight key sentences to extract them directly into your notes and export as formatted PDFs.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button
              onClick={() => setIsMaterialsModalOpen(true)}
              className="bg-white hover:bg-slate-100 text-campus-950 font-extrabold text-xs rounded-2xl h-11 px-5 shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-campus-800" />
              <span>Study Course Materials</span>
            </Button>

            <Button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-campus-800/90 hover:bg-campus-700/90 text-white border border-campus-600 font-extrabold text-xs rounded-2xl h-11 px-5 shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Upload className="w-4 h-4 text-campus-300" />
              <span>Upload Personal File</span>
            </Button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-campus-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-extrabold text-lg text-slate-900 heading-display">
            Your Study Sessions
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
            {sessions.length}
          </span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search study sessions..."
            className="pl-9 bg-white border-slate-200 text-xs h-9 rounded-xl"
          />
        </div>
      </div>

      {/* Sessions Grid */}
      {filteredSessions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 bg-white space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-campus-50 border border-campus-200 text-campus-800 flex items-center justify-center mx-auto">
            <Layers className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-slate-900">
              {searchQuery ? 'No matching study sessions found' : 'No study sessions started yet'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery
                ? 'Try a different keyword or clear your search query.'
                : 'Choose a lecture file from your department or upload your own PDF to begin your first study session.'}
            </p>
          </div>
          {!searchQuery && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                size="sm"
                onClick={() => setIsMaterialsModalOpen(true)}
                className="bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs rounded-xl h-9 px-4"
              >
                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                <span>Browse Course Materials</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsUploadModalOpen(true)}
                className="border-slate-200 text-slate-700 hover:text-campus-900 font-bold text-xs rounded-xl h-9 px-4"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5 text-campus-700" />
                <span>Upload PDF</span>
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSessions.map((sess) => {
            const isDeleting = deletingId === sess.id;
            const isFromCourse = Boolean(sess.source_material);

            return (
              <div
                key={sess.id}
                onClick={() => router.push(`/student/study-hub/${sess.id}`)}
                className="group relative bg-white border border-slate-200/90 hover:border-campus-400 rounded-3xl p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Card Header & Badge */}
                  <div className="flex items-center justify-between gap-2">
                    {isFromCourse ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-campus-50 border border-campus-200 text-campus-900 text-[10px] font-extrabold flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-campus-700" />
                        <span>{sess.source_material?.course_code}</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center gap-1">
                        <FileText className="w-3 h-3 text-slate-500" />
                        <span>Personal PDF</span>
                      </span>
                    )}

                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={(e) => handleDeleteSession(e, sess.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete study session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-campus-900 transition-colors line-clamp-1">
                    {sess.title}
                  </h3>

                  {/* Notes Snippet */}
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {stripHtml(sess.notes_content)}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(sess.updated_at)}</span>
                  </div>

                  <span className="font-bold text-campus-900 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 text-[11px]">
                    <span>Resume Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <StudyMaterialsPickerModal
        isOpen={isMaterialsModalOpen}
        onClose={() => setIsMaterialsModalOpen(false)}
        materials={materials}
      />

      <UploadPersonalFileModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}
