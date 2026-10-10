'use client';

import React, { useState, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Upload, 
  FileUp, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  X,
  FileArchive,
  BookOpen,
  Tag
} from 'lucide-react';
import { uploadCourseMaterial } from '@/app/actions/teacher';
import { formatFileSize } from '@/lib/utils';
import type { DepartmentOption } from '@/types';

interface UploadMaterialDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  existingCourses?: string[];
  departments?: DepartmentOption[];
  defaultDepartmentId?: string | null;
}

const COMMON_COURSES = [
  'CSE-101: Introduction to Computer Systems',
  'CSE-2101: Data Structures & Algorithms',
  'CSE-3101: Database Management Systems',
  'CSE-3201: Artificial Intelligence',
  'AGR-101: Fundamentals of Agronomy',
  'AGR-202: Soil Science & Agricultural Chemistry',
  'BBA-101: Principles of Management',
  'LAW-101: Introduction to Legal Systems'
];

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'zip', 'rar', 'txt'];
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export default function UploadMaterialDialog({
  isOpen,
  onClose,
  onSuccess,
  existingCourses = [],
  departments = [],
  defaultDepartmentId = null
}: UploadMaterialDialogProps) {
  const [courseCode, setCourseCode] = useState('CSE-2101');
  const [customCourse, setCustomCourse] = useState('');
  const [isCustomCourse, setIsCustomCourse] = useState(true);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<string[]>(() => {
    return defaultDepartmentId ? [defaultDepartmentId] : [];
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-populate with default department when opened if none selected
  React.useEffect(() => {
    if (isOpen) {
      if (defaultDepartmentId && selectedDepartmentIds.length === 0) {
        setSelectedDepartmentIds([defaultDepartmentId]);
      } else if (!defaultDepartmentId && departments.length > 0 && selectedDepartmentIds.length === 0) {
        setSelectedDepartmentIds([departments[0].id]);
      }
    }
  }, [isOpen, defaultDepartmentId, departments]);

  const resetForm = () => {
    setTitle('');
    setFile(null);
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsCustomCourse(false);
    setCustomCourse('');
    setSelectedDepartmentIds(defaultDepartmentId ? [defaultDepartmentId] : (departments[0]?.id ? [departments[0].id] : []));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddDepartment = (deptId: string) => {
    if (!deptId) return;
    if (!selectedDepartmentIds.includes(deptId)) {
      setSelectedDepartmentIds((prev) => [...prev, deptId]);
    }
  };

  const handleRemoveDepartment = (deptId: string) => {
    setSelectedDepartmentIds((prev) => prev.filter((id) => id !== deptId));
  };

  const handleClose = () => {
    if (isSubmitting) return; // Prevent closing mid-upload
    resetForm();
    onClose();
  };

  const validateAndSetFile = (selectedFile: File) => {
    setErrorMessage(null);

    // Max size check (50MB)
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`File exceeds the 50MB size limit (Current: ${formatFileSize(selectedFile.size)}).`);
      return;
    }

    // Extension check
    const ext = selectedFile.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setErrorMessage(`Invalid file format .${ext}. Permitted formats: PDF, DOCX, PPTX, ZIP, TXT.`);
      return;
    }

    setFile(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      validateAndSetFile(selected);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const finalCourse = isCustomCourse ? customCourse.trim() : courseCode.split(':')[0].trim();

    if (!finalCourse) {
      setErrorMessage('Please specify a valid Course Code.');
      return;
    }

    if (!title.trim()) {
      setErrorMessage('Please provide a title for the material.');
      return;
    }

    if (!file) {
      setErrorMessage('Please select or drop a file to upload.');
      return;
    }

    if (selectedDepartmentIds.length === 0) {
      setErrorMessage('Please select at least one target department for this course material.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('course_code', finalCourse);
      formData.append('title', title.trim());
      formData.append('file', file);
      selectedDepartmentIds.forEach((deptId) => {
        formData.append('department_ids', deptId);
      });

      const res = await uploadCourseMaterial(formData);

      if (res.error) {
        setErrorMessage(res.error);
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage('Course material uploaded successfully!');
      setTimeout(() => {
        resetForm();
        onClose();
        if (onSuccess) onSuccess();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during upload.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const unselectedDepartments = departments.filter(
    (d) => !selectedDepartmentIds.includes(d.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-2xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-campus-50 border border-campus-200 flex items-center justify-center text-campus-700">
              <Upload className="w-4 h-4" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Upload Course Material
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500">
            Upload lecture notes, presentation slides, lab sheets, or syllabus documents (up to 50MB).
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Course Selection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-700">Course Identifier</label>
              <button
                type="button"
                onClick={() => setIsCustomCourse(!isCustomCourse)}
                className="text-campus-700 hover:text-campus-800 text-[11px] font-semibold underline underline-offset-2"
              >
                {isCustomCourse ? 'Select from list' : '+ Enter custom code'}
              </button>
            </div>

            {isCustomCourse ? (
              <input
                type="text"
                value={customCourse}
                onChange={(e) => setCustomCourse(e.target.value.toUpperCase())}
                placeholder="e.g. CSE-4202 or AGR-310"
                className="w-full text-xs px-3.5 py-2.5 bg-campus-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-campus-700 font-mono uppercase"
                disabled={isSubmitting}
                required
              />
            ) : (
              <select
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-campus-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-campus-700"
                disabled={isSubmitting}
              >
                {COMMON_COURSES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                {existingCourses
                  .filter((c) => !COMMON_COURSES.some((item) => item.startsWith(c)))
                  .map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
              </select>
            )}
          </div>

          {/* Target Departments Multi-Select */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-campus-700" />
                <span>Target Department(s)</span>
                <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
                {selectedDepartmentIds.length} selected
              </span>
            </div>

            {/* Selected Badges */}
            <div className="p-2.5 bg-campus-50/50 border border-slate-200 rounded-xl min-h-[46px] flex flex-wrap items-center gap-1.5">
              {selectedDepartmentIds.length === 0 ? (
                <span className="text-[11px] text-slate-400 px-1 italic">
                  Select at least one department below
                </span>
              ) : (
                selectedDepartmentIds.map((id) => {
                  const dept = departments.find((d) => d.id === id);
                  const name = dept ? dept.name : id;
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-campus-900 text-white text-xs font-semibold shadow-2xs animate-in fade-in"
                    >
                      <span className="max-w-[200px] truncate">{name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDepartment(id)}
                        disabled={isSubmitting}
                        className="p-0.5 hover:bg-campus-800 rounded text-campus-200 hover:text-white transition-colors"
                        title={`Remove ${name}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })
              )}
            </div>

            {/* Add Department Dropdown */}
            {unselectedDepartments.length > 0 && (
              <div className="pt-0.5">
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddDepartment(e.target.value);
                    }
                  }}
                  disabled={isSubmitting}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-campus-700 transition-colors"
                >
                  <option value="" disabled>
                    + Tag another department...
                  </option>
                  {unselectedDepartments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Material Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Material Title / Description
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lecture 05: Graph Traversal & BFS/DFS Slides"
              className="w-full text-xs px-3.5 py-2.5 bg-campus-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-campus-700"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* File Dropzone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              File Attachment (PDF, DOCX, PPTX, ZIP - Max 50MB)
            </label>

            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-campus-600 bg-campus-50'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-campus-50/50 hover:border-campus-300'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isSubmitting}
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-campus-700">
                    <FileUp className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800">
                      Click to browse or drop file here
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      PDF, Office documents, or ZIP archives up to 50MB
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3.5 bg-campus-50 border border-campus-200 rounded-2xl text-xs">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-white border border-campus-200 flex items-center justify-center text-campus-800 shrink-0 shadow-xs">
                    {file.name.endsWith('.zip') || file.name.endsWith('.rar') ? (
                      <FileArchive className="w-4 h-4 text-amber-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-campus-700" />
                    )}
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-slate-900 truncate max-w-[260px]">
                      {file.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {formatFileSize(file.size)} • {file.name.split('.').pop()?.toUpperCase()}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  disabled={isSubmitting}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-white transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !file || !title.trim() || selectedDepartmentIds.length === 0}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading to Cloud...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload & Publish</span>
                </>
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
