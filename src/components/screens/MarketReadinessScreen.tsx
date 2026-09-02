import React, { useState } from 'react';
import { BatchItem, ScreenId, RegionalMandiPrice } from '../../types';
import { REGIONAL_MANDI_PRICES } from '../../data/mockData';

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
  const [selectedMandi, setSelectedMandi] = useState<RegionalMandiPrice>(REGIONAL_MANDI_PRICES[0]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 flex flex-col gap-5">
      {/* Header Banner */}
      <section className="w-full bg-[#121212] rounded-[2rem] border border-emerald-500/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden bg-gradient-to-r from-emerald-950/30 via-[#121212] to-[#121212]">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-bold">
            Algorithmic Post-Harvest Decision Engine
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Market & Transport Decisions
          </h2>
          <span className="text-xs text-white/50 font-mono">
            Optimized for maximum farmer profit using real-time NER mandi prices
          </span>
        </div>

        <button
          onClick={() => onNavigate('timeline')}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 shrink-0 border border-white/10"
        >
          <span className="material-symbols-outlined text-sm">timeline</span>
          <span>Harvest Timeline</span>
        </button>
      </section>

      {/* Smart Transport Recommendations per Batch (3 Action Types: Transport Today, Safe to Store, Sell Soon) */}
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400">local_shipping</span>
          <span>Batch Transport Recommendations</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {batches.map((batch) => {
            const isTransportToday = batch.transportRecommendation === 'Transport Today';
            const isSellSoon = batch.transportRecommendation === 'Sell Soon';
            const isSafeToStore = batch.transportRecommendation === 'Safe to Store';

            return (
              <div
                key={batch.id}
                className={`bg-[#121212] rounded-[2.5rem] border p-5 flex flex-col justify-between gap-4 relative overflow-hidden transition-all ${
                  isTransportToday
                    ? 'border-emerald-500/50 shadow-lg shadow-emerald-950/30 bg-emerald-950/10'
                    : isSellSoon
                    ? 'border-yellow-500/40'
                    : 'border-white/5'
                }`}
              >
                {/* Top Title & Status Pill */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {batch.image && (
                      <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                        <img
                          src={batch.image}
                          alt={batch.crop}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] font-mono text-white/40 block">
                        Batch #{batch.batchCode} • {batch.quantityKg} KG
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-white">
                        {batch.crop} ({batch.variety})
                      </h4>
                      <span className="text-xs text-white/60">
                        Farmer: <strong className="text-white">{batch.farmerName}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Recommendation Chip */}
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 flex items-center gap-1 ${
                      isTransportToday
                        ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                        : isSellSoon
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">
                      {isTransportToday ? 'bolt' : isSellSoon ? 'schedule' : 'lock'}
                    </span>
                    <span>{batch.transportRecommendation}</span>
                  </span>
                </div>

                {/* Algorithmic Reason Box */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold">
                    AI Decision Analysis
                  </span>
                  <p className="text-xs text-white/80 leading-relaxed font-medium">
                    {batch.transportReason}
                  </p>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-white/5 rounded-xl p-2.5">
                    <span className="text-[10px] text-white/40 font-mono block">Freshness</span>
                    <span className="font-mono font-bold text-emerald-400 text-base">
                      {batch.freshnessPercent}%
                    </span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2.5">
                    <span className="text-[10px] text-white/40 font-mono block">Target Mandi</span>
                    <span className="font-bold text-white text-xs truncate block">
                      {batch.targetMandi.split(' ')[0]}
                    </span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2.5">
                    <span className="text-[10px] text-white/40 font-mono block">Est. Rate</span>
                    <span className="font-mono font-bold text-emerald-400 text-base">
                      ₹{batch.marketPriceEstimate}/kg
                    </span>
                  </div>
                </div>

                {/* Dispatch Button */}
                <button
                  onClick={() => onOpenScheduleTransport(batch)}
                  className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
                    isTransportToday
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/30'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">local_shipping</span>
                  <span>{isTransportToday ? 'Schedule Shared Transport Van' : 'View Dispatch Options'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Regional Mandi Price Board (Live NER Wholesale Hubs) */}
      <section className="bg-[#121212] rounded-[2.5rem] border border-white/5 p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400">storefront</span>
              <span>Regional Wholesale Mandi Live Rates</span>
            </h3>
            <p className="text-xs text-white/50 font-mono">
              Direct market rates across Assam, Meghalaya & West Bengal gateways
            </p>
          </div>
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-emerald-400">
            Live Feed • e-NAM Linked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {REGIONAL_MANDI_PRICES.map((mandi) => {
            const priceDiff = mandi.currentPrice - mandi.previousPrice;
            const isUp = mandi.priceTrend === 'up';

            return (
              <div
                key={mandi.id}
                onClick={() => setSelectedMandi(mandi)}
                className={`bg-white/5 border rounded-2xl p-4 flex flex-col justify-between gap-3 cursor-pointer transition-all hover:bg-white/10 ${
                  selectedMandi.id === mandi.id
                    ? 'border-emerald-500/50 bg-emerald-950/10'
                    : 'border-white/5'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-white/40 uppercase block">
                      {mandi.state}
                    </span>
                    <h4 className="font-bold text-white text-base">{mandi.mandiName}</h4>
                    <span className="text-xs text-white/60">Commodity: {mandi.crop}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-bold font-mono text-emerald-400">
                      ₹{mandi.currentPrice}
                      <span className="text-xs text-white/40">/kg</span>
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold flex items-center justify-end gap-0.5 ${
                        isUp ? 'text-emerald-400' : 'text-white/40'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xs">
                        {isUp ? 'arrow_upward' : 'trending_flat'}
                      </span>
                      <span>{priceDiff > 0 ? `+₹${priceDiff} today` : 'Stable'}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-white/50 pt-2 border-t border-white/5 font-mono">
                  <span>{mandi.distanceKm} km from storage</span>
                  <span className="text-emerald-400 font-bold">Demand: {mandi.demandLevel}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Profit Gain Calculation Box */}
        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">savings</span>
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Post-Harvest Loss Savings</h5>
              <p className="text-xs text-white/60">
                Storing tomatoes in CROPIQ preserved 480 kg from 35% rot, earning extra <strong>₹6,720 profit</strong>.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/30 shrink-0">
            +38% Net Realization
          </span>
        </div>
      </section>
    </div>
  );
};
