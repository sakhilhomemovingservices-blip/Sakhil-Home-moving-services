import React, { useState } from 'react';
import { VideoTestimonial, Language } from '../types';
import {
  Play,
  Star,
  ShieldCheck,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  MessageSquareQuote,
  Clock,
  User,
} from 'lucide-react';

interface CustomerVideoTestimonialsProps {
  testimonials: VideoTestimonial[];
  currentLang: Language;
  businessName: string;
}

export const CustomerVideoTestimonials: React.FC<CustomerVideoTestimonialsProps> = ({
  testimonials,
  currentLang,
  businessName,
}) => {
  const [activeVideo, setActiveVideo] = useState<VideoTestimonial | null>(null);

  if (!testimonials || testimonials.length === 0) return null;

  const copy = {
    ar: {
      sectionTitle: 'تجارب فيديو حية وموثقة من عملائنا',
      sectionBadge: 'تجارب موثقة 100% بالفيديو',
      sectionSubtitle: `شاهد آراء عملاء حقيقيين وثقوا تجربتهم لنقل الأثاث مع ${businessName}`,
      verifiedCustomer: 'حجز مؤكد ومنفذ',
      watchStory: 'مشاهدة تجربة العميل',
      close: 'إغلاق الفيديو',
    },
    en: {
      sectionTitle: 'Customer Video Stories & Testimonials',
      sectionBadge: '100% Verified Customer Stories',
      sectionSubtitle: `Hear genuine video reviews from customers who moved their home with ${businessName}`,
      verifiedCustomer: 'Verified Relocation',
      watchStory: 'Watch Story',
      close: 'Close Video',
    },
    ur: {
      sectionTitle: 'صارفین کی ویڈیو آراء اور تجربات',
      sectionBadge: 'تصدیق شدہ ویڈیو فیڈ بیک',
      sectionSubtitle: `${businessName} کے ساتھ گھر شفٹ کرنے والے صارفین کے لائیو تاثرات`,
      verifiedCustomer: 'تصدیق شدہ بکنگ',
      watchStory: 'ویڈیو دیکھیں',
      close: 'بند کریں',
    },
  }[currentLang === 'ar' || currentLang === 'ur' ? currentLang : 'en'];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-100 text-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </span>
            <h4 className="text-sm font-black text-slate-900 tracking-tight">
              {copy.sectionTitle}
            </h4>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 hidden sm:inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              {copy.sectionBadge}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">{copy.sectionSubtitle}</p>
        </div>

        <span className="text-[11px] font-bold text-slate-400">
          {testimonials.length} {currentLang === 'ar' ? 'فيديوهات موثقة' : 'Video Stories'}
        </span>
      </div>

      {/* Video Cards Grid / Carousel (Stories & Shorts vertical style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {testimonials.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveVideo(item)}
            className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer bg-slate-900 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 select-none flex flex-col justify-between"
          >
            {/* Background Thumbnail Poster */}
            <img
              src={item.thumbnailUrl}
              alt={item.customerName}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
            />
            {/* Dark gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />

            {/* Top Bar inside card: Duration & Verified Badge */}
            <div className="relative z-10 p-3 flex items-center justify-between">
              <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/10">
                <Clock className="w-3 h-3 text-emerald-400" />
                {item.duration || '0:30'}
              </span>

              {item.verifiedBooking && (
                <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{copy.verifiedCustomer}</span>
                </span>
              )}
            </div>

            {/* Center Glowing Play Button */}
            <div className="relative z-10 self-center">
              <div className="w-12 h-12 rounded-full bg-white/90 text-blue-700 flex items-center justify-center shadow-2xl group-hover:scale-115 transition-transform group-hover:bg-blue-600 group-hover:text-white">
                <Play className="w-5 h-5 fill-current ms-0.5" />
              </div>
            </div>

            {/* Bottom Content inside card */}
            <div className="relative z-10 p-3.5 space-y-1.5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-black text-xs text-white leading-tight">
                    {item.customerName}
                  </h5>
                  <div className="text-[10px] text-slate-300 font-medium">
                    {item.customerCity}
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>

              {/* Quote Excerpt */}
              <p className="text-[11px] text-slate-200 line-clamp-2 italic font-normal leading-relaxed bg-black/40 p-2 rounded-xl border border-white/10">
                "{item.quoteExcerpt}"
              </p>

              <div className="text-[10px] text-emerald-400 font-bold flex items-center justify-between pt-0.5">
                <span>{item.moveType}</span>
                <span className="text-slate-400 font-normal">{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen / Interactive Video Player Lightbox */}
      {activeVideo && (
        <div
          onClick={() => setActiveVideo(null)}
          className="fixed inset-0 z-70 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full bg-slate-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/10"
          >
            {/* Top Control Bar */}
            <div className="p-3.5 bg-slate-900/90 text-white flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <img
                  src={activeVideo.thumbnailUrl}
                  alt={activeVideo.customerName}
                  className="w-8 h-8 rounded-full object-cover border border-slate-600"
                />
                <div>
                  <div className="text-xs font-black">{activeVideo.customerName}</div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{copy.verifiedCustomer}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title={copy.close}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative bg-black flex items-center justify-center max-h-[65vh]">
              <video
                src={activeVideo.videoUrl}
                poster={activeVideo.thumbnailUrl}
                controls
                autoPlay
                playsInline
                className="w-full max-h-[60vh] object-contain"
              />
            </div>

            {/* Bottom Caption & Review Info */}
            <div className="p-4 bg-slate-900/95 text-white space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: activeVideo.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <span className="text-xs font-bold text-white ms-1">5.0</span>
                </div>
                <span className="text-[11px] text-slate-400">{activeVideo.date}</span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-medium bg-white/5 p-3 rounded-2xl border border-white/10">
                "{activeVideo.quoteExcerpt}"
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>نوع الخدمة: <strong className="text-white">{activeVideo.moveType}</strong></span>
                <span>{activeVideo.customerCity}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
