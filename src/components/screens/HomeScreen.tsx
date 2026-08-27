import React from 'react';
import { ASSETS } from '../../data/mockData';
import { BatchItem, ScreenId, StorageSilo } from '../../types';

interface HomeScreenProps {
  batches: BatchItem[];
  silos: Record<string, StorageSilo>;
  onNavigate: (screen: ScreenId) => void;
  onOpenAddBatch: () => void;
  onOpenLiveCamera: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  batches,
  silos,
  onNavigate,
  onOpenAddBatch,
  onOpenLiveCamera
}) => {
  const totalWeightKg = batches.reduce((acc, b) => acc + b.quantityKg, 0);
  const activeSilo = silos['silo-3'] || Object.values(silos)[0];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 flex flex-col gap-5">
      {/* System Status Banner */}
      <section
        id="home-status-banner"
        className="w-full bg-[#121212] rounded-[2rem] border border-white/5 overflow-hidden flex flex-col sm:flex-row items-center justify-between p-6 gap-4 relative transition-all"
      >
        <div className="flex flex-col gap-1 text-center sm:text-left w-full sm:w-auto">
          <span className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold">
            System Telemetry Status
          </span>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-3xl font-light text-[#f0f0f0] tracking-tight">OPERATIONAL</span>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse ml-1" />
          </div>
          <span className="text-xs text-white/40 font-mono">
            Active Silo: {activeSilo.name} • Microclimate Normal
          </span>
        </div>

        <div className="bg-white/5 border border-white/10 px-5 py-2.5 rounded-full text-xs font-mono text-white/80 flex items-center gap-2 shrink-0">
          <span className="material-symbols-outlined text-orange-500 text-base">inventory_2</span>
          <span>
            {batches.length} BATCHES | {totalWeightKg} KG TOTAL
          </span>
        </div>
      </section>

      {/* Bento Grid Metrics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5 w-full">
        {/* Temperature */}
        <div
          onClick={() => onNavigate('storage')}
          className="bg-[#121212] rounded-[2rem] border border-white/5 p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-orange-500/50 hover:bg-[#161616] transition-all"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold">
              TEMP
            </span>
            <span className="bg-white/5 border border-white/10 text-white/60 font-mono text-[9px] px-2 py-0.5 rounded-full uppercase">
              AUTO COOL
            </span>
          </div>

          <div className="my-3">
            <span className="text-4xl md:text-5xl font-light text-[#f0f0f0] tracking-tighter">
              8.5
              <span className="text-2xl font-light text-white/40 ml-1">°C</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-white/50">
            <span>Optimal Range</span>
            <span className="text-orange-400 font-mono text-[11px]">8 - 12°C</span>
          </div>

          {/* Bottom Gauge Visualizer */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
            <div className="h-full bg-orange-500 w-[42%]" />
          </div>
        </div>

        {/* Humidity */}
        <div
          onClick={() => onNavigate('storage')}
          className="bg-[#121212] rounded-[2rem] border border-white/5 p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-orange-500/50 hover:bg-[#161616] transition-all"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold">
              HUMIDITY
            </span>
            <span className="material-symbols-outlined text-white/40 text-base">water_drop</span>
          </div>

          <div className="my-3">
            <span className="text-4xl md:text-5xl font-light text-[#f0f0f0] tracking-tighter">
              84
              <span className="text-2xl font-light text-white/40 ml-1">%</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-white/50">
            <span>Relative Target</span>
            <span className="text-white/80 font-mono text-[11px]">85%</span>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
            <div className="h-full bg-white/40 w-[84%]" />
          </div>
        </div>

        {/* Battery */}
        <div
          onClick={() => onNavigate('energy')}
          className="bg-[#121212] rounded-[2rem] border border-white/5 p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-orange-500/50 hover:bg-[#161616] transition-all"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold">
              STORAGE BATT
            </span>
            <span className="bg-green-500/20 text-green-400 font-mono text-[9px] px-2 py-0.5 rounded-full uppercase">
              CHARGING
            </span>
          </div>

          <div className="my-3">
            <span className="text-4xl md:text-5xl font-light text-[#f0f0f0] tracking-tighter">
              76
              <span className="text-2xl font-light text-white/40 ml-1">%</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-white/50">
            <span>LiFePO4 Array</span>
            <span className="text-green-400 font-mono text-[11px]">48V 200Ah</span>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
            <div className="h-full bg-green-500 w-[76%]" />
          </div>
        </div>

        {/* Solar Input */}
        <div
          onClick={() => onNavigate('energy')}
          className="bg-[#121212] rounded-[2rem] border border-white/5 p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-orange-500/50 hover:bg-[#161616] transition-all"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold">
              SOLAR PV
            </span>
            <span className="material-symbols-outlined text-orange-400 text-base">solar_power</span>
          </div>

          <div className="my-3">
            <span className="text-4xl md:text-5xl font-light text-[#f0f0f0] tracking-tighter">
              320
              <span className="text-2xl font-light text-white/40 ml-1">W</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-white/50">
            <span>Peak Day Load</span>
            <span className="text-orange-400 font-mono text-[11px]">1.8 kW Max</span>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
            <div className="h-full bg-orange-500 w-[65%]" />
          </div>
        </div>
      </section>

      {/* Quick Actions (2x2 Grid) */}
      <section className="grid grid-cols-2 gap-3 w-full">
        <button
          id="btn-view-storage"
          onClick={() => onNavigate('storage')}
          className="bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm sm:text-base py-3.5 px-4 rounded-2xl shadow-lg shadow-orange-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[56px]"
        >
          <span className="material-symbols-outlined text-xl">door_open</span>
          <span>View Storage</span>
        </button>

        <button
          id="btn-add-batch-home"
          onClick={onOpenAddBatch}
          className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-sm sm:text-base py-3.5 px-4 rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[56px]"
        >
          <span className="material-symbols-outlined text-xl text-orange-500">add_circle</span>
          <span>Add Batch</span>
        </button>

        <button
          id="btn-alerts-home"
          onClick={() => onNavigate('alerts')}
          className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold text-sm sm:text-base py-3.5 px-4 rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[56px]"
        >
          <span className="material-symbols-outlined text-xl text-orange-400">warning</span>
          <span>Alerts</span>
        </button>

        <button
          id="btn-freshness-home"
          onClick={() => onNavigate('freshness')}
          className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold text-sm sm:text-base py-3.5 px-4 rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[56px]"
        >
          <span className="material-symbols-outlined text-xl text-emerald-400">eco</span>
          <span>Freshness</span>
        </button>
      </section>

      {/* Recent Image / Context Section */}
      <section
        id="home-live-feed-card"
        onClick={onOpenLiveCamera}
        className="w-full h-52 sm:h-64 rounded-[2rem] overflow-hidden relative border border-white/10 cursor-pointer group bg-[#121212]"
      >
        <img
          src={ASSETS.crateTomatoesInColdRoom}
          alt="Close up photography of fresh vibrant tomatoes in green crates in modern cold room"
          className="w-full h-full object-cover object-center opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        <div className="absolute bottom-5 left-6 right-6 flex justify-between items-end">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-orange-500 font-bold block mb-1">
              Live Sensor Feed
            </span>
            <p className="text-white/60 text-xs font-mono mb-0.5">
              Updated 10m ago • {activeSilo.name}
            </p>
            <h4 className="text-white text-lg sm:text-xl font-bold">
              Batch A - Tomatoes
            </h4>
          </div>

          <span className="bg-white/10 backdrop-blur-md text-white text-xs font-semibold px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/10 group-hover:bg-orange-500 group-hover:text-black group-hover:border-orange-500 transition-all">
            <span className="material-symbols-outlined text-[16px] animate-pulse text-orange-500 group-hover:text-black">
              videocam
            </span>
            <span>Live Camera</span>
          </span>
        </div>
      </section>
    </div>
  );
};
