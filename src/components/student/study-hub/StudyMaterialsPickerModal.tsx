'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BookOpen,
  Search,
  FileText,
  User,
  ArrowRight,
  Loader2,
  FolderOpen
} from 'lucide-react';
import type { CourseMaterial } from '@/types';
import { formatFileSize } from '@/lib/utils';
import { createStudySession } from '@/app/actions/study-hub';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  materials: CourseMaterial[];
}

export default function StudyMaterialsPickerModal({
  isOpen,
  onClose,
  materials = [],
}: Props) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [isSubmittingId, setIsSubmittingId] = useState<string | null>(null);

  // Extract distinct course codes for filter pills
  const distinctCourses = useMemo(() => {
    const set = new Set<string>();
    materials.forEach((m) => {
      if (m.course_code?.trim()) set.add(m.course_code.trim().toUpperCase());
    });
    return Array.from(set).sort();
  }, [materials]);

  // Filter materials
  const filteredMaterials = useMemo(() => {
    const q = search.toLowerCase().trim();
    return materials.filter((m) => {
      const matchSearch =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.course_code.toLowerCase().includes(q) ||
        (m.teacher_name || '').toLowerCase().includes(q);

      const matchCourse =
        selectedCourse === 'all' ||
        m.course_code.toUpperCase() === selectedCourse.toUpperCase();

      return matchSearch && matchCourse;
    });
  }, [materials, search, selectedCourse]);

  const handleSelectMaterial = async (mat: CourseMaterial) => {
    try {
      setIsSubmittingId(mat.id);
      const sessionTitle = `${mat.course_code}: ${mat.title}`;
      const res = await createStudySession({
        title: sessionTitle,
        sourceMaterialId: mat.id,
      });

      if (res.success && res.sessionId) {
        onClose();
        router.push(`/student/study-hub/${res.sessionId}`);
      } else {
        alert(res.error || 'Failed to initialize study session.');
      }
    } catch (err: any) {
      console.error('Error starting session:', err);
      alert('Error starting study session.');
    } finally {
      setIsSubmittingId(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6 rounded-3xl">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-campus-700" />
            Study from Course Materials
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Select any lecture note, syllabus, or slide deck published by your department faculty to study in split-screen.
          </DialogDescription>
        </DialogHeader>

        {/* Search & Course Code Filter */}
        <div className="space-y-3 shrink-0 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic, document title, or course code..."
              className="pl-9 bg-slate-50 border-slate-200 text-xs h-10 rounded-xl"
            />
          </div>

          {distinctCourses.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedCourse('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors whitespace-nowrap ${
                  selectedCourse === 'all'
                    ? 'bg-campus-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Courses ({materials.length})
              </button>
              {distinctCourses.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setSelectedCourse(code)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors whitespace-nowrap ${
                    selectedCourse === code
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
          {filteredMaterials.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs flex flex-col items-center">
              <FolderOpen className="w-8 h-8 text-slate-300 mb-2" />
              <span>No course materials match your search.</span>
            </div>
          ) : (
            filteredMaterials.map((mat) => {
              const isLoadingThis = isSubmittingId === mat.id;
              return (
                <div
                  key={mat.id}
                  className="p-3.5 rounded-2xl bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-campus-700 shadow-2xs">
                      <FileText className="w-5 h-5" />
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
                      <h4 className="font-bold text-slate-900 text-xs truncate max-w-md mt-1">
                        {mat.title}
                      </h4>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{mat.teacher_name ? `By ${mat.teacher_name}` : mat.file_name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Button
                      size="sm"
                      disabled={Boolean(isSubmittingId)}
                      onClick={() => handleSelectMaterial(mat)}
                      className="bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs rounded-xl h-8 px-3.5 shadow-2xs"
                    >
                      {isLoadingThis ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <span>Study Now</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
