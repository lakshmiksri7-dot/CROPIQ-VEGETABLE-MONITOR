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
  // Determine active tab category
  const isHomeActive = currentScreen === 'home' || currentScreen === 'energy';
  const isStorageActive = currentScreen === 'storage' || currentScreen === 'configure-storage' || currentScreen === 'cooperative' || currentScreen === 'emergency';
  const isBatchesActive = currentScreen === 'batches' || currentScreen === 'freshness' || currentScreen === 'ai-quality' || currentScreen === 'timeline';
  const isMarketActive = currentScreen === 'market' || currentScreen === 'map-locations';
  const isAlertsActive = currentScreen === 'alerts';

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-3 pb-3 pt-2 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
      {/* Home Tab */}
      <button
        id="nav-tab-home"
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
          isHomeActive
            ? 'bg-emerald-600 text-white font-bold rounded-2xl px-4 sm:px-5 py-1.5 shadow-md shadow-emerald-600/20'
            : 'text-slate-500 px-3 sm:px-4 py-2 hover:text-emerald-700 hover:bg-emerald-50 rounded-2xl'
        }`}
      >
        <span className={`material-symbols-outlined text-[22px] ${isHomeActive ? 'fill' : ''}`}>
          home
        </span>
        <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Home</span>
      </button>

      {/* Storage & Units Tab */}
      <button
        id="nav-tab-storage"
        onClick={() => onNavigate('storage')}
        className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
          isStorageActive
            ? 'bg-emerald-600 text-white font-bold rounded-2xl px-4 sm:px-5 py-1.5 shadow-md shadow-emerald-600/20'
            : 'text-slate-500 px-3 sm:px-4 py-2 hover:text-emerald-700 hover:bg-emerald-50 rounded-2xl'
        }`}
      >
        <span className={`material-symbols-outlined text-[22px] ${isStorageActive ? 'fill' : ''}`}>
          ac_unit
        </span>
        <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Storage</span>
      </button>

      {/* Batches & Quality Tab */}
      <button
        id="nav-tab-batches"
        onClick={() => onNavigate('batches')}
        className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
          isBatchesActive
            ? 'bg-emerald-600 text-white font-bold rounded-2xl px-4 sm:px-5 py-1.5 shadow-md shadow-emerald-600/20'
            : 'text-slate-500 px-3 sm:px-4 py-2 hover:text-emerald-700 hover:bg-emerald-50 rounded-2xl'
        }`}
      >
        <span className={`material-symbols-outlined text-[22px] ${isBatchesActive ? 'fill' : ''}`}>
          inventory_2
        </span>
        <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Batches</span>
      </button>

      {/* Mandi Market & Transit Tracking Tab */}
      <button
        id="nav-tab-market"
        onClick={() => onNavigate('map-locations')}
        className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
          isMarketActive
            ? 'bg-emerald-600 text-white font-bold rounded-2xl px-4 sm:px-5 py-1.5 shadow-md shadow-emerald-600/20'
            : 'text-slate-500 px-3 sm:px-4 py-2 hover:text-emerald-700 hover:bg-emerald-50 rounded-2xl'
        }`}
      >
        <span className={`material-symbols-outlined text-[22px] ${isMarketActive ? 'fill' : ''}`}>
          map
        </span>
        <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Live Map</span>
      </button>

      {/* Alerts Tab */}
      <button
        id="nav-tab-alerts"
        onClick={() => onNavigate('alerts')}
        className={`relative flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
          isAlertsActive
            ? 'bg-emerald-600 text-white font-bold rounded-2xl px-4 sm:px-5 py-1.5 shadow-md shadow-emerald-600/20'
            : 'text-slate-500 px-3 sm:px-4 py-2 hover:text-emerald-700 hover:bg-emerald-50 rounded-2xl'
        }`}
      >
        <span className={`material-symbols-outlined text-[22px] ${isAlertsActive ? 'fill' : ''}`}>
          warning
        </span>
        <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Alerts</span>
        {unreadAlertCount > 0 && !isAlertsActive && (
          <span className="absolute top-1.5 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-white" />
        )}
      </button>
    </nav>
  );
};

