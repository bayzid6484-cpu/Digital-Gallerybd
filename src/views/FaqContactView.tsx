import React, { useState } from 'react';
import { useAppState } from '../lib/state';
import { 
  Building, Phone, Mail, MapPin, Send, CheckCircle, 
  HelpCircle, ChevronDown, ShieldCheck, FileText, Scale
} from 'lucide-react';

export const FaqContactView: React.FC = () => {
  const { lang, t, settings } = useAppState();

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;

    setSuccess(true);
    setContactName('');
    setContactEmail('');
    setContactMsg('');
    setTimeout(() => {
      setSuccess(false);
    }, 5000);
  };

  const detailedFaqs = [
    {
      q: lang === 'bn' ? 'অর্ডার চালু এবং সম্পন্ন হতে কত সময় লাগবে?' : 'Average execution speeds and expected times?',
      a: lang === 'bn'
        ? 'আমাদের সিংহভাগ সার্ভিস স্বয়ংক্রিয় এপিআই ভিত্তিক হওয়ার কারণে সাধারণত অর্ডার সাবমিট করার ১-১৫ মিনিটের মধ্যে সরবরাহ প্রক্রিয়া চালু হয় এবং সার্ভারের গতির ওপর ভিত্তি করে ১-১২ ঘণ্টার মধ্যে শেষ হয়।'
        : 'Our automatic node gateways trigger within 1 to 15 minutes of deposit validations. Aggregate times span 1 to 12 hours total.'
    },
    {
      q: lang === 'bn' ? 'আমার লিংক কি নিরাপদ?' : 'Is my destination safety protected?',
      a: lang === 'bn'
        ? 'হ্যাঁ, আমরা কাস্টমার সুরক্ষার ব্যাপারে আপোষহীন। কোনো অ্যাকাউন্ট অ্যাক্সেস পাসওয়ার্ড বা বিশেষ ব্যাকএন্ড কোডের প্রয়োজন পড়ে না।'
        : 'Yes, fully. We operate utilizing API-safe guidelines complying with platform rules. System is 100% filter protected.'
    },
    {
      q: lang === 'bn' ? 'ব্যালেন্স রিচার্জ নিয়ে সমস্যা হলে করণীয় কি?' : 'What if my deposit recharge is delayed?',
      a: lang === 'bn'
        ? 'বিকাশ বা নগদে ট্রানজেকশন সাবমিট করার পর আমাদের অডিটর টিম ২-১০ মিনিটের মধ্যে ভেরিফাই করে নিয়ে একাউন্টে ক্যাশ রেডি করে দেয়। যেকোনো প্রয়োজনে সরাসরি টিকেট সাবমিট করুন।'
        : 'Our billing managers audit transactions database rows within 2-10 minutes. If delayed beyond, write to us directly.'
    },
    {
      q: lang === 'bn' ? 'আমি কি কোনো রিফান্ড পাবো?' : 'Refund policies on cancellations?',
      a: lang === 'bn'
        ? 'যদি কোনো কারিগরি ত্রুটির কারণে সরবরাহ করা সম্ভব না হয়, তবে অর্ডারটির নির্ধারিত মূল্য স্বয়ংক্রিয়ভাবে আপনার ওয়ালেটে ফেরত দেওয়া হয়।'
        : 'Yes, definitely. Any failed or rejected deliveries trigger instant refund processes returning credits to your active wallet.'
    }
  ];

  return (
    <div id="faq-contact-view" className="space-y-12 pb-12">
      
      {/* Three row grid representing static info pages */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left column: FAQ segment and Terms */}
        <div className="md:col-span-7 space-y-8">
          
          {/* About us cards */}
          <section id="about-us-card" className="bg-white border p-6 rounded-2xl space-y-3 dark:bg-gray-800 dark:border-gray-750 shadow-2xs">
            <h2 className="text-lg font-extrabold text-blue-950 dark:text-white flex items-center gap-1.5 border-b pb-2 dark:border-gray-700">
              <Building className="w-5 h-5 text-emerald-500" />
              <span>{t.aboutUsTitle}</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
              {t.aboutUsText}
            </p>
          </section>

          {/* Interactive FAQs Accordion */}
          <section id="faq-interactive-catalog" className="space-y-4">
            <h2 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5 border-b pb-2 dark:border-gray-700">
              <HelpCircle className="w-5 h-5 text-emerald-500" />
              <span>{t.faqTitle}</span>
            </h2>

            <div className="space-y-2.5">
              {detailedFaqs.map((faq, i) => {
                const isActive = activeFaq === i;
                return (
                  <div key={i} id={`faq-accord-item-${i}`} className="bg-white border rounded-xl dark:bg-gray-800 dark:border-gray-750">
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isActive ? null : i)}
                      className="w-full flex items-center justify-between p-3.5 text-xs font-semibold text-left text-gray-850 dark:text-white cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isActive ? 'rotate-180' : ''}`} />
                    </button>
                    {isActive && (
                      <div className="p-3.5 pt-0 text-[11px] text-gray-500 dark:text-gray-400 border-t border-gray-50/50 leading-relaxed dark:border-gray-700/60">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Terms & Privacy Guidelines */}
          <section id="terms-static-segment" className="bg-white border p-6 rounded-2xl space-y-4 dark:bg-gray-800 dark:border-gray-750">
            <h2 className="text-lg font-extrabold text-gray-950 dark:text-white flex items-center gap-1.5 border-b pb-2 dark:border-gray-700">
              <Scale className="w-5 h-5 text-emerald-500" />
              <span>{lang === 'bn' ? 'ব্যবহারের নিয়ম ও প্রাইভেসী পলিসি' : 'General Terms Compliance'}</span>
            </h2>
            <div className="text-[11px] text-gray-500 leading-relaxed space-y-3 font-medium">
              <p>১. ব্যবহারকারীরা যেকোনো স্প্যাম / ক্ষতিকারক লিংক প্রমোট করা থেকে বিরত থাকবেন।</p>
              <p>২. একাউন্টের ওয়ালেট ব্যালেন্স ক্যাশ-আউট বা ডিরেক্ট রিফান্ডযোগ্য নয়, তবে যেকোনো সময় অর্ডার চেকআউট বা পারচেজে ব্যবহার করা যাবে।</p>
              <p>৩. ভুল লিংক সাবমিটের জন্য সরবরাহ ব্যহত হলে রিফান্ড প্রযোজ্য হবে না।</p>
            </div>
          </section>

        </div>

        {/* Right column: Contact Us panel */}
        <div className="md:col-span-5 space-y-8">
          
          <div className="bg-white border p-6 rounded-2xl space-y-4 dark:bg-gray-800 dark:border-gray-750 shadow-2xs">
            <h2 className="text-lg font-extrabold text-gray-950 dark:text-white flex items-center gap-1.5 border-b pb-2 dark:border-gray-750">
              <Send className="w-4 h-4 text-emerald-500" />
              <span>{t.contactTitle}</span>
            </h2>

            <form id="contact-form" onSubmit={handleContactSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="block text-gray-700 dark:text-gray-300">{lang === 'bn' ? 'আপনার নাম' : 'Your name'}</label>
                <input
                  id="contact-name-input"
                  type="text"
                  required
                  placeholder="e.g. Bayzid Hasan"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-lg dark:bg-gray-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-gray-700 dark:text-gray-300">{lang === 'bn' ? 'ইমেইল এড্রেস' : 'Email Address'}</label>
                <input
                  id="contact-email-input"
                  type="email"
                  required
                  placeholder="e.g. bayzid@test.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-lg dark:bg-gray-900 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-gray-700 dark:text-gray-300">{lang === 'bn' ? 'মেসেজ বিবরণ' : 'Description message'}</label>
                <textarea
                  id="contact-msg-textarea"
                  rows={4}
                  required
                  placeholder={lang === 'bn' ? 'যেকোনো জিজ্ঞাসা এখানে বিস্তারিত লিখুন...' : 'Write message inquiry detailed...'}
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-lg dark:bg-gray-900"
                />
              </div>

              <button
                id="contact-submit-btn"
                type="submit"
                className="w-full cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-lg text-xs"
              >
                {t.contactSubmitBtn}
              </button>

              {success && (
                <div id="contact-success-alert" className="p-3 bg-emerald-500/10 rounded-lg text-emerald-600 flex items-center gap-1.5 font-bold">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{t.contactSuccess}</span>
                </div>
              )}
            </form>
          </div>

          {/* Quick info direct parameters list */}
          <div className="bg-gray-50 border p-5 rounded-2xl text-[11px] text-gray-500 leading-relaxed font-mono dark:bg-gray-800/40">
            <h4 className="font-bold text-gray-900 dark:text-white uppercase mb-2 font-sans tracking-tight">Direct Coordinates</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>{settings.contactPhone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{settings.contactEmail}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? settings.contactAddressBn : settings.contactAddressEn}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
