'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Award,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  HelpCircle,
  FileCheck,
  Search,
  RotateCcw,
  GraduationCap,
  Layers,
  BarChart3,
  Calendar,
  Filter,
  X,
  User,
  BookMarked
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ExamSummary } from '@/app/actions/exam';

interface Props {
  officialExams: ExamSummary[];
  practiceQuizzes: ExamSummary[];
  studentName: string;
  studentFaculty?: string;
  studentDepartment?: string;
}

export default function StudentExamDashboardClient({
  officialExams = [],
  practiceQuizzes = [],
  studentName,
  studentFaculty = '',
  studentDepartment = '',
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'official' | 'practice'>('official');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');

  // Format date helper
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

  // Dynamically extract unique course codes
  const officialCourses = useMemo(() => {
    const set = new Set<string>();
    officialExams.forEach((e) => {
      if (e.course_code) set.add(e.course_code.trim());
    });
    return Array.from(set).sort();
  }, [officialExams]);

  const practiceCourses = useMemo(() => {
    const set = new Set<string>();
    practiceQuizzes.forEach((e) => {
      if (e.course_code) set.add(e.course_code.trim());
    });
    return Array.from(set).sort();
  }, [practiceQuizzes]);

  // Dynamically extract unique teacher names
  const officialTeachers = useMemo(() => {
    const set = new Set<string>();
    officialExams.forEach((e) => {
      if (e.teacher_name) set.add(e.teacher_name.trim());
    });
    return Array.from(set).sort();
  }, [officialExams]);

  // Check if any filter is active
  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    selectedType !== 'all' ||
    selectedCourse !== 'all' ||
    selectedTeacher !== 'all'
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedCourse('all');
    setSelectedTeacher('all');
  };

  // Filter exams based on all criteria
  const filteredOfficial = useMemo(() => {
    return officialExams.filter((exam) => {
      // 1. Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        exam.title.toLowerCase().includes(q) ||
        exam.course_code.toLowerCase().includes(q) ||
        (exam.teacher_name && exam.teacher_name.toLowerCase().includes(q));

      // 2. Exam / Question Type
      const matchesType =
        selectedType === 'all' ||
        exam.exam_type?.toLowerCase() === selectedType.toLowerCase();

      // 3. Course Code
      const matchesCourse =
        selectedCourse === 'all' ||
        exam.course_code.toLowerCase() === selectedCourse.toLowerCase();

      // 4. Teacher
      const matchesTeacher =
        selectedTeacher === 'all' ||
        (exam.teacher_name && exam.teacher_name.toLowerCase() === selectedTeacher.toLowerCase());

      return matchesSearch && matchesType && matchesCourse && matchesTeacher;
    });
  }, [officialExams, searchQuery, selectedType, selectedCourse, selectedTeacher]);

  const filteredPractice = useMemo(() => {
    return practiceQuizzes.filter((exam) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        exam.title.toLowerCase().includes(q) ||
        exam.course_code.toLowerCase().includes(q);

      const matchesType =
        selectedType === 'all' ||
        exam.exam_type?.toLowerCase() === selectedType.toLowerCase();

      const matchesCourse =
        selectedCourse === 'all' ||
        exam.course_code.toLowerCase() === selectedCourse.toLowerCase();

      return matchesSearch && matchesType && matchesCourse;
    });
  }, [practiceQuizzes, searchQuery, selectedType, selectedCourse]);

  // Calculate quick stats
  const completedOfficialCount = officialExams.filter(
    (e) => e.submission_status !== 'Not Started'
  ).length;

  const gradedOfficialWithScore = officialExams.filter(
    (e) => typeof e.score === 'number' && e.total_questions
  );

  const avgScore = gradedOfficialWithScore.length > 0
    ? Math.round(
        gradedOfficialWithScore.reduce(
          (acc, curr) => acc + ((curr.score! / (curr.total_questions || 1)) * 100),
          0
        ) / gradedOfficialWithScore.length
      )
    : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-campus-950 via-campus-900 to-campus-850 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-campus-800/80 border border-campus-700/60 text-campus-200 text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-campus-300" />
              <span>Student Examination Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold heading-display tracking-tight text-white">
              Exams & AI Practice Arena
            </h1>
            <p className="text-xs sm:text-sm text-campus-200/90 leading-relaxed">
              Take official course examinations published by university faculty, view detailed score breakdowns, and generate unlimited AI practice quizzes on any subject.
            </p>

            {/* Department & Faculty Alignment Pill */}
            {(studentFaculty || studentDepartment) && (
              <div className="pt-2 flex items-center gap-2 text-xs font-medium text-campus-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                <span>Curriculum Aligned:</span>
                <span className="font-bold text-white bg-campus-800/80 px-2.5 py-0.5 rounded-lg border border-campus-700/60">
                  {[studentDepartment, studentFaculty].filter(Boolean).join(' • ')}
                </span>
              </div>
            )}
          </div>

          {/* Quick Action Button */}
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link
              href="/student/exams/practice/new"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-campus-950 font-extrabold text-xs rounded-2xl h-11 px-5 shadow-sm transition-transform active:scale-95 cursor-pointer select-none"
            >
              <Sparkles className="w-4 h-4 text-campus-800 pointer-events-none" />
              <span className="pointer-events-none">Generate Practice Test</span>
            </Link>
          </div>
        </div>

        {/* Stats Pill Row */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-campus-800/80">
          <div className="bg-campus-900/60 border border-campus-700/40 rounded-2xl p-3">
            <div className="text-[11px] text-campus-300 font-medium">Official Exams</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{officialExams.length} Total</div>
          </div>
          <div className="bg-campus-900/60 border border-campus-700/40 rounded-2xl p-3">
            <div className="text-[11px] text-campus-300 font-medium">Completed Tests</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{completedOfficialCount} Submissions</div>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-campus-900/60 border border-campus-700/40 rounded-2xl p-3">
            <div className="text-[11px] text-campus-300 font-medium">Average Performance</div>
            <div className="text-xl font-extrabold text-white mt-0.5">
              {avgScore !== null ? `${avgScore}%` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-campus-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200/80 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('official')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'official'
              ? 'bg-white text-campus-950 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Official Exams</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === 'official' ? 'bg-campus-100 text-campus-900' : 'bg-slate-200 text-slate-600'
            }`}
          >
            {officialExams.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('practice')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'practice'
              ? 'bg-white text-campus-950 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Practice Arena</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === 'practice' ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-600'
            }`}
          >
            {practiceQuizzes.length}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Filter className="w-4 h-4 text-campus-700" />
            <span>Filter Exams & Quizzes</span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, code, teacher..."
              className="pl-8 bg-slate-50/70 border-slate-200 text-xs h-9 rounded-xl focus:bg-white"
            />
          </div>

          {/* Filter by Type */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-50/70 hover:bg-slate-100/70 border border-slate-200 text-slate-800 text-xs h-9 rounded-xl px-3 font-medium focus:outline-none focus:border-campus-700 cursor-pointer"
            >
              <option value="all">All Question Types</option>
              <option value="mcq">Multiple Choice (MCQ)</option>
              <option value="short_answer">Short Answer</option>
              <option value="creative">Creative / Descriptive</option>
            </select>
          </div>

          {/* Filter by Course */}
          <div>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full bg-slate-50/70 hover:bg-slate-100/70 border border-slate-200 text-slate-800 text-xs h-9 rounded-xl px-3 font-medium focus:outline-none focus:border-campus-700 cursor-pointer"
            >
              <option value="all">All Courses</option>
              {(activeTab === 'official' ? officialCourses : practiceCourses).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Teacher (Official Tab only) */}
          {activeTab === 'official' ? (
            <div>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-full bg-slate-50/70 hover:bg-slate-100/70 border border-slate-200 text-slate-800 text-xs h-9 rounded-xl px-3 font-medium focus:outline-none focus:border-campus-700 cursor-pointer"
              >
                <option value="all">All Instructors</option>
                {officialTeachers.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center text-[11px] text-slate-500 italic px-2">
              Showing student-generated practice tests
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OFFICIAL EXAMS                                    */}
      {/* ========================================================= */}
      {activeTab === 'official' && (
        <div className="space-y-4">
          {filteredOfficial.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 bg-white space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-campus-50 border border-campus-200 text-campus-800 flex items-center justify-center mx-auto">
                <FileCheck className="w-7 h-7" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                {hasActiveFilters ? 'No matching official exams found' : 'No official exams currently published'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {hasActiveFilters
                  ? 'Try clearing your filters or search query to see all published exams for your faculty.'
                  : studentFaculty || studentDepartment
                  ? `There are currently no live published exams for ${[studentDepartment, studentFaculty].filter(Boolean).join(' / ')}. Check back soon or practice in the Arena!`
                  : 'Your course professors have not published any live exams yet. You can generate custom practice quizzes in the Practice Arena.'}
              </p>
              {hasActiveFilters ? (
                <div className="pt-2">
                  <Button
                    onClick={handleResetFilters}
                    variant="outline"
                    className="text-xs rounded-xl border-slate-200"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="pt-2">
                  <Button
                    onClick={() => setActiveTab('practice')}
                    variant="outline"
                    className="text-xs rounded-xl border-slate-200"
                  >
                    Go to Practice Arena &rarr;
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOfficial.map((exam) => {
                const isCompleted = exam.submission_status !== 'Not Started';
                const hasScore = typeof exam.score === 'number' && exam.total_questions;
                const scorePercent = hasScore ? Math.round((exam.score! / exam.total_questions!) * 100) : null;

                return (
                  <div
                    key={exam.id}
                    className="bg-white border border-slate-200/90 hover:border-campus-400 rounded-3xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Header tags */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-campus-50 border border-campus-200 text-campus-900 text-[10px] font-extrabold">
                          {exam.course_code}
                        </span>

                        {/* Status Badge */}
                        {exam.submission_status === 'Graded' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Score: {exam.score}/{exam.total_questions} ({scorePercent}%)</span>
                          </span>
                        ) : exam.submission_status === 'Completed' ? (
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-extrabold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-blue-600" />
                            <span>Completed</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                            Not Started
                          </span>
                        )}
                      </div>

                      {/* Title & Exam Meta */}
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 line-clamp-2">
                          {exam.title}
                        </h3>

                        {/* Instructor line */}
                        {exam.teacher_name && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                            <User className="w-3 h-3 text-slate-400" />
                            <span className="truncate">Instructor: <strong className="text-slate-700 font-bold">{exam.teacher_name}</strong></span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1.5">
                          <span className="uppercase font-mono font-bold text-slate-600">{exam.exam_type}</span>
                          <span>•</span>
                          <span>{exam.question_count} Questions</span>
                          <span>•</span>
                          <span>{formatDate(exam.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons - DIRECT <Link> tags with 100% full hitbox */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      {isCompleted ? (
                        <>
                          <Link
                            href={`/student/exams/${exam.id}/results`}
                            className="flex-1 inline-flex items-center justify-center rounded-xl text-xs font-bold h-9 border border-slate-200 bg-white text-slate-800 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer select-none"
                          >
                            <span className="pointer-events-none">View Results</span>
                          </Link>
                          <Link
                            href={`/student/exams/${exam.id}/take`}
                            className="inline-flex items-center justify-center gap-1 bg-campus-900 hover:bg-campus-800 text-white font-bold rounded-xl text-xs h-9 px-3.5 shadow-2xs transition-all cursor-pointer select-none"
                          >
                            <RotateCcw className="w-3 h-3 pointer-events-none" />
                            <span className="pointer-events-none">Retake</span>
                          </Link>
                        </>
                      ) : (
                        <Link
                          href={`/student/exams/${exam.id}/take`}
                          className="w-full inline-flex items-center justify-center gap-1.5 bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs rounded-xl h-10 shadow-2xs transition-all cursor-pointer select-none active:scale-[0.98]"
                        >
                          <span className="pointer-events-none">Start Exam</span>
                          <ArrowRight className="w-3.5 h-3.5 pointer-events-none" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: PRACTICE ARENA                                    */}
      {/* ========================================================= */}
      {activeTab === 'practice' && (
        <div className="space-y-4">
          {/* Header Action Banner for Practice Arena */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Custom AI Practice Arena</h3>
                <p className="text-xs text-slate-600">
                  Generate realistic exam simulations on any chapter, lecture notes, or textbook topic.
                </p>
              </div>
            </div>

            <Link
              href="/student/exams/practice/new"
              className="inline-flex items-center justify-center gap-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl h-9 px-4 shrink-0 shadow-2xs cursor-pointer select-none"
            >
              <Plus className="w-4 h-4 pointer-events-none" />
              <span className="pointer-events-none">Generate New Practice Test</span>
            </Link>
          </div>

          {filteredPractice.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 bg-white space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
                <HelpCircle className="w-7 h-7" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                {hasActiveFilters ? 'No matching practice tests found' : 'No practice quizzes created yet'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {hasActiveFilters
                  ? 'Try a different search term or reset filters.'
                  : 'You have not created any AI practice quizzes yet. Create one now to test your conceptual knowledge and exam preparedness.'}
              </p>
              {hasActiveFilters ? (
                <div className="pt-2">
                  <Button
                    onClick={handleResetFilters}
                    variant="outline"
                    className="text-xs rounded-xl border-slate-200"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="pt-2">
                  <Link
                    href="/student/exams/practice/new"
                    className="inline-flex items-center justify-center gap-1.5 bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs rounded-xl h-10 px-5 shadow-2xs cursor-pointer select-none"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-campus-300 pointer-events-none" />
                    <span className="pointer-events-none">Create Your First Practice Quiz</span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPractice.map((quiz) => {
                const isCompleted = quiz.submission_status !== 'Not Started';
                const hasScore = typeof quiz.score === 'number' && quiz.total_questions;
                const scorePercent = hasScore ? Math.round((quiz.score! / quiz.total_questions!) * 100) : null;

                return (
                  <div
                    key={quiz.id}
                    className="bg-white border border-slate-200/90 hover:border-amber-400 rounded-3xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Header tags */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-extrabold">
                          {quiz.course_code}
                        </span>

                        {isCompleted && hasScore ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Score: {quiz.score}/{quiz.total_questions} ({scorePercent}%)</span>
                          </span>
                        ) : isCompleted ? (
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-extrabold">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                            Not Taken
                          </span>
                        )}
                      </div>

                      {/* Title & Exam Meta */}
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 line-clamp-2">
                          {quiz.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1.5">
                          <span className="uppercase font-mono font-bold text-slate-600">{quiz.exam_type}</span>
                          <span>•</span>
                          <span>{quiz.question_count} Questions</span>
                          <span>•</span>
                          <span>{formatDate(quiz.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons - DIRECT <Link> tags with full hitbox */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      {isCompleted ? (
                        <>
                          <Link
                            href={`/student/exams/${quiz.id}/results`}
                            className="flex-1 inline-flex items-center justify-center rounded-xl text-xs font-bold h-9 border border-slate-200 bg-white text-slate-800 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer select-none"
                          >
                            <span className="pointer-events-none">Review</span>
                          </Link>
                          <Link
                            href={`/student/exams/${quiz.id}/take`}
                            className="inline-flex items-center justify-center gap-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs h-9 px-3.5 shadow-2xs transition-all cursor-pointer select-none"
                          >
                            <RotateCcw className="w-3 h-3 pointer-events-none" />
                            <span className="pointer-events-none">Retake</span>
                          </Link>
                        </>
                      ) : (
                        <Link
                          href={`/student/exams/${quiz.id}/take`}
                          className="w-full inline-flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl h-10 shadow-2xs transition-all cursor-pointer select-none active:scale-[0.98]"
                        >
                          <span className="pointer-events-none">Take Practice Test</span>
                          <ArrowRight className="w-3.5 h-3.5 pointer-events-none" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
