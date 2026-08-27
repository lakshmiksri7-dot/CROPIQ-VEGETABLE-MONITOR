import React from 'react';
import { ScreenId } from '../types';

interface BottomNavBarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  unreadAlertCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  onNavigate,
  unreadAlertCount
}) => {
  // Determine which bottom tab is active
  const isHomeActive = currentScreen === 'home' || currentScreen === 'energy';
  const isStorageActive = currentScreen === 'storage' || currentScreen === 'configure-storage' || currentScreen === 'history';
  const isBatchesActive = currentScreen === 'batches' || currentScreen === 'freshness' || currentScreen === 'market';
  const isAlertsActive = currentScreen === 'alerts';
  const isProfileActive = currentScreen === 'profile';

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-3 pb-3 pt-2 bg-[#0c0c0c]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.6)]">
      {/* Home Tab */}
      <button
        id="nav-tab-home"
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
          isHomeActive
            ? 'bg-orange-500 text-black font-bold rounded-2xl px-5 py-1.5 shadow-lg shadow-orange-500/20'
            : 'text-white/40 px-4 py-2 hover:text-white hover:bg-white/5 rounded-2xl'
        }`}
      >
        <span className={`material-symbols-outlined text-[22px] ${isHomeActive ? 'fill' : ''}`}>
          home
        </span>
        <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Home</span>
      </button>

      {/* Storage Tab */}
      <button
        id="nav-tab-storage"
        onClick={() => onNavigate('storage')}
        className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
          isStorageActive
            ? 'bg-orange-500 text-black font-bold rounded-2xl px-5 py-1.5 shadow-lg shadow-orange-500/20'
            : 'text-white/40 px-4 py-2 hover:text-white hover:bg-white/5 rounded-2xl'
        }`}
      >
        <span className={`material-symbols-outlined text-[22px] ${isStorageActive ? 'fill' : ''}`}>
          ac_unit
        </span>
        <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Storage</span>
      </button>

      {/* Batches Tab */}
      <button
        id="nav-tab-batches"
        onClick={() => onNavigate('batches')}
        className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
          isBatchesActive
            ? 'bg-orange-500 text-black font-bold rounded-2xl px-5 py-1.5 shadow-lg shadow-orange-500/20'
            : 'text-white/40 px-4 py-2 hover:text-white hover:bg-white/5 rounded-2xl'
        }`}
      >
        <span className={`material-symbols-outlined text-[22px] ${isBatchesActive ? 'fill' : ''}`}>
          inventory_2
        </span>
        <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Batches</span>
      </button>

      {/* Alerts Tab */}
      <button
        id="nav-tab-alerts"
        onClick={() => onNavigate('alerts')}
        className={`relative flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
          isAlertsActive
            ? 'bg-orange-500 text-black font-bold rounded-2xl px-5 py-1.5 shadow-lg shadow-orange-500/20'
            : 'text-white/40 px-4 py-2 hover:text-white hover:bg-white/5 rounded-2xl'
        }`}
      >
        <span className={`material-symbols-outlined text-[22px] ${isAlertsActive ? 'fill' : ''}`}>
          warning
        </span>
        <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Alerts</span>
        {unreadAlertCount > 0 && !isAlertsActive && (
          <span className="absolute top-1.5 right-3 w-2 h-2 bg-orange-500 rounded-full animate-pulse ring-2 ring-[#0c0c0c]" />
        )}
      </button>

      {/* Profile Tab */}
      <button
        id="nav-tab-profile"
        onClick={() => onNavigate('profile')}
        className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
          isProfileActive
            ? 'bg-orange-500 text-black font-bold rounded-2xl px-5 py-1.5 shadow-lg shadow-orange-500/20'
            : 'text-white/40 px-4 py-2 hover:text-white hover:bg-white/5 rounded-2xl'
        }`}
      >
        <span className={`material-symbols-outlined text-[22px] ${isProfileActive ? 'fill' : ''}`}>
          person
        </span>
        <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Profile</span>
      </button>
    </nav>
  );
};
