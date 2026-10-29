import React, { useState } from 'react';
import { BusinessProfile, Language, ReportItem } from '../types';
import { translations } from '../data/translations';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  business: BusinessProfile | null;
  currentLang: Language;
  onClose: () => void;
  onSubmitReport: (report: Omit<ReportItem, 'id' | 'createdAt'>) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  business,
  currentLang,
  onClose,
  onSubmitReport,
}) => {
  const t = translations[currentLang];
  const [reason, setReason] = useState<ReportItem['reason']>('fake_profile');
  const [details, setDetails] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!business) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    onSubmitReport({
      businessId: business.id,
      businessName: business.name[currentLang] || business.name.ar,
      reporterEmail: reporterEmail || 'anonymous@user.sa',
      reason,
      details,
      status: 'pending',
    });

    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="bg-rose-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-300" />
            <h3 className="font-black text-base">{t.reportProfile}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-slate-900 text-base">تم إرسال البلاغ للإدارة بنجاح</h4>
            <p className="text-xs text-slate-500">
              يقوم فريق الرقابة والتفتيش في MoveConnect بمراجعة السجل التجاري والبيانات ومطابقتها
              لحماية المستخدمين.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">المنشأة المبلغ عنها:</span>
              <span className="font-bold text-slate-900 text-sm">
                {business.name[currentLang] || business.name.ar}
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">{t.reportReason} *</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
              >
                <option value="fake_profile">منشأة وهمية أو بدون سجل تجاري حقيقي</option>
                <option value="misleading_pricing">أسعار مضللة أو طلب مبالغ خارج الاتفاق</option>
                <option value="inappropriate_media">صور مسروقة أو غير لائقة</option>
                <option value="no_license">عدم وجود ترخيص نقل معتمد</option>
                <option value="poor_conduct">سوء تعامل أو إتلاف للأثاث دون تعويض</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">{t.reportDetails} *</label>
              <textarea
                rows={3}
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="اشرح المشكلة بالتفصيل لمساعدة فريق المراجعة..."
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                بريدك الإلكتروني (للمتابعة)
              </label>
              <input
                type="email"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {t.submitReport}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
