import React, { useState, useEffect } from 'react';
import {
  BusinessProfile,
  Language,
  QuoteEnquiry,
  Review,
  MediaItem,
  UserAccount,
  ReportItem,
  ServiceCategory,
} from './types';
import {
  INITIAL_BUSINESSES,
  INITIAL_ENQUIRIES,
  INITIAL_USERS,
  INITIAL_REPORTS,
} from './data/initialData';
import { translations, categoryLabels } from './data/translations';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BusinessCard } from './components/BusinessCard';
import { BusinessDetailModal } from './components/BusinessDetailModal';
import { CostCalculatorModal } from './components/CostCalculatorModal';
import { QuoteRequestModal } from './components/QuoteRequestModal';
import { InteractiveMapModal } from './components/InteractiveMapModal';
import { MediaGalleryModal } from './components/MediaGalleryModal';
import { OwnerDashboard } from './components/OwnerDashboard';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { ReportModal } from './components/ReportModal';
import { InstallAppModal } from './components/InstallAppModal';
import { GooglePlayModal } from './components/GooglePlayModal';
import { Logo } from './components/Logo';
import {
  Compass,
  Calculator,
  Heart,
  ShieldCheck,
  Phone,
  MessageCircle,
  Truck,
  Building,
  User,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  MapPin,
} from 'lucide-react';

