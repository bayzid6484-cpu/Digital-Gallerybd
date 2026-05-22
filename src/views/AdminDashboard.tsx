import React, { useState } from 'react';
import { useAppState } from '../lib/state';
import { 
  Key, Database, UserPlus, Trash, ChevronDown, CheckCircle, XCircle, 
  Settings, DollarSign, ListOrdered, ClipboardList, HelpCircle, AlertCircle, Plus, Send, Edit3
} from 'lucide-react';
import { Category, Service, Coupon, SupportTicket } from '../types';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser, orders, transactions, tickets, categories, services, settings, coupons, users,
    updateSettings, approvePayment, rejectPayment, updateOrderStatus, replyToTicket, updateTicketStatus,
    addService, editService, deleteService, addCategory, editCategory, deleteCategory, addCoupon, deleteCoupon,
    addNotification, lang, t
  } = useAppState();

  const [activeAdminSec, setActiveAdminSec] = useState<'analytics' | 'deposits' | 'orders' | 'services' | 'settings' | 'tickets'>('analytics');

  // Service Form Fields
  const [srvNameBn, setSrvNameBn] = useState('');
  const [srvNameEn, setSrvNameEn] = useState('');
  const [srvCatId, setSrvCatId] = useState('');
  const [srvPrice, setSrvPrice] = useState<number>(0.1);
  const [srvMin, setSrvMin] = useState<number>(100);
  const [srvMax, setSrvMax] = useState<number>(10000);
  const [srvTimeBn, setSrvTimeBn] = useState('১২ ঘণ্টা');
  const [srvTimeEn, setSrvTimeEn] = useState('12 Hours');

  // Settings Fields
  const [siteBn, setSiteBn] = useState(settings.siteNameBn);
  const [siteEn, setSiteEn] = useState(settings.siteNameEn);
  const [annBn, setAnnBn] = useState(settings.announcementBn);
  const [annEn, setAnnEn] = useState(settings.announcementEn);
  const [pTitleBn, setPTitleBn] = useState(settings.promoBanner.titleBn);
  const [pTitleEn, setPTitleEn] = useState(settings.promoBanner.titleEn);
  const [pDescBn, setPDescBn] = useState(settings.promoBanner.subtitleBn);
  const [pDescEn, setPDescEn] = useState(settings.promoBanner.subtitleEn);

  // Tickets support interactive selected
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [adminTicketReplyText, setAdminTicketReplyText] = useState('');

  // Notification announcement inputs
  const [sysAlertText, setSysAlertText] = useState('');

  // Category creation fields
  const [catNameBn, setCatNameBn] = useState('');
  const [catNameEn, setCatNameEn] = useState('');
  const [catDescBn, setCatDescBn] = useState('');
  const [catDescEn, setCatDescEn] = useState('');

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto p-8 text-center bg-white border border-gray-150 rounded-2xl dark:bg-gray-800 dark:border-gray-700">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-2" />
        <h3 className="font-bold text-gray-900 dark:text-white">Admin Access Restricted</h3>
        <p className="text-xs text-gray-500 mt-1">Please log in using an account with Administrative clearances (admin@test.com)</p>
      </div>
    );
  }

  // Analytics helper metrics
  const totalSales = transactions
    .filter(t => t.type === 'deposit' && t.status === 'approved')
    .reduce((sum, current) => sum + current.amount, 0);

  const pendingPaymentsNum = transactions.filter(t => t.type === 'deposit' && t.status === 'pending').length;
  const pendingTicketsNum = tickets.filter(t => t.status === 'open').length;

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvNameBn || !srvNameEn || !srvCatId) {
      alert('Complete all required field variables!');
      return;
    }

    addService({
      categoryId: srvCatId,
      nameBn: srvNameBn,
      nameEn: srvNameEn,
      descriptionBn: 'প্রিমিয়াম কোয়ালিটি সার্ভিস প্যাক দ্রুত ডেলিভারি',
      descriptionEn: 'Premium high-speed engagement parameters',
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
    });

    // Reset
    setSrvNameBn('');
    setSrvNameEn('');
    alert('SMM Service added successfully!');
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameBn || !catNameEn) return;

    addCategory({
      nameBn: catNameBn,
      nameEn: catNameEn,
      descriptionBn: catDescBn || 'প্রিমিয়াম সার্ভিস',
      descriptionEn: catDescEn || 'Premium SMM Services',
      iconName: 'Server'
    });

    setCatNameBn('');
    setCatNameEn('');
    setCatDescBn('');
    setCatDescEn('');
    alert('Category created successfully!');
  };

  const handleUpdateSystemSettings = () => {
    updateSettings({
      ...settings,
      siteNameBn: siteBn,
      siteNameEn: siteEn,
      announcementBn: annBn,
      announcementEn: annEn,
      promoBanner: {
        ...settings.promoBanner,
        titleBn: pTitleBn,
        titleEn: pTitleEn,
        subtitleBn: pDescBn,
        subtitleEn: pDescEn
      }
    });
    alert('System settings altered and saved!');
  };

  const handlePostNotification = () => {
    if (!sysAlertText) return;
    addNotification(sysAlertText);
    setSysAlertText('');
    alert('System banner alert posted successfully!');
  };

  const handleAdminTicketReply = (id: string) => {
    if (!adminTicketReplyText) return;
    replyToTicket(id, adminTicketReplyText, true);
    setAdminTicketReplyText('');
  };

  const activeTicket = tickets.find(t => t.id === selectedTicketId);

  return (
    <div id="admin-dashboard-view" className="space-y-10 pb-12">
      
      {/* Admin Title panel */}
      <section id="admin-portal-header" className="p-6 md:p-8 bg-gradient-to-br from-indigo-950 to-gray-900 rounded-3xl text-white border border-indigo-500/20">
        <h1 className="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-indigo-300">
          ⚙️ {t.adminDashboardTitle}
        </h1>
        <p className="text-xs text-gray-400 mt-1 uppercase font-mono tracking-widest">
          SYSTEM ACTIVE NODE: CLOUD_RUN • ACCESS TYPE: ADMIN_BYPASS
        </p>
      </section>

      {/* Admin Submenu Tabs */}
      <div id="admin-tabs" className="flex flex-wrap gap-2.5 max-w-full overflow-x-auto text-xs font-semibold">
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
          <span>💳 {t.adminPendingPayments}</span>
          {pendingPaymentsNum > 0 && <span className="bg-rose-500 text-white font-mono rounded-full w-4.5 h-4.5 flex items-center justify-center text-[10px] scale-90">{pendingPaymentsNum}</span>}
        </button>

        <button
          onClick={() => setActiveAdminSec('orders')}
          className={`cursor-pointer px-4 py-2.5 rounded-xl border transition-all ${activeAdminSec === 'orders' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-150 text-gray-700 hover:bg-gray-50 dark:bg-gray-800'}`}
        >
          📦 {t.adminOrderMgmt}
        </button>

        <button
          onClick={() => setActiveAdminSec('services')}
          className={`cursor-pointer px-4 py-2.5 rounded-xl border transition-all ${activeAdminSec === 'services' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-150 text-gray-700 hover:bg-gray-50 dark:bg-gray-800'}`}
        >
          🛠️ {t.adminServiceMgmt}
        </button>

        <button
          onClick={() => setActiveAdminSec('settings')}
          className={`cursor-pointer px-4 py-2.5 rounded-xl border transition-all ${activeAdminSec === 'settings' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-150 text-gray-700 hover:bg-gray-50 dark:bg-gray-800'}`}
        >
          🛠️ Site Settings
        </button>

        <button
          onClick={() => setActiveAdminSec('tickets')}
          className={`cursor-pointer px-4 py-2.5 rounded-xl border transition-all flex items-center gap-1.5 ${activeAdminSec === 'tickets' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-150 text-gray-700 hover:bg-gray-50 dark:bg-gray-800'}`}
        >
          <span>🎟️ Helptickets</span>
          {pendingTicketsNum > 0 && <span className="bg-amber-500 text-white font-mono rounded-full w-4.5 h-4.5 flex items-center justify-center text-[10px] scale-90">{pendingTicketsNum}</span>}
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
                    <p className="font-mono text-gray-500 leading-none">GATEWAY: {tx.method} • TRX-ID: {tx.transactionId.toUpperCase()} • SENDER: {tx.senderNumber || 'N/A'}</p>
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
                  <th className="p-3">PRICE</th>
                  <th className="p-3">STATUS</th>
                  <th className="p-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 font-medium">
                {orders.map((ord) => (
                  <tr key={ord.id} id={`admin-ord-row-${ord.id}`} className="hover:bg-gray-50/50">
                    <td className="p-3 font-mono font-bold text-gray-800 dark:text-gray-200">{ord.id}</td>
                    <td className="p-3 font-semibold">{ord.userId || ord.guestEmail || 'Guest'}</td>
                    <td className="p-3 max-w-[120px] truncate">{ord.serviceId}</td>
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* SEC 4: SERVICE MANAGEMENT & CRUD */}
      {activeAdminSec === 'services' && (
        <section id="services-crud-workspace" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Create Service form panel */}
          <div className="md:col-span-4 bg-white border border-gray-150 rounded-2xl p-5 dark:bg-gray-800 dark:border-gray-700 space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1 text-emerald-600">
              <Plus className="w-4 h-4" />
              <span>{t.adminAddService}</span>
            </h3>

            <form id="create-service-form" onSubmit={handleCreateService} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-400 uppercase font-mono">{t.adminServiceNameBn}</label>
                <input
                  id="cs-name-bn"
                  type="text"
                  required
                  placeholder="e.g. ফেসবুক অর্গানিক পেইজ লাইক"
                  value={srvNameBn}
                  onChange={(e) => setSrvNameBn(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-400 uppercase font-mono">{t.adminServiceNameEn}</label>
                <input
                  id="cs-name-en"
                  type="text"
                  required
                  placeholder="e.g. Facebook High Retention Page Likes"
                  value={srvNameEn}
                  onChange={(e) => setSrvNameEn(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase font-mono">Category</label>
                  <select
                    id="cs-cat"
                    required
                    value={srvCatId}
                    onChange={(e) => setSrvCatId(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white dark:bg-gray-950 dark:border-gray-700 dark:text-white"
                  >
                    <option value="">Select...</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{lang === 'bn' ? c.nameBn : c.nameEn}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase font-mono">Rate (Per Unit in BDT)</label>
                  <input
                    id="cs-price"
                    type="number"
                    step="0.01"
                    required
                    value={srvPrice}
                    onChange={(e) => setSrvPrice(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase font-mono">Min</label>
                  <input
                    id="cs-min"
                    type="number"
                    required
                    value={srvMin}
                    onChange={(e) => setSrvMin(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase font-mono">Max</label>
                  <input
                    id="cs-max"
                    type="number"
                    required
                    value={srvMax}
                    onChange={(e) => setSrvMax(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase font-mono">Time (Bn)</label>
                  <input
                    id="cs-time-bn"
                    type="text"
                    required
                    value={srvTimeBn}
                    onChange={(e) => setSrvTimeBn(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase font-mono">Time (En)</label>
                  <input
                    id="cs-time-en"
                    type="text"
                    required
                    value={srvTimeEn}
                    onChange={(e) => setSrvTimeEn(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <button
                id="create-service-submit-btn"
                type="submit"
                className="w-full cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-3 rounded-lg text-xs"
              >
                + Publish Service
              </button>
            </form>

            <hr className="border-gray-100 dark:border-gray-700" />

            {/* Category creation panel */}
            <form id="create-category-form" onSubmit={handleCreateCategory} className="space-y-3 pt-2">
              <h4 className="font-bold text-gray-900 dark:text-white text-[12px] flex items-center gap-1.5 text-indigo-500">
                <Plus className="w-4 h-4" />
                <span>{t.adminAddCategory}</span>
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <input
                  id="cat-name-bn-input"
                  type="text"
                  required
                  placeholder="বাংলা নাম"
                  value={catNameBn}
                  onChange={(e) => setCatNameBn(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
                <input
                  id="cat-name-en-input"
                  type="text"
                  required
                  placeholder="English Name"
                  value={catNameEn}
                  onChange={(e) => setCatNameEn(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>

              <button
                id="category-submit-btn"
                type="submit"
                className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-xs"
              >
                + Create Category
              </button>
            </form>
          </div>

          {/* Core Service Database list and delete controller (CRUD) */}
          <div className="md:col-span-8 bg-white border border-gray-150 rounded-2xl p-5 dark:bg-gray-800 dark:border-gray-700 space-y-4">
            <h3 className="font-bold text-blue-950 dark:text-white text-sm">
              ⚙️ Digital Services Active Library ({services.length})
            </h3>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {services.map((srv) => (
                <div key={srv.id} id={`srv-crud-node-${srv.id}`} className="p-3 bg-gray-50 border border-gray-150 rounded-xl flex items-center justify-between gap-3 text-xs dark:bg-gray-900 dark:border-gray-750">
                  <div className="truncate">
                    <p className="font-bold text-gray-800 dark:text-gray-200 truncate">{lang === 'bn' ? srv.nameBn : srv.nameEn}</p>
                    <span className="font-mono text-[9px] text-gray-400">ID: {srv.id} • PRICE: {settings.currencySymbol}{srv.pricePerUnit} • CAT: {srv.categoryId}</span>
                  </div>
                  
                  <button
                    id={`delete-srv-btn-${srv.id}`}
                    onClick={() => {
                      if (confirm('Delete this service forever?')) {
                        deleteService(srv.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 cursor-pointer transition-colors shrink-0"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEC 5: GLOBAL CONFIGURATIONS */}
      {activeAdminSec === 'settings' && (
        <section id="settings-form-panel" className="bg-white border border-gray-150 rounded-2xl p-6 dark:bg-gray-800 dark:border-gray-700 space-y-6">
          <div className="space-y-2">
            <h3 className="font-extrabold text-gray-900 dark:text-white text-base flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-400" />
              <span>Platform Settings Panel</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">Configure global announcements, logos, metadata, and marketing commission percentages.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-4">
              <h4 className="font-bold text-sm tracking-tight border-b pb-1">Website Identity</h4>
              
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">Site Name (Bangla)</label>
                <input
                  id="cfg-site-bn"
                  type="text"
                  value={siteBn}
                  onChange={(e) => setSiteBn(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs dark:bg-gray-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">Site Name (English)</label>
                <input
                  id="cfg-site-en"
                  type="text"
                  value={siteEn}
                  onChange={(e) => setSiteEn(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs dark:bg-gray-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">Announcements (Bangla)</label>
                <textarea
                  id="cfg-ann-bn"
                  rows={2}
                  value={annBn}
                  onChange={(e) => setAnnBn(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs dark:bg-gray-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">Announcements (English)</label>
                <textarea
                  id="cfg-ann-en"
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
                  id="cfg-promo-bn"
                  type="text"
                  value={pTitleBn}
                  onChange={(e) => setPTitleBn(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs dark:bg-gray-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">Banner Title (En)</label>
                <input
                  id="cfg-promo-en"
                  type="text"
                  value={pTitleEn}
                  onChange={(e) => setPTitleEn(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs dark:bg-gray-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">Banner Description (Bn)</label>
                <textarea
                  id="cfg-desc-bn"
                  rows={2}
                  value={pDescBn}
                  onChange={(e) => setPDescBn(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs dark:bg-gray-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">Banner Description (En)</label>
                <textarea
                  id="cfg-desc-en"
                  rows={2}
                  value={pDescEn}
                  onChange={(e) => setPDescEn(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs dark:bg-gray-900"
                />
              </div>
            </div>
          </div>

          <button
            id="update-settings-btn"
            onClick={handleUpdateSystemSettings}
            className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 text-xs rounded-xl shadow-md transition-all mt-4"
          >
            {t.adminSaveBtn}
          </button>
        </section>
      )}

      {/* SEC 6: INTERACTIVE SUPPORT TICKETS */}
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
                          ? 'bg-blue-600 text-white ml-auto' 
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
                    className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1 cursor-pointer"
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

    </div>
  );
};
