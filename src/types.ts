export type Language = 'en' | 'fil' | 'ceb' | 'hil' | 'kry' | 'ilo';

export interface PricingTier {
  id: string;
  minQty: number;
  maxQty: number | null; // null represents "and above"
  pricePerPiece: number; // in PHP
  label: string;
}

export interface FingerlingProduct {
  id: string;
  name: string;
  scientificName: string; // "Clarias batrachus"
  sizeCategory: string; // e.g. "Starter Fingerlings", "Standard Grow-out", "Advance Stocker", "Jumbo Stocker"
  sizeInches: string; // e.g. "1.5 - 2.0 inches"
  sizeCm: string; // e.g. "3.8 - 5.1 cm"
  stockCount: number; // Current inventory count
  lowStockThreshold: number;
  description: string;
  nurseryDays: string;
  growthRate: string;
  survivalRate: string;
  recommendedStockingDensity: string;
  images: string[];
  pricingTiers: PricingTier[];
  isActive: boolean;
  fishType: string; // default "Hito (Clarias batrachus)"
}

export type InquiryStatus = 'pending' | 'in_review' | 'contacted' | 'fulfilled' | 'cancelled' | 'new' | 'scheduled' | 'completed';

export interface CustomerInquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location?: string;
  province?: string;
  farmLocation?: string;
  productId: string;
  productName: string;
  sizePreference: string;
  quantity: number;
  estimatedPricePerPiece?: number;
  estimatedTotalPhp: number;
  preferredDate?: string;
  targetDeliveryDate?: string;
  farmingSetup?: string;
  fulfillmentType?: 'pickup' | 'delivery';
  notes: string;
  status: InquiryStatus;
  contacted?: boolean;
  contactedBy?: string;
  contactedAt?: string;
  createdAt: string;
}

export type OrderInquiry = CustomerInquiry;

export type ArticleStatus = 'active' | 'inactive' | 'archived';

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  images: string[];
  youtubeUrl?: string;
  publishedAt: string; // ISO date string
  publishedYear: number;
  status: ArticleStatus;
  readingTimeMinutes: number;
  featured: boolean;
}

export interface HeroImage {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  badge: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
}

export type HeroSlide = HeroImage;

export interface AboutUsSlide {
  id: string;
  url: string;
  caption: string;
}

export type AboutSlide = AboutUsSlide;

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export type WhyChooseItem = WhyChooseUsItem;

export interface AdminPermissions {
  canManageInventory: boolean;
  canManageCatalog: boolean;
  canManageInquiries: boolean;
  canManageBlogs: boolean;
  canManageHomepage: boolean;
  canManageLocationHours: boolean;
  canManageSystemSettings: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  role: 'super_admin' | 'moderator' | 'manager' | 'Super Admin' | 'Moderator' | 'Manager';
  password?: string;
  permissions?: AdminPermissions;
  createdAt: string;
  lastLoginAt?: string;
  lastLogin?: string;
}

export interface OperatingHours {
  monFri: string;
  sat: string;
  sun: string;
  notes: string;
}

export interface SystemSettings {
  companyName: string;
  logoUrl: string;
  supportEmail: string;
  supportPhone: string;
  farmAddress: string;
  farmCoordinates: {
    lat: number;
    lng: number;
  };
  operatingHours: OperatingHours;
  smtpConfig: {
    host: string;
    port: number;
    user: string;
    pass: string;
    fromEmail: string;
    secure: boolean;
    isConfigured: boolean;
  };
  zitadelOidc: {
    issuer: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scopes: string;
    enabled: boolean;
  };
  cloudflareD1Config: {
    databaseId: string;
    databaseName: string;
    accountId: string;
    isConnected: boolean;
    lastSyncedAt: string;
    mode: 'cloudflare-d1' | 'local-fallback';
    tablesCount: number;
  };
  firebaseConfig?: {
    projectId?: string;
    apiKey?: string;
    authDomain?: string;
    isConnected?: boolean;
    lastSyncedAt?: string;
  };
}

export interface MonthlySalesReport {
  month: string;
  year: number;
  fingerlingsSold: number;
  inquiryCount: number;
  estimatedRevenuePhp: number;
  topProduct: string;
}

export interface VisitorLocation {
  region: string;
  country: string;
  count: number;
  percentage: number;
}
