import React, { useState } from 'react';
import { useAppState } from '../lib/state';
import { 
  Sparkles, TrendingUp, Users, Award, ShieldCheck, Clock, CheckCircle2, 
  ArrowRight, MessageSquare, Play, HelpCircle, Gift, ArrowUpRight
} from 'lucide-react';

interface HomeViewProps {
  setTab: (tab: string) => void;
  setSelectedCategory: (catId: string) => void;
  setSelectedServiceId: (srvId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ setTab, setSelectedCategory, setSelectedServiceId }) => {
  const { categories, services, lang, t, settings } = useAppState();
  const [faqOpen, setFaqOpen] = useState<Record<string, boolean>>({
    '0': true,
    '1': false,
    '2': false
  });

  const toggleFaq = (index: string) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const featuredServices = services.filter(s => s.featured).slice(0, 3);
  const activeCategories = categories.slice(0, 4);

  // Statistics
  const statsList = [
    { label: t.statCompletedOrders, value: '৪৫০,০০০+', valueEn: '450k+', icon: CheckCircle2, bg: 'bg-emerald-500/10 text-emerald-600' },
    { label: t.statActiveUsers, value: '১৮,৫০০+', valueEn: '18.5k+', icon: Users, bg: 'bg-indigo-500/10 text-indigo-600' },
    { label: t.statServices, value: '১২০+ টি', valueEn: '120+', icon: Sparkles, bg: 'bg-amber-500/10 text-amber-600' },
    { label: t.statSupportTime, value: '২৪/৭ সচল', valueEn: '24/7 Live', icon: Clock, bg: 'bg-rose-500/10 text-rose-600' }
  ];

  return (
    <div id="home-view" className="space-y-16 pb-12">
      
      {/* Announcement Bar */}
      {settings.announcementBn && (
        <div id="announcement-banner" className="bg-emerald-50 text-emerald-800 text-center py-2 px-4 rounded-b-xl border-x border-b border-emerald-100/50 text-xs font-semibold animate-pulse dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/30">
          <span>📢 {lang === 'bn' ? settings.announcementBn : settings.announcementEn}</span>
        </div>
      )}

      {/* 1. Hero banner Area */}
      <section id="hero-banner-section" className="relative p-6 md:p-12 rounded-3xl bg-radial from-emerald-50/50 via-white to-white border border-gray-100 overflow-hidden dark:from-emerald-950/10 dark:via-gray-900 dark:to-gray-900 dark:border-gray-800/80">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/5 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-4xl mx-auto text-center space-y-6 relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold uppercase dark:bg-emerald-950/30 dark:text-emerald-400">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>{lang === 'bn' ? 'ফাস্ট, রিয়েল এবং নন-ড্রপ গ্রোথ গ্যারান্টি' : 'Fast, Real & Non-Drop Growth'}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
            {t.heroTitlePre} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 underline decoration-emerald-500/30">
              {t.heroTitleHighlight}
            </span>
          </h1>

          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              id="hero-services-cta"
              onClick={() => setTab('services')}
              className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg ring-offset-2 ring-offset-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-base"
            >
              <span>{t.heroCtaServices}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              id="hero-dashboard-cta"
              onClick={() => setTab('dashboard')}
              className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 hover:border-gray-350 dark:bg-gray-800 dark:hover:bg-gray-700/80 dark:text-white dark:border-gray-700 font-bold px-8 py-4 rounded-2xl shadow-sm transition-all text-base"
            >
              <span>{t.heroCtaDashboard}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-6 text-xs text-gray-400 font-mono">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{lang === 'bn' ? '১০০% নিরাপদ ট্রানজেকশন' : '100% Client Protected'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-indigo-500" />
              <span>{lang === 'bn' ? '১৮,০০০+ সন্তুষ্ট কাস্টমার' : '18,000+ Happy Customers'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Categories Overview */}
      <section id="categories-showcase" className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {t.categoriesTitle}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm">
            {t.categoriesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {activeCategories.map((cat) => (
            <div
              key={cat.id}
              id={`cat-card-${cat.id}`}
              onClick={() => {
                setSelectedCategory(cat.id);
                setTab('services');
              }}
              className="group cursor-pointer p-6 rounded-2xl bg-white border border-gray-150 hover:border-emerald-500 hover:shadow-md transition-all text-center space-y-3 dark:bg-gray-800 dark:border-gray-700/80 dark:hover:border-emerald-500"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                  {lang === 'bn' ? cat.nameBn : cat.nameEn}
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-tight">
                  {lang === 'bn' ? cat.descriptionBn : cat.descriptionEn}
                </p>
              </div>
            </div>
          ))}
          {/* Universal view all card */}
          <div
            id="view-all-cats-card"
            onClick={() => setTab('services')}
            className="cursor-pointer p-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-sm hover:shadow-md transition-all text-center flex flex-col justify-center items-center space-y-2"
          >
            <TrendingUp className="w-8 h-8 opacity-90" />
            <h4 className="font-bold text-sm">
              {lang === 'bn' ? 'সব ক্যাটেগরি দেখুন' : 'Explore All'}
            </h4>
            <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-0.5">
              <span>{services.length} + services</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </section>

      {/* 3. Promo Banner */}
      {settings.promoBanner && settings.promoBanner.active && (
        <section id="promo-banner-interactive" className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-gray-950 to-indigo-950 text-white border border-indigo-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-4 text-center md:text-left max-w-xl">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold uppercase">
                <Gift className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'বিশেষ অফার প্রোগ্রাম' : 'SaaS Affiliate System'}</span>
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {lang === 'bn' ? settings.promoBanner.titleBn : settings.promoBanner.titleEn}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {lang === 'bn' ? settings.promoBanner.subtitleBn : settings.promoBanner.subtitleEn}
              </p>
            </div>
            <button
              id="promo-ref-action-btn"
              onClick={() => setTab('affiliate')}
              className="w-full md:w-auto shrink-0 bg-white hover:bg-indigo-50 cursor-pointer text-indigo-950 font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-md"
            >
              {lang === 'bn' ? settings.promoBanner.ctaTextBn : settings.promoBanner.ctaTextEn}
            </button>
          </div>
        </section>
      )}

      {/* 4. Featured Services */}
      <section id="featured-services-gallery" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {lang === 'bn' ? 'আমাদের সেরা এবং ট্রেন্ডিং সার্ভিসসমূহ' : 'Our Top & Featured Services'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg">
              {lang === 'bn' ? 'সবচেয়ে দ্রুত সময়ে কাজ সম্পন্ন হওয়ার নিশ্চয়তা সম্পন্ন নির্বাচিত সার্ভিসপ্যাক' : 'Selected service bundles known for speed and retention metrics'}
            </p>
          </div>
          <button
            id="all-services-link"
            onClick={() => setTab('services')}
            className="cursor-pointer text-sm font-semibold text-emerald-600 hover:text-emerald-500 flex items-center gap-0.5 font-mono"
          >
            <span>{lang === 'bn' ? 'সব সার্ভিস দেখুন' : 'Explore All Services'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredServices.map((srv) => {
            const cat = categories.find(c => c.id === srv.categoryId);
            return (
              <div
                key={srv.id}
                id={`featured-card-${srv.id}`}
                className="bg-white border border-gray-150 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-emerald-500/20 transition-all dark:bg-gray-800 dark:border-gray-700/80"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md uppercase dark:bg-emerald-950/40 dark:text-emerald-300">
                      {cat ? (lang === 'bn' ? cat.nameBn : cat.nameEn) : 'Service'}
                    </span>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      {settings.currencySymbol}{(srv.pricePerUnit * 1000).toFixed(0)} <span className="text-xs font-normal text-gray-400">/ ১০০০</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 dark:text-white text-base tracking-tight leading-tight">
                    {lang === 'bn' ? srv.nameBn : srv.nameEn}
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                    {lang === 'bn' ? srv.descriptionBn : srv.descriptionEn}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-gray-400 font-mono py-1">
                    <div>
                      <span className="block font-semibold text-gray-500 dark:text-gray-300">{lang === 'bn' ? 'নূন্যতম পরিমাণ' : 'Min Limit'}</span>
                      <span>{srv.minQuantity}</span>
                    </div>
                    <div>
                      <span className="block font-semibold text-gray-500 dark:text-gray-300">{lang === 'bn' ? 'ডেলিভারি সময়' : 'Timeframe'}</span>
                      <span className="text-emerald-600 dark:text-emerald-400">{lang === 'bn' ? srv.deliveryTimeBn : srv.deliveryTimeEn}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700/60">
                  <button
                    id={`order-btn-${srv.id}`}
                    onClick={() => {
                      setSelectedServiceId(srv.id);
                      setTab('services');
                    }}
                    className="w-full cursor-pointer flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-emerald-500 hover:text-white border border-gray-200 hover:border-emerald-500 text-gray-700 text-xs font-bold py-2.5 px-4 rounded-xl transition-all"
                  >
                    <span>{t.orderNowBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Live Statistics Grid */}
      <section id="platform-stats-dashboard" className="bg-gray-50 border border-gray-200/60 rounded-3xl p-6 md:p-8 dark:bg-gray-800/40 dark:border-gray-800">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {statsList.map((st, i) => {
            const Icon = st.icon;
            return (
              <div key={i} id={`stat-node-${i}`} className="space-y-2">
                <div className={`w-10 h-10 rounded-xl ${st.bg} mx-auto flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl md:text-3xl font-black text-gray-900 dark:text-white font-mono">
                    {lang === 'bn' ? st.value : st.valueEn}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {st.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Why Choose Us Section */}
      <section id="why-choose-us-grid" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold font-mono uppercase text-emerald-600 tracking-widest">{t.whyTitle}</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              {t.whySubtitle}
            </h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {lang === 'bn'
              ? 'আমাদের প্ল্যাটফর্ম প্রতিটি গ্রাহকের সন্তুষ্টি নিশ্চিত করতে অত্যাধুনিক এপিআই সিস্টেম ও ডেডিকেটেড সার্ভার ব্যবহার করে। আমাদের সাথে আপনি পাবেন শতভাগ নিরাপদ অ্যাকাউন্ট ইন্টিগ্রেশন।'
              : 'Our system triggers transactions utilizing dynamic pipelines and optimized routing servers. Experience seamless updates with 100% legal, non-drop, and filter-safe engagement.'}
          </p>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {lang === 'bn' ? '১০০% ক্যাশব্যাক রিফান্ড পলিসি' : '100% Cash refund guarantee if order fails'}
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {lang === 'bn' ? 'বিকাশ, নগদ, রকেট, কার্ড এবং পেপাল পেমেন্ট' : 'Fast Bangladesh local wallet & international transactions'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-white border border-gray-150 rounded-2xl shadow-xs dark:bg-gray-800 dark:border-gray-700/85">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.whySec1Title}</span>
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
              {t.whySec1Desc}
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-150 rounded-2xl shadow-xs dark:bg-gray-800 dark:border-gray-700/85">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-4 h-4" />
              <span>{t.whySec2Title}</span>
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
              {t.whySec2Desc}
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-150 rounded-2xl shadow-xs dark:bg-gray-800 dark:border-gray-700/85">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <MessageSquare className="w-4 h-4" />
              <span>{t.whySec3Title}</span>
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
              {t.whySec3Desc}
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-150 rounded-2xl shadow-xs dark:bg-gray-800 dark:border-gray-700/85">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <Award className="w-4 h-4" />
              <span>{t.whySec4Title}</span>
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
              {t.whySec4Desc}
            </p>
          </div>
        </div>
      </section>

      {/* 7. FAQ Widget Accordion */}
      <section id="home-faq-accordion" className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            {t.faqTitle}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {lang === 'bn' ? 'আমাদের সার্ভিস সম্পর্কে সাধারণ প্রশ্নগুলোর উত্তর' : 'Commonly asked structural feedback and operational rules'}
          </p>
        </div>

        <div className="space-y-3">
          {[
            { q: t.faq1Q, a: t.faq1A },
            { q: t.faq2Q, a: t.faq2A },
            { q: t.faq3Q, a: t.faq3A }
          ].map((item, idx) => {
            const indexStr = idx.toString();
            const isOpen = faqOpen[indexStr];
            return (
              <div key={idx} id={`faq-accordion-item-${idx}`} className="border border-gray-150 rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700">
                <button
                  id={`faq-btn-${idx}`}
                  onClick={() => toggleFaq(indexStr)}
                  className="w-full flex items-center justify-between p-4 font-semibold text-left text-sm text-gray-900 dark:text-white cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{item.q}</span>
                  </span>
                  <span>{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-50 pt-2 leading-relaxed dark:border-gray-700/60">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
