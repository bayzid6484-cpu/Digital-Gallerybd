import React from 'react';
import { useAppState } from '../lib/state';
import { Globe } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { lang, setLang } = useAppState();

  return (
    <button
      id="lang-selector-btn"
      onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/20 text-gray-700 hover:text-emerald-600 transition-all cursor-pointer dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-emerald-950/20"
    >
      <Globe className="w-3.5 h-3.5" />
      <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
    </button>
  );
};
