import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { Logo } from './Logo';
import {
  X,
  Star,
  Download,
  ShieldCheck,
  CheckCircle2,
  Share2,
  ThumbsUp,
  Smartphone,
  ChevronRight,
  Info,
  Truck,
  Heart,
} from 'lucide-react';

interface GooglePlayModalProps {
  currentLang: Language;
  onClose: () => void;
}

export const GooglePlayModal: React.FC<GooglePlayModalProps> = ({ currentLang, onClose }) => {
  const [installProgress, setInstallProgress] = useState(0);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      return;
    }

    setIsInstalling(true);
    setInstallProgress(15);

    const interval = setInterval(() => {
      setInstallProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setIsInstalling(false);
          setIsInstalled(true);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const text = {
    ar: {
      appName: 'MoveConnect Saudi | نقل عفش',
      category: 'خدمات منزلية ولوجستيات • رقم 1 في السعودية',
      developer: 'Sakhil Tech Relocation Saudi Arabia',
      containsAds: 'لا توجد إعلانات مزعجة • آمن وموثوق',
      ratingCount: '١٢٫٤ ألف مراجعة',
      downloads: '+٥٠ ألف عملية تنزيل',
      rated: 'مناسب لمن يبلغ ٣ أعوام فما فوق',
      installBtn: 'تثبيت من Google Play',
      installing: 'جاري التنزيل والتثبيت...',
      openBtn: 'فتح التطبيق (جاهز للاستخدام)',
      verifiedByPlayProtect: 'تم التحقق بواسطة Play Protect',
      aboutTitle: 'لمحة عن هذا التطبيق',
      aboutDesc:
        'MoveConnect Saudi هو التطبيق المعتمد الأول لنقل العفش، فك وتركيب الأثاث، والمطابخ، والمكيفات مع أسطول شاحنات دينا مجهزة في جميع مدن المملكة (الرياض، جدة، مكة، الدمام والخبر). تواصل مباشر عبر الهاتف والواتساب بضغطة زر واحدة دون عمولات وسيط.',
      dataSafety: 'أمان البيانات',
      dataSafetyDesc: 'لا تتم مشاركة بياناتك الخاصة مع أطراف ثالثة. جميع السجلات التجارية موثقة رسمياً.',
      versionInfo: 'الإصدار 1.0.0 • محدّث في أكتوبر 2026 • حزمة com.moveconnect.saudi',
    },
    en: {
      appName: 'MoveConnect Saudi - Home Shifting',
      category: 'Home & Relocation Services • #1 in Saudi Arabia',
      developer: 'Sakhil Tech Relocation Saudi Arabia',
      containsAds: 'No intrusive ads • Verified & Safe',
      ratingCount: '12.4K reviews',
      downloads: '50K+ Downloads',
      rated: 'Rated for 3+',
      installBtn: 'Install from Google Play',
      installing: 'Downloading & Installing...',
      openBtn: 'Open App (Ready)',
      verifiedByPlayProtect: 'Verified by Google Play Protect',
      aboutTitle: 'About this app',
      aboutDesc:
        'MoveConnect Saudi is the premier verified platform for home shifting, furniture moving, kitchen assembly, and packing across all Saudi cities (Riyadh, Jeddah, Dammam, Makkah). Direct WhatsApp and phone contact with certified movers without third-party commission.',
      dataSafety: 'Data safety',
      dataSafetyDesc: 'No personal data shared with unauthorized third parties. All mover Commercial Registrations are verified.',
      versionInfo: 'Version 1.0.0 • Updated October 2026 • Package: com.moveconnect.saudi',
    },
    ur: {
      appName: 'MoveConnect Saudi - سامان منتقلی',
      category: 'ہوم سروسز اور لاجسٹکس • سعودی عرب میں نمبر 1',
      developer: 'Sakhil Tech Relocation Saudi Arabia',
      containsAds: 'محفوظ اور تصدیق شدہ',
      ratingCount: '12,400 جائزے',
      downloads: '50,000+ ڈاؤن لوڈز',
      rated: '3+ سال کے لیے موزوں',
      installBtn: 'Google Play سے انسٹال کریں',
      installing: 'انسٹال ہو رہا ہے...',
      openBtn: 'ایپ کھولیں (تیار ہے)',
      verifiedByPlayProtect: 'Play Protect سے تصدیق شدہ',
      aboutTitle: 'اس ایپ کے بارے میں',
      aboutDesc:
        'سعودی عرب میں گھر اور دفتر کے سامان، فرنیچر اور کچن کی باحفاظت منتقلی کے لیے مستند ایپ۔ ریاض، جدہ، دمام اور تمام شہروں میں واٹس ایپ اور فون پر فوری رابطہ۔',
      dataSafety: 'ڈیٹا کی حفاظت',
      dataSafetyDesc: 'صارف کے ڈیٹا کی مکمل حفاظت کی جاتی ہے۔',
      versionInfo: 'ورژن 1.0.0 • پیکیج: com.moveconnect.saudi',
    },
  }[currentLang === 'ar' || currentLang === 'ur' ? currentLang : 'en'];

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 text-slate-900 font-sans">
        {/* Play Store Top Navbar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            {/* Google Play Tri-color logo */}
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M3.6 2.3A1.8 1.8 0 0 0 3 3.6v16.8a1.8 1.8 0 0 0 .6 1.3l.1.1 9.4-9.4v-.2L3.7 2.2z"
              />
              <path
                fill="#34A853"
                d="M17.3 16.5l-4.2-4.2v-.2l4.2-4.2.1.1 5 2.8c1.4.8 1.4 2.1 0 2.9l-5.1 2.8z"
              />
              <path
                fill="#EA4335"
                d="M13.1 12.1L3.7 21.6c.5.5 1.3.5 2.1.1l11.5-6.5-4.2-3.1z"
              />
              <path
                fill="#FBBC05"
                d="M13.1 11.9l4.2-3.1L5.8 2.3c-.8-.4-1.6-.4-2.1.1l9.4 9.5z"
              />
            </svg>
            <span className="font-extrabold text-sm text-slate-700 tracking-tight">
              Google Play
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* App Hero Details inside Play Store */}
        <div className="p-5 sm:p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-md border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-1">
              <Logo size="lg" lang={currentLang} showTagline={false} />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                {text.appName}
              </h2>
              <div className="text-xs font-bold text-emerald-700 mt-0.5">
                {text.developer}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {text.category}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {text.containsAds}
              </div>
            </div>
          </div>

          {/* Quick Metrics (Rating, Downloads, Age) */}
          <div className="grid grid-cols-3 divide-x rtl:divide-x-reverse divide-slate-200 py-3 border-y border-slate-100 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 font-black text-sm text-slate-900">
                <span>4.9</span>
                <Star className="w-3.5 h-3.5 fill-slate-900 text-slate-900" />
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">{text.ratingCount}</div>
            </div>

            <div>
              <div className="font-black text-sm text-slate-900">50K+</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{text.downloads}</div>
            </div>

            <div>
              <div className="inline-block border border-slate-400 rounded-xs px-1 text-[11px] font-black text-slate-800">
                3+
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">{text.rated}</div>
            </div>
          </div>

          {/* Primary Action Button: Install from Google Play */}
          <div className="space-y-2">
            {isInstalled ? (
              <button
                onClick={onClose}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{text.openBtn}</span>
              </button>
            ) : (
              <button
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="w-full bg-[#01875f] hover:bg-[#01704f] active:bg-[#005e42] disabled:bg-slate-300 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:shadow-lg"
              >
                <Download className="w-5 h-5" />
                <span>{isInstalling ? text.installing : text.installBtn}</span>
              </button>
            )}

            {isInstalling && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] font-bold text-[#01875f]">
                  <span>{installProgress}%</span>
                  <span>Google Play Protect Verified</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#01875f] h-2 transition-all duration-300"
                    style={{ width: `${installProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#01875f]" />
              <span>{text.verifiedByPlayProtect}</span>
            </div>
          </div>

          {/* App Screenshots Carousel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>صور من التطبيق (Screenshots)</span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
              <div className="w-40 sm:w-44 h-64 rounded-2xl bg-slate-900 border border-slate-200 overflow-hidden shrink-0 shadow-sm relative group snap-start">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80"
                  alt="Fleet"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 text-white">
                  <div className="text-[10px] font-bold">شاحنات دينا مجهزة 24/7</div>
                </div>
              </div>

              <div className="w-40 sm:w-44 h-64 rounded-2xl bg-slate-900 border border-slate-200 overflow-hidden shrink-0 shadow-sm relative group snap-start">
                <img
                  src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop&q=80"
                  alt="Packaging"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 text-white">
                  <div className="text-[10px] font-bold">تغليف كراتين وحماية نخب أول</div>
                </div>
              </div>

              <div className="w-40 sm:w-44 h-64 rounded-2xl bg-slate-900 border border-slate-200 overflow-hidden shrink-0 shadow-sm relative group snap-start">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80"
                  alt="Assembly"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 text-white">
                  <div className="text-[10px] font-bold">فك وتركيب غرف ومطابخ</div>
                </div>
              </div>
            </div>
          </div>

          {/* About This App */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between font-bold text-slate-900 text-sm">
              <span>{text.aboutTitle}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 rtl:rotate-180" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{text.aboutDesc}</p>
          </div>

          {/* Data Safety */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between font-bold text-slate-900 text-sm">
              <span>{text.dataSafety}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 rtl:rotate-180" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{text.dataSafetyDesc}</p>
          </div>

          {/* Technical Package Details */}
          <div className="bg-slate-50 p-3.5 rounded-2xl text-[11px] text-slate-500 font-mono space-y-1 border border-slate-200/80">
            <div>{text.versionInfo}</div>
            <div>Developer: sakhilhomemovingservices@gmail.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};
