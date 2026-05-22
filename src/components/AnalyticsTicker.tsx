import React, { useState, useEffect } from 'react';
import { useAppState } from '../lib/state';
import { Activity, BellRing, ArrowUpRight } from 'lucide-react';

interface SimulatedActivity {
  id: string;
  service: string;
  qty: number;
  status: string;
  time: string;
}

export const AnalyticsTicker: React.FC = () => {
  const { lang, services } = useAppState();
  const [activities, setActivities] = useState<SimulatedActivity[]>([]);

  // Sample static lists to populate rich simulated tickers
  const firstNames = ['Bayzid', 'Rakib', 'Sajid', 'Farhana', 'Mustafiz', 'Tariq', 'Mithila', 'Afsana', 'Habib', 'Imtiaz'];
  const locations = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Mirpur', 'Uttara', 'Mymensingh', 'Gazipur'];

  useEffect(() => {
    // Generate initial 4 events
    const generateEvent = (): SimulatedActivity => {
      const idx = Math.floor(Math.random() * (services.length || 1));
      const srv = services[idx] || { nameEn: 'TikTok Real Followers', nameBn: 'টিকটক রিয়েল ফলোয়ার্স' };
      const serviceName = lang === 'bn' ? srv.nameBn : srv.nameEn;
      const roundedQty = [1000, 2000, 5000, 500, 10000][Math.floor(Math.random() * 5)];
      
      return {
        id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        service: serviceName.length > 35 ? serviceName.substring(0, 35) + '...' : serviceName,
        qty: roundedQty,
        status: lang === 'bn' ? 'সম্পন্ন হয়েছে' : 'Completed',
        time: lang === 'bn' ? '১ মিনিট আগে' : '1m ago'
      };
    };

    setActivities([generateEvent(), generateEvent(), generateEvent(), generateEvent()]);

    // Periodically add new activities
    const interval = setInterval(() => {
      setActivities((prev) => {
        const next = [generateEvent(), ...prev.slice(0, 4)];
        return next;
      });
    }, 12000);

    return () => clearInterval(interval);
  }, [lang, services]);

  return (
    <div id="analytics-live-ticker" className="bg-gradient-to-r from-gray-900 via-emerald-950 to-gray-950 text-white py-2 px-4 shadow-sm border-y border-emerald-500/10 overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-1.5 shrink-0 text-emerald-400 font-bold uppercase tracking-wider font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <Activity className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'লাইভ অ্যাক্টিভিটি ট্র্যাকার' : 'Live Order Tracker'}</span>
        </div>

        {/* Ticker Container scroll */}
        <div className="flex items-center gap-6 overflow-hidden w-full relative">
          <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
            {activities.map((act, i) => (
              <div key={act.id + i} id={`ticker-item-${i}`} className="flex items-center gap-2 bg-white/5 border border-white/5 py-1 px-3 rounded-full text-[11px] font-medium tracking-tight">
                <BellRing className="w-3 h-3 text-emerald-400" />
                <span className="text-gray-300 font-mono text-[10px]">{act.id}</span>
                <span className="text-white font-medium">{act.service}</span>
                <span className="text-emerald-300 font-bold">({act.qty} units)</span>
                <span className="flex items-center gap-0.5 text-emerald-400 text-[10px] bg-emerald-500/15 px-1.5 py-0.5 rounded-md">
                  <ArrowUpRight className="w-2.5 h-2.5" />
                  <span>{act.status}</span>
                </span>
                <span className="text-gray-400 font-normal italic">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
