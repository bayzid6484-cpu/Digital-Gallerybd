import React, { useState, useEffect } from 'react';
import { useAppState } from '../lib/state';
import { X, Gift, Percent, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PromoPopup: React.FC = () => {
  const { t, coupons, lang } = useAppState();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Show popup after 3 seconds on user initial session load
    const dismissed = sessionStorage.getItem('seba_promo_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('seba_promo_dismissed', 'true');
  };

  const activeCoupon = coupons && coupons[0];

  const handleCopy = () => {
    if (!activeCoupon) return;
    navigator.clipboard.writeText(activeCoupon.code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (!isOpen || !activeCoupon) return null;

  return (
    <AnimatePresence>
      <div id="promo-popup-modal" className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 border border-emerald-500/30 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl overflow-hidden"
        >
          {/* Decorative ambient glowing ring */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>

          <button 
            id="close-promo-btn"
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-center text-center mt-2">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Gift className="w-8 h-8 animate-bounce" />
            </div>

            <h3 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
              {t.couponPromoTitle}
            </h3>

            <p className="text-sm text-gray-300 mt-2 font-medium">
              {t.couponPromoDesc.replace('%percent%', activeCoupon.discountPercent.toString())}
            </p>

            <div className="mt-5 p-4 rounded-xl bg-white/10 border border-white/10 w-full relative">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-mono">
                {t.couponCodeLabel}
              </p>
              
              <div className="flex items-center justify-between gap-2 mt-1 bg-black/40 px-3 py-2 rounded-lg border border-emerald-500/30">
                <span className="font-mono text-xl font-bold tracking-widest text-emerald-400 uppercase">
                  {activeCoupon.code}
                </span>
                
                <button
                  id="copy-code-btn"
                  onClick={handleCopy}
                  className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 font-semibold text-xs text-white px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.copyBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <button
              id="promo-shop-now-btn"
              onClick={handleClose}
              className="mt-6 w-full cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 font-bold py-3 px-4 rounded-xl shadow-lg transition-all"
            >
              {lang === 'bn' ? 'অর্ডার শুরু করুন' : 'Claim Coupon & Order'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
