import React from 'react';
import { BusinessProfile, Language } from '../types';
import { translations, categoryLabels } from '../data/translations';
import {
  Star,
  ShieldCheck,
  MapPin,
  Phone,
  MessageCircle,
  Heart,
  ChevronRight,
  Truck,
  CheckCircle2,
  Clock,
  Images,
  Share2,
} from 'lucide-react';

interface BusinessCardProps {
  business: BusinessProfile;
  currentLang: Language;
  onSelect: (b: BusinessProfile) => void;
  onRequestQuote: (b: BusinessProfile) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onTrackCall: (id: string) => void;
  onTrackWhatsapp: (id: string) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  currentLang,
  onSelect,
  onRequestQuote,
  isFavorite,
  onToggleFavorite,
  onTrackCall,
  onTrackWhatsapp,
}) => {
  const t = translations[currentLang];
  const name = business.name[currentLang] || business.name.ar;
  const tagline = business.tagline[currentLang] || business.tagline.ar;

  // Format WhatsApp message
  const waGreeting =
    currentLang === 'ar'
      ? `السلام عليكم، وجدت إعلانكم (${name}) في تطبيق MoveConnect Saudi، وأود الاستفسار عن عرض سعر لنقل أثاث.`
      : currentLang === 'ur'
      ? `السلام علیکم، میں نے آپ کی کمپنی (${name}) MoveConnect Saudi پر دیکھی ہے اور سامان کی منتقلی کے ریٹ درکار ہیں۔`
      : `Hello, I found your company (${name}) on MoveConnect Saudi and would like to request a moving quote.`;

  const waUrl = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(waGreeting)}`;

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: name,
      text: `${name} - ${tagline}\n📍 ${business.city} | ⭐ ${business.rating} (${business.reviewsCount} reviews)\n📞 ${business.phone}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error(err);
        }
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      alert(currentLang === 'ar' ? 'تم نسخ تفاصيل المنشأة ورابط المشاركة إلى الحافظة!' : 'Business details copied to clipboard!');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-1">
      {/* Cover / Media banner */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        <img
          src={business.coverImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-black/30" />

        {/* Share & Favorite Buttons */}
        <div className="absolute top-3 end-3 flex items-center gap-1.5 z-10">
          <button
            onClick={handleShare}
            aria-label={currentLang === 'ar' ? 'مشاركة' : 'Share'}
            className="p-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-md shadow-md text-slate-700 hover:text-blue-600 transition-all cursor-pointer"
            title={currentLang === 'ar' ? 'مشاركة (واتساب، تيليجرام، إيميل)' : 'Share via Web Share API'}
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(business.id);
            }}
            aria-label={t.saveFavorite}
            className="p-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-md shadow-md text-slate-700 transition-all cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-600 hover:text-rose-500'
              }`}
            />
          </button>
        </div>

        {/* City & Fleet info chips */}
        <div className="absolute top-3 start-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 backdrop-blur-md text-white flex items-center gap-1 border border-white/10">
            <MapPin className="w-3 h-3 text-emerald-400" />
            {business.city}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400/90 backdrop-blur-md text-slate-950 flex items-center gap-1 border border-amber-300/60 shadow-2xs">
            <Clock className="w-3 h-3 text-slate-950" />
            {t.allTimesBadge || '24/7'}
          </span>
          {business.truckFleetSize > 0 && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-900/80 backdrop-blur-md text-white flex items-center gap-1 border border-white/10">
              <Truck className="w-3 h-3 text-blue-300" />
              {business.truckFleetSize} {currentLang === 'ar' ? 'دينا وشاحنة' : 'Trucks'}
            </span>
          )}
        </div>

        {/* Media count badge & Direct WhatsApp Floating Action Button */}
        <div className="absolute bottom-3 end-3 flex items-center gap-1.5">
          {business.media.length > 0 && (
            <div className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[11px] text-white flex items-center gap-1">
              <Images className="w-3 h-3 text-white" />
              <span>{business.media.length}</span>
            </div>
          )}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              onTrackWhatsapp(business.id);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 cursor-pointer animate-pulse-subtle"
            title={currentLang === 'ar' ? 'واتساب مباشر (طلب عرض سعر)' : 'Direct WhatsApp Quote'}
          >
            <MessageCircle className="w-4 h-4 fill-white" />
          </a>
        </div>

        {/* Business Logo Overlaid */}
        <div className="absolute -bottom-5 start-4">
          <div className="relative">
            <img
              src={business.logo}
              alt={name}
              className="w-14 h-14 rounded-xl border-2 border-white object-cover bg-white shadow-md"
            />
            {business.isVerified && (
              <div
                className="absolute -bottom-1 -end-1 bg-emerald-600 text-white p-0.5 rounded-full ring-2 ring-white"
                title={t.verifiedBadgeTitle}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main card body */}
      <div className="p-4 pt-7 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          {/* Header & Verification */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3
                onClick={() => onSelect(business)}
                className="font-bold text-slate-900 text-base leading-snug hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
              >
                {name}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium">{tagline}</p>
            </div>
          </div>

          {/* Rating & Reviews row */}
          <div className="flex items-center gap-3 mt-2 text-xs">
            <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md font-bold border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{business.rating}</span>
            </div>
            <span className="text-slate-500">
              ({business.reviewsCount} {t.reviews})
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {t.crNumber}: {business.crNumber || '1010XXXXXX'}
            </span>
          </div>

          {/* Service Categories Chips */}
          <div className="flex flex-wrap gap-1 mt-3">
            {business.categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors"
              >
                {categoryLabels[cat]?.[currentLang]}
              </span>
            ))}
            {business.categories.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-md font-bold">
                +{business.categories.length - 3}
              </span>
            )}
          </div>

          {/* Service areas highlight */}
          <div className="mt-2.5 text-xs text-slate-600 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{business.openingHours}</span>
          </div>
        </div>

        {/* Action Buttons: Prominent Call, WhatsApp & Quick Quote */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {/* Direct Call button */}
            <a
              href={`tel:${business.phone}`}
              onClick={() => onTrackCall(business.id)}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2 px-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              title={currentLang === 'ar' ? 'اتصال مباشر بالرقم' : 'Direct Call'}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{currentLang === 'ar' ? 'اتصال مباشر' : currentLang === 'ur' ? 'ڈائریکٹ کال' : 'Direct Call'}</span>
            </a>

            {/* WhatsApp Chat button */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onTrackWhatsapp(business.id)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2 px-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{t.whatsappChat}</span>
            </a>
          </div>

          {/* Quick Quote Button (Bypasses Detail View) & View Profile link */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRequestQuote(business)}
              className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <span>⚡</span>
              <span>{currentLang === 'ar' ? 'طلب عرض سعر سريع' : currentLang === 'ur' ? 'فوری کوٹیشن' : 'Quick Quote'}</span>
            </button>
            <button
              onClick={() => onSelect(business)}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200"
              title={t.viewProfile}
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
