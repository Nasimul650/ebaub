import React from 'react';
import Link from 'next/link';
import { 
  BookOpenCheck, 
  Download, 
  ExternalLink, 
  FileText, 
  Upload, 
  ArrowRight,
  FileSpreadsheet,
  Presentation,
  Archive
} from 'lucide-react';
import type { CourseMaterial } from '@/types';

interface Props {
  materials: CourseMaterial[];
}

export default function RecentMaterialsList({ materials }: Props) {
  const displayMaterials = materials.slice(0, 5);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const getFileIcon = (fileType?: string) => {
    const type = fileType?.toLowerCase() || '';
    if (type.includes('pdf')) return <FileText className="w-4 h-4 text-rose-600" />;
    if (type.includes('word') || type.includes('doc')) return <FileText className="w-4 h-4 text-blue-600" />;
    if (type.includes('presentation') || type.includes('ppt')) return <FileText className="w-4 h-4 text-amber-600" />;
    if (type.includes('zip') || type.includes('compress')) return <Archive className="w-4 h-4 text-purple-600" />;
    return <FileText className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-campus-700" /> Recent Course Materials
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Lecture notes, slides, and syllabus files shared with students
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href="/teacher/materials" 
            className="text-xs text-slate-600 hover:text-slate-900 font-bold hover:underline flex items-center gap-1"
          >
            Manage All ({materials.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link 
            href="/teacher/materials" 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs shadow-2xs transition-all"
          >
            <Upload className="w-3.5 h-3.5" /> Upload Material
          </Link>
        </div>
      </div>

      {displayMaterials.length === 0 ? (
        <div className="text-center py-10 px-4 rounded-2xl bg-campus-50/50 border border-dashed border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-campus-100 text-campus-900 mx-auto flex items-center justify-center shadow-2xs">
            <BookOpenCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">No Course Materials Uploaded Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Upload PDF lecture slides, syllabus sheets, and assignments for your students to access.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/teacher/materials"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs shadow-xs transition-all"
            >
              <Upload className="w-3.5 h-3.5" /> Upload First Document &rarr;
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {displayMaterials.map((mat) => (
            <div 
              key={mat.id}
              className="p-4 rounded-2xl bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 hover:border-campus-300/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-campus-400 transition-colors">
                  {getFileIcon(mat.file_type || mat.file_name)}
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-campus-100 text-campus-900">
                      {mat.course_code}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {formatFileSize(mat.file_size)}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm truncate max-w-md group-hover:text-campus-900 transition-colors">
                    {mat.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    {mat.file_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 shrink-0">
                <a
                  href={mat.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
