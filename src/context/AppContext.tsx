import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  FingerlingProduct,
  BlogArticle,
  HeroImage,
  AboutUsSlide,
  WhyChooseUsItem,
  SystemSettings,
  CustomerInquiry,
  MonthlySalesReport,
  VisitorLocation,
  AdminUser,
  PricingTier,
  InquiryStatus,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_BLOGS,
  INITIAL_HERO_IMAGES,
  INITIAL_ABOUT_SLIDES,
  INITIAL_WHY_CHOOSE_US,
  INITIAL_SETTINGS,
  INITIAL_INQUIRIES,
  INITIAL_MONTHLY_SALES,
  INITIAL_VISITOR_LOCATIONS,
  INITIAL_ADMIN_USERS,
} from '../data/initialData';
import { TRANSLATIONS } from '../utils/translations';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  toggleDarkMode: () => void;
  cursorEnabled: boolean;
  toggleCursor: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  visitorCount: number;

  // Products
  products: FingerlingProduct[];
  updateProduct: (product: FingerlingProduct) => void;
  addProduct: (product: FingerlingProduct) => void;
  deleteProduct: (id: string) => void;
  updateInventoryStock: (productId: string, newCount: number, pricePerPiece?: number) => void;
  addNewFingerlingSize: (productId: string, sizeName: string, sizeInches: string, initialPrice: number) => void;

  // Blogs
  blogs: BlogArticle[];
  addBlog: (blog: BlogArticle) => void;
  updateBlog: (blog: BlogArticle) => void;
  deleteBlog: (id: string) => void;

  // Hero & About
  heroImages: HeroImage[];
  setHeroImages: (images: HeroImage[]) => void;
  addHeroImage: (image: HeroImage) => void;
  updateHeroImage: (image: HeroImage) => void;
  deleteHeroImage: (id: string) => void;

  aboutSlides: AboutUsSlide[];
  addAboutSlide: (slide: AboutUsSlide) => void;
  updateAboutSlide: (slide: AboutUsSlide) => void;
  deleteAboutSlide: (id: string) => void;

  whyChooseUs: WhyChooseUsItem[];
  updateWhyChooseUs: (items: WhyChooseUsItem[]) => void;

  // Inquiries
  inquiries: CustomerInquiry[];
  submitInquiry: (inquiry: Omit<CustomerInquiry, 'id' | 'createdAt' | 'status' | 'contacted'>) => Promise<CustomerInquiry>;
  updateInquiryStatus: (id: string, status: InquiryStatus, contacted: boolean, contactedBy?: string) => void;
  deleteInquiry: (id: string) => void;
  exportInquiriesCSV: () => void;

  // Settings
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;

  // Reports & Analytics
  monthlySales: MonthlySalesReport[];
  visitorLocations: VisitorLocation[];

  // Admin Auth & Users
  currentUser: AdminUser | null;
  adminUsers: AdminUser[];
  loginAdmin: (userOrEmail: string, pass: string) => boolean;
  logoutAdmin: () => void;
  updateAdminProfile: (email: string, newPassword?: string, fullName?: string) => boolean;
  resetAdminPasswordByEmail: (email: string, newPass: string) => boolean;
  addManagerAccount: (manager: Omit<AdminUser, 'id' | 'createdAt'>) => void;
  updateManagerAccount: (manager: AdminUser) => void;
  deleteManagerAccount: (id: string) => void;

  // Low stock alerts
  lowStockItems: FingerlingProduct[];
  hasLowStockAlert: boolean;

  // Global image update helper
  updateGlobalImage: (target: 'logo' | 'hero' | 'about' | 'product' | 'blog', id: string, newUrl: string) => void;

  // Cloudflare D1 Database Engine
  d1Status: any;
  refreshD1Status: () => Promise<void>;
  migrateD1Schema: () => Promise<{ success: boolean; message?: string; error?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem('mf_theme');
    if (saved) return saved === 'dark';
    return false; // Default sophisticated light theme
  });

  // Language state
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('mf_lang') as Language;
    return saved || 'en';
  });

  // Custom interactive cursor toggle
  const [cursorEnabled, setCursorEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('mf_cursor');
    return saved !== null ? saved === 'true' : true;
  });

  // Global search bar
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Live visitor simulation counter
  const [visitorCount, setVisitorCount] = useState<number>(() => {
    const saved = localStorage.getItem('mf_visitors');
    return saved ? parseInt(saved, 10) : 12480;
  });

  // Cloudflare D1 Database Connection State
  const [d1Status, setD1Status] = useState<any>(() => ({
    engine: 'Cloudflare D1',
    configured: false,
    connected: true,
    mode: 'cloudflare-d1',
    databaseId: 'mesina-farms-hito-d1',
    databaseName: 'mesina_farms_db',
    tables: {
      products: 6,
      inquiries: 3,
      blogs: 3,
      settings: 1,
      hero_images: 4,
      about_slides: 3,
      admin_users: 2,
    },
    message: 'Active Cloudflare D1 serverless edge database engine.',
    lastChecked: new Date().toISOString(),
  }));

  const refreshD1Status = async () => {
    try {
      const res = await fetch('/api/d1/status');
      if (res.ok) {
        const data = await res.json();
        setD1Status(data);
      }
    } catch (err) {
      console.warn('[D1 Status] Check error:', err);
    }
  };

  const migrateD1Schema = async () => {
    try {
      const res = await fetch('/api/d1/migrate', { method: 'POST' });
      const data = await res.json();
      await refreshD1Status();
      return data;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to migrate schema' };
    }
  };

  // Persistent data states
  const [products, setProducts] = useState<FingerlingProduct[]>(() => {
    const saved = localStorage.getItem('mf_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [blogs, setBlogs] = useState<BlogArticle[]>(() => {
    const saved = localStorage.getItem('mf_blogs');
    return saved ? JSON.parse(saved) : INITIAL_BLOGS;
  });

  const [heroImages, setHeroImages] = useState<HeroImage[]>(() => {
    const saved = localStorage.getItem('mf_heroes');
    return saved ? JSON.parse(saved) : INITIAL_HERO_IMAGES;
  });

  const [aboutSlides, setAboutSlides] = useState<AboutUsSlide[]>(() => {
    const saved = localStorage.getItem('mf_about_slides');
    return saved ? JSON.parse(saved) : INITIAL_ABOUT_SLIDES;
  });

  const [whyChooseUs, setWhyChooseUs] = useState<WhyChooseUsItem[]>(() => {
    const saved = localStorage.getItem('mf_why_choose');
    return saved ? JSON.parse(saved) : INITIAL_WHY_CHOOSE_US;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('mf_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.logoUrl === '/logo.svg' || !parsed.logoUrl) {
          parsed.logoUrl = '/round_transparent.png';
        }
        if (!parsed.farmAddress || parsed.farmAddress.includes('San Simon') || parsed.farmAddress.includes('Pampanga 2015')) {
          parsed.farmAddress = 'Brgy. Saba, Hermosa, Bataan, Philippines';
          parsed.farmCoordinates = {
            lat: 14.8587,
            lng: 120.5112,
          };
        }
        return parsed;
      } catch {
        return INITIAL_SETTINGS;
      }
    }
    return INITIAL_SETTINGS;
  });

  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => {
    const saved = localStorage.getItem('mf_inquiries');
    return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
  });

  const [monthlySales] = useState<MonthlySalesReport[]>(INITIAL_MONTHLY_SALES);
  const [visitorLocations] = useState<VisitorLocation[]>(INITIAL_VISITOR_LOCATIONS);

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('mf_admin_users');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_USERS;
  });

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('mf_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Keep dark mode class on <html> or <body>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mf_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mf_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkModeState((prev) => !prev);
  const setDarkMode = (val: boolean) => setDarkModeState(val);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mf_lang', lang);
  };

  const toggleCursor = () => {
    setCursorEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('mf_cursor', String(next));
      return next;
    });
  };

  // Translation helper with fallback
  const t = (key: string): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  };

  // Synchronize with Cloudflare D1 backend on mount
  useEffect(() => {
    refreshD1Status();
    fetch('/api/data')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          if (Array.isArray(data.products) && data.products.length > 0) {
            setProducts(data.products);
          }
          if (Array.isArray(data.inquiries)) {
            setInquiries(data.inquiries);
          }
          if (data.settings) {
            setSettings((prev) => ({ ...prev, ...data.settings }));
          }
          if (Array.isArray(data.blogs) && data.blogs.length > 0) {
            setBlogs(data.blogs);
          }
        }
      })
      .catch((e) => console.warn('[D1] Initial load note:', e));
  }, []);

  // Update localStorage & sync to Cloudflare D1 when products change
  useEffect(() => {
    localStorage.setItem('mf_products', JSON.stringify(products));
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products }),
    }).catch(() => {});
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mf_blogs', JSON.stringify(blogs));
  }, [blogs]);

  useEffect(() => {
    localStorage.setItem('mf_heroes', JSON.stringify(heroImages));
  }, [heroImages]);

  useEffect(() => {
    localStorage.setItem('mf_about_slides', JSON.stringify(aboutSlides));
  }, [aboutSlides]);

  useEffect(() => {
    localStorage.setItem('mf_why_choose', JSON.stringify(whyChooseUs));
  }, [whyChooseUs]);

  useEffect(() => {
    localStorage.setItem('mf_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('mf_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('mf_admin_users', JSON.stringify(adminUsers));
  }, [adminUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mf_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mf_current_user');
    }
  }, [currentUser]);

  // Visitor increment timer simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount((prev) => {
        const next = prev + Math.floor(Math.random() * 3) + 1;
        localStorage.setItem('mf_visitors', String(next));
        return next;
      });
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  // Low stock calculations
  const lowStockItems = products.filter((p) => p.isActive && p.stockCount <= p.lowStockThreshold);
  const hasLowStockAlert = lowStockItems.length > 0;

  // Product Actions
  const updateProduct = (product: FingerlingProduct) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
  };

  const addProduct = (product: FingerlingProduct) => {
    setProducts((prev) => [product, ...prev]);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateInventoryStock = (productId: string, newCount: number, pricePerPiece?: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updatedTiers = [...p.pricingTiers];
        if (pricePerPiece !== undefined && updatedTiers.length > 0) {
          updatedTiers[0].pricePerPiece = pricePerPiece;
        }
        return {
          ...p,
          stockCount: newCount,
          pricingTiers: updatedTiers,
        };
      })
    );
  };

  const addNewFingerlingSize = (productId: string, sizeName: string, sizeInches: string, initialPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const newTier: PricingTier = {
          id: `tier-${Date.now()}`,
          minQty: 500,
          maxQty: 1999,
          pricePerPiece: initialPrice,
          label: `${sizeName} (${sizeInches})`,
        };
        return {
          ...p,
          sizeCategory: sizeName,
          sizeInches: sizeInches,
          pricingTiers: [newTier, ...p.pricingTiers],
        };
      })
    );
  };

  // Blog Actions
  const addBlog = (blog: BlogArticle) => {
    setBlogs((prev) => [blog, ...prev]);
  };

  const updateBlog = (blog: BlogArticle) => {
    setBlogs((prev) => prev.map((b) => (b.id === blog.id ? blog : b)));
  };

  const deleteBlog = (id: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  };

  // Hero & About Actions
  const addHeroImage = (image: HeroImage) => {
    setHeroImages((prev) => [...prev, image]);
  };

  const updateHeroImage = (image: HeroImage) => {
    setHeroImages((prev) => prev.map((h) => (h.id === image.id ? image : h)));
  };

  const deleteHeroImage = (id: string) => {
    setHeroImages((prev) => prev.filter((h) => h.id !== id));
  };

  const addAboutSlide = (slide: AboutUsSlide) => {
    setAboutSlides((prev) => [...prev, slide]);
  };

  const updateAboutSlide = (slide: AboutUsSlide) => {
    setAboutSlides((prev) => prev.map((s) => (s.id === slide.id ? slide : s)));
  };

  const deleteAboutSlide = (id: string) => {
    setAboutSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const updateWhyChooseUs = (items: WhyChooseUsItem[]) => {
    setWhyChooseUs(items);
  };

  // Inquiry Actions
  const submitInquiry = async (
    inquiryData: Omit<CustomerInquiry, 'id' | 'createdAt' | 'status' | 'contacted'>
  ): Promise<CustomerInquiry> => {
    const newInquiry: CustomerInquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      status: 'pending',
      contacted: false,
      createdAt: new Date().toISOString(),
    };

    setInquiries((prev) => [newInquiry, ...prev]);

    // Persist to Cloudflare D1
    fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInquiry),
    }).catch(() => {});

    return newInquiry;
  };

  const updateInquiryStatus = (
    id: string,
    status: InquiryStatus,
    contacted: boolean,
    contactedBy?: string
  ) => {
    setInquiries((prev) =>
      prev.map((inq) => {
        if (inq.id !== id) return inq;
        const updated = {
          ...inq,
          status,
          contacted,
          contactedBy: contactedBy || inq.contactedBy || (currentUser ? currentUser.fullName : 'Admin'),
          contactedAt: contacted ? new Date().toISOString() : inq.contactedAt,
        };

        // Persist to Cloudflare D1
        fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        }).catch(() => {});

        return updated;
      })
    );
  };

  const deleteInquiry = (id: string) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    fetch(`/api/inquiries/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const exportInquiriesCSV = () => {
    const headers = [
      'Inquiry ID',
      'Date Created',
      'Customer Name',
      'Email',
      'Phone',
      'Location',
      'Product',
      'Size',
      'Quantity (pcs)',
      'Est. Price/pc',
      'Est. Total (PHP)',
      'Target Date',
      'Fulfillment',
      'Status',
      'Contacted',
      'Contacted By',
      'Contacted Date',
      'Notes',
    ];

    const rows = inquiries.map((i) => [
      `"${i.id}"`,
      `"${new Date(i.createdAt).toLocaleString()}"`,
      `"${i.fullName.replace(/"/g, '""')}"`,
      `"${i.email}"`,
      `"${i.phone}"`,
      `"${i.location.replace(/"/g, '""')}"`,
      `"${i.productName}"`,
      `"${i.sizePreference}"`,
      i.quantity,
      i.estimatedPricePerPiece,
      i.estimatedTotalPhp,
      `"${i.preferredDate}"`,
      `"${i.fulfillmentType}"`,
      `"${i.status}"`,
      `"${i.contacted ? 'Yes' : 'No'}"`,
      `"${i.contactedBy || ''}"`,
      `"${i.contactedAt ? new Date(i.contactedAt).toLocaleString() : ''}"`,
      `"${(i.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Mesina_Farms_Inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Settings Actions
  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => {
      const updated: SystemSettings = {
        ...prev,
        ...newSettings,
        operatingHours: {
          ...prev.operatingHours,
          ...(newSettings.operatingHours || {}),
        },
        smtpConfig: {
          ...prev.smtpConfig,
          ...(newSettings.smtpConfig || {}),
        },
        zitadelOidc: {
          ...prev.zitadelOidc,
          ...(newSettings.zitadelOidc || {}),
        },
        cloudflareD1Config: {
          ...prev.cloudflareD1Config,
          ...(newSettings.cloudflareD1Config || {}),
          lastSyncedAt: new Date().toISOString(),
        },
      };

      // Persist to backend / Cloudflare D1
      fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch(() => {});

      return updated;
    });
  };

  // Admin Auth Actions
  // Default accounts: jojomesina@icloud.com / abc123, and super / abc123!
  const loginAdmin = (userOrEmail: string, pass: string): boolean => {
    const trimmed = userOrEmail.trim().toLowerCase();
    
    // Check super admin: username "super", password "abc123!"
    if ((trimmed === 'super' || trimmed === 'super@mesinafarms.com') && pass === 'abc123!') {
      const superUser = adminUsers.find((u) => u.username === 'super') || INITIAL_ADMIN_USERS[0];
      setCurrentUser(superUser);
      return true;
    }

    // Check jojomesina@icloud.com / abc123
    const savedJojoPass = localStorage.getItem('mf_pass_jojo') || 'abc123';
    if (trimmed === 'jojomesina@icloud.com' && pass === savedJojoPass) {
      const jojoUser = adminUsers.find((u) => u.email === 'jojomesina@icloud.com') || INITIAL_ADMIN_USERS[1];
      setCurrentUser(jojoUser);
      return true;
    }

    // Check custom managers
    const match = adminUsers.find(
      (u) => u.email.toLowerCase() === trimmed || u.username.toLowerCase() === trimmed
    );
    if (match) {
      const storedPass = localStorage.getItem(`mf_pass_${match.id}`) || 'abc123';
      if (pass === storedPass) {
        setCurrentUser(match);
        return true;
      }
    }

    return false;
  };

  const logoutAdmin = () => {
    setCurrentUser(null);
  };

  const updateAdminProfile = (email: string, newPassword?: string, fullName?: string): boolean => {
    if (!currentUser) return false;
    
    if (newPassword) {
      if (currentUser.email === 'jojomesina@icloud.com') {
        localStorage.setItem('mf_pass_jojo', newPassword);
      } else {
        localStorage.setItem(`mf_pass_${currentUser.id}`, newPassword);
      }
    }

    const updatedUser: AdminUser = {
      ...currentUser,
      email: email || currentUser.email,
      fullName: fullName || currentUser.fullName,
    };

    setCurrentUser(updatedUser);
    setAdminUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    return true;
  };

  const resetAdminPasswordByEmail = (email: string, newPass: string): boolean => {
    const trimmed = email.trim().toLowerCase();
    if (trimmed === 'jojomesina@icloud.com') {
      localStorage.setItem('mf_pass_jojo', newPass);
      return true;
    }
    const found = adminUsers.find((u) => u.email.toLowerCase() === trimmed);
    if (found) {
      localStorage.setItem(`mf_pass_${found.id}`, newPass);
      return true;
    }
    return false;
  };

  const addManagerAccount = (manager: Omit<AdminUser, 'id' | 'createdAt'>) => {
    const newId = `mgr-${Date.now()}`;
    const newManager: AdminUser = {
      ...manager,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(`mf_pass_${newId}`, 'abc123'); // default password
    setAdminUsers((prev) => [...prev, newManager]);
  };

  const updateManagerAccount = (manager: AdminUser) => {
    setAdminUsers((prev) => prev.map((m) => (m.id === manager.id ? manager : m)));
    if (currentUser?.id === manager.id) {
      setCurrentUser(manager);
    }
  };

  const deleteManagerAccount = (id: string) => {
    setAdminUsers((prev) => prev.filter((m) => m.id !== id));
  };

  const updateGlobalImage = (target: 'logo' | 'hero' | 'about' | 'product' | 'blog', id: string, newUrl: string) => {
    if (target === 'logo') {
      updateSettings({ logoUrl: newUrl });
    } else if (target === 'hero') {
      setHeroImages((prev) => prev.map((h) => (h.id === id ? { ...h, url: newUrl } : h)));
    } else if (target === 'about') {
      setAboutSlides((prev) => prev.map((s) => (s.id === id ? { ...s, url: newUrl } : s)));
    } else if (target === 'product') {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, images: [newUrl, ...p.images.slice(1)] } : p))
      );
    } else if (target === 'blog') {
      setBlogs((prev) =>
        prev.map((b) => (b.id === id ? { ...b, images: [newUrl, ...b.images.slice(1)] } : b))
      );
    }
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        cursorEnabled,
        toggleCursor,
        searchQuery,
        setSearchQuery,
        visitorCount,

        products,
        updateProduct,
        addProduct,
        deleteProduct,
        updateInventoryStock,
        addNewFingerlingSize,

        blogs,
        addBlog,
        updateBlog,
        deleteBlog,

        heroImages,
        setHeroImages,
        addHeroImage,
        updateHeroImage,
        deleteHeroImage,

        aboutSlides,
        addAboutSlide,
        updateAboutSlide,
        deleteAboutSlide,

        whyChooseUs,
        updateWhyChooseUs,

        inquiries,
        submitInquiry,
        updateInquiryStatus,
        deleteInquiry,
        exportInquiriesCSV,

        settings,
        updateSettings,

        monthlySales,
        visitorLocations,

        currentUser,
        adminUsers,
        loginAdmin,
        logoutAdmin,
        updateAdminProfile,
        resetAdminPasswordByEmail,
        addManagerAccount,
        updateManagerAccount,
        deleteManagerAccount,

        lowStockItems,
        hasLowStockAlert,
        updateGlobalImage,

        // Cloudflare D1 Database
        d1Status,
        refreshD1Status,
        migrateD1Schema,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
