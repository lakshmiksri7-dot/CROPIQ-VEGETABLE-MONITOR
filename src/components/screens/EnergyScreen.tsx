import React from 'react';
import { ENERGY_FLOW_DATA } from '../../data/mockData';
import { ScreenId } from '../../types';

interface EnergyScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const EnergyScreen: React.FC<EnergyScreenProps> = ({ onNavigate }) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 pt-4 pb-28 space-y-5">
      {/* Header Section */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold block mb-1">
          Renewable Telemetry
        </span>
        <h2 className="text-2xl sm:text-3xl font-light text-[#f0f0f0] tracking-tight">
          Energy Management
        </h2>
        <p className="text-xs font-mono text-white/40 mt-0.5">
          Real-time photovoltaic harvesting and microgrid battery telemetry.
        </p>
      </div>

      {/* Recommendation Banner */}
      <div className="bg-[#121212] rounded-[2rem] p-5 flex items-start space-x-3.5 border border-orange-500/30">
        <div className="w-9 h-9 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-orange-400 text-xl">
            lightbulb
          </span>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-orange-500 font-bold block mb-0.5">
            Optimal Energy Window
          </span>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            High solar yield detected (3.2 kW). Deep precooling cycle recommended for Silo 3.
          </p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Solar Generation */}
        <div className="bg-[#121212] rounded-[2rem] p-5 border border-white/5 flex flex-col justify-between min-h-[140px] hover:border-orange-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold">
              Solar Gen
            </span>
            <span className="material-symbols-outlined text-orange-400 text-base">
              solar_power
            </span>
          </div>
          <div>
            <span className="text-4xl sm:text-5xl font-light text-[#f0f0f0] block tracking-tighter">
              14.2
            </span>
            <span className="text-xs font-mono text-white/40">kW Harvested</span>
          </div>
        </div>

        {/* Battery Level */}
        <div className="bg-[#121212] rounded-[2rem] p-5 border border-white/5 flex flex-col justify-between min-h-[140px] hover:border-green-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-green-400 font-bold">
              Storage Batt
            </span>
            <span className="material-symbols-outlined text-green-400 text-base">
              battery_charging_full
            </span>
          </div>
          <div>
            <span className="text-4xl sm:text-5xl font-light text-[#f0f0f0] block tracking-tighter">
              87%
            </span>
            <span className="text-xs font-mono text-green-400">Charging (Solar MPPT)</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-white/5 h-1.5 mt-2 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full rounded-full w-[87%]" />
          </div>
        </div>
      </div>

      {/* Chart Section: Gen vs Consumption */}
      <div className="bg-[#121212] rounded-[2rem] p-6 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
              Load Dynamics
            </span>
            <h3 className="text-base font-medium text-[#f0f0f0]">Today's Power Flow</h3>
          </div>
          <span className="text-xs font-mono text-orange-400">kW / hr</span>
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
              {/* Tooltip on hover */}
              <div className="absolute -top-8 hidden group-hover:flex bg-[#1a1a1a] border border-white/10 text-white text-[10px] py-1 px-2 rounded-md whitespace-nowrap z-10 shadow-md font-mono">
                Gen: {d.generationKw}kW | Cons: {d.consumptionKw}kW
              </div>

              <div className="flex items-end space-x-1 w-full justify-center h-full">
                <div
                  className="w-2.5 sm:w-3.5 bg-orange-500 rounded-t-sm transition-all duration-300 group-hover:bg-orange-400"
                  style={{ height: d.genHeight }}
                />
                <div
                  className="w-2.5 sm:w-3.5 bg-white/20 rounded-t-sm transition-all duration-300 group-hover:bg-white/30"
                  style={{ height: d.consHeight }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* X Axis Labels */}
        <div className="flex justify-between text-[10px] font-mono text-white/40 mt-3">
          <span>06:00</span>
          <span>09:00</span>
          <span>12:00</span>
          <span>15:00</span>
          <span>18:00</span>
          <span>21:00</span>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-6 mt-4 justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-xs font-mono text-white/60">Solar Generation</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
            <span className="text-xs font-mono text-white/60">Silo Consumption</span>
          </div>
        </div>
      </div>

      {/* Current Usage Breakdown */}
      <div className="bg-[#121212] rounded-[2rem] p-6 border border-white/5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1">
          Subsystem Allocation
        </span>
        <h3 className="text-base font-medium text-[#f0f0f0] mb-4">Current Usage Breakdown</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-orange-400">ac_unit</span>
              </div>
              <div>
                <span className="text-sm font-medium text-[#f0f0f0] block">Chamber Compressor</span>
                <span className="text-xs font-mono text-green-400">Variable Speed Inverter</span>
              </div>
            </div>
            <span className="text-lg font-light text-[#f0f0f0] font-mono">4.2 kW</span>
          </div>

          <div className="border-t border-white/5 pt-3.5 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-white/50">light</span>
              </div>
              <div>
                <span className="text-sm font-medium text-[#f0f0f0] block">
                  Sensors, MCU & Aux
                </span>
                <span className="text-xs font-mono text-white/40">Continuous Low Draw</span>
              </div>
            </div>
            <span className="text-lg font-light text-[#f0f0f0] font-mono">0.8 kW</span>
          </div>
        </div>
      </div>
    </div>
  );
};
