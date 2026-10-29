import React, { useState, useEffect } from 'react';
import { BusinessProfile, Language } from '../types';
import {
  MapPin,
  Compass,
  CheckCircle2,
  Plus,
  X,
  Sliders,
  ShieldCheck,
  Truck,
  Sparkles,
  Maximize2,
} from 'lucide-react';

interface ServiceAreaMapEditorProps {
  business: BusinessProfile;
  currentLang: Language;
  onUpdateServiceAreas: (areas: string[], radiusKm: number) => void;
}

interface DistrictPoint {
  id: string;
  name: { ar: string; en: string; ur: string };
  distanceKm: number;
  xPercent: number; // 0 to 100 on visual map canvas
  yPercent: number;
}

// Predefined districts for primary Saudi metropolitan areas
const CITY_DISTRICTS: Record<string, DistrictPoint[]> = {
  riyadh: [
    { id: 'sahafa', name: { ar: 'حي الصحافة', en: 'Al Sahafa', ur: 'الصحافہ' }, distanceKm: 5, xPercent: 50, yPercent: 46 },
    { id: 'malqa', name: { ar: 'حي الملقا', en: 'Al Malqa', ur: 'الملقا' }, distanceKm: 8, xPercent: 42, yPercent: 38 },
    { id: 'narjis', name: { ar: 'حي النرجس', en: 'Al Narjis', ur: 'النرجس' }, distanceKm: 12, xPercent: 62, yPercent: 34 },
    { id: 'yasmin', name: { ar: 'حي الياسمين', en: 'Al Yasmin', ur: 'الیسمین' }, distanceKm: 10, xPercent: 55, yPercent: 38 },
    { id: 'olaya', name: { ar: 'حي العليا', en: 'Al Olaya', ur: 'العلیا' }, distanceKm: 16, xPercent: 48, yPercent: 60 },
    { id: 'diriyah', name: { ar: 'الدرعية', en: 'Al Diriyah', ur: 'الدرعیہ' }, distanceKm: 22, xPercent: 30, yPercent: 45 },
    { id: 'nakheel', name: { ar: 'حي النخيل', en: 'Al Nakheel', ur: 'النخیل' }, distanceKm: 14, xPercent: 38, yPercent: 50 },
    { id: 'sulay', name: { ar: 'حي السلي', en: 'Al Sulay', ur: 'السلی' }, distanceKm: 32, xPercent: 72, yPercent: 70 },
    { id: 'muzahmiyah', name: { ar: 'المزاحمية', en: 'Al Muzahmiyah', ur: 'المزاحمیہ' }, distanceKm: 48, xPercent: 18, yPercent: 65 },
    { id: 'kharj', name: { ar: 'محافظة الخرج', en: 'Al Kharj', ur: 'الخرج' }, distanceKm: 75, xPercent: 78, yPercent: 88 },
  ],
  jeddah: [
    { id: 'rawdah', name: { ar: 'حي الروضة', en: 'Al Rawdah', ur: 'الروضہ' }, distanceKm: 6, xPercent: 48, yPercent: 50 },
    { id: 'shati', name: { ar: 'حي الشاطئ', en: 'Al Shati', ur: 'الشاطی' }, distanceKm: 9, xPercent: 38, yPercent: 42 },
    { id: 'obhur', name: { ar: 'أبحر الشمالية', en: 'North Obhur', ur: 'ابحر' }, distanceKm: 24, xPercent: 42, yPercent: 22 },
    { id: 'hamra', name: { ar: 'حي الحمراء', en: 'Al Hamra', ur: 'الحمراء' }, distanceKm: 12, xPercent: 52, yPercent: 64 },
    { id: 'makkah_rd', name: { ar: 'طريق مكة السريع', en: 'Makkah Highway', ur: 'مکہ روڈ' }, distanceKm: 38, xPercent: 75, yPercent: 75 },
  ],
  dammam: [
    { id: 'faisaliyah', name: { ar: 'حي الفيصلية', en: 'Al Faisaliyah', ur: 'الفیصلیہ' }, distanceKm: 7, xPercent: 45, yPercent: 45 },
    { id: 'khobar', name: { ar: 'الخبر الجنوبية', en: 'Al Khobar', ur: 'الخبر' }, distanceKm: 18, xPercent: 68, yPercent: 65 },
    { id: 'dhahran', name: { ar: 'الظهران (أرامكو)', en: 'Dhahran', ur: 'الظہران' }, distanceKm: 15, xPercent: 58, yPercent: 55 },
    { id: 'jubail', name: { ar: 'مدينة الجبيل', en: 'Al Jubail', ur: 'الجبیل' }, distanceKm: 85, xPercent: 35, yPercent: 15 },
  ],
};

