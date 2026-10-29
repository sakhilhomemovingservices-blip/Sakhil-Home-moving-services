import React, { useState } from 'react';
import { BusinessProfile, Language, QuoteEnquiry } from '../types';
import { translations, saudiCities } from '../data/translations';
import {
  X,
  Send,
  Calendar,
  MapPin,
  Home,
  CheckCircle2,
  Phone,
  MessageCircle,
  FileText,
} from 'lucide-react';

interface QuoteRequestModalProps {
  currentLang: Language;
  onClose: () => void;
  targetBusiness: BusinessProfile | null;
  allBusinesses: BusinessProfile[];
  initialEstimate?: {
    propertyType: string;
    distanceKm: number;
    packing: boolean;
    technician: boolean;
    estimatedSar: number;
  } | null;
  onSubmitQuote: (quote: Omit<QuoteEnquiry, 'id' | 'createdAt'>) => void;
}

export const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({
  currentLang,
  onClose,
  targetBusiness,
  allBusinesses,
  initialEstimate,
  onSubmitQuote,
}) => {
  const t = translations[currentLang];

  const [selectedBizId, setSelectedBizId] = useState<string>(
    targetBusiness ? targetBusiness.id : allBusinesses[0]?.id || ''
  );
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+9665');
  const [customerEmail, setCustomerEmail] = useState('');
  const [pickupCity, setPickupCity] = useState(targetBusiness?.city || 'الرياض');
  const [pickupDistrict, setPickupDistrict] = useState('');
  const [destinationCity, setDestinationCity] = useState(targetBusiness?.city || 'الرياض');
  const [destinationDistrict, setDestinationDistrict] = useState('');
  const [moveDate, setMoveDate] = useState('2026-11-05');
  const [propertyType, setPropertyType] = useState<QuoteEnquiry['propertyType']>('apartment_large');
  const [floorPickup, setFloorPickup] = useState(1);
  const [elevatorPickup, setElevatorPickup] = useState(true);
  const [floorDrop, setFloorDrop] = useState(1);
  const [elevatorDrop, setElevatorDrop] = useState(true);
  const [notes, setNotes] = useState(
    initialEstimate
      ? `نوع السكن: ${initialEstimate.propertyType} - التكلفة المقدرة: ${initialEstimate.estimatedSar} ريال.`
      : ''
  );
  const [submitted, setSubmitted] = useState(false);

  const activeBiz = allBusinesses.find((b) => b.id === selectedBizId) || allBusinesses[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    onSubmitQuote({
      businessId: activeBiz.id,
      businessName: activeBiz.name[currentLang] || activeBiz.name.ar,
      customerName,
      customerPhone,
      customerEmail: customerEmail || 'customer@example.com',
      pickupCity,
      pickupDistrict: pickupDistrict || 'وسط المدينة',
      destinationCity,
      destinationDistrict: destinationDistrict || 'الوجهة المحددة',
      moveDate,
      propertyType,
      servicesNeeded: ['home_shifting', 'furniture_moving', 'packing_unpacking'],
      floorPickup,
      elevatorPickup,
      floorDrop,
      elevatorDrop,
      notes,
      status: 'pending',
      estimatedCostSar: initialEstimate?.estimatedSar || 750,
    });

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black">{t.requestQuote}</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {activeBiz
                ? `${currentLang === 'ar' ? 'طلب عرض سعر من:' : 'Target:'} ${
                    activeBiz.name[currentLang] || activeBiz.name.ar
                  }`
                : t.heroSubtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-black text-slate-900">{t.quoteSuccess}</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              {currentLang === 'ar'
                ? 'تم إرسال تفاصيل منزلك وموعد النقل إلى منسق العمليات. يمكنك أيضاً المتابعة عبر الواتساب فوراً للحصول على خصم إضافي.'
                : 'Your move details have been dispatched. You can also chat on WhatsApp directly for instant scheduling.'}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <a
                href={`https://wa.me/${activeBiz?.whatsapp}?text=${encodeURIComponent(
                  `السلام عليكم، أرسلت طلباً لعرض سعر عبر MoveConnect باسم (${customerName}) لنقل العفش من ${pickupCity} (${pickupDistrict}) إلى ${destinationCity}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{currentLang === 'ar' ? 'متابعة سريعة عبر الواتساب' : 'Quick Chat on WhatsApp'}</span>
              </a>

              <button
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-4 rounded-xl text-xs cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
            {/* Target Business Selection (if not pre-locked) */}
            {!targetBusiness && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {currentLang === 'ar' ? 'اختر شركة نقل العفش' : 'Choose Mover'}
                </label>
                <select
                  value={selectedBizId}
                  onChange={(e) => setSelectedBizId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
                >
                  {allBusinesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name[currentLang] || b.name.ar} ({b.city})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Customer Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {currentLang === 'ar' ? 'الاسم بالكامل' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="محمد العتيبي"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {currentLang === 'ar' ? 'رقم الجوال (واتساب)' : 'Mobile (WhatsApp)'} *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+9665XXXXXXXX"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Pickup Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {currentLang === 'ar' ? 'مدينة الاستلام' : 'Pickup City'}
                </label>
                <select
                  value={pickupCity}
                  onChange={(e) => setPickupCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
                >
                  {saudiCities.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.en}>
                      {c[currentLang]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {currentLang === 'ar' ? 'الحي / الشارع' : 'Pickup District'}
                </label>
                <input
                  type="text"
                  required
                  value={pickupDistrict}
                  onChange={(e) => setPickupDistrict(e.target.value)}
                  placeholder={currentLang === 'ar' ? 'مثال: حي الملقا' : 'e.g. Al Malqa'}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>

            {/* Destination Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {currentLang === 'ar' ? 'مدينة التوصيل' : 'Destination City'}
                </label>
                <select
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
                >
                  {saudiCities.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.en}>
                      {c[currentLang]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {currentLang === 'ar' ? 'حي التوصيل' : 'Destination District'}
                </label>
                <input
                  type="text"
                  required
                  value={destinationDistrict}
                  onChange={(e) => setDestinationDistrict(e.target.value)}
                  placeholder={currentLang === 'ar' ? 'مثال: حي النرجس' : 'e.g. Al Narjis'}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>

            {/* Date & Property Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t.movingDate}
                </label>
                <input
                  type="date"
                  value={moveDate}
                  onChange={(e) => setMoveDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t.propertyType}
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
                >
                  <option value="studio">{currentLang === 'ar' ? 'استديو / غرفة' : 'Studio'}</option>
                  <option value="apartment_small">{currentLang === 'ar' ? 'شقة 2 غرف' : '2-Bed Apartment'}</option>
                  <option value="apartment_large">{currentLang === 'ar' ? 'شقة 3-4 غرف' : '3-4 Bed Apartment'}</option>
                  <option value="villa">{currentLang === 'ar' ? 'فيلا كاملة' : 'Full Villa'}</option>
                  <option value="office">{currentLang === 'ar' ? 'مكتب تجاري' : 'Office'}</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {currentLang === 'ar' ? 'ملاحظات إضافية (أجهزة كهربائية، مكيفات، مطبخ)' : 'Additional Notes'}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={currentLang === 'ar' ? 'مثال: أحتاج فك مطبخ ألمنيوم و 3 مكيفات سبليت...' : 'Notes...'}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{t.requestQuote}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
