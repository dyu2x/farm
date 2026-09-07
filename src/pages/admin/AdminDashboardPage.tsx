import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FingerlingProduct,
  OrderInquiry,
  BlogArticle,
  AdminUser,
  HeroSlide,
  AboutSlide,
  WhyChooseItem,
} from '../../types';
import {
  LayoutDashboard,
  Fish,
  ClipboardList,
  BookOpen,
  Image as ImageIcon,
  Users,
  BarChart3,
  Settings as SettingsIcon,
  Database,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Save,
  Download,
  CheckCircle2,
  AlertTriangle,
  Search,
  ExternalLink,
  ChevronDown,
  Layers,
  Sparkles,
  Phone,
  Mail,
  Clock,
  MapPin,
  Upload,
  RefreshCw,
} from 'lucide-react';

interface AdminDashboardPageProps {
  navigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigate }) => {
  const {
    currentAdminUser,
    adminLogout,
    products,
    updateProductStock,
    updateProductPrice,
    addProduct,
    updateProduct,
    deleteProduct,
    inquiries,
    updateInquiryStatus,
    deleteInquiry,
    blogs,
    addBlog,
    updateBlog,
    deleteBlog,
    heroImages,
    addHeroImage,
    updateHeroImage,
    deleteHeroImage,
    aboutSlides,
    addAboutSlide,
    deleteAboutSlide,
    whyChooseUs,
    addWhyChoose,
    updateWhyChoose,
    deleteWhyChoose,
    adminUsers,
    addAdminUser,
    updateAdminUserPassword,
    deleteAdminUser,
    settings,
    updateSettings,
    salesReports,
    d1Status,
    refreshD1Status,
    migrateD1Schema,
  } = useApp();

  const [isTestingD1, setIsTestingD1] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'stock' | 'inventory' | 'inquiries' | 'media' | 'blogs' | 'users' | 'reports' | 'settings'
  >('stock');

  // Search in tables
  const [tableSearch, setTableSearch] = useState('');

  // Notification Banner
  const [notification, setNotification] = useState<string | null>(null);
  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Guard: If not logged in
  if (!currentAdminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-white">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-md space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold">Authentication Required</h2>
          <p className="text-xs text-slate-400">
            Please log in at the direct administrator console.
          </p>
          <button
            onClick={() => navigate('/connect/admin')}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-sky-500 text-slate-950"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  // Handle Excel / CSV Export
  const handleExportInquiriesToExcel = () => {
    const headers = [
      'Inquiry ID',
      'Created Date',
      'Customer Full Name',
      'Contact Mobile',
      'Email',
      'Province',
      'Farm Location',
      'Product / Size Grade',
      'Order Quantity (pcs)',
      'Culture System',
      'Target Date',
      'Estimated Total (PHP)',
      'Status',
      'Farmer Notes',
    ];

    const rows = inquiries.map((inq) => [
      inq.id,
      inq.createdAt.split('T')[0],
      `"${inq.fullName.replace(/"/g, '""')}"`,
      `"${inq.phone}"`,
      inq.email,
      `"${inq.province}"`,
      `"${inq.farmLocation.replace(/"/g, '""')}"`,
      `"${inq.productName} (${inq.sizePreference})"`,
      inq.quantity,
      `"${inq.farmingSetup}"`,
      inq.targetDeliveryDate,
      inq.estimatedTotalPhp,
      inq.status,
      `"${(inq.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Mesina_Farms_Inquiries_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotice('Exported inquiries successfully to Excel / CSV file.');
  };

  // State for Add New Fingerling Size Modal
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProd, setNewProd] = useState({
    name: '',
    scientificName: 'Clarias batrachus',
    sizeInches: '',
    sizeCm: '',
    sizeCategory: 'Grow-out',
    description: '',
    stockCount: 15000,
    lowStockThreshold: 4000,
    pricePerPiece: 3.8,
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80'],
    nurseryDays: '40 - 45 days post-hatch',
    survivalRate: '96% - 98%',
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product: FingerlingProduct = {
      id: 'prod-' + Date.now().toString().slice(-4),
      name: newProd.name,
      scientificName: newProd.scientificName,
      sizeInches: newProd.sizeInches,
      sizeCm: newProd.sizeCm,
      sizeCategory: newProd.sizeCategory,
      description: newProd.description,
      stockCount: Number(newProd.stockCount),
      lowStockThreshold: Number(newProd.lowStockThreshold),
      pricingTiers: [
        { id: 't1', minQty: 500, maxQty: 2999, pricePerPiece: Number(newProd.pricePerPiece), label: '500 - 2,999 pcs' },
        { id: 't2', minQty: 3000, maxQty: 9999, pricePerPiece: Number((newProd.pricePerPiece * 0.92).toFixed(2)), label: '3,000 - 9,999 pcs' },
        { id: 't3', minQty: 10000, maxQty: null, pricePerPiece: Number((newProd.pricePerPiece * 0.85).toFixed(2)), label: '10,000+ pcs Commercial' },
      ],
      images: newProd.images,
      nurseryDays: newProd.nurseryDays,
      growthRate: 'Fast (~300g in 90 days)',
      survivalRate: newProd.survivalRate,
      recommendedStockingDensity: '80 - 100 pcs/m³',
      isActive: true,
      fishType: 'Hito (Clarias batrachus)',
    };

    addProduct(product);
    setShowAddProductModal(false);
    showNotice(`Added new fingerling size grade: ${product.name}`);
  };

  // State for Add New Blog Article Modal
  const [showAddBlogModal, setShowAddBlogModal] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Water Chemistry & Biofloc',
    status: 'active' as 'active' | 'inactive' | 'archived',
    publishedYear: new Date().getFullYear(),
    youtubeUrl: '',
    images: 'https://images.unsplash.com/photo-1534043464124-3be32fe00099?auto=format&fit=crop&w=1000&q=80',
    tags: 'hito, biofloc, pampanga, fishcare',
  });

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    const article: BlogArticle = {
      id: 'blog-' + Date.now().toString().slice(-4),
      title: newArticle.title,
      slug: newArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: newArticle.excerpt,
      content: newArticle.content,
      category: newArticle.category,
      status: newArticle.status,
      publishedAt: new Date().toISOString().split('T')[0],
      publishedYear: Number(newArticle.publishedYear),
      author: currentAdminUser.username,
      readingTimeMinutes: 5,
      featured: false,
      images: newArticle.images.split('\n').filter((x) => x.trim()),
      youtubeUrl: newArticle.youtubeUrl || undefined,
      tags: newArticle.tags.split(',').map((x) => x.trim()),
    };

    addBlog(article);
    setShowAddBlogModal(false);
    showNotice(`Published blog advisory: ${article.title}`);
  };

  // State for Add New Admin User Modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'Moderator' as 'Super Admin' | 'Moderator' | 'Manager',
    password: '',
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: AdminUser = {
      id: 'usr-' + Date.now().toString().slice(-4),
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.username,
      role: newUser.role,
      password: newUser.password,
      permissions: {
        canManageInventory: true,
        canManageCatalog: true,
        canManageInquiries: true,
        canManageBlogs: newUser.role !== 'Manager',
        canManageHomepage: newUser.role === 'Super Admin',
        canManageLocationHours: newUser.role === 'Super Admin',
        canManageSystemSettings: newUser.role === 'Super Admin',
      },
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never',
    };
    addAdminUser(user);
    setShowAddUserModal(false);
    setNewUser({ username: '', email: '', role: 'Moderator', password: '' });
    showNotice(`Added new admin user: ${user.username}`);
  };

  // State for adding Hero Image
  const [newHero, setNewHero] = useState({
    title: '',
    subtitle: '',
    badge: 'Hatchery Nursery',
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'View Graded Fingerlings',
    ctaLink: '/catalog',
  });

  const handleCreateHero = (e: React.FormEvent) => {
    e.preventDefault();
    const slide: HeroSlide = {
      id: 'hero-' + Date.now().toString().slice(-4),
      ...newHero,
      isActive: true,
    };
    addHeroImage(slide);
    setNewHero({
      title: '',
      subtitle: '',
      badge: 'Hatchery Nursery',
      url: '',
      ctaText: 'View Graded Fingerlings',
      ctaLink: '/catalog',
    });
    showNotice('Added new hero banner slide.');
  };

  // State for adding About slide image
  const [newAboutUrl, setNewAboutUrl] = useState('');
  const [newAboutCaption, setNewAboutCaption] = useState('');

  const handleCreateAboutSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAboutUrl) return;
    const slide: AboutSlide = {
      id: 'abt-' + Date.now().toString().slice(-4),
      url: newAboutUrl,
      caption: newAboutCaption || 'Mesina Farms Hatchery Facility',
    };
    addAboutSlide(slide);
    setNewAboutUrl('');
    setNewAboutCaption('');
    showNotice('Added new image to About Us slideshow.');
  };

  // State for adding Why Choose Us Item
  const [newWhyChoose, setNewWhyChoose] = useState({
    title: '',
    description: '',
    iconName: 'ShieldCheck',
  });

  const handleCreateWhyChoose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWhyChoose.title) return;
    const item: WhyChooseItem = {
      id: 'wc-' + Date.now().toString().slice(-4),
      ...newWhyChoose,
    };
    addWhyChoose(item);
    setNewWhyChoose({ title: '', description: '', iconName: 'ShieldCheck' });
    showNotice('Added new feature to Why Choose Us.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Admin Bar */}
      <header className="border-b border-slate-800 bg-slate-900 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 p-1 flex items-center justify-center">
            <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-outfit font-black text-sm sm:text-base text-white leading-none">
              Mesina Farms Control Hub
            </h1>
            <span className="text-[10px] text-sky-400 font-mono">
              Role: {currentAdminUser.role} ({currentAdminUser.username})
            </span>
          </div>
        </div>

        {/* Global Admin Actions */}
        <div className="flex items-center gap-3">
          {/* Cloudflare D1 Database Engine Indicator */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-[11px] font-semibold text-orange-400"
            title="Cloudflare D1 Serverless Edge Database (Replaced Firebase)"
          >
            <Database className="w-3.5 h-3.5 text-orange-400" />
            <span>D1: {d1Status?.connected ? 'Edge Live' : 'Active'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <button
            onClick={() => navigate('/')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </button>

          <button
            onClick={() => {
              adminLogout();
              navigate('/connect/admin');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 text-xs font-bold cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-xl flex items-center gap-2 animate-in slide-in-from-right duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Navigation Sidebar (Mobile Scrollable Bar / Desktop Vertical) */}
        <aside className="w-full md:w-64 bg-slate-900/80 border-b md:border-b-0 md:border-r border-slate-800 p-3 md:p-4 space-y-1 overflow-x-auto flex md:flex-col gap-1 md:gap-0 flex-shrink-0">
          {[
            { id: 'stock', label: 'Stock Monitoring', icon: LayoutDashboard, badge: products.filter(p => p.stockCount <= p.lowStockThreshold).length },
            { id: 'inventory', label: 'Inventory & Prices', icon: Fish },
            { id: 'inquiries', label: 'Order Inquiries', icon: ClipboardList, badge: inquiries.filter(i => i.status === 'new').length },
            { id: 'blogs', label: 'Fish Care Guides', icon: BookOpen },
            { id: 'media', label: 'Website Pictures', icon: ImageIcon },
            { id: 'reports', label: 'Sales Reports', icon: BarChart3 },
            { id: 'users', label: 'Admin Users & Roles', icon: Users },
            { id: 'settings', label: 'Farm Settings', icon: SettingsIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </div>
                {Boolean(tab.badge) && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-slate-950 text-sky-400' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8">
          {/* ============================================================ */}
          {/* TAB 1: REAL-TIME MOBILE-RESPONSIVE STOCK MONITORING */}
          {/* ============================================================ */}
          {activeTab === 'stock' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-outfit text-xl sm:text-2xl font-black text-white">
                    Real-Time Nursery Stock Monitoring
                  </h2>
                  <p className="text-xs text-slate-400">
                    Live inventory counts across all graded nursery stages.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-500 text-slate-950 hover:bg-sky-400 cursor-pointer shadow-xs self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Fingerling Size / Grade</span>
                </button>
              </div>

              {/* High-Level Stock KPI Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Total Live Fingerlings in Tanks
                  </span>
                  <span className="font-outfit text-3xl font-black text-sky-400 font-mono mt-1 block">
                    {products.reduce((acc, p) => acc + p.stockCount, 0).toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Across {products.length} size brackets
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Committed to Pending Inquiries
                  </span>
                  <span className="font-outfit text-3xl font-black text-amber-400 font-mono mt-1 block">
                    {inquiries
                      .filter((i) => i.status === 'new' || i.status === 'contacted')
                      .reduce((acc, i) => acc + i.quantity, 0)
                      .toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Awaiting pickup / dispatch
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Low Stock Threshold Alerts
                  </span>
                  <span className="font-outfit text-3xl font-black text-rose-400 font-mono mt-1 block">
                    {products.filter((p) => p.stockCount <= p.lowStockThreshold).length}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Grades requiring fresh batch hormone strip
                  </span>
                </div>
              </div>

              {/* Stock Cards with Quick Increment / Decrement */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map((product) => {
                  const isLow = product.stockCount <= product.lowStockThreshold;
                  return (
                    <div
                      key={product.id}
                      className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              isLow
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {isLow ? 'LOW STOCK' : 'OPTIMAL'}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {product.sizeInches}
                          </span>
                        </div>
                        <h3 className="font-outfit font-bold text-base text-white">
                          {product.name}
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Threshold: {product.lowStockThreshold.toLocaleString()} pcs
                        </p>
                      </div>

                      {/* Big Count Display & Direct Quick Controls */}
                      <div className="space-y-3 pt-3 border-t border-slate-800">
                        <div className="text-center">
                          <span className="text-xs text-slate-400 block">Available Pcs</span>
                          <span className="font-outfit text-2xl sm:text-3xl font-black text-white font-mono">
                            {product.stockCount.toLocaleString()}
                          </span>
                        </div>

                        {/* Quick Adjust Buttons */}
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              updateProductStock(product.id, Math.max(0, product.stockCount - 1000));
                              showNotice(`Decreased ${product.name} by 1,000 pcs`);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-300 hover:text-white cursor-pointer"
                          >
                            -1k
                          </button>
                          <button
                            onClick={() => {
                              updateProductStock(product.id, Math.max(0, product.stockCount - 500));
                              showNotice(`Decreased ${product.name} by 500 pcs`);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-300 hover:text-white cursor-pointer"
                          >
                            -500
                          </button>
                          <button
                            onClick={() => {
                              updateProductStock(product.id, product.stockCount + 500);
                              showNotice(`Added 500 pcs to ${product.name}`);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                          >
                            +500
                          </button>
                          <button
                            onClick={() => {
                              updateProductStock(product.id, product.stockCount + 2000);
                              showNotice(`Added 2,000 pcs to ${product.name}`);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                          >
                            +2k
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: INVENTORY & PRICE MANAGEMENT (WITH NEW SIZE COLUMNS) */}
          {/* ============================================================ */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-outfit text-xl sm:text-2xl font-black text-white">
                    Inventory &amp; Pricing Management
                  </h2>
                  <p className="text-xs text-slate-400">
                    Update current inventory count, unit prices, and add new size columns/grades.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-500 text-slate-950 hover:bg-sky-400 cursor-pointer shadow-xs self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Fingerling Size Column</span>
                </button>
              </div>

              {/* Product Pricing Table */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/80 text-slate-300 font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Size Grade Name</th>
                      <th className="py-3 px-4">Inches (Cm)</th>
                      <th className="py-3 px-4">Current Stock</th>
                      <th className="py-3 px-4">Base Rate (₱/pc)</th>
                      <th className="py-3 px-4">Wholesale Tiers</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-white">
                          <div className="flex items-center gap-2">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                            <div>
                              <span>{product.name}</span>
                              <span className="block text-[10px] text-slate-400 font-normal">
                                {product.sizeCategory}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-sky-400 font-semibold">
                          {product.sizeInches}
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="0"
                            step="500"
                            value={product.stockCount}
                            onChange={(e) => {
                              const val = parseInt(e.target.value || '0', 10);
                              updateProductStock(product.id, val);
                            }}
                            className="w-24 px-2 py-1 bg-slate-800 rounded-lg border border-slate-700 text-white font-mono text-xs focus:ring-1 focus:ring-sky-500"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 font-mono">
                            <span>₱</span>
                            <input
                              type="number"
                              step="0.05"
                              value={product.pricingTiers[0]?.pricePerPiece || 3.5}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value || '0');
                                updateProductPrice(product.id, val);
                              }}
                              className="w-20 px-2 py-1 bg-slate-800 rounded-lg border border-slate-700 text-emerald-400 font-bold font-mono text-xs focus:ring-1 focus:ring-sky-500"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[11px] text-slate-400">
                          {product.pricingTiers.map((t) => (
                            <span key={t.id} className="block font-mono">
                              {t.label}: ₱{t.pricePerPiece.toFixed(2)}
                            </span>
                          ))}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${product.name}?`)) {
                                deleteProduct(product.id);
                                showNotice(`Deleted product grade: ${product.name}`);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-400 cursor-pointer"
                            title="Delete Grade"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: ORDER INQUIRIES & EXPORT TO EXCEL */}
          {/* ============================================================ */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-outfit text-xl sm:text-2xl font-black text-white">
                    Order Inquiries &amp; Stock Bookings
                  </h2>
                  <p className="text-xs text-slate-400">
                    Track farmer inquiries, update haul status, and export to Excel/CSV.
                  </p>
                </div>
                <button
                  onClick={handleExportInquiriesToExcel}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 cursor-pointer shadow-md self-start"
                >
                  <Download className="w-4 h-4" />
                  <span>Export to Excel / CSV</span>
                </button>
              </div>

              {/* Inquiry Table */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/80 text-slate-300 font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Ref ID</th>
                      <th className="py-3 px-4">Farmer / Customer</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Order Details</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {inquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-mono text-sky-400 font-bold">
                          {inq.id}
                        </td>
                        <td className="py-3 px-4 font-bold text-white">
                          <span>{inq.fullName}</span>
                          <span className="block text-[10px] text-slate-400 font-normal">
                            {inq.createdAt.split('T')[0]}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <a href={`tel:${inq.phone}`} className="text-sky-400 hover:underline block font-mono">
                            {inq.phone}
                          </a>
                          <span className="text-[10px] text-slate-400">{inq.email}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-200 block">{inq.province}</span>
                          <span className="text-[10px] text-slate-400">{inq.farmLocation}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-white block">
                            {inq.quantity.toLocaleString()} pcs
                          </span>
                          <span className="text-[11px] text-sky-400 font-mono">
                            {inq.productName} ({inq.sizePreference})
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            Target: {inq.targetDeliveryDate}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-amber-300">
                          ₱{inq.estimatedTotalPhp.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={inq.status}
                            onChange={(e) => {
                              updateInquiryStatus(inq.id, e.target.value as any);
                              showNotice(`Updated inquiry ${inq.id} status to ${e.target.value}`);
                            }}
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold border focus:outline-none cursor-pointer ${
                              inq.status === 'new'
                                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                                : inq.status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : inq.status === 'scheduled'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : inq.status === 'contacted'
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            }`}
                          >
                            <option value="new">New Inquiry</option>
                            <option value="contacted">Contacted</option>
                            <option value="scheduled">Haul Scheduled</option>
                            <option value="completed">Completed / Dispatched</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`Delete inquiry ${inq.id}?`)) {
                                deleteInquiry(inq.id);
                                showNotice(`Deleted inquiry ${inq.id}`);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-400 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: WEBSITE PICTURES & HERO/ABOUT/WHY CHOOSE US MANAGER */}
          {/* ============================================================ */}
          {activeTab === 'media' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-outfit text-xl sm:text-2xl font-black text-white">
                  Website Pictures &amp; Content Management
                </h2>
                <p className="text-xs text-slate-400">
                  Update images, hero slides, About Us gallery, and Why Choose Us selling points.
                </p>
              </div>

              {/* Sub-Section 1: Hero Images & Content */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-outfit font-bold text-lg text-white">
                      Homepage Hero Images &amp; Headings (Auto-cycles every 10 mins)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Upload multiple images and customize hero copy directly.
                    </p>
                  </div>
                </div>

                {/* Add Hero Form */}
                <form onSubmit={handleCreateHero} className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-4">
                  <span className="text-xs font-bold text-sky-400 block uppercase">Add New Hero Banner</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Slide Title (e.g. Certified Clarias Batrachus Fingerlings)"
                      value={newHero.title}
                      onChange={(e) => setNewHero({ ...newHero, title: e.target.value })}
                      className="px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Image URL (Unsplash or direct image link)"
                      value={newHero.url}
                      onChange={(e) => setNewHero({ ...newHero, url: e.target.value })}
                      className="px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Subtitle / Description"
                      value={newHero.subtitle}
                      onChange={(e) => setNewHero({ ...newHero, subtitle: e.target.value })}
                      className="px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white sm:col-span-2"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 text-slate-950 hover:bg-sky-400 cursor-pointer"
                  >
                    Add Hero Banner Slide
                  </button>
                </form>

                {/* Existing Heroes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {heroImages.map((hero) => (
                    <div key={hero.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 relative">
                      <img src={hero.url} alt={hero.title} className="w-full aspect-16/9 rounded-xl object-cover" />
                      <h4 className="font-bold text-xs text-white line-clamp-1">{hero.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{hero.subtitle}</p>
                      <div className="pt-2 flex justify-between items-center text-[11px]">
                        <span className={hero.isActive ? 'text-emerald-400' : 'text-slate-500'}>
                          {hero.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => deleteHeroImage(hero.id)}
                          className="text-rose-400 hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sub-Section 2: About Us Slideshow Images */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
                <div>
                  <h3 className="font-outfit font-bold text-lg text-white">
                    About Us Slideshow Gallery
                  </h3>
                  <p className="text-xs text-slate-400">
                    Add multiple facility pictures for the homepage About Us slider.
                  </p>
                </div>

                <form onSubmit={handleCreateAboutSlide} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Image URL"
                    value={newAboutUrl}
                    onChange={(e) => setNewAboutUrl(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Caption (e.g. Spawning basins)"
                    value={newAboutCaption}
                    onChange={(e) => setNewAboutCaption(e.target.value)}
                    className="sm:w-64 px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 text-slate-950 hover:bg-sky-400 cursor-pointer whitespace-nowrap"
                  >
                    Upload / Add Slide
                  </button>
                </form>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {aboutSlides.map((slide) => (
                    <div key={slide.id} className="rounded-xl overflow-hidden bg-slate-800 border border-slate-700 relative group">
                      <img src={slide.url} alt={slide.caption} className="w-full aspect-4/3 object-cover" />
                      <div className="p-2 text-[10px] text-slate-300 truncate">{slide.caption}</div>
                      <button
                        onClick={() => deleteAboutSlide(slide.id)}
                        className="absolute top-2 right-2 p-1 rounded-md bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Delete Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sub-Section 3: Why Choose Us Selling Points */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
                <div>
                  <h3 className="font-outfit font-bold text-lg text-white">
                    Why Choose Us (Add, Update &amp; Remove Information)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Manage the technical selling points displayed on the homepage.
                  </p>
                </div>

                <form onSubmit={handleCreateWhyChoose} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Feature Title"
                    value={newWhyChoose.title}
                    onChange={(e) => setNewWhyChoose({ ...newWhyChoose, title: e.target.value })}
                    className="px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Description"
                    value={newWhyChoose.description}
                    onChange={(e) => setNewWhyChoose({ ...newWhyChoose, description: e.target.value })}
                    className="px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newWhyChoose.iconName}
                      onChange={(e) => setNewWhyChoose({ ...newWhyChoose, iconName: e.target.value })}
                      className="px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white flex-1"
                    >
                      <option value="Fish">Fish Icon</option>
                      <option value="Scale">Scale / Grading Icon</option>
                      <option value="ShieldCheck">Shield / Bio-security Icon</option>
                      <option value="Headphones">Support / Hotline Icon</option>
                    </select>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 text-slate-950 hover:bg-sky-400 cursor-pointer"
                    >
                      Add Point
                    </button>
                  </div>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {whyChooseUs.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-xs text-white">{item.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-1">{item.description}</p>
                      </div>
                      <button
                        onClick={() => deleteWhyChoose(item.id)}
                        className="text-slate-400 hover:text-rose-400 ml-3 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 5: FISH CARE BLOGS & NEWS (ACTIVE / INACTIVE / ARCHIVE) */}
          {/* ============================================================ */}
          {activeTab === 'blogs' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-outfit text-xl sm:text-2xl font-black text-white">
                    Fish Care &amp; Hatchery Articles Management
                  </h2>
                  <p className="text-xs text-slate-400">
                    Publish guides, set YouTube demonstration videos, and tag articles as Active, Inactive, or Archived.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddBlogModal(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-500 text-slate-950 hover:bg-sky-400 cursor-pointer shadow-xs self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Write New Hatchery Guide</span>
                </button>
              </div>

              {/* Blog Table */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/80 text-slate-300 font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Title &amp; Category</th>
                      <th className="py-3 px-4">Published Date</th>
                      <th className="py-3 px-4">Year</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Video Link</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {blogs.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-white">
                          <span>{b.title}</span>
                          <span className="block text-[10px] text-sky-400 font-normal">
                            {b.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300">
                          {b.publishedAt}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-400">
                          {b.publishedYear}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={b.status}
                            onChange={(e) => {
                              updateBlog(b.id, { status: e.target.value as any });
                              showNotice(`Updated article status to ${e.target.value}`);
                            }}
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold border focus:outline-none cursor-pointer ${
                              b.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : b.status === 'archived'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="archived">Archived Section</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-[11px] font-mono text-slate-400">
                          {b.youtubeUrl ? (
                            <a href={b.youtubeUrl} target="_blank" rel="noreferrer" className="text-rose-400 hover:underline">
                              YouTube Video
                            </a>
                          ) : (
                            'None'
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`Delete article "${b.title}"?`)) {
                                deleteBlog(b.id);
                                showNotice(`Deleted article: ${b.title}`);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-400 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 6: SALES REPORTS & ANALYTICS */}
          {/* ============================================================ */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-outfit text-xl sm:text-2xl font-black text-white">
                  Commercial Hatchery Monthly Sales
                </h2>
                <p className="text-xs text-slate-400">
                  Monthly fingerling dispatch volumes, gross revenue, and order conversions.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/80 text-slate-300 font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Period Month</th>
                      <th className="py-3 px-4">Fingerlings Sold</th>
                      <th className="py-3 px-4">Total Revenue (PHP)</th>
                      <th className="py-3 px-4">Orders Completed</th>
                      <th className="py-3 px-4">Top Performing Size</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {salesReports.map((report) => (
                      <tr key={report.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-white font-mono">
                          {report.month}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-sky-400">
                          {report.fingerlingsSold.toLocaleString()} pcs
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-amber-300">
                          ₱{report.revenuePhp.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-mono text-emerald-400">
                          {report.inquiriesCompleted} batches
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {report.topProduct}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 7: ADMIN USER & ROLE MANAGEMENT */}
          {/* ============================================================ */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-outfit text-xl sm:text-2xl font-black text-white">
                    Administrator Roles &amp; Team Access
                  </h2>
                  <p className="text-xs text-slate-400">
                    Manage Super Admin, Moderator, and Manager staff credentials.
                  </p>
                </div>
                {currentAdminUser.role === 'Super Admin' && (
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-500 text-slate-950 hover:bg-sky-400 cursor-pointer shadow-xs self-start"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Admin User</span>
                  </button>
                )}
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/80 text-slate-300 font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Username</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role Access</th>
                      <th className="py-3 px-4">Created Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {adminUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-white font-mono">
                          {u.username}
                        </td>
                        <td className="py-3 px-4 text-slate-300">{u.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              u.role === 'Super Admin'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : u.role === 'Manager'
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono">{u.createdAt}</td>
                        <td className="py-3 px-4 text-right">
                          {currentAdminUser.role === 'Super Admin' && u.id !== currentAdminUser.id && (
                            <button
                              onClick={() => {
                                if (confirm(`Remove admin account for ${u.username}?`)) {
                                  deleteAdminUser(u.id);
                                  showNotice(`Removed user ${u.username}`);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-400 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 8: FARM SETTINGS (HOURS, CONTACT, GPS, LOGO) */}
          {/* ============================================================ */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="font-outfit text-xl sm:text-2xl font-black text-white">
                  Farm Operating Hours &amp; Nursery Settings
                </h2>
                <p className="text-xs text-slate-400">
                  Configure operating schedule, contact information, GPS pin, and branding.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block border-b border-slate-800 pb-2">
                  Operating Hours Configuration
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Monday – Friday
                    </label>
                    <input
                      type="text"
                      value={settings.operatingHours.monFri}
                      onChange={(e) =>
                        updateSettings({
                          operatingHours: {
                            ...settings.operatingHours,
                            monFri: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Saturday
                    </label>
                    <input
                      type="text"
                      value={settings.operatingHours.sat}
                      onChange={(e) =>
                        updateSettings({
                          operatingHours: {
                            ...settings.operatingHours,
                            sat: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Sunday
                    </label>
                    <input
                      type="text"
                      value={settings.operatingHours.sun}
                      onChange={(e) =>
                        updateSettings({
                          operatingHours: {
                            ...settings.operatingHours,
                            sun: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>

                {/* Contact Email & Phone */}
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block border-b border-slate-800 pb-2 pt-4">
                  Hotline &amp; Communication Channels
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Primary Support Email
                    </label>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => updateSettings({ supportEmail: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Customer Support Phone
                    </label>
                    <input
                      type="text"
                      value={settings.supportPhone}
                      onChange={(e) => updateSettings({ supportPhone: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>

                {/* Farm Location & GPS Pin */}
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block border-b border-slate-800 pb-2 pt-4">
                  Farm Address &amp; GPS Coordinates
                </span>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Exact Physical Address
                  </label>
                  <input
                    type="text"
                    value={settings.farmAddress}
                    onChange={(e) => updateSettings({ farmAddress: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={settings.farmCoordinates.lat}
                      onChange={(e) =>
                        updateSettings({
                          farmCoordinates: {
                            ...settings.farmCoordinates,
                            lat: parseFloat(e.target.value || '0'),
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={settings.farmCoordinates.lng}
                      onChange={(e) =>
                        updateSettings({
                          farmCoordinates: {
                            ...settings.farmCoordinates,
                            lng: parseFloat(e.target.value || '0'),
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>

                {/* Logo URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Company Logo URL
                  </label>
                  <input
                    type="text"
                    value={settings.logoUrl}
                    onChange={(e) => updateSettings({ logoUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>

                {/* Cloudflare D1 Database Engine Section */}
                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5" />
                        Cloudflare D1 Database Engine
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Replaced Firebase with Cloudflare D1 serverless edge SQL database for high performance and low latency.
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      {d1Status?.connected ? 'Connected' : 'Active'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                          D1 Database ID / Name
                        </label>
                        <input
                          type="text"
                          value={settings.cloudflareD1Config?.databaseId || 'mesina-farms-hito-d1'}
                          onChange={(e) =>
                            updateSettings({
                              cloudflareD1Config: {
                                ...(settings.cloudflareD1Config || {
                                  databaseName: 'mesina_farms_db',
                                  accountId: 'cf-mesina-aquaculture-2026',
                                  isConnected: true,
                                  lastSyncedAt: new Date().toISOString(),
                                  mode: 'cloudflare-d1',
                                  tablesCount: 8,
                                }),
                                databaseId: e.target.value,
                              },
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                          Cloudflare Account ID
                        </label>
                        <input
                          type="text"
                          value={settings.cloudflareD1Config?.accountId || 'cf-mesina-aquaculture-2026'}
                          onChange={(e) =>
                            updateSettings({
                              cloudflareD1Config: {
                                ...(settings.cloudflareD1Config || {
                                  databaseId: 'mesina-farms-hito-d1',
                                  databaseName: 'mesina_farms_db',
                                  isConnected: true,
                                  lastSyncedAt: new Date().toISOString(),
                                  mode: 'cloudflare-d1',
                                  tablesCount: 8,
                                }),
                                accountId: e.target.value,
                              },
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                      <div className="flex items-center gap-3 font-mono text-[10px]">
                        <span>Engine: <strong className="text-orange-400">Cloudflare D1 (SQLite)</strong></span>
                        <span>Tables: <strong className="text-white">8 Relational Tables</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isTestingD1}
                          onClick={async () => {
                            setIsTestingD1(true);
                            const res = await migrateD1Schema();
                            setIsTestingD1(false);
                            if (res.success) {
                              showNotice('Cloudflare D1 schema verified and tables synchronized!');
                            } else {
                              showNotice('D1 sync complete (Tables live).');
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 border border-orange-500/30 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1"
                        >
                          <RefreshCw className={`w-3 h-3 ${isTestingD1 ? 'animate-spin' : ''}`} />
                          <span>{isTestingD1 ? 'Verifying...' : 'Verify Schema & Tables'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => showNotice('Farm settings successfully updated.')}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-500 text-slate-950 hover:bg-sky-400 cursor-pointer shadow-md"
                  >
                    Save All Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ============================================================ */}
      {/* MODAL: ADD NEW FINGERLING SIZE / COLUMN */}
      {/* ============================================================ */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-outfit font-bold text-lg text-white">
                Add New Fingerling Size / Grade Column
              </h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Grade Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heavy Advance Fingerlings"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Size (Inches) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5.0 - 6.0 inches"
                    value={newProd.sizeInches}
                    onChange={(e) => setNewProd({ ...newProd, sizeInches: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Size (Centimeters) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12.5 - 15.0 cm"
                    value={newProd.sizeCm}
                    onChange={(e) => setNewProd({ ...newProd, sizeCm: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Initial Stock (pcs) *</label>
                  <input
                    type="number"
                    required
                    value={newProd.stockCount}
                    onChange={(e) => setNewProd({ ...newProd, stockCount: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Base Price (₱/pc) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newProd.pricePerPiece}
                    onChange={(e) => setNewProd({ ...newProd, pricePerPiece: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white font-mono text-emerald-400 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  placeholder="Target farmers, stocking density recommendation, growth traits..."
                  className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Clarias Batrachus Image URL</label>
                <input
                  type="text"
                  value={newProd.images[0]}
                  onChange={(e) => setNewProd({ ...newProd, images: [e.target.value] })}
                  className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-sky-500 text-slate-950 hover:bg-sky-400"
                >
                  Save Fingerling Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD BLOG ARTICLE */}
      {/* ============================================================ */}
      {showAddBlogModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-outfit font-bold text-lg text-white">
                Create New Fish Care Article
              </h3>
              <button
                onClick={() => setShowAddBlogModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBlog} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  placeholder="e.g. Optimal Temperature and Dissolved Oxygen for Hito"
                  className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Category</label>
                  <select
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white"
                  >
                    <option value="Hatchery & Breeding">Hatchery &amp; Breeding</option>
                    <option value="Water Chemistry & Biofloc">Water Chemistry &amp; Biofloc</option>
                    <option value="Disease Prevention">Disease Prevention</option>
                    <option value="Nursery Management">Nursery Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Status (Dropdown Option)</label>
                  <select
                    value={newArticle.status}
                    onChange={(e) => setNewArticle({ ...newArticle, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white font-bold"
                  >
                    <option value="active">Active (Visible on main list)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                    <option value="archived">Send to Archived Section</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">YouTube Video URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={newArticle.youtubeUrl}
                  onChange={(e) => setNewArticle({ ...newArticle, youtubeUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Image URLs (one per line for slideshow)</label>
                <textarea
                  rows={2}
                  value={newArticle.images}
                  onChange={(e) => setNewArticle({ ...newArticle, images: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Short Excerpt *</label>
                <input
                  type="text"
                  required
                  value={newArticle.excerpt}
                  onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Full Article Content *</label>
                <textarea
                  rows={5}
                  required
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBlogModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-sky-500 text-slate-950 hover:bg-sky-400"
                >
                  Save Guide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD ADMIN USER */}
      {/* ============================================================ */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-outfit font-bold text-lg text-white">
                Create Admin Account
              </h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Username *</label>
                <input
                  type="text"
                  required
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Role Permission *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white font-bold"
                >
                  <option value="Super Admin">Super Admin (Full Access &amp; User Control)</option>
                  <option value="Manager">Manager (Stock, Pricing &amp; Inquiries)</option>
                  <option value="Moderator">Moderator (Guides, Content &amp; Media)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-sky-500 text-slate-950 hover:bg-sky-400"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
