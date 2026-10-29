import React, { useState } from 'react';
import { BusinessProfile, Language, ServiceCategory } from '../types';
import { translations, categoryLabels } from '../data/translations';
import {
  Building,
  Plus,
  X,
  MapPin,
  Phone,
  MessageCircle,
  Truck,
  Users,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Camera,
  Globe,
  Clock,
} from 'lucide-react';

interface AddBusinessModalProps {
  currentLang: Language;
  onClose: () => void;
  onAddBusiness: (newBiz: BusinessProfile) => void;
  userEmail?: string;
}

export const AddBusinessModal: React.FC<AddBusinessModalProps> = ({
  currentLang,
  onClose,
  onAddBusiness,
  userEmail = 'sakhilhomemovingservices@gmail.com',
}) => {
  const t = translations[currentLang];

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [taglineAr, setTaglineAr] = useState('');
  const [descAr, setDescAr] = useState('');
  const [city, setCity] = useState('الرياض');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('+9665');
  const [whatsapp, setWhatsapp] = useState('9665');
  const [crNumber, setCrNumber] = useState('');
  const [truckFleetSize, setTruckFleetSize] = useState(6);
  const [workersCount, setWorkersCount] = useState(15);
  const [serviceAreas, setServiceAreas] = useState('شمال الرياض، شرق الرياض، غرب الرياض');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'
  );
  const [logo, setLogo] = useState(
    'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=250&auto=format&fit=crop&q=80'
  );
  const [selectedCats, setSelectedCats] = useState<ServiceCategory[]>([
    'home_shifting',
    'furniture_moving',
    'packing_unpacking',
  ]);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleCategory = (cat: ServiceCategory) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() || !phone.trim()) return;

    const newId = 'biz-' + Date.now();
    const newProfile: BusinessProfile = {
      id: newId,
      ownerEmail: userEmail,
      name: {
        ar: nameAr,
        en: nameEn || nameAr,
        ur: nameAr,
      },
      tagline: {
        ar: taglineAr || 'خدمات نقل عفش وفك وتركيب وتغليف على مدار الساعة 24/7',
        en: taglineAr || 'Professional moving and furniture assembly 24/7',
        ur: taglineAr || 'پیشہ ورانہ شفٹنگ اور پیکنگ سروسز',
      },
      description: {
        ar: descAr || `${nameAr} - أفضل وأسرع خدمات نقل العفش في ${city} مع الضمان والعمالة المدربة.`,
        en: `${nameAr} - Reliable and fast relocation services in ${city}.`,
        ur: `${nameAr} - بہترین اور محفوظ فرنیچر منتقلی سروس۔`,
      },
      logo,
      coverImage,
      phone,
      whatsapp: whatsapp.replace(/\+/g, ''),
      website: `https://${newId}.moveconnect.sa`,
      city,
      address: address || `طريق الملك فهد، ${city}`,
      isServiceAreaOnly: false,
      serviceAreas: serviceAreas.split('،').map((s) => s.trim()).filter(Boolean),
      coordinates: {
        lat: city === 'جدة' ? 21.5433 : city === 'الدمام والخبر' ? 26.4207 : 24.7136,
        lng: city === 'جدة' ? 39.1728 : city === 'الدمام والخبر' ? 50.0888 : 46.6753,
      },
      openingHours: '24 ساعة / 7 أيام - تصاريح النقل متاحة 24/7',
      categories: selectedCats.length > 0 ? selectedCats : ['home_shifting', 'furniture_moving'],
      services: [
        {
          id: 'svc-' + Date.now() + '-1',
          category: 'home_shifting',
          name: 'نقل عفش شقة أو فيلا متكامل',
          description: 'دينا مقفلة مع فك وتركيب غرف النوم وتغليف الأثاث الحساس',
          basePrice: 500,
          priceUnit: 'للرحلة',
        },
        {
          id: 'svc-' + Date.now() + '-2',
          category: 'furniture_moving',
          name: 'فك وتركيب مطابخ ودواليب ايكيا',
          description: 'نجارين محترفين مع صيانة وتعديل المقاسات',
          basePrice: 200,
          priceUnit: 'للغرفة',
        },
      ],
      media: [
        {
          id: 'm-new-1',
          type: 'image',
          url: coverImage,
          title: 'أسطول الدينا وشاحنات النقل المجهزة',
          category: 'trucks',
        },
      ],
      rating: 5.0,
      reviewsCount: 1,
      reviews: [
        {
          id: 'rev-init-' + Date.now(),
          businessId: newId,
          userName: 'فهد العتيبي (أول عميل)',
          rating: 5,
          date: 'اليوم',
          serviceUsed: 'نقل شقة كاملة',
          comment: 'ما شاء الله تبارك الله، التزام بالمواعيد وسرعة في العمل وأمانة تامة.',
        },
      ],
      isVerified: true,
      crNumber: crNumber || '1010' + Math.floor(100000 + Math.random() * 900000),
      establishedYear: new Date().getFullYear(),
      truckFleetSize,
      workersCount,
      teamMembers: [
        {
          id: 'tm-init-1',
          name: 'معلم نجار رئيسي',
          role: 'كبير نجارين فك وتركيب المطابخ وغرف النوم',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
          experienceYears: 8,
          rating: 5.0,
          nationality: 'باكستاني',
          isVerifiedIqama: true,
          specialties: ['مطابخ ايكيا', 'غرف نوم ماستر', 'دواليب تفصيل'],
        },
      ],
      stats: {
        viewsThisMonth: 120,
        searchesAppeared: 350,
        whatsappClicks: 24,
        callClicks: 18,
        enquiriesReceived: 5,
      },
    };

    onAddBusiness(newProfile);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-200">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 end-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 text-white shadow-inner">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black">
                  {currentLang === 'ar'
                    ? 'إضافة نشاط تجاري جديد (Maps Urgent)'
                    : 'Register Business Profile - Maps Urgent'}
                </h3>
                <span className="bg-emerald-400/25 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  FREE REGISTRATION
                </span>
              </div>
              <p className="text-xs text-blue-100/90 mt-0.5">
                {currentLang === 'ar'
                  ? 'أضف مؤسستك لتظهر في خرائط Google Search والبحث الفوري وتستقبل اتصالات العملاء'
                  : 'Add your moving company to appear on Maps Urgent & Google Search'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Form */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {isSuccess ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-black text-slate-900">
                {currentLang === 'ar' ? 'تم إضافة نشاطك التجاري بنجاح!' : 'Business Successfully Registered!'}
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                {currentLang === 'ar'
                  ? `أصبح ملفك التجاري متاحاً الآن على شبكة Maps Urgent و MoveConnect، وبإمكان العملاء في ${city} الاتصال بك وحجز خدمات النقل فوراً.`
                  : 'Your profile is live on Maps Urgent! Customers can now call and request quotes.'}
              </p>
              <button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all cursor-pointer text-xs"
              >
                {currentLang === 'ar' ? 'عرض النشاط الآن' : 'View Profile'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Info */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-1.5 text-sm">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>البيانات الأساسية للمنشأة</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      اسم المؤسسة / الشركة بالعربية *
                    </label>
                    <input
                      type="text"
                      required
                      value={nameAr}
                      onChange={(e) => setNameAr(e.target.value)}
                      placeholder="مثال: مؤسسة النقل السريع لنقل العفش"
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      الاسم بالإنجليزية (اختياري)
                    </label>
                    <input
                      type="text"
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      placeholder="e.g. Fast Movers Saudi"
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    شعار المنشأة التسويقي (Tagline)
                  </label>
                  <input
                    type="text"
                    value={taglineAr}
                    onChange={(e) => setTaglineAr(e.target.value)}
                    placeholder="مثال: فك وتركيب وتغليف بأفضل الأسعار مع الضمان الشامل"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Contact & Location */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-1.5 text-sm">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>المدينة وأرقام التواصل المباشر</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">المدينة الرئيسية *</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white"
                    >
                      <option value="الرياض">الرياض (العاصمة)</option>
                      <option value="جدة">جدة (عروس البحر)</option>
                      <option value="الدمام والخبر">الدمام والخبر والشرقية</option>
                      <option value="مكة المكرمة">مكة المكرمة</option>
                      <option value="المدينة المنورة">المدينة المنورة</option>
                      <option value="القصيم وبريدة">القصيم وبريدة وعنيزة</option>
                      <option value="الطائف">الطائف</option>
                      <option value="تبوك">تبوك</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">رقم هاتف الاتصال *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+966501234567"
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">رقم الواتساب *</label>
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="966501234567"
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      العنوان والحي (لظهوره في خرائط Google)
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="مثال: طريق الملك فهد، حي الصحافة"
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      رقم السجل التجاري (CR) أو وثيقة العمل الحر
                    </label>
                    <input
                      type="text"
                      value={crNumber}
                      onChange={(e) => setCrNumber(e.target.value)}
                      placeholder="مثال: 1010894231"
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    أحياء ونطاقات التغطية (افصل بينها بفاصلة)
                  </label>
                  <input
                    type="text"
                    value={serviceAreas}
                    onChange={(e) => setServiceAreas(e.target.value)}
                    placeholder="شمال الرياض، حي النرجس، حي الملقا، حي الياسمين"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Fleet & Services */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-1.5 text-sm">
                  <Truck className="w-4 h-4 text-purple-600" />
                  <span>الأسطول والعمالة والخدمات المقدمة</span>
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      عدد شاحنات الدينا المتاحة
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={truckFleetSize}
                      onChange={(e) => setTruckFleetSize(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      عدد الفنيين والنجارين والعمالة
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={workersCount}
                      onChange={(e) => setWorkersCount(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    الخدمات المتاحة لدى منشأتك
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        'home_shifting',
                        'furniture_moving',
                        'packing_unpacking',
                        'office_relocation',
                        'loading_unloading',
                        'truck_rental',
                        'international_moving',
                      ] as ServiceCategory[]
                    ).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                          selectedCats.includes(cat)
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {categoryLabels[cat]?.[currentLang] || cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-2xl shadow-lg transition-transform hover:scale-[1.01] cursor-pointer text-sm flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>تسجيل المنشأة وتفعيل الظهور في Maps Urgent</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
