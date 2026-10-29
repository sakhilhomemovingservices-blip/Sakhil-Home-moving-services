import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { Logo } from './Logo';
import {
  X,
  Download,
  Smartphone,
  Apple,
  Monitor,
  CheckCircle2,
  Share2,
  PlusSquare,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Truck,
} from 'lucide-react';

interface InstallAppModalProps {
  currentLang: Language;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ currentLang, onClose }) => {
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>('android');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback notification
      alert(
        currentLang === 'ar'
          ? 'لتثبيت التطبيق على هاتفك، اضغط على زر القائمة (⋮) في المتصفح ثم اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية".'
          : 'To install, tap your browser menu (⋮) and select "Install App" or "Add to Home Screen".'
      );
    }
  };

  const copy = {
    ar: {
      title: 'تثبيت تطبيق MoveConnect Saudi',
      subtitle: 'احصل على تجربة أسرع بدون إنترنت مع إشعارات مباشرة بعروض الأسعار',
      installBtn: 'تثبيت التطبيق الآن مجاناً',
      installedMsg: 'التطبيق مثبت بالفعل على جهازك!',
      androidTitle: 'أجهزة أندرويد (Android & Google Play)',
      iosTitle: 'أجهزة أبل (iPhone & iPad)',
      desktopTitle: 'الكمبيوتر واللابتوب (Windows & Mac)',
      features: [
        'وصول فوري بضغطة زر من الشاشة الرئيسية بدون الحاجة لفتح المتصفح',
        'محادثات واتساب واتصال مباشر فوري مع شاحنات نقل العفش المعتمدة',
        'حاسبة أسعار فورية تعمل حتى عند انقطاع الإنترنت',
        'إشعارات فورية عند استلام عروض الأسعار من شركات النقل',
      ],
      packageInfo: 'حزمة التطبيق الجاهزة للنشر:',
      androidSteps: [
        'اضغط على زر "تثبيت التطبيق الآن مجاناً" بالأعلى.',
        'أو من متصفح Chrome، اضغط على زر القائمة الثلاثي (⋮) في الزاوية العلوية.',
        'اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية" (Install App).',
        'سيظهر شعار MoveConnect Saudi فوراً بجانب تطبيقات هاتفك.',
      ],
      iosSteps: [
        'افتح الموقع في متصفح Safari على جهاز الآيفون أو الآيباد.',
        'اضغط على زر المشاركة (Share) في أسفل الشاشة.',
        'مرر لأسفل واختر "إضافة إلى الصفحة الرئيسية" (Add to Home Screen).',
        'اضغط على "إضافة" (Add) في الزاوية العلوية، وستجده فوراً على شاشة هاتفك.',
      ],
      desktopSteps: [
        'من متصفح Google Chrome أو Microsoft Edge، اضغط على أيقونة التثبيت ⊕ في شريط العنوان بالأعلى.',
        'أو افتح قائمة المتصفح واختر "تثبيت MoveConnect Saudi كبرنامج مستقل".',
        'سيفتح التطبيق كنافذة تطبيق مستقلة فائقة السرعة على سطح المكتب.',
      ],
    },
    en: {
      title: 'Install MoveConnect Saudi App',
      subtitle: 'Fast native experience with offline capability and instant quote alerts',
      installBtn: 'Install App Now (Free)',
      installedMsg: 'App is already installed on your device!',
      androidTitle: 'Android & Google Play',
      iosTitle: 'Apple iPhone & iPad',
      desktopTitle: 'Desktop & Laptop (Windows / Mac)',
      features: [
        'One-tap access from your home screen without opening browser',
        'Direct WhatsApp & phone calling to verified movers anytime',
        'Instant cost estimator with offline caching',
        'Real-time notifications for incoming moving quotes',
      ],
      packageInfo: 'Application Release Package Info:',
      androidSteps: [
        'Click the "Install App Now" button above.',
        'Or in Chrome, tap the 3-dots menu (⋮) in the top right.',
        'Select "Install app" or "Add to Home screen".',
        'The MoveConnect Saudi icon will appear on your home screen.',
      ],
      iosSteps: [
        'Open this website in Safari on your iPhone or iPad.',
        'Tap the Share button at the bottom of the screen.',
        'Scroll down and tap "Add to Home Screen".',
        'Tap "Add" in the top right corner. The app will be ready on your phone.',
      ],
      desktopSteps: [
        'In Chrome or Edge, click the Install icon (⊕) in the address bar.',
        'Or open browser settings and select "Install MoveConnect Saudi".',
        'The app will launch as a standalone desktop application.',
      ],
    },
    ur: {
      title: 'MoveConnect Saudi ایپ انسٹال کریں',
      subtitle: 'براہ راست اپنے موبائل کی ہوم اسکرین پر انسٹال کریں',
      installBtn: 'ابھی مفت ایپ انسٹال کریں',
      installedMsg: 'ایپ آپ کے ڈیوائس پر پہلے سے انسٹال ہے!',
      androidTitle: 'اینڈرائیڈ اور گوگل پلے',
      iosTitle: 'ایپل آئی فون اور آئی پیڈ',
      desktopTitle: 'کمپیوٹر اور لیپ ٹاپ',
      features: [
        'براؤزر کھولے بغیر موبائل اسکرین سے فوری رسائی',
        'واٹس ایپ اور کالز کے ذریعے ڈائریکٹ رابطہ',
        'انٹرنیٹ کے بغیر بھی ریٹ کیلکولیٹر کی سہولت',
        'کوٹیشنز کے فوری نوٹیفیکیشنز',
      ],
      packageInfo: 'ایپلیکیشن ریلیز پیکج:',
      androidSteps: [
        'اوپر دیے گئے "ابھی مفت ایپ انسٹال کریں" بٹن پر کلک کریں۔',
        'یا کروم براؤزر کے اوپر تین نقطوں (⋮) پر ٹیپ کریں۔',
        '"Install app" یا "Add to Home screen" منتخب کریں۔',
      ],
      iosSteps: [
        'آئی فون میں Safari براؤزر کھولیں۔',
        'نیچے شیئر (Share) کے آئیکن پر کلک کریں۔',
        '"Add to Home Screen" منتخب کریں اور شامل کریں۔',
      ],
      desktopSteps: [
        'کروم براؤزر کے ایڈریس بار میں انسٹال آئیکن (⊕) پر کلک کریں۔',
      ],
    },
  }[currentLang === 'ar' || currentLang === 'ur' ? currentLang : 'en'];

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-radial from-blue-900 via-slate-900 to-slate-950 text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 end-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3">
              <Logo size="md" lang={currentLang} showTagline={false} />
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 space-y-1 relative z-10">
            <h3 className="text-xl font-black">{copy.title}</h3>
            <p className="text-xs text-slate-300">{copy.subtitle}</p>
          </div>

          {/* Quick Install CTA Button */}
          <div className="mt-4 relative z-10">
            {isInstalled ? (
              <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{copy.installedMsg}</span>
              </div>
            ) : (
              <button
                onClick={handleNativeInstall}
                className="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-black py-3 px-4 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01] cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>{copy.installBtn}</span>
              </button>
            )}
          </div>
        </div>

        {/* Platform Selector Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex gap-2 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'android' ? 'bg-white text-blue-700 shadow-xs' : 'hover:bg-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Android / Play Store</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'ios' ? 'bg-white text-blue-700 shadow-xs' : 'hover:bg-slate-200'
            }`}
          >
            <Apple className="w-4 h-4 text-slate-800" />
            <span>Apple iPhone (iOS)</span>
          </button>

          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'desktop' ? 'bg-white text-blue-700 shadow-xs' : 'hover:bg-slate-200'
            }`}
          >
            <Monitor className="w-4 h-4 text-blue-600" />
            <span>Windows / Mac</span>
          </button>
        </div>

        {/* Instructions Body */}
        <div className="p-5 sm:p-6 space-y-5 text-xs text-slate-700">
          {/* Features checkmarks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100">
            {copy.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-[11px] font-medium text-slate-700">{feat}</span>
              </div>
            ))}
          </div>

          {/* Android Steps */}
          {activeTab === 'android' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>{copy.androidTitle}</span>
              </h4>

              <div className="space-y-2.5">
                {copy.androidSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-slate-800 font-medium leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>

              {/* Package release details */}
              <div className="bg-slate-900 text-white p-3.5 rounded-2xl text-[11px] space-y-1">
                <div className="font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{copy.packageInfo}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1">
                  <div>Package ID: <span className="font-mono text-white">com.moveconnect.saudi</span></div>
                  <div>Target Version: <span className="text-white">v1.0.0 (API 36)</span></div>
                  <div>PWA Offline: <span className="text-emerald-400">Enabled ✓</span></div>
                  <div>Sign-In: <span className="text-white">Google Play Ready</span></div>
                </div>
              </div>
            </div>
          )}

          {/* iOS Steps */}
          {activeTab === 'ios' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Apple className="w-4 h-4 text-slate-900" />
                <span>{copy.iosTitle}</span>
              </h4>

              <div className="space-y-2.5">
                {copy.iosSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-slate-800 font-medium leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Desktop Steps */}
          {activeTab === 'desktop' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Monitor className="w-4 h-4 text-blue-600" />
                <span>{copy.desktopTitle}</span>
              </h4>

              <div className="space-y-2.5">
                {copy.desktopSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-slate-800 font-medium leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
