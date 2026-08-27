import React from 'react';
import { ASSETS } from '../../data/mockData';
import { BatchItem, ScreenId } from '../../types';

interface FreshnessScreenProps {
  batch: BatchItem;
  onNavigate: (screen: ScreenId) => void;
  onOpenAdjustEnv: () => void;
  onOpenLiveCamera: () => void;
}

export const FreshnessScreen: React.FC<FreshnessScreenProps> = ({
  batch,
  onNavigate,
  onOpenAdjustEnv,
  onOpenLiveCamera
}) => {
  return (
    <div className="w-full max-w-md mx-auto px-4 pt-4 pb-28 flex flex-col gap-5">
      {/* Header & Batch Info */}
      <section className="flex flex-col gap-1 text-center">
        <span className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold self-center">
          AI Freshness Analysis
        </span>
        <h2 className="text-2xl sm:text-3xl font-light text-[#f0f0f0] tracking-tight">
          {batch.crop} Batch #{batch.batchCode}
        </h2>
        <p className="text-xs font-mono text-white/40">
          Last scanned: 10 mins ago via environmental sensors
        </p>
      </section>

      {/* Primary Meter (Bento Donut Chart Card) */}
      <section className="bg-[#121212] rounded-[2rem] border border-white/5 p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-white/20 transition-all">
        <h3 className="text-[10px] font-mono text-white/40 mb-4 uppercase tracking-widest">
          Overall Freshness Index
        </h3>

        {/* SVG Donut Gauge */}
        <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center mb-2">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            {/* Background Track */}
            <path
              className="text-white/10"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            {/* Foreground Fill */}
            <path
              className="text-orange-500 transition-all duration-1000 ease-out"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray={`${batch.freshnessPercent}, 100`}
              strokeLinecap="round"
              strokeWidth="3.5"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl sm:text-5xl font-light text-[#f0f0f0] tracking-tighter">
              {batch.freshnessPercent}
              <span className="text-2xl font-light text-white/40">%</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30 px-3 py-0.5 rounded-full mt-1">
              OPTIMAL
            </span>
          </div>
        </div>
      </section>

      {/* Risk & Shelf Life Grid */}
      <section className="grid grid-cols-2 gap-3.5">
        {/* Spoilage Risk */}
        <div className="bg-[#121212] rounded-[2rem] p-5 flex flex-col justify-between border border-white/5">
          <div>
            <div className="flex items-center gap-1.5 text-white/40 mb-2">
              <span className="material-symbols-outlined text-[16px] text-orange-400">warning</span>
              <span className="text-[10px] font-mono uppercase tracking-widest">
                Spoilage Risk
              </span>
            </div>
            <span className="text-2xl font-light text-[#f0f0f0] tracking-tight">
              {batch.spoilageRisk}
            </span>
          </div>

          <div className="mt-3">
            {/* Risk Bar */}
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden flex">
              <div className="h-full bg-green-500 w-1/4 rounded-full" />
            </div>
            <p className="text-[10px] font-mono text-white/40 mt-1.5">
              Conditions stable
            </p>
          </div>
        </div>

        {/* Shelf Life */}
        <div className="bg-[#121212] rounded-[2rem] p-5 flex flex-col justify-between border border-white/5">
          <div>
            <div className="flex items-center gap-1.5 text-white/40 mb-2">
              <span className="material-symbols-outlined text-[16px] text-orange-400">calendar_month</span>
              <span className="text-[10px] font-mono uppercase tracking-widest">
                Shelf Life
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-light text-[#f0f0f0] tracking-tight">
                {batch.shelfLifeDays}
              </span>
              <span className="text-xs font-mono text-white/40">Days</span>
            </div>
          </div>

          <div className="mt-3">
            {/* Timeline Tick Visual */}
            <div className="flex gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${
                    i < batch.shelfLifeDays ? 'bg-orange-500' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] font-mono text-white/40 mt-1.5">
              Est. time remaining
            </p>
          </div>
        </div>
      </section>

      {/* Recommended Action Banner */}
      <section className="bg-[#121212] border border-white/5 rounded-[2rem] p-5 flex items-center gap-3.5">
        <div className="bg-orange-500/15 border border-orange-500/30 p-2.5 rounded-2xl flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-orange-400 text-xl">check_circle</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-mono uppercase tracking-widest text-orange-500 font-bold">
            Recommended Action
          </span>
          <span className="text-xs text-white/80 leading-snug mt-0.5">
            Safe to continue storage. Maintain current temperature ({batch.targetTemp}).
          </span>
        </div>
      </section>

      {/* Visual Inspection Camera Snapshot */}
      <section
        onClick={onOpenLiveCamera}
        className="rounded-[2rem] overflow-hidden h-40 relative group cursor-pointer border border-white/10 bg-[#121212]"
      >
        <img
          src={ASSETS.visualInspectionTomatoes}
          alt="Visual inspection of tomatoes in storage crate"
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
          <div className="flex items-center gap-2 text-white text-xs font-mono">
            <span className="material-symbols-outlined text-[18px] text-orange-500">visibility</span>
            <span>Visual inspection verified</span>
          </div>
        </div>
      </section>

      {/* Secondary Actions */}
      <section className="grid grid-cols-2 gap-3 pb-4">
        <button
          id="btn-freshness-history"
          onClick={() => onNavigate('history')}
          className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm py-3.5 rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg text-orange-400">history</span>
          <span>View History</span>
        </button>

        <button
          id="btn-freshness-adjust-env"
          onClick={onOpenAdjustEnv}
          className="bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm py-3.5 rounded-2xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">tune</span>
          <span>Adjust Env</span>
        </button>
      </section>
    </div>
  );
};
