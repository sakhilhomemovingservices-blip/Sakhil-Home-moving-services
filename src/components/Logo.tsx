import React from 'react';
import { Language } from '../types';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  lang?: Language;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', lang = 'ar', showTagline = false }) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Visual Mark: Truck + House + Location Pin */}
      <div className={`relative ${iconSizes[size]} shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Premium Gradient: Saudi Royal Blue to Deep Cobalt */}
            <linearGradient id="mcBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="100%" stopColor="#0B2564" />
            </linearGradient>
            {/* Saudi Emerald Green Gradient */}
            <linearGradient id="mcGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Background Badge Hexagon/Shield in Soft White/Ice Blue */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="24"
            fill="#F8FAFC"
            stroke="#E2E8F0"
            strokeWidth="3"
          />

          {/* House Silhouette (White & Green Gable Roof) */}
          <path
            d="M 50 16 L 24 38 L 32 38 L 32 68 L 68 68 L 68 38 L 76 38 Z"
            fill="url(#mcBlueGrad)"
            opacity="0.95"
          />

          {/* House Inner Gable Window (Light) */}
          <path
            d="M 50 24 L 38 34 L 62 34 Z"
            fill="#FFFFFF"
            opacity="0.9"
          />

          {/* Modern Moving Truck Bed & Cabin Integrated Across Front */}
          <path
            d="M 20 48 L 52 48 L 52 68 L 20 68 Z"
            fill="url(#mcGreenGrad)"
          />
          {/* Truck Front Cabin */}
          <path
            d="M 52 52 L 64 52 L 72 61 L 72 68 L 52 68 Z"
            fill="url(#mcBlueGrad)"
          />
          {/* Truck Cabin Windshield */}
          <path
            d="M 55 54 L 63 54 L 69 61 L 55 61 Z"
            fill="#E0F2FE"
          />

          {/* Wheels with Silver Hubs */}
          <circle cx="32" cy="68" r="8" fill="#1E293B" />
          <circle cx="32" cy="68" r="3.5" fill="#F1F5F9" />
          <circle cx="62" cy="68" r="8" fill="#1E293B" />
          <circle cx="62" cy="68" r="3.5" fill="#F1F5F9" />

          {/* Speed / Motion Whiskers */}
          <path
            d="M 12 55 L 18 55 M 10 61 L 17 61 M 13 67 L 18 67"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Prominent Saudi Emerald Pin Floating At Top Right */}
          <g filter="url(#shadow)">
            <path
              d="M 72 14 C 65.5 14 60 19.5 60 26 C 60 34.5 72 45 72 45 C 72 45 84 34.5 84 26 C 84 19.5 78.5 14 72 14 Z"
              fill="url(#mcGreenGrad)"
            />
            {/* Center Star / Dot in Pin */}
            <circle cx="72" cy="25" r="4" fill="#FFFFFF" />
          </g>
        </svg>
      </div>

      {/* Brand Name & Typography */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5 font-black tracking-tight leading-none">
          <span className={`${textSizes[size]} text-slate-900 tracking-tight font-extrabold`}>
            Move<span className="text-blue-700">Connect</span>
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            {lang === 'ar' ? 'السعودية 🇸🇦' : lang === 'ur' ? 'سعودیہ 🇸🇦' : 'Saudi 🇸🇦'}
          </span>
        </div>

        {showTagline && (
          <span className="text-[11px] font-medium text-slate-500 mt-0.5">
            {lang === 'ar'
              ? 'شبكة نقل العفش المعتمدة بالمملكة'
              : lang === 'ur'
              ? 'سعودی عرب کا موونگ پلیٹ فارم'
              : 'Certified Saudi Moving Network'}
          </span>
        )}
      </div>
    </div>
  );
};
