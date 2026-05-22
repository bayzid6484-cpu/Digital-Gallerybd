import React, { useState } from 'react';
import { useAppState } from '../lib/state';
import { 
  Users, Gift, Coins, Share2, Clipboard, Check, HelpCircle, 
  ChevronRight, ArrowRight, Sparkles, UserPlus 
} from 'lucide-react';

interface AffiliateViewProps {
  setTab: (tab: string) => void;
}

export const AffiliateView: React.FC<AffiliateViewProps> = ({ setTab }) => {
  const { currentUser, settings, lang } = useAppState();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (!currentUser) return;
    const link = `${window.location.origin}?ref=${currentUser.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="affiliate-landing-page" className="space-y-12 pb-12 max-w-4xl mx-auto">
      
      {/* 1. Header Banner */}
      <section id="affiliate-banner-hero" className="p-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border border-indigo-500/25 text-white rounded-3xl relative overflow-hidden text-center space-y-4">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Lifetime 5% Residual Commission program</span>
        </span>

        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight max-w-2xl mx-auto">
          {lang === 'bn' 
            ? 'আমাদের সাথে পার্টনার হন এবং আজীবনের জন্য আয় করুন!' 
            : 'Become a Partner & Safeguard Lifetime Commission credits'}
        </h1>

        <p className="text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
          {lang === 'bn'
            ? 'আপনার ইউনিক রেফারাল লিংকটি ফেসবুক, ইউটিউব, টেলিগ্রাম বা ব্লগে শেয়ার করুন। আপনার রেফারে আসা কাস্টমার প্রতিবার ওয়ালেট রিচার্জ করলে পান ৫% সরাসরি ইনস্ট্যান্ট ক্যাশব্যাক।'
            : 'Share your personal referral shortcut link on Facebook, Telegram, WhatsApp, or email. Get 5% cashback added to your balance on every deposit. Automatic payout.'}
        </p>

        {currentUser ? (
          /* Logged in custom slot link copier */
          <div className="pt-4 max-w-md mx-auto space-y-2">
            <div className="flex gap-2">
              <input
                id="landing-ref-url"
                type="text"
                readOnly
                value={`${window.location.origin}?ref=${currentUser.referralCode}`}
                className="w-full bg-black/40 text-emerald-400 font-mono text-xs px-3.5 py-3 rounded-xl border border-indigo-400/30"
              />
              <button
                id="landing-ref-copy-btn"
                onClick={handleCopyLink}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-3 rounded-xl cursor-pointer transition-colors shrink-0 flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Clipboard className="w-3.5 h-3.5" />}
                <span>{copied ? (lang === 'bn' ? 'কপি হয়েছে' : 'Copied') : (lang === 'bn' ? 'কপি লিংক' : 'Copy')}</span>
              </button>
            </div>
            {copied && <p className="text-[11px] font-bold text-emerald-400 pl-1">{lang === 'bn' ? 'রেফারাল লিংকটি কপি করা হয়েছে!' : 'Referral Link registered to clipboard!'}</p>}
          </div>
        ) : (
          /* Guest CTA buttons to signup */
          <div className="pt-4">
            <button
              id="landing-signup-ref-cta"
              onClick={() => setTab('login')}
              className="bg-white hover:bg-gray-150 cursor-pointer text-indigo-950 font-black text-xs px-6 py-3.5 rounded-xl text-xs transition-colors shadow-md inline-flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{lang === 'bn' ? 'রেজিস্ট্রেশন করে লিংক নিন' : 'Sign Up to Grab Referral Code'}</span>
            </button>
          </div>
        )}
      </section>

      {/* 2. Step metrics guidelines */}
      <section id="affiliate-steps" className="space-y-6">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white text-center">
          {lang === 'bn' ? 'কীভাবে এটি কাজ করবে?' : 'How SMM Partner Program Operates'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-gray-150 rounded-2xl text-center space-y-3 dark:bg-gray-800">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 mx-auto flex items-center justify-center">
              <span className="font-mono font-bold text-base">১</span>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">
              {lang === 'bn' ? 'রেফার লিংক শেয়ার করুন' : '1. Disseminate Link'}
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              {lang === 'bn' ? 'আপনার ড্যাশবোর্ড থেকে রেফারাল লিংক টি সোশ্যাল মিডিয়া বা ব্লগে পোস্ট করুন।' : 'Copy and place your tracking referral node across networks or direct chats.'}
            </p>
          </div>

          <div className="p-6 bg-white border border-gray-150 rounded-2xl text-center space-y-3 dark:bg-gray-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
              <span className="font-mono font-bold text-base">২</span>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">
              {lang === 'bn' ? 'বন্ধুদের একাউন্ট খোলা' : '2. Friends Register'}
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              {lang === 'bn' ? 'আপনার রেফার লিংক ব্যবহার করে বন্ধুরা এই সাইটে সফলভাবে একাউন্ট খুলবে।' : 'Colleagues land on platform through link and quickly complete registration.'}
            </p>
          </div>

          <div className="p-6 bg-white border border-gray-150 rounded-2xl text-center space-y-3 dark:bg-gray-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 mx-auto flex items-center justify-center">
              <span className="font-mono font-bold text-base">৩</span>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">
              {lang === 'bn' ? 'আজীবন কমিশন আয়' : '3. Real Cash Commissions'}
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              {lang === 'bn' ? 'বন্ধুরা প্রতিবার তাদের ওয়ালেটে বিকাশ/নগদে টাকা লোড করলেই ৫% সরাসরি আপনার ব্যালেন্সে যোগ হবে।' : 'Get 5% of their aggregate transaction recharge added automatically to your wallet balance.'}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Bottom promotional guidelines checklist info */}
      <section id="affiliate-faq" className="p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex items-start gap-4 text-xs dark:bg-emerald-950/20">
        <Gift className="w-10 h-10 text-emerald-600 shrink-0 mt-0.5 animate-bounce" />
        <div className="space-y-1">
          <h4 className="font-extrabold text-emerald-800 dark:text-emerald-400 leading-snug">
            {lang === 'bn' ? 'অ্যাফিলিয়েট প্রোগ্রাম সংক্রান্ত প্রায়শই জিজ্ঞাসিত রুলস' : 'Helpful partner programmatic advice'}
          </h4>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[11px] font-medium">
            {lang === 'bn'
              ? 'এখানে আয়ের কোনো লিমিট নেই। আপনি শত শত উদ্যোক্তাদের বা ফেইসবুক পেজ ওউনারদের টার্গেট করে লিংক পাঠাতে পারেন। অর্জিত কমিশন সরাসরি আপনার একাউন্ট ওয়ালেট ব্যালেন্সে ক্যাশ ব্যাক হিসেবে চলে আসে, যা দিয়ে আপনি যেকোনো সার্ভিস কিনতে পারবেন!'
              : 'There is no upper threshold to how much affiliate bonus credits you can assemble. Any gathered funds reside immediately inside your transaction pocket-book allowing easy purchase of any digital growth metrics.'}
          </p>
        </div>
      </section>

    </div>
  );
};
