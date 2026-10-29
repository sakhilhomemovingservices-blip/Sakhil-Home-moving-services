export type Language = 'ar' | 'en' | 'ur' | 'hi' | 'bn' | 'tl' | 'ml' | 'fr';

export type ServiceCategory =
  | 'home_shifting'
  | 'office_relocation'
  | 'furniture_moving'
  | 'packing_unpacking'
  | 'loading_unloading'
  | 'local_moving'
  | 'international_moving'
  | 'truck_rental';

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title: string;
  category?: 'trucks' | 'packing' | 'furniture' | 'team' | 'before_after';
  isBeforeAfter?: boolean;
  beforeUrl?: string;
  afterUrl?: string;
}

export interface ServiceOffering {
  id: string;
  category: ServiceCategory;
  name: string;
  description: string;
  basePrice?: number; // In SAR
  priceUnit?: string;
}

export interface VideoTestimonial {
  id: string;
  customerName: string;
  customerCity: string;
  moveType: string;
  rating: number;
  videoUrl: string;
  thumbnailUrl: string;
  duration?: string;
  quoteExcerpt: string;
  date: string;
  verifiedBooking: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  experienceYears: number;
  rating?: number;
  nationality?: string;
  isVerifiedIqama: boolean; // تصريح عمل وإقامة نظامية موثقة
  specialties?: string[];
  phone?: string;
}

export interface WalletTransaction {
  id: string;
  eventType: 'user_login' | 'quote_lead' | 'booking_confirmed' | 'app_install' | 'withdrawal';
  amountUsd: number;
  amountSar: number;
  title: string;
  customerName?: string;
  date: string;
  status: 'completed' | 'processing';
}

export interface PartnerWallet {
  balanceUsd: number;
  balanceSar: number;
  totalEarnedUsd: number;
  totalWithdrawnUsd: number;
  transactions: WalletTransaction[];
}

export interface Review {
  id: string;
  businessId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  serviceUsed: string;
  ownerReply?: {
    date: string;
    text: string;
  };
}

export interface BusinessProfile {
  id: string;
  ownerEmail: string;
  name: {
    ar: string;
    en: string;
    ur: string;
    hi?: string;
  };
  tagline: {
    ar: string;
    en: string;
    ur: string;
    hi?: string;
  };
  description: {
    ar: string;
    en: string;
    ur: string;
    hi?: string;
  };
  logo: string;
  coverImage: string;
  phone: string;
  whatsapp: string;
  website?: string;
  socials?: {
    twitter?: string;
    instagram?: string;
    tiktok?: string;
  };
  city: string;
  address: string;
  isServiceAreaOnly: boolean; // No physical office walk-ins, serves regions
  serviceAreas: string[]; // e.g. ["Riyadh", "Al Kharj", "Al Diriyah"]
  coordinates: {
    lat: number;
    lng: number;
  };
  openingHours: string;
  categories: ServiceCategory[];
  services: ServiceOffering[];
  media: MediaItem[];
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  videoTestimonials?: VideoTestimonial[];
  teamMembers?: TeamMember[];
  isVerified: boolean; // Commercial Registration / Maroof verified
  crNumber?: string; // Saudi Commercial Registration Number (سجل تجاري)
  establishedYear: number;
  truckFleetSize: number;
  workersCount: number;
  stats: {
    viewsThisMonth: number;
    searchesAppeared: number;
    whatsappClicks: number;
    callClicks: number;
    enquiriesReceived: number;
  };
}

export interface QuoteEnquiry {
  id: string;
  businessId: string;
  businessName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickupCity: string;
  pickupDistrict: string;
  destinationCity: string;
  destinationDistrict: string;
  moveDate: string;
  propertyType: 'studio' | 'apartment_small' | 'apartment_large' | 'villa' | 'office' | 'warehouse';
  servicesNeeded: ServiceCategory[];
  floorPickup: number;
  elevatorPickup: boolean;
  floorDrop: number;
  elevatorDrop: boolean;
  notes?: string;
  status: 'pending' | 'quoted' | 'accepted' | 'declined';
  estimatedCostSar?: number;
  quotedAmountSar?: number;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'owner' | 'admin';
  phone?: string;
  avatar?: string;
  ownedBusinessId?: string;
  favorites: string[]; // Business IDs
}

export interface ReportItem {
  id: string;
  businessId: string;
  businessName: string;
  reporterEmail: string;
  reason: 'fake_profile' | 'misleading_pricing' | 'inappropriate_media' | 'no_license' | 'poor_conduct';
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}
