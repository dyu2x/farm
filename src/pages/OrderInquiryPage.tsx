import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { OrderInquiry } from '../types';
import confetti from 'canvas-confetti';
import {
  ClipboardList,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Info,
} from 'lucide-react';

interface OrderInquiryPageProps {
  navigate: (path: string) => void;
}

export const OrderInquiryPage: React.FC<OrderInquiryPageProps> = ({ navigate }) => {
  const { products, addInquiry, settings, t } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    province: 'Bataan',
    farmLocation: '',
    productId: products[1]?.id || products[0]?.id || '',
    sizePreference: products[1]?.sizeInches || '2.5 - 3.5 inches',
    quantity: 3000,
    farmingSetup: 'Circular HDPE Biofloc Tank',
    targetDeliveryDate: '',
    notes: '',
  });

  const [submittedInquiry, setSubmittedInquiry] = useState<OrderInquiry | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Check if session storage has calculated values from Calculator or Catalog
  useEffect(() => {
    const savedQty = sessionStorage.getItem('mf_calc_qty');
    const savedProdId = sessionStorage.getItem('mf_calc_prod_id');
    const savedSize = sessionStorage.getItem('mf_calc_size');

    if (savedQty || savedProdId) {
      setFormData((prev) => ({
        ...prev,
        quantity: savedQty ? parseInt(savedQty, 10) : prev.quantity,
        productId: savedProdId || prev.productId,
        sizePreference: savedSize || prev.sizePreference,
      }));
      // Clear session keys after consumption
      sessionStorage.removeItem('mf_calc_qty');
      sessionStorage.removeItem('mf_calc_prod_id');
      sessionStorage.removeItem('mf_calc_size');
    }
  }, []);

  const selectedProduct = products.find((p) => p.id === formData.productId) || products[0];

  // Tier pricing calculation for the form
  const getTierEstimate = (qty: number) => {
    if (!selectedProduct || !selectedProduct.pricingTiers) return { rate: 3.5, label: '' };
    const tier = selectedProduct.pricingTiers.find(
      (t) => qty >= t.minQty && (t.maxQty === null || qty <= t.maxQty)
    );
    if (tier) return { rate: tier.pricePerPiece, label: tier.label };
    return { rate: selectedProduct.pricingTiers[0].pricePerPiece, label: 'Standard Rate' };
  };

  const currentTier = getTierEstimate(formData.quantity);
  const estimatedTotal = Math.round(formData.quantity * currentTier.rate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const newInquiry: OrderInquiry = {
      id: 'INQ-' + Date.now().toString().slice(-6),
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      province: formData.province,
      farmLocation: formData.farmLocation,
      productId: formData.productId,
      productName: selectedProduct?.name || 'Clarias batrachus Fingerlings',
      sizePreference: formData.sizePreference,
      quantity: formData.quantity,
      farmingSetup: formData.farmingSetup,
      targetDeliveryDate: formData.targetDeliveryDate || new Date().toISOString().split('T')[0],
      notes: formData.notes,
      estimatedTotalPhp: estimatedTotal,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    // Save to context / persistence
    addInquiry(newInquiry);

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setSubmittedInquiry(newInquiry);
    setSubmitting(false);
  };

  return (
    <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300">
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Direct Commercial Booking</span>
        </div>
        <h1 className="font-outfit text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Hatchery Stock Booking &amp; Inquiry
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Submit your stocking schedule. Our farm supervisor will verify haul route oxygen capacity and confirm your preferred pickup or oxygenated delivery dispatch date.
        </p>
      </div>

      {submittedInquiry ? (
        /* Confirmation Success Card */
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-800 shadow-xl text-center max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Booking Received Successfully
            </span>
            <h2 className="font-outfit text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Thank You, {submittedInquiry.fullName}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
              Your inquiry reference number is{' '}
              <span className="font-mono font-bold text-sky-600 dark:text-sky-400 text-sm">
                #{submittedInquiry.id}
              </span>
              . Our logistics coordinator will call you at{' '}
              <span className="font-semibold text-slate-900 dark:text-white">
                {submittedInquiry.phone}
              </span>{' '}
              within 24 hours.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 text-left text-xs space-y-2 border border-slate-200 dark:border-slate-600 font-medium">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Selected Product:</span>
              <span className="text-slate-900 dark:text-white font-semibold">
                {submittedInquiry.productName} ({submittedInquiry.sizePreference})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Quantity:</span>
              <span className="text-slate-900 dark:text-white font-mono font-bold">
                {submittedInquiry.quantity.toLocaleString()} pcs
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Target Delivery Date:</span>
              <span className="text-slate-900 dark:text-white font-mono">
                {submittedInquiry.targetDeliveryDate}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Destination:</span>
              <span className="text-slate-900 dark:text-white">
                {submittedInquiry.farmLocation}, {submittedInquiry.province}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-600">
              <span className="text-slate-500 dark:text-slate-400">Estimated Total:</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold font-mono text-sm">
                ₱{submittedInquiry.estimatedTotalPhp.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Urgent Hotline notice */}
          <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-xs text-sky-900 dark:text-sky-200 flex items-center justify-center gap-3">
            <Phone className="w-4 h-4 text-sky-600" />
            <span>
              Need urgent stock for immediate delivery? Call{' '}
              <a href={`tel:${settings.supportPhone.replace(/\s+/g, '')}`} className="font-bold underline">
                {settings.supportPhone}
              </a>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setSubmittedInquiry(null)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white transition-colors cursor-pointer"
            >
              Submit Another Inquiry
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white transition-colors cursor-pointer"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      ) : (
        /* Order Form */
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Main Form Fields (8 cols) */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs space-y-6">
            <h3 className="font-outfit font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <span>Farmer &amp; Stocking Details</span>
            </h3>

            {/* Row 1: Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Full Name / Farm Owner *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Juan dela Cruz"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Contact Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+63 9XX XXX XXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Row 2: Email & Province */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Farm Province *
                </label>
                <select
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none cursor-pointer"
                >
                  <option value="Bataan">Bataan (Local Farm Hub - Hermosa)</option>
                  <option value="Pampanga">Pampanga</option>
                  <option value="Bulacan">Bulacan</option>
                  <option value="Nueva Ecija">Nueva Ecija</option>
                  <option value="Tarlac">Tarlac</option>
                  <option value="Zambales">Zambales</option>
                  <option value="Pangasinan">Pangasinan</option>
                  <option value="Batangas">Batangas</option>
                  <option value="Cavite">Cavite</option>
                  <option value="Laguna">Laguna</option>
                  <option value="Rizal">Rizal</option>
                  <option value="Quezon">Quezon</option>
                  <option value="Other / Visayas / Mindanao Air Freight">Other / Air-freight Route</option>
                </select>
              </div>
            </div>

            {/* Farm Exact Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Farm Barangay &amp; Street Location *
              </label>
              <input
                type="text"
                required
                value={formData.farmLocation}
                onChange={(e) => setFormData({ ...formData, farmLocation: e.target.value })}
                placeholder="Barangay, Municipality / Landmark for hauling truck dispatch"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            {/* Product & Size Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-700">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Select Size Grade *
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) => {
                    const prod = products.find((p) => p.id === e.target.value);
                    setFormData({
                      ...formData,
                      productId: e.target.value,
                      sizePreference: prod?.sizeInches || formData.sizePreference,
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none cursor-pointer"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.sizeInches} ({p.sizeCategory})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Quantity Required (pcs) *
                </label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  required
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: Math.max(100, parseInt(e.target.value || '0', 10)),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono font-bold"
                />
              </div>
            </div>

            {/* Culture System & Target Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Culture Setup / Pond Type
                </label>
                <select
                  value={formData.farmingSetup}
                  onChange={(e) => setFormData({ ...formData, farmingSetup: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none cursor-pointer"
                >
                  <option value="Circular HDPE Biofloc Tank">Circular HDPE Biofloc Tank</option>
                  <option value="Rectangular Concrete Tank">Rectangular Concrete Tank</option>
                  <option value="Earthen Pond with Inflow">Earthen Pond with Inflow</option>
                  <option value="Hapa Net Nursery Pen">Hapa Net Nursery Pen</option>
                  <option value="Backyard Tarpaulin Setup">Backyard Tarpaulin Setup</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Target Stocking / Delivery Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.targetDeliveryDate}
                  onChange={(e) => setFormData({ ...formData, targetDeliveryDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Special Requests / Technical Questions
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Indicate if you will do on-farm pickup or require oxygenated hauling dispatch to your farm gates..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Right Summary & Submission Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block border-b border-slate-800 pb-3">
                Live Pricing Estimate
              </span>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Selected Grade:</span>
                  <span className="font-bold text-white text-right">
                    {selectedProduct.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Standard Size:</span>
                  <span className="font-mono text-sky-300">{formData.sizePreference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Quantity:</span>
                  <span className="font-mono font-bold text-white">
                    {formData.quantity.toLocaleString()} pcs
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tier Unit Price:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    ₱{currentTier.rate.toFixed(2)} / pc
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-slate-200">Total Estimate:</span>
                  <span className="text-2xl font-black text-amber-300 font-mono">
                    ₱{estimatedTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Guarantees */}
              <div className="space-y-2 pt-4 border-t border-slate-800 text-[11px] text-slate-300">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-sky-400" />
                  <span>Oxygen-injected double-bag packing</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+2% free contingency count per box</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>No fish feeds sold (Nursery fingerlings only)</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-slate-900 bg-gradient-to-r from-amber-300 to-sky-300 hover:from-amber-200 hover:to-sky-200 active:scale-[0.98] shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{submitting ? 'Submitting...' : 'Submit Booking Inquiry'}</span>
                <ArrowRight className="w-4 h-4 text-slate-900" />
              </button>
            </div>

            {/* Direct Phone Support Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <span className="font-bold text-slate-900 dark:text-white block">
                Prefer Booking Directly by Phone?
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                You can reach our hatchery desk Monday to Friday during nursery operating hours:
              </p>
              <a
                href={`tel:${settings.supportPhone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 font-bold text-sky-600 dark:text-sky-400 hover:underline pt-1 text-sm font-mono"
              >
                <Phone className="w-4 h-4" />
                <span>{settings.supportPhone}</span>
              </a>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
