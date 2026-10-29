import React from 'react';
import { Language, ServiceCategory } from '../types';
import { translations, categoryLabels, saudiCities } from '../data/translations';
import {
  Search,
  MapPin,
  ShieldCheck,
  Calculator,
  Truck,
  Sparkles,
  PhoneCall,
  ChevronDown,
} from 'lucide-react';

interface HeroSectionProps {
  currentLang: Language;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedCategory: ServiceCategory | 'all';
  setSelectedCategory: (cat: ServiceCategory | 'all') => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (val: boolean) => void;
  onOpenCalculator: () => void;
  onOpenMap: () => void;
  onOpenPlayStore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLang,
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  selectedCategory,
  setSelectedCategory,
  verifiedOnly,
  setVerifiedOnly,
  onOpenCalculator,
  onOpenMap,
  onOpenPlayStore,
}) => {
  const t = translations[currentLang];

  const categoriesList: ServiceCategory[] = [
    'home_shifting',
    'furniture_moving',
    'office_relocation',
    'packing_unpacking',
    'truck_rental',
    'loading_unloading',
    'local_moving',
    'international_moving',
  ];

  return (
    <div className="relative overflow-hidden bg-radial from-blue-900 via-slate-900 to-slate-950 text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 start-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 end-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-5xl mx-auto text-center space-y-6">
        {/* Verification announcement badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-emerald-300 shadow-sm animate-pulse-subtle">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{t.heroBadge}</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-snug">
          {t.heroTitle}
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-slate-300 text-sm sm:text-lg leading-relaxed font-normal">
          {t.heroSubtitle}
        </p>

        {/* Search & Filter Bar */}
        <div className="max-w-4xl mx-auto mt-6 bg-white rounded-2xl p-2.5 sm:p-3 shadow-2xl text-slate-900 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
            {/* Search Query Input */}
            <div className="md:col-span-6 flex items-center px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:bg-white transition-all">
              <Search className="w-5 h-5 text-slate-400 shrink-0 mx-1.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-hidden font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 px-1.5 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* City Dropdown Selector */}
            <div className="md:col-span-3 flex items-center px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mx-1" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                aria-label={t.filterByCity}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-hidden cursor-pointer"
              >
                {saudiCities.map((city) => (
                  <option key={city.id} value={city.id} className="text-slate-900">
                    {city[currentLang]}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Action buttons */}
            <div className="md:col-span-3 flex items-center gap-2">
              <button
                onClick={onOpenCalculator}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                <span>{t.calculateCostBtn}</span>
              </button>
            </div>
          </div>

          {/* Sub-bar with Quick Filters: Prominent Verified Toggle & Map Trigger */}
          <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
            <div className="flex items-center gap-3 bg-emerald-50/90 border border-emerald-200 px-3 py-1.5 rounded-xl shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="text-start">
                <div className="text-xs font-bold text-emerald-900 leading-none">
                  {currentLang === 'ar' ? 'الشركات المعتمدة فقط' : currentLang === 'ur' ? 'تصدیق شدہ کمپنیاں' : 'Verified Movers Only'}
                </div>
                <div className="text-[10px] text-emerald-700 mt-0.5">
                  {currentLang === 'ar' ? 'إظهار الشركات المرخصة ذات السجل الموثق' : 'Show licensed CR businesses'}
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={verifiedOnly}
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  verifiedOnly ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    verifiedOnly ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <button
              onClick={onOpenMap}
              className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.nearbyMoversOnMap}</span>
            </button>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="pt-2">
          <div className="flex items-center justify-center flex-wrap gap-2 max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-300'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
              }`}
            >
              {t.allCategories}
            </button>

            {categoriesList.map((catKey) => {
              const item = categoryLabels[catKey];
              const isSelected = selectedCategory === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5 opacity-80" />
                  <span>{item[currentLang]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Trust metrics bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4 border-t border-white/10 text-slate-300">
          <div>
            <div className="text-xl sm:text-2xl font-black text-white">2,450+</div>
            <div className="text-xs text-slate-400">
              {currentLang === 'ar' ? 'دينا وشاحنة جاهزة' : currentLang === 'ur' ? 'ڈینا اور ٹرک تیار' : 'Dyna Trucks Ready'}
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400">100%</div>
            <div className="text-xs text-slate-400">
              {currentLang === 'ar' ? 'سجل تجاري معتمد' : currentLang === 'ur' ? 'کمرشل رجسٹریشن تصدیق' : 'CR Verified Movers'}
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-white">★ 4.9 / 5</div>
            <div className="text-xs text-slate-400">
              {currentLang === 'ar' ? 'تقييم رضا العملاء' : currentLang === 'ur' ? 'کسٹمر ریٹنگ' : 'Customer Rating'}
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-blue-400">1 Tap</div>
            <div className="text-xs text-slate-400">
              {currentLang === 'ar' ? 'تواصل فوري واتساب وهاتف' : currentLang === 'ur' ? 'براہ راست رابطہ' : 'Direct WhatsApp & Call'}
            </div>
          </div>
        </div>

        {/* Official Store Download Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenPlayStore}
            className="bg-black/85 hover:bg-black text-white px-4 py-2 rounded-2xl border border-white/20 flex items-center gap-2.5 transition-all hover:scale-105 cursor-pointer shadow-lg hover:border-emerald-500/50"
          >
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
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
            <div className="text-start leading-tight">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">GET IT ON</div>
              <div className="text-sm font-black text-white tracking-wide">Google Play</div>
            </div>
          </button>

          <button
            onClick={onOpenPlayStore}
            className="bg-black/85 hover:bg-black text-white px-4 py-2 rounded-2xl border border-white/20 flex items-center gap-2.5 transition-all hover:scale-105 cursor-pointer shadow-lg hover:border-white/40"
          >
            <svg className="w-6 h-6 shrink-0 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.66-1.09 1.73-.95 2.76.99.08 2.05-.51 2.68-1.26" />
            </svg>
            <div className="text-start leading-tight">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Download on the</div>
              <div className="text-sm font-black text-white tracking-wide">App Store</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
