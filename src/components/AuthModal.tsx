import React, { useState } from 'react';
import { Language, UserAccount } from '../types';
import { translations } from '../data/translations';
import { X, Lock, Mail, User, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  currentLang: Language;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  onRegisterBusinessSuccess: (user: UserAccount, businessName: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentLang,
  onClose,
  onLoginSuccess,
  onRegisterBusinessSuccess,
}) => {
  const t = translations[currentLang];
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [accountType, setAccountType] = useState<'customer' | 'owner'>('owner');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleGoogleLogin = () => {
    // Fast one-click Google Sign-In with real user email from session
    const googleUser: UserAccount = {
      id: 'google-user-' + Date.now(),
      email: email || 'sakhilhomemovingservices@gmail.com',
      name: name || 'Sakhil Movers Saudi',
      role: accountType,
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      ownedBusinessId: accountType === 'owner' ? 'sakhil-moving-saudi' : undefined,
      favorites: [],
    };

    if (accountType === 'owner' && businessName) {
      onRegisterBusinessSuccess(googleUser, businessName);
    } else {
      onLoginSuccess(googleUser);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      setForgotSent(true);
      return;
    }

    const newUser: UserAccount = {
      id: 'usr-' + Date.now(),
      email,
      name: name || (email.split('@')[0] || 'User'),
      role: accountType,
      avatar:
        accountType === 'owner'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      ownedBusinessId: accountType === 'owner' ? 'sakhil-moving-saudi' : undefined,
      favorites: [],
    };

    if (mode === 'register' && accountType === 'owner' && businessName) {
      onRegisterBusinessSuccess(newUser, businessName);
    } else {
      onLoginSuccess(newUser);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black">
              {mode === 'login'
                ? t.login
                : mode === 'register'
                ? currentLang === 'ar'
                  ? 'إنشاء حساب جديد'
                  : 'Create Account'
                : currentLang === 'ar'
                ? 'استعادة كلمة المرور'
                : 'Reset Password'}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">MoveConnect Saudi 🇸🇦</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Quick Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-3 shadow-xs transition-all cursor-pointer hover:border-slate-400"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{t.googleSignIn}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-2 text-[10px] text-slate-400 font-bold uppercase">
              {currentLang === 'ar' ? 'أو عبر البريد' : 'or with email'}
            </span>
          </div>

          {forgotSent ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="font-bold">تم إرسال رابط إعادة تعيين كلمة المرور</div>
              <p className="text-slate-600 text-[11px]">
                يرجى مراجعة بريدك الإلكتروني لتعيين كلمة مرور جديدة.
              </p>
              <button
                onClick={() => setMode('login')}
                className="text-blue-600 font-bold underline text-xs cursor-pointer"
              >
                العودة لتسجيل الدخول
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Account Type Selector for Registration */}
              {mode === 'register' && (
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setAccountType('customer')}
                    className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
                      accountType === 'customer'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.customerMode}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('owner')}
                    className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
                      accountType === 'owner'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.registerBusiness}
                  </button>
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {currentLang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="محمد عبدالله"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              )}

              {mode === 'register' && accountType === 'owner' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    اسم شركة أو مؤسسة نقل العفش *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="مؤسسة نقل عفش سريعة"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                  dir="ltr"
                />
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">كلمة المرور *</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                      >
                        نسيت كلمة المرور؟
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    dir="ltr"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {mode === 'login'
                  ? t.login
                  : mode === 'register'
                  ? 'إنشاء الحساب والمتابعة'
                  : 'إرسال رابط الاستعادة'}
              </button>
            </form>
          )}

          {/* Toggle between login / register */}
          <div className="pt-2 text-center text-slate-600">
            {mode === 'login' ? (
              <p>
                ليس لديك حساب؟{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  سجل الآن مجاناً
                </button>
              </p>
            ) : (
              <p>
                لديك حساب بالفعل؟{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  تسجيل الدخول
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
