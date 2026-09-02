import React, { useState } from 'react';
import { StorageSilo, ScreenId } from '../../types';

interface CooperativeMultiUnitScreenProps {
  silos: Record<string, StorageSilo>;
  onNavigate: (screen: ScreenId) => void;
  onOpenAdjustEnv?: () => void;
  onSelectUnit?: (unitId: string) => void;
}

export const CooperativeMultiUnitScreen: React.FC<CooperativeMultiUnitScreenProps> = ({
  silos,
  onNavigate,
  onSelectUnit
}) => {
  const [filterCluster, setFilterCluster] = useState<string>('all');
  const unitList: StorageSilo[] = Object.values(silos);

  const safeUnits = unitList.filter((u) => u.safetyStatus === 'SAFE').length;
  const warningUnits = unitList.filter((u) => u.safetyStatus === 'WARNING').length;
  const criticalUnits = unitList.filter((u) => u.safetyStatus === 'CRITICAL').length;
  const totalCapacityKg = 1680;

  const filteredUnits = filterCluster === 'all' 
    ? unitList 
    : unitList.filter((u) => u.cluster.toLowerCase().includes(filterCluster.toLowerCase()));

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 flex flex-col gap-5">
      {/* Cooperative Header Banner */}
      <section className="w-full bg-[#121212] rounded-[2rem] border border-emerald-500/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden bg-gradient-to-r from-emerald-950/30 via-[#121212] to-[#121212]">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-bold">
            Cooperative Regional Hub Monitoring
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            North Eastern Region Units
          </h2>
          <span className="text-xs text-white/50 font-mono">
            Assam • Meghalaya • Nagaland FPO Cluster Network
          </span>
        </div>

        {/* Aggregated Cluster Stats */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-400 font-bold">{safeUnits} SAFE</span>
          </div>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span className="text-yellow-400 font-bold">{warningUnits} WARN</span>
          </div>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 font-bold">{criticalUnits} CRIT</span>
          </div>
        </div>
      </section>

      {/* Quick Filter Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex gap-2">
          {['all', 'Assam', 'Nagaland', 'Meghalaya'].map((c) => (
            <button
              key={c}
              onClick={() => setFilterCluster(c)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                filterCluster === c
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {c === 'all' ? 'All Units (4)' : c}
            </button>
          ))}
        </div>

        <button
          onClick={() => onNavigate('map-locations')}
          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 shrink-0 border border-white/10"
        >
          <span className="material-symbols-outlined text-sm">map</span>
          <span>View on GPS Map</span>
        </button>
      </div>

      {/* Unit Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUnits.map((unit) => {
          const isSafe = unit.safetyStatus === 'SAFE';
          const isWarning = unit.safetyStatus === 'WARNING';
          const isCritical = unit.safetyStatus === 'CRITICAL';

          return (
            <div
              key={unit.id}
              onClick={() => {
                if (onSelectUnit) onSelectUnit(unit.id);
                onNavigate('storage');
              }}
              className={`bg-[#121212] rounded-[2rem] border p-5 flex flex-col justify-between gap-4 cursor-pointer hover:bg-[#161616] transition-all relative overflow-hidden group ${
                isSafe
                  ? 'border-white/5 hover:border-emerald-500/40'
                  : isWarning
                  ? 'border-yellow-500/40 hover:border-yellow-500'
                  : 'border-red-500/50 hover:border-red-500 shadow-lg shadow-red-950/20'
              }`}
            >
              {/* Top Unit Title & Safety Badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-white/40">{unit.unitCode}</span>
                    <span className="text-[11px] text-white/60 font-mono">• {unit.locationName}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mt-0.5">
                    {unit.name}
                  </h3>
                  <span className="text-xs text-white/60 font-medium">
                    Stored Crop: <strong className="text-white">{unit.cropName}</strong>
                  </span>
                </div>

                {/* Safety Status Pill */}
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 flex items-center gap-1.5 ${
                    isSafe
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isWarning
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSafe ? 'bg-emerald-400' : isWarning ? 'bg-yellow-400' : 'bg-red-500'
                    }`}
                  />
                  <span>{unit.safetyStatus}</span>
                </span>
              </div>

              {/* Core Telemetry Grid (Farmer Friendly) */}
              <div className="grid grid-cols-3 gap-2 bg-white/5 rounded-2xl p-3 border border-white/5">
                {/* Temp */}
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-white/40 font-mono">Temp</span>
                  <span className="text-xl font-bold text-white">
                    {unit.currentTemp}°C
                  </span>
                  <span className="text-[10px] text-white/50 font-mono">{unit.targetTempRange}</span>
                </div>

                {/* Humidity */}
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-white/40 font-mono">Humidity</span>
                  <span className="text-xl font-bold text-white">
                    {unit.currentHumidity}%
                  </span>
                  <span className="text-[10px] text-white/50 font-mono">RH Level</span>
                </div>

                {/* Battery & Backup */}
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-white/40 font-mono">Battery</span>
                  <span className="text-xl font-bold text-emerald-400">
                    {unit.batteryBackupPercent}%
                  </span>
                  <span className="text-[10px] text-emerald-400/80 font-mono">
                    {unit.estimatedBackupHours}h backup
                  </span>
                </div>
              </div>

              {/* Status Note & Door Info */}
              <div className="flex items-center justify-between text-xs text-white/60 pt-1 border-t border-white/5">
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="material-symbols-outlined text-sm text-emerald-400">
                    {unit.doorStatus === 'CLOSED' ? 'lock' : 'door_open'}
                  </span>
                  <span>Door: {unit.doorStatus}</span>
                  {unit.doorStatus === 'OPEN' && (
                    <span className="text-red-400 font-bold">({unit.doorOpenDurationSeconds}s)</span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Manage Unit</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Aggregate Storage Capacity Bar */}
      <section className="bg-[#121212] rounded-[2rem] border border-white/5 p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/50 font-mono uppercase">Total Cooperative Capacity In Use</span>
          <span className="font-bold text-emerald-400 font-mono">{totalCapacityKg} KG / 3,000 KG (56% Occupied)</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full w-[56%]" />
        </div>
      </section>
    </div>
  );
};
