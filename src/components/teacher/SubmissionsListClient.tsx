'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Award,
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  User,
  GraduationCap,
  Calendar,
  FileText,
  Filter,
  Layers,
  Edit3
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ReviewSubmissionDialog from '@/components/teacher/ReviewSubmissionDialog';
import type { StudentSubmissionItem } from '@/app/actions/grading';

interface Props {
  quiz: {
    id: string;
    course_code: string;
    title: string;
    exam_type: string;
    status: string;
    created_at: string;
    question_count: number;
  };
  initialSubmissions: StudentSubmissionItem[];
}

export default function SubmissionsListClient({ quiz, initialSubmissions = [] }: Props) {
  const [submissions, setSubmissions] = useState<StudentSubmissionItem[]>(initialSubmissions);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        sub.student_name.toLowerCase().includes(q) ||
        sub.institutional_id.toLowerCase().includes(q) ||
        sub.email.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'needs_grading' && sub.status === 'Needs Grading') ||
        (statusFilter === 'graded' && (sub.status === 'Graded' || sub.status === 'Auto-Graded'));

      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchQuery, statusFilter]);

  const handleOpenReview = (submissionId: string) => {
    setSelectedSubmissionId(submissionId);
    setIsDialogOpen(true);
  };

  const handleScoreUpdated = (submissionId: string, newScore: number) => {
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === submissionId) {
          return {
            ...s,
            score: newScore,
            status: 'Graded',
          };
        }
        return s;
      })
    );
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const totalSubs = submissions.length;
  const pendingCount = submissions.filter((s) => s.status === 'Needs Grading').length;
  const gradedCount = submissions.filter((s) => s.status === 'Graded' || s.status === 'Auto-Graded').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/teacher/overview"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold h-9 px-3.5 border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer select-none"
        >
          <ArrowLeft className="w-3.5 h-3.5 pointer-events-none" />
          <span className="pointer-events-none">Back to Teaching Overview</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/teacher/quizzes"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold h-9 px-3.5 border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer select-none"
          >
            <span>All Quizzes</span>
          </Link>
          <Link
            href={`/teacher/quizzes/${quiz.id}/edit`}
            className="inline-flex items-center justify-center gap-1.5 bg-campus-900 hover:bg-campus-800 text-white font-bold rounded-xl text-xs h-9 px-3.5 shadow-2xs transition-all cursor-pointer select-none active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5 pointer-events-none" />
            <span className="pointer-events-none">Edit Questions</span>
          </Link>
        </div>
      </div>

      {/* Hero Exam Summary Card */}
      <div className="bg-gradient-to-r from-campus-950 via-campus-900 to-campus-850 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-campus-800 text-campus-200 text-[11px] font-extrabold font-mono border border-campus-700/60">
                {quiz.course_code}
              </span>
              <span className="text-[11px] font-bold text-campus-300 uppercase">
                {quiz.exam_type} ASSESSMENT
              </span>
              <span className="text-[11px] text-campus-400">•</span>
              <span className="text-[11px] text-campus-300">
                {quiz.question_count} Questions
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold heading-display tracking-tight text-white">
              {quiz.title} — Submissions
            </h1>
            <p className="text-xs sm:text-sm text-campus-200/90 leading-relaxed">
              Review and evaluate student exam responses. View detailed answer breakdowns and assign official grades for written and creative questions.
            </p>
          </div>

          {/* Quick Metrics Pills */}
          <div className="grid grid-cols-3 gap-2.5 shrink-0">
            <div className="bg-campus-900/60 border border-campus-700/40 rounded-2xl p-3 text-center">
              <div className="text-[10px] text-campus-300 font-bold uppercase">Total Taken</div>
              <div className="text-lg font-extrabold text-white mt-0.5">{totalSubs}</div>
            </div>
            <div className="bg-campus-900/60 border border-campus-700/40 rounded-2xl p-3 text-center">
              <div className="text-[10px] text-campus-300 font-bold uppercase">Graded</div>
              <div className="text-lg font-extrabold text-emerald-400 mt-0.5">{gradedCount}</div>
            </div>
            <div className="bg-campus-900/60 border border-campus-700/40 rounded-2xl p-3 text-center">
              <div className="text-[10px] text-campus-300 font-bold uppercase">Pending</div>
              <div className="text-lg font-extrabold text-amber-400 mt-0.5">{pendingCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, roll ID, email..."
            className="pl-9 bg-slate-50/70 border-slate-200 text-xs h-9 rounded-xl focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-campus-800 cursor-pointer h-9"
          >
            <option value="all">All Submissions ({submissions.length})</option>
            <option value="needs_grading">Needs Grading ({pendingCount})</option>
            <option value="graded">Graded ({gradedCount})</option>
          </select>
        </div>
      </div>

      {/* Submissions Data Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xs">
        {filteredSubmissions.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-campus-50 border border-campus-200 text-campus-800 flex items-center justify-center mx-auto">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              {searchQuery || statusFilter !== 'all'
                ? 'No matching student submissions found'
                : 'No submissions received yet'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search criteria or status filter.'
                : 'Students enrolled in your department will appear here once they complete this exam.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Student Information</th>
                  <th className="py-3.5 px-4">Roll / ID</th>
                  <th className="py-3.5 px-4">Submitted At</th>
                  <th className="py-3.5 px-4">Score</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.map((sub) => {
                  const hasScore = typeof sub.score === 'number';
                  const percent = hasScore && sub.total_questions > 0
                    ? Math.round((sub.score! / sub.total_questions) * 100)
                    : null;

                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Student Name */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-campus-100 text-campus-900 font-extrabold text-xs flex items-center justify-center shrink-0">
                            {sub.student_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-extrabold text-slate-900 truncate">
                              {sub.student_name}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {sub.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Roll / Institutional ID */}
                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md text-[11px]">
                          {sub.institutional_id}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                          {sub.department_name}
                        </div>
                      </td>

                      {/* Submitted At */}
                      <td className="py-4 px-4 text-slate-600 font-medium">
                        {formatDate(sub.submitted_at)}
                      </td>

                      {/* Score */}
                      <td className="py-4 px-4">
                        {hasScore ? (
                          <div className="font-extrabold text-slate-900">
                            {sub.score} / {sub.total_questions}
                            {percent !== null && (
                              <span className="text-[10px] text-slate-400 font-normal ml-1">
                                ({percent}%)
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">
                            — / {sub.total_questions}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {sub.status === 'Needs Grading' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-extrabold">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Needs Grading</span>
                          </span>
                        ) : sub.status === 'Graded' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Graded</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-extrabold">
                            <Sparkles className="w-3 h-3 text-blue-600" />
                            <span>Auto-Graded</span>
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-5 text-right">
                        <Button
                          onClick={() => handleOpenReview(sub.id)}
                          size="sm"
                          className="bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs rounded-xl h-8 px-3.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          <span>Review & Grade</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grading Modal Dialog */}
      <ReviewSubmissionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        submissionId={selectedSubmissionId}
        onScoreUpdated={handleScoreUpdated}
      />
    </div>
  );
}
