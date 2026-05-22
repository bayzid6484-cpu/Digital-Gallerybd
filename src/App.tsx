/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { StateProvider, useAppState } from './lib/state';
import { LanguageSelector } from './components/LanguageSelector';
import { StickyBottomNav } from './components/StickyBottomNav';
import { PromoPopup } from './components/PromoPopup';
import { AnalyticsTicker } from './components/AnalyticsTicker';

// Modular Views
import { HomeView } from './views/HomeView';
import { ServicesView } from './views/ServicesView';
import { CheckoutView } from './views/CheckoutView';
import { UserDashboard } from './views/UserDashboard';
import { AdminDashboard } from './views/AdminDashboard';
import { LoginRegisterView } from './views/LoginRegisterView';
import { SupportTicketView } from './views/SupportTicketView';
import { BlogView } from './views/BlogView';
import { FaqContactView } from './views/FaqContactView';
import { AffiliateView } from './views/AffiliateView';

// Standard Lucide icons
import { 
  Sun, Moon, ShieldCheck, Wallet, User, LifeBuoy, BookOpen, 
  HelpCircle, Menu, X, LogOut, ChevronRight, LogIn, MessageSquare, ExternalLink
} from 'lucide-react';

function AppContent() {
  const { 
    currentUser, logoutUser, activeService, categories, services, 
    lang, t, settings, notifications 
  } = useAppState();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [pendingOrder, setPendingOrder] = useState<any | null>(null);

  // Theme support
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('seba_theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('seba_theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Close menus on tab shift
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-gray-50/50 text-gray-900'}`}>
      
      {/* 1. Universal announcement ticker info */}
      <AnalyticsTicker />

      {/* 2. Top Header Navigation */}
      <header id="main-header" className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-150/80 dark:bg-gray-950/85 dark:border-gray-850">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          {/* Logo Name */}
          <div 
            id="site-logo" 
            onClick={() => handleTabChange('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <img 
              src="/logo.svg" 
              alt="Digital Gallery Logo" 
              className="w-10 h-10 object-contain logo-glow" 
              referrerPolicy="no-referrer" 
            />
            <span className="font-extrabold text-sm md:text-lg tracking-tight bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent font-sans">
              {lang === 'bn' ? settings.siteNameBn : settings.siteNameEn}
            </span>
          </div>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-gray-600 dark:text-gray-300">
            <button 
              id="nav-home" 
              onClick={() => handleTabChange('home')}
              className={`hover:text-emerald-500 cursor-pointer transition-colors ${activeTab === 'home' ? 'text-emerald-500 font-bold' : ''}`}
            >
              {t.navHome}
            </button>
            <button 
              id="nav-services" 
              onClick={() => handleTabChange('services')}
              className={`hover:text-emerald-500 cursor-pointer transition-colors ${activeTab === 'services' ? 'text-emerald-500 font-bold' : ''}`}
            >
              {t.navServices}
            </button>
            <button 
              id="nav-affiliate" 
              onClick={() => handleTabChange('affiliate')}
              className={`hover:text-emerald-500 cursor-pointer transition-colors ${activeTab === 'affiliate' ? 'text-emerald-500 font-bold' : ''}`}
            >
              {t.navAffiliate}
            </button>
            <button 
              id="nav-blog" 
              onClick={() => handleTabChange('blog')}
              className={`hover:text-emerald-500 cursor-pointer transition-colors ${activeTab === 'blog' ? 'text-emerald-500 font-bold' : ''}`}
            >
              {t.navBlog}
            </button>
            <button 
              id="nav-tickets" 
              onClick={() => handleTabChange('tickets')}
              className={`hover:text-emerald-500 cursor-pointer transition-colors ${activeTab === 'tickets' ? 'text-emerald-500 font-bold' : ''}`}
            >
              {t.navTickets}
            </button>
            <button 
              id="nav-faq" 
              onClick={() => handleTabChange('faq')}
              className={`hover:text-emerald-500 cursor-pointer transition-colors ${activeTab === 'faq' ? 'text-emerald-500 font-bold' : ''}`}
            >
              {t.navFaq}
            </button>

            {currentUser?.role === 'admin' && (
              <button 
                id="nav-admin" 
                onClick={() => handleTabChange('admin')}
                className={`text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1 cursor-pointer ${activeTab === 'admin' ? 'underline' : ''}`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.navAdmin}</span>
              </button>
            )}
          </nav>

          {/* Right Header Panel Actions */}
          <div className="flex items-center gap-3">
            {/* Bilingual custom switcher */}
            <LanguageSelector />

            {/* Dark Mode switcher */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Wallet Balance widget (Only shown if signed in) */}
            {currentUser ? (
              <div 
                id="header-user-wallet" 
                onClick={() => handleTabChange('dashboard')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-50/20 cursor-pointer hover:bg-emerald-50/40 transition-colors dark:border-emerald-500/10"
              >
                <Wallet className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-450">
                  {settings.currencySymbol}{currentUser.walletBalance}
                </span>
              </div>
            ) : null}

            {/* Account session CTAs */}
            {currentUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  id="header-profile-btn"
                  onClick={() => handleTabChange('dashboard')}
                  className="hidden sm:inline-flex items-center gap-1 cursor-pointer bg-gray-900 border border-gray-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl block dark:bg-gray-800"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>My Profile</span>
                </button>
                <button
                  id="header-logout-btn"
                  onClick={() => {
                    logoutUser();
                    handleTabChange('home');
                  }}
                  className="p-2 rounded-xl text-red-500 bg-red-50 hover:bg-red-100 cursor-pointer transition-colors dark:bg-red-950/25 dark:text-red-400"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <button
                id="header-login-btn"
                onClick={() => handleTabChange('login')}
                className="cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
              >
                {t.navLogin}
              </button>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* 3. Mobile Navigation Dropdown drawer */}
      {mobileMenuOpen && (
        <div id="mobile-drawer-menu" className="lg:hidden bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-850 px-4 py-4 space-y-3 shadow-md text-xs font-bold text-gray-700">
          <button onClick={() => handleTabChange('home')} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50">{t.navHome}</button>
          <button onClick={() => handleTabChange('services')} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50">{t.navServices}</button>
          <button onClick={() => handleTabChange('affiliate')} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50">{t.navAffiliate}</button>
          <button onClick={() => handleTabChange('blog')} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50">{t.navBlog}</button>
          <button onClick={() => handleTabChange('tickets')} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50">{t.navTickets}</button>
          <button onClick={() => handleTabChange('faq')} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50">{t.navFaq}</button>

          {currentUser?.role === 'admin' && (
            <button onClick={() => handleTabChange('admin')} className="block w-full text-left px-3 py-2 text-rose-500 hover:bg-rose-50/35">{t.navAdmin}</button>
          )}

          {currentUser && (
            <div className="pt-2 border-t flex items-center justify-between font-mono text-xs px-3">
              <span>{t.userWalletBal}</span>
              <span className="font-bold text-emerald-600">{settings.currencySymbol}{currentUser.walletBalance}</span>
            </div>
          )}
        </div>
      )}

      {/* 4. Core View Scaffolder with negative grids */}
      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-6 py-8 w-full">
        {activeTab === 'home' && (
          <HomeView 
            setTab={handleTabChange} 
            setSelectedCategory={setSelectedCategoryId}
            setSelectedServiceId={setSelectedServiceId}
          />
        )}

        {activeTab === 'services' && (
          <ServicesView
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
            selectedServiceId={selectedServiceId}
            setSelectedServiceId={setSelectedServiceId}
            setTab={handleTabChange}
            setPendingOrder={setPendingOrder}
          />
        )}

        {activeTab === 'checkout' && (
          <CheckoutView
            pendingOrder={pendingOrder}
            setTab={handleTabChange}
            setPendingOrder={setPendingOrder}
          />
        )}

        {activeTab === 'dashboard' && (
          <UserDashboard 
            setTab={handleTabChange}
            setSelectedServiceId={setSelectedServiceId}
          />
        )}

        {activeTab === 'admin' && <AdminDashboard />}

        {activeTab === 'login' && <LoginRegisterView setTab={handleTabChange} />}

        {activeTab === 'tickets' && <SupportTicketView />}

        {activeTab === 'blog' && <BlogView />}

        {activeTab === 'faq' && <FaqContactView />}

        {activeTab === 'affiliate' && <AffiliateView setTab={handleTabChange} />}
      </main>

      {/* 5. Footer Segment with high fidelity design elements */}
      <footer id="main-footer" className="bg-white border-t border-gray-150/80 dark:bg-gray-950 dark:border-gray-850 pt-12 pb-24 md:pb-12 text-xs font-semibold text-gray-500">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img 
                src="/logo.svg" 
                alt="Digital Gallery Logo" 
                className="w-8 h-8 object-contain logo-glow" 
                referrerPolicy="no-referrer" 
              />
              <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">{lang === 'bn' ? settings.siteNameBn : settings.siteNameEn}</span>
            </div>
            <p className="text-[11px] leading-relaxed font-medium">
              We are Bangladesh's premium automated eCommerce and followup link traffic provider operating with secure servers and automated API dispatch structures.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-gray-900 dark:text-white uppercase mb-3 text-[10px] tracking-widest">SMM & Web Links</h4>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => handleTabChange('services')} className="hover:text-emerald-500 shrink-0">Browse Services</button></li>
              <li><button onClick={() => handleTabChange('affiliate')} className="hover:text-emerald-500 shrink-0">Affiliate Partnerships</button></li>
              <li><button onClick={() => handleTabChange('blog')} className="hover:text-emerald-500 shrink-0">Blogging Guides</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-gray-900 dark:text-white uppercase mb-3 text-[10px] tracking-widest">Resources & Helplines</h4>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => handleTabChange('tickets')} className="hover:text-emerald-500 shrink-0">Support Center Inbox</button></li>
              <li><button onClick={() => handleTabChange('faq')} className="hover:text-emerald-500 shrink-0">FAQs & Contacts</button></li>
              <li><a href="#terms" onClick={() => handleTabChange('faq')} className="hover:text-emerald-500">Terms & Conditions</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-gray-900 dark:text-white uppercase text-[10px] tracking-widest">Local Gateway Compliance</h4>
            <div className="flex flex-wrap gap-2 text-[10px] text-gray-400 font-mono font-bold">
              <span className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded">bKash Active</span>
              <span className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded">Nagad Active</span>
              <span className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded">Rocket Active</span>
              <span className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded">SSLCommerz Enforced</span>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 border-t border-gray-100 dark:border-gray-850 mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-400 font-mono">
          <span>&copy; 2026 {lang === 'bn' ? settings.siteNameBn : settings.siteNameEn}. All Rights Reserved.</span>
          <span>Made for and optimized for Bangladeshi social creators.</span>
        </div>
      </footer>

      {/* 6. Sticky Bottom Navigation for smartphones device screens */}
      <StickyBottomNav currentTab={activeTab} setTab={handleTabChange} />

      {/* 7. Floating Chat Executive button shortcut */}
      <button
        id="floating-support-help-btn"
        onClick={() => handleTabChange('tickets')}
        className="fixed bottom-20 md:bottom-6 right-6 w-12 h-12 rounded-full cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all z-20"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      {/* 8. Promotion discount codes popup after 3 seconds */}
      <PromoPopup />

    </div>
  );
}

export default function App() {
  return (
    <StateProvider>
      <AppContent />
    </StateProvider>
  );
}
