import React, { useState } from 'react';
import { useAppState } from '../lib/state';
import { 
  Key, Database, UserPlus, Trash, ChevronDown, CheckCircle, XCircle, 
  Settings, DollarSign, ListOrdered, ClipboardList, HelpCircle, AlertCircle, Plus, Send, Edit3,
  Users, Percent, FileText, RefreshCw, Save, Check, UserCheck, Shield, Bookmark, Globe
} from 'lucide-react';
import { Category, Service, Coupon, SupportTicket, Blog, UserProfile } from '../types';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser, orders, transactions, tickets, categories, services, settings, coupons, users, blogs, notifications,
    updateSettings, approvePayment, rejectPayment, updateOrderStatus, replyToTicket, updateTicketStatus,
    addService, editService, deleteService, addCategory, editCategory, deleteCategory, addCoupon, deleteCoupon,
    addBlog, deleteBlog, syncAllToSupabase, isCloudLoading, updateUserBalance, updateUserRole, addNotification, lang, t
  } = useAppState();

  const [activeAdminSec, setActiveAdminSec] = useState<'analytics' | 'deposits' | 'orders' | 'services' | 'settings' | 'tickets' | 'users' | 'coupons_blogs'>('analytics');

  // State cloud synced feedback
  const [cloudMessage, setCloudMessage] = useState<{ text: string; error?: boolean } | null>(null);

  // ------- SMM SERVICE FIELDS & EDITING CREATION -------
  const [srvNameBn, setSrvNameBn] = useState('');
  const [srvNameEn, setSrvNameEn] = useState('');
  const [srvCatId, setSrvCatId] = useState('');
  const [srvPrice, setSrvPrice] = useState<number>(0.1);
  const [srvMin, setSrvMin] = useState<number>(100);
  const [srvMax, setSrvMax] = useState<number>(10000);
  const [srvTimeBn, setSrvTimeBn] = useState('১২ ঘণ্টা');
  const [srvTimeEn, setSrvTimeEn] = useState('12 Hours');
  const [srvDescBn, setSrvDescBn] = useState('প্রিমিয়াম কোয়ালিটি সার্ভিস প্যাক দ্রুত ডেলিভারি');
  const [srvDescEn, setSrvDescEn] = useState('Premium high-speed engagement parameters');
  const [editingSrvId, setEditingSrvId] = useState<string | null>(null);

  // ------- CATEGORY FIELDS & EDITING CREATION -------
  const [catNameBn, setCatNameBn] = useState('');
  const [catNameEn, setCatNameEn] = useState('');
  const [catDescBn, setCatDescBn] = useState('');
  const [catDescEn, setCatDescEn] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  // ------- COUPON FIELDS & CREATION -------
  const [cpCode, setCpCode] = useState('');
  const [cpDiscount, setCpDiscount] = useState<number>(10);
  const [cpMinOrder, setCpMinOrder] = useState<number>(200);
  const [cpExpiry, setCpExpiry] = useState('2026-12-31');

  // ------- BLOG FIELDS & CREATION -------
  const [blogTitleBn, setBlogTitleBn] = useState('');
  const [blogTitleEn, setBlogTitleEn] = useState('');
  const [blogContentBn, setBlogContentBn] = useState('');
  const [blogContentEn, setBlogContentEn] = useState('');
  const [blogCatBn, setBlogCatBn] = useState('সোশ্যাল টিপস');
  const [blogCatEn, setBlogCatEn] = useState('Social Growth Tips');
  const [blogImg, setBlogImg] = useState('https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600');

  // ------- SETTINGS STATE INITIALIZERS -------
  const [siteBn, setSiteBn] = useState(settings.siteNameBn);
  const [siteEn, setSiteEn] = useState(settings.siteNameEn);
  const [annBn, setAnnBn] = useState(settings.announcementBn);
  const [annEn, setAnnEn] = useState(settings.announcementEn);
  const [pTitleBn, setPTitleBn] = useState(settings.promoBanner.titleBn);
  const [pTitleEn, setPTitleEn] = useState(settings.promoBanner.titleEn);
  const [pDescBn, setPDescBn] = useState(settings.promoBanner.subtitleBn);
  const [pDescEn, setPDescEn] = useState(settings.promoBanner.subtitleEn);
  const [cEmail, setCEmail] = useState(settings.contactEmail);
  const [cPhone, setCPhone] = useState(settings.contactPhone);
  const [commRate, setCommRate] = useState<number>(settings.referrerCommissionPercent);

  // ------- USER EDITING BALANCE STUFF -------
  const [userIdToTopup, setUserIdToTopup] = useState<string | null>(null);
  const [topupAmount, setTopupAmount] = useState<number>(100);

  // Tickets active chat selection
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [adminTicketReplyText, setAdminTicketReplyText] = useState('');

  // Notification broadcast inputs
  const [sysAlertText, setSysAlertText] = useState('');

  // User search query
  const [userSearchText, setUserSearchText] = useState('');

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto p-8 text-center bg-white border border-gray-150 rounded-2xl dark:bg-gray-800 dark:border-gray-700">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-2" />
        <h3 className="font-bold text-gray-900 dark:text-white">Admin Access Restricted</h3>
        <p className="text-xs text-gray-500 mt-1">Please log in using authenticated credentials with Admin clearance (e.g. digitalgallery7.24@gmail.com)</p>
      </div>
    );
  }

  // SMM Analytics helper metrics
  const totalSales = transactions
    .filter(t => t.type === 'deposit' && t.status === 'approved')
    .reduce((sum, current) => sum + current.amount, 0);

  const pendingPaymentsNum = transactions.filter(t => t.type === 'deposit' && t.status === 'pending').length;
  const pendingTicketsNum = tickets.filter(t => t.status === 'open').length;

  // Sync state variables back to settings if they were loaded in the background
  const syncSettingsInputStates = () => {
    setSiteBn(settings.siteNameBn);
    setSiteEn(settings.siteNameEn);
    setAnnBn(settings.announcementBn);
    setAnnEn(settings.announcementEn);
    setPTitleBn(settings.promoBanner.titleBn);
    setPTitleEn(settings.promoBanner.titleEn);
    setPDescBn(settings.promoBanner.subtitleBn);
    setPDescEn(settings.promoBanner.subtitleEn);
    setCEmail(settings.contactEmail);
    setCPhone(settings.contactPhone);
    setCommRate(settings.referrerCommissionPercent);
  };

  // Force Supabase seeds synchronization handler
  const handleSupabaseCloudForceSync = async () => {
    setCloudMessage(null);
    const result = await syncAllToSupabase();
    if (result.success) {
      setCloudMessage({ text: result.message, error: false });
    } else {
      setCloudMessage({ text: result.message, error: true });
    }
  };

  // CRUD SMM Services triggers
  const handleCreateOrEditService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvNameBn || !srvNameEn || !srvCatId) {
      alert('Complete all required SMM configuration variables!');
      return;
    }

    const payload = {
      categoryId: srvCatId,
      nameBn: srvNameBn,
      nameEn: srvNameEn,
      descriptionBn: srvDescBn || 'প্রিমিয়াম কোয়ালিটি সার্ভিস প্যাক দ্রুত ডেলিভারি',
      descriptionEn: srvDescEn || 'Premium high-speed engagement parameters',
      pricePerUnit: srvPrice,
      minQuantity: srvMin,
      maxQuantity: srvMax,
      featured: true,
      deliveryTimeBn: srvTimeBn,
      deliveryTimeEn: srvTimeEn,
      inputTypeLabelBn: 'টার্গেট লিংক',
      inputTypeLabelEn: 'Target Link URL',
      inputTypePlaceholderBn: 'লিংক যুক্ত করুন...',
      inputTypePlaceholderEn: 'https://...'
    };

    if (editingSrvId) {
      editService(editingSrvId, payload);
      alert('SMM Service updated successfully!');
      setEditingSrvId(null);
    } else {
      addService(payload);
      alert('New SMM Service published successfully!');
    }

    // Reset Form Input nodes
    setSrvNameBn('');
    setSrvNameEn('');
    setSrvDescBn('প্রিমিয়াম কোয়ালিটি সার্ভিস প্যাক দ্রুত ডেলিভারি');
    setSrvDescEn('Premium high-speed engagement parameters');
    setSrvPrice(0.1);
    setSrvMin(100);
    setSrvMax(50000);
  };

  const loadServiceToEdit = (srv: Service) => {
    setEditingSrvId(srv.id);
    setSrvNameBn(srv.nameBn);
    setSrvNameEn(srv.nameEn);
    setSrvCatId(srv.categoryId);
    setSrvPrice(srv.pricePerUnit);
    setSrvMin(srv.minQuantity);
    setSrvMax(srv.maxQuantity);
    setSrvTimeBn(srv.deliveryTimeBn);
    setSrvTimeEn(srv.deliveryTimeEn);
    setSrvDescBn(srv.descriptionBn);
    setSrvDescEn(srv.descriptionEn);
  };

  // CRUD SMM Categories triggers
  const handleCreateOrEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameBn || !catNameEn) return;

    const payload = {
      nameBn: catNameBn,
      nameEn: catNameEn,
      descriptionBn: catDescBn || 'সবচেয়ে স্থিতিশীল সার্ভিস প্যাকসমূহ',
      descriptionEn: catDescEn || 'High retention stable service packages',
      iconName: 'Server'
    };

    if (editingCatId) {
      editCategory(editingCatId, payload);
      alert('Category modified successfully!');
      setEditingCatId(null);
    } else {
      addCategory(payload);
      alert('New Category added successfully!');
    }

    setCatNameBn('');
    setCatNameEn('');
    setCatDescBn('');
    setCatDescEn('');
  };

  const loadCategoryToEdit = (cat: Category) => {
    setEditingCatId(cat.id);
    setCatNameBn(cat.nameBn);
    setCatNameEn(cat.nameEn);
    setCatDescBn(cat.descriptionBn);
    setCatDescEn(cat.descriptionEn);
  };

  // CRUD SMM Coupons triggers
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpCode || cpDiscount <= 0) return;

    const newCp: Coupon = {
      id: `cp-${Math.floor(1000 + Math.random() * 9000)}`,
      code: cpCode.toUpperCase().trim(),
      discountPercent: cpDiscount,
      minOrderAmount: cpMinOrder,
      expiryDate: cpExpiry || '2026-12-31',
      active: true
    };

    addCoupon(newCp);
    alert('Promo coupon added successfully!');
    setCpCode('');
    setCpDiscount(10);
  };

  // CRUD Blogs triggers
  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitleBn || !blogTitleEn || !blogContentBn) {
      alert('Please fill out all required blog fields.');
      return;
    }

    addBlog({
      titleBn: blogTitleBn,
      titleEn: blogTitleEn,
      contentBn: blogContentBn,
      contentEn: blogContentEn,
      categoryBn: blogCatBn,
      categoryEn: blogCatEn,
      imageUrl: blogImg || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600'
    });

    alert('Guide blog published to public views successfully!');
    setBlogTitleBn('');
    setBlogTitleEn('');
    setBlogContentBn('');
    setBlogContentEn('');
  };

  // Save Site settings
  const handleUpdateSystemSettings = () => {
    updateSettings({
      ...settings,
      siteNameBn: siteBn,
      siteNameEn: siteEn,
      announcementBn: annBn,
      announcementEn: annEn,
      contactEmail: cEmail,
      contactPhone: cPhone,
      referrerCommissionPercent: commRate,
      promoBanner: {
        ...settings.promoBanner,
        titleBn: pTitleBn,
        titleEn: pTitleEn,
        subtitleBn: pDescBn,
        subtitleEn: pDescEn
      }
    });
    alert('Global settings stored to storage buffers!');
  };

  const handlePostNotification = () => {
    if (!sysAlertText) return;
    addNotification(sysAlertText);
    setSysAlertText('');
    alert('Broadcast notification queued!');
  };

  const handleAdminTicketReply = (id: string) => {
    if (!adminTicketReplyText) return;
    replyToTicket(id, adminTicketReplyText, true);
    setAdminTicketReplyText('');
  };

  const handleAdjustBalance = (userId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!topupAmount || topupAmount === 0) return;
    updateUserBalance(userId, topupAmount);
    alert(`Wallet balance adjusted by ${topupAmount} BDT successfully!`);
    setUserIdToTopup(null);
    setTopupAmount(100);
  };

  const handleToggleUserAdminRole = (userObj: UserProfile) => {
    const nextRole = userObj.role === 'admin' ? 'user' : 'admin';
    if (confirm(`Convert '${userObj.name}' user privilege to '${nextRole.toUpperCase()}'?`)) {
      updateUserRole(userObj.id, nextRole);
      alert('Role altered successfully!');
    }
  };

  const activeTicket = tickets.find(t => t.id === selectedTicketId);

  // Search filter for clients
  const searchedUsers = users.filter(user => 
    user.name.toLowerCase().includes(userSearchText.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchText.toLowerCase()) ||
    user.id.toLowerCase().includes(userSearchText.toLowerCase())
  );

  return (
    <div id="admin-dashboard-view" className="space-y-10 pb-12">
      
      {/* Admin Title panel */}
      <section id="admin-portal-header" className="p-6 md:p-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 rounded-3xl text-white border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-15">
          <Database className="w-40 h-40" />
        </div>
        <span className="bg-rose-500 text-white text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full mb-3 inline-block">
          Brand Admin Studio
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-indigo-300">
          ⚙️ {t.adminDashboardTitle}
        </h1>
        <p className="text-xs text-slate-300 mt-2 max-w-xl leading-relaxed">
          Welcome to the a-to-z administrative control panel. Here you can edit details, topup balances, manage catalogs, design coupons, reply to tickets, and sync datasets to Supabase.
        </p>
        <p className="text-[10px] text-gray-400 mt-3 uppercase font-mono tracking-widest">
          ADMIN SLOTS: {currentUser.email} • PLATFORM: DIGITAL GALLERY
        </p>
      </section>

      {/* Admin Submenu Tabs */}
      <div id="admin-tabs" className="flex flex-wrap gap-2 text-xs font-semibold border-b pb-3 border-gray-150">
        <button
          onClick={() => setActiveAdminSec('analytics')}
          className={`cursor-pointer px-4 py-2.5 rounded-xl border transition-all ${activeAdminSec === 'analytics' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-150 text-gray-700 hover:bg-gray-50 dark:bg-gray-800'}`}
        >
          📊 {t.adminAnalytics}
        </button>

        <button
          onClick={() => setActiveAdminSec('deposits')}
          className={`cursor-pointer px-4 py-2.5 rounded-xl border transition-all flex items-center gap-1.5 ${activeAdminSec === 'deposits' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-150 text-gray-700 hover:bg-gray-50 dark:bg-gray-800'}`}
        >
          <span>💳 Deposits Log</span>
          {pendingPaymentsNum > 0 && <span className="bg-rose-500 text-white font-mono rounded-full w-4.5 h-4.5 flex items-center justify-center text-[10px] scale-90">{pendingPaymentsNum}</span>}
        </button>

        <button
          onClick={() => setActiveAdminSec('orders')}
          className={`cursor-pointer px-4 py-2.5 rounded-xl border transition-all ${activeAdminSec === 'orders' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-150 text-gray-700 hover:bg-gray-50 dark:bg-gray-800'}`}
        >
          📦 Orders Queue
        </button>

        <button
          onClick={() => setActiveAdminSec('services')}
          className={`cursor-pointer px-4 py-2.5 rounded-xl border transition-all ${activeAdminSec === 'services' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-150 text-gray-700 hover:bg-gray-50 dark:bg-gray-800'}`}
        >
          🛠️ Services & Cats
        </button>

        <button
          onClick={() => setActiveAdminSec('users')}
          className={`cursor-pointer px-4 py-2.5 rounded-xl border transition-all flex items-center gap-1 ${activeAdminSec === 'users' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-150 text-gray-700 hover:bg-gray-50 dark:bg-gray-800'}`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Client List</span>
        </button>

        <button
          onClick={() => setActiveAdminSec('coupons_blogs')}
          className={`cursor-pointer px-4 py-2.5 rounded-xl border transition-all flex items-center gap-1 ${activeAdminSec === 'coupons_blogs' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-150 text-gray-700 hover:bg-gray-50 dark:bg-gray-800'}`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>Promos & Blogs</span>
        </button>

        <button
          onClick={() => setActiveAdminSec('tickets')}
          className={`cursor-pointer px-4 py-2.5 rounded-xl border transition-all flex items-center gap-1.5 ${activeAdminSec === 'tickets' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-150 text-gray-700 hover:bg-gray-50 dark:bg-gray-800'}`}
        >
          <span>🎟️ Helptickets</span>
          {pendingTicketsNum > 0 && <span className="bg-amber-500 text-white font-mono rounded-full w-4.5 h-4.5 flex items-center justify-center text-[10px] scale-90">{pendingTicketsNum}</span>}
        </button>

        <button
          onClick={() => {
            setActiveAdminSec('settings');
            syncSettingsInputStates();
          }}
          className={`cursor-pointer px-4 py-2.5 rounded-xl border transition-all flex items-center gap-1 ${activeAdminSec === 'settings' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-150 text-gray-700 hover:bg-gray-50 dark:bg-gray-800'}`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Site settings</span>
        </button>
      </div>

      {/* SEC 1: ANALYTICS */}
      {activeAdminSec === 'analytics' && (
        <div id="admin-overview-panel" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-150 rounded-2xl p-6 dark:bg-gray-800 flex items-center gap-4 shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-[11px] text-gray-400 font-bold uppercase">{t.adminTotalSales}</span>
                <p className="text-2xl font-black font-mono tracking-tight text-gray-900 dark:text-white">{settings.currencySymbol}{totalSales}</p>
              </div>
            </div>

            <div className="bg-white border border-gray-150 rounded-2xl p-6 dark:bg-gray-800 flex items-center gap-4 shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                <ListOrdered className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-[11px] text-gray-400 font-bold uppercase">{t.adminTotalOrders}</span>
                <p className="text-2xl font-black font-mono tracking-tight text-gray-900 dark:text-white">{orders.length}</p>
              </div>
            </div>

            <div className="bg-white border border-gray-150 rounded-2xl p-6 dark:bg-gray-800 flex items-center gap-4 shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-[11px] text-gray-400 font-bold uppercase">{lang === 'bn' ? 'মোট নিবন্ধিত গ্রাহক' : 'Total Customers'}</span>
                <p className="text-2xl font-black font-mono tracking-tight text-gray-900 dark:text-white">{users.length}</p>
              </div>
            </div>
          </div>

          {/* Quick Notification alert broadcast section */}
          <section id="admin-broadcast-alert" className="p-6 bg-white border border-gray-150 rounded-2xl dark:bg-gray-800 space-y-4">
            <div>
              <h3 className="font-extrabold text-gray-900 dark:text-white text-base">
                {t.adminNotificationTitle}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {t.adminNotificationDesc}
              </p>
            </div>
            
            <div className="flex gap-2 max-w-xl">
              <input
                id="sys-alert-input"
                type="text"
                placeholder="e.g. বিকাশ ও রকেট ক্যাশআউট সেশনগুলোতে রিকোয়েস্ট ইনস্ট্যান্ট প্রসেস হচ্ছে!"
                value={sysAlertText}
                onChange={(e) => setSysAlertText(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-xs dark:bg-gray-900 dark:border-gray-700 dark:text-white"
              />
              <button
                id="sys-alert-submit-btn"
                onClick={handlePostNotification}
                className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.adminActionUpdateStatus}</span>
              </button>
            </div>
          </section>
        </div>
      )}

      {/* SEC 2: MANAGE MANUAL DEPOSITS (PAYMENTS) */}
      {activeAdminSec === 'deposits' && (
        <section id="deposit-auditer-panel" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white text-base">
              {lang === 'bn' ? 'গ্রাহকদের পেমেন্ট এবং ওয়ালেট টপআপ তালিকা' : 'Deposit approvals & wallet audits'}
            </h3>
            <span className="text-xs text-gray-400 font-mono font-bold">ACTIONS ACTIVE</span>
          </div>

          {transactions.filter(t => t.status === 'pending').length === 0 ? (
            <div className="p-8 text-center bg-white border border-gray-150 rounded-2xl dark:bg-gray-800 dark:border-gray-700">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400">{lang === 'bn' ? 'কোনো মুলতুবি পেমেন্ট রিকোয়েস্ট নেই!' : 'Excellent! Zero pending deposit recharges to verify.'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.filter(t => t.status === 'pending').map((tx) => (
                <div key={tx.id} id={`pending-deposit-card-${tx.id}`} className="bg-white border border-gray-150 rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 dark:bg-gray-800 dark:border-gray-700">
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-gray-900 dark:text-white">USER-ID: {tx.userId} • RECHARGE: {settings.currencySymbol}{tx.amount}</p>
                    <p className="font-mono text-gray-500 leading-none">GATEWAY: {tx.method} • TRX-ID: {tx.transactionId ? tx.transactionId.toUpperCase() : 'N/A'} • SENDER: {tx.senderNumber || 'N/A'}</p>
                    <span className="text-[10px] text-gray-400 font-mono italic">{new Date(tx.createdAt).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      id={`approve-btn-${tx.id}`}
                      onClick={() => approvePayment(tx.id)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{t.adminActionApprove}</span>
                    </button>
                    <button
                      id={`reject-btn-${tx.id}`}
                      onClick={() => rejectPayment(tx.id)}
                      className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{t.adminActionReject}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* SEC 3: MANAGE ORDER STATES */}
      {activeAdminSec === 'orders' && (
        <section id="admin-orders-list" className="space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-base">
            {lang === 'bn' ? 'অর্ডার প্রসেসিং ও ডেলিভারি আপডেট প্যানেল' : 'Live Order tracking & delivery states manager'}
          </h3>

          <div className="overflow-x-auto rounded-xl border border-gray-150 bg-white dark:bg-gray-800 dark:border-gray-700">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-750 font-bold text-gray-700 border-b border-gray-150 dark:text-gray-300">
                  <th className="p-3">ORD-ID</th>
                  <th className="p-3">BUYER</th>
                  <th className="p-3">SERVICE-ID</th>
                  <th className="p-3">TARGET URL</th>
                  <th className="p-3">PRICE</th>
                  <th className="p-3">STATUS</th>
                  <th className="p-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 font-medium">
                {orders.map((ord) => (
                  <tr key={ord.id} id={`admin-ord-row-${ord.id}`} className="hover:bg-gray-50/50">
                    <td className="p-3 font-mono font-bold text-gray-800 dark:text-gray-200">{ord.id}</td>
                    <td className="p-3 font-semibold truncate max-w-[120px]">{ord.userId || ord.guestEmail || 'Guest'}</td>
                    <td className="p-3 max-w-[120px] truncate">{ord.serviceId}</td>
                    <td className="p-3 text-blue-600 underline truncate max-w-[150px]"><a href={ord.targetLink} target="_blank" rel="noopener noreferrer">{ord.targetLink}</a></td>
                    <td className="p-3 font-mono">{settings.currencySymbol}{ord.totalPrice}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                        ord.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : ord.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-500'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1.5 flex-wrap">
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'processing')}
                          className="bg-indigo-50 hover:bg-slate-100 border border-indigo-200 text-indigo-600 font-bold text-[9px] py-1 px-2 rounded cursor-pointer transition-colors"
                        >
                          Process
                        </button>
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'completed')}
                          className="bg-emerald-50 hover:bg-slate-100 border border-emerald-200 text-emerald-600 font-bold text-[9px] py-1 px-2 rounded cursor-pointer transition-colors"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'cancelled')}
                          className="bg-rose-50 hover:bg-red-100 border border-rose-200 text-rose-500 font-bold text-[9px] py-1 px-2 rounded cursor-pointer transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'refunded')}
                          className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-600 font-bold text-[9px] py-1 px-2 rounded cursor-pointer transition-colors"
                        >
                          Refund
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* SEC 4: SERVICE MANAGEMENT & CATEGORY CUSTOM CRUD */}
      {activeAdminSec === 'services' && (
        <section id="services-crud-workspace" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Create & Edit SMM Service + SMM Category panel */}
          <div className="md:col-span-5 space-y-6">
            
            <div className="bg-white border border-gray-150 rounded-2xl p-5 dark:bg-gray-800 dark:border-gray-700 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1 text-indigo-600 uppercase">
                  {editingSrvId ? <Edit3 className="w-4 h-4 text-amber-500" /> : <Plus className="w-4 h-4" />}
                  <span>{editingSrvId ? 'Edit Selected Service' : t.addSmmService || 'Add Smm Service'}</span>
                </h3>
                {editingSrvId && (
                  <button onClick={() => setEditingSrvId(null)} className="text-[10px] text-rose-500 underline font-bold cursor-pointer">
                    Cancel Edit
                  </button>
                )}
              </div>

              <form id="create-service-form" onSubmit={handleCreateOrEditService} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5 col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase font-mono">Service Name (Bangla)</label>
                    <input
                      id="cs-name-bn"
                      type="text"
                      required
                      placeholder="e.g. ফেসবুক অর্গানিক পেইজ লাইক"
                      value={srvNameBn}
                      onChange={(e) => setSrvNameBn(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase font-mono">Service Name (English)</label>
                    <input
                      id="cs-name-en"
                      type="text"
                      required
                      placeholder="e.g. Facebook High Retention Page Likes"
                      value={srvNameEn}
                      onChange={(e) => setSrvNameEn(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase font-mono">Short Description (English)</label>
                    <textarea
                      value={srvDescEn}
                      onChange={(e) => setSrvDescEn(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase font-mono">Short Description (Bangla)</label>
                    <textarea
                      value={srvDescBn}
                      onChange={(e) => setSrvDescBn(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5 animate-pulse">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase font-mono">Category</label>
                    <select
                      id="cs-cat"
                      required
                      value={srvCatId}
                      onChange={(e) => setSrvCatId(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white dark:bg-gray-950 dark:border-gray-750 dark:text-white"
                    >
                      <option value="">Select...</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{lang === 'bn' ? c.nameBn : c.nameEn}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase font-mono">Rate (Per 1000 Units)</label>
                    <input
                      id="cs-price"
                      type="number"
                      step="0.01"
                      required
                      value={srvPrice}
                      onChange={(e) => setSrvPrice(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase font-mono">Min Quality</label>
                    <input
                      id="cs-min"
                      type="number"
                      required
                      value={srvMin}
                      onChange={(e) => setSrvMin(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase font-mono">Max Capacity</label>
                    <input
                      id="cs-max"
                      type="number"
                      required
                      value={srvMax}
                      onChange={(e) => setSrvMax(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase font-mono">Delivery Time (Bn)</label>
                    <input
                      type="text"
                      required
                      value={srvTimeBn}
                      onChange={(e) => setSrvTimeBn(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase font-mono">Delivery Time (En)</label>
                    <input
                      type="text"
                      required
                      value={srvTimeEn}
                      onChange={(e) => setSrvTimeEn(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700"
                    />
                  </div>
                </div>

                <button
                  id="create-service-submit-btn"
                  type="submit"
                  className="w-full cursor-pointer bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-2 rounded-xl text-xs uppercase shadow transition-colors flex items-center justify-center gap-1.5"
                >
                  {editingSrvId ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{editingSrvId ? 'Save SMM Service Package' : 'Publish SMM Service'}</span>
                </button>
              </form>
            </div>

            {/* Category creation panel (CRUD) */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 dark:bg-gray-800 dark:border-gray-700 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="font-bold text-gray-900 dark:text-white text-xs flex items-center gap-1.5 text-emerald-600 uppercase">
                  {editingCatId ? <Edit3 className="w-4 h-4 text-amber-500" /> : <Plus className="w-4 h-4" />}
                  <span>{editingCatId ? 'Edit SMM Category' : 'Create New Category'}</span>
                </h4>
                {editingCatId && (
                  <button onClick={() => setEditingCatId(null)} className="text-[10px] text-rose-500 underline font-bold cursor-pointer">
                    Cancel Edit
                  </button>
                )}
              </div>

              <form id="create-category-form" onSubmit={handleCreateOrEditCategory} className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="col-span-2 gap-2">
                    <label className="block text-[9px] font-mono text-gray-400 font-bold uppercase mb-1">Bangla Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ফেসবুক সার্ভিসেস"
                      value={catNameBn}
                      onChange={(e) => setCatNameBn(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[9px] font-mono text-gray-400 font-bold uppercase mb-1">English Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Facebook Services"
                      value={catNameEn}
                      onChange={(e) => setCatNameEn(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[9px] font-mono text-gray-400 font-bold uppercase mb-1">Bangla Subtitle</label>
                    <input
                      type="text"
                      placeholder="ফলোয়ার, লাইক এবং ভিডিও ভিউ..."
                      value={catDescBn}
                      onChange={(e) => setCatDescBn(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[9px] font-mono text-gray-400 font-bold uppercase mb-1">English Subtitle</label>
                    <input
                      type="text"
                      placeholder="Boost organic followers & views..."
                      value={catDescEn}
                      onChange={(e) => setCatDescEn(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900"
                    />
                  </div>
                </div>

                <button
                  id="category-submit-btn"
                  type="submit"
                  className="w-full cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 text-white font-bold py-2 rounded-lg text-xs flex justify-center items-center gap-1.5"
                >
                  {editingCatId ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{editingCatId ? 'Save Category Item' : 'Add SMM Category'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Active SMM Database libraries lists (services & categories) */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Category list editor workspace */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 dark:bg-gray-800 dark:border-gray-700 space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-1 text-indigo-500">
                <Bookmark className="w-4 h-4" />
                <span>Categories Catalog Editor ({categories.length})</span>
              </h3>

              <div className="space-y-2 max-h-[220px] overflow-y-auto">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-3 bg-gray-50 border border-gray-150 rounded-xl flex items-center justify-between gap-3 text-xs dark:bg-gray-900 dark:border-gray-750">
                    <div className="truncate">
                      <p className="font-bold text-gray-800 dark:text-gray-200">
                        {cat.nameEn} <span className="text-gray-400 font-normal">({cat.nameBn})</span>
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono">ID: {cat.id} • Slug: {cat.slug}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => loadCategoryToEdit(cat)}
                        className="p-1 px-2 text-[10px] font-bold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this category and SMM files?')) {
                            deleteCategory(cat.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 transition-colors cursor-pointer"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SMM Services Catalog list editor */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 dark:bg-gray-800 dark:border-gray-700 space-y-4 font-normal">
              <h3 className="font-bold text-indigo-950 dark:text-white text-sm flex items-center gap-1.5">
                <Settings className="w-4.5 h-4.5 text-indigo-600" />
                <span>Digital Services Catalog Editor ({services.length})</span>
              </h3>

              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {services.map((srv) => (
                  <div key={srv.id} id={`srv-crud-node-${srv.id}`} className="p-3 bg-gray-50 border border-gray-150 rounded-xl flex items-center justify-between gap-3 text-xs dark:bg-gray-900 dark:border-gray-750 hover:border-indigo-400 transition-all">
                    <div className="truncate space-y-0.5">
                      <p className="font-bold text-gray-800 dark:text-gray-200 truncate">{lang === 'bn' ? srv.nameBn : srv.nameEn}</p>
                      <p className="font-mono text-[9px] text-gray-400">
                        ID: {srv.id} • PRICE: {settings.currencySymbol}{srv.pricePerUnit} • CAT: {srv.categoryId}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate italic">{srv.descriptionEn}</p>
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => loadServiceToEdit(srv)}
                        className="p-1 px-2 text-[10px] font-bold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        id={`delete-srv-btn-${srv.id}`}
                        onClick={() => {
                          if (confirm('Delete this SMM service package forever?')) {
                            deleteService(srv.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 cursor-pointer transition-colors"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SEC 5: THE CLIENT MANAGEMENT PORTAL */}
      {activeAdminSec === 'users' && (
        <section id="users-manager-portal" className="bg-white border border-gray-150 rounded-2xl p-6 dark:bg-gray-800 dark:border-gray-700 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h3 className="font-extrabold text-gray-900 dark:text-white text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>Client Accounts Panel & Wallet Recharges</span>
              </h3>
              <p className="text-xs text-gray-500 mt-1">Audit active profiles, change authorization clearance roles, or adjust BDT credits manual levels.</p>
            </div>

            <input
              type="text"
              placeholder="Search user email or ID..."
              value={userSearchText}
              onChange={(e) => setUserSearchText(e.target.value)}
              className="px-3.5 py-1.5 border rounded-lg text-xs dark:bg-gray-950 dark:border-gray-700 w-full max-w-xs"
            />
          </div>

          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700 font-bold border-b text-[11px] uppercase dark:bg-gray-750 dark:text-gray-300">
                  <th className="p-3">Client profile</th>
                  <th className="p-3">Clearance Access</th>
                  <th className="p-3">Ref ID CODE</th>
                  <th className="p-3">WALLET BALANCE</th>
                  <th className="p-3">RECHARGE ACTION</th>
                  <th className="p-3 text-right">ROLE SETTINGS</th>
                </tr>
              </thead>
              <tbody className="divide-y font-medium text-gray-800 dark:text-gray-200">
                {searchedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/40">
                    <td className="p-3">
                      <p className="font-bold">{user.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{user.email} • ID: {user.id}</p>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        user.role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-gray-150 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-gray-500">{user.referralCode}</td>
                    <td className="p-3 font-mono text-emerald-600 text-sm font-bold">
                      {settings.currencySymbol}{user.walletBalance.toFixed(2)}
                    </td>
                    <td className="p-3">
                      {userIdToTopup === user.id ? (
                        <form onSubmit={(e) => handleAdjustBalance(user.id, e)} className="flex items-center gap-1">
                          <input
                            type="number"
                            required
                            placeholder="Amount (e.g. 500 or -100)"
                            value={topupAmount}
                            onChange={(e) => setTopupAmount(Number(e.target.value))}
                            className="w-24 px-2 py-1 text-xs border rounded bg-white dark:bg-gray-900"
                          />
                          <button type="submit" className="bg-emerald-500 text-white font-bold p-1 px-2 rounded text-[10px]">
                            Apply
                          </button>
                          <button onClick={() => setUserIdToTopup(null)} className="text-[10px] text-rose-500 underline uppercase ml-1">
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <button
                          onClick={() => {
                            setUserIdToTopup(user.id);
                            setTopupAmount(100);
                          }}
                          className="bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-600 px-2.5 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          💸 Recharge BDT
                        </button>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {user.email !== currentUser.email ? (
                        <button
                          onClick={() => handleToggleUserAdminRole(user)}
                          className="text-[9px] font-bold uppercase transition-colors px-2 py-1 rounded border border-gray-300 hover:bg-gray-100 cursor-pointer"
                        >
                          Toggle Admin
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-400 italic">Self Account</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* SEC 6: PROMO COUPONS & BLOG CATALOG CRUD */}
      {activeAdminSec === 'coupons_blogs' && (
        <section id="custom-promo-blogs-workspace" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Coupon creation and listing panel */}
          <div className="md:col-span-5 bg-white border border-gray-150 rounded-2xl p-5 dark:bg-gray-800 dark:border-gray-700 space-y-5">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5 text-indigo-600 uppercase border-b pb-2">
              <Percent className="w-4 h-4" />
              <span>Promo Coupons Manager</span>
            </h3>

            <form onSubmit={handleCreateCoupon} className="space-y-3.5 pt-1">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase text-gray-400 font-mono font-bold">New Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OFF40"
                  value={cpCode}
                  onChange={(e) => setCpCode(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase text-gray-400 font-mono font-bold">Discount %</label>
                  <input
                    type="number"
                    required
                    value={cpDiscount}
                    onChange={(e) => setCpDiscount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase text-gray-400 font-mono font-bold">Min spent BDT</label>
                  <input
                    type="number"
                    required
                    value={cpMinOrder}
                    onChange={(e) => setCpMinOrder(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-xs uppercase transition-colors flex justify-center items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Promo coupon</span>
              </button>
            </form>

            <hr className="border-gray-100" />

            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase text-slate-400">Active promo listing ({coupons.length})</h4>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {coupons.map((cp) => (
                  <div key={cp.id} className="p-2.5 bg-gray-50 border border-gray-150 rounded-xl flex items-center justify-between text-xs dark:bg-gray-900">
                    <div>
                      <p className="font-bold font-mono text-indigo-600 text-sm leading-none">{cp.code}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-1">
                        GET {cp.discountPercent}% OFF • MIN: {settings.currencySymbol}{cp.minOrderAmount} BDT
                      </p>
                    </div>

                    <button
                      onClick={() => deleteCoupon(cp.id)}
                      className="p-1 px-1.5 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-lg cursor-pointer"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Blogs and Guides CRUD workspace */}
          <div className="md:col-span-7 bg-white border border-gray-150 rounded-2xl p-5 dark:bg-gray-800 dark:border-gray-700 space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5 text-indigo-600 uppercase border-b pb-2">
              <FileText className="w-4.5 h-4.5" />
              <span>SMM Training Guides & Blogs ({blogs.length})</span>
            </h3>

            <form onSubmit={handleCreateBlog} className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] text-gray-400 font-semibold">Title (English)</label>
                  <input
                    type="text"
                    required
                    placeholder="Grow Facebook Likes..."
                    value={blogTitleEn}
                    onChange={(e) => setBlogTitleEn(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border rounded-lg dark:bg-gray-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] text-gray-400 font-semibold">Title (Bangla)</label>
                  <input
                    type="text"
                    required
                    placeholder="পেইজ লাইক বাড়ানোর কৌশল..."
                    value={blogTitleBn}
                    onChange={(e) => setBlogTitleBn(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border rounded-lg dark:bg-gray-900"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="block text-[10px] text-gray-400 font-semibold">Content (English)</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Write details content..."
                    value={blogContentEn}
                    onChange={(e) => setBlogContentEn(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border rounded-lg dark:bg-gray-900"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="block text-[10px] text-gray-400 font-semibold">Content (Bangla)</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="বিস্তারিত বাংলা রিচ টেক্সট দিন..."
                    value={blogContentBn}
                    onChange={(e) => setBlogContentBn(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border rounded-lg dark:bg-gray-900"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="block text-[10px] text-gray-400">Illustration Image URL</label>
                  <input
                    type="text"
                    value={blogImg}
                    onChange={(e) => setBlogImg(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border rounded-lg dark:bg-gray-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white font-bold py-2 rounded-lg text-xs flex justify-center items-center gap-1.5 cursor-pointer uppercase shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish SMM Article</span>
              </button>
            </form>

            <hr className="border-gray-100" />

            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase text-slate-400">Active Articles Catalog</h4>
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
                {blogs.map((b) => (
                  <div key={b.id} className="p-3 bg-gray-50 border rounded-xl flex items-center justify-between text-xs dark:bg-gray-900">
                    <div className="truncate">
                      <p className="font-bold text-gray-800 truncate">{b.titleEn}</p>
                      <p className="text-[10px] text-gray-400 font-mono">Views: {b.views} • ID: {b.id}</p>
                    </div>

                    <button
                      onClick={() => deleteBlog(b.id)}
                      className="p-1.5 bg-rose-50 text-rose-500 rounded-lg cursor-pointer hover:bg-rose-100 transition-colors shrink-0"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SEC 7: INTERACTIVE SUPPORT TICKETS */}
      {activeAdminSec === 'tickets' && (
        <section id="admin-tickets-section" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Tickets lists */}
          <div className="md:col-span-5 bg-white border border-gray-150 rounded-2xl p-5 dark:bg-gray-800 dark:border-gray-700 space-y-4">
            <h3 className="font-extrabold text-gray-900 dark:text-white text-sm">
              🎫 Client Inquiries Inbox ({tickets.length})
            </h3>

            <div className="space-y-2.5 max-h-[400px] overflow-y-auto">
              {tickets.map((tck) => (
                <div
                  key={tck.id}
                  id={`admin-tck-node-${tck.id}`}
                  onClick={() => setSelectedTicketId(tck.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedTicketId === tck.id 
                      ? 'border-indigo-500 bg-indigo-50/15' 
                      : 'border-gray-150 bg-gray-50/50 hover:bg-gray-50'
                  }`}
                >
                  <p className="font-bold">{tck.subject}</p>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono mt-1">
                    <span>{tck.userName} • {tck.id}</span>
                    <span className={`px-1.5 py-0.5 rounded ${
                      tck.status === 'open' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {tck.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Ticket Conversation */}
          <div className="md:col-span-7 bg-white border border-gray-150 rounded-2xl p-5 dark:bg-gray-800 dark:border-gray-700 space-y-4">
            {activeTicket ? (
              <div id="admin-ticket-chat-panel" className="space-y-4">
                <div className="border-b pb-3 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-red-500 font-bold uppercase">PRIORITY: {activeTicket.priority}</span>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base mt-0.5">{activeTicket.subject}</h4>
                    <span className="text-xs text-gray-400">Opened by {activeTicket.userName}</span>
                  </div>
                  
                  <div className="flex gap-1.5 font-medium text-[10px]">
                    <button
                      onClick={() => updateTicketStatus(activeTicket.id, 'closed')}
                      className="bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-md text-gray-600 cursor-pointer"
                    >
                      Close Issue
                    </button>
                    <button
                      onClick={() => updateTicketStatus(activeTicket.id, 'answered')}
                      className="bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md text-emerald-600 cursor-pointer"
                    >
                      Mark Answered
                    </button>
                  </div>
                </div>

                {/* Messages stream scroller */}
                <div className="space-y-3 max-h-[250px] overflow-y-auto p-1.5 border rounded-xl bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
                  {activeTicket.messages.map((m, idx) => (
                    <div 
                      key={idx} 
                      id={`msg-bubble-${idx}`}
                      className={`p-3 rounded-xl max-w-[85%] text-xs ${
                        m.role === 'admin' 
                          ? 'bg-indigo-600 text-white ml-auto' 
                          : 'bg-white border border-gray-150 text-gray-800'
                      }`}
                    >
                      <p className="font-bold text-[10px] opacity-80 mb-0.5">{m.senderName}</p>
                      <p className="leading-relaxed whitespace-pre-line">{m.message}</p>
                      <span className="block text-[8px] opacity-70 font-mono text-right mt-1">{new Date(m.createdAt).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>

                {/* Message input */}
                <div className="flex gap-2">
                  <input
                    id="admin-ticket-reply-input"
                    type="text"
                    placeholder="Write executive answer reply..."
                    value={adminTicketReplyText}
                    onChange={(e) => setAdminTicketReplyText(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                  <button
                    id="admin-ticket-reply-btn"
                    onClick={() => handleAdminTicketReply(activeTicket.id)}
                    className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 p-12">
                <HelpCircle className="w-12 h-12 mx-auto text-gray-300 mb-2 animate-bounce" />
                <p className="text-xs">Select a customer helpticket from the inbox to audit logs and message answers.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* SEC 8: GLOBAL CONFIGURATIONS & SUPABASE INTEGRATION */}
      {activeAdminSec === 'settings' && (
        <div className="space-y-8">
          
          {/* Supabase connection dashboard box */}
          <section id="supabase-cloud-config-box" className="bg-slate-900 text-slate-100 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 font-mono font-black text-slate-800 text-8xl select-none leading-none scale-105 pointer-events-none">
              DB
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-400/20 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base tracking-tight leading-none text-white">Supabase Cloud Database Hub</h3>
                <p className="text-xs text-slate-400 mt-1">Real-time persistence layer connectivity logs.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-[11px] pt-1 leading-relaxed">
              <div className="space-y-1">
                <span className="text-slate-500 block uppercase font-bold">Cloud Endpoint API URL</span>
                <span className="bg-slate-950 p-2 text-slate-300 border border-slate-800 rounded-lg block truncate max-w-full">
                  https://wdljamfelwrcgxltpoqt.supabase.co
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 block uppercase font-bold">Anon Public Access token</span>
                <span className="bg-slate-950 p-2 text-slate-300 border border-slate-800 rounded-lg block truncate max-w-full">
                  sb_publishable_rIwkUcg8bLEWHy9FKLLciQ_wn1JqqAS
                </span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 text-xs">
              <div>
                <p className="font-semibold text-white">Manual database synchronizer & Seeds backup</p>
                <p className="text-gray-400 text-[11px] leading-tight mt-0.5">Click sync to create schemas or copy your current client settings, catalogs, accounts directly into Supabase tables.</p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={handleSupabaseCloudForceSync}
                  disabled={isCloudLoading}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 text-white px-4 py-2 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCloudLoading ? 'animate-spin' : ''}`} />
                  <span>{isCloudLoading ? 'Syncing...' : 'Sync All Tables to Supabase'}</span>
                </button>
              </div>
            </div>

            {cloudMessage && (
              <div className={`p-4 rounded-xl flex items-center gap-2 text-xs font-semibold ${cloudMessage.error ? 'bg-red-950/40 border border-red-500/20 text-red-300' : 'bg-emerald-950/40 border border-emerald-500/20 text-emerald-300'}`}>
                {cloudMessage.error ? <XCircle className="w-4 h-4 shrink-0 text-red-400" /> : <Check className="w-4 h-4 shrink-0 text-emerald-400" />}
                <p className="leading-tight">{cloudMessage.text}</p>
              </div>
            )}
          </section>

          {/* Standard brand settings */}
          <section id="settings-form-panel" className="bg-white border border-gray-150 rounded-2xl p-6 dark:bg-gray-800 dark:border-gray-700 space-y-6 font-normal">
            <div className="space-y-1">
              <h3 className="font-extrabold text-gray-900 dark:text-white text-base flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-400" />
                <span>Branding details & Announcements</span>
              </h3>
              <p className="text-xs text-gray-500 mt-1">Configure global announcements, logos, contact slots and SMM affiliate commission values.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-4">
                <h4 className="font-bold text-sm tracking-tight border-b pb-1">Website Identity & Contacts</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">Site Name (Bangla)</label>
                    <input
                      type="text"
                      value={siteBn}
                      onChange={(e) => setSiteBn(e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs dark:bg-gray-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">Site Name (English)</label>
                    <input
                      type="text"
                      value={siteEn}
                      onChange={(e) => setSiteEn(e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs dark:bg-gray-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">Support Email</label>
                    <input
                      type="email"
                      value={cEmail}
                      onChange={(e) => setCEmail(e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs dark:bg-gray-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">Support Telephone</label>
                    <input
                      type="text"
                      value={cPhone}
                      onChange={(e) => setCPhone(e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs dark:bg-gray-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5 col-span-2">
                    <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">Affiliate Referral Commission (%)</label>
                    <input
                      type="number"
                      value={commRate}
                      onChange={(e) => setCommRate(Number(e.target.value))}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs dark:bg-gray-900"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">Announcements marquee (Bangla)</label>
                  <textarea
                    rows={2}
                    value={annBn}
                    onChange={(e) => setAnnBn(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs dark:bg-gray-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">Announcements marquee (English)</label>
                  <textarea
                    rows={2}
                    value={annEn}
                    onChange={(e) => setAnnEn(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs dark:bg-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-sm tracking-tight border-b pb-1">Marketing Promo Banner Settings</h4>
                
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">Banner Title (Bn)</label>
                  <input
                    type="text"
                    value={pTitleBn}
                    onChange={(e) => setPTitleBn(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs dark:bg-gray-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">Banner Title (En)</label>
                  <input
                    type="text"
                    value={pTitleEn}
                    onChange={(e) => setPTitleEn(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs dark:bg-gray-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">Banner Description (Bn)</label>
                  <textarea
                    rows={2}
                    value={pDescBn}
                    onChange={(e) => setPDescBn(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs dark:bg-gray-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">Banner Description (En)</label>
                  <textarea
                    rows={2}
                    value={pDescEn}
                    onChange={(e) => setPDescEn(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs dark:bg-gray-900"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleUpdateSystemSettings}
              className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 text-xs rounded-xl shadow-md transition-all mt-4"
            >
              {t.adminSaveBtn}
            </button>
          </section>
        </div>
      )}

    </div>
  );
};
