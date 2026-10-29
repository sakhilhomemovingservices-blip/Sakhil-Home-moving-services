import React, { useState } from 'react';
import { BusinessProfile, Language, ReportItem, UserAccount } from '../types';
import { translations } from '../data/translations';
import {
  ShieldCheck,
  Users,
  Building,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Lock,
  Search,
  ExternalLink,
} from 'lucide-react';

interface AdminPanelProps {
  currentLang: Language;
  businesses: BusinessProfile[];
  onToggleVerifyBusiness: (businessId: string) => void;
  onDeleteBusiness: (businessId: string) => void;
  reports: ReportItem[];
  onResolveReport: (reportId: string, action: 'resolved' | 'dismissed') => void;
  users: UserAccount[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentLang,
  businesses,
  onToggleVerifyBusiness,
  onDeleteBusiness,
  reports,
  onResolveReport,
  users,
}) => {
  const t = translations[currentLang];
  const [activeTab, setActiveTab] = useState<'listings' | 'reports' | 'users'>('listings');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredBusinesses = businesses.filter(
    (b) =>
      b.name.ar.includes(searchFilter) ||
      b.name.en.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.city.includes(searchFilter)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Title Card */}
      <div className="bg-radial from-purple-900 to-slate-950 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black">{t.adminPanel}</h2>
              <span className="bg-purple-500/30 text-purple-200 text-xs px-2 py-0.5 rounded-full font-bold">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-purple-200 mt-1">
              {currentLang === 'ar'
                ? 'إدارة المنشآت والتحقق من السجلات التجارية والرقابة على المحتوى ومكافحة الشركات الوهمية'
                : 'Commercial Registration verification, listing approvals, spam & fraud moderation'}
            </p>
          </div>
        </div>

        {/* Global Stats Counter */}
        <div className="flex items-center gap-3 text-xs">
          <div className="bg-white/10 px-3.5 py-2 rounded-xl border border-white/10">
            <span className="text-slate-300 block">إجمالي الشركات</span>
            <span className="text-lg font-black text-white">{businesses.length}</span>
          </div>
          <div className="bg-white/10 px-3.5 py-2 rounded-xl border border-white/10">
            <span className="text-slate-300 block">بلاغات نشطة</span>
            <span className="text-lg font-black text-amber-400">
              {reports.filter((r) => r.status === 'pending').length}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 text-xs font-bold text-slate-600">
        <button
          onClick={() => setActiveTab('listings')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'listings'
              ? 'border-purple-600 text-purple-700 bg-purple-50/50 rounded-t-xl'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>إدارة منشآت نقل العفش ({businesses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors relative ${
            activeTab === 'reports'
              ? 'border-purple-600 text-purple-700 bg-purple-50/50 rounded-t-xl'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>شكاوى وبلاغات المحتوى ({reports.length})</span>
          {reports.filter((r) => r.status === 'pending').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'users'
              ? 'border-purple-600 text-purple-700 bg-purple-50/50 rounded-t-xl'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>المستخدمين وأصحاب الحسابات ({users.length})</span>
        </button>
      </div>

      {/* TAB 1: BUSINESS LISTINGS & CR VERIFICATION */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute start-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="ابحث باسم المنشأة أو المدينة..."
                className="w-full ps-9 pe-4 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50"
              />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              التحقق من السجل التجاري (CR) يمنح المنشأة شارة التوثيق الخضراء في التطبيق.
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50">
                  <th className="py-3 px-3 text-start">المنشأة</th>
                  <th className="py-3 px-3 text-start">المدينة</th>
                  <th className="py-3 px-3 text-start">رقم السجل التجاري (CR)</th>
                  <th className="py-3 px-3 text-start">حالة التوثيق</th>
                  <th className="py-3 px-3 text-start">الأسطول</th>
                  <th className="py-3 px-3 text-start">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBusinesses.map((biz) => (
                  <tr key={biz.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={biz.logo}
                          alt={biz.name.ar}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{biz.name.ar}</div>
                          <div className="text-[10px] text-slate-400">{biz.ownerEmail}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-700">{biz.city}</td>

                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {biz.crNumber || 'قيد التدقيق'}
                    </td>

                    <td className="py-3 px-3">
                      {biz.isVerified ? (
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          موثق ومعتمد
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-1 text-[11px]">
                          غير معتمد
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 font-medium text-slate-600">
                      {biz.truckFleetSize} دينا
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onToggleVerifyBusiness(biz.id)}
                          className={`px-3 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
                            biz.isVerified
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {biz.isVerified ? 'إلغاء التوثيق' : 'اعتماد وتوثيق'}
                        </button>

                        <button
                          onClick={() => onDeleteBusiness(biz.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-md cursor-pointer"
                          title="حذف القيد"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: REPORTS & SPAM MODERATION */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-black text-slate-900">
            شكاوى المستخدمين وبلاغات مكافحة الاحتيال
          </h3>

          {reports.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              لا توجد بلاغات معلقة حالياً. المنصة آمنة ومحمية.
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      منشأة: {rep.businessName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        rep.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {rep.status === 'resolved' ? 'تمت المعالجة' : 'قيد المراجعة'}
                    </span>
                  </div>

                  <p className="text-slate-700 font-medium">السبب: {rep.reason}</p>
                  <p className="text-slate-600">{rep.details}</p>
                  <div className="text-[10px] text-slate-400">
                    مقدم البلاغ: {rep.reporterEmail} • {rep.createdAt}
                  </div>

                  {rep.status === 'pending' && (
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => onResolveReport(rep.id, 'resolved')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs cursor-pointer"
                      >
                        إغلاق البلاغ واتخاذ الإجراء
                      </button>
                      <button
                        onClick={() => onResolveReport(rep.id, 'dismissed')}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-1.5 px-3 rounded-lg text-xs cursor-pointer"
                      >
                        تجاهل
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: USERS & ACCOUNTS */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-black text-slate-900">
            حسابات المستخدمين المسجلة
          </h3>

          <div className="divide-y divide-slate-100">
            {users.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-bold px-2 py-0.5 rounded-md text-[10px] capitalize ${
                      u.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : u.role === 'owner'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
