import React, { useState } from 'react';
import { useAppState } from '../lib/state';
import { 
  Users, Wallet, RefreshCcw, Bell, ArrowRightLeft, 
  HelpCircle, Calendar, PlusCircle, Check, Copy, AlertCircle, Sparkles, MessageSquare
} from 'lucide-react';

interface UserDashboardViewProps {
  setTab: (tab: string) => void;
  setSelectedServiceId: (srvId: string) => void;
}

export const UserDashboard: React.FC<UserDashboardViewProps> = ({ setTab, setSelectedServiceId }) => {
  const { 
    currentUser, orders, transactions, tickets, settings, submitPayment, 
    lang, t, users
  } = useAppState();

  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'deposit' | 'affiliate' | 'tickets'>('orders');
  
  // Wallet Top-up Inputs
  const [depositAmount, setDepositAmount] = useState<number>(500);
  const [depositMethod, setDepositMethod] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [senderNo, setSenderNo] = useState('');
  const [trxId, setTrxId] = useState('');
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Tracking field (Order status search)
  const [trackId, setTrackId] = useState('');
  const [trackingResult, setTrackingResult] = useState<any | null>(null);
  const [trackingError, setTrackingError] = useState('');

  if (!currentUser) return null;

  // Filter lists specific to logged-in user
  const myOrders = orders.filter(o => o.userId === currentUser.id);
  const myTransactions = transactions.filter(t => t.userId === currentUser.id);
  const myTickets = tickets.filter(t => t.userId === currentUser.id);
  const myReferrals = users.filter(u => u.referredBy === currentUser.id);

  const totalReferralBonus = myTransactions
    .filter(t => t.method === 'Referral Bonus')
    .reduce((sum, current) => sum + current.amount, 0);

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderNo || !trxId || depositAmount <= 0) {
      alert(lang === 'bn' ? 'অনুগ্রহ করে সকল ঘর পূরণ করুন।' : 'Please complete all required fields.');
      return;
    }

    submitPayment({
      userId: currentUser.id,
      amount: depositAmount,
      method: depositMethod,
      senderNumber: senderNo,
      transactionId: trxId,
      type: 'deposit',
      note: 'User panel top up request'
    });

    setDepositSuccess(true);
    setSenderNo('');
    setTrxId('');
    setTimeout(() => {
      setDepositSuccess(false);
    }, 5000);
  };

  const handleTrackOrder = () => {
    setTrackingError('');
    setTrackingResult(null);

    const found = orders.find(o => o.id.toUpperCase() === trackId.toUpperCase().trim());
    if (found) {
      setTrackingResult(found);
    } else {
      setTrackingError(t.trackingNotFound);
    }
  };

  const handleCopyRef = () => {
    const link = `${window.location.origin}?ref=${currentUser.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100/85 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
    processing: 'bg-indigo-100/85 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400',
    completed: 'bg-emerald-100/85 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
    cancelled: 'bg-rose-100/85 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
    refunded: 'bg-gray-100/85 text-gray-700 dark:bg-gray-750 dark:text-gray-300'
  };

  return (
    <div id="user-dashboard-view" className="space-y-8 pb-12">
      
      {/* Dashboard Greetings Header */}
      <section id="user-greeting-banner" className="p-6 md:p-8 bg-gradient-to-br from-emerald-600 via-teal-600 to-teal-700 rounded-3xl text-white shadow-md relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <div className="space-y-1">
            <h1 className="text-xl md:text-3xl font-black tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 animate-pulse" />
              <span>{t.welcomeUser.replace('%name%', currentUser.name)}</span>
            </h1>
            <p className="text-xs text-emerald-100 font-mono tracking-wide uppercase">
              ID: {currentUser.id} • {currentUser.email} • ROLE: {currentUser.role.toUpperCase()}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 shrink-0">
            <div>
              <span className="block text-[10px] text-emerald-200 uppercase font-bold tracking-wide">{t.userWalletBal}</span>
              <p className="text-2xl font-black font-mono tracking-tight">{settings.currencySymbol}{currentUser.walletBalance}</p>
            </div>
            <button
              id="dashboard-recharge-tab-trigger-btn"
              onClick={() => setActiveSubTab('deposit')}
              className="bg-white hover:bg-gray-150 cursor-pointer text-emerald-950 font-black text-xs px-4 py-2.5 rounded-xl transition-colors shadow-xs"
            >
              {t.rechargeBtn}
            </button>
          </div>
        </div>
      </section>

      {/* Quick Order Tracking bar */}
      <section id="instant-tracker-widget" className="p-4 bg-white border border-gray-150 rounded-2xl shadow-xs dark:bg-gray-800 dark:border-gray-700/80">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider font-mono mb-2">
          🔍 {t.orderTrackTitle}
        </label>
        <div className="flex gap-2 max-w-lg">
          <input
            id="dashboard-track-id-input"
            type="text"
            placeholder="e.g. ORD-98421"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono uppercase dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          />
          <button
            id="dashboard-track-action-btn"
            onClick={handleTrackOrder}
            className="bg-gray-900 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer shrink-0"
          >
            {t.trackBtn}
          </button>
        </div>

        {trackingError && <p className="text-xs font-semibold text-rose-500 mt-2">{trackingError}</p>}
        {trackingResult && (
          <div id="tracking-result-card" className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-150/80 text-xs space-y-2 dark:bg-gray-900/60 dark:border-gray-750">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-gray-700 dark:text-gray-300">ORD-ID: {trackingResult.id}</span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] ${statusColors[trackingResult.status]}`}>
                {trackingResult.status}
              </span>
            </div>
            <p><span className="text-gray-400 font-medium">{t.orderService}:</span> <span className="font-semibold">{trackingResult.serviceId}</span></p>
            <p><span className="text-gray-400 font-medium">{t.orderQty}:</span> <span className="font-mono">{trackingResult.quantity}</span></p>
            <p><span className="text-gray-400 font-medium">{t.orderCost}:</span> <span className="font-bold text-emerald-600 font-mono">{settings.currencySymbol}{trackingResult.totalPrice}</span></p>
            <p><span className="text-gray-400 font-medium">{t.orderLink}:</span> <span className="font-mono break-all text-gray-500 leading-none">{trackingResult.targetLink}</span></p>
          </div>
        )}
      </section>

      {/* Sub menu Navigation bar */}
      <div id="dashboard-tabs" className="border-b border-gray-200 dark:border-gray-800 flex gap-4 overflow-x-auto p-1 text-sm font-semibold">
        <button
          id="tab-history-btn"
          onClick={() => setActiveSubTab('orders')}
          className={`pb-3 border-b-2 cursor-pointer whitespace-nowrap transition-all ${activeSubTab === 'orders' ? 'border-emerald-500 text-emerald-600 font-bold' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          {t.tabMyOrders}
        </button>

        <button
          id="tab-recharge-btn"
          onClick={() => setActiveSubTab('deposit')}
          className={`pb-3 border-b-2 cursor-pointer whitespace-nowrap transition-all ${activeSubTab === 'deposit' ? 'border-emerald-500 text-emerald-600 font-bold' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          💳 {lang === 'bn' ? 'রিচার্জ করুন' : 'Deposit Cash'}
        </button>

        <button
          id="tab-affiliate-btn"
          onClick={() => setActiveSubTab('affiliate')}
          className={`pb-3 border-b-2 cursor-pointer whitespace-nowrap transition-all ${activeSubTab === 'affiliate' ? 'border-emerald-500 text-emerald-600 font-bold' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          👥 {t.tabReferrals}
        </button>

        <button
          id="tab-tickets-btn"
          onClick={() => setActiveSubTab('tickets')}
          className={`pb-3 border-b-2 cursor-pointer whitespace-nowrap transition-all ${activeSubTab === 'tickets' ? 'border-emerald-500 text-emerald-600 font-bold' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          🎫 {t.tabMyTickets}
        </button>
      </div>

      {/* Render sub sections based on sub tabs */}
      {activeSubTab === 'orders' && (
        <div id="orders-history-list" className="space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-base">
            {lang === 'bn' ? 'আমার অর্ডার ইতিহাসের তালিকা' : 'My Historical Digital Services Orders'}
          </h3>

          {myOrders.length === 0 ? (
            <div className="p-8 text-center bg-white border border-gray-150 rounded-2xl">
              <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400">{lang === 'bn' ? 'আপনার কোনো পূর্ববর্তী অর্ডার নেই।' : 'You have not dispatched any orders yet.'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-150 bg-white dark:bg-gray-800 dark:border-gray-700">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-750 font-bold text-gray-700 dark:text-gray-300 border-b border-gray-150">
                    <th className="p-3 font-mono">{t.orderIdHash}</th>
                    <th className="p-3">{lang === 'bn' ? 'সার্ভিস আইডি' : 'Service'}</th>
                    <th className="p-3">{t.orderQty}</th>
                    <th className="p-3">{lang === 'bn' ? 'মোট খরচ' : 'Cost'}</th>
                    <th className="p-3">{t.orderStatus}</th>
                    <th className="p-3">{t.date}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 font-medium">
                  {myOrders.map((ord) => (
                    <tr key={ord.id} id={`history-row-${ord.id}`} className="hover:bg-gray-50/50">
                      <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200">{ord.id}</td>
                      <td className="p-3 max-w-[150px] truncate">{ord.serviceId}</td>
                      <td className="p-3 font-mono">{ord.quantity.toLocaleString()}</td>
                      <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400">{settings.currencySymbol}{ord.totalPrice}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${statusColors[ord.status]}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-400 font-mono text-[10px]">{new Date(ord.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'deposit' && (
        <div id="deposit-wallet-portal" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Top-up Form inputs details */}
          <div className="md:col-span-7 bg-white border border-gray-150 rounded-2xl p-6 dark:bg-gray-800 dark:border-gray-700 space-y-4">
            <h3 className="font-extrabold text-gray-900 dark:text-white text-base">
              {t.rechargeWalletTitle}
            </h3>

            <form id="recharge-form" onSubmit={handleDepositSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {t.rechargeAmount} *
                  </label>
                  <input
                    id="recharge-amount-input"
                    type="number"
                    required
                    min={50}
                    max={25000}
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono dark:bg-gray-700 dark:border-gray-650 dark:text-white"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {lang === 'bn' ? 'পেমেন্ট মাধ্যম' : 'Payment gateway'} *
                  </label>
                  <select
                    id="recharge-method-select"
                    value={depositMethod}
                    onChange={(e: any) => setDepositMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white dark:bg-gray-700 dark:border-gray-650 dark:text-white"
                  >
                    <option value="bKash">bKash (বিকাশ পার্সোনাল)</option>
                    <option value="Nagad">Nagad (নগদ পার্সোনাল)</option>
                    <option value="Rocket">Rocket (রকেট পার্সোনাল)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-1 font-mono text-xs">
                <p className="text-[10px] text-gray-400 font-sans font-bold uppercase">{t.sendToNumber}</p>
                <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  {depositMethod === 'bKash' ? '01712-345678' : depositMethod === 'Nagad' ? '01912-887766' : '01511-998877'}
                </p>
                <p className="text-[10px] text-gray-400 font-sans leading-none pt-1">
                  💡 অনুগ্রহ করে আমাদের উপরোক্ত পার্সোনাল নাম্বারে ক্যাশআউট / সেন্ডমানি সম্পন্ন করুন।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {t.senderNumLabel} *
                  </label>
                  <input
                    id="recharge-sender-input"
                    type="tel"
                    required
                    placeholder="e.g. 01712345678"
                    value={senderNo}
                    onChange={(e) => setSenderNo(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-xs font-mono dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {t.txIdLabel} *
                  </label>
                  <input
                    id="recharge-txid-input"
                    type="text"
                    required
                    placeholder="e.g. TRX19A887"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-xs font-mono uppercase dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <button
                id="recharge-submit-btn"
                type="submit"
                className="w-full cursor-pointer bg-emerald-500 hover:bg-emerald-600 font-bold py-2.5 text-white rounded-lg shadow-sm text-xs transition-colors"
              >
                {t.rechargeSubmit}
              </button>

              {depositSuccess && (
                <p id="deposit-success-banner" className="p-3 bg-emerald-100/90 text-emerald-800 rounded-xl font-bold text-center text-xs">
                  {t.paymentPendingAlert}
                </p>
              )}
            </form>
          </div>

          {/* Right column: Recent transaction reports log */}
          <div className="md:col-span-5 bg-white border border-gray-150 rounded-2xl p-6 dark:bg-gray-800 dark:border-gray-700 space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">
              {lang === 'bn' ? 'সাম্প্রতিক রিচার্জ এবং লেনদেন হিস্ট্রি' : 'Recent Wallet Transactions Logs'}
            </h3>

            {myTransactions.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-6">{lang === 'bn' ? 'কোনো লেনদেন রেকর্ড নেই।' : 'No verified transactions listed.'}</p>
            ) : (
              <div className="space-y-2.5">
                {myTransactions.map((tx) => (
                  <div key={tx.id} id={`tx-history-card-${tx.id}`} className="p-3 rounded-xl border border-gray-150 flex items-center justify-between gap-2.5 text-xs">
                    <div>
                      <p className="font-bold text-gray-800 dark:text-gray-200">{tx.method} • {tx.type === 'deposit' ? '+' : '-'}{settings.currencySymbol}{tx.amount}</p>
                      <span className="text-[10px] text-gray-400 font-mono italic">{new Date(tx.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                        tx.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : tx.status === 'pending' ? 'bg-amber-50 text-amber-500' : 'bg-rose-50 text-rose-500'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'affiliate' && (
        <div id="affiliate-system-portal" className="bg-white border border-gray-150 rounded-2xl p-6 dark:bg-gray-800 dark:border-gray-700 space-y-6">
          <div className="space-y-2">
            <h3 className="font-extrabold text-gray-900 dark:text-white text-base">
              {t.refPromoTitle}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {t.refPromoDesc}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150 max-w-xl space-y-2 dark:bg-gray-900/40 dark:border-gray-750">
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
              {t.refLinkTitle}
            </span>
            <div className="flex gap-2">
              <input
                id="ref-link-input"
                type="text"
                readOnly
                value={`${window.location.origin}?ref=${currentUser.referralCode}`}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-mono text-gray-500"
              />
              <button
                id="ref-link-copy-btn"
                onClick={handleCopyRef}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-1.5 rounded-xl cursor-pointer shrink-0 transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copiedLink && <p className="text-[10px] font-semibold text-emerald-500 pl-1">{lang === 'bn' ? 'রেফারাল লিংক কপি হয়েছে!' : 'Referral link copied to clipboard!'}</p>}
          </div>

          {/* Statistics performance figures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                {t.refStatsTitle}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                  <span className="block text-[10px] text-gray-400 font-semibold">{t.refRegisteredFriends}</span>
                  <p className="text-xl font-black font-mono mt-1 text-indigo-600">{myReferrals.length}</p>
                </div>
                <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                  <span className="block text-[10px] text-gray-400 font-semibold">{t.refTotalEarned}</span>
                  <p className="text-xl font-black font-mono mt-1 text-amber-500">{settings.currencySymbol}{totalReferralBonus}</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl flex items-start gap-3 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
              <Users className="w-5 h-5 text-emerald-600 mt-1 shrink-0" />
              <div>
                <p className="font-bold text-emerald-800 dark:text-emerald-400">{lang === 'bn' ? 'নিয়ম ও শর্তাবলি' : 'Bounty Affiliate Policy'}</p>
                <p className="text-[11px] mt-1 text-gray-500">
                  {t.refEarningsDisclaimer}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'tickets' && (
        <div id="tickets-portal" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white text-base">
              {lang === 'bn' ? 'আমার সাপোর্ট টিকেটস' : 'Active Client Helptickets'}
            </h3>
            <button
              id="dashboard-open-ticket-action"
              onClick={() => setTab('tickets')}
              className="bg-emerald-500 hover:bg-emerald-600 cursor-pointer text-white font-bold text-xs py-2 px-4 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t.openTicketBtn}</span>
            </button>
          </div>

          {myTickets.length === 0 ? (
            <div className="p-8 text-center bg-white border border-gray-150 rounded-2xl">
              <HelpCircle className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.noTickets}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myTickets.map((tck) => (
                <div
                  key={tck.id}
                  id={`ticket-card-${tck.id}`}
                  onClick={() => setTab('tickets')}
                  className="cursor-pointer p-4 bg-white border border-gray-120 hover:border-emerald-500 shadow-2xs hover:shadow-xs transition-all rounded-2xl flex items-center justify-between gap-3 dark:bg-gray-800 dark:border-gray-700/80"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gray-400">{tck.id}</span>
                      <span className="font-bold text-gray-900 dark:text-white text-xs">{tck.subject}</span>
                    </div>
                    <span className="block text-[10px] text-gray-400 font-mono">{new Date(tck.createdAt).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs shrink-0 font-medium">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      tck.status === 'open' ? 'bg-indigo-50 text-indigo-500' : tck.status === 'answered' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'
                    }`}>
                      {tck.status === 'open' ? t.ticketStatusOpen : tck.status === 'answered' ? t.ticketStatusAnswered : t.ticketStatusClosed}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
