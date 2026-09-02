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
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pt-4 pb-32 flex flex-col gap-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white rounded-3xl border border-emerald-200 p-5 shadow-sm bg-gradient-to-r from-emerald-50 via-white to-white">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-800 font-extrabold">
            Cold Storage Inventory & Traceability
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Active Cold Storage Batches
          </h2>
          <p className="text-xs text-slate-600">
            Real-time batch condition, storage duration & AI freshness predictions
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1.5 bg-emerald-100 border border-emerald-300 rounded-full text-emerald-900 self-start sm:self-center">
          {filteredBatches.length} ACTIVE LOTS
        </span>
      </div>

      {/* Filter/Sort Utility */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <select
          value={cropFilter}
          onChange={(e) => setCropFilter(e.target.value)}
          className="px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-bold whitespace-nowrap outline-hidden cursor-pointer hover:border-emerald-300 shadow-xs"
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
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-bold whitespace-nowrap hover:bg-emerald-50 hover:text-emerald-900 transition-colors shadow-xs"
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
          className="flex items-center gap-1 px-4 py-2 rounded-2xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold whitespace-nowrap hover:bg-emerald-600 hover:text-white transition-colors ml-auto shadow-xs"
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
              className="bg-white rounded-3xl p-5 border border-slate-200 flex flex-col gap-3 relative overflow-hidden group hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-2xl">
                      {getCropIcon(batch.crop)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight font-mono">
                      {batch.batchCode}
                    </h3>
                    <p className="text-xs font-mono text-slate-600">
                      {batch.crop} • {batch.variety}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                    isStable
                      ? 'bg-emerald-100 border border-emerald-300 text-emerald-900'
                      : isCooling
                      ? 'bg-amber-100 border border-amber-300 text-amber-900'
                      : 'bg-red-100 border border-red-300 text-red-900'
                  }`}
                >
                  {batch.status}
                </span>
              </div>

              {/* Metrics row */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="flex flex-col bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-mono text-slate-500 mb-0.5 font-semibold">
                    Quantity
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 font-mono">
                    {batch.quantityKg}{' '}
                    <span className="text-xs font-mono text-slate-500 font-normal">kg</span>
                  </span>
                </div>

                <div className="flex flex-col bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-mono text-slate-500 mb-0.5 font-semibold">
                    Stored Date
                  </span>
                  <span className="text-xs font-mono text-slate-800 mt-1 font-bold">
                    {batch.storedDate}
                  </span>
                </div>
              </div>

              {/* Freshness peek & actions */}
              <div className="flex justify-between items-center pt-2 text-xs text-slate-600 border-t border-slate-100">
                <span className="flex items-center gap-1 font-mono text-emerald-800 font-bold">
                  <span className="material-symbols-outlined text-[15px] text-emerald-600">science</span>
                  {batch.freshnessPercent}% Freshness
                </span>
                <span className="text-[11px] text-slate-500 flex items-center gap-0.5 group-hover:text-emerald-700 font-mono font-bold transition-colors">
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
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-6 py-4 shadow-xl shadow-emerald-600/30 active:scale-95 transition-all duration-150 font-bold"
        >
          <span className="material-symbols-outlined fill text-2xl">add</span>
          <span className="text-sm whitespace-nowrap">Add New Batch</span>
        </button>
      </div>
    </div>
  );
};
