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
  { id: 'home', title: '1. Home Dashboard & 5-HUD', category: 'Core', icon: 'dashboard', badge: 'HUD' },
  { id: 'storage', title: '2. Cold Storage & Door Sensor', category: 'Telemetry', icon: 'warehouse' },
  { id: 'cooperative', title: '3. Cooperative Multi-Units', category: 'Village Hub', icon: 'hub', badge: 'Co-op' },
  { id: 'map-locations', title: '4. GPS & Mandi Route Access', category: 'Geographic', icon: 'map', badge: 'GPS' },
  { id: 'batches', title: '5. Batches & QR Tags', category: 'Inventory', icon: 'inventory_2' },
  { id: 'timeline', title: '6. Harvest-to-Market Timeline', category: 'Traceability', icon: 'timeline', badge: 'Trace' },
  { id: 'ai-quality', title: '7. AI Visual Spoilage Check', category: 'AI Vision', icon: 'photo_camera', badge: 'Vision' },
  { id: 'freshness', title: '8. AI Biochemical Freshness', category: 'AI Analytics', icon: 'science' },
  { id: 'market', title: '9. Mandi Rates & Transport', category: 'Decisions', icon: 'local_shipping', badge: 'e-NAM' },
  { id: 'energy', title: '10. Solar PV & PCM Battery', category: 'Power', icon: 'solar_power', badge: 'Solar' },
  { id: 'emergency', title: '11. Emergency Cooling Mode', category: 'Safety', icon: 'emergency', badge: 'PCM' },
  { id: 'configure-storage', title: '12. Configure Crop Presets', category: 'Controls', icon: 'tune' },
  { id: 'history', title: '13. Storage History & Telemetry', category: 'Analytics', icon: 'history' },
  { id: 'alerts', title: '14. Smart Alerts & SMS', category: 'Monitoring', icon: 'warning' },
  { id: 'profile', title: '15. Farmer Profile & Languages', category: 'User', icon: 'person' },
  { id: 'login', title: '16. Village Setup & Login', category: 'Onboarding', icon: 'login' },
  { id: 'splash', title: '17. Splash Screen', category: 'Onboarding', icon: 'flare' },
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
        className="bg-[#121212] rounded-[2.5rem] w-full max-w-xl shadow-2xl border border-emerald-500/30 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-[#f0f0f0]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#161616]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">grid_view</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-white">CROPIQ Feature Navigator</h3>
              <p className="text-[11px] text-emerald-400/80 font-mono">17 Farmer-Centric Modular Views</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                    ? 'bg-emerald-500 text-black border-emerald-500 font-bold shadow-lg shadow-emerald-500/20'
                    : 'bg-[#181818] border-white/5 hover:border-emerald-500/30 hover:bg-[#1e1e1e] text-white/80'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-black text-emerald-400' : 'bg-white/5 text-emerald-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[9px] uppercase font-mono tracking-wider ${
                        isSelected ? 'text-black/70 font-semibold' : 'text-white/40'
                      }`}
                    >
                      {s.category}
                    </span>
                    {s.badge && (
                      <span
                        className={`text-[8px] font-mono px-1.5 py-0.2 rounded ${
                          isSelected ? 'bg-black text-emerald-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {s.badge}
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-xs truncate mt-0.5">{s.title}</div>
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
          <span>CROPIQ SOLAR COLD SYSTEM</span>
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
