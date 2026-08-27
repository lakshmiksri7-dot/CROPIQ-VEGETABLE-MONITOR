import React, { useState } from 'react';
import { HISTORICAL_BATCHES } from '../../data/mockData';
import { ScreenId } from '../../types';

interface HistoryScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'this-month' | 'last-month' | 'older'>(
    'this-month'
  );
  const [selectedBatchDetails, setSelectedBatchDetails] = useState<string | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-4 pb-28 flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold">
          Archived Analytics
        </span>
        <h2 className="text-2xl sm:text-3xl font-light text-[#f0f0f0] tracking-tight">
          Storage History
        </h2>
        <p className="text-xs font-mono text-white/40">
          Historical chamber equilibrium logs and batch quality outcomes.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto pb-1 gap-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('this-month')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'this-month'
              ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20'
              : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">calendar_month</span>
          <span>This Month</span>
        </button>

        <button
          onClick={() => setActiveTab('last-month')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'last-month'
              ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20'
              : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">date_range</span>
          <span>Last Month</span>
        </button>

        <button
          onClick={() => setActiveTab('older')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'older'
              ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20'
              : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">history</span>
          <span>Older Archive</span>
        </button>
      </div>

      {/* Trends Section (Bento Grid) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Temperature Chart Card */}
        <div className="bg-[#121212] rounded-[2rem] p-6 border border-white/5 flex flex-col justify-between hover:border-orange-500/40 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1.5 text-orange-400">
                <span className="material-symbols-outlined text-base">thermostat</span>
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-orange-500 font-bold">
                  Avg Temperature
                </h3>
              </div>
              <p className="text-3xl sm:text-4xl font-light text-[#f0f0f0] mt-1 tracking-tight">
                4.2°C
              </p>
            </div>
            <span className="flex items-center gap-1 text-green-400 bg-green-500/15 border border-green-500/30 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold">
              <span className="material-symbols-outlined text-[14px]">trending_down</span>
              <span>0.5°</span>
            </span>
          </div>

          {/* SVG Line Graph */}
          <div className="h-32 w-full relative mt-4">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
              <defs>
                <linearGradient id="tempGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,30 L10,25 L20,28 L30,20 L40,22 L50,15 L60,18 L70,10 L80,12 L90,5 L100,8"
                fill="none"
                stroke="#f97316"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M0,30 L10,25 L20,28 L30,20 L40,22 L50,15 L60,18 L70,10 L80,12 L90,5 L100,8 L100,40 L0,40 Z"
                fill="url(#tempGradient)"
              />
            </svg>
            <div className="flex justify-between text-white/40 text-[10px] font-mono mt-1">
              <span>W1</span>
              <span>W2</span>
              <span>W3</span>
              <span>W4</span>
            </div>
          </div>
        </div>

        {/* Humidity Chart Card */}
        <div className="bg-[#121212] rounded-[2rem] p-6 border border-white/5 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1.5 text-cyan-400">
                <span className="material-symbols-outlined text-base">water_drop</span>
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  Avg Humidity
                </h3>
              </div>
              <p className="text-3xl sm:text-4xl font-light text-[#f0f0f0] mt-1 tracking-tight">
                82%
              </p>
            </div>
            <span className="flex items-center gap-1 text-white/70 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold">
              <span className="material-symbols-outlined text-[14px]">trending_flat</span>
              <span>STABLE</span>
            </span>
          </div>

          {/* SVG Line Graph */}
          <div className="h-32 w-full relative mt-4">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
              <defs>
                <linearGradient id="humGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,20 L10,22 L20,21 L30,19 L40,20 L50,23 L60,22 L70,20 L80,19 L90,21 L100,20"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M0,20 L10,22 L20,21 L30,19 L40,20 L50,23 L60,22 L70,20 L80,19 L90,21 L100,20 L100,40 L0,40 Z"
                fill="url(#humGradient)"
              />
            </svg>
            <div className="flex justify-between text-white/40 text-[10px] font-mono mt-1">
              <span>W1</span>
              <span>W2</span>
              <span>W3</span>
              <span>W4</span>
            </div>
          </div>
        </div>

        {/* Battery Power Trend */}
        <div className="bg-[#121212] rounded-[2rem] p-6 border border-white/5 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-1.5 text-green-400">
              <span className="material-symbols-outlined text-base">
                battery_charging_full
              </span>
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-green-400 font-bold">
                Microgrid Power Continuity
              </h3>
            </div>
            <span className="text-xs font-mono text-white/40">Daily Mean Charge</span>
          </div>

          {/* Bar chart representation */}
          <div className="flex items-end h-24 gap-2 w-full pt-2">
            {[
              { day: 'Mon', height: '60%', val: '60%' },
              { day: 'Tue', height: '75%', val: '75%' },
              { day: 'Wed', height: '90%', val: '90%' },
              { day: 'Thu', height: '80%', val: '80%' },
              { day: 'Fri', height: '95%', val: '95%' },
              { day: 'Sat', height: '100%', val: '100%' },
              { day: 'Sun', height: '85%', val: '85%' }
            ].map((b, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                <div
                  className="w-full bg-orange-500/80 hover:bg-orange-400 rounded-t-sm transition-all"
                  style={{ height: b.height }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between text-white/40 text-[10px] font-mono mt-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
      </section>

      {/* Historical Batches */}
      <section className="flex flex-col gap-3">
        <h3 className="text-lg font-light text-[#f0f0f0]">Archived Batches</h3>
        <div className="flex flex-col gap-3">
          {HISTORICAL_BATCHES.map((h) => (
            <div
              key={h.id}
              onClick={() =>
                setSelectedBatchDetails(
                  selectedBatchDetails === h.id ? null : h.id
                )
              }
              className="bg-[#121212] rounded-[2rem] p-5 border border-white/5 flex flex-col gap-3 relative overflow-hidden cursor-pointer hover:border-orange-500/40 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 overflow-hidden shrink-0 border border-white/10">
                  <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="text-base font-light text-[#f0f0f0]">{h.name}</h4>
                    <span className="bg-green-500/15 border border-green-500/30 text-green-400 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider">
                      {h.grade}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-white/60 mt-0.5">
                    {h.crop} • {h.quantityKg}kg
                  </p>
                  <p className="text-[11px] font-mono text-white/40 mt-0.5">{h.storedRange}</p>
                </div>

                <span className="material-symbols-outlined text-white/30">
                  chevron_right
                </span>
              </div>

              {selectedBatchDetails === h.id && (
                <div className="mt-2 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-xs bg-[#181818] p-3.5 rounded-2xl border border-white/5">
                  <div>
                    <span className="text-white/40 block font-mono text-[10px]">Average Temp</span>
                    <span className="font-mono text-[#f0f0f0] text-sm">{h.avgTemp}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block font-mono text-[10px]">Average Humidity</span>
                    <span className="font-mono text-[#f0f0f0] text-sm">{h.avgHumidity}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
