import React from 'react';
import { useAppState } from '../lib/state';
import { Home, Grid, User, LifeBuoy, ShieldCheck } from 'lucide-react';

interface StickyBottomNavProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

export const StickyBottomNav: React.FC<StickyBottomNavProps> = ({ currentTab, setTab }) => {
  const { currentUser, t } = useAppState();

  return (
    <div id="mobile-bottom-nav" className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 z-50 px-4 py-2 flex justify-around items-center dark:bg-gray-900/90 dark:border-gray-800 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <button 
        id="mobile-nav-home"
        onClick={() => setTab('home')}
        className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${currentTab === 'home' ? 'text-emerald-500 font-semibold' : 'text-gray-500 hover:text-gray-900'}`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">{t.bottomHome}</span>
      </button>

      <button 
        id="mobile-nav-services"
        onClick={() => setTab('services')}
        className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${currentTab === 'services' ? 'text-emerald-500 font-semibold' : 'text-gray-500 hover:text-gray-900'}`}
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">{t.bottomServices}</span>
      </button>

      <button 
        id="mobile-nav-dashboard"
        onClick={() => setTab(currentUser ? 'dashboard' : 'login')}
        className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${(currentTab === 'dashboard' || currentTab === 'login') ? 'text-emerald-500 font-semibold' : 'text-gray-500 hover:text-gray-900'}`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">{currentUser ? t.bottomDashboard : t.navLogin}</span>
      </button>

      <button 
        id="mobile-nav-tickets"
        onClick={() => setTab(currentUser ? 'tickets' : 'login')}
        className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${currentTab === 'tickets' ? 'text-emerald-500 font-semibold' : 'text-gray-500 hover:text-gray-900'}`}
      >
        <LifeBuoy className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">{t.bottomTickets}</span>
      </button>

      {currentUser?.role === 'admin' && (
        <button 
          id="mobile-nav-admin"
          onClick={() => setTab('admin')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${currentTab === 'admin' ? 'text-rose-500 font-semibold' : 'text-gray-500 hover:text-rose-400'}`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">{t.bottomAdmin}</span>
        </button>
      )}
    </div>
  );
};
