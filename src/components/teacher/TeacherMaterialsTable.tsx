'use client';

import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Trash2, 
  ExternalLink, 
  Search, 
  Filter, 
  Upload, 
  FileArchive, 
  FileSpreadsheet, 
  Presentation, 
  Loader2, 
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import type { CourseMaterial } from '@/types';
import { formatFileSize } from '@/lib/utils';
import { deleteCourseMaterial } from '@/app/actions/teacher';
import UploadMaterialDialog from './UploadMaterialDialog';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

interface TeacherMaterialsTableProps {
  initialMaterials: CourseMaterial[];
}

export default function TeacherMaterialsTable({ initialMaterials }: TeacherMaterialsTableProps) {
  const [materials, setMaterials] = useState<CourseMaterial[]>(initialMaterials);
  const [selectedCourse, setSelectedCourse] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  // Delete modal state
  const [deletingMaterial, setDeletingMaterial] = useState<CourseMaterial | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Sync state if initialMaterials changes
  React.useEffect(() => {
    setMaterials(initialMaterials);
  }, [initialMaterials]);

  // Unique course codes for filter dropdown
  const uniqueCourses = useMemo(() => {
    const set = new Set<string>();
    materials.forEach((m) => {
      if (m.course_code) set.add(m.course_code);
    });
    return Array.from(set).sort();
  }, [materials]);

  // Filtered materials
  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      const matchesCourse = selectedCourse === 'ALL' || m.course_code === selectedCourse;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = 
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.file_name.toLowerCase().includes(q) ||
        m.course_code.toLowerCase().includes(q);

      return matchesCourse && matchesQuery;
    });
  }, [materials, selectedCourse, searchQuery]);

  const handleDeleteConfirm = async () => {
    if (!deletingMaterial) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await deleteCourseMaterial(deletingMaterial.id, deletingMaterial.file_url);
      if (res.error) {
        setDeleteError(res.error);
        setIsDeleting(false);
        return;
      }

      // Optimistically remove from state
      setMaterials((prev) => prev.filter((m) => m.id !== deletingMaterial.id));
      setDeletingMaterial(null);
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete material.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getFileIcon = (fileName: string, mime: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (ext === 'zip' || ext === 'rar' || mime.includes('zip')) {
      return <FileArchive className="w-4 h-4 text-amber-600" />;
    }
    if (ext === 'ppt' || ext === 'pptx' || mime.includes('presentation')) {
      return <Presentation className="w-4 h-4 text-orange-600" />;
    }
    if (ext === 'xls' || ext === 'xlsx' || mime.includes('spreadsheet')) {
      return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
    }
    return <FileText className="w-4 h-4 text-blue-600" />;
  };

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Action Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-campus-50 border border-campus-200 text-campus-800 text-[11px] font-bold tracking-wide uppercase mb-1">
            Teacher Portal
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 heading-display tracking-tight">
            Course Materials & Lecture Notes
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload, organize, and manage lecture slides, lab manuals, and syllabus files for students.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <Upload className="w-4 h-4 text-campus-300" />
          <span>Upload New Material</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, file name, or course..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-campus-700 shadow-2xs"
          />
        </div>

        {/* Course Filter Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Course:</span>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-campus-700 shadow-2xs"
          >
            <option value="ALL">All Courses ({materials.length})</option>
            {uniqueCourses.map((c) => (
              <option key={c} value={c}>
                {c} ({materials.filter((m) => m.course_code === c).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left min-w-[760px]">
            <thead className="bg-campus-50/80 text-slate-500 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4 w-[40%]">Title & File Name</th>
                <th className="p-4 w-[18%]">Course</th>
                <th className="p-4 w-[14%]">Size</th>
                <th className="p-4 w-[16%]">Upload Date</th>
                <th className="p-4 w-[12%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredMaterials.map((mat) => (
                <tr key={mat.id} className="hover:bg-campus-50/50 transition-colors group">
                  {/* Title & File Name */}
                  <td className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-white group-hover:border-campus-300 transition-colors">
                        {getFileIcon(mat.file_name, mat.file_type)}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-extrabold text-slate-900 line-clamp-1 group-hover:text-campus-900 transition-colors">
                          {mat.title}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono truncate max-w-[280px]">
                          {mat.file_name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Course */}
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-campus-100/70 text-campus-900 font-extrabold text-[11px] border border-campus-200/60 font-mono">
                      {mat.course_code}
                    </span>
                  </td>

                  {/* Size */}
                  <td className="p-4 font-medium text-slate-600">
                    {formatFileSize(mat.file_size)}
                  </td>

                  {/* Upload Date */}
                  <td className="p-4 text-slate-500">
                    {formatDate(mat.created_at)}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      {/* View / Download */}
                      <a
                        href={mat.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 hover:bg-campus-100 text-slate-600 hover:text-campus-900 transition-colors"
                        title="Download / View File"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          setDeleteError(null);
                          setDeletingMaterial(mat);
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors"
                        title="Delete Material"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Empty State */}
              {filteredMaterials.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <div className="max-w-xs mx-auto flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                        <FolderOpen className="w-6 h-6" />
                      </div>
                      <div className="font-bold text-slate-800 text-sm mt-1">
                        No materials found
                      </div>
                      <p className="text-xs text-slate-400">
                        {searchQuery || selectedCourse !== 'ALL'
                          ? 'No course files match the selected filter or search keyword.'
                          : 'You have not uploaded any lecture files or syllabus materials yet.'}
                      </p>
                      <button
                        onClick={() => setIsUploadOpen(true)}
                        className="mt-2 text-xs font-bold text-campus-800 hover:underline"
                      >
                        + Upload your first material
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Dialog Modal */}
      <UploadMaterialDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        existingCourses={uniqueCourses}
        onSuccess={() => {
          // Re-fetch or window refresh to ensure sync
          window.location.reload();
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={!!deletingMaterial} 
        onOpenChange={(open) => !open && !isDeleting && setDeletingMaterial(null)}
      >
        <DialogContent className="max-w-md p-6 bg-white rounded-3xl border border-slate-200 shadow-2xl">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Delete Course Material
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500">
              Are you sure you want to permanently delete this material?
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold">
              {deleteError}
            </div>
          )}

          {deletingMaterial && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
              <div className="font-bold text-slate-900">{deletingMaterial.title}</div>
              <div className="text-[11px] text-slate-500 font-mono truncate">
                {deletingMaterial.course_code} • {deletingMaterial.file_name} ({formatFileSize(deletingMaterial.file_size)})
              </div>
            </div>
          )}

          <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => setDeletingMaterial(null)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Delete Material</span>
                </>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
