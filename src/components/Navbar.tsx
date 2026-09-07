import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGE_LABELS } from '../utils/translations';
import { Language } from '../types';
import {
  Search,
  Sun,
  Moon,
  Menu,
  X,
  Phone,
  Compass,
  Fish,
  BookOpen,
  MapPin,
  ClipboardList,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const {
    t,
    language,
    setLanguage,
    darkMode,
    toggleDarkMode,
    cursorEnabled,
    toggleCursor,
    searchQuery,
    setSearchQuery,
    settings,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems = [
    { label: t('navHome'), path: '/', icon: Compass },
    { label: t('navCatalog'), path: '/catalog', icon: Fish },
    { label: t('navGuides'), path: '/guides', icon: BookOpen },
    { label: t('navLocation'), path: '/location', icon: MapPin },
    { label: t('navInquiry'), path: '/inquiry', icon: ClipboardList },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-200">
      {/* Top Banner: Emergency Logistics & Support Hotline */}
      <div className="bg-slate-900 text-slate-100 dark:bg-slate-950 dark:border-b dark:border-slate-800 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Live Stocking Hatchery
            </span>
            <span className="hidden sm:inline text-slate-300">
              Clarias batrachus certified breeders &amp; fingerlings nursery
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${settings.supportPhone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 font-medium text-sky-400 hover:text-sky-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{settings.supportPhone}</span>
            </a>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-300">
              {settings.supportEmail}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo Only (wordmark beside logo removed per request) */}
        <button
          onClick={() => handleNavClick('/')}
          className="flex items-center group cursor-pointer focus:outline-none"
          title="Mesina Farms - Hito Hatchery & Grower"
          aria-label="Mesina Farms - Home"
        >
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 transition-transform group-hover:scale-105 duration-200">
            <img
              src={settings.logoUrl || '/round_transparent.png'}
              alt="Mesina Farms Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons: Search, Language, Theme, Inquiry CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Input */}
          <div className="relative hidden md:block">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-48 lg:w-60 pl-8 pr-3 py-1.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 border border-slate-200 dark:border-slate-700 transition-all focus:w-64"
              />
              <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Search Toggle for Small Screens */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
            >
              <span>{LANGUAGE_LABELS[language].flag}</span>
              <span className="hidden sm:inline uppercase">{language}</span>
            </button>

            {langDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setLangDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-44 rounded-xl shadow-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500">
                    Pumili ng Wika (Select Language)
                  </div>
                  {(Object.keys(LANGUAGE_LABELS) as Language[]).map((key) => {
                    const info = LANGUAGE_LABELS[key];
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setLanguage(key);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-sky-50 dark:hover:bg-slate-700 cursor-pointer ${
                          language === key
                            ? 'font-bold text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-slate-700/50'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{info.flag}</span>
                          <span>{info.label}</span>
                        </span>
                        <span className="text-[10px] text-slate-400">{info.nativeName}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle Theme"
            title={darkMode ? t('lightMode') : t('darkMode')}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400 animate-in spin-in-180 duration-200" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700 hover:text-sky-600" />
            )}
          </button>

          {/* Interactive Fish Cursor Toggle (desktop only icon) */}
          <button
            onClick={toggleCursor}
            className={`hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
              cursorEnabled
                ? 'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300'
                : 'border-slate-200 text-slate-500 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400'
            }`}
            title="Toggle interactive swimming fish cursor"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>Cursor</span>
          </button>

          {/* Fast Order Inquiry Action Button */}
          <button
            onClick={() => handleNavClick('/inquiry')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 shadow-sm hover:shadow transition-all cursor-pointer"
          >
            {t('navInquiry')}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Open Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Expandable */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              autoFocus
              className="w-full pl-9 pr-8 py-2 rounded-lg text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-slate-200 dark:border-slate-700"
            />
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('/inquiry')}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold text-center text-white bg-sky-600 hover:bg-sky-700 shadow-sm"
            >
              {t('orderInquiryNow')}
            </button>

            <a
              href={`tel:${settings.supportPhone.replace(/\s+/g, '')}`}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-center border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-sky-600" />
              <span>Call Hotline: {settings.supportPhone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
