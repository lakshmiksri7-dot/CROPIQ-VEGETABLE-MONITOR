import React, { useState } from 'react';
import { BatchItem, ScreenId } from '../../types';

interface BatchesScreenProps {
  batches: BatchItem[];
  onOpenAddBatch: () => void;
  onSelectBatchForFreshness: (batch: BatchItem) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const BatchesScreen: React.FC<BatchesScreenProps> = ({
  batches,
  onOpenAddBatch,
  onSelectBatchForFreshness,
  onNavigate
}) => {
  const [cropFilter, setCropFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'quantity' | 'freshness'>('newest');

  const filteredBatches = batches
    .filter((b) => {
      if (cropFilter === 'all') return true;
      return b.crop.toLowerCase() === cropFilter.toLowerCase();
    })
    .sort((a, b) => {
      if (sortOrder === 'quantity') return b.quantityKg - a.quantityKg;
      if (sortOrder === 'freshness') return b.freshnessPercent - a.freshnessPercent;
      return 0; // default newest
    });

  const getCropIcon = (crop: string) => {
    switch (crop.toLowerCase()) {
      case 'tomato':
        return 'eco';
      case 'lettuce':
      case 'leafy veg':
        return 'spa';
      case 'potato':
        return 'psychiatry';
      case 'pepper':
      case 'chilli':
        return 'local_fire_department';
      default:
        return 'grass';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-4 pb-32 flex flex-col gap-5">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold">
          Cold Storage Inventory
        </span>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl sm:text-3xl font-light text-[#f0f0f0] tracking-tight">
            Active Batches
          </h2>
          <span className="text-xs font-mono px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/70">
            {filteredBatches.length} ACTIVE LOTS
          </span>
        </div>
      </div>

      {/* Filter/Sort Utility */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <select
          value={cropFilter}
          onChange={(e) => setCropFilter(e.target.value)}
          className="px-4 py-2 rounded-2xl bg-[#141414] border border-white/10 text-white/80 text-xs font-semibold whitespace-nowrap outline-hidden cursor-pointer hover:border-white/20"
        >
          <option value="all">All Crops</option>
          <option value="tomato">Tomato</option>
          <option value="lettuce">Lettuce</option>
          <option value="potato">Potato</option>
          <option value="pepper">Pepper</option>
          <option value="cabbage">Cabbage</option>
        </select>

        <button
          onClick={() => {
            if (sortOrder === 'newest') setSortOrder('quantity');
            else if (sortOrder === 'quantity') setSortOrder('freshness');
            else setSortOrder('newest');
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-white/70 text-xs font-semibold whitespace-nowrap hover:text-white hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-[14px]">sort</span>
          <span>
            {sortOrder === 'newest'
              ? 'Newest First'
              : sortOrder === 'quantity'
              ? 'Highest Qty'
              : 'Freshness %'}
          </span>
        </button>

        <button
          onClick={() => onNavigate('market')}
          className="flex items-center gap-1 px-4 py-2 rounded-2xl bg-white/5 border border-orange-500/40 text-orange-400 text-xs font-semibold whitespace-nowrap hover:bg-orange-500 hover:text-black transition-colors ml-auto"
        >
          <span className="material-symbols-outlined text-[14px]">local_shipping</span>
          <span>Market Readiness →</span>
        </button>
      </div>

      {/* Batches Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBatches.map((batch) => {
          const isStable = batch.status === 'Stable';
          const isCooling = batch.status === 'Cooling';

          return (
            <div
              key={batch.id}
              id={`batch-card-${batch.batchCode}`}
              onClick={() => onSelectBatchForFreshness(batch)}
              className="bg-[#121212] rounded-[2rem] p-5 border border-white/5 flex flex-col gap-3 relative overflow-hidden group hover:border-orange-500/50 hover:bg-[#161616] transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-orange-400 border border-white/10 group-hover:bg-orange-500 group-hover:text-black transition-colors">
                    <span className="material-symbols-outlined text-2xl">
                      {getCropIcon(batch.crop)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-light text-[#f0f0f0] tracking-tight">
                      {batch.batchCode}
                    </h3>
                    <p className="text-xs font-mono text-white/50">
                      {batch.crop} • {batch.variety}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                    isStable
                      ? 'bg-green-500/15 border border-green-500/30 text-green-400'
                      : isCooling
                      ? 'bg-orange-500/15 border border-orange-500/30 text-orange-400'
                      : 'bg-red-500/15 border border-red-500/30 text-red-400'
                  }`}
                >
                  {batch.status}
                </span>
              </div>

              {/* Metrics row */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="flex flex-col bg-[#181818] p-3 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-mono text-white/40 mb-0.5">
                    Quantity
                  </span>
                  <span className="text-xl font-light text-[#f0f0f0]">
                    {batch.quantityKg}{' '}
                    <span className="text-xs font-mono text-white/40">kg</span>
                  </span>
                </div>

                <div className="flex flex-col bg-[#181818] p-3 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-mono text-white/40 mb-0.5">
                    Stored Date
                  </span>
                  <span className="text-sm font-mono text-[#f0f0f0] mt-0.5">
                    {batch.storedDate}
                  </span>
                </div>
              </div>

              {/* Freshness peek & actions */}
              <div className="flex justify-between items-center pt-2 text-xs text-white/50 border-t border-white/5">
                <span className="flex items-center gap-1 font-mono text-orange-400">
                  <span className="material-symbols-outlined text-[14px]">science</span>
                  {batch.freshnessPercent}% Freshness
                </span>
                <span className="text-[11px] text-white/40 flex items-center gap-0.5 group-hover:text-orange-400 font-mono transition-colors">
                  Inspect <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Button: Add New Batch */}
      <div className="fixed bottom-[84px] md:bottom-8 right-4 md:right-8 z-40">
        <button
          id="btn-add-batch-fab"
          onClick={onOpenAddBatch}
          className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-black rounded-2xl px-6 py-4 shadow-xl shadow-orange-500/25 active:scale-95 transition-all duration-150 font-bold"
        >
          <span className="material-symbols-outlined fill text-2xl">add</span>
          <span className="text-sm whitespace-nowrap">Add New Batch</span>
        </button>
      </div>
    </div>
  );
};
