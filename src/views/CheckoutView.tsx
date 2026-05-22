import React, { useState } from 'react';
import { useAppState } from '../lib/state';
import { 
  CreditCard, Wallet, AlertCircle, ShoppingBag, ShieldCheck, 
  ArrowLeft, Check, Clipboard, CheckCircle2, Ticket
} from 'lucide-react';

interface CheckoutViewProps {
  pendingOrder: {
    serviceId: string;
    categoryId: string;
    quantity: number;
    targetLink: string;
    totalPrice: number;
    orderNote?: string;
    guestEmail?: string;
    couponCode?: string;
  } | null;
  setTab: (tab: string) => void;
  setPendingOrder: (order: any) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ pendingOrder, setTab, setPendingOrder }) => {
  const { 
    currentUser, services, createOrder, submitPayment, 
    lang, t, settings 
  } = useAppState();

  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'bkash' | 'nagad' | 'rocket' | 'manual'>('bkash');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState<string | null>(null);

  const activeService = pendingOrder ? services.find(s => s.id === pendingOrder.serviceId) : null;

  if (!pendingOrder || !activeService) {
    return (
      <div className="max-w-md mx-auto p-8 text-center bg-white border border-gray-150 rounded-2xl dark:bg-gray-800 dark:border-gray-700">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
        <h3 className="font-bold text-gray-900 dark:text-white">{lang === 'bn' ? 'কোনো অর্ডার মুলতুবি নেই!' : 'No pending order draft found'}</h3>
        <p className="text-xs text-gray-500 mt-1">{lang === 'bn' ? 'অনুগ্রহ করে সার্ভিস পেইজ থেকে একটি প্যাকেজ অর্ডার করুন' : 'Please configure a digital service bundle first'}</p>
        <button
          id="checkout-empty-cta-btn"
          onClick={() => setTab('services')}
          className="mt-4 bg-emerald-500 text-white font-semibold text-xs py-2 px-4 rounded-xl cursor-pointer"
        >
          {t.navServices}
        </button>
      </div>
    );
  }

  const userCanPayWithWallet = currentUser && currentUser.walletBalance >= pendingOrder.totalPrice;

  const handlePayWithWallet = () => {
    if (!currentUser || !userCanPayWithWallet) return;

    // Trigger purchase and record in context
    const finalOrder = createOrder({
      userId: currentUser.id,
      serviceId: pendingOrder.serviceId,
      categoryId: pendingOrder.categoryId,
      targetLink: pendingOrder.targetLink,
      quantity: pendingOrder.quantity,
      totalPrice: pendingOrder.totalPrice,
      orderNote: pendingOrder.orderNote,
      status: 'pending' // starts pending validation
    });

    setOrderPlacedSuccess(finalOrder.id);
    setPendingOrder(null);
  };

  const handlePayManualTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderNumber || !transactionId) {
      alert(lang === 'bn' ? 'প্রেরক নাম্বার ও ট্রানজেকশন আইডি প্রবেশ করান।' : 'Sender number and TxID is required.');
      return;
    }

    // Submit core purchase
    const finalOrder = createOrder({
      userId: currentUser ? currentUser.id : null,
      guestEmail: pendingOrder.guestEmail,
      serviceId: pendingOrder.serviceId,
      categoryId: pendingOrder.categoryId,
      targetLink: pendingOrder.targetLink,
      quantity: pendingOrder.quantity,
      totalPrice: pendingOrder.totalPrice,
      orderNote: pendingOrder.orderNote,
      status: 'pending'
    });

    // Register cash txn for administrative audit
    submitPayment({
      userId: currentUser ? currentUser.id : 'guest',
      amount: pendingOrder.totalPrice,
      method: paymentMethod.toUpperCase(),
      senderNumber,
      transactionId,
      type: 'checkout',
      note: `Guest Checkout for Order ID: ${finalOrder.id} (${activeService.nameEn})`
    });

    setOrderPlacedSuccess(finalOrder.id);
    setPendingOrder(null);
  };

  const handleCopyNo = (num: string) => {
    navigator.clipboard.writeText(num);
    alert(lang === 'bn' ? 'নাম্বার কপি করা হয়েছে!' : 'Number Copied!');
  };

  if (orderPlacedSuccess) {
    return (
      <div id="checkout-success-feedback" className="max-w-lg mx-auto bg-white border border-gray-150 p-8 rounded-3xl text-center space-y-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            {lang === 'bn' ? 'অর্ডারটি সফলভাবে জমা হয়েছে!' : 'Order Dispatched Successfully!'}
          </h2>
          <p className="text-xs text-gray-400 font-mono tracking-widest uppercase">
            {t.orderId}: <span className="font-bold text-gray-800 dark:text-gray-200">{orderPlacedSuccess}</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
            {paymentMethod === 'wallet' 
              ? (lang === 'bn' ? 'ইনস্ট্যান্ট ওয়ালেট চেকআউট সম্পন্ন হয়েছে। এডমিন দ্রুত আপনার সার্ভিস ডেলিভারি প্রসেস শুরু করবেন।' : 'Direct wallet deduction complete. Order has been automated for immediate dispatch.')
              : (lang === 'bn' ? 'আমাদের পেমেন্ট অডিটর সেশন ৩-১০ মিনিটের মধ্যে ভেরিফাই করে নিয়ে আপনার রিকোয়েস্টটি সচল করবেন।' : 'Local gateway transaction logged. Review processes will verify of records in 3-10 minutes.')
            }
          </p>
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-center gap-3">
          <button
            id="success-track-btn"
            onClick={() => setTab('dashboard')}
            className="bg-emerald-500 hover:bg-emerald-600 cursor-pointer text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-sm"
          >
            {currentUser ? t.heroCtaDashboard : (lang === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Orders')}
          </button>
          <button
            id="success-services-btn"
            onClick={() => setTab('services')}
            className="bg-gray-100 hover:bg-gray-200 cursor-pointer text-gray-700 text-xs font-bold py-3 px-6 rounded-xl transition-all"
          >
            {lang === 'bn' ? 'আরো অর্ডার করুন' : 'Buy More Services'}
          </button>
        </div>
      </div>
    );
  }

  // Gateway specifics
  const getAccountNo = () => {
    if (paymentMethod === 'bkash') return '01712-345678 (Bkash Personal)';
    if (paymentMethod === 'nagad') return '01912-887766 (Nagad Personal)';
    if (paymentMethod === 'rocket') return '01511-998877-4 (Rocket Personal)';
    return 'digitalgallery7.24@gmail.com';
  };

  return (
    <div id="checkout-view" className="space-y-8 max-w-4xl mx-auto pb-12">
      <button
        id="back-to-services-btn"
        onClick={() => setTab('services')}
        className="cursor-pointer inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-950 font-semibold"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{lang === 'bn' ? 'অর্ডারে ফিরে যান' : 'Go back to customization'}</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Summary billing */}
        <div className="md:col-span-5 bg-white border border-gray-150 rounded-2xl p-6 dark:bg-gray-800 dark:border-gray-700 space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-base border-b border-gray-100 pb-3">
            {lang === 'bn' ? 'অর্ডার সামারি' : 'Order Summary'}
          </h3>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="block text-gray-400 font-semibold uppercase text-[10px]">{lang === 'bn' ? 'নির্বাচিত সার্ভিস' : 'Target Service'}</span>
              <p className="font-bold text-gray-800 dark:text-white mt-0.5">{lang === 'bn' ? activeService.nameBn : activeService.nameEn}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="block text-gray-400 font-semibold uppercase text-[10px]">{t.orderQty}</span>
                <p className="font-mono font-bold mt-0.5">{pendingOrder.quantity.toLocaleString()} units</p>
              </div>
              <div>
                <span className="block text-gray-400 font-semibold uppercase text-[10px]">{lang === 'bn' ? 'ডেলিভারি উইন্ডো' : 'Timeframe'}</span>
                <p className="text-emerald-600 font-bold mt-0.5">{lang === 'bn' ? activeService.deliveryTimeBn : activeService.deliveryTimeEn}</p>
              </div>
            </div>

            <div>
              <span className="block text-gray-400 font-semibold uppercase text-[10px]">{lang === 'bn' ? 'গন্তব্য লিংক ইউআরএল' : 'Target Destination URL'}</span>
              <p className="font-mono text-gray-500 break-all mt-0.5">{pendingOrder.targetLink}</p>
            </div>

            {pendingOrder.orderNote && (
              <div>
                <span className="block text-gray-400 font-semibold uppercase text-[10px]">{t.additionalNote}</span>
                <p className="italic text-gray-500 mt-0.5">"{pendingOrder.orderNote}"</p>
              </div>
            )}
            
            {pendingOrder.couponCode && (
              <div>
                <span className="block text-gray-400 font-semibold uppercase text-[10px]">{lang === 'bn' ? 'প্রয়োগকৃত ডিসকাউন্ট কুপন' : 'Applied Discount Promo'}</span>
                <p className="text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                  <Ticket className="w-3.5 h-3.5" />
                  <span>{pendingOrder.couponCode}</span>
                </p>
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-xl space-y-1 dark:bg-gray-750">
              <span className="text-[10px] font-bold text-gray-400 uppercase">{t.totalAmount}</span>
              <div className="text-xl font-black text-gray-900 font-mono tracking-tight dark:text-white">
                {settings.currencySymbol}{pendingOrder.totalPrice}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Gateway integrations */}
        <div className="md:col-span-7 bg-white border border-gray-150 rounded-2xl p-6 dark:bg-gray-800 dark:border-gray-700 space-y-6">
          <div>
            <h3 className="font-extrabold text-gray-900 dark:text-white text-base">
              {t.selectPayment}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {lang === 'bn' ? 'নিচের যেকোনো সচল ডিজিটাল পেমেন্ট মাধ্যম ব্যবহার ও ভেরিফাই করুন' : 'Confirm purchase through direct wallet or manual deposits'}
            </p>
          </div>

          {/* Payment gateway selection grids */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currentUser && (
              <button
                id="gateway-wallet-btn"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transform active:scale-95 transition-all cursor-pointer ${
                  paymentMethod === 'wallet' 
                    ? 'border-emerald-500 bg-emerald-50/15' 
                    : 'border-gray-200 hover:border-gray-300 bg-white dark:bg-gray-750'
                }`}
              >
                <Wallet className={`w-5 h-5 ${paymentMethod === 'wallet' ? 'text-emerald-500' : 'text-gray-400'}`} />
                <span className="text-[10px] font-bold leading-none">{lang === 'bn' ? 'ওয়ালেট রিচার্জ' : 'Wallet Pay'}</span>
              </button>
            )}

            <button
              id="gateway-bkash-btn"
              onClick={() => setPaymentMethod('bkash')}
              className={`p-3.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transform active:scale-95 transition-all cursor-pointer ${
                paymentMethod === 'bkash' 
                  ? 'border-pink-500 bg-pink-50/10' 
                  : 'border-gray-200 hover:border-gray-300 bg-white dark:bg-gray-750'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-pink-500 text-white font-bold text-xs flex items-center justify-center font-mono">b</div>
              <span className="text-[10px] font-bold leading-none">bKash (বিকাশ)</span>
            </button>

            <button
              id="gateway-nagad-btn"
              onClick={() => setPaymentMethod('nagad')}
              className={`p-3.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transform active:scale-95 transition-all cursor-pointer ${
                paymentMethod === 'nagad' 
                  ? 'border-orange-500 bg-orange-50/10' 
                  : 'border-gray-200 hover:border-gray-300 bg-white dark:bg-gray-750'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center font-mono">n</div>
              <span className="text-[10px] font-bold leading-none">Nagad (নগদ)</span>
            </button>

            <button
              id="gateway-rocket-btn"
              onClick={() => setPaymentMethod('rocket')}
              className={`p-3.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transform active:scale-95 transition-all cursor-pointer ${
                paymentMethod === 'rocket' 
                  ? 'border-violet-500 bg-violet-50/10' 
                  : 'border-gray-200 hover:border-gray-300 bg-white dark:bg-gray-750'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-violet-600 text-white font-bold text-xs flex items-center justify-center font-mono">r</div>
              <span className="text-[10px] font-bold leading-none">Rocket (রকেট)</span>
            </button>
          </div>

          {/* Payment gateway screen details */}
          {paymentMethod === 'wallet' ? (
            <div className="p-5 bg-emerald-500/5 rounded-xl border border-emerald-500/10 space-y-4">
              <div className="flex items-start gap-3 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                <AlertCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">{lang === 'bn' ? 'ওয়ালেট ব্যালেন্স থেকে ইনস্ট্যান্ট পেমেন্ট' : 'Instant Automatic Wallet Settlement'}</span>
                  <p className="text-[11px] mt-1">
                    {lang === 'bn' 
                      ? `অর্ডারটি সাবমিট করার সাথে সাথে আপনার ওয়ালেট থেকে ${pendingOrder.totalPrice} টাকা কেটে নেওয়া হবে।`
                      : `Your unique wallet carries enough credits to pay of this order immediately in real time.`}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-white border border-gray-150/70 rounded-lg text-xs font-mono dark:bg-gray-900">
                <div>
                  <span className="block text-gray-400 text-[10px]">{lang === 'bn' ? 'আপনার ব্যালেন্স' : 'Your Balance:'}</span>
                  <p className="font-bold text-gray-800 dark:text-white">{settings.currencySymbol}{currentUser?.walletBalance}</p>
                </div>
                <div>
                  <span className="block text-gray-400 text-[10px]">{lang === 'bn' ? 'অর্ডার কস্ট' : 'Order Cost:'}</span>
                  <p className="font-bold text-rose-500">{settings.currencySymbol}{pendingOrder.totalPrice}</p>
                </div>
              </div>

              {userCanPayWithWallet ? (
                <button
                  id="checkout-pay-instant-btn"
                  onClick={handlePayWithWallet}
                  className="w-full cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-xs"
                >
                  {t.walletPayBtn}
                </button>
              ) : (
                <div className="p-3 bg-rose-500/10 rounded-lg text-center font-bold text-[11px] text-rose-500">
                  ⚠️ {t.walletBalanceError}
                </div>
              )}
            </div>
          ) : (
            <form id="checkout-gateway-form" onSubmit={handlePayManualTransfer} className="p-5 bg-gray-50 border border-gray-150 rounded-xl space-y-4 dark:bg-gray-750/50 dark:border-gray-700">
              
              {/* Manual Gateway Instructions */}
              <div className="space-y-2">
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  {t.payInstruction}
                </p>
                
                {/* Account card and Copy trigger details */}
                <div className="flex items-center justify-between p-3.5 bg-white border border-gray-200/60 rounded-xl font-mono text-xs text-gray-900 dark:bg-gray-900 dark:border-gray-750 dark:text-white">
                  <div>
                    <span className="block text-[10px] text-gray-400 font-sans">{t.sendToNumber}</span>
                    <span className="font-black tracking-tight text-emerald-600 dark:text-emerald-400">{getAccountNo()}</span>
                  </div>
                  <button
                    id="copy-merchant-no-btn"
                    type="button"
                    onClick={() => handleCopyNo(getAccountNo().split(' ')[0])}
                    className="p-1 rounded bg-gray-50 border border-gray-150 hover:bg-emerald-50 text-gray-500 hover:text-emerald-600 transition-all cursor-pointer"
                  >
                    <Clipboard className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sender mobile & TXID fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                    {t.senderNumLabel} *
                  </label>
                  <input
                    id="sender-number-input"
                    type="tel"
                    required
                    placeholder="e.g. 01712345678"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs font-mono dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                    {t.txIdLabel} *
                  </label>
                  <input
                    id="tx-id-input"
                    type="text"
                    required
                    placeholder="e.g. TRX9832ABCE"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs font-mono dark:bg-gray-900 dark:border-gray-700 dark:text-white uppercase"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="checkout-verify-deposit-btn"
                  type="submit"
                  className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 font-bold py-3 text-white rounded-xl shadow-md transition-all text-xs"
                >
                  {t.submitPaymentBtn}
                </button>
              </div>

              <span className="block text-[10px] text-gray-400 text-center uppercase tracking-wide leading-none font-semibold">
                🛡️ SSLCOMMERZ & STRIPE AES Encryption Compliant
              </span>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
