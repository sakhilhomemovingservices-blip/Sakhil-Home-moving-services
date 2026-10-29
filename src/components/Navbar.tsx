import React, { useState } from 'react';
import { Logo } from './Logo';
import { Language, UserAccount } from '../types';
import { translations, languageConfig } from '../data/translations';
import {
  Globe,
  Heart,
  User,
  ShieldCheck,
  Building,
  Menu,
  X,
  Calculator,
  MapPin,
  Sparkles,
  PhoneCall,
  Clock,
} from 'lucide-react';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  activeView: 'explore' | 'dashboard' | 'admin' | 'favorites';
  setActiveView: (view: 'explore' | 'dashboard' | 'admin' | 'favorites') => void;
  favoritesCount: number;
  onOpenCalculator: () => void;
  onOpenMap: () => void;
  onOpenInstallModal: () => void;
  onSwitchUser: (user: UserAccount) => void;
  availableUsers: UserAccount[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  currentUser,
  onOpenAuth,
  onLogout,
  activeView,
  setActiveView,
  favoritesCount,
  onOpenCalculator,
  onOpenMap,
  onOpenInstallModal,
  onSwitchUser,
  availableUsers,
}) => {
  const t = translations[currentLang];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top micro banner */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t.allVerifiedNotice}
            </span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3 text-amber-400" />
              {t.allTimesGranted}
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">
              {currentLang === 'ar'
                ? 'مركز خدمة العملاء والدعم الفوري: 920000000'
                : currentLang === 'ur'
                ? 'کسٹمر سپورٹ ہیلپ لائن: 920000000'
                : 'Customer Support: 920000000'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={onOpenInstallModal}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-2.5 py-0.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-xs"
            >
              <span>📲</span>
              <span>{currentLang === 'ar' ? 'تثبيت التطبيق' : currentLang === 'ur' ? 'ایپ انسٹال کریں' : 'Install App'}</span>
            </button>
            <button
              onClick={onOpenCalculator}
              className="hover:text-emerald-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              {t.costCalculator}
            </button>
            <button
              onClick={onOpenMap}
              className="hover:text-blue-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              {t.nearbyMoversOnMap}
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveView('explore')}
          className="cursor-pointer transition-transform hover:scale-[1.01]"
        >
          <Logo size="md" lang={currentLang} showTagline={true} />
        </div>

        {/* Center / Desktop Action Buttons */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => setActiveView('explore')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeView === 'explore'
                ? 'bg-blue-50 text-blue-700 shadow-xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {currentLang === 'ar' ? 'الرئيسية والدليل' : currentLang === 'ur' ? 'مرکزی ڈائرکٹری' : 'Explore Movers'}
          </button>

          <button
            onClick={onOpenMap}
            className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            {currentLang === 'ar' ? 'الخريطة الحية' : currentLang === 'ur' ? 'نقشہ پر تلاش' : 'Interactive Map'}
          </button>

          <button
            onClick={onOpenCalculator}
            className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-blue-600" />
            {t.calculateCostBtn}
          </button>

          <button
            onClick={() => setActiveView('favorites')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 relative cursor-pointer ${
              activeView === 'favorites'
                ? 'bg-rose-50 text-rose-700'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${favoritesCount > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-500'}`}
            />
            <span>{currentLang === 'ar' ? 'المفضلة' : currentLang === 'ur' ? 'پسندیدہ' : 'Favorites'}</span>
            {favoritesCount > 0 && (
              <span className="bg-rose-600 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Business Owner Dashboard button */}
          {currentUser?.role === 'owner' && (
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'dashboard'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <Building className="w-4 h-4" />
              {t.dashboard}
            </button>
          )}

          {/* Admin Panel button */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setActiveView('admin')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'admin'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              {t.adminPanel}
            </button>
          )}
        </div>

        {/* Right tools (Language switcher, Quick Demo Role Switch, User Profile) */}
        <div className="flex items-center gap-2.5">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            >
              <Globe className="w-4 h-4 text-blue-600" />
              <span>{languageConfig[currentLang]?.flag || '🇸🇦'}</span>
              <span className="hidden sm:inline font-bold">{languageConfig[currentLang]?.native || 'العربية'}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute top-full mt-1.5 end-0 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 max-h-80 overflow-y-auto">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  اختر اللغة / Select Language
                </div>
                {(Object.keys(languageConfig) as Language[]).map((lng) => {
                  const item = languageConfig[lng];
                  return (
                    <button
                      key={lng}
                      onClick={() => {
                        onLanguageChange(lng);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-start px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-blue-50 transition-colors cursor-pointer ${
                        currentLang === lng ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-sm">{item.flag}</span>
                        <span>{item.native}</span>
                        <span className="text-[10px] text-slate-400">({item.label})</span>
                      </span>
                      {currentLang === lng && <span className="text-blue-600 font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Demo Switcher (Simulate Customer, Business Owner Sakhil, Admin) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all cursor-pointer"
              title={t.switchRole}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="truncate max-w-[120px]">
                {currentUser ? currentUser.name : t.switchRole}
              </span>
            </button>

            {roleSwitcherOpen && (
              <div className="absolute top-full mt-1.5 end-0 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
                  {currentLang === 'ar' ? 'تبديل تجربة المستخدم' : currentLang === 'ur' ? 'صارف اکاؤنٹ تبدیل کریں' : 'Quick Demo Profile'}
                </div>
                {availableUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSwitchUser(u);
                      setRoleSwitcherOpen(false);
                    }}
                    className={`w-full text-start p-2 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer ${
                      currentUser?.id === u.id ? 'bg-blue-50 text-blue-900 font-semibold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate">{u.name}</div>
                      <div className="text-[10px] text-slate-500 capitalize">
                        {u.role === 'owner'
                          ? 'مالك منشأة (صخيل لنقل العفش)'
                          : u.role === 'admin'
                          ? 'مسؤول المنصة (Admin)'
                          : 'عميل (Customer)'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Main User Account / Sign In */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (currentUser.role === 'owner') setActiveView('dashboard');
                  else if (currentUser.role === 'admin') setActiveView('admin');
                  else setActiveView('favorites');
                }}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
                title={currentUser.name}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-600/20"
                />
              </button>
              <button
                onClick={onLogout}
                className="hidden xl:inline text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 cursor-pointer"
              >
                {t.logout}
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>{t.login}</span>
            </button>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 shadow-lg">
          <button
            onClick={() => {
              onOpenInstallModal();
              setMobileMenuOpen(false);
            }}
            className="w-full text-start px-3.5 py-2.5 rounded-xl text-sm font-black bg-emerald-600 text-white flex items-center gap-2 shadow-sm"
          >
            <span>📲</span>
            <span>{currentLang === 'ar' ? 'تثبيت تطبيق MoveConnect على هاتفك' : currentLang === 'ur' ? 'موبائل پر ایپ انسٹال کریں' : 'Install MoveConnect App'}</span>
          </button>

          <button
            onClick={() => {
              setActiveView('explore');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-start px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
              activeView === 'explore' ? 'bg-blue-50 text-blue-700' : 'text-slate-800'
            }`}
          >
            {currentLang === 'ar' ? 'الرئيسية ودليل الشركات' : currentLang === 'ur' ? 'مرکزی ڈائرکٹری' : 'Explore Movers'}
          </button>

          <button
            onClick={() => {
              onOpenMap();
              setMobileMenuOpen(false);
            }}
            className="w-full text-start px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            {currentLang === 'ar' ? 'الخريطة التفاعلية' : currentLang === 'ur' ? 'نقشہ دیکھیں' : 'Interactive Map'}
          </button>

          <button
            onClick={() => {
              onOpenCalculator();
              setMobileMenuOpen(false);
            }}
            className="w-full text-start px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 flex items-center gap-2"
          >
            <Calculator className="w-4 h-4 text-blue-600" />
            {t.costCalculator}
          </button>

          <button
            onClick={() => {
              setActiveView('favorites');
              setMobileMenuOpen(false);
            }}
            className="w-full text-start px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              {currentLang === 'ar' ? 'الشركات المفضلة' : currentLang === 'ur' ? 'پسندیدہ کمپنیاں' : 'Favorites'}
            </span>
            {favoritesCount > 0 && (
              <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {favoritesCount}
              </span>
            )}
          </button>

          {currentUser?.role === 'owner' && (
            <button
              onClick={() => {
                setActiveView('dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-start px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-800 flex items-center gap-2"
            >
              <Building className="w-4 h-4 text-emerald-700" />
              {t.dashboard}
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => {
                setActiveView('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-start px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-purple-50 text-purple-800 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              {t.adminPanel}
            </button>
          )}

          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-400 mb-2">
              {currentLang === 'ar' ? 'تبديل الحساب التجريبي' : currentLang === 'ur' ? 'صارف منتخب کریں' : 'Switch User Demo'}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {availableUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    onSwitchUser(u);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2 rounded-lg text-center text-xs border ${
                    currentUser?.id === u.id
                      ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="truncate font-semibold">{u.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-slate-500 capitalize">{u.role}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
