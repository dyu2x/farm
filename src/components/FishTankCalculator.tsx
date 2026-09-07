import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calculator, ArrowRight, CheckCircle2, Waves, Sparkles, Scale, Info } from 'lucide-react';

interface FishTankCalculatorProps {
  onApplyToInquiry?: (quantity: number, productName: string, sizePreference: string) => void;
  navigate?: (path: string) => void;
}

export const FishTankCalculator: React.FC<FishTankCalculatorProps> = ({
  onApplyToInquiry,
  navigate,
}) => {
  const { t, products } = useApp();

  // Calculator state
  const [tankShape, setTankShape] = useState<'circular' | 'rectangular' | 'earthen'>('circular');
  const [diameter, setDiameter] = useState<number>(4.0); // meters for circular tank
  const [length, setLength] = useState<number>(6.0); // meters
  const [width, setWidth] = useState<number>(4.0); // meters
  const [waterDepth, setWaterDepth] = useState<number>(1.0); // meters
  const [aerationType, setAerationType] = useState<'moderate' | 'intensive' | 'biofloc'>('intensive');
  const [targetHarvestWeight, setTargetHarvestWeight] = useState<number>(300); // in grams (250g, 300g, 350g, 500g)

  // Volume calculations in cubic meters (m³)
  let volumeM3 = 0;
  if (tankShape === 'circular') {
    const radius = diameter / 2;
    volumeM3 = Math.PI * radius * radius * waterDepth;
  } else {
    volumeM3 = length * width * waterDepth;
  }
  const volumeLiters = Math.round(volumeM3 * 1000);

  // Density factor per m³ based on aeration setup:
  // Moderate / Static: ~40-60 pcs/m³
  // Intensive Aeration: ~80-120 pcs/m³
  // High-Density Biofloc: ~150-180 pcs/m³
  let densityPerM3 = 100;
  if (aerationType === 'moderate') densityPerM3 = 50;
  if (aerationType === 'intensive') densityPerM3 = 100;
  if (aerationType === 'biofloc') densityPerM3 = 160;

  const recommendedFingerlings = Math.max(500, Math.round(volumeM3 * densityPerM3));
  const expectedSurvivalPercent = 95;
  const survivingFish = Math.round(recommendedFingerlings * (expectedSurvivalPercent / 100));
  const estimatedHarvestBiomassKg = Math.round((survivingFish * targetHarvestWeight) / 1000);

  // Feed calculation at peak grow-out: ~3% to 4% of total biomass daily
  const peakFeedKgPerDay = ((estimatedHarvestBiomassKg * 0.035)).toFixed(1);

  // Suggested product tier based on volume & scale
  let recommendedProduct = products[1] || products[0]; // Standard Grow-out by default
  if (recommendedFingerlings >= 8000) {
    recommendedProduct = products[0] || products[1]; // Starter for large commercial nursery
  } else if (targetHarvestWeight >= 450 || volumeM3 <= 10) {
    recommendedProduct = products[2] || products[1]; // Advance Stocker for fast small tanks
  }

  const handleApply = () => {
    if (onApplyToInquiry) {
      onApplyToInquiry(
        recommendedFingerlings,
        recommendedProduct.name,
        recommendedProduct.sizeInches
      );
    } else if (navigate) {
      // Store in session storage so order page can pick it up
      sessionStorage.setItem('mf_calc_qty', String(recommendedFingerlings));
      sessionStorage.setItem('mf_calc_prod_id', recommendedProduct.id);
      sessionStorage.setItem('mf_calc_size', recommendedProduct.sizeInches);
      navigate('/inquiry');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div id="calculator" className="scroll-mt-24 rounded-3xl bg-gradient-to-b from-sky-50/70 to-white dark:from-slate-900/90 dark:to-slate-950 border border-sky-100 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
      {/* Background ambient water glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header */}
      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 mb-3">
          <Calculator className="w-3.5 h-3.5" />
          <span>Aquaculture Engineering Tool</span>
        </div>
        <h2 className="font-outfit text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t('tankCalculatorTitle')}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">
          {t('tankCalculatorSub')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tank Shape Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              {t('calculatorShape')}
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'circular', label: 'Circular HDPE / Tarpaulin Tank', desc: 'Common biofloc setup' },
                { id: 'rectangular', label: 'Rectangular Concrete Tank', desc: 'Masonry / lined pond' },
                { id: 'earthen', label: 'Earthen Pond / Hapa Net', desc: 'Traditional pond culture' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTankShape(item.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    tankShape === item.id
                      ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/60 ring-2 ring-sky-500/20 text-slate-900 dark:text-white font-semibold'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span className="block text-xs font-bold leading-tight">{item.label}</span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
                    {item.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Dimension Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs">
            {tankShape === 'circular' ? (
              <>
                <div className="sm:col-span-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Tank Diameter (meters)</span>
                    <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{diameter.toFixed(1)} m</span>
                  </div>
                  <input
                    type="range"
                    min="1.5"
                    max="12.0"
                    step="0.5"
                    value={diameter}
                    onChange={(e) => setDiameter(parseFloat(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>1.5m</span>
                    <span>6m</span>
                    <span>12m</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>{t('calculatorDepth')}</span>
                    <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{waterDepth.toFixed(1)} m</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={waterDepth}
                    onChange={(e) => setWaterDepth(parseFloat(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>0.5m</span>
                    <span>2.0m</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>{t('calculatorLength')}</span>
                    <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{length.toFixed(1)} m</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="30"
                    step="1"
                    value={length}
                    onChange={(e) => setLength(parseFloat(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400">2m - 30m</span>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>{t('calculatorWidth')}</span>
                    <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{width.toFixed(1)} m</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    step="1"
                    value={width}
                    onChange={(e) => setWidth(parseFloat(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400">2m - 20m</span>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>{t('calculatorDepth')}</span>
                    <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{waterDepth.toFixed(1)} m</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={waterDepth}
                    onChange={(e) => setWaterDepth(parseFloat(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400">0.5m - 2.5m</span>
                </div>
              </>
            )}
          </div>

          {/* Aeration & Management Intensity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Aeration &amp; Water Management
              </label>
              <select
                value={aerationType}
                onChange={(e) => setAerationType(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 cursor-pointer"
              >
                <option value="moderate">Moderate / Low Aeration (40-60 pcs/m³)</option>
                <option value="intensive">Intensive Blower / Venturi (80-120 pcs/m³)</option>
                <option value="biofloc">Advanced High-Density Biofloc (140-180 pcs/m³)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                {t('calculatorTargetHarvest')}
              </label>
              <select
                value={targetHarvestWeight}
                onChange={(e) => setTargetHarvestWeight(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 cursor-pointer"
              >
                <option value="250">250g - Table Size (Fastest 80-90 days)</option>
                <option value="300">300g - 350g (Premier Market Standard)</option>
                <option value="400">400g - 450g (Heavy Market Cut)</option>
                <option value="500">500g+ (Large Jumbo Restaurant Cut)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Output Panel (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-sky-900 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg relative border border-sky-800">
          <div className="flex items-center justify-between pb-4 border-b border-sky-800/80">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
              Calculation Output
            </span>
            <span className="text-xs text-slate-300 flex items-center gap-1 font-mono">
              <Waves className="w-3.5 h-3.5 text-sky-400" />
              {volumeLiters.toLocaleString()} Liters ({volumeM3.toFixed(1)} m³)
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {/* Big Main Metric: Recommended Stocking Pieces */}
            <div>
              <span className="text-xs text-sky-200 block font-medium">
                {t('calculatorStockingQty')}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-outfit text-4xl sm:text-5xl font-black tracking-tight text-white">
                  {recommendedFingerlings.toLocaleString()}
                </span>
                <span className="text-sky-400 font-semibold text-sm sm:text-base">
                  pcs
                </span>
              </div>
              <p className="text-[11px] text-sky-200/80 mt-0.5">
                Calibrated for {expectedSurvivalPercent}% nursery survival rate.
              </p>
            </div>

            {/* Sub-Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-sky-800/60">
              <div className="bg-sky-950/70 p-3 rounded-xl border border-sky-800/40">
                <span className="text-[11px] text-sky-300 block font-medium">
                  {t('calculatorFingerlingSize')}
                </span>
                <span className="text-sm font-bold text-white block mt-0.5">
                  {recommendedProduct.sizeCategory}
                </span>
                <span className="text-[10px] text-sky-300/80 font-mono">
                  {recommendedProduct.sizeInches}
                </span>
              </div>

              <div className="bg-sky-950/70 p-3 rounded-xl border border-sky-800/40">
                <span className="text-[11px] text-sky-300 block font-medium">
                  Est. Harvest Biomass
                </span>
                <span className="text-sm font-bold text-white block mt-0.5">
                  ~{estimatedHarvestBiomassKg.toLocaleString()} Kg
                </span>
                <span className="text-[10px] text-sky-300/80">
                  @ {targetHarvestWeight}g avg weight
                </span>
              </div>

              <div className="bg-sky-950/70 p-3 rounded-xl border border-sky-800/40">
                <span className="text-[11px] text-sky-300 block font-medium">
                  {t('calculatorFeedPerDay')}
                </span>
                <span className="text-sm font-bold text-white block mt-0.5">
                  ~{peakFeedKgPerDay} Kg / day
                </span>
                <span className="text-[10px] text-sky-300/80">
                  at 3.5% body weight
                </span>
              </div>

              <div className="bg-sky-950/70 p-3 rounded-xl border border-sky-800/40">
                <span className="text-[11px] text-sky-300 block font-medium">
                  Water Exchange
                </span>
                <span className="text-sm font-bold text-white block mt-0.5">
                  {aerationType === 'biofloc' ? 'Zero-Exchange' : '20% every 3 days'}
                </span>
                <span className="text-[10px] text-sky-300/80">
                  Bottom drain siphoning
                </span>
              </div>
            </div>

            {/* Quick Action Button: Transfer directly into Order Inquiry */}
            <button
              onClick={handleApply}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm text-slate-900 bg-gradient-to-r from-amber-300 to-sky-300 hover:from-amber-200 hover:to-sky-200 active:scale-[0.99] shadow-md transition-all cursor-pointer"
            >
              <span>{t('calculatorApplyInquiry')}</span>
              <ArrowRight className="w-4 h-4 text-slate-900" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
