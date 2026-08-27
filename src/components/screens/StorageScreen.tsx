import React, { useState } from 'react';
import { StorageSilo, ScreenId } from '../../types';

interface StorageScreenProps {
  silos: Record<string, StorageSilo>;
  onNavigate: (screen: ScreenId) => void;
  onOpenAdjustEnv: () => void;
}

export const StorageScreen: React.FC<StorageScreenProps> = ({
  silos,
  onNavigate,
  onOpenAdjustEnv
}) => {
  const [selectedSiloKey, setSelectedSiloKey] = useState<string>('silo-3');
  const silo = silos[selectedSiloKey] || silos['silo-3'];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-4 pb-28 space-y-5">
      {/* Silo Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {Object.keys(silos).map((key) => {
          const s = silos[key];
          const isSelected = selectedSiloKey === key;
          return (
            <button
              key={key}
              id={`tab-silo-${key}`}
              onClick={() => setSelectedSiloKey(key)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? 'bg-orange-500 text-black font-bold shadow-lg shadow-orange-500/20'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:text-white hover:bg-white/10'
              }`}
            >
              {s.name.split(':')[0]}
            </button>
          );
        })}

        <button
          onClick={() => onNavigate('configure-storage')}
          className="ml-auto flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-orange-500 hover:text-black text-orange-400 border border-white/10 text-xs font-semibold whitespace-nowrap transition-all"
        >
          <span className="material-symbols-outlined text-sm">tune</span>
          <span>Configure Presets</span>
        </button>
      </div>

      {/* Header Section */}
      <section className="mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold block mb-1">
            Climate Chamber Telemetry
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-[#f0f0f0] tracking-tight">
            {silo.name}
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 w-max">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>{silo.statusText}</span>
        </div>
      </section>

      {/* Current Readings Grids (Bento Style) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Temperature Semicircular Gauge */}
        <div className="bg-[#121212] p-5 rounded-[2rem] border border-white/5 flex flex-col items-center relative overflow-hidden group hover:border-white/20 transition-all">
          <span className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-1">
            Temperature
          </span>

          {/* SVG Semicircle Gauge */}
          <div className="relative w-28 h-20 my-1 flex items-center justify-center">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 55">
              {/* Background Track */}
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeLinecap="round"
                strokeWidth="8"
              />
              {/* Active arc */}
              <path
                d="M 10 50 A 40 40 0 0 1 72 16"
                fill="none"
                stroke="#f97316"
                strokeLinecap="round"
                strokeWidth="8"
              />
            </svg>
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <span className="text-2xl font-light text-[#f0f0f0] tracking-tighter">
                {silo.currentTemp}°C
              </span>
            </div>
          </div>

          <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full mt-1">
            TARGET {silo.targetTempRange}
          </span>
        </div>

        {/* Humidity Semicircular Gauge */}
        <div className="bg-[#121212] p-5 rounded-[2rem] border border-white/5 flex flex-col items-center relative overflow-hidden group hover:border-white/20 transition-all">
          <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold mb-1">
            Humidity
          </span>

          {/* SVG Semicircle Gauge */}
          <div className="relative w-28 h-20 my-1 flex items-center justify-center">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 55">
              {/* Background Track */}
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeLinecap="round"
                strokeWidth="8"
              />
              {/* Active arc */}
              <path
                d="M 10 50 A 40 40 0 0 1 85 22"
                fill="none"
                stroke="#38bdf8"
                strokeLinecap="round"
                strokeWidth="8"
              />
            </svg>
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <span className="text-2xl font-light text-[#f0f0f0] tracking-tighter">
                {silo.currentHumidity}%
              </span>
            </div>
          </div>

          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full mt-1">
            TARGET {silo.targetHumidityRange}
          </span>
        </div>

        {/* Status Indicators (3 Rows) */}
        <div className="col-span-2 grid grid-rows-3 gap-2">
          {/* Door Status */}
          <div className="bg-[#121212] px-4 py-3 rounded-2xl flex justify-between items-center border border-white/5">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-white/50 text-lg">
                door_front
              </span>
              <span className="text-sm font-medium text-white/80">Door Seal Status</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-green-400 bg-green-500/15 border border-green-500/20 px-3 py-0.5 rounded-full uppercase tracking-wider">
              {silo.doorStatus}
            </span>
          </div>

          {/* Cooling System */}
          <div className="bg-[#121212] px-4 py-3 rounded-2xl flex justify-between items-center border border-white/5">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-white/50 text-lg">ac_unit</span>
              <span className="text-sm font-medium text-white/80">Cooling Inverter</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-orange-400 bg-orange-500/15 border border-orange-500/20 px-3 py-0.5 rounded-full uppercase tracking-wider">
              {silo.coolingSystem}
            </span>
          </div>

          {/* Power Source */}
          <div className="bg-[#121212] px-4 py-3 rounded-2xl flex justify-between items-center border border-white/5">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-white/50 text-lg">power</span>
              <span className="text-sm font-medium text-white/80">Power Feed</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-green-400 bg-green-500/15 border border-green-500/20 px-3 py-0.5 rounded-full uppercase tracking-wider">
              {silo.powerSource}
            </span>
          </div>
        </div>
      </section>

      {/* 24h Trends Section */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#f0f0f0]">24h Thermal Profile</h3>
          <button
            onClick={onOpenAdjustEnv}
            className="text-xs text-orange-400 font-mono hover:text-orange-300 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            <span>Adjust Parameters</span>
          </button>
        </div>

        <div className="bg-[#121212] p-6 rounded-[2rem] border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              Temperature History (°C)
            </span>
            <span className="text-xs font-mono text-orange-400">Mean: 11.2°C</span>
          </div>

          {/* Bar chart representation */}
          <div className="h-36 w-full flex items-end justify-between px-2 pb-2 border-b border-white/10 relative">
            {/* Y Axis Guides */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-white/30 pointer-events-none -ml-1">
              <span>15°</span>
              <span>10°</span>
              <span>5°</span>
            </div>

            {/* Render bars */}
            {silo.tempTrend.map((t, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 group w-1/8">
                <span className="text-[10px] font-mono text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {t.temp}°
                </span>
                <div
                  className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${
                    idx % 2 === 0 ? 'bg-orange-500' : 'bg-orange-500/40'
                  }`}
                  style={{ height: `${t.heightPercent}%` }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-3 text-[10px] text-white/40 font-mono px-2">
            <span>12:00 AM</span>
            <span>06:00 AM</span>
            <span>12:00 PM</span>
            <span>06:00 PM</span>
            <span>CURRENT</span>
          </div>
        </div>
      </section>

      {/* Power / Resource Gauges */}
      <section className="grid grid-cols-2 gap-3.5">
        {/* Solar Intake */}
        <div
          onClick={() => onNavigate('energy')}
          className="bg-[#121212] p-5 rounded-[2rem] border border-white/5 flex flex-col justify-between cursor-pointer hover:border-orange-500/40 transition-all"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-orange-400 text-lg">solar_power</span>
            <span className="text-sm font-semibold text-[#f0f0f0]">Solar Array Input</span>
          </div>

          <div className="w-full bg-white/5 rounded-full h-3 my-3 overflow-hidden border border-white/10">
            <div className="bg-orange-500 h-full rounded-full w-[75%]" />
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-white/40 font-mono">Current Output</span>
            <span className="text-orange-400 font-mono font-bold">{silo.solarIntakeLabel}</span>
          </div>
        </div>

        {/* Battery Backup */}
        <div
          onClick={() => onNavigate('energy')}
          className="bg-[#121212] p-5 rounded-[2rem] border border-white/5 flex flex-col justify-between cursor-pointer hover:border-green-500/40 transition-all"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-green-400 text-lg">battery_charging_full</span>
            <span className="text-sm font-semibold text-[#f0f0f0]">Battery State of Charge</span>
          </div>

          <div className="w-full bg-white/5 rounded-full h-3 my-3 overflow-hidden border border-white/10">
            <div
              className="bg-green-500 h-full rounded-full transition-all"
              style={{ width: `${silo.batteryBackupPercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-white/40 font-mono">Reserve</span>
            <span className="text-green-400 font-mono font-bold">{silo.batteryBackupPercent}%</span>
          </div>
        </div>
      </section>
    </div>
  );
};
