import React, { useState } from 'react';
import { useAppState } from '../lib/state';
import { 
  Plus, MessageSquare, AlertCircle, HelpCircle, Check, Play, BookOpen, Send, LifeBuoy
} from 'lucide-react';

export const SupportTicketView: React.FC = () => {
  const { 
    currentUser, tickets, submitSupportTicket, replyToTicket, 
    lang, t 
  } = useAppState();

  const [isCreating, setIsCreating] = useState(false);
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [firstMessage, setFirstMessage] = useState('');

  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [chatReply, setChatReply] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto p-8 text-center bg-white border border-gray-150 rounded-2xl dark:bg-gray-800 dark:border-gray-700">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
        <h3 className="font-bold text-gray-900 dark:text-white">{lang === 'bn' ? 'লগইন প্রয়োজন!' : 'Login Required'}</h3>
        <p className="text-xs text-gray-500 mt-1">{lang === 'bn' ? 'টিকেট তৈরি বা দেখতে অনুগ্রহ করে অ্যাকাউন্ট লগইন করুন' : 'Please authenticate to create or communicate with client assistance desk.'}</p>
      </div>
    );
  }

  const myTickets = tickets.filter(t => t.userId === currentUser.id);
  const activeTicketObj = tickets.find(t => t.id === activeTicketId);

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !firstMessage) {
      alert('All fields required!');
      return;
    }

    submitSupportTicket(subject, priority, firstMessage);
    
    // Reset
    setSubject('');
    setFirstMessage('');
    setIsCreating(false);
    alert(lang === 'bn' ? 'সাপোর্ট টিকেটটি সফলভাবে তৈরি হয়েছে!' : 'Support helpticket initialized!');
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicketId || !chatReply) return;

    replyToTicket(activeTicketId, chatReply, false);
    setChatReply('');
  };

  return (
    <div id="support-ticket-view" className="space-y-8 max-w-4xl mx-auto pb-12">
      <section id="helpdesk-header" className="p-6 md:p-8 bg-gradient-to-br from-indigo-50/50 to-white border rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 dark:from-indigo-950/10 dark:via-gray-900 dark:to-gray-900 dark:border-gray-800">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <LifeBuoy className="w-6 h-6 text-emerald-500 animate-spin" />
            <span>{t.ticketsTitle}</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1 leading-snug">
            {lang === 'bn' ? '২৪ ঘণ্টার মধ্যে আমাদের স্পেশালিস্টরা আপনার সমস্যার সমাধান নিশ্চিত করবেন' : 'Experience 24/7 dedicated assistance. Average reply time: 12 minutes'}
          </p>
        </div>

        <button
          id="create-new-ticket-btn"
          onClick={() => {
            setIsCreating(!isCreating);
            setActiveTicketId(null);
          }}
          className="bg-emerald-500 hover:bg-emerald-600 cursor-pointer text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs shrink-0 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isCreating ? (lang === 'bn' ? 'উইন্ডো বন্ধ করুন' : 'Hide Form') : t.openTicketBtn}</span>
        </button>
      </section>

      {isCreating ? (
        <form id="new-ticket-form" onSubmit={handleCreateTicketSubmit} className="bg-white border rounded-2xl p-6 dark:bg-gray-800 space-y-4 max-w-xl mx-auto shadow-sm">
          <h3 className="font-extrabold text-gray-900 dark:text-white text-base">
            📝 {t.openTicketBtn}
          </h3>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              {t.subjectLabel} *
            </label>
            <input
              id="ticket-subject-input"
              type="text"
              required
              placeholder="e.g. Order #ORD-98421 issue"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2 border rounded-lg text-xs dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              {t.priorityLabel}
            </label>
            <select
              id="ticket-priority-select"
              value={priority}
              onChange={(e: any) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-xs bg-white dark:bg-gray-900"
            >
              <option value="low">{t.priorityLow}</option>
              <option value="medium">{t.priorityMedium}</option>
              <option value="high">{t.priorityHigh}</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              {t.descriptionLabel} *
            </label>
            <textarea
              id="ticket-desc-input"
              rows={4}
              required
              placeholder={t.ticketPlaceholder}
              value={firstMessage}
              onChange={(e) => setFirstMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 border rounded-lg text-xs dark:bg-gray-900 dark:text-white"
            />
          </div>

          <button
            id="ticket-submit-btn"
            type="submit"
            className="w-full cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
          >
            {t.contactSubmitBtn}
          </button>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Tickets list */}
          <div className="md:col-span-5 bg-white border border-gray-150 rounded-2xl p-5 dark:bg-gray-800 dark:border-gray-700 space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">
              🎫 {lang === 'bn' ? 'আমার সচল টিকেটস' : 'Active Inquiries'} ({myTickets.length})
            </h3>

            {myTickets.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-6 text-center">{lang === 'bn' ? 'কোনো টিকিট রেকর্ড খুঁজে পাওয়া যায়নি।' : 'You have no tickets logged.'}</p>
            ) : (
              <div className="space-y-2.5">
                {myTickets.map((tck) => (
                  <div
                    key={tck.id}
                    id={`support-tck-node-${tck.id}`}
                    onClick={() => setActiveTicketId(tck.id)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      activeTicketId === tck.id 
                        ? 'border-emerald-500 bg-emerald-50/10' 
                        : 'border-gray-150 bg-gray-50/50 hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-bold text-gray-900 dark:text-gray-200">{tck.subject}</p>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono mt-1">
                      <span>ID: {tck.id} • {tck.priority.toUpperCase()}</span>
                      <span className={`px-1 rounded-sm text-[9px] font-bold ${
                        tck.status === 'open' ? 'bg-indigo-50 text-indigo-500' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {tck.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Chat bubble screen area */}
          <div className="md:col-span-7 bg-white border border-gray-150 rounded-2xl p-5 dark:bg-gray-800 dark:border-gray-700 space-y-4">
            {activeTicketObj ? (
              <div className="space-y-4">
                <div className="border-b pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold dark:bg-emerald-950/40">Status: {activeTicketObj.status}</span>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base mt-1.5">{activeTicketObj.subject}</h4>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">Raised: {new Date(activeTicketObj.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Chat stream */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto p-3 bg-gray-50 rounded-xl border border-gray-150 dark:bg-gray-900/40 dark:border-gray-700">
                  {activeTicketObj.messages.map((m, idx) => (
                    <div
                      key={idx}
                      id={`chat-bubble-${idx}`}
                      className={`p-3 rounded-2xl max-w-[85%] text-xs ${
                        m.role === 'admin' 
                          ? 'bg-indigo-50 text-indigo-900 border border-indigo-150' 
                          : 'bg-emerald-500 text-white ml-auto'
                      }`}
                    >
                      <span className="block font-bold text-[9px] opacity-80 mb-0.5">{m.senderName} ({m.role})</span>
                      <p className="leading-relaxed whitespace-pre-line">{m.message}</p>
                      <span className="block text-[8px] opacity-70 text-right mt-1 font-mono">{new Date(m.createdAt).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>

                {/* Form submit response bubble */}
                <form id="chat-reply-form" onSubmit={handleReplySubmit} className="flex gap-2">
                  <input
                    id="chat-reply-text-input"
                    type="text"
                    required
                    placeholder="Enter query message reply..."
                    value={chatReply}
                    onChange={(e) => setChatReply(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl text-xs bg-gray-50 focus:bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                  <button
                    id="chat-reply-submit-btn"
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm shrink-0 flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center p-12 text-gray-400">
                <LifeBuoy className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                <p className="text-xs">{lang === 'bn' ? 'যেকোনো সচল টিকিট বেছে নিয়ে ডেডিকেটেড এক্সিকিউটিভ প্রসেসিং চ্যাট শুরু করুন' : 'Select any helpticket in the side menu to open live messenger discussions.'}</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
