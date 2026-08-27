import React from 'react';
import { ASSETS } from '../../data/mockData';
import { BatchItem, ScreenId } from '../../types';

interface MarketReadinessScreenProps {
  batches: BatchItem[];
  onOpenScheduleTransport: (batch: BatchItem) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const MarketReadinessScreen: React.FC<MarketReadinessScreenProps> = ({
  batches,
  onOpenScheduleTransport,
  onNavigate
}) => {
  return (
    <div className="w-full max-w-md mx-auto px-4 pt-4 pb-28 space-y-5">
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold block mb-1">
          Supply Chain Telemetry
        </span>
        <h2 className="text-2xl sm:text-3xl font-light text-[#f0f0f0] tracking-tight">
          Market Readiness
        </h2>
        <p className="text-xs font-mono text-white/40 mt-0.5">
          Automated dispatch suggestions based on biochemical freshness metrics.
        </p>
      </div>

      {/* Tomato Batch T102 Card (Ready for Transport) */}
      <div
        id="market-card-t102"
        className="bg-[#121212] rounded-[2rem] border border-white/5 overflow-hidden flex flex-col p-6 hover:border-orange-500/40 transition-all"
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                <img
                  src={ASSETS.marketTomatoCrate}
                  alt="Fresh tomatoes in rustic crate"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-light text-[#f0f0f0]">
                  Tomato Batch T102
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[11px] font-mono text-green-400 font-bold">
                    READY FOR DISPATCH
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#181818] p-3.5 rounded-2xl border border-white/5">
              <span className="text-[10px] font-mono text-white/40 block mb-1">
                Target Window
              </span>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-orange-400">event</span>
                <span className="text-sm font-mono text-[#f0f0f0]">Tomorrow AM</span>
              </div>
            </div>

            <div className="bg-[#181818] p-3.5 rounded-2xl border border-white/5">
              <span className="text-[10px] font-mono text-white/40 block mb-1">
                Payload
              </span>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-orange-400">weight</span>
                <span className="text-sm font-mono text-[#f0f0f0]">48 kg Net</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-500/10 p-4 rounded-2xl flex items-center justify-between border border-orange-500/20">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400 block mb-0.5">
                Peak Freshness
              </span>
              <span className="text-2xl font-light text-orange-400">91%</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-white/40 block mb-0.5">
                Spot Market Demand
              </span>
              <span className="text-xs font-mono font-bold text-black bg-orange-500 px-2.5 py-0.5 rounded-full">
                HIGH DEMAND
              </span>
            </div>
          </div>

          <button
            id="btn-schedule-transport-t102"
            onClick={() => {
              const b = batches.find((item) => item.batchCode === 'T102') || batches[0];
              onOpenScheduleTransport(b);
            }}
            className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-3.5 rounded-2xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">local_shipping</span>
            <span>Schedule Transport</span>
          </button>
        </div>
      </div>

      {/* Pepper Batch P04 Card (Hold for Ripening) */}
      <div
        id="market-card-p04"
        className="bg-[#121212] rounded-[2rem] border border-white/5 overflow-hidden flex flex-col p-6 hover:border-white/20 transition-all"
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                <img
                  src={ASSETS.marketGreenPeppers}
                  alt="Green unripe bell peppers"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-light text-[#f0f0f0]">
                  Pepper Batch P04
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-[11px] font-mono text-amber-400 font-bold">
                    HOLD FOR CONDITIONING
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#181818] p-3.5 rounded-2xl border border-white/5">
              <span className="text-[10px] font-mono text-white/40 block mb-1">
                Est. Readiness
              </span>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-white/50">event</span>
                <span className="text-sm font-mono text-white/80">in 3 Days</span>
              </div>
            </div>

            <div className="bg-[#181818] p-3.5 rounded-2xl border border-white/5">
              <span className="text-[10px] font-mono text-white/40 block mb-1">
                Quantity
              </span>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-white/50">weight</span>
                <span className="text-sm font-mono text-white/80">32 kg Net</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
