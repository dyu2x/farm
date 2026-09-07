import React from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, Clock, Fish, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { settings, t, visitorCount } = useApp();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-300 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Col 1: Brand & Logo (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center">
              <div className="w-16 h-16 flex-shrink-0">
                <img
                  src={settings.logoUrl || '/round_transparent.png'}
                  alt="Mesina Farms Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Premier Philippine commercial hatchery propagating certified <em>Clarias batrachus</em> fingerlings with high nursery survival, hormone-induced breeding, and farmer technical assistance.
            </p>

            {/* Live Visitor Counter */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t('visitorCounter')}:</span>
              <span className="font-mono font-bold text-white">
                {visitorCount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 block">
              Quick Navigation
            </span>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => {
                    navigate('/');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  {t('navHome')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate('/catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  {t('navCatalog')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate('/guides');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  {t('navGuides')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate('/location');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  {t('navLocation')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate('/inquiry');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  {t('navInquiry')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Hours (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 block">
              Hatchery Nursery &amp; Direct Support
            </span>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">{settings.farmAddress}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <a
                  href={`tel:${settings.supportPhone.replace(/\s+/g, '')}`}
                  className="text-slate-300 hover:text-sky-400 transition-colors font-medium"
                >
                  {settings.supportPhone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <a
                  href={`mailto:${settings.supportEmail}`}
                  className="text-slate-300 hover:text-sky-400 transition-colors"
                >
                  {settings.supportEmail}
                </a>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-slate-400">
                  <p>{settings.operatingHours.monFri}</p>
                  <p>{settings.operatingHours.sat}</p>
                  <p>{settings.operatingHours.sun}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line without ANY admin link */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {settings.companyName}. All rights reserved. Certified Aquaculture Nursery.</p>
          <p className="flex items-center gap-1">
            <span>Specialized propagation of</span>
            <span className="font-semibold text-slate-400">Clarias batrachus</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
