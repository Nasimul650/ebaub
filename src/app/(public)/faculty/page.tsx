import React from 'react';
import { Mail, Phone, BookOpen, User, Award } from 'lucide-react';
import { getFacultyMembers, getDepartments } from '@/lib/mock/mockServices';

export default async function FacultyPage() {
  const [facultyMembers, departments] = await Promise.all([
    getFacultyMembers(),
    getDepartments()
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          Faculty Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Distinguished EBAUB Professors & Faculty Members
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Meet the dedicated educators, researchers, and technical leaders guiding students across our academic departments.
        </p>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {facultyMembers.map(member => {
          const dept = departments.find(d => d.id === member.departmentId);
          return (
            <div key={member.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 hover:border-slate-700 transition-colors flex flex-col justify-between">
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {member.imageUrl ? (
                    <img src={member.imageUrl} alt={member.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-700" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
                      <User className="w-8 h-8" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-base text-white">{member.name}</h3>
                    <p className="text-xs text-amber-400 font-semibold">{member.designation}</p>
                    <p className="text-[11px] text-slate-400">{dept?.title}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {member.bio}
                </p>

                {member.researchInterests.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Research Interests</span>
                    <div className="flex flex-wrap gap-1.5">
                      {member.researchInterests.map((interest, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-emerald-300 text-[10px] font-medium border border-slate-700/60">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact strip */}
              <div className="pt-4 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                {member.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <a href={`mailto:${member.email}`} className="hover:underline hover:text-white truncate">{member.email}</a>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{member.phone}</span>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
