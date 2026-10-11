'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  Users,
  Clock,
  Sparkles,
  BarChart3,
  Search,
  ArrowRight,
  Filter,
  FileQuestion,
  GraduationCap,
  Plus,
  CheckCircle2,
  Calendar,
  Layers,
  FileCheck,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { TeacherOverviewStats } from '@/app/actions/grading';

interface Props {
  stats: TeacherOverviewStats;
  teacherName: string;
  departmentName?: string;
}

export default function TeacherOverviewClient({
  stats,
  teacherName,
  departmentName,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  const availableCourses = useMemo(() => {
    const set = new Set<string>();
    (stats.recentExams || []).forEach((exam) => {
      if (exam.course_code) set.add(exam.course_code.trim());
    });
    return Array.from(set).sort();
  }, [stats.recentExams]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedType !== 'all' || selectedCourse !== 'all'
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedCourse('all');
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
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

  const filteredExams = useMemo(() => {
    return (stats.recentExams || []).filter((exam) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        exam.title.toLowerCase().includes(q) ||
        exam.course_code.toLowerCase().includes(q);

      const matchesType =
        selectedType === 'all' ||
        exam.exam_type.toLowerCase() === selectedType.toLowerCase();

      const matchesCourse =
        selectedCourse === 'all' ||
        exam.course_code.toLowerCase() === selectedCourse.toLowerCase();

      return matchesSearch && matchesType && matchesCourse;
    });
  }, [stats.recentExams, searchQuery, selectedType, selectedCourse]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-campus-950 via-campus-900 to-campus-850 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-campus-800/80 border border-campus-700/60 text-campus-200 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5 text-campus-300" />
              <span>Teaching Assessment & Grading Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold heading-display tracking-tight text-white">
              Instructor Overview
            </h1>
            <p className="text-xs sm:text-sm text-campus-200/90 leading-relaxed">
              Welcome back, <strong className="text-white font-bold">{teacherName}</strong>. Monitor class submissions, view aggregated examination metrics, and evaluate written answers.
            </p>
            {departmentName && (
              <div className="pt-1 text-xs text-campus-300 font-medium">
                Department: <strong className="text-white">{departmentName}</strong>
              </div>
            )}
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link
              href="/teacher/quizzes/new"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-campus-950 font-extrabold text-xs rounded-2xl h-11 px-5 shadow-sm transition-transform active:scale-95 cursor-pointer select-none"
            >
              <Sparkles className="w-4 h-4 text-campus-800 pointer-events-none" />
              <span className="pointer-events-none">Generate New Exam</span>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-campus-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Exams Published */}
        <Card className="rounded-3xl border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow">
          <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Published Exams
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-campus-50 border border-campus-200 text-campus-800 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-campus-700" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {stats.totalExamsPublished}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Active course assessments published
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Total Submissions Received */}
        <Card className="rounded-3xl border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow">
          <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Submissions
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-700" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {stats.totalSubmissionsReceived}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Student exam papers received
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Average Performance */}
        <Card className="rounded-3xl border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow">
          <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Average Score
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center">
              <Award className="w-4 h-4 text-emerald-700" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {stats.averageScore !== null ? `${stats.averageScore}%` : 'N/A'}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Across all graded papers & MCQs
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Pending Grading */}
        <Card className="rounded-3xl border-amber-200 bg-amber-50/30 shadow-2xs hover:shadow-md transition-shadow">
          <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Pending Grading
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-700" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-950 mt-1">
              {stats.pendingGradingCount}
            </div>
            <p className="text-[11px] text-amber-800/80 mt-1 font-medium">
              Written answers awaiting teacher evaluation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Published Exams Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 heading-display">
              Published Course Examinations
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an examination to review student submissions, inspect answers, and assign grades.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search exams by title or code..."
                className="pl-8 bg-white border-slate-200 text-xs h-9 rounded-xl focus:border-campus-800"
              />
            </div>

            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-campus-800 cursor-pointer h-9 shrink-0"
              title="Filter by Course"
            >
              <option value="all">All Courses</option>
              {availableCourses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-campus-800 cursor-pointer h-9 shrink-0"
              title="Filter by Format"
            >
              <option value="all">All Formats</option>
              <option value="mcq">MCQ</option>
              <option value="short_answer">Short Answer</option>
              <option value="creative">Creative</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-600 transition-colors h-9"
                title="Reset all filters"
              >
                <X className="w-3.5 h-3.5 text-slate-400" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Exams Table Card */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xs">
          {filteredExams.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-campus-50 border border-campus-200 text-campus-800 flex items-center justify-center mx-auto">
                <FileCheck className="w-7 h-7" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                {hasActiveFilters
                  ? 'No matching examinations found'
                  : 'No examinations published yet'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {hasActiveFilters
                  ? 'Try clearing your search query or filters to view all published exams.'
                  : 'Generate a new AI quiz or publish a draft exam to start collecting student submissions.'}
              </p>
              <div className="pt-2">
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center justify-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl h-10 px-4 shadow-2xs cursor-pointer select-none"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Clear Filters</span>
                  </button>
                ) : (
                  <Link
                    href="/teacher/quizzes/new"
                    className="inline-flex items-center justify-center gap-1.5 bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs rounded-xl h-10 px-5 shadow-2xs cursor-pointer select-none"
                  >
                    <Plus className="w-3.5 h-3.5 pointer-events-none" />
                    <span className="pointer-events-none">Create Your First Exam</span>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-5">Exam Title & Details</th>
                    <th className="py-3.5 px-4">Course Code</th>
                    <th className="py-3.5 px-4">Format / Type</th>
                    <th className="py-3.5 px-4">Submissions</th>
                    <th className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredExams.map((exam) => {
                    const hasPending = exam.pending_grading_count > 0;

                    return (
                      <tr
                        key={exam.id}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        {/* Title & Created Date */}
                        <td className="py-4 px-5">
                          <div className="font-extrabold text-slate-900 text-sm">
                            {exam.title}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                            <span>{exam.question_count} Questions</span>
                            <span>•</span>
                            <span>Published on {formatDate(exam.created_at)}</span>
                          </div>
                        </td>

                        {/* Course Code */}
                        <td className="py-4 px-4">
                          <span className="font-mono font-extrabold text-campus-900 bg-campus-50 border border-campus-200 px-2.5 py-1 rounded-lg text-xs">
                            {exam.course_code}
                          </span>
                        </td>

                        {/* Exam Type */}
                        <td className="py-4 px-4">
                          <span className="uppercase font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            {exam.exam_type}
                          </span>
                        </td>

                        {/* Submissions Count */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-sm">
                              {exam.submissions_count}
                            </span>
                            <span className="text-slate-400 text-xs">papers</span>

                            {hasPending && (
                              <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-extrabold flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5 text-amber-600" />
                                <span>{exam.pending_grading_count} to grade</span>
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Action: View Submissions */}
                        <td className="py-4 px-5 text-right">
                          <Link
                            href={`/teacher/quizzes/${exam.id}/submissions`}
                            className="inline-flex items-center justify-center gap-1.5 bg-campus-900 hover:bg-campus-800 text-white font-extrabold text-xs rounded-xl h-8 px-4 shadow-2xs transition-all active:scale-95 cursor-pointer select-none"
                          >
                            <span className="pointer-events-none">View Submissions</span>
                            <ArrowRight className="w-3.5 h-3.5 pointer-events-none" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
