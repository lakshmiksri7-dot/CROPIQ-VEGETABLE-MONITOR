import React, { useState } from 'react';
import { StorageSilo } from '../../types';

interface AdjustEnvModalProps {
  isOpen: boolean;
  onClose: () => void;
  silo: StorageSilo;
  onSaveAdjustments: (newTemp: number, newHumidity: number) => void;
}

export const AdjustEnvModal: React.FC<AdjustEnvModalProps> = ({
  isOpen,
  onClose,
  silo,
  onSaveAdjustments
}) => {
  const [temp, setTemp] = useState<number>(silo.currentTemp || 12);
  const [humidity, setHumidity] = useState<number>(silo.currentHumidity || 85);
  const [coolingMode, setCoolingMode] = useState<'eco' | 'boost' | 'auto'>('auto');
  const [fanSpeed, setFanSpeed] = useState<number>(75);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAdjustments(temp, humidity);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#121212] rounded-[2rem] w-full max-w-md shadow-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-[#141414]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-400">tune</span>
            <h3 className="font-light text-lg text-[#f0f0f0]">Calibrate Chamber Microclimate</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Temperature Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono font-bold text-orange-500 uppercase tracking-widest flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-orange-400">
                  thermostat
                </span>
                Target Temperature
              </label>
              <span className="text-base font-mono font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30 px-2.5 py-0.5 rounded-xl">
                {temp}°C
              </span>
            </div>
            <input
              type="range"
              min={2}
              max={22}
              step={0.5}
              value={temp}
              onChange={(e) => setTemp(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[10px] text-white/40 font-mono">
              <span>2°C (Deep Chill)</span>
              <span>12°C (Standard)</span>
              <span>22°C (Ambient)</span>
            </div>
          </div>

          {/* Humidity Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-cyan-400">
                  water_drop
                </span>
                Target Relative Humidity
              </label>
              <span className="text-base font-mono font-bold text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 rounded-xl">
                {humidity}%
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={98}
              step={1}
              value={humidity}
              onChange={(e) => setHumidity(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-white/40 font-mono">
              <span>50% (Dry)</span>
              <span>85% (Equilibrium)</span>
              <span>98% (Saturated)</span>
            </div>
          </div>

          {/* Cooling Mode */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest block">
              Cooling Algorithm Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['auto', 'eco', 'boost'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setCoolingMode(mode)}
                  className={`py-2 rounded-2xl text-xs font-mono font-bold uppercase transition-all ${
                    coolingMode === mode
                      ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20'
                      : 'bg-white/5 text-white/70 border border-white/5 hover:bg-white/10'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Fan Speed */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-white/40">air</span>
                Circulation Fan Speed
              </label>
              <span className="text-xs font-mono text-white/70">{fanSpeed}%</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              step={5}
              value={fanSpeed}
              onChange={(e) => setFanSpeed(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white/70 font-mono text-xs rounded-2xl transition-colors border border-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">save</span>
              <span>Apply Parameters</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
