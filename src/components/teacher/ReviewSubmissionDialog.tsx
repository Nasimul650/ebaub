'use client';

import React, { useState, useEffect, useTransition } from 'react';
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
  Award,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  User,
  GraduationCap,
  Calendar,
  Loader2,
  Save,
  MessageSquare,
  FileText,
  AlertCircle
} from 'lucide-react';
import { getSubmissionDetails, updateSubmissionScore, type SubmissionDetailsResponse } from '@/app/actions/grading';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  submissionId: string | null;
  onScoreUpdated?: (submissionId: string, newScore: number) => void;
}

export default function ReviewSubmissionDialog({
  isOpen,
  onClose,
  submissionId,
  onScoreUpdated,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SubmissionDetailsResponse | null>(null);
  const [scoreInput, setScoreInput] = useState<string>('');
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Load submission details on open
  useEffect(() => {
    if (!isOpen || !submissionId) {
      setData(null);
      setErrorMsg(null);
      setSuccessMsg(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    getSubmissionDetails(submissionId)
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.submission) {
          setData(res);
          setScoreInput(res.submission.score !== null ? String(res.submission.score) : '');
          setFeedbackInput(res.submission.feedback || '');
        } else {
          setErrorMsg(res.error || 'Failed to load submission details.');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setErrorMsg(err.message || 'An error occurred.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, submissionId]);

  // Handle Save Grade
  const handleSaveGrade = () => {
    if (!submissionId) return;

    const numScore = parseFloat(scoreInput);
    if (isNaN(numScore) || numScore < 0) {
      setErrorMsg('Please enter a valid numeric score (greater than or equal to 0).');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      try {
        const res = await updateSubmissionScore(submissionId, numScore, feedbackInput);
        if (res.success) {
          setSuccessMsg(`Score successfully updated to ${numScore}!`);
          if (onScoreUpdated) {
            onScoreUpdated(submissionId, numScore);
          }
          if (data?.submission) {
            setData({
              ...data,
              submission: {
                ...data.submission,
                score: numScore,
                feedback: feedbackInput,
              },
            });
          }
        } else {
          setErrorMsg(res.error || 'Failed to update score.');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error updating score.');
      }
    });
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

  const isMcqExam = data?.quiz?.exam_type === 'mcq';
  const totalQuestions = data?.questions?.length || data?.submission?.total_questions || 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-hidden flex flex-col p-0 rounded-3xl border-slate-200 shadow-2xl bg-slate-50">
        
        {/* Header Bar */}
        <div className="bg-campus-950 text-white p-6 sm:p-7 shrink-0 border-b border-campus-900">
          <DialogHeader className="space-y-3">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-campus-800 text-campus-200 text-[11px] font-extrabold font-mono border border-campus-700/60">
                  {data?.quiz?.course_code || 'EXAM'}
                </span>
                <span className="text-[11px] font-bold text-campus-300 uppercase">
                  {data?.quiz?.exam_type || 'EXAM'} ASSESSMENT
                </span>
              </div>

              {data?.submission?.score !== null && typeof data?.submission?.score === 'number' ? (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-extrabold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Score: {data.submission.score} / {totalQuestions}</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pending Grading</span>
                </span>
              )}
            </div>

            <div>
              <DialogTitle className="text-xl sm:text-2xl font-extrabold text-white heading-display leading-tight">
                {data?.quiz?.title || 'Student Exam Paper'}
              </DialogTitle>
              <DialogDescription className="text-xs text-campus-200/90 mt-1 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1 font-semibold text-white">
                  <User className="w-3.5 h-3.5 text-campus-300" />
                  {data?.student?.full_name} ({data?.student?.institutional_id})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-campus-300">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {data?.student?.department_name}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-campus-300">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(data?.submission?.submitted_at)}
                </span>
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable Questions List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-campus-800 mx-auto" />
              <p className="text-xs text-slate-500 font-semibold">Loading student exam answers...</p>
            </div>
          ) : errorMsg && !data ? (
            <div className="p-8 text-center bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-semibold">
              <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
              {errorMsg}
            </div>
          ) : (
            <>
              {/* Messages / Alerts */}
              {successMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Questions Loop */}
              <div className="space-y-5">
                {(data?.questions || []).map((q, idx) => {
                  const isMcq = (q.question_type || '').toLowerCase() === 'mcq';
                  const studentAnswer = (q.student_answer || '').trim();
                  const correctAnswer = (q.correct_answer || '').trim();

                  return (
                    <div
                      key={q.id || idx}
                      className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4"
                    >
                      {/* Question Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-campus-100 text-campus-900 font-extrabold text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {isMcq ? 'Multiple Choice' : 'Written / Descriptive'}
                          </span>
                        </div>

                        {isMcq && (
                          <div>
                            {q.is_correct ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Correct (1/1)</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-800 text-[10px] font-extrabold flex items-center gap-1">
                                <XCircle className="w-3 h-3 text-red-600" />
                                <span>Incorrect (0/1)</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Question Text */}
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                        {q.question_text}
                      </h4>

                      {/* MCQ Display */}
                      {isMcq && Array.isArray(q.options) && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt, optIdx) => {
                            const isChosenByStudent = studentAnswer.toLowerCase() === opt.toLowerCase();
                            const isTheCorrectOption = correctAnswer.toLowerCase() === opt.toLowerCase();

                            let cardClass = 'bg-slate-50 border-slate-200 text-slate-700';
                            let icon = null;

                            if (isTheCorrectOption && isChosenByStudent) {
                              cardClass = 'bg-emerald-50/90 border-emerald-400 text-emerald-950 font-bold';
                              icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
                            } else if (isTheCorrectOption) {
                              cardClass = 'bg-emerald-50/50 border-emerald-300 text-emerald-900 font-bold';
                              icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
                            } else if (isChosenByStudent && !isTheCorrectOption) {
                              cardClass = 'bg-red-50/90 border-red-300 text-red-950 line-through';
                              icon = <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />;
                            }

                            return (
                              <div
                                key={optIdx}
                                className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-2 transition-all ${cardClass}`}
                              >
                                <span className="truncate">{opt}</span>
                                {icon}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Written Answer Display */}
                      {!isMcq && (
                        <div className="space-y-3 pt-1">
                          {/* AI Suggested Answer Rubric */}
                          {(q.suggested_answer || q.grading_rubric) && (
                            <div className="rounded-2xl bg-amber-50/80 border border-amber-200/90 p-4 space-y-1.5">
                              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-amber-900">
                                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                                <span>AI Evaluation Rubric & Suggested Answer:</span>
                              </div>
                              <p className="text-xs text-amber-950/90 leading-relaxed font-sans">
                                {q.suggested_answer || q.grading_rubric}
                              </p>
                            </div>
                          )}

                          {/* Student Written Response */}
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-campus-700" />
                              <span>Student Written Submission:</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 whitespace-pre-wrap leading-relaxed">
                              {studentAnswer || (
                                <span className="italic text-slate-400 font-sans">No answer provided by student.</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Sticky Bottom Grading Panel */}
        <div className="bg-white border-t border-slate-200/90 p-4 sm:p-5 shrink-0 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-campus-100 text-campus-800 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-campus-700" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                Final Assessment Score
              </div>
              <div className="text-[11px] text-slate-500">
                Total questions in paper: <strong>{totalQuestions}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-36">
              <Input
                type="number"
                min="0"
                step="0.5"
                value={scoreInput}
                onChange={(e) => setScoreInput(e.target.value)}
                placeholder="Final score..."
                className="text-xs h-10 font-bold rounded-xl pr-10 border-slate-300 focus:border-campus-800"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                /{totalQuestions}
              </span>
            </div>

            <Button
              type="button"
              disabled={isPending || loading}
              onClick={handleSaveGrade}
              className="bg-campus-900 hover:bg-campus-800 text-white font-extrabold text-xs rounded-xl h-10 px-5 shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  <span>Save Grade</span>
                </>
              )}
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
