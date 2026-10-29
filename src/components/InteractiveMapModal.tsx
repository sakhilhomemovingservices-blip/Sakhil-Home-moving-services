import React, { useState } from 'react';
import { BusinessProfile, Language } from '../types';
import { translations } from '../data/translations';
import {
  X,
  MapPin,
  Navigation,
  Phone,
  MessageCircle,
  ShieldCheck,
  Star,
  ExternalLink,
  Compass,
  ArrowRight,
} from 'lucide-react';

interface InteractiveMapModalProps {
  currentLang: Language;
  onClose: () => void;
  businesses: BusinessProfile[];
  onSelectBusiness: (b: BusinessProfile) => void;
  onRequestQuote: (b: BusinessProfile) => void;
}

export const InteractiveMapModal: React.FC<InteractiveMapModalProps> = ({
  currentLang,
  onClose,
  businesses,
  onSelectBusiness,
  onRequestQuote,
}) => {
  const t = translations[currentLang];
  const [selectedMover, setSelectedMover] = useState<BusinessProfile>(businesses[0]);
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number; label: string }>({
    lat: 24.7136,
    lng: 46.6753,
    label: currentLang === 'ar' ? 'الرياض - حي الملقا' : 'Riyadh - Al Malqa',
  });
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lng: number; label: string }>({
    lat: 24.8236,
    lng: 46.6353,
    label: currentLang === 'ar' ? 'الرياض - حي النرجس' : 'Riyadh - Al Narjis',
  });

  const [mapCenter, setMapCenter] = useState<'riyadh' | 'jeddah' | 'dammam'>('riyadh');

  // Simulated map coordinates mapping for SVG visualizer
  const cityViewports = {
    riyadh: { name: 'الرياض', lat: 24.7136, lng: 46.6753, zoom: '12x' },
    jeddah: { name: 'جدة ومكة', lat: 21.5433, lng: 39.1728, zoom: '11x' },
    dammam: { name: 'الشرقية', lat: 26.4207, lng: 50.0888, zoom: '11x' },
  };

  const openGoogleMapsDirections = (mover: BusinessProfile) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${mover.coordinates.lat},${mover.coordinates.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full h-[90vh] overflow-hidden flex flex-col border border-slate-200">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black">{t.nearbyMoversOnMap}</h3>
              <p className="text-xs text-slate-400">
                {currentLang === 'ar'
                  ? 'مواقع وأحياء تغطية أفضل شركات نقل العفش المعتمدة'
                  : 'Live verified moving companies and service dispatch zones'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick city presets */}
            <div className="hidden sm:flex items-center bg-slate-800 p-1 rounded-xl text-xs">
              {(['riyadh', 'jeddah', 'dammam'] as const).map((city) => (
                <button
                  key={city}
                  onClick={() => setMapCenter(city)}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    mapCenter === city ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cityViewports[city].name}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Map Body: Sidebar + Interactive Map Canvas */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left / Sidebar Movers list */}
          <div className="w-full md:w-80 border-e border-slate-200 bg-slate-50 flex flex-col shrink-0 overflow-y-auto max-h-60 md:max-h-full">
            <div className="p-3 bg-white border-b border-slate-200 text-xs font-bold text-slate-600 flex items-center justify-between">
              <span>{businesses.length} شركات متاحة بالقرب منك</span>
              <span className="text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                سجل تجاري 100%
              </span>
            </div>

            <div className="divide-y divide-slate-200 p-2 space-y-1.5">
              {businesses.map((biz) => {
                const isSelected = selectedMover?.id === biz.id;
                const name = biz.name[currentLang] || biz.name.ar;
                return (
                  <div
                    key={biz.id}
                    onClick={() => setSelectedMover(biz)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-2 border-blue-600 shadow-xs'
                        : 'bg-white hover:bg-slate-100 border border-slate-200/70'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <img
                        src={biz.logo}
                        alt={name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-slate-900 truncate">{name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span className="truncate">{biz.city}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{biz.rating}</span>
                          <span className="text-slate-400 font-normal">
                            ({biz.reviewsCount})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Map Canvas Area */}
          <div className="flex-1 relative bg-slate-900 flex flex-col justify-between overflow-hidden">
            {/* Styled Realistic Map Canvas Background */}
            <div className="absolute inset-0 bg-[#e5e3df] overflow-hidden">
              {/* Map grid lines simulation */}
              <svg className="w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="roadGrid" width="120" height="120" patternUnits="userSpaceOnUse">
                    {/* Highways */}
                    <path
                      d="M 0 40 L 120 40 M 60 0 L 60 120 M 0 90 L 120 90"
                      stroke="#ffffff"
                      strokeWidth="6"
                    />
                    <path
                      d="M 0 40 L 120 40 M 60 0 L 60 120"
                      stroke="#fcd34d"
                      strokeWidth="3"
                    />
                    <path
                      d="M 20 0 L 20 120 M 100 0 L 100 120"
                      stroke="#ffffff"
                      strokeWidth="3"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="#e8ece9" />
                {/* Simulated districts & parks */}
                <circle cx="30%" cy="40%" r="180" fill="#d1e7dd" opacity="0.6" />
                <circle cx="70%" cy="65%" r="140" fill="#d1e7dd" opacity="0.5" />
                <rect width="100%" height="100%" fill="url(#roadGrid)" />

                {/* Simulated route line between pickup and dropoff */}
                <path
                  d="M 280 220 Q 380 260 520 200"
                  stroke="#2563eb"
                  strokeWidth="5"
                  strokeDasharray="8 6"
                  fill="none"
                />
              </svg>

              {/* Map Markers for Businesses */}
              <div className="absolute inset-0 p-8 pointer-events-none">
                {businesses.map((biz, idx) => {
                  const isSelected = selectedMover?.id === biz.id;
                  // Predefined visual map offsets
                  const positions = [
                    { top: '35%', left: '42%' },
                    { top: '48%', left: '58%' },
                    { top: '65%', left: '30%' },
                    { top: '25%', left: '70%' },
                  ];
                  const pos = positions[idx % positions.length];

                  return (
                    <div
                      key={biz.id}
                      style={{ top: pos.top, left: pos.left }}
                      onClick={() => setSelectedMover(biz)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={`p-1.5 rounded-full shadow-2xl transition-all transform ${
                            isSelected
                              ? 'scale-125 bg-blue-600 text-white ring-4 ring-blue-300'
                              : 'bg-emerald-600 text-white hover:scale-110'
                          }`}
                        >
                          <MapPin className="w-5 h-5 fill-current" />
                        </div>

                        {/* Marker Tooltip Label */}
                        <div
                          className={`mt-1 px-2.5 py-1 rounded-xl shadow-lg text-[11px] font-bold whitespace-nowrap border ${
                            isSelected
                              ? 'bg-slate-900 text-white border-blue-400'
                              : 'bg-white text-slate-800 border-slate-200'
                          }`}
                        >
                          {biz.name[currentLang]?.split(' ')[0] || biz.name.ar.split(' ')[0]}
                          <span className="text-amber-400 ms-1">★{biz.rating}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Pickup & Dropoff Route Pins */}
                <div
                  style={{ top: '38%', left: '32%' }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                >
                  <div className="px-2 py-1 bg-blue-700 text-white rounded-lg text-[10px] font-black shadow-md flex items-center gap-1">
                    <span>🟢 {currentLang === 'ar' ? 'موقع التحميل' : 'Pickup'}</span>
                  </div>
                </div>

                <div
                  style={{ top: '32%', left: '60%' }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                >
                  <div className="px-2 py-1 bg-rose-700 text-white rounded-lg text-[10px] font-black shadow-md flex items-center gap-1">
                    <span>🏁 {currentLang === 'ar' ? 'موقع التنزيل' : 'Delivery'}</span>
                  </div>
                </div>
              </div>

              {/* Map controls floating overlay */}
              <div className="absolute top-4 start-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-slate-200 text-xs space-y-1 max-w-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span>{currentLang === 'ar' ? 'تغطية النقل الميداني' : 'Real-Time Dispatch'}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {currentLang === 'ar'
                    ? 'الدينا والشاحنات تنتشر في كافة أحياء المدينة بدون اشتراط الحضور للمقر.'
                    : 'Fleets deployed across city districts for instant on-demand moving.'}
                </p>
              </div>
            </div>

            {/* Bottom Floating Info Card for Selected Mover */}
            {selectedMover && (
              <div className="relative m-3 sm:m-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-200/90 animate-in slide-in-from-bottom-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedMover.logo}
                      alt={selectedMover.name[currentLang] || selectedMover.name.ar}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">
                          {selectedMover.name[currentLang] || selectedMover.name.ar}
                        </h4>
                        {selectedMover.isVerified && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            {t.crNumber}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{selectedMover.address}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => openGoogleMapsDirections(selectedMover)}
                      className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5 text-blue-600" />
                      <span>{t.directions}</span>
                    </button>

                    <a
                      href={`tel:${selectedMover.phone}`}
                      className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{t.callNow}</span>
                    </a>

                    <button
                      onClick={() => {
                        onClose();
                        onSelectBusiness(selectedMover);
                      }}
                      className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      {t.viewProfile}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
