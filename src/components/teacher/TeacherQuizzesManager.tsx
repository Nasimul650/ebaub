'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Plus, 
  BookOpen, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  Clock, 
  MoreVertical, 
  Edit3, 
  Printer, 
  Trash2, 
  RotateCcw, 
  Search, 
  Filter, 
  FileText, 
  Globe, 
  Check, 
  AlertCircle,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { toggleQuizStatus, deleteQuiz, QuizStatus, QuestionType } from '@/app/actions/quiz';

interface QuizItem {
  id: string;
  course_code: string;
  title: string;
  status?: QuizStatus | string;
  exam_type?: QuestionType | string;
  created_at?: string;
  quiz_questions?: any[];
}

interface TeacherQuizzesManagerProps {
  initialQuizzes: QuizItem[];
}

export default function TeacherQuizzesManager({ initialQuizzes }: TeacherQuizzesManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Local state for immediate optimistic response
  const [quizzes, setQuizzes] = useState<QuizItem[]>(initialQuizzes);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'published' | 'draft' | 'mcq' | 'short_answer' | 'creative'>('all');

  // Deletion state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<QuizItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status toggle state
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Filter quizzes
  const filteredQuizzes = quizzes.filter((quiz) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      quiz.course_code.toLowerCase().includes(q) ||
      quiz.title.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'published') return quiz.status === 'published';
    if (selectedFilter === 'draft') return quiz.status !== 'published';
    if (selectedFilter === 'mcq') return (quiz.exam_type || 'mcq') === 'mcq';
    if (selectedFilter === 'short_answer') return quiz.exam_type === 'short_answer';
    if (selectedFilter === 'creative') return quiz.exam_type === 'creative';

    return true;
  });

  // Calculate stats
  const totalCount = quizzes.length;
  const publishedCount = quizzes.filter(q => q.status === 'published').length;
  const draftCount = totalCount - publishedCount;

  // Handle Status Toggle
  const handleToggleStatus = async (quiz: QuizItem) => {
    setTogglingId(quiz.id);
    const nextStatus: QuizStatus = quiz.status === 'published' ? 'draft' : 'published';

    // Optimistic local update
    setQuizzes(prev => prev.map(q => q.id === quiz.id ? { ...q, status: nextStatus } : q));

    try {
      const result = await toggleQuizStatus(quiz.id);
      if (!result.success) {
        // Rollback
        setQuizzes(prev => prev.map(q => q.id === quiz.id ? { ...q, status: quiz.status } : q));
        alert(result.error || 'Failed to update exam status.');
      } else {
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (err: any) {
      setQuizzes(prev => prev.map(q => q.id === quiz.id ? { ...q, status: quiz.status } : q));
      alert('Error updating status.');
    } finally {
      setTogglingId(null);
    }
  };

  // Handle Delete Confirmation
  const confirmDelete = async () => {
    if (!quizToDelete) return;
    setIsDeleting(true);

    try {
      const result = await deleteQuiz(quizToDelete.id);
      if (result.success) {
        setQuizzes(prev => prev.filter(q => q.id !== quizToDelete.id));
        setDeleteDialogOpen(false);
        setQuizToDelete(null);
        startTransition(() => {
          router.refresh();
        });
      } else {
        alert(result.error || 'Failed to delete exam.');
      }
    } catch (err) {
      alert('Error deleting exam.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getExamTypeBadge = (type?: string) => {
    switch (type) {
      case 'short_answer':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
            <FileText className="w-3 h-3 text-purple-600" /> Short Answer
          </span>
        );
      case 'creative':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
            <Sparkles className="w-3 h-3 text-rose-600" /> Creative / Scenario
          </span>
        );
      case 'mcq':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            <Layers className="w-3 h-3 text-blue-600" /> Multiple Choice
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-campus-700 bg-campus-50 border border-campus-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-campus-600" /> Academic Assessments
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-medium text-slate-500">Teacher Question Bank</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-display">
            Course Quizzes & Exam Papers
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Manage your question bank, generate exams from course notes, edit questions, toggle publication status, or export printable offline exam papers.
          </p>

          {/* Metrics summary */}
          <div className="flex items-center gap-4 pt-2 text-xs font-semibold text-slate-600 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>Total: <strong className="text-slate-900">{totalCount}</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Published: <strong className="text-emerald-700">{publishedCount}</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Drafts: <strong className="text-amber-700">{draftCount}</strong></span>
            </span>
          </div>
        </div>

        <Link href="/teacher/quizzes/new" className="shrink-0">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-campus-900 hover:bg-campus-800 text-white font-extrabold shadow-xs gap-2 rounded-2xl px-6"
          >
            <Sparkles className="w-4 h-4 text-campus-300" />
            <span>Generate New AI Exam</span>
          </Button>
        </Link>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by course code or title..."
            className="pl-9 text-xs rounded-xl border-slate-200 focus-visible:ring-campus-400 w-full"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-bold no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
              selectedFilter === 'all'
                ? 'bg-campus-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('published')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1 ${
              selectedFilter === 'published'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Globe className="w-3 h-3" /> Published ({publishedCount})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('draft')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1 ${
              selectedFilter === 'draft'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3 h-3" /> Drafts ({draftCount})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('mcq')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
              selectedFilter === 'mcq'
                ? 'bg-blue-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            MCQ
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('short_answer')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
              selectedFilter === 'short_answer'
                ? 'bg-purple-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Short
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('creative')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
              selectedFilter === 'creative'
                ? 'bg-rose-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Creative
          </button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredQuizzes.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-10 sm:p-16 text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-campus-50 text-campus-800 flex items-center justify-center mx-auto shadow-2xs border border-campus-200/80">
            <BookOpen className="w-8 h-8" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900">
              {searchQuery ? 'No Matching Exams Found' : 'No Exams Created Yet'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {searchQuery 
                ? `No exam paper matched your query "${searchQuery}". Try searching for another course or clear the filter.`
                : 'Use our AI exam generator to automatically produce MCQs, conceptual short answers, or scenario-based creative exams.'}
            </p>
          </div>

          {searchQuery ? (
            <Button 
              variant="outline" 
              onClick={() => { setSearchQuery(''); setSelectedFilter('all'); }}
              className="text-xs font-bold rounded-xl"
            >
              Clear Filters
            </Button>
          ) : (
            <Link href="/teacher/quizzes/new">
              <Button className="bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs rounded-xl gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Exam
              </Button>
            </Link>
          )}
        </div>
      ) : (
        /* RESPONSIVE TABLE WRAPPER WITH w-full overflow-x-auto */
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-2xs overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Course & Title</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Exam Type</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Questions</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Created</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredQuizzes.map((quiz) => {
                  const questionCount = quiz.quiz_questions?.length || 0;
                  const formattedDate = quiz.created_at 
                    ? new Date(quiz.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : 'Recent';

                  const isPublished = quiz.status === 'published';
                  const isToggling = togglingId === quiz.id;

                  return (
                    <tr 
                      key={quiz.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Course & Title */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg bg-campus-50 text-campus-900 border border-campus-200">
                              {quiz.course_code}
                            </span>
                          </div>
                          <Link 
                            href={`/teacher/quizzes/${quiz.id}/edit`}
                            className="font-bold text-sm text-slate-900 hover:text-campus-700 transition-colors block line-clamp-1"
                          >
                            {quiz.title}
                          </Link>
                          {quiz.quiz_questions?.[0] && (
                            <p className="text-[11px] text-slate-500 line-clamp-1 italic max-w-md">
                              &ldquo;{quiz.quiz_questions[0].question_text}&rdquo;
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Exam Type */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {getExamTypeBadge(quiz.exam_type)}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {isPublished ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Draft
                          </span>
                        )}
                      </td>

                      {/* Questions Count */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                          <Layers className="w-3.5 h-3.5 text-campus-700" />
                          {questionCount} Questions
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-slate-500 text-xs">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {formattedDate}
                        </span>
                      </td>

                      {/* Actions Column */}
                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Quick Print Button */}
                          <Link href={`/teacher/quizzes/${quiz.id}/print`} target="_blank">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold gap-1"
                              title="Print / Export PDF"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Print</span>
                            </Button>
                          </Link>

                          {/* Quick Edit Button */}
                          <Link href={`/teacher/quizzes/${quiz.id}/edit`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold gap-1"
                              title="Edit Exam"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                          </Link>

                          {/* Shadcn DropdownMenu Actions */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200/70"
                                aria-label="Open Actions Menu"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Exam Actions</DropdownMenuLabel>
                              
                              {/* Edit Action */}
                              <DropdownMenuItem
                                onClick={() => router.push(`/teacher/quizzes/${quiz.id}/edit`)}
                              >
                                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                                <span>Edit Exam</span>
                              </DropdownMenuItem>

                              {/* Print / Download PDF */}
                              <DropdownMenuItem
                                onClick={() => window.open(`/teacher/quizzes/${quiz.id}/print`, '_blank')}
                              >
                                <Printer className="w-3.5 h-3.5 text-slate-500" />
                                <span>Print / Save PDF</span>
                              </DropdownMenuItem>

                              {/* Toggle Status */}
                              <DropdownMenuItem
                                disabled={isToggling}
                                onClick={() => handleToggleStatus(quiz)}
                              >
                                {isPublished ? (
                                  <>
                                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Revert to Draft</span>
                                  </>
                                ) : (
                                  <>
                                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Publish Exam</span>
                                  </>
                                )}
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              {/* Delete Action */}
                              <DropdownMenuItem
                                className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                onClick={() => {
                                  setQuizToDelete(quiz);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Exam</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              Delete Examination?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 leading-relaxed pt-2">
              Are you sure you want to delete <strong className="text-slate-900">{quizToDelete?.title}</strong> ({quizToDelete?.course_code})? This will permanently remove the exam and all {quizToDelete?.quiz_questions?.length || 0} associated questions. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setDeleteDialogOpen(false);
                setQuizToDelete(null);
              }}
              className="text-xs font-bold rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isDeleting}
              onClick={confirmDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isDeleting ? 'Deleting...' : 'Delete Permanently'}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
