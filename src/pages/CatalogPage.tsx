import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { FingerlingProduct } from '../types';
import {
  Fish,
  Search,
  Calculator,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

interface CatalogPageProps {
  navigate: (path: string) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ navigate }) => {
  const { products, t, searchQuery, setSearchQuery } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<FingerlingProduct | null>(null);
  const [activeImageIndexes, setActiveImageIndexes] = useState<Record<string, number>>({});

  // Quantity calculator modal / panel state
  const [calcQty, setCalcQty] = useState<number>(3000);
  const [calcTargetProductId, setCalcTargetProductId] = useState<string>(
    products[1]?.id || products[0]?.id || ''
  );

  // Filter products by search query and active status
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => {
      if (!p.isActive) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sizeCategory.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sizeInches.toLowerCase().includes(q)
      );
    });
  }, [products, searchQuery]);

  const activeCalcProduct = products.find((p) => p.id === calcTargetProductId) || products[0];

  // Calculate pricing tier for calculated quantity
  const calculateTierPrice = (product: FingerlingProduct, qty: number) => {
    if (!product || !product.pricingTiers || product.pricingTiers.length === 0) {
      return { pricePerPc: 3.5, label: 'Standard Rate' };
    }
    // Find matching tier
    const matched = product.pricingTiers.find(
      (tier) => qty >= tier.minQty && (tier.maxQty === null || qty <= tier.maxQty)
    );
    if (matched) {
      return { pricePerPc: matched.pricePerPiece, label: matched.label };
    }
    // If lower than min, use first tier
    if (qty < product.pricingTiers[0].minQty) {
      return { pricePerPc: product.pricingTiers[0].pricePerPiece, label: 'Minimum Batch' };
    }
    // Else use highest volume tier
    const last = product.pricingTiers[product.pricingTiers.length - 1];
    return { pricePerPc: last.pricePerPiece, label: last.label };
  };

  const currentCalcPrice = activeCalcProduct
    ? calculateTierPrice(activeCalcProduct, calcQty)
    : { pricePerPc: 3.5, label: '' };
  const totalEstimatedPhp = Math.round(calcQty * currentCalcPrice.pricePerPc);

  // Image slideshow controls per card
  const handleNextImage = (productId: string, totalImages: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndexes((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages,
    }));
  };

  const handlePrevImage = (productId: string, totalImages: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndexes((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) === 0 ? totalImages - 1 : (prev[productId] || 0) - 1,
    }));
  };

  const handleOrderThisProduct = (product: FingerlingProduct, quantity?: number) => {
    sessionStorage.setItem('mf_calc_prod_id', product.id);
    sessionStorage.setItem('mf_calc_size', product.sizeInches);
    if (quantity) {
      sessionStorage.setItem('mf_calc_qty', String(quantity));
    }
    navigate('/inquiry');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300">
          <Fish className="w-3.5 h-3.5" />
          <span>Clarias batrachus Live Fingerlings</span>
        </div>
        <h1 className="font-outfit text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Commercial Fingerling Catalog
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Select from our graded nursery stages. Each batch is conditioned in pure, deep-well aerated water, hormone-bred for health, and guaranteed uniform size.
        </p>
      </div>

      {/* Search Bar & Quick Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search size, inches, or growth stage..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Showing {filteredProducts.length} sizes available for hauling</span>
        </div>
      </div>

      {/* Catalog Quantity Calculator Bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-900 via-slate-900 to-sky-950 text-white shadow-lg border border-sky-800">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1 max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Calculator className="w-4 h-4" />
              Batch Tier Pricing Calculator
            </span>
            <h3 className="font-outfit text-xl font-bold text-white">
              Instant Volume Discount Estimator
            </h3>
            <p className="text-xs text-sky-200/80">
              Enter your desired stocking piece count to see automated wholesale tier discounts.
            </p>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-sky-200 uppercase mb-1">
                Select Size Category
              </label>
              <select
                value={calcTargetProductId}
                onChange={(e) => setCalcTargetProductId(e.target.value)}
                className="w-full sm:w-48 px-3 py-2 text-xs rounded-xl bg-slate-800 border border-sky-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sizeInches})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-sky-200 uppercase mb-1">
                Quantity (pcs)
              </label>
              <input
                type="number"
                min="500"
                step="500"
                value={calcQty}
                onChange={(e) => setCalcQty(Math.max(100, parseInt(e.target.value || '0', 10)))}
                className="w-full sm:w-36 px-3 py-2 text-xs font-mono font-bold rounded-xl bg-slate-800 border border-sky-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div className="sm:border-l sm:border-sky-800 sm:pl-4 flex flex-col justify-center">
              <span className="text-[11px] text-sky-300">Total Est. Price</span>
              <span className="text-xl font-black text-amber-300 font-mono">
                ₱{totalEstimatedPhp.toLocaleString()}
              </span>
              <span className="text-[10px] text-sky-200">
                (₱{currentCalcPrice.pricePerPc.toFixed(2)} / pc)
              </span>
            </div>

            <button
              onClick={() => handleOrderThisProduct(activeCalcProduct, calcQty)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-950 bg-sky-300 hover:bg-sky-200 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap self-end sm:self-center"
            >
              <span>Transfer to Inquiry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProducts.map((product) => {
          const activeImgIdx = activeImageIndexes[product.id] || 0;
          const currentImg = product.images[activeImgIdx] || product.images[0];
          const isLowStock = product.stockCount <= product.lowStockThreshold;

          return (
            <div
              key={product.id}
              className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              {/* Product Image Slideshow Header with RELOCATED INVENTORY STOCK BADGE (Top Header, completely separated from tier pricing) */}
              <div className="relative aspect-16/10 bg-slate-900 overflow-hidden group">
                <img
                  src={currentImg}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Top Overlay Badge Bar: Clean Relocated Inventory Count (Does not overlap with tier pricing below) */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
                  {/* Clarias batrachus species pill */}
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-950/80 text-white backdrop-blur-xs border border-white/20">
                    <em>{product.scientificName}</em>
                  </span>

                  {/* Relocated Inventory Stock Status Pill */}
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-xs flex items-center gap-1.5 ${
                      isLowStock
                        ? 'bg-amber-500/90 text-white'
                        : 'bg-emerald-600/90 text-white'
                    }`}
                  >
                    {isLowStock ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>
                      Stock: {product.stockCount.toLocaleString()} pcs
                    </span>
                  </div>
                </div>

                {/* Multiple Image Navigation on Card */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => handlePrevImage(product.id, product.images.length, e)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-xs transition-colors cursor-pointer"
                      aria-label="Previous Image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleNextImage(product.id, product.images.length, e)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-xs transition-colors cursor-pointer"
                      aria-label="Next Image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Image indicator dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
                      {product.images.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-1.5 rounded-full transition-all ${
                            idx === activeImgIdx ? 'w-4 bg-sky-400' : 'w-1.5 bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Product Info Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h2 className="font-outfit font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
                        {product.name}
                      </h2>
                      <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 font-mono">
                        {product.sizeInches} ({product.sizeCm})
                      </span>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                      {product.sizeCategory}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {product.description}
                  </p>

                  {/* Nursery Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-slate-100 dark:border-slate-700/80 mb-5">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Nursery Age:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {product.nurseryDays}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Survival Rate:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {product.survivalRate}
                      </span>
                    </div>
                  </div>

                  {/* Clean Tier Pricing Table (Un-obscured and clean) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-sky-600" />
                        {t('tierPricing')}
                      </span>
                      <span className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">
                        Volume Discounted
                      </span>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                          <tr>
                            <th className="py-2 px-3">Order Quantity Bracket</th>
                            <th className="py-2 px-3 text-right">Price per Fingerling</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                          {product.pricingTiers.map((tier) => (
                            <tr
                              key={tier.id}
                              className="hover:bg-sky-50/40 dark:hover:bg-slate-700/30 transition-colors"
                            >
                              <td className="py-2 px-3 font-medium text-slate-700 dark:text-slate-300">
                                {tier.label}
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-bold text-sky-600 dark:text-sky-400">
                                ₱{tier.pricePerPiece.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-2">
                  <button
                    onClick={() => handleOrderThisProduct(product)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 shadow-sm hover:shadow transition-all cursor-pointer"
                  >
                    <span>Inquire for {product.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
