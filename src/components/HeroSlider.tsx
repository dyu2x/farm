import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Fish, Waves } from 'lucide-react';

interface HeroSliderProps {
  navigate: (path: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ navigate }) => {
  const { heroImages, t } = useApp();
  const activeHeroes = heroImages.filter((h) => h.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-random or sequential cycle every 10 minutes (600,000 ms), with interval handling
  useEffect(() => {
    if (activeHeroes.length <= 1) return;

    // 10 minutes interval = 10 * 60 * 1000 = 600000ms
    const interval = setInterval(() => {
      // Pick a random image or next in sequence
      setCurrentIndex((prev) => {
        let next = Math.floor(Math.random() * activeHeroes.length);
        if (next === prev && activeHeroes.length > 1) {
          next = (prev + 1) % activeHeroes.length;
        }
        return next;
      });
    }, 600000);

    return () => clearInterval(interval);
  }, [activeHeroes.length]);

  if (activeHeroes.length === 0) return null;

  const currentHero = activeHeroes[currentIndex % activeHeroes.length];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeHeroes.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeHeroes.length);
  };

  return (
    <section className="relative w-full overflow-hidden rounded-3xl bg-slate-950 text-white min-h-[480px] sm:min-h-[540px] lg:min-h-[600px] flex items-center shadow-xl">
      {/* Background Image with Dark Vignette & Aqua Ambient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentHero.url}
          alt={currentHero.title}
          className="w-full h-full object-cover object-center transform transition-transform duration-1000 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/50" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-black/70" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24">
        <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-left-4 duration-500 key={currentHero.id}">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30 backdrop-blur-sm">
            <Fish className="w-3.5 h-3.5 text-sky-400" />
            <span>{currentHero.badge}</span>
          </div>

          {/* Title */}
          <h1 className="font-outfit text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            {currentHero.title}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-xl">
            {currentHero.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={() => {
                if (currentHero.ctaLink.startsWith('#')) {
                  const el = document.getElementById(currentHero.ctaLink.replace('#', ''));
                  el?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate(currentHero.ctaLink);
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-sky-400 hover:bg-sky-300 active:bg-sky-500 shadow-lg hover:shadow-sky-500/25 transition-all cursor-pointer"
            >
              <span>{currentHero.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/inquiry')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all cursor-pointer"
            >
              <span>{t('navInquiry')}</span>
            </button>
          </div>

          {/* Key Value Points */}
          <div className="pt-6 border-t border-white/15 flex flex-wrap gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Hormone-Induced Stripping</span>
            </div>
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-sky-400" />
              <span>Oxygenated Live Hauling</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Direct Farm Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {activeHeroes.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-xs transition-colors cursor-pointer"
            aria-label="Previous Hero Image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-xs transition-colors cursor-pointer"
            aria-label="Next Hero Image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-6 right-8 z-20 flex items-center gap-2">
            {activeHeroes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex % activeHeroes.length
                    ? 'w-7 bg-sky-400'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
