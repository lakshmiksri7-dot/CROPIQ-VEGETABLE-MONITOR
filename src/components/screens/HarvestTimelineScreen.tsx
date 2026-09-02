import React from 'react';
import { HARVEST_TIMELINE_STAGES } from '../../data/mockData';
import { AppLanguage, BatchItem } from '../../types';

interface HarvestTimelineScreenProps {
  language: AppLanguage;
  batch: BatchItem;
  onNavigate: (screen: any) => void;
}

export const HarvestTimelineScreen: React.FC<HarvestTimelineScreenProps> = ({
  language,
  batch,
  onNavigate
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 flex flex-col gap-5">
      {/* Header Banner */}
      <section className="w-full bg-[#121212] rounded-[2rem] border border-emerald-500/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden bg-gradient-to-r from-emerald-950/30 via-[#121212] to-[#121212]">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-bold">
            Post-Harvest Traceability & Value Chain
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Harvest-to-Market Timeline
          </h2>
          <span className="text-xs text-white/50 font-mono">
            Batch #{batch.batchCode} • {batch.crop} ({batch.quantityKg} KG)
          </span>
        </div>

        <button
          onClick={() => onNavigate('market')}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-lg shadow-emerald-500/20"
        >
          <span className="material-symbols-outlined text-sm">trending_up</span>
          <span>Market Decision</span>
        </button>
      </section>

      {/* Current Active Batch Highlight Card */}
      <div className="bg-[#121212] rounded-[2rem] border border-white/5 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <span className="material-symbols-outlined text-3xl">local_shipping</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-400 font-mono font-bold">ACTIVE VALUE CHAIN</span>
              <span className="text-xs text-white/40">• {batch.storedDate}</span>
            </div>
            <h3 className="text-lg font-bold text-white">{batch.crop} ({batch.variety})</h3>
            <p className="text-xs text-white/60">
              Farmer: <strong className="text-white">{batch.farmerName}</strong> • Unit: {batch.silo}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/5 border border-white/5 px-3 py-2 rounded-xl text-right">
            <span className="text-[10px] text-white/40 font-mono uppercase block">Freshness</span>
            <span className="text-base font-bold text-emerald-400 font-mono">{batch.freshnessPercent}%</span>
          </div>
          <div className="bg-white/5 border border-white/5 px-3 py-2 rounded-xl text-right">
            <span className="text-[10px] text-white/40 font-mono uppercase block">Action</span>
            <span className="text-xs font-bold text-emerald-300">{batch.transportRecommendation}</span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Vertical Timeline */}
      <div className="bg-[#121212] rounded-[2.5rem] border border-white/5 p-6 flex flex-col gap-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400">timeline</span>
          <span>Value Chain Stages</span>
        </h3>

        <div className="relative flex flex-col gap-8 pl-4 before:absolute before:top-3 before:bottom-3 before:left-8 before:w-0.5 before:bg-emerald-500/30">
          {HARVEST_TIMELINE_STAGES.map((stage, idx) => {
            const isCompleted = stage.status === 'completed';
            const isActive = stage.status === 'active';
            const isUpcoming = stage.status === 'upcoming';

            const title = language === 'as' ? stage.titleAs : language === 'hi' ? stage.titleHi : stage.title;

            return (
              <div key={stage.id} className="relative flex items-start gap-5 group">
                {/* Node Icon */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 font-bold transition-all shadow-md ${
                    isCompleted
                      ? 'bg-emerald-500 text-black shadow-emerald-500/30'
                      : isActive
                      ? 'bg-emerald-400 text-black ring-4 ring-emerald-500/30 animate-pulse'
                      : 'bg-[#181818] border border-white/20 text-white/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {isCompleted ? 'check' : stage.icon}
                  </span>
                </div>

                {/* Stage Content Card */}
                <div
                  className={`flex-1 bg-white/5 border rounded-2xl p-4.5 transition-all ${
                    isActive
                      ? 'border-emerald-500/40 bg-emerald-950/20'
                      : 'border-white/5 group-hover:border-white/10'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base">{title}</h4>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : isActive
                            ? 'bg-emerald-400 text-black'
                            : 'bg-white/5 text-white/40'
                        }`}
                      >
                        {stage.badge}
                      </span>
                    </div>

                    <span className="text-xs text-white/40 font-mono">{stage.time}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-2">
                    {stage.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-400/80 font-mono">
                    <span className="material-symbols-outlined text-xs">location_on</span>
                    <span>{stage.location}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
