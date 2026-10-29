import React, { useState } from 'react';
import { BusinessProfile, Language, QuoteEnquiry, Review, MediaItem, TeamMember } from '../types';
import { translations, categoryLabels } from '../data/translations';
import { ServiceAreaMapEditor } from './ServiceAreaMapEditor';
import { GoogleBusinessProfileModal } from './GoogleBusinessProfileModal';
import {
  Building,
  TrendingUp,
  Eye,
  Search,
  Phone,
  MessageCircle,
  FileText,
  Upload,
  CheckCircle2,
  Trash2,
  Edit3,
  Star,
  Send,
  Plus,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  Play,
  Video,
  Users,
  DollarSign,
  ExternalLink,
} from 'lucide-react';

interface OwnerDashboardProps {
  business: BusinessProfile;
  currentLang: Language;
  onUpdateBusiness: (updated: BusinessProfile) => void;
  enquiries: QuoteEnquiry[];
  onUpdateEnquiryStatus: (id: string, status: QuoteEnquiry['status'], quotedAmount?: number) => void;
  onAddOwnerReply: (businessId: string, reviewId: string, replyText: string) => void;
  onUploadMedia: (businessId: string, item: Omit<MediaItem, 'id'>) => void;
  onDeleteMedia: (businessId: string, mediaId: string) => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  business,
  currentLang,
  onUpdateBusiness,
  enquiries,
  onUpdateEnquiryStatus,
  onAddOwnerReply,
  onUploadMedia,
  onDeleteMedia,
}) => {
  const t = translations[currentLang];
  const [activeTab, setActiveTab] = useState<'overview' | 'info' | 'crew' | 'media' | 'enquiries' | 'reviews'>('overview');

  // Business Edit form state
  const [bizNameAr, setBizNameAr] = useState(business.name.ar);
  const [bizNameEn, setBizNameEn] = useState(business.name.en);
  const [bizTaglineAr, setBizTaglineAr] = useState(business.tagline.ar);
  const [bizDescAr, setBizDescAr] = useState(business.description.ar);
  const [phone, setPhone] = useState(business.phone);
  const [whatsapp, setWhatsapp] = useState(business.whatsapp);
  const [city, setCity] = useState(business.city);
  const [address, setAddress] = useState(business.address);
  const [openingHours, setOpeningHours] = useState(business.openingHours);
  const [serviceAreasStr, setServiceAreasStr] = useState(business.serviceAreas.join(', '));
  const [logoUrl, setLogoUrl] = useState(business.logo);
  const [coverUrl, setCoverUrl] = useState(business.coverImage);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Crew members state
  const [workerName, setWorkerName] = useState('');
  const [workerRole, setWorkerRole] = useState('معلم نجار فك وتركيب غرف نوم ومطابخ');
  const [workerPhoto, setWorkerPhoto] = useState('');
  const [workerExperience, setWorkerExperience] = useState(8);
  const [workerNationality, setWorkerNationality] = useState('باكستاني');
  const [workerSpecialties, setWorkerSpecialties] = useState('مطابخ ايكيا، غرف نوم ماستر، صيانة');
  const [workerPhone, setWorkerPhone] = useState('');
  const [isGmbOpen, setIsGmbOpen] = useState(false);

  // Media upload state
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaCategory, setMediaCategory] = useState<MediaItem['category']>('trucks');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  // Review reply state
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  // Quote reply state
  const [quoteInputs, setQuoteInputs] = useState<Record<string, number>>({});
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  const handleAddWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerName.trim()) return;

    const samplePhotos = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    ];

    const newWorker: TeamMember = {
      id: 'tm-' + Date.now(),
      name: workerName,
      role: workerRole,
      photo: workerPhoto || samplePhotos[Math.floor(Math.random() * samplePhotos.length)],
      experienceYears: Number(workerExperience) || 5,
      nationality: workerNationality,
      rating: 5.0,
      isVerifiedIqama: true,
      specialties: workerSpecialties.split('،').map((s) => s.trim()).filter(Boolean),
      phone: workerPhone,
    };

    const currentCrew = business.teamMembers || [];
    const updated = {
      ...business,
      teamMembers: [newWorker, ...currentCrew],
      workersCount: (business.workersCount || 0) + 1,
    };
    onUpdateBusiness(updated);
    setWorkerName('');
    setWorkerPhoto('');
  };

  const handleDeleteWorker = (workerId: string) => {
    const currentCrew = business.teamMembers || [];
    const updated = {
      ...business,
      teamMembers: currentCrew.filter((w) => w.id !== workerId),
      workersCount: Math.max(1, (business.workersCount || 1) - 1),
    };
    onUpdateBusiness(updated);
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BusinessProfile = {
      ...business,
      name: {
        ...business.name,
        ar: bizNameAr,
        en: bizNameEn,
      },
      tagline: {
        ...business.tagline,
        ar: bizTaglineAr,
      },
      description: {
        ...business.description,
        ar: bizDescAr,
      },
      phone,
      whatsapp,
      city,
      address,
      openingHours,
      logo: logoUrl || business.logo,
      coverImage: coverUrl || business.coverImage,
      serviceAreas: serviceAreasStr.split(',').map((s) => s.trim()).filter(Boolean),
    };

    onUpdateBusiness(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleMediaUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitle.trim()) return;

    setIsUploading(true);
    setUploadPercent(20);

    const interval = setInterval(() => {
      setUploadPercent((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setIsUploading(false);
      setUploadPercent(0);

      // Default sample images if custom URL not specified
      const fallbackUrl =
        mediaType === 'video'
          ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          : 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80';

      onUploadMedia(business.id, {
        type: mediaType,
        title: mediaTitle,
        category: mediaCategory,
        url: mediaUrl.trim() || fallbackUrl,
        thumbnail:
          mediaType === 'video'
            ? 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80'
            : undefined,
      });

      setMediaTitle('');
      setMediaUrl('');
    }, 1200);
  };

  const handleSendReply = (reviewId: string) => {
    const text = replyInputs[reviewId];
    if (!text || !text.trim()) return;
    onAddOwnerReply(business.id, reviewId, text);
    setReplyInputs({ ...replyInputs, [reviewId]: '' });
  };

  // Filter enquiries for this business
  const myEnquiries = enquiries.filter((e) => e.businessId === business.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Profile Banner (Google Business Profile Style) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={business.logo}
            alt={business.name.ar}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md">GMB</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {business.name[currentLang] || business.name.ar}
              </h2>
              {business.isVerified && (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {t.crNumber}: {business.crNumber}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{business.address}</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">{t.workingHours}: {business.openingHours}</span>
            </p>
          </div>
        </div>

        {/* Live Profile Link & GMB preview */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsGmbOpen(true)}
            className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <span className="text-blue-600 font-black">G</span>
            <span>{currentLang === 'ar' ? 'معاينة بطاقة Google (GMB)' : 'Google GMB Preview'}</span>
          </button>
          <div className="bg-blue-50 text-blue-800 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{currentLang === 'ar' ? 'الملف نشط ومعتمد في محرك البحث' : 'Live & Verified'}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-xs flex flex-wrap gap-1 text-xs font-bold text-slate-600">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'overview' ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{currentLang === 'ar' ? 'الإحصائيات والأداء' : 'Insights & Stats'}</span>
        </button>

        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'info' ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-slate-100'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>{t.updateInfo}</span>
        </button>

        <button
          onClick={() => setActiveTab('crew')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'crew' ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>
            {currentLang === 'ar' ? 'طاقم العمل والنجارين' : 'Crew & Workers'} (
            {business.teamMembers?.length || business.workersCount})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'media' ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-slate-100'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>{t.uploadMedia} ({business.media.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'enquiries' ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t.manageEnquiries}</span>
          {myEnquiries.length > 0 && (
            <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
              {myEnquiries.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'reviews' ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-slate-100'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>{t.manageReviews} ({business.reviews.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & PERFORMANCE METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {/* Profile Views */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>{t.statsViews}</span>
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {business.stats.viewsThisMonth.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-600 font-bold">+18% هذا الشهر</div>
            </div>

            {/* Search Appearances */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>{t.statsSearches}</span>
                <Search className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {business.stats.searchesAppeared.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-600 font-bold">+24% هذا الشهر</div>
            </div>

            {/* WhatsApp Chats */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>{t.statsWhatsapp}</span>
                <MessageCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {business.stats.whatsappClicks.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-600 font-bold">محادثات مباشرة</div>
            </div>

            {/* Calls */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>{t.statsCalls}</span>
                <Phone className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {business.stats.callClicks.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">اتصال فوري</div>
            </div>

            {/* Enquiries Received */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>{t.statsEnquiries}</span>
                <FileText className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {business.stats.enquiriesReceived.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-600 font-bold">طلبات أسعار</div>
            </div>
          </div>

          {/* Quick Tips for Higher Ranking in MoveConnect Saudi */}
          <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-3xl p-6 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>نصائح Google Business Profile لزيادة طلبات نقل العفش</span>
            </div>
            <h3 className="text-lg font-bold">
              كيف تجذب المزيد من العملاء في منطقتك؟
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 pt-2">
              <div className="bg-white/10 p-3.5 rounded-2xl">
                <div className="font-bold text-white mb-1">1. ارفع صور الدينا والتغليف</div>
                <p>الملفات التي تحتوي على أكثر من 5 صور وفيديو قبل وبعد تحظى بنسبة حجز أعلى بـ 3 أضعاف.</p>
              </div>
              <div className="bg-white/10 p-3.5 rounded-2xl">
                <div className="font-bold text-white mb-1">2. الرد السريع على الواتساب</div>
                <p>الرد على استفسار العميل خلال 5 دقائق يرفع نسبة إتمام عملية النقل إلى 85%.</p>
              </div>
              <div className="bg-white/10 p-3.5 rounded-2xl">
                <div className="font-bold text-white mb-1">3. الرد على تقييمات العملاء</div>
                <p>ردود المالك الرسمية على التقييمات تبني ثقة عالية وتؤكد التزام المنشأة بالضمان.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EDIT BUSINESS INFO */}
      {activeTab === 'info' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900">{t.updateInfo}</h3>
              <p className="text-xs text-slate-500">
                {currentLang === 'ar'
                  ? 'حدّث بيانات الاتصال، مناطق الخدمة، وساعات العمل'
                  : 'Manage your business address, phone, and covered zones'}
              </p>
            </div>
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {t.savedSuccessfully}
              </span>
            )}
          </div>

          <form onSubmit={handleSaveInfo} className="space-y-4 text-xs">
            {/* Custom Business Images / Logo & Cover URL */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>إدارة شعار وصور الغلاف الخاصة بمنشأتك (GMB Images)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    رابط شعار المنشأة (Logo URL)
                  </label>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium bg-white"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    رابط غلاف المنشأة (Cover Image URL)
                  </label>
                  <input
                    type="url"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium bg-white"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  اسم المنشأة بالعربية *
                </label>
                <input
                  type="text"
                  required
                  value={bizNameAr}
                  onChange={(e) => setBizNameAr(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Business Name (English)
                </label>
                <input
                  type="text"
                  value={bizNameEn}
                  onChange={(e) => setBizNameEn(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  رقم الهاتف للاتصال المباشر *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  رقم الواتساب لاستقبال المحادثات (مع مفتاح الدولة 966) *
                </label>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  المدينة الرئيسية *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  العنوان / المقر
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
                />
              </div>
            </div>

            {/* Interactive Service Area Radius Map */}
            <div className="pt-2">
              <ServiceAreaMapEditor
                business={business}
                currentLang={currentLang}
                onUpdateServiceAreas={(updatedAreas, radiusKm) => {
                  setServiceAreasStr(updatedAreas.join(', '));
                  // Auto-update the business JSON directly
                  const updated: BusinessProfile = {
                    ...business,
                    serviceAreas: updatedAreas,
                  };
                  onUpdateBusiness(updated);
                }}
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ساعات العمل *
              </label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                placeholder="خدمة 24/7 على مدار الساعة"
                className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                وصف المنشأة وخدمات النقل والفك والتركيب
              </label>
              <textarea
                rows={4}
                value={bizDescAr}
                onChange={(e) => setBizDescAr(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all cursor-pointer"
            >
              {t.saveChanges}
            </button>
          </form>
        </div>
      )}

      {/* TAB: CREW & WORKERS MANAGEMENT */}
      {activeTab === 'crew' && (
        <div className="space-y-6">
          {/* Add Worker Form */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <Users className="w-5 h-5 text-blue-600" />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {currentLang === 'ar' ? 'إضافة وتوثيق صور طاقم العمل والنجارين' : 'Add Moving Crew & Techs with Photos'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {currentLang === 'ar'
                      ? 'إظهار صور وخبرات النجارين والفنيين يزيد من ثقة العميل بنسبة 85% ويؤكد نظامية العمالة'
                      : 'Showcasing verified workers increases customer trust and bookings'}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAddWorker} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    اسم الفني / النجار *
                  </label>
                  <input
                    type="text"
                    required
                    value={workerName}
                    onChange={(e) => setWorkerName(e.target.value)}
                    placeholder="مثال: معلم سليم النجار"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    المسمى الوظيفي والتخصص *
                  </label>
                  <input
                    type="text"
                    required
                    value={workerRole}
                    onChange={(e) => setWorkerRole(e.target.value)}
                    placeholder="مثال: كبير نجارين فك وتركيب مطابخ وغرف نوم"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    سنوات الخبرة
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="35"
                    value={workerExperience}
                    onChange={(e) => setWorkerExperience(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    رابط صورة الفني المباشر (أو اختر من النماذج أدناه)
                  </label>
                  <input
                    type="url"
                    value={workerPhoto}
                    onChange={(e) => setWorkerPhoto(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    الجنسية
                  </label>
                  <input
                    type="text"
                    value={workerNationality}
                    onChange={(e) => setWorkerNationality(e.target.value)}
                    placeholder="مثال: باكستاني / هندي / مصري"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    التخصصات الدقيقة (افصل بينها بفاصلة)
                  </label>
                  <input
                    type="text"
                    value={workerSpecialties}
                    onChange={(e) => setWorkerSpecialties(e.target.value)}
                    placeholder="مطابخ ايكيا، غرف نوم، مكيفات سبليت"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Quick Preset Worker Photos */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-600 block">
                  نماذج صور جاهزة يمكنك الضغط عليها للاختيار فوراً:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {[
                    { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', label: 'نجار 1' },
                    { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80', label: 'فني كهربائي' },
                    { url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80', label: 'مشرف تغليف' },
                    { url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80', label: 'كابتن دينا' },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setWorkerPhoto(preset.url)}
                      className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                        workerPhoto === preset.url
                          ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <img src={preset.url} alt="" className="w-8 h-8 rounded-lg object-cover" />
                      <span className="text-[11px] font-bold text-slate-700 pe-1">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-xs transition-colors cursor-pointer text-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة الفني إلى طاقم المنشأة المعروض للعملاء</span>
              </button>
            </form>
          </div>

          {/* Current Crew Members List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-sm">
                طاقم العمل المسجل حالياً ({business.teamMembers?.length || 0})
              </h4>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold">
                ✓ جميع الكوادر موثقة إلكترونياً
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {(business.teamMembers || []).map((w) => (
                <div
                  key={w.id}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 relative group hover:bg-white hover:border-blue-300 transition-all flex items-start gap-3"
                >
                  <img
                    src={w.photo}
                    alt={w.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-0.5 text-xs">
                    <div className="font-black text-slate-900 truncate">{w.name}</div>
                    <div className="text-[11px] font-semibold text-blue-700 truncate">{w.role}</div>
                    <div className="text-[10px] text-slate-500">
                      خبرة {w.experienceYears} سنوات • {w.nationality}
                    </div>
                    {w.specialties && (
                      <div className="text-[10px] text-slate-400 truncate">
                        {w.specialties.join('، ')}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteWorker(w.id)}
                    className="absolute top-2.5 end-2.5 p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                    title="حذف الفني"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MEDIA UPLOAD & MANAGEMENT */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          {/* Upload Form Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              <span>{t.uploadMedia}</span>
            </h3>

            <form onSubmit={handleMediaUploadSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t.mediaTypePrompt}
                  </label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
                  >
                    <option value="image">صورة (JPG / PNG)</option>
                    <option value="video">فيديو توثيقي (MP4)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    تصنيف الوسائط
                  </label>
                  <select
                    value={mediaCategory}
                    onChange={(e) => setMediaCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
                  >
                    <option value="trucks">أسطول الشاحنات والدينا</option>
                    <option value="packing">تغليف العفش والكراتين</option>
                    <option value="furniture">فك وتركيب غرف ومطابخ</option>
                    <option value="team">فريق العمل والعمالة</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t.mediaCaption} *
                  </label>
                  <input
                    type="text"
                    required
                    value={mediaTitle}
                    onChange={(e) => setMediaTitle(e.target.value)}
                    placeholder="مثال: تغليف طقم كنب فاخر في فيلا بالصحافة"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  رابط الصورة أو الفيديو المباشر (أو اتركه فارغاً لاستخدام نموذج افتراضي عالي الدقة)
                </label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                  dir="ltr"
                />
              </div>

              {isUploading && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-blue-700">
                    <span>{t.uploadProgress}</span>
                    <span>{uploadPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2.5 transition-all duration-300"
                      style={{ width: `${uploadPercent}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isUploading}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-2.5 px-5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isUploading ? t.uploadProgress : 'رفع الوسائط للملف'}
              </button>
            </form>
          </div>

          {/* Current Media List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">
              الوسائط المرفوعة حالياً ({business.media.length})
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {business.media.map((item) => (
                <div
                  key={item.id}
                  className="relative h-40 rounded-2xl overflow-hidden border border-slate-200 group bg-slate-50"
                >
                  <img
                    src={item.type === 'video' ? item.thumbnail || item.url : item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white">
                    <div className="text-[11px] font-bold truncate">{item.title}</div>
                    <div className="text-[10px] text-slate-300 uppercase">{item.type}</div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => onDeleteMedia(business.id, item.id)}
                    className="absolute top-2 end-2 p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ENQUIRIES & QUOTE REQUESTS INBOX */}
      {activeTab === 'enquiries' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900">{t.manageEnquiries}</h3>
              <p className="text-xs text-slate-500">
                {currentLang === 'ar'
                  ? 'طلبات عروض الأسعار الواردة من العملاء عبر التطبيق'
                  : 'Customer quote requests and booking enquiries'}
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {myEnquiries.length} طلبات
            </span>
          </div>

          {myEnquiries.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              لا توجد طلبات جديدة حالياً. ستظهر هنا فور إرسال العملاء لطلبات النقل.
            </div>
          ) : (
            <div className="space-y-4">
              {myEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                    <div>
                      <div className="font-black text-sm text-slate-900 flex items-center gap-2">
                        <span>{enq.customerName}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            enq.status === 'quoted'
                              ? 'bg-blue-100 text-blue-800'
                              : enq.status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {enq.status === 'quoted'
                            ? 'تم إرسال السعر'
                            : enq.status === 'accepted'
                            ? 'مقبول'
                            : 'قيد الانتظار'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {enq.createdAt} • موعد النقل: {enq.moveDate}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${enq.customerPhone}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>اتصال: {enq.customerPhone}</span>
                      </a>

                      <a
                        href={`https://wa.me/${enq.customerPhone.replace('+', '')}?text=${encodeURIComponent(
                          `السلام عليكم أخي ${enq.customerName}، تواصلنا معكم من مؤسسة صخيل لنقل العفش بخصوص طلب النقل من ${enq.pickupDistrict} إلى ${enq.destinationDistrict}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>واتساب</span>
                      </a>
                    </div>
                  </div>

                  {/* Route & Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-500 block mb-1">المسار:</span>
                      <div>من: {enq.pickupCity} ({enq.pickupDistrict})</div>
                      <div>إلى: {enq.destinationCity} ({enq.destinationDistrict})</div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-500 block mb-1">المواصفات:</span>
                      <div>نوع السكن: {enq.propertyType}</div>
                      {enq.notes && <div className="text-slate-600 mt-1 italic">ملاحظات: {enq.notes}</div>}
                    </div>
                  </div>

                  {/* Quote response field */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <input
                      type="number"
                      placeholder="أدخل عرض السعر (بالريال)"
                      value={quoteInputs[enq.id] || ''}
                      onChange={(e) =>
                        setQuoteInputs({ ...quoteInputs, [enq.id]: Number(e.target.value) })
                      }
                      className="p-2 rounded-xl border border-slate-300 w-44 bg-white font-bold"
                    />
                    <button
                      onClick={() => {
                        const amt = quoteInputs[enq.id] || 800;
                        onUpdateEnquiryStatus(enq.id, 'quoted', amt);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3.5 rounded-xl cursor-pointer"
                    >
                      إرسال عرض السعر للعميل
                    </button>
                    {enq.quotedAmountSar && (
                      <span className="text-emerald-700 font-bold ms-2">
                        ✓ السعر المرسل: {enq.quotedAmountSar} ريال
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: REVIEWS & REPLIES */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-black text-slate-900">{t.manageReviews}</h3>
              <p className="text-xs text-slate-500">
                {currentLang === 'ar'
                  ? 'الرد الرسمي على تقييمات العملاء يعزز مصداقية شركتك في MoveConnect'
                  : 'Respond to customer reviews to build trust'}
              </p>
            </div>
            {business.videoTestimonials && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-1.5 w-fit">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{business.videoTestimonials.length} فيديوهات عملاء موثقة نشطة</span>
              </span>
            )}
          </div>

          {/* Curated Video Testimonials in Owner View */}
          {business.videoTestimonials && business.videoTestimonials.length > 0 && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                    <Video className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">
                      {currentLang === 'ar'
                        ? 'تجارب العملاء بالفيديو المعروضة في ملفك'
                        : 'Curated Customer Video Stories Showcased'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {currentLang === 'ar'
                        ? 'تزيد من معدل طلبات عروض الأسعار بنسبة 300% وفق إحصائيات MoveConnect'
                        : 'Increases conversion & quote requests by 3x on MoveConnect'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {business.videoTestimonials.map((vt) => (
                  <div
                    key={vt.id}
                    onClick={() => setPreviewVideoUrl(vt.videoUrl)}
                    className="group relative h-40 rounded-xl overflow-hidden cursor-pointer border border-slate-200 bg-slate-900 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between p-2.5 text-white"
                  >
                    <img
                      src={vt.thumbnailUrl}
                      alt={vt.customerName}
                      className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    <div className="relative z-10 flex items-center justify-between text-[10px]">
                      <span className="bg-emerald-600 px-2 py-0.5 rounded-md font-bold">
                        ✓ حجز موثق
                      </span>
                      <span className="bg-black/60 px-1.5 py-0.5 rounded-md font-medium">
                        {vt.duration}
                      </span>
                    </div>

                    <div className="relative z-10 self-center">
                      <div className="w-9 h-9 rounded-full bg-white/90 text-blue-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-current ms-0.5" />
                      </div>
                    </div>

                    <div className="relative z-10 space-y-0.5">
                      <div className="font-bold text-xs truncate">{vt.customerName}</div>
                      <div className="text-[10px] text-slate-300 truncate">{vt.moveType}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Preview Modal inside Dashboard if clicked */}
          {previewVideoUrl && (
            <div
              onClick={() => setPreviewVideoUrl(null)}
              className="fixed inset-0 z-70 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-950 rounded-2xl max-w-sm w-full overflow-hidden border border-white/10"
              >
                <div className="p-3 bg-slate-900 text-white flex items-center justify-between text-xs font-bold">
                  <span>معاينة فيديو العميل</span>
                  <button
                    onClick={() => setPreviewVideoUrl(null)}
                    className="p-1 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <video
                  src={previewVideoUrl}
                  controls
                  autoPlay
                  className="w-full max-h-[60vh] object-contain bg-black"
                />
              </div>
            </div>
          )}

          <div className="space-y-4">
            {business.reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{rev.userName}</span>
                    <span className="text-slate-400">• {rev.date}</span>
                    <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                      {rev.serviceUsed}
                    </span>
                  </div>

                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-slate-700">{rev.comment}</p>

                {/* Existing Reply */}
                {rev.ownerReply ? (
                  <div className="bg-blue-50 p-3 rounded-xl border-s-4 border-blue-600 text-slate-800 space-y-1">
                    <div className="font-bold text-blue-900 flex justify-between">
                      <span>{t.replyToCustomer}</span>
                      <span className="text-[10px] text-blue-600">{rev.ownerReply.date}</span>
                    </div>
                    <p>{rev.ownerReply.text}</p>
                  </div>
                ) : (
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={t.writeReply}
                      value={replyInputs[rev.id] || ''}
                      onChange={(e) =>
                        setReplyInputs({ ...replyInputs, [rev.id]: e.target.value })
                      }
                      className="flex-1 p-2 rounded-xl border border-slate-300 bg-white"
                    />
                    <button
                      onClick={() => handleSendReply(rev.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3.5 rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{t.submitReply}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Google Business Profile Modal */}
      {isGmbOpen && (
        <GoogleBusinessProfileModal
          business={business}
          currentLang={currentLang}
          onClose={() => setIsGmbOpen(false)}
          onRequestQuote={() => {}}
        />
      )}
    </div>
  );
};
