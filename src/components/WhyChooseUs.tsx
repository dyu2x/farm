import React from 'react';
import { useApp } from '../context/AppContext';
import { Fish, Scale, ShieldCheck, Headphones, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const { whyChooseUs, t } = useApp();

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'fish':
        return Fish;
      case 'scale':
        return Scale;
      case 'shieldcheck':
      case 'shield':
        return ShieldCheck;
      case 'headphones':
      case 'support':
        return Headphones;
      default:
        return CheckCircle2;
    }
  };

  return (
    <section className="py-12 sm:py-16 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Proven Hatchery Performance</span>
        </div>
        <h2 className="font-outfit text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t('whyChooseTitle')}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">
          {t('whyChooseSub')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {whyChooseUs.map((item, index) => {
          const IconComponent = getIcon(item.iconName);
          return (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <IconComponent className="w-6 h-6" />
              </div>
              <h3 className="font-outfit font-bold text-base text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
