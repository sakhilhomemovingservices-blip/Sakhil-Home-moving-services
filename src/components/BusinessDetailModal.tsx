import React, { useState } from 'react';
import { BusinessProfile, Language, Review, MediaItem } from '../types';
import { translations, categoryLabels } from '../data/translations';
import { CityMarketRateChart } from './CityMarketRateChart';
import { CustomerVideoTestimonials } from './CustomerVideoTestimonials';
import { CrewMembersSection } from './CrewMembersSection';
import { GoogleBusinessProfileModal } from './GoogleBusinessProfileModal';
import {
  X,
  Star,
  ShieldCheck,
  MapPin,
  Phone,
  MessageCircle,
  Globe,
  Clock,
  Truck,
  Users,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Play,
  Heart,
  ChevronRight,
  Maximize2,
  Sparkles,
} from 'lucide-react';

interface BusinessDetailModalProps {
  business: BusinessProfile;
  currentLang: Language;
  onClose: () => void;
  onRequestQuote: (b: BusinessProfile) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenReport: (b: BusinessProfile) => void;
  onAddReview: (businessId: string, review: Omit<Review, 'id' | 'businessId'>) => void;
  onOpenMediaLightbox: (media: MediaItem) => void;
  onTrackCall: (id: string) => void;
  onTrackWhatsapp: (id: string) => void;
}

