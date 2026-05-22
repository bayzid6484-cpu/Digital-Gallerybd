import React, { useState, useEffect } from 'react';
import { useAppState } from '../lib/state';
import { 
  Search, Grid, Clock, Sparkles, AlertCircle, ShoppingBag, 
  HelpCircle, CreditCard, Wallet, Percent, Check
} from 'lucide-react';

interface ServicesViewProps {
  selectedCategoryId: string;
  setSelectedCategoryId: (catId: string) => void;
  selectedServiceId: string;
  setSelectedServiceId: (srvId: string) => void;
  setTab: (tab: string) => void;
  setPendingOrder: (order: any) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ 
  selectedCategoryId, setSelectedCategoryId,
  selectedServiceId, setSelectedServiceId,
  setTab, setPendingOrder
}) => {
  const { categories, services, lang, t, currentUser, settings, applyCoupon } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  
  // Ordering fields
  const [targetLink, setTargetLink] = useState('');
  const [quantity, setQuantity] = useState<number>(0);
  const [guestEmail, setGuestEmail] = useState('');
  const [orderNote, setOrderNote] = useState('');
  
  // Pricing & Coupons
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  const activeService = services.find(s => s.id === selectedServiceId);

  // Set initial quantities when active service shifts
  useEffect(() => {
    if (activeService) {
      setQuantity(activeService.minQuantity);
      setTargetLink('');
      setCouponCode('');
      setAppliedCoupon(null);
      setDiscountAmount(0);
      setCouponError('');
    }
  }, [selectedServiceId]);

  // Set default category on startup if none is selected
  useEffect(() => {
    if (!selectedCategoryId && categories.length > 0) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  // Filter services by category & search query
  const filteredServices = services.filter(srv => {
    const matchesCategory = srv.categoryId === selectedCategoryId;
    const matchesSearch = searchQuery === '' || 
      srv.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
      srv.nameBn.includes(searchQuery) ||
      srv.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.descriptionBn.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const basePrice = activeService ? (quantity * activeService.pricePerUnit) : 0;
  const finalPrice = Math.max(0, Number((basePrice - discountAmount).toFixed(2)));

  const handleApplyCoupon = () => {
    if (!couponCode) return;
    const res = applyCoupon(couponCode, basePrice);
    if (res.error) {
      setCouponError(res.error);
      setAppliedCoupon(null);
      setDiscountAmount(0);
    } else {
      setCouponError('');
      const matchedCoupon = settings.promoBanner && couponCode.toUpperCase() === 'BOOST50' ? { code: 'BOOST50', discountPercent: 10 } : { code: couponCode.toUpperCase(), discountPercent: 20 };
      setAppliedCoupon(matchedCoupon);
      setDiscountAmount(res.discount);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeService) return;

    // Checks
    if (quantity < activeService.minQuantity || quantity > activeService.maxQuantity) {
      alert(t.orderLimitError.replace('%min%', activeService.minQuantity.toString()).replace('%max%', activeService.maxQuantity.toString()));
      return;
    }

    if (!targetLink) {
      alert(lang === 'bn' ? 'অনুগ্রহ করে টার্গেট লিংক প্রবেশ করান।' : 'Target URL link is required.');
      return;
    }

    if (!currentUser && !guestEmail) {
      alert(lang === 'bn' ? 'গেস্ট ইমেল আবশ্যিক।' : 'Email is required for Guest checkout.');
      return;
    }

    // Capture the configuring order details and save temporarily for the payment/checkout viewport
    const pendingOrderObj = {
      serviceId: activeService.id,
      categoryId: activeService.categoryId,
      quantity,
      targetLink,
      totalPrice: finalPrice,
      orderNote,
      guestEmail: currentUser ? undefined : guestEmail,
      couponCode: appliedCoupon?.code
    };

    setPendingOrder(pendingOrderObj);
    setTab('checkout');
  };

  return (
    <div id="services-parent-view" className="space-y-10 pb-12">
      {/* Search Header banner */}
      <section id="services-header" className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-white to-white border border-gray-150 flex flex-col md:flex-row md:items-center md:justify-between gap-6 dark:from-emerald-950/15 dark:via-gray-900 dark:to-gray-900 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-500" />
            <span>{lang === 'bn' ? 'সকল ডিজিটাল সার্ভিসেস' : 'Premium SMM & Digital Services'}</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            {lang === 'bn' ? 'আমাদের অত্যন্ত চমৎকার ও নিরাপদ সার্ভিস খুজে অর্ডার করুন' : 'Explore automated web and social engagement triggers'}
          </p>
        </div>

        {/* Search input bar */}
        <div className="relative max-w-sm w-full shrink-0">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            id="service-search-input"
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-250 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 dark:bg-gray-800 dark:border-gray-750 dark:text-gray-100"
          />
        </div>
      </section>

      {/* Main Grid: Left sidebar categories, Center services, Right Order Configure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Categories Lists (SaaS class selection) */}
        <div id="categories-sidebar" className="lg:col-span-3 space-y-3 lg:sticky lg:top-4 overflow-x-auto flex lg:flex-col gap-2 p-1.5 lg:p-0">
          <span className="hidden lg:block text-xs font-bold font-mono text-gray-400 uppercase tracking-wider pl-2">
            {t.navCategories}
          </span>
          {categories.map((cat) => {
            const isActive = cat.id === selectedCategoryId;
            return (
              <button
                key={cat.id}
                id={`cat-tab-btn-${cat.id}`}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`cursor-pointer whitespace-nowrap text-left px-4 py-3 rounded-xl transition-all text-sm font-semibold flex items-center gap-2.5 shrink-0 ${
                  isActive 
                    ? 'bg-emerald-500 text-white shadow-sm' 
                    : 'bg-white border border-gray-150 text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700/60 dark:text-gray-300 dark:hover:bg-gray-750'
                }`}
              >
                <Grid className="w-4 h-4 shrink-0" />
                <span>{lang === 'bn' ? cat.nameBn : cat.nameEn}</span>
              </button>
            );
          })}
        </div>

        {/* Center: Services grid list */}
        <div id="services-scroller-panel" className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pl-1">
            <span className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">
              {t.servicesInCat.replace('%cat%', categories.find(c => c.id === selectedCategoryId) ? (lang === 'bn' ? categories.find(c => c.id === selectedCategoryId)!.nameBn : categories.find(c => c.id === selectedCategoryId)!.nameEn) : '')}
            </span>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full font-bold dark:bg-gray-800 dark:text-gray-400">
              {filteredServices.length} {lang === 'bn' ? 'টি সার্ভিস' : 'Available'}
            </span>
          </div>

          {filteredServices.length === 0 ? (
            <div className="p-8 text-center bg-white border border-gray-150 rounded-2xl dark:bg-gray-800 dark:border-gray-700">
              <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.noServicesFound}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredServices.map((srv) => {
                const isActive = srv.id === selectedServiceId;
                return (
                  <div
                    key={srv.id}
                    id={`service-list-card-${srv.id}`}
                    onClick={() => setSelectedServiceId(srv.id)}
                    className={`cursor-pointer p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                      isActive 
                        ? 'bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-white border-emerald-500 shadow-sm dark:from-emerald-950/20 dark:via-gray-850 dark:to-gray-900' 
                        : 'bg-white border-gray-150 hover:border-gray-300 shadow-2xs hover:shadow-xs dark:bg-gray-800 dark:border-gray-700/80 dark:hover:border-gray-650'
                    }`}
                  >
                    {srv.featured && (
                      <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-bl-lg flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Featured</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug pr-12">
                        {lang === 'bn' ? srv.nameBn : srv.nameEn}
                      </h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                        {lang === 'bn' ? srv.descriptionBn : srv.descriptionEn}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50 text-[11px] text-gray-400 font-mono">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{lang === 'bn' ? srv.deliveryTimeBn : srv.deliveryTimeEn}</span>
                      </div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-bold font-mono text-sm">
                        {settings.currencySymbol}{(srv.pricePerUnit * 1000).toFixed(0)} <span className="text-[10px] font-normal text-gray-400">/ ১০০০টি</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Interactive Order Form Configure (SaaS pricing calculations) */}
        <div id="service-order-form-container" className="lg:col-span-4 lg:sticky lg:top-4">
          {activeService ? (
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
                <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md dark:bg-emerald-950/40 dark:text-emerald-300">
                  {t.orderFormTitle}
                </span>
                <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug mt-2">
                  {lang === 'bn' ? activeService.nameBn : activeService.nameEn}
                </h3>
              </div>

              <form id="active-order-form" onSubmit={handlePlaceOrder} className="space-y-4">
                {/* Target Link input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {lang === 'bn' ? activeService.inputTypeLabelBn : activeService.inputTypeLabelEn} *
                  </label>
                  <input
                    id="order-link-input"
                    type="url"
                    required
                    placeholder={lang === 'bn' ? activeService.inputTypePlaceholderBn : activeService.inputTypePlaceholderEn}
                    value={targetLink}
                    onChange={(e) => setTargetLink(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-xs tracking-tight bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/40 dark:bg-gray-750 dark:border-gray-700 dark:text-white"
                  />
                </div>

                {/* Range constraints indicator */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {t.quantityLabel} *
                    </label>
                    <input
                      id="order-qty-input"
                      type="number"
                      required
                      min={activeService.minQuantity}
                      max={activeService.maxQuantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-xs font-mono bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/40 dark:bg-gray-750 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  
                  {/* Min max indicators */}
                  <div className="flex flex-col justify-center text-[10px] text-gray-400 font-mono mt-5">
                    <div>{lang === 'bn' ? 'সর্বনিম্ন:' : 'Min:'} {activeService.minQuantity}</div>
                    <div>{lang === 'bn' ? 'সর্বোচ্চ:' : 'Max:'} {activeService.maxQuantity}</div>
                  </div>
                </div>

                {/* Guest Account Info */}
                {!currentUser && (
                  <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-lg space-y-1.5">
                    <span className="block text-[10px] text-amber-600 dark:text-amber-400 leading-snug">
                      ⚠️ {t.guestNotice}
                    </span>
                    <input
                      id="guest-email-input"
                      type="email"
                      required
                      placeholder={t.guestEmailLabel}
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/40 dark:bg-gray-750 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                )}

                {/* Optional note comments */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {t.additionalNote}
                  </label>
                  <textarea
                    id="order-note-input"
                    rows={2}
                    placeholder={lang === 'bn' ? 'যেকোনো বিশেষ নির্দেশনা...' : 'Username instructions, speed choice...'}
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/40 dark:bg-gray-750 dark:border-gray-700 dark:text-white"
                  />
                </div>

                {/* Coupon verification slot */}
                <div className="pt-2 border-t border-gray-150/60 mt-2 space-y-2">
                  <span className="block text-[11px] font-semibold text-gray-500">
                    {lang === 'bn' ? 'প্রোমো কোড / কুপন কিয়স্ক' : 'Coupon Promo Code'}
                  </span>
                  <div className="flex gap-2">
                    <input
                      id="coupon-apply-input"
                      type="text"
                      placeholder="e.g. BOOST50"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg font-mono text-xs uppercase dark:bg-gray-750 dark:border-gray-700 dark:text-white"
                    />
                    <button
                      id="coupon-apply-btn"
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors dark:bg-gray-750 dark:border-gray-700 dark:text-gray-300"
                    >
                      {lang === 'bn' ? 'প্রয়োগ করুন' : 'Apply'}
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-rose-500 font-semibold">{couponError}</p>}
                  {appliedCoupon && (
                    <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>{appliedCoupon.code} matches with -{appliedCoupon.discountPercent}% flat!</span>
                    </p>
                  )}
                </div>

                {/* Final calculated output */}
                <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{lang === 'bn' ? 'নিয়মিত মূল্য:' : 'Regular base price:'}</span>
                    <span className="font-mono">{settings.currencySymbol}{basePrice.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-xs text-emerald-600 font-bold">
                      <span>{lang === 'bn' ? 'ডিসকাউন্টের পরিমাণ:' : 'Discount applied:'}</span>
                      <span className="font-mono">-{settings.currencySymbol}{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1 border-t border-gray-200/50 dark:border-gray-700">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{t.estimatedPrice}</span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
                      {settings.currencySymbol}{finalPrice}
                    </span>
                  </div>
                </div>

                {currentUser && currentUser.walletBalance < finalPrice && (
                  <div id="insufficient-funds-banner" className="pt-1.5 text-center">
                    <span className="text-[10px] text-rose-500 font-bold block mb-1">
                      ⚠️ {t.walletBalanceError}
                    </span>
                    <button
                      id="order-recharge-short-cta"
                      type="button"
                      onClick={() => setTab('dashboard')}
                      className="text-xs font-semibold text-emerald-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Wallet className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'এক্ষুণি ব্যালেন্স রিচার্জ করুন' : 'Top up wallet now'}</span>
                    </button>
                  </div>
                )}

                <button
                  id="checkout-trigger-btn"
                  type="submit"
                  className="w-full cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 rounded-xl transition-all shadow-md text-sm"
                >
                  {t.placeOrderBtn}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white border border-gray-150 rounded-2xl p-8 text-center text-gray-400 dark:bg-gray-800 dark:border-gray-700">
              <HelpCircle className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-xs leading-relaxed">
                {lang === 'bn' ? 'যেকোনো সার্ভিস সিলেক্ট করার পর কুপন, নির্দেশনাবলী এবং চেকআউট সেশন এখানে লোড হবে' : 'Select a digital service package to load the automated rate configurator and checklist'}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
