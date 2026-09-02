import React, { useState } from 'react';
import { ENERGY_FLOW_DATA } from '../../data/mockData';
import { ScreenId } from '../../types';

interface EnergyScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const EnergyScreen: React.FC<EnergyScreenProps> = ({ onNavigate }) => {
  const [isWeatherModeActive, setIsWeatherModeActive] = useState<boolean>(true);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-4 pb-28 space-y-5">
      {/* Header Section */}
      <section className="w-full bg-[#121212] rounded-[2rem] border border-emerald-500/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden bg-gradient-to-r from-emerald-950/30 via-[#121212] to-[#121212]">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-bold">
            Solar-Powered Smart Cold Chain Energy
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Energy Management & PCM
          </h2>
          <span className="text-xs text-white/50 font-mono">
            Photovoltaic MPPT Harvesting • LiFePO4 Array • Thermal PCM Battery
          </span>
        </div>

        <button
          onClick={() => onNavigate('storage')}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 shrink-0 border border-white/10"
        >
          <span className="material-symbols-outlined text-sm">ac_unit</span>
          <span>Chamber Status</span>
        </button>
      </section>

      {/* Weather-Aware Solar Optimization Notice ⭐ */}
      <div className="bg-[#121212] rounded-[2rem] p-5 flex items-start space-x-3.5 border border-emerald-500/30">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
          <span className="material-symbols-outlined text-2xl">sunny</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-0.5">
              ⭐ Weather-Aware Predictive Cooling Active
            </span>
            <button
              onClick={() => setIsWeatherModeActive(!isWeatherModeActive)}
              className="text-[11px] font-mono font-bold text-emerald-400 hover:underline"
            >
              {isWeatherModeActive ? 'Enabled' : 'Disabled'}
            </button>
          </div>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Monsoon cloud cover predicted for Brahmaputra valley tomorrow. Smart controller is pre-cooling the Phase Change Material (PCM) to 100% frozen state during today's peak 4.2 kW solar hours.
          </p>
        </div>
      </div>

      {/* Main Stats Grid: Solar, Battery, Backup Hours, PCM Reserve */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Solar Generation */}
        <div className="bg-[#121212] rounded-[2rem] p-5 border border-white/5 flex flex-col justify-between hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-bold">
              Solar Gen
            </span>
            <span className="material-symbols-outlined text-emerald-400 text-base">
              solar_power
            </span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-light text-white block tracking-tighter font-mono">
              4.2 kW
            </span>
            <span className="text-xs font-mono text-white/40">Peak Harvest (MPPT)</span>
          </div>
        </div>

        {/* Battery Level */}
        <div className="bg-[#121212] rounded-[2rem] p-5 border border-white/5 flex flex-col justify-between hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-bold">
              Battery SoC
            </span>
            <span className="material-symbols-outlined text-emerald-400 text-base">
              battery_charging_full
            </span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-light text-white block tracking-tighter font-mono">
              76%
            </span>
            <span className="text-xs font-mono text-emerald-400">LiFePO4 Array 48V</span>
          </div>
        </div>

        {/* Estimated Backup Hours ⭐ */}
        <div className="bg-[#121212] rounded-[2rem] p-5 border border-white/5 flex flex-col justify-between hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-bold">
              Backup Prediction
            </span>
            <span className="material-symbols-outlined text-emerald-400 text-base">
              schedule
            </span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-light text-emerald-400 block tracking-tighter font-mono">
              6.5 Hrs
            </span>
            <span className="text-xs font-mono text-white/40">Zero-Solar Autonomy</span>
          </div>
        </div>

        {/* PCM Thermal Battery Storage */}
        <div className="bg-[#121212] rounded-[2rem] p-5 border border-white/5 flex flex-col justify-between hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold">
              PCM Cold Bank
            </span>
            <span className="material-symbols-outlined text-cyan-400 text-base">
              ac_unit
            </span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-light text-cyan-300 block tracking-tighter font-mono">
              92%
            </span>
            <span className="text-xs font-mono text-cyan-400/80">+8h Thermal Buffer</span>
          </div>
        </div>
      </div>

      {/* Chart Section: Solar Generation vs Silo Cooling Load */}
      <div className="bg-[#121212] rounded-[2.5rem] p-6 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
              Daily Solar vs Inverter Consumption
            </span>
            <h3 className="text-base font-medium text-white">Solar PV Generation & Load Flow</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">kW Output</span>
        </div>

        {/* Bar Chart Visualization */}
        <div className="h-48 flex items-end justify-between space-x-2 border-b border-white/10 pb-2 mb-2 relative">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
            <div className="border-t border-white w-full h-0" />
            <div className="border-t border-white w-full h-0" />
            <div className="border-t border-white w-full h-0" />
          </div>

          {/* Bar Pairs */}
          {ENERGY_FLOW_DATA.map((d, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-end h-full w-full group relative"
            >
              <div className="absolute -top-8 hidden group-hover:flex bg-[#1a1a1a] border border-white/10 text-white text-[10px] py-1 px-2 rounded-md whitespace-nowrap z-10 shadow-md font-mono">
                Solar: {d.generationKw}kW | Load: {d.consumptionKw}kW
              </div>

              <div className="flex items-end space-x-1.5 w-full justify-center h-full">
                <div
                  className="w-3 sm:w-4 bg-emerald-500 rounded-t-sm transition-all duration-300 group-hover:bg-emerald-400"
                  style={{ height: d.genHeight }}
                />
                <div
                  className="w-3 sm:w-4 bg-white/20 rounded-t-sm transition-all duration-300 group-hover:bg-white/30"
                  style={{ height: d.consHeight }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* X Axis Labels */}
        <div className="flex justify-between text-[10px] font-mono text-white/40 mt-3">
          <span>06:00 AM</span>
          <span>09:00 AM</span>
          <span>12:00 PM</span>
          <span>03:00 PM</span>
          <span>06:00 PM</span>
          <span>09:00 PM</span>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-6 mt-4 justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-mono text-white/60">Solar Generation (PV)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
            <span className="text-xs font-mono text-white/60">Cooling Inverter Consumption</span>
          </div>
        </div>
      </div>

      {/* Battery State of Health (SoH) & Hardware Telemetry */}
      <div className="bg-[#121212] rounded-[2rem] p-6 border border-white/5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1">
              Battery Health Telemetry
            </span>
            <h3 className="text-base font-medium text-white">LiFePO4 Cell Health & Longevity</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full">
            SoH 98% (Excellent)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white/5 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-white/40 font-mono">Cycle Count</span>
            <span className="text-xl font-bold font-mono text-white mt-2">142 / 3,500 Cycles</span>
            <span className="text-[10px] text-emerald-400 font-mono mt-1">96% Lifespan Remaining</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-white/40 font-mono">BMS Pack Temperature</span>
            <span className="text-xl font-bold font-mono text-white mt-2">24.5°C</span>
            <span className="text-[10px] text-emerald-400 font-mono mt-1">Active Thermal Cooling</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-white/40 font-mono">Inverter Efficiency</span>
            <span className="text-xl font-bold font-mono text-white mt-2">97.8%</span>
            <span className="text-[10px] text-emerald-400 font-mono mt-1">Pure Sine Wave MPPT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
