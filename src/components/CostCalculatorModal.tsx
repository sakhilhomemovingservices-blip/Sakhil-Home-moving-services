import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import {
  X,
  Calculator,
  Home,
  Building,
  Building2,
  PackageCheck,
  Wrench,
  Truck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface CostCalculatorModalProps {
  currentLang: Language;
  onClose: () => void;
  onRequestQuoteWithDetails: (details: {
    propertyType: string;
    distanceKm: number;
    packing: boolean;
    technician: boolean;
    estimatedSar: number;
  }) => void;
}

export const CostCalculatorModal: React.FC<CostCalculatorModalProps> = ({
  currentLang,
  onClose,
  onRequestQuoteWithDetails,
}) => {
  const t = translations[currentLang];

  const [propertyType, setPropertyType] = useState<'studio' | 'apartment_2' | 'apartment_4' | 'villa' | 'office'>('apartment_2');
  const [distanceKm, setDistanceKm] = useState(25);
  const [hasElevatorPickup, setHasElevatorPickup] = useState(true);
  const [hasElevatorDrop, setHasElevatorDrop] = useState(true);
  const [needPacking, setNeedPacking] = useState(true);
  const [needTechnician, setNeedTechnician] = useState(true); // AC & Kitchen carpenter

  // Calculate pricing
  const basePrices = {
    studio: 300,
    apartment_2: 550,
    apartment_4: 850,
    villa: 1400,
    office: 1100,
  };

  const propertyLabels = {
    studio: { ar: 'استديو أو غرفة واحدة', en: 'Studio / 1 Room', ur: 'اسٹوڈیو یا 1 کمرہ' },
    apartment_2: { ar: 'شقة 2 - 3 غرف وصالة', en: '2-3 Bedroom Apartment', ur: '2-3 کمروں کا اپارٹمنٹ' },
    apartment_4: { ar: 'شقة كبيرة 4 - 5 غرف', en: '4-5 Bedroom Apartment', ur: 'بڑا اپارٹمنٹ 4-5 کمرے' },
    villa: { ar: 'فيلا كاملة دورين أو دوبلكس', en: 'Full Villa / Duplex', ur: 'مکمل ولا یا ڈوپلیکس' },
    office: { ar: 'مكتب تجاري أو شركة', en: 'Commercial Office', ur: 'کاروباری دفتر' },
  };

  let totalMin = basePrices[propertyType];
  // distance factor: 5 SAR per km above 10km
  if (distanceKm > 10) {
    totalMin += Math.round((distanceKm - 10) * 4);
  }
  // stairs factor
  if (!hasElevatorPickup) totalMin += 100;
  if (!hasElevatorDrop) totalMin += 100;
  // packing materials
  if (needPacking) totalMin += propertyType === 'villa' ? 350 : 200;
  // technician (carpenter & AC)
  if (needTechnician) totalMin += propertyType === 'villa' ? 300 : 180;

  const totalMax = Math.round(totalMin * 1.25);

  const handleProceed = () => {
    onRequestQuoteWithDetails({
      propertyType: propertyLabels[propertyType][currentLang],
      distanceKm,
      packing: needPacking,
      technician: needTechnician,
      estimatedSar: totalMin,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-radial from-blue-800 to-slate-900 text-white p-5 sm:p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-400">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black">{t.costCalculator}</h3>
              <p className="text-xs text-slate-300 mt-0.5">{t.costCalculatorDesc}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Step 1: Property Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. {t.propertyType}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(['studio', 'apartment_2', 'apartment_4', 'villa', 'office'] as const).map((type) => {
                const isSelected = propertyType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPropertyType(type)}
                    className={`p-3 rounded-2xl border text-start transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{propertyLabels[type][currentLang]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Distance */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. {currentLang === 'ar' ? 'المسافة التقديرية بين الموقعين' : 'Estimated Distance'}
              </label>
              <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                {distanceKm} {currentLang === 'ar' ? 'كم' : 'KM'}
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="150"
              step="5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              aria-label={currentLang === 'ar' ? 'المسافة التقديرية بين الموقعين' : 'Estimated Distance'}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>{currentLang === 'ar' ? 'داخل نفس الحي (5 كم)' : 'Same Area (5km)'}</span>
              <span>{currentLang === 'ar' ? 'بين أطراف المدينة (50 كم)' : 'Cross City (50km)'}</span>
              <span>{currentLang === 'ar' ? 'بين مدينتين (150 كم)' : 'Intercity (150km)'}</span>
            </div>
          </div>

          {/* Step 3: Add-ons & Elevators */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              3. {currentLang === 'ar' ? 'المصعد والخدمات الإضافية' : 'Elevators & Extras'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-3 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={needPacking}
                  onChange={(e) => setNeedPacking(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                />
                <span className="text-xs font-semibold text-slate-800">
                  {currentLang === 'ar' ? 'تغليف نايلون وكراتين وفقاعات' : 'Bubble & Box Packing'}
                </span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={needTechnician}
                  onChange={(e) => setNeedTechnician(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                />
                <span className="text-xs font-semibold text-slate-800">
                  {currentLang === 'ar' ? 'فك وتركيب مطابخ ومكيفات' : 'Kitchen & AC Techs'}
                </span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={hasElevatorPickup}
                  onChange={(e) => setHasElevatorPickup(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                />
                <span className="text-xs font-semibold text-slate-800">
                  {currentLang === 'ar' ? 'يوجد مصعد بموقع الاستلام' : 'Elevator at Pickup'}
                </span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={hasElevatorDrop}
                  onChange={(e) => setHasElevatorDrop(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                />
                <span className="text-xs font-semibold text-slate-800">
                  {currentLang === 'ar' ? 'يوجد مصعد بموقع التوصيل' : 'Elevator at Delivery'}
                </span>
              </label>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-radial from-slate-900 to-blue-950 text-white rounded-2xl p-4 sm:p-5 border border-blue-500/30 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>{t.estimatedRange}</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {currentLang === 'ar' ? 'سعر تقديري شامل الضريبة' : 'Estimated with VAT'}
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-black text-white flex items-baseline gap-2">
              <span className="text-emerald-400">
                {totalMin} - {totalMax}
              </span>
              <span className="text-sm font-bold text-slate-300">{t.sar}</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {currentLang === 'ar'
                ? '* هذا السعر تقريبي مبني على متوسط أسعار الشركات المعتمدة، ويتغير حسب حجم المنقولات والاتفاق النهائي.'
                : '* This estimate is based on verified market averages and may adjust according to actual inventory.'}
            </p>

            <button
              onClick={handleProceed}
              className="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-black py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01] cursor-pointer"
            >
              <span>{currentLang === 'ar' ? 'طلب عروض أسعار رسمية بهذا التقدير' : 'Send Quote Request with This Estimate'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