export const BusinessDetailModal: React.FC<BusinessDetailModalProps> = ({
  business,
  currentLang,
  onClose,
  onRequestQuote,
  isFavorite,
  onToggleFavorite,
  onOpenReport,
  onAddReview,
  onOpenMediaLightbox,
  onTrackCall,
  onTrackWhatsapp,
}) => {
  const t = translations[currentLang];
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'team' | 'media' | 'reviews'>('overview');
  const [isGmbModalOpen, setIsGmbModalOpen] = useState(false);
  const [beforeAfterSliderPos, setBeforeAfterSliderPos] = useState(50); // 0-100%

  // Review Form state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewService, setReviewService] = useState('نقل عفش متكامل');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const name = business.name[currentLang] || business.name.ar;
  const tagline = business.tagline[currentLang] || business.tagline.ar;
  const description = business.description[currentLang] || business.description.ar;

  const waGreeting =
    currentLang === 'ar'
      ? `السلام عليكم ورحمة الله، أتواصل معكم عبر منصة MoveConnect بخصوص خدمات نقل العفش لشركة (${name}). أود معرفة عروض الأسعار والمواعيد المتاحة.`
      : currentLang === 'ur'
      ? `السلام علیکم، میں MoveConnect پلیٹ فارم کے ذریعے رابطہ کر رہا ہوں۔ آپ کی کمپنی (${name}) سے شفٹنگ سروسز اور ریٹس درکار ہیں۔`
      : `Hello, I'm reaching out through MoveConnect regarding moving services for (${name}). I would like to get a quote and check availability.`;

  const waUrl = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(waGreeting)}`;

  // Find before & after media item if exists
  const beforeAfterMedia = business.media.find((m) => m.isBeforeAfter);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    onAddReview(business.id, {
      userName: reviewerName,
      rating: reviewRating,
      serviceUsed: reviewService,
      comment: reviewComment,
      date: currentLang === 'ar' ? 'الآن' : currentLang === 'ur' ? 'ابھی' : 'Just now',
    });

    setReviewSubmitted(true);
    setReviewerName('');
    setReviewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-200">
        {/* Modal Top Bar */}
        <div className="relative h-60 sm:h-72 w-full bg-slate-900 shrink-0">
          <img
            src={business.coverImage}
            alt={name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/40" />

          {/* Close & Action Buttons */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors cursor-pointer"
              title={t.close}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(business.id)}
                className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors cursor-pointer"
                title={t.saveFavorite}
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`}
                />
              </button>
              <button
                onClick={() => onOpenReport(business)}
                className="p-2 rounded-full bg-black/50 hover:bg-rose-900/80 text-rose-300 backdrop-blur-md transition-colors cursor-pointer"
                title={t.reportProfile}
              >
                <AlertTriangle className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Business Hero info inside Cover */}
          <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 flex items-end justify-between gap-4">
            <div className="flex items-end gap-3.5">
              <div className="relative shrink-0">
                <img
                  src={business.logo}
                  alt={name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-white border-2 border-white shadow-xl"
                />
                {business.isVerified && (
                  <div
                    className="absolute -bottom-1.5 -end-1.5 bg-emerald-600 text-white p-1 rounded-full ring-2 ring-white"
                    title={t.verifiedBadgeTitle}
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="text-white space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-md">
                    {name}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-1 max-w-xl font-medium">
                  {tagline}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="flex items-center gap-1 font-bold text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {business.rating}
                  </span>
                  <span>•</span>
                  <span>
                    {business.reviewsCount} {t.reviews}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">{business.city}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Quick Action Row */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <a
              href={`tel:${business.phone}`}
              onClick={() => onTrackCall(business.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{t.callNow}</span>
            </a>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onTrackWhatsapp(business.id)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.whatsappChat}</span>
            </a>

            <button
              onClick={() => onRequestQuote(business)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span>{t.requestQuote}</span>
            </button>

            <button
              onClick={() => setIsGmbModalOpen(true)}
              className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold px-3 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              title="Google My Business (GMB)"
            >
              <span className="font-black text-blue-600">G</span>
              <span>{currentLang === 'ar' ? 'ملف Google (GMB)' : 'Google GMB'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              {t.allTimesGranted}
            </span>
            {business.crNumber && (
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {t.crNumber}: {business.crNumber}
              </span>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 px-4 sm:px-6 flex gap-6 text-sm font-bold text-slate-600 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {currentLang === 'ar' ? 'نبذة ومعلومات' : currentLang === 'ur' ? 'معلومات' : 'Overview & Info'}
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`py-3 border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'services'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {currentLang === 'ar' ? 'الخدمات والأسعار' : currentLang === 'ur' ? 'سروسز اور ریٹس' : 'Services & Pricing'}
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`py-3 border-b-2 transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'team'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>
              {currentLang === 'ar' ? 'فريق العمل والنجارين' : 'Crew & Techs'} (
              {business.teamMembers?.length || business.workersCount})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`py-3 border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'media'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {t.viewGallery} ({business.media.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 border-b-2 transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <span>{t.reviews} ({business.reviews.length})</span>
            {business.videoTestimonials && business.videoTestimonials.length > 0 && (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Play className="w-2.5 h-2.5 fill-emerald-700" />
                {business.videoTestimonials.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  {currentLang === 'ar' ? 'عن المنشأة' : currentLang === 'ur' ? 'کمپنی کا تعارف' : 'About Company'}
                </h4>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {description}
                </p>
              </div>

              {/* Company Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-blue-50/50 border border-blue-100 p-3.5 rounded-2xl">
                  <div className="flex items-center gap-2 text-blue-700 text-xs font-semibold mb-1">
                    <Truck className="w-4 h-4" />
                    <span>{t.fleetSize}</span>
                  </div>
                  <div className="text-lg font-black text-slate-900">
                    {business.truckFleetSize} {currentLang === 'ar' ? 'دينا مجهزة' : 'Trucks'}
                  </div>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-2xl">
                  <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold mb-1">
                    <Users className="w-4 h-4" />
                    <span>{t.workers}</span>
                  </div>
                  <div className="text-lg font-black text-slate-900">
                    {business.workersCount} {currentLang === 'ar' ? 'فني ونجار' : 'Techs'}
                  </div>
                </div>

                <div className="bg-purple-50/50 border border-purple-100 p-3.5 rounded-2xl">
                  <div className="flex items-center gap-2 text-purple-700 text-xs font-semibold mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>{currentLang === 'ar' ? 'سنة التأسيس' : 'Founded'}</span>
                  </div>
                  <div className="text-lg font-black text-slate-900">{business.establishedYear}</div>
                </div>

                <div className="bg-amber-50/50 border border-amber-100 p-3.5 rounded-2xl">
                  <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold mb-1">
                    <Clock className="w-4 h-4" />
                    <span>{t.workingHours}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {business.openingHours}
                  </div>
                </div>
              </div>

              {/* City Market Rate Range Chart */}
              <CityMarketRateChart
                city={business.city}
                categories={business.categories}
                currentLang={currentLang}
                businessName={name}
              />

              {/* Curated Short Video Testimonials from Happy Customers */}
              {business.videoTestimonials && business.videoTestimonials.length > 0 && (
                <div className="pt-2">
                  <CustomerVideoTestimonials
                    testimonials={business.videoTestimonials}
                    currentLang={currentLang}
                    businessName={name}
                  />
                </div>
              )}

              {/* Certified Moving Crew & Technicians */}
              {business.teamMembers && business.teamMembers.length > 0 && (
                <div className="pt-2">
                  <CrewMembersSection
                    teamMembers={business.teamMembers}
                    currentLang={currentLang}
                    businessName={name}
                  />
                </div>
              )}

              {/* Service Areas */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>{t.serviceAreas}</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {business.serviceAreas.map((area, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {area}
                    </span>
                  ))}
                </div>
                {business.isServiceAreaOnly && (
                  <p className="text-xs text-slate-500 mt-2 font-medium">
                    ℹ️ {t.serviceAreaBusiness}
                  </p>
                )}
              </div>

              {/* Operational Radius & Service Zone Map Snippet */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-md">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {currentLang === 'ar' ? 'خريطة النطاق التشغيلي ونطاق التغطية' : 'Operational Radius & Service Zone Map'}
                        </h4>
                        <p className="text-[11px] text-slate-300">
                          {currentLang === 'ar'
                            ? `نطاق الخدمة النشط في مدينة ${business.city} (دائرة نصف قطرها 30 كم)`
                            : `Active service radius in ${business.city} (30km coverage zone)`}
                        </p>
                      </div>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {currentLang === 'ar' ? 'ضمن نطاق التغطية النشط' : 'Within Service Radius'}
                    </span>
                  </div>

                  {/* Static Map Visual Container */}
                  <div className="relative h-44 sm:h-52 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {/* Simulated Radar / Map Grid Background */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-32 h-32 rounded-full border border-blue-500/20 absolute" />
                      <div className="w-64 h-64 rounded-full border border-blue-500/15 absolute" />
                      <div className="w-96 h-96 rounded-full border border-blue-500/10 absolute" />
                      <div className="w-full h-[1px] bg-blue-500/20 absolute" />
                      <div className="h-full w-[1px] bg-blue-500/20 absolute" />
                    </div>

                    {/* Center Pin & Pulsing Radius Indicator */}
                    <div className="relative z-10 text-center space-y-2">
                      <div className="relative inline-flex items-center justify-center">
                        <span className="absolute w-12 h-12 rounded-full bg-blue-500/30 animate-ping" />
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                          <Truck className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700 text-xs font-bold text-slate-200">
                        📍 {business.address}
                      </div>
                    </div>

                    {/* Operational Radius Label overlay */}
                    <div className="absolute bottom-2 start-2 bg-slate-900/80 backdrop-blur-xs text-[10px] text-slate-300 px-2 py-1 rounded-md border border-slate-800">
                      🎯 {currentLang === 'ar' ? 'نصف القطر: 30 كم حول مركز المدينة' : 'Radius: 30km around city center'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                    <span className="font-medium">
                      {currentLang === 'ar' ? 'الأحياء المغطاة بدقة:' : 'Covered Districts:'}
                    </span>
                    <span className="text-blue-400 font-bold">
                      {business.serviceAreas.join(' • ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact info & Links */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-500">{t.directions}:</span>
                  <span className="font-bold text-slate-900">{business.address}</span>
                </div>
                {business.website && (
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-500">
                      {currentLang === 'ar' ? 'الموقع الإلكتروني' : 'Website'}:
                    </span>
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-bold"
                    >
                      {business.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SERVICES & PRICING */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              {/* City Market Rate Chart */}
              <CityMarketRateChart
                city={business.city}
                categories={business.categories}
                currentLang={currentLang}
                businessName={name}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {business.services.map((svc) => (
                  <div
                    key={svc.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 transition-colors space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                          {categoryLabels[svc.category]?.[currentLang]}
                        </span>
                        {svc.basePrice && (
                          <div className="text-end">
                            <span className="text-xs text-slate-400 font-medium">
                              {svc.priceUnit}{' '}
                            </span>
                            <span className="text-base font-black text-emerald-600">
                              {svc.basePrice} {t.sar}
                            </span>
                          </div>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-2">{svc.name}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {svc.description}
                      </p>
                    </div>

                    <button
                      onClick={() => onRequestQuote(business)}
                      className="mt-3 w-full bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                    >
                      {t.requestQuote}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CERTIFIED CREW & TECHNICIANS */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              {business.teamMembers && business.teamMembers.length > 0 ? (
                <CrewMembersSection
                  teamMembers={business.teamMembers}
                  currentLang={currentLang}
                  businessName={name}
                />
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  {currentLang === 'ar'
                    ? `تضم المنشأة ${business.workersCount} فنيين ونجارين معتمدين لنقل الأثاث والفك والتركيب.`
                    : `This business has ${business.workersCount} certified crew members.`}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MEDIA GALLERY & BEFORE-AFTER SLIDER */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              {/* Interactive Before & After Slider */}
              {beforeAfterMedia && beforeAfterMedia.beforeUrl && beforeAfterMedia.afterUrl && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>{t.beforeAndAfter}</span>
                    </h4>
                    <span className="text-xs text-slate-500 font-medium">
                      {currentLang === 'ar' ? 'حرك المؤشر للمقارنة' : 'Slide to compare'}
                    </span>
                  </div>

                  <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden select-none border border-slate-200 shadow-md">
                    {/* After Image (Background) */}
                    <img
                      src={beforeAfterMedia.afterUrl}
                      alt="After Moving"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute top-3 end-3 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      {currentLang === 'ar' ? 'بعد (مرتب ومنظم)' : 'AFTER'}
                    </div>

                    {/* Before Image (Clipped) */}
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: `${beforeAfterSliderPos}%` }}
                    >
                      <img
                        src={beforeAfterMedia.beforeUrl}
                        alt="Before Moving"
                        className="absolute inset-0 w-full h-full object-cover max-w-none"
                        style={{ width: '100%', height: '100%' }}
                      />
                      <div className="absolute top-3 start-3 bg-slate-900/80 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        {currentLang === 'ar' ? 'قبل (فك وتغليف)' : 'BEFORE'}
                      </div>
                    </div>

                    {/* Divider Line & Handle */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-xl cursor-ew-resize flex items-center justify-center"
                      style={{ left: `${beforeAfterSliderPos}%` }}
                    >
                      <div className="w-7 h-7 bg-white text-slate-800 rounded-full shadow-lg flex items-center justify-center text-xs font-black ring-2 ring-blue-500">
                        ⇆
                      </div>
                    </div>

                    {/* Range slider element overlay */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={beforeAfterSliderPos}
                      onChange={(e) => setBeforeAfterSliderPos(Number(e.target.value))}
                      aria-label={t.beforeAndAfter}
                      className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
                    />
                  </div>
                </div>
              )}

              {/* Photo & Video Grid */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  {currentLang === 'ar' ? 'الصور والشاحنات وفريق العمل' : 'Photos & Moving Fleet'}
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {business.media.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onOpenMediaLightbox(item)}
                      className="relative h-36 sm:h-44 rounded-2xl overflow-hidden group cursor-pointer border border-slate-200 bg-slate-100"
                    >
                      <img
                        src={item.type === 'video' ? item.thumbnail || item.url : item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Video indicator */}
                      {item.type === 'video' && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white/90 text-blue-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-blue-700 ms-0.5" />
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-2 text-white">
                        <div className="text-[11px] font-bold truncate">{item.title}</div>
                      </div>

                      <div className="absolute top-2 end-2 p-1 rounded-md bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS & RATINGS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Reviews Summary Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-start">
                  <div className="text-3xl font-black text-slate-900 flex items-center justify-center sm:justify-start gap-2">
                    <span>{business.rating}</span>
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {business.reviewsCount} {t.reviews}
                  </div>
                </div>

                <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  ✓ {t.allVerifiedNotice}
                </div>
              </div>

              {/* Customer Video Testimonials (Live Customer Feedback) */}
              {business.videoTestimonials && business.videoTestimonials.length > 0 && (
                <div className="bg-slate-50/80 p-4 sm:p-5 rounded-3xl border border-slate-200">
                  <CustomerVideoTestimonials
                    testimonials={business.videoTestimonials}
                    currentLang={currentLang}
                    businessName={name}
                  />
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {business.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            rev.userAvatar ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
                          }
                          alt={rev.userName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{rev.userName}</div>
                          <div className="text-[10px] text-slate-400">{rev.date}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>

                    {/* Official Owner Reply */}
                    {rev.ownerReply && (
                      <div className="bg-blue-50/70 p-3 rounded-xl border-s-4 border-blue-600 mt-2 space-y-1">
                        <div className="text-[11px] font-bold text-blue-900 flex items-center justify-between">
                          <span>{t.replyToCustomer}</span>
                          <span className="text-[10px] text-blue-600">{rev.ownerReply.date}</span>
                        </div>
                        <p className="text-xs text-slate-700">{rev.ownerReply.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Review Form */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <h4 className="text-sm font-bold text-slate-900">{t.addReview}</h4>

                {reviewSubmitted ? (
                  <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      {currentLang === 'ar'
                        ? 'شكراً لك! تم نشر تقييمك بنجاح.'
                        : 'Thank you! Your review has been submitted.'}
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {currentLang === 'ar' ? 'اسمك الكريم' : 'Your Name'}
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          placeholder={currentLang === 'ar' ? 'مثال: محمد الشمري' : 'e.g. John'}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {t.ratePrompt}
                        </label>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="cursor-pointer"
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  star <= reviewRating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {t.yourReview}
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder={
                          currentLang === 'ar'
                            ? 'اكتب عن جودة التغليف، الالتزام بالوقت، واحترافية النجارين...'
                            : 'Write about packing quality, punctuality, and staff...'
                        }
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      {t.submitReview}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Google Business Profile (GMB) & Google Search Modal */}
      {isGmbModalOpen && (
        <GoogleBusinessProfileModal
          business={business}
          currentLang={currentLang}
          onClose={() => setIsGmbModalOpen(false)}
          onRequestQuote={onRequestQuote}
        />
      )}
    </div>
  );
};
