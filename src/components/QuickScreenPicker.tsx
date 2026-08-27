import React from 'react';
import { ScreenId } from '../types';

interface QuickScreenPickerProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
}

interface ScreenItem {
  id: ScreenId;
  title: string;
  category: string;
  icon: string;
  badge?: string;
}

const SCREENS: ScreenItem[] = [
  { id: 'splash', title: '1. Splash Screen', category: 'Onboarding', icon: 'flare' },
  { id: 'login', title: '2. Login & Setup', category: 'Onboarding', icon: 'login' },
  { id: 'home', title: '3. Home Dashboard', category: 'Core', icon: 'dashboard' },
  { id: 'storage', title: '4. Silo 3 Storage', category: 'Telemetry', icon: 'warehouse' },
  { id: 'configure-storage', title: '5. Configure Storage', category: 'Controls', icon: 'tune' },
  { id: 'batches', title: '6. Active Batches', category: 'Inventory', icon: 'inventory_2' },
  { id: 'freshness', title: '7. AI Freshness', category: 'AI Analytics', icon: 'science' },
  { id: 'energy', title: '8. Energy Management', category: 'Telemetry', icon: 'solar_power' },
  { id: 'market', title: '9. Market Readiness', category: 'Dispatch', icon: 'local_shipping' },
  { id: 'history', title: '10. Storage History', category: 'Analytics', icon: 'history' },
  { id: 'alerts', title: '11. Smart Alerts', category: 'Monitoring', icon: 'warning' },
  { id: 'profile', title: '12. Profile & Settings', category: 'User', icon: 'person' },
];

export const QuickScreenPicker: React.FC<QuickScreenPickerProps> = ({
  isOpen,
  onClose,
  currentScreen,
  onSelectScreen
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="quick-screen-modal-overlay"
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="quick-screen-modal-content"
        className="bg-[#121212] rounded-[2rem] w-full max-w-lg shadow-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-[#f0f0f0]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#161616]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-500">grid_view</span>
            <h3 className="font-semibold text-lg text-[#f0f0f0]">Navigation Directory</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SCREENS.map((s) => {
            const isSelected = currentScreen === s.id;
            return (
              <button
                key={s.id}
                id={`screen-picker-${s.id}`}
                onClick={() => {
                  onSelectScreen(s.id);
                  onClose();
                }}
                className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-orange-500 text-black border-orange-500 font-bold shadow-lg shadow-orange-500/20'
                    : 'bg-[#181818] border-white/5 hover:border-white/20 hover:bg-[#1e1e1e] text-white/80'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-black text-orange-500' : 'bg-white/5 text-white/70'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-[9px] uppercase font-mono tracking-wider ${
                      isSelected ? 'text-black/70 font-semibold' : 'text-white/40'
                    }`}
                  >
                    {s.category}
                  </div>
                  <div className="font-semibold text-sm truncate">{s.title}</div>
                </div>
                {isSelected && (
                  <span className="material-symbols-outlined text-black text-sm shrink-0 fill">
                    check_circle
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="px-6 py-3 border-t border-white/10 bg-[#161616] flex justify-between items-center text-xs text-white/40 font-mono">
          <span>CROPIQ TELEMETRY SYSTEM</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-sans transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
