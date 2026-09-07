import React from 'react';
import { FarmLocationPreview } from '../components/FarmLocationPreview';
import { Truck, CheckCircle2, ShieldAlert, Compass, MapPin } from 'lucide-react';

interface FarmLocationPageProps {
  navigate: (path: string) => void;
}

export const FarmLocationPage: React.FC<FarmLocationPageProps> = ({ navigate }) => {
  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Interactive Map and Location Component */}
      <FarmLocationPreview navigate={navigate} isFullPage={true} />

      {/* Hauling & Pickup Protocol Guide */}
      <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-outfit font-bold text-lg text-slate-900 dark:text-white">
              Farmer Pickup &amp; Hauling Protocols
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Guidelines for smooth live fingerling transit from our gate to your ponds.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white text-sm block">
              1. Early Morning or Dusk Hauling
            </span>
            <p className="leading-relaxed">
              We recommend picking up between 5:30 AM – 8:00 AM or after 4:30 PM to minimize heat stress on juvenile <em>Clarias batrachus</em> during highway transit.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white text-sm block">
              2. Pure Oxygen Double Bags
            </span>
            <p className="leading-relaxed">
              All nursery orders are double-bagged and charged with medical-grade pure oxygen, safe for up to 18 hours of non-stop overland travel across Luzon.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white text-sm block">
              3. Acclimation at Discharge
            </span>
            <p className="leading-relaxed">
              Float sealed oxygen bags on the surface of your grow-out tanks for 15-20 minutes before gradual mixing to match water temperature and pH.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
