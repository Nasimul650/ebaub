import React from 'react';
import { Mail, Phone, User } from 'lucide-react';
import { FacultyMember, Department } from '@/types';

interface Props {
  members: FacultyMember[];
  departments: Department[];
}

export default function FacultyCardsGrid({ members, departments }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {members.map(member => {
        const dept = departments.find(d => d.id === member.departmentId);
        return (
          <div key={member.id} className="clean-card bg-white rounded-3xl p-6 space-y-5 flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {member.imageUrl ? (
                  <img src={member.imageUrl} alt={member.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-200" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <User className="w-8 h-8" />
                  </div>
                )}
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{member.name}</h3>
                  <p className="text-xs text-campus-800 font-bold">{member.designation}</p>
                  <p className="text-[11px] text-slate-500">{dept?.title}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {member.bio}
              </p>

              {member.researchInterests.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Research Interests</span>
                  <div className="flex flex-wrap gap-1.5">
                    {member.researchInterests.map((interest, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-50 text-slate-700 text-[10px] font-semibold border border-slate-200">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact strip */}
            <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              {member.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-campus-700 shrink-0" />
                  <a href={`mailto:${member.email}`} className="hover:underline hover:text-slate-900 truncate">{member.email}</a>
                </div>
              )}
              {member.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-campus-700 shrink-0" />
                  <span>{member.phone}</span>
                </div>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
}
