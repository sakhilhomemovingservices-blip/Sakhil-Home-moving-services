import React from 'react';
import { TeamMember, Language } from '../types';
import {
  Users,
  ShieldCheck,
  Star,
  CheckCircle2,
  Phone,
  Sparkles,
  Award,
} from 'lucide-react';

interface CrewMembersSectionProps {
  teamMembers: TeamMember[];
  currentLang: Language;
  businessName: string;
}

export const CrewMembersSection: React.FC<CrewMembersSectionProps> = ({
  teamMembers,
  currentLang,
  businessName,
}) => {
  if (!teamMembers || teamMembers.length === 0) return null;

  return (
    <div className="space-y-3.5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-blue-100 text-blue-700">
              <Users className="w-4 h-4 text-blue-600" />
            </span>
            <h4 className="text-sm font-black text-slate-900">
              {currentLang === 'ar'
                ? 'فريق العمل والكوادر الفنية المعتمدة'
                : currentLang === 'ur'
                ? 'مصدقہ کاریگر اور عملہ'
                : 'Certified Moving Crew & Technicians'}
            </h4>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>إقامات وتصاريح نظامية 100%</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {currentLang === 'ar'
              ? `تعرف على النجارين والفنيين الذين سينفذون عملية النقل والتغليف في منزلك من ${businessName}`
              : `Meet the verified carpenters, technicians, and drivers executing your relocation`}
          </p>
        </div>

        <span className="text-[11px] font-bold text-slate-400">
          {teamMembers.length} {currentLang === 'ar' ? 'فنيين معتمدين' : 'Certified Techs'}
        </span>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:border-blue-400 hover:shadow-md transition-all flex gap-3.5 items-start group shadow-2xs"
          >
            {/* Worker Portrait */}
            <div className="relative shrink-0">
              <img
                src={member.photo}
                alt={member.name}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
              />
              {member.isVerifiedIqama && (
                <div
                  className="absolute -bottom-1 -end-1 bg-emerald-600 text-white p-1 rounded-full ring-2 ring-white shadow-xs"
                  title="إقامة وتصريح نظامي موثق"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-start justify-between gap-1">
                <div>
                  <h5 className="font-black text-xs sm:text-sm text-slate-900 leading-tight truncate">
                    {member.name}
                  </h5>
                  <div className="text-[11px] font-semibold text-blue-700 leading-tight mt-0.5">
                    {member.role}
                  </div>
                </div>

                {member.rating && (
                  <div className="flex items-center gap-0.5 text-amber-500 text-[11px] font-bold shrink-0 bg-amber-50 px-1.5 py-0.5 rounded-md">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{member.rating}</span>
                  </div>
                )}
              </div>

              {/* Experience & Nationality */}
              <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-0.5">
                <span className="flex items-center gap-1 font-bold text-slate-700">
                  <Award className="w-3 h-3 text-emerald-600" />
                  <span>خبرة {member.experienceYears} سنوات</span>
                </span>
                {member.nationality && (
                  <>
                    <span>•</span>
                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                      الجنسية: {member.nationality}
                    </span>
                  </>
                )}
              </div>

              {/* Specialties */}
              {member.specialties && member.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {member.specialties.slice(0, 3).map((spec, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.2 rounded-md font-medium truncate"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