export default function App() {
  // Language & Direction State
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    const saved = localStorage.getItem('moveconnect_lang');
    return (saved as Language) || 'ar';
  });

  useEffect(() => {
    localStorage.setItem('moveconnect_lang', currentLang);
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' || currentLang === 'ur' ? 'rtl' : 'ltr';
  }, [currentLang]);

  // Persistent Businesses State
  const [businesses, setBusinesses] = useState<BusinessProfile[]>(() => {
    const saved = localStorage.getItem('moveconnect_businesses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_BUSINESSES;
  });

  useEffect(() => {
    localStorage.setItem('moveconnect_businesses', JSON.stringify(businesses));
  }, [businesses]);

  // Persistent Enquiries State
  const [enquiries, setEnquiries] = useState<QuoteEnquiry[]>(() => {
    const saved = localStorage.getItem('moveconnect_enquiries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ENQUIRIES;
  });

  useEffect(() => {
    localStorage.setItem('moveconnect_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  // Persistent Users State
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('moveconnect_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS;
  });

  useEffect(() => {
    localStorage.setItem('moveconnect_users', JSON.stringify(users));
  }, [users]);

  // Current Logged-In User (Default to Sakhil owner for direct access to business dashboard)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('moveconnect_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS[0]; // Sakhil owner
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('moveconnect_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('moveconnect_current_user');
    }
  }, [currentUser]);

  // Persistent Reports State
  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem('moveconnect_reports');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_REPORTS;
  });

  useEffect(() => {
    localStorage.setItem('moveconnect_reports', JSON.stringify(reports));
  }, [reports]);

  // Favorites (Array of Business IDs)
  const [favorites, setFavorites] = useState<string[]>(() => {
    return currentUser?.favorites || ['sakhil-moving-saudi'];
  });

  const toggleFavorite = (businessId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(businessId);
      const next = exists ? prev.filter((id) => id !== businessId) : [...prev, businessId];
      if (currentUser) {
        const updatedUser = { ...currentUser, favorites: next };
        setCurrentUser(updatedUser);
      }
      return next;
    });
  };

  // Views & Modals
  const [activeView, setActiveView] = useState<'explore' | 'dashboard' | 'admin' | 'favorites'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Modals state
  const [detailBusiness, setDetailBusiness] = useState<BusinessProfile | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [quoteTargetBusiness, setQuoteTargetBusiness] = useState<BusinessProfile | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [calculatorQuoteData, setCalculatorQuoteData] = useState<any>(null);
  const [lightboxMedia, setLightboxMedia] = useState<MediaItem | null>(null);
  const [reportingBusiness, setReportingBusiness] = useState<BusinessProfile | null>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isPlayStoreModalOpen, setIsPlayStoreModalOpen] = useState(false);

  const t = translations[currentLang];

  // Track call & WhatsApp stats
  const trackCall = (businessId: string) => {
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === businessId
          ? { ...b, stats: { ...b.stats, callClicks: b.stats.callClicks + 1 } }
          : b
      )
    );
  };

  const trackWhatsapp = (businessId: string) => {
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === businessId
          ? { ...b, stats: { ...b.stats, whatsappClicks: b.stats.whatsappClicks + 1 } }
          : b
      )
    );
  };

  // Add review to a business
  const handleAddReview = (
    businessId: string,
    newRev: Omit<Review, 'id' | 'businessId'>
  ) => {
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id !== businessId) return b;
        const review: Review = {
          ...newRev,
          id: 'rev-' + Date.now(),
          businessId,
        };
        const updatedReviews = [review, ...b.reviews];
        const newRating = Number(
          (
            updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length
          ).toFixed(1)
        );
        return {
          ...b,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: newRating,
        };
      })
    );

    if (detailBusiness?.id === businessId) {
      setDetailBusiness((prev) => {
        if (!prev) return null;
        const review: Review = {
          ...newRev,
          id: 'rev-' + Date.now(),
          businessId,
        };
        const updatedReviews = [review, ...prev.reviews];
        return {
          ...prev,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
        };
      });
    }
  };

  // Submit quote request
  const handleSubmitQuote = (quoteData: Omit<QuoteEnquiry, 'id' | 'createdAt'>) => {
    const newEnquiry: QuoteEnquiry = {
      ...quoteData,
      id: 'enq-' + Date.now(),
      createdAt: currentLang === 'ar' ? 'الآن' : currentLang === 'ur' ? 'ابھی' : 'Just now',
    };
    setEnquiries((prev) => [newEnquiry, ...prev]);

    // Update business enquiry stats
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === quoteData.businessId
          ? { ...b, stats: { ...b.stats, enquiriesReceived: b.stats.enquiriesReceived + 1 } }
          : b
      )
    );
  };

  // Filter businesses
  const filteredBusinesses = businesses.filter((b) => {
    const nameMatch =
      b.name.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceAreas.some((sa) => sa.toLowerCase().includes(searchQuery.toLowerCase()));

    const cityMatch =
      selectedCity === 'all' ||
      b.city.toLowerCase().includes(selectedCity.toLowerCase()) ||
      (selectedCity === 'riyadh' && b.city.includes('الرياض')) ||
      (selectedCity === 'jeddah' && b.city.includes('جدة')) ||
      (selectedCity === 'dammam' && (b.city.includes('الدمام') || b.city.includes('الخبر'))) ||
      (selectedCity === 'mecca' && b.city.includes('مكة')) ||
      (selectedCity === 'medina' && b.city.includes('المدينة'));

    const categoryMatch =
      selectedCategory === 'all' || b.categories.includes(selectedCategory);

    const verifiedMatch = !verifiedOnly || b.isVerified;

    return nameMatch && cityMatch && categoryMatch && verifiedMatch;
  });

  // Favorite businesses list
  const favoriteBusinesses = businesses.filter((b) => favorites.includes(b.id));

  // Current user's owned business (for dashboard)
  const currentOwnerBusiness =
    businesses.find((b) => b.id === currentUser?.ownedBusinessId) || businesses[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 pb-16 md:pb-0">
      {/* Navigation Bar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => setCurrentUser(null)}
        activeView={activeView}
        setActiveView={setActiveView}
        favoritesCount={favorites.length}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenMap={() => setIsMapOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onSwitchUser={(u) => setCurrentUser(u)}
        availableUsers={users}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: EXPLORE / DIRECTORY */}
        {activeView === 'explore' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <HeroSection
              currentLang={currentLang}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              verifiedOnly={verifiedOnly}
              setVerifiedOnly={setVerifiedOnly}
              onOpenCalculator={() => setIsCalculatorOpen(true)}
              onOpenMap={() => setIsMapOpen(true)}
              onOpenPlayStore={() => setIsPlayStoreModalOpen(true)}
            />

            {/* Results Header & Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Truck className="w-6 h-6 text-blue-700" />
                    <span>
                      {selectedCategory === 'all'
                        ? currentLang === 'ar'
                          ? 'أفضل شركات نقل العفش المعتمدة في المملكة'
                          : currentLang === 'ur'
                          ? 'سعودی عرب کی معتبر ترین موونگ کمپنیاں'
                          : 'Top Verified Moving Companies in Saudi Arabia'
                        : categoryLabels[selectedCategory]?.[currentLang]}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {currentLang === 'ar'
                      ? `تم العثور على ${filteredBusinesses.length} منشأة متخصصة معتمدة بسجل تجاري رسمي`
                      : `Found ${filteredBusinesses.length} certified moving companies with verified CR`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMapOpen(true)}
                    className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold py-2 px-3.5 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-emerald-600" />
                    <span>{t.nearbyMoversOnMap}</span>
                  </button>
                  <button
                    onClick={() => setIsCalculatorOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>{t.costCalculator}</span>
                  </button>
                </div>
              </div>

              {/* Business Cards Grid */}
              {filteredBusinesses.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-4 my-8">
                  <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <Truck className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {currentLang === 'ar'
                      ? 'لم يتم العثور على شركات تطابق بحثك'
                      : 'No moving companies match your filter'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {currentLang === 'ar'
                      ? 'جرب البحث باسم مدينة أخرى أو إزالة الفلاتر لعرض جميع الناقلين المعتمدين.'
                      : 'Try resetting your city or category filters.'}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCity('all');
                      setSelectedCategory('all');
                      setVerifiedOnly(false);
                    }}
                    className="bg-blue-600 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
                  >
                    {currentLang === 'ar' ? 'عرض جميع الشركات' : 'Reset Filters'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBusinesses.map((biz) => (
                    <BusinessCard
                      key={biz.id}
                      business={biz}
                      currentLang={currentLang}
                      onSelect={(b) => setDetailBusiness(b)}
                      onRequestQuote={(b) => {
                        setQuoteTargetBusiness(b);
                        setIsQuoteModalOpen(true);
                      }}
                      isFavorite={favorites.includes(biz.id)}
                      onToggleFavorite={toggleFavorite}
                      onTrackCall={trackCall}
                      onTrackWhatsapp={trackWhatsapp}
                    />
                  ))}
                </div>
              )}

              {/* Service Highlights & Trust section */}
              <div className="mt-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    {t.heroBadge}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    لماذا تختار منصة MoveConnect لنقل أثاثك في السعودية؟
                  </h3>
                  <p className="text-xs text-slate-500">
                    نحن لا نوفر مجرد أرقام اتصال، بل نضمن لك التعامل مع شركات نظامية تملك سجلاً تجارياً سارياً وعمالة مدربة.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs pt-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-slate-900 text-sm">سجل تجاري معتمد (CR)</div>
                    <p className="text-slate-600 leading-relaxed">
                      يتم تدقيق بيانات السجل التجاري ورخصة بلدي لكل شركة قبل إتاحة تواصل العملاء معها.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-slate-900 text-sm">دينا مغلقة ومجهزة</div>
                    <p className="text-slate-600 leading-relaxed">
                      شاحنات نظيفة ومجهزة ببطانات حماية لحماية مقتنياتك من درجات الحرارة والأتربة.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-slate-900 text-sm">تواصل فوري واتساب وهاتف</div>
                    <p className="text-slate-600 leading-relaxed">
                      تواصل مباشر بضغطة زر واحدة دون وسيط ودون أي عمولات خفية.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      <Calculator className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-slate-900 text-sm">حاسبة تقدير فورية</div>
                    <p className="text-slate-600 leading-relaxed">
                      اعرف التكلفة المتوقعة لنقل غرفتك أو شقتك أو فيلتك قبل الاتصال لتضمن أفضل سعر.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: FAVORITES VIEW */}
        {activeView === 'favorites' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                  <span>
                    {currentLang === 'ar' ? 'الشركات المحفوظة بالمفضلة' : 'Saved Favorites'}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  قارن بين شركات نقل العفش التي قمت بحفظها وتواصل معها مباشرة.
                </p>
              </div>

              <button
                onClick={() => setActiveView('explore')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                {currentLang === 'ar' ? 'العودة للدليل' : 'Back to Directory'}
              </button>
            </div>

            {favoriteBusinesses.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
                <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-900 text-base">لا توجد شركات محفوظة حتى الآن</h3>
                <p className="text-xs text-slate-500">
                  اضغط على أيقونة القلب على أي شركة لحفظها هنا والرجوع إليها لاحقاً.
                </p>
                <button
                  onClick={() => setActiveView('explore')}
                  className="bg-blue-600 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
                >
                  استكشف الشركات الآن
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteBusinesses.map((biz) => (
                  <BusinessCard
                    key={biz.id}
                    business={biz}
                    currentLang={currentLang}
                    onSelect={(b) => setDetailBusiness(b)}
                    onRequestQuote={(b) => {
                      setQuoteTargetBusiness(b);
                      setIsQuoteModalOpen(true);
                    }}
                    isFavorite={true}
                    onToggleFavorite={toggleFavorite}
                    onTrackCall={trackCall}
                    onTrackWhatsapp={trackWhatsapp}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: BUSINESS OWNER DASHBOARD */}
        {activeView === 'dashboard' && (
          <OwnerDashboard
            business={currentOwnerBusiness}
            currentLang={currentLang}
            onUpdateBusiness={(updated) => {
              setBusinesses((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
            }}
            enquiries={enquiries}
            onUpdateEnquiryStatus={(id, status, quotedAmount) => {
              setEnquiries((prev) =>
                prev.map((e) => (e.id === id ? { ...e, status, quotedAmountSar: quotedAmount } : e))
              );
            }}
            onAddOwnerReply={(bizId, revId, text) => {
              setBusinesses((prev) =>
                prev.map((b) => {
                  if (b.id !== bizId) return b;
                  return {
                    ...b,
                    reviews: b.reviews.map((r) =>
                      r.id === revId
                        ? {
                            ...r,
                            ownerReply: {
                              date: currentLang === 'ar' ? 'الآن' : 'Just now',
                              text,
                            },
                          }
                        : r
                    ),
                  };
                })
              );
            }}
            onUploadMedia={(bizId, item) => {
              const newMedia: MediaItem = {
                ...item,
                id: 'media-' + Date.now(),
              };
              setBusinesses((prev) =>
                prev.map((b) =>
                  b.id === bizId ? { ...b, media: [newMedia, ...b.media] } : b
                )
              );
            }}
            onDeleteMedia={(bizId, mediaId) => {
              setBusinesses((prev) =>
                prev.map((b) =>
                  b.id === bizId ? { ...b, media: b.media.filter((m) => m.id !== mediaId) } : b
                )
              );
            }}
          />
        )}

        {/* VIEW 4: ADMIN PANEL */}
        {activeView === 'admin' && (
          <AdminPanel
            currentLang={currentLang}
            businesses={businesses}
            onToggleVerifyBusiness={(businessId) => {
              setBusinesses((prev) =>
                prev.map((b) => (b.id === businessId ? { ...b, isVerified: !b.isVerified } : b))
              );
            }}
            onDeleteBusiness={(businessId) => {
              setBusinesses((prev) => prev.filter((b) => b.id !== businessId));
            }}
            reports={reports}
            onResolveReport={(reportId, action) => {
              setReports((prev) =>
                prev.map((r) => (r.id === reportId ? { ...r, status: action } : r))
              );
            }}
            users={users}
          />
        )}
      </main>

      {/* MODALS */}
      {/* 1. Business Detail Profile Modal */}
      {detailBusiness && (
        <BusinessDetailModal
          business={detailBusiness}
          currentLang={currentLang}
          onClose={() => setDetailBusiness(null)}
          onRequestQuote={(b) => {
            setQuoteTargetBusiness(b);
            setIsQuoteModalOpen(true);
          }}
          isFavorite={favorites.includes(detailBusiness.id)}
          onToggleFavorite={toggleFavorite}
          onOpenReport={(b) => setReportingBusiness(b)}
          onAddReview={handleAddReview}
          onOpenMediaLightbox={(m) => setLightboxMedia(m)}
          onTrackCall={trackCall}
          onTrackWhatsapp={trackWhatsapp}
        />
      )}

      {/* 2. Cost Calculator Modal */}
      {isCalculatorOpen && (
        <CostCalculatorModal
          currentLang={currentLang}
          onClose={() => setIsCalculatorOpen(false)}
          onRequestQuoteWithDetails={(details) => {
            setCalculatorQuoteData(details);
            setQuoteTargetBusiness(null);
            setIsQuoteModalOpen(true);
          }}
        />
      )}

      {/* 3. Interactive Map Modal */}
      {isMapOpen && (
        <InteractiveMapModal
          currentLang={currentLang}
          onClose={() => setIsMapOpen(false)}
          businesses={businesses}
          onSelectBusiness={(b) => setDetailBusiness(b)}
          onRequestQuote={(b) => {
            setQuoteTargetBusiness(b);
            setIsQuoteModalOpen(true);
          }}
        />
      )}

      {/* 4. Quote Request Modal */}
      {isQuoteModalOpen && (
        <QuoteRequestModal
          currentLang={currentLang}
          onClose={() => {
            setIsQuoteModalOpen(false);
            setQuoteTargetBusiness(null);
            setCalculatorQuoteData(null);
          }}
          targetBusiness={quoteTargetBusiness}
          allBusinesses={businesses}
          initialEstimate={calculatorQuoteData}
          onSubmitQuote={handleSubmitQuote}
        />
      )}

      {/* 5. Media Lightbox Modal */}
      <MediaGalleryModal
        media={lightboxMedia}
        onClose={() => setLightboxMedia(null)}
        currentLang={currentLang}
      />

      {/* 6. Auth Modal */}
      {isAuthOpen && (
        <AuthModal
          currentLang={currentLang}
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setIsAuthOpen(false);
          }}
          onRegisterBusinessSuccess={(user, newBizName) => {
            const newBizId = 'biz-' + Date.now();
            const newProfile: BusinessProfile = {
              id: newBizId,
              ownerEmail: user.email,
              name: { ar: newBizName, en: newBizName, ur: newBizName },
              tagline: {
                ar: 'خدمات نقل عفش وأثاث متميزة بالرياض والمملكة',
                en: 'Professional Home Moving & Relocation in Saudi Arabia',
                ur: 'سعودی عرب میں پیشہ ورانہ ہوم موونگ سروسز',
              },
              description: {
                ar: 'مؤسسة متخصصة في نقل الأثاث وفك وتركيب المطابخ وغرف النوم مع التغليف والضمان.',
                en: 'Specialized in furniture shifting and modular kitchen assembly with warranty.',
                ur: 'فرنیچر کھولنے اور لگانے کے ماہرین۔',
              },
              logo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=250&auto=format&fit=crop&q=80',
              coverImage:
                'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&auto=format&fit=crop&q=80',
              phone: '+966500000000',
              whatsapp: '966500000000',
              city: 'الرياض',
              address: 'الرياض، المملكة العربية السعودية',
              isServiceAreaOnly: true,
              serviceAreas: ['الرياض كاملة'],
              coordinates: { lat: 24.7136, lng: 46.6753 },
              openingHours: 'خدمة 24 ساعة',
              categories: ['home_shifting', 'furniture_moving', 'packing_unpacking'],
              services: [],
              media: [],
              rating: 5.0,
              reviewsCount: 0,
              reviews: [],
              isVerified: false,
              crNumber: '1010XXXXXX',
              establishedYear: 2026,
              truckFleetSize: 4,
              workersCount: 10,
              stats: {
                viewsThisMonth: 1,
                searchesAppeared: 1,
                whatsappClicks: 0,
                callClicks: 0,
                enquiriesReceived: 0,
              },
            };

            setBusinesses((prev) => [newProfile, ...prev]);
            const updatedUser = { ...user, role: 'owner' as const, ownedBusinessId: newBizId };
            setCurrentUser(updatedUser);
            setActiveView('dashboard');
            setIsAuthOpen(false);
          }}
        />
      )}

      {/* 7. Report Modal */}
      {reportingBusiness && (
        <ReportModal
          business={reportingBusiness}
          currentLang={currentLang}
          onClose={() => setReportingBusiness(null)}
          onSubmitReport={(rep) => {
            const newReport: ReportItem = {
              ...rep,
              id: 'rep-' + Date.now(),
              createdAt: new Date().toISOString().split('T')[0],
            };
            setReports((prev) => [newReport, ...prev]);
          }}
        />
      )}

      {/* 8. Install App Modal */}
      {isInstallModalOpen && (
        <InstallAppModal
          currentLang={currentLang}
          onClose={() => setIsInstallModalOpen(false)}
        />
      )}

      {/* 9. Google Play Store Modal */}
      {isPlayStoreModalOpen && (
        <GooglePlayModal
          currentLang={currentLang}
          onClose={() => setIsPlayStoreModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-16 md:pb-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Branding & Description */}
          <div className="space-y-3">
            <div className="text-white">
              <Logo size="md" lang={currentLang} showTagline={false} />
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {t.appTagline}
            </p>
            <div className="pt-2 flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.allVerifiedNotice}</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-2">
            <div className="font-bold text-white text-sm">خدمات نقل العفش</div>
            <ul className="space-y-1.5 text-slate-400">
              <li>نقل عفش منازل وفلل بالرياض وجدة</li>
              <li>فك وتركيب غرف النوم الإيطالية والوطنية</li>
              <li>تغليف كراتين ورول فقاعات وتغليف مائي</li>
              <li>تأجير دينا نقل عفش مقفلة مع سائق وعمال</li>
              <li>نقل مكاتب وشركات وترقيم المحتويات</li>
            </ul>
          </div>

          {/* Col 3: Coverage Cities */}
          <div className="space-y-2">
            <div className="font-bold text-white text-sm">تغطية مدن المملكة</div>
            <ul className="space-y-1.5 text-slate-400">
              <li>نقل عفش الرياض (الملقا، النرجس، الصحافة)</li>
              <li>نقل عفش جدة (الروضة، الشاطئ، أبحر)</li>
              <li>نقل عفش الدمام والخبر والجبيل</li>
              <li>نقل عفش مكة المكرمة والمدينة المنورة</li>
              <li>شحن ونقل عفش بين جميع مدن المملكة</li>
            </ul>
          </div>

          {/* Col 4: Business Owners & Admin */}
          <div className="space-y-3">
            <div className="font-bold text-white text-sm">أصحاب منشآت النقل</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              سجل شركتك أو مؤسستك الآن مجاناً، وأدر ملفك وتلقى طلبات عروض الأسعار والاتصالات المباشرة مثل Google Business Profile.
            </p>
            <button
              onClick={() => {
                if (currentUser?.role === 'owner') {
                  setActiveView('dashboard');
                } else {
                  setIsAuthOpen(true);
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Building className="w-4 h-4" />
              <span>{t.registerBusiness}</span>
            </button>

            {/* Google Play Download button */}
            <button
              onClick={() => setIsPlayStoreModalOpen(true)}
              className="mt-2 w-full bg-slate-900 hover:bg-black text-white p-2.5 rounded-xl border border-slate-700 flex items-center gap-2.5 transition-colors cursor-pointer text-start"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M3.6 2.3A1.8 1.8 0 0 0 3 3.6v16.8a1.8 1.8 0 0 0 .6 1.3l.1.1 9.4-9.4v-.2L3.7 2.2z" />
                <path fill="#34A853" d="M17.3 16.5l-4.2-4.2v-.2l4.2-4.2.1.1 5 2.8c1.4.8 1.4 2.1 0 2.9l-5.1 2.8z" />
                <path fill="#EA4335" d="M13.1 12.1L3.7 21.6c.5.5 1.3.5 2.1.1l11.5-6.5-4.2-3.1z" />
                <path fill="#FBBC05" d="M13.1 11.9l4.2-3.1L5.8 2.3c-.8-.4-1.6-.4-2.1.1l9.4 9.5z" />
              </svg>
              <div>
                <div className="text-[9px] text-slate-400 uppercase font-bold">تطبيق أندرويد معتمد</div>
                <div className="text-xs font-black text-white">Google Play Store</div>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} MoveConnect Saudi 🇸🇦 - جميع الحقوق محفوظة لمنصة نقل العفش الأولى بالمملكة.
          </div>
          <div className="flex items-center gap-4">
            <span>الامتثال للأنظمة التجارية السعودية</span>
            <span>•</span>
            <span>حماية المستهلك</span>
            <span>•</span>
            <span>اتفاقية الاستخدام والخصوصية</span>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 py-1.5 px-3 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveView('explore')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer ${
            activeView === 'explore' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Truck className="w-5 h-5" />
          <span>{currentLang === 'ar' ? 'الرئيسية' : 'Explore'}</span>
        </button>

        <button
          onClick={() => setIsMapOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-slate-500 hover:text-emerald-600 cursor-pointer"
        >
          <MapPin className="w-5 h-5 text-emerald-600" />
          <span>{currentLang === 'ar' ? 'الخريطة' : 'Map'}</span>
        </button>

        <button
          onClick={() => setIsCalculatorOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-slate-500 hover:text-blue-600 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center -mt-3 shadow-md">
            <Calculator className="w-4 h-4" />
          </div>
          <span>{currentLang === 'ar' ? 'الحاسبة' : 'Calculator'}</span>
        </button>

        <button
          onClick={() => setActiveView('favorites')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold relative cursor-pointer ${
            activeView === 'favorites' ? 'text-rose-600' : 'text-slate-500'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span>{currentLang === 'ar' ? 'المفضلة' : 'Favorites'}</span>
          {favorites.length > 0 && (
            <span className="absolute -top-1 -end-1 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {favorites.length}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            if (currentUser?.role === 'owner') {
              setActiveView('dashboard');
            } else if (currentUser?.role === 'admin') {
              setActiveView('admin');
            } else {
              setIsAuthOpen(true);
            }
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer ${
            activeView === 'dashboard' || activeView === 'admin'
              ? 'text-emerald-600'
              : 'text-slate-500'
          }`}
        >
          <Building className="w-5 h-5" />
          <span>{currentUser ? (currentUser.role === 'owner' ? t.dashboard : 'حسابي') : t.login}</span>
        </button>
      </nav>
    </div>
  );
}
