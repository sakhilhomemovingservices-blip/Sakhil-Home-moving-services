import React, { useState } from 'react';
import { BusinessProfile, Language } from '../types';
import {
  MapPin,
  Phone,
  Globe,
  Clock,
  Star,
  Share2,
  Navigation,
  CheckCircle2,
  X,
  Search,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Sparkles,
  Camera,
  Layers,
} from 'lucide-react';

interface GoogleBusinessProfileModalProps {
  business: BusinessProfile;
  currentLang: Language;
  onClose: () => void;
  onRequestQuote: (b: BusinessProfile) => void;
}

export const GoogleBusinessProfileModal: React.FC<GoogleBusinessProfileModalProps> = ({
  business,
  currentLang,
  onClose,
  onRequestQuote,
}) => {
  const [activeTab, setActiveTab] = useState<'gmb_card' | 'google_search'>('gmb_card');
  const [selectedQa, setSelectedQa] = useState<number | null>(null);

  const name = business.name[currentLang] || business.name.ar;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${name} ${business.city} نقل عفش`
  )}`;

  const qaItems = [
    {
      q: 'هل توفرون تصاريح نقل العفش لجميع الأوقات 24/7؟',
      a: 'نعم، حاصلون على كافة تراخيص النقل المعتمدة في المملكة ونعمل على مدار الساعة 24/7 بما في ذلك الإجازات والفترات المسائية.',
    },
    {
      q: 'هل تشمل الخدمة نجارين لفك وتركيب مطابخ ايكيا وغرف النوم؟',
      a: 'بالتأكيد، طاقم العمل يضم كبار النجارين الفنيين المتخصصين في غرف النوم والمطابخ والستائر مع ضمان سلامة القطع.',
    },
    {
      q: 'كيف يتم حماية الأجهزة الكهربائية والشاشات الحساسة؟',
      a: 'نستخدم كراتين مقواة 5 طبقات وتغليف حراري وبلاستيك فقاعي مخصص لامتصاص الصدمات أثناء النقل بالشاحنات المبطنة.',
    },
  ];

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-200">
        {/* Google Style Top Header */}
        <div className="bg-slate-900 text-white p-4.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            {/* Google G Logo colors */}
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-md font-bold text-lg select-none">
              <span className="text-blue-600">G</span>
              <span className="text-red-500">o</span>
              <span className="text-amber-500">o</span>
              <span className="text-blue-600">g</span>
              <span className="text-green-500">l</span>
              <span className="text-red-500">e</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-white">
                  {currentLang === 'ar' ? 'الملف التجاري في Google (GMB)' : 'Google Business Profile'}
                </h3>
                <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-400/30">
                  VERIFIED PROFILE
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {currentLang === 'ar'
                  ? 'الظهور في خرائط Google ونتائج محرك البحث الأولى'
                  : 'Live Google My Business Listing & Search Preview'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('gmb_card')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'gmb_card'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>بطاقة Google My Business</span>
          </button>
          <button
            onClick={() => setActiveTab('google_search')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'google_search'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>معاينة نتيجة بحث Google (SEO Snippet)</span>
          </button>
        </div>

        {/* Tab 1: GMB Knowledge Panel Card */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-xs">
          {activeTab === 'gmb_card' && (
            <div className="space-y-4">
              {/* GMB Card Header */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs bg-white">
                <div className="relative h-44 bg-slate-900">
                  <img
                    src={business.coverImage}
                    alt={name}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 start-4 flex items-center gap-3">
                    <img
                      src={business.logo}
                      alt={name}
                      className="w-14 h-14 rounded-2xl border-2 border-white object-cover bg-white shadow-lg"
                    />
                    <div className="text-white">
                      <h4 className="text-base font-black flex items-center gap-1.5">
                        <span>{name}</span>
                        <CheckCircle2 className="w-4 h-4 text-blue-400 fill-white" />
                      </h4>
                      <p className="text-[11px] text-slate-300">
                        {business.city} • شركة نقل أثاث ولوجستيات
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rating & Actions Bar */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-900">{business.rating}</span>
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-blue-600 hover:underline cursor-pointer font-semibold">
                      ({business.reviewsCount} تقييم على Google)
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                      نشاط تجاري معتمد ✓
                    </span>
                  </div>

                  {/* Google Action Buttons */}
                  <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 text-blue-700 font-bold transition-colors flex flex-col items-center gap-1"
                    >
                      <Navigation className="w-4 h-4" />
                      <span className="text-[10px]">الاتجاهات</span>
                    </a>

                    <a
                      href={`tel:${business.phone}`}
                      className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/80 text-emerald-700 font-bold transition-colors flex flex-col items-center gap-1"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-[10px]">اتصال</span>
                    </a>

                    <button
                      onClick={() => onRequestQuote(business)}
                      className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/80 text-indigo-700 font-bold transition-colors flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="text-[10px]">طلب سعر</span>
                    </button>

                    <a
                      href={`https://wa.me/${business.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-teal-200 bg-teal-50/60 hover:bg-teal-100/80 text-teal-700 font-bold transition-colors flex flex-col items-center gap-1"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-[10px]">واتساب</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* GMB Profile Info Details */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-slate-700">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">العنوان:</span>
                    <span>{business.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-700 block">ساعات العمل:</span>
                    <span>مفتوح على مدار الساعة (24 ساعة / 7 أيام) • تصاريح النقل متاحة 24/7</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">الهاتف:</span>
                    <span dir="ltr">{business.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Globe className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">الموقع الإلكتروني:</span>
                    <a
                      href={business.website || `https://moveconnect.sa/${business.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {business.website || `https://moveconnect.sa/${business.id}`}
                    </a>
                  </div>
                </div>
              </div>

              {/* Questions & Answers on Google */}
              <div className="space-y-2.5">
                <h5 className="font-bold text-slate-900 flex items-center justify-between">
                  <span>الأسئلة والأجوبة على Google ({qaItems.length})</span>
                  <span className="text-[11px] text-blue-600 font-semibold cursor-pointer">
                    طرح سؤال
                  </span>
                </h5>

                <div className="space-y-2">
                  {qaItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
                    >
                      <button
                        onClick={() => setSelectedQa(selectedQa === idx ? null : idx)}
                        className="w-full text-start font-bold text-slate-900 flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <span>س: {item.q}</span>
                        <span className="text-slate-400 text-xs">
                          {selectedQa === idx ? '▲' : '▼'}
                        </span>
                      </button>
                      {(selectedQa === idx || idx === 0) && (
                        <p className="mt-2 text-slate-600 text-[11px] leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <strong className="text-emerald-700">ج: </strong>
                          {item.a}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Link to Google Maps */}
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer text-xs"
              >
                <ExternalLink className="w-4 h-4" />
                <span>فتح ملف المنشأة مباشرة على تطبيق خرائط Google</span>
              </a>
            </div>
          )}

          {/* Tab 2: Google Search SERP Rich Snippet Preview */}
          {activeTab === 'google_search' && (
            <div className="space-y-4">
              <div className="bg-slate-100 p-3 rounded-2xl flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-800">
                  نقل عفش {business.city} {name}
                </span>
              </div>

              {/* Google Search Result Mockup */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1.5 font-sans">
                <div className="flex items-center gap-2 text-[11px] text-slate-600">
                  <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">
                    M
                  </div>
                  <span>moveconnect.sa &gt; movers &gt; {business.id}</span>
                </div>

                <h4 className="text-base text-blue-800 hover:underline font-medium cursor-pointer leading-tight">
                  {name} | نقل عفش وتغليف وفك وتركيب 24/7 في {business.city}
                </h4>

                <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold py-0.5">
                  <span className="text-slate-800 font-bold">{business.rating}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-slate-500 font-normal">
                    ({business.reviewsCount} تقييم) • تصاريح النقل متاحة 24/7
                  </span>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed">
                  {business.description[currentLang] || business.description.ar}
                </p>

                {/* Sitelinks inside Search */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                  <div className="p-2 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer">
                    <span className="font-bold text-blue-700 block">عروض الأسعار الفورية</span>
                    <span className="text-slate-500 text-[10px]">احسب تكلفة النقل بالريال</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer">
                    <span className="font-bold text-blue-700 block">فريق النجارين المعتمد</span>
                    <span className="text-slate-500 text-[10px]">فك وتركيب غرف ومطابخ</span>
                  </div>
                </div>
              </div>

              {/* SEO Tips Box */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>تهيئة محركات البحث (Schema.org / JSON-LD جاهزة)</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  هذا النشاط مهيأ ببيانات `LocalBusiness` و `MovingCompany` المعتمدة من Google مع
                  إحداثيات الموقع الدقيقة ورقم السجل التجاري وساعات العمل 24/7 ليتصدر نتائج البحث الأولى.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
