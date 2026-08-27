import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CROP_PRESETS } from '../../data/mockData';
import { CropPreset, ScreenId } from '../../types';

interface ConfigureStorageScreenProps {
  onApplyProfile: (preset: CropPreset) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const ConfigureStorageScreen: React.FC<ConfigureStorageScreenProps> = ({
  onApplyProfile,
  onNavigate
}) => {
  const [selectedCropId, setSelectedCropId] = useState<string>('tomato');
  const [isApplying, setIsApplying] = useState(false);
  const [appliedNotification, setAppliedNotification] = useState('');

  const selectedPreset = CROP_PRESETS.find((c) => c.id === selectedCropId) || CROP_PRESETS[0];

  const handleApply = () => {
    setIsApplying(true);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#f97316', '#ea580c', '#ffffff', '#22c55e']
    });

    setTimeout(() => {
      onApplyProfile(selectedPreset);
      setIsApplying(false);
      setAppliedNotification(`Optimal profile for ${selectedPreset.name} applied to Silo 3!`);
      setTimeout(() => {
        setAppliedNotification('');
        onNavigate('storage');
      }, 1200);
    }, 400);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-4 pb-44 space-y-5">
      {/* Header Section */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold block mb-1">
          Preset Profiles
        </span>
        <h1 className="text-2xl sm:text-3xl font-light text-[#f0f0f0] tracking-tight">
          Configure Storage
        </h1>
        <p className="text-sm text-white/50 mt-0.5">
          Select target harvest type to apply automated microclimate parameters.
        </p>
      </div>

      {appliedNotification && (
        <div className="p-4 bg-orange-500 text-black font-bold rounded-2xl text-sm flex items-center justify-between shadow-lg shadow-orange-500/20 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">check_circle</span>
            <span>{appliedNotification}</span>
          </div>
        </div>
      )}

      {/* Crop Selection Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
        {CROP_PRESETS.map((crop) => {
          const isSelected = selectedCropId === crop.id;
          return (
            <button
              key={crop.id}
              id={`crop-preset-${crop.id}`}
              onClick={() => setSelectedCropId(crop.id)}
              className={`group relative flex flex-col items-center rounded-[2rem] overflow-hidden transition-all duration-200 text-left w-full cursor-pointer border ${
                isSelected
                  ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/15 scale-[1.01]'
                  : 'bg-[#121212] border-white/5 hover:border-white/20'
              }`}
            >
              {/* Checkmark Badge for selected crop */}
              {isSelected && (
                <div className="absolute top-3 right-3 bg-orange-500 text-black rounded-full w-7 h-7 flex items-center justify-center shadow-md z-10 animate-in zoom-in-75 font-bold">
                  <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                </div>
              )}

              <div className="w-full aspect-[4/3] bg-black/40 relative overflow-hidden">
                <img
                  src={crop.image}
                  alt={crop.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
              </div>

              <div
                className={`w-full py-3 px-3 text-center border-t transition-colors ${
                  isSelected
                    ? 'bg-[#181818] border-orange-500/30'
                    : 'bg-[#121212] border-white/5'
                }`}
              >
                <span
                  className={`text-sm sm:text-base font-semibold block ${
                    isSelected ? 'text-orange-400' : 'text-[#f0f0f0]'
                  }`}
                >
                  {crop.name}
                </span>
                <span className="block text-[11px] font-mono text-white/40 truncate mt-0.5">
                  {crop.recTempMin}-{crop.recTempMax}°C • {crop.recHumidity}% RH
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Profile Detailed Description card */}
      <div className="p-5 bg-[#121212] rounded-[2rem] border border-white/5 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="material-symbols-outlined text-orange-500 text-base">info</span>
          <h4 className="font-semibold text-sm text-[#f0f0f0]">
            {selectedPreset.name} Climate Advisory
          </h4>
        </div>
        <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
          {selectedPreset.description}
        </p>
      </div>

      {/* Fixed Bottom Action Panel */}
      <div className="fixed bottom-[68px] md:bottom-0 left-0 w-full bg-[#0c0c0c]/95 backdrop-blur-xl bottom-panel-shadow rounded-t-3xl z-40 pb-4 pt-4 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-2xl mx-auto space-y-3">
          {/* Selection Summary */}
          <div className="bg-[#141414] rounded-2xl p-3 sm:p-4 flex justify-between items-center border border-white/5">
            {/* Rec Temp */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <span className="material-symbols-outlined text-xl fill">thermostat</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  Target Temp
                </span>
                <span className="block text-lg sm:text-xl font-light text-[#f0f0f0] tracking-tight">
                  {selectedPreset.recTempMin}-{selectedPreset.recTempMax}°C
                </span>
              </div>
            </div>

            <div className="h-9 w-px bg-white/10" />

            {/* Rec Humidity */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <span className="material-symbols-outlined text-xl fill">
                  humidity_percentage
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  Humidity
                </span>
                <span className="block text-lg sm:text-xl font-light text-[#f0f0f0] tracking-tight">
                  {selectedPreset.recHumidity}%
                </span>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            id="btn-apply-storage-profile"
            onClick={handleApply}
            disabled={isApplying}
            className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-3.5 sm:py-4 px-4 rounded-2xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span
              className={`material-symbols-outlined ${
                isApplying ? 'animate-spin' : ''
              }`}
            >
              sync
            </span>
            <span>
              {isApplying ? 'Applying Preset...' : `Apply ${selectedPreset.name} Profile`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
