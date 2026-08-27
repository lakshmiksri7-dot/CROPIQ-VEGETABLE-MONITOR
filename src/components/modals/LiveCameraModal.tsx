import React, { useState } from 'react';
import { ASSETS } from '../../data/mockData';

interface LiveCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveCameraModal: React.FC<LiveCameraModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedCamera, setSelectedCamera] = useState<'cam1' | 'cam2' | 'thermal'>('cam1');
  const [showAIBoxes, setShowAIBoxes] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#121212] text-white rounded-[2rem] w-full max-w-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#141414]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            <h3 className="font-light text-base sm:text-lg text-white">
              Silo 3 Chamber Telemetry Feed
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Video Canvas Container */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          <img
            src={
              selectedCamera === 'thermal'
                ? ASSETS.visualInspectionTomatoes
                : selectedCamera === 'cam2'
                ? ASSETS.historyBatchB
                : ASSETS.crateTomatoesInColdRoom
            }
            alt="Cold chamber live camera feed"
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isRefreshing ? 'opacity-40' : 'opacity-100'
            } ${selectedCamera === 'thermal' ? 'hue-rotate-90 saturate-200' : ''}`}
          />

          {/* AI Bounding Boxes Overlay */}
          {showAIBoxes && (
            <div className="absolute inset-0 pointer-events-none p-4">
              <div className="absolute top-[20%] left-[18%] w-[35%] h-[40%] border border-orange-500 rounded-xl bg-orange-500/10 flex flex-col justify-between p-2">
                <span className="text-[10px] bg-orange-500 text-black px-2 py-0.5 rounded-md font-mono font-bold w-max">
                  Batch T102: Fresh (91%)
                </span>
                <span className="text-[10px] text-orange-400 font-mono font-bold">12.1°C</span>
              </div>

              <div className="absolute bottom-[22%] right-[15%] w-[32%] h-[35%] border border-orange-500 rounded-xl bg-orange-500/10 flex flex-col justify-between p-2">
                <span className="text-[10px] bg-orange-500 text-black px-2 py-0.5 rounded-md font-mono font-bold w-max">
                  Batch P04: Ripening
                </span>
                <span className="text-[10px] text-orange-400 font-mono font-bold">11.8°C</span>
              </div>
            </div>
          )}

          {/* Feed HUD stats overlay */}
          <div className="absolute top-3 left-3 bg-black/70 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs flex items-center gap-3">
            <span className="text-orange-400 font-mono font-bold">1080P • 30 FPS</span>
            <span className="text-white/80 font-mono">12.0°C | 85% RH</span>
          </div>

          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              onClick={() => setShowAIBoxes(!showAIBoxes)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                showAIBoxes ? 'bg-orange-500 text-black border-orange-500' : 'bg-black/60 text-white/70 border-white/10'
              }`}
            >
              AI HUD: {showAIBoxes ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={handleRefresh}
              className="p-1.5 rounded-xl bg-black/60 border border-white/10 text-white hover:bg-black/90 transition-colors"
              title="Refresh Stream"
            >
              <span className={`material-symbols-outlined text-sm ${isRefreshing ? 'animate-spin' : ''}`}>
                refresh
              </span>
            </button>
          </div>
        </div>

        {/* Camera Selector Tabs */}
        <div className="p-4 bg-[#141414] border-t border-white/5 flex justify-between items-center gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCamera('cam1')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                selectedCamera === 'cam1'
                  ? 'bg-orange-500 text-black font-bold'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/5'
              }`}
            >
              Cam 1 (Front)
            </button>
            <button
              onClick={() => setSelectedCamera('cam2')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                selectedCamera === 'cam2'
                  ? 'bg-orange-500 text-black font-bold'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/5'
              }`}
            >
              Cam 2 (Rack)
            </button>
            <button
              onClick={() => setSelectedCamera('thermal')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                selectedCamera === 'thermal'
                  ? 'bg-orange-500 text-black font-bold'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/5'
              }`}
            >
              Thermal Heatmap
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono rounded-xl text-xs"
          >
            Close Feed
          </button>
        </div>
      </div>
    </div>
  );
};
