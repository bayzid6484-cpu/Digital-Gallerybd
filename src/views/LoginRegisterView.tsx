import React, { useState } from 'react';
import { useAppState } from '../lib/state';
import { Key, Mail, UserPlus, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface LoginRegisterViewProps {
  setTab: (tab: string) => void;
}

export const LoginRegisterView: React.FC<LoginRegisterViewProps> = ({ setTab }) => {
  const { loginUser, registerUser, lang, t } = useAppState();
  
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [refCode, setRefCode] = useState('');
  const [errorText, setErrorText] = useState('');

  // Handle URL parsing of referrer codes automatically on launch
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setRefCode(ref);
      setIsRegister(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (isRegister) {
      if (!name || !email) {
        setErrorText(lang === 'bn' ? 'অনুগ্রহ করে সব ঘর পূরণ করুন।' : 'Full Name and Email are required.');
        return;
      }
      const success = registerUser(name, email, refCode);
      if (success) {
        setTab('dashboard');
      } else {
        setErrorText(lang === 'bn' ? 'এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হয়েছে!' : 'Email already in use!');
      }
    } else {
      if (!email) {
        setErrorText(lang === 'bn' ? 'ইমেল অ্যাড্রেস প্রবেশ করান।' : 'Email address is required.');
        return;
      }
      const success = loginUser(email);
      if (success) {
        // Redirect
        const foundUser = email.toLowerCase() === 'admin@test.com';
        setTab(foundUser ? 'admin' : 'dashboard');
      } else {
        setErrorText(lang === 'bn' ? 'কোনো অ্যাকাউন্ট খুঁজে পাওয়া যায়নি! নতুন করে অ্যাকাউন্ট তৈরি করুন।' : 'No registered user with this email located! Please sign up.');
      }
    }
  };

  const handleSimulateGoogleLogin = () => {
    // Quickly login the default user Bayzid Hasan
    loginUser('bayzid6484@gmail.com');
    setTab('dashboard');
  };

  return (
    <div id="login-register-view" className="max-w-md mx-auto p-6 md:p-8 bg-white border border-gray-150 rounded-3xl shadow-sm dark:bg-gray-800 dark:border-gray-700 pb-12">
      <div className="text-center space-y-2 mb-6">
        <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full dark:bg-emerald-950/40 dark:text-emerald-300">
          🔑 Secure SaaS Authentication
        </span>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          {isRegister ? t.navRegister : t.navLogin}
        </h2>
        <p className="text-xs text-gray-500">
          {lang === 'bn' ? 'ডিজিটাল ফলো-লিংক ও বুস্টিং পোর্টাল' : 'Seba Boost BD Cloud Authentication Desk'}
        </p>
      </div>

      <form id="auth-form" onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              {lang === 'bn' ? 'আপনার সম্পূর্ণ নাম' : 'Your Full Name'} *
            </label>
            <input
              id="auth-name-input"
              type="text"
              required
              placeholder="e.g. Bayzid Hasan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 border rounded-lg text-xs dark:bg-gray-900"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
            {lang === 'bn' ? 'আপনার সচল ইমেল' : 'Your Email address'} *
          </label>
          <input
            id="auth-email-input"
            type="email"
            required
            placeholder="e.g. bayzid6484@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2 border rounded-lg text-xs dark:bg-gray-900 font-mono"
          />
        </div>

        {isRegister && (
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              {lang === 'bn' ? 'রেফারাল কোড (ঐচ্ছিক)' : 'Referral Code (Optional)'}
            </label>
            <input
              id="auth-ref-input"
              type="text"
              placeholder="e.g. ADMIN777"
              value={refCode}
              onChange={(e) => setRefCode(e.target.value)}
              className="w-full px-3.5 py-2 border rounded-lg text-xs dark:bg-gray-900 uppercase font-mono"
            />
          </div>
        )}

        {errorText && (
          <div id="auth-error-banner" className="bg-rose-50 border border-rose-200 p-3 rounded-lg text-[11px] text-rose-600 font-bold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorText}</span>
          </div>
        )}

        <button
          id="auth-submit-btn"
          type="submit"
          className="w-full cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-xs"
        >
          {isRegister ? (lang === 'bn' ? 'হিসাব খুলুন' : 'Sign Up') : (lang === 'bn' ? 'লগইন করুন' : 'Sign In')}
        </button>

        {/* Google Quick Signin Simulation shortcut */}
        <button
          id="auth-google-o-btn"
          type="button"
          onClick={handleSimulateGoogleLogin}
          className="w-full cursor-pointer bg-white hover:bg-gray-50 text-gray-700 border border-gray-250 font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.06-1.11-.27-1.63-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Google Quick Sign-In</span>
        </button>
      </form>

      {/* Guest tips banner */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>
          {isRegister ? (lang === 'bn' ? 'ইতিমধ্যে অ্যাকাউন্ট আছে?' : 'Already have account?') : (lang === 'bn' ? 'নতুন গ্রাহক?' : 'New here?')}
        </span>
        <button
          id="auth-toggle-btn"
          onClick={() => setIsRegister(!isRegister)}
          className="text-emerald-500 font-bold hover:underline"
        >
          {isRegister ? (lang === 'bn' ? 'লগইন করুন' : 'Log in instead') : (lang === 'bn' ? 'নিবন্ধন করুন' : 'Sign up instead')}
        </button>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-gray-50 text-[10px] text-gray-400 leading-relaxed font-mono">
        💡 <span className="font-bold">Test Credentials:</span> <br />
        • Admin login email: <span className="text-gray-600 font-bold">admin@test.com</span> <br />
        • Regular Customer email: <span className="text-gray-600 font-bold">bayzid6484@gmail.com</span>
      </div>
    </div>
  );
};
