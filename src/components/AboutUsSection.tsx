import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Award, Dna, ShieldCheck, Microscope } from 'lucide-react';

export const AboutUsSection: React.FC = () => {
  const { aboutSlides, t } = useApp();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (aboutSlides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % aboutSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [aboutSlides.length]);

  const handlePrev = () => {
    setActiveSlide((prev) => (prev === 0 ? aboutSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % aboutSlides.length);
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Story & Craftsmanship (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300">
            <Award className="w-3.5 h-3.5" />
            <span>Hermosa, Bataan Aquaculture Facility</span>
          </div>

          <h2 className="font-outfit text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('aboutTitle')}
          </h2>

          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
            Mesina Farms is a dedicated commercial hatchery and grow-out facility specializing exclusively in <em>Clarias batrachus</em> (Philippine Hito). Founded on scientific hatchery principles and rigorous biosecurity, we supply fish farmers across Central Luzon, CALABARZON, and neighboring provinces with superior, uniform fingerlings.
          </p>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Unlike haphazard wild seed collection or uncalibrated backyard hatcheries, our breeding broodstock is conditioned in temperature-stable, deep-well aerated earthen reservoirs. Every spawning cycle utilizes calibrated hormone-induced stripping to yield synchronous fry hatches with exceptional digestive vigor.
          </p>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-2.5">
                <Dna className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Selective Genetic Lineage
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Parent breeders chosen strictly for disease resistance, rapid FCR, and thick body depth.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2.5">
                <Microscope className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Zero-Cannibalism Mechanical Sizing
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Graded three times weekly with stainless steel sorters to eliminate cannibalistic loss.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Image Slideshow (5 cols) */}
        <div className="lg:col-span-5">
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-xl aspect-4/3 sm:aspect-16/11 border border-slate-200 dark:border-slate-800 group">
            {aboutSlides.length > 0 && (
              <>
                <img
                  src={aboutSlides[activeSlide % aboutSlides.length].url}
                  alt={aboutSlides[activeSlide % aboutSlides.length].caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Caption overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-5 text-white">
                  <p className="text-xs sm:text-sm font-medium leading-snug">
                    {aboutSlides[activeSlide % aboutSlides.length].caption}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20 text-[11px] text-slate-300">
                    <span>Hatchery Facility Tour</span>
                    <span>
                      {activeSlide + 1} / {aboutSlides.length}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                {aboutSlides.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors cursor-pointer"
                      aria-label="Previous Slide"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors cursor-pointer"
                      aria-label="Next Slide"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Dots */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full">
                      {aboutSlides.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveSlide(idx)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            idx === activeSlide ? 'w-5 bg-sky-400' : 'w-1.5 bg-white/50'
                          }`}
                          aria-label={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