export const ServiceAreaMapEditor: React.FC<ServiceAreaMapEditorProps> = ({
  business,
  currentLang,
  onUpdateServiceAreas,
}) => {
  const [radiusKm, setRadiusKm] = useState<number>(35);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(business.serviceAreas);
  const [newCustomArea, setNewCustomArea] = useState('');
  const [autoSyncFeedback, setAutoSyncFeedback] = useState(false);

  // Detect which city districts to use
  const cityKey = business.city.includes('جدة')
    ? 'jeddah'
    : business.city.includes('الدمام') || business.city.includes('الخبر')
    ? 'dammam'
    : 'riyadh';

  const availableDistricts = CITY_DISTRICTS[cityKey] || CITY_DISTRICTS.riyadh;

  // Whenever radius changes, automatically compute in-range districts and update JSON
  const handleRadiusChange = (newRadius: number) => {
    setRadiusKm(newRadius);

    // Compute districts inside the radius
    const inside = availableDistricts
      .filter((d) => d.distanceKm <= newRadius)
      .map((d) => d.name.ar);

    // Keep any existing custom names
    const customOnes = selectedDistricts.filter(
      (sd) => !availableDistricts.some((ad) => ad.name.ar === sd)
    );

    // Prefix with city name if large coverage
    const baseList = newRadius >= 30 ? [`${business.city} كاملة`, ...inside] : inside;
    const merged = Array.from(new Set([...baseList, ...customOnes]));

    setSelectedDistricts(merged);
    onUpdateServiceAreas(merged, newRadius);

    // Visual feedback
    setAutoSyncFeedback(true);
    setTimeout(() => setAutoSyncFeedback(false), 2000);
  };

  const handleToggleDistrict = (districtName: string) => {
    let next: string[];
    if (selectedDistricts.includes(districtName)) {
      next = selectedDistricts.filter((d) => d !== districtName);
    } else {
      next = [...selectedDistricts, districtName];
    }
    setSelectedDistricts(next);
    onUpdateServiceAreas(next, radiusKm);
    setAutoSyncFeedback(true);
    setTimeout(() => setAutoSyncFeedback(false), 2000);
  };

  const handleAddCustomArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomArea.trim()) return;
    const next = Array.from(new Set([...selectedDistricts, newCustomArea.trim()]));
    setSelectedDistricts(next);
    onUpdateServiceAreas(next, radiusKm);
    setNewCustomArea('');
    setAutoSyncFeedback(true);
    setTimeout(() => setAutoSyncFeedback(false), 2000);
  };

  // Visual SVG circle pixel radius calculation (scale based on 0-100km)
  // Map canvas has width & height = 100%, center is 50%, 50%
  const radiusPercent = Math.min(48, Math.max(12, Math.round((radiusKm / 100) * 45)));

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden space-y-4">
      {/* Widget Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-50/60 to-slate-50">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-600 text-white shadow-2xs">
              <Compass className="w-4 h-4" />
            </span>
            <h4 className="font-black text-sm text-slate-900">
              {currentLang === 'ar'
                ? 'محدد نطاق تغطية نقل العفش التفاعلي (Interactive Service Radius Map)'
                : 'Interactive Service Area Radius Map'}
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {currentLang === 'ar'
              ? 'حدد نصف قطر تغطية أسطول الشاحنات بالكيلومتر لتحديث قائمة مناطق الخدمة تلقائياً في ملفك'
              : 'Adjust moving truck dispatch radius to automatically update your serviceAreas in JSON'}
          </p>
        </div>

        {autoSyncFeedback && (
          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>تم التحديث التلقائي في بيانات JSON ✓</span>
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5 space-y-5">
        {/* Radius Controls: Slider & Quick Preset Buttons */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>نطاق التغطية بالكيلومتر (Service Radius):</span>
            </label>
            <div className="text-sm font-black text-blue-700 bg-white px-3 py-1 rounded-xl border border-blue-200 shadow-2xs">
              {radiusKm} كم (KM)
            </div>
          </div>

          {/* Range Slider */}
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={radiusKm}
            onChange={(e) => handleRadiusChange(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />

          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              { km: 10, label: '10 كم (نفس الحي)' },
              { km: 25, label: '25 كم (شمال ووسط المدينة)' },
              { km: 50, label: '50 كم (المدينة وضواحيها)' },
              { km: 90, label: '90 كم (المنطقة والمدن المجاورة)' },
            ].map((preset) => (
              <button
                key={preset.km}
                type="button"
                onClick={() => handleRadiusChange(preset.km)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  radiusKm === preset.km
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Visual Map Canvas */}
        <div className="relative h-72 sm:h-84 rounded-2xl bg-[#e5e3df] overflow-hidden border border-slate-300 shadow-inner select-none">
          {/* Stylized vector map grid background */}
          <svg className="w-full h-full opacity-65 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="areaRoadGrid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 0 40 L 80 40 M 40 0 L 40 80" stroke="#ffffff" strokeWidth="5" />
                <path d="M 0 40 L 80 40 M 40 0 L 40 80" stroke="#fcd34d" strokeWidth="2.5" />
                <circle cx="40" cy="40" r="1.5" fill="#cbd5e1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="#e8ece9" />
            <circle cx="50%" cy="50%" r="200" fill="#d1e7dd" opacity="0.4" />
            <rect width="100%" height="100%" fill="url(#areaRoadGrid)" />
          </svg>

          {/* SVG Radius Coverage Circle (Scaled dynamically with radiusKm) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <circle
              cx="50%"
              cy="50%"
              r={`${radiusPercent}%`}
              fill="#2563eb"
              fillOpacity="0.14"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />
            {/* Center concentric pulse ring */}
            <circle
              cx="50%"
              cy="50%"
              r={`${Math.max(6, radiusPercent * 0.45)}%`}
              fill="#10b981"
              fillOpacity="0.1"
              stroke="#10b981"
              strokeWidth="1.5"
            />
          </svg>

          {/* Center Business Headquarter / Dispatch Center Pin */}
          <div
            style={{ top: '50%', left: '50%' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none"
          >
            <div className="p-2 rounded-full bg-blue-700 text-white shadow-xl ring-4 ring-blue-300/80 animate-pulse">
              <Truck className="w-5 h-5" />
            </div>
            <span className="mt-1 px-2.5 py-0.5 rounded-full bg-slate-900/90 text-white text-[10px] font-black shadow-md border border-white/20 whitespace-nowrap">
              مقر / نقطة انطلاق دينا {business.name.ar.split(' ')[0]}
            </span>
          </div>

          {/* District Pins Scattered over Canvas */}
          {availableDistricts.map((district) => {
            const isInside = district.distanceKm <= radiusKm;
            const isManuallySelected = selectedDistricts.includes(district.name.ar);
            const active = isInside || isManuallySelected;

            return (
              <div
                key={district.id}
                style={{ top: `${district.yPercent}%`, left: `${district.xPercent}%` }}
                onClick={() => handleToggleDistrict(district.name.ar)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-transform hover:scale-110 group`}
                title={`${district.name.ar} (${district.distanceKm} كم) - انقر للإضافة أو الإزالة`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`p-1.5 rounded-full shadow-md transition-colors ${
                      active
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                        : 'bg-slate-400 text-white opacity-60'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                  </div>

                  <span
                    className={`mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs whitespace-nowrap border ${
                      active
                        ? 'bg-white text-emerald-800 border-emerald-300 shadow-xs'
                        : 'bg-slate-100 text-slate-500 border-slate-300 opacity-75'
                    }`}
                  >
                    {district.name[currentLang] || district.name.ar}
                    <span className="text-[9px] ms-1 text-slate-400">({district.distanceKm}كم)</span>
                  </span>
                </div>
              </div>
            );
          })}

          {/* Floating Map Legend Overlay */}
          <div className="absolute bottom-2.5 start-2.5 bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 shadow-md text-[11px] text-slate-700 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
              <span>دائرة التغطية المحددة: {radiusKm} كم</span>
            </div>
            <div className="text-[10px] text-slate-500">
              الأحياء داخل الدائرة خضراء (مشمولة بالخدمة). انقر على أي حي لتعديله.
            </div>
          </div>
        </div>

        {/* Live Covered Service Areas Tag List (Synchronized with JSON) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                قائمة الأحياء المغطاة حالياً ({selectedDistricts.length} منطقة في ملف الـ JSON):
              </span>
            </label>
            <span className="text-[11px] text-slate-400 font-medium">
              تظهر هذه القائمة للعملاء عند البحث
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200 min-h-[50px]">
            {selectedDistricts.map((district, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-xl text-xs font-semibold flex items-center gap-1.5 group"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{district}</span>
                <button
                  type="button"
                  onClick={() => handleToggleDistrict(district)}
                  className="text-slate-400 hover:text-rose-600 p-0.5 rounded-full cursor-pointer transition-colors"
                  title="إزالة الحي"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Add custom district write-in */}
          <form onSubmit={handleAddCustomArea} className="flex gap-2 text-xs pt-1">
            <input
              type="text"
              value={newCustomArea}
              onChange={(e) => setNewCustomArea(e.target.value)}
              placeholder="أضف حياً أو شارعاً مخصصاً (مثال: حي الرمال، طريق الملك سلمان)..."
              className="flex-1 p-2 rounded-xl border border-slate-300 bg-white"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة حي</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
