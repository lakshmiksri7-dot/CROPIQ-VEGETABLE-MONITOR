import React from 'react';
import { ScreenId } from '../types';

interface TopAppBarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onToggleGridMenu: () => void;
  unreadAlertCount: number;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onNavigate,
  onToggleGridMenu,
  unreadAlertCount
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 md:px-6 h-16 bg-[#080808]/90 backdrop-blur-md border-b border-white/10 text-[#f0f0f0] transition-all">
      <div className="flex items-center gap-3">
        <button
          id="btn-grid-menu"
          onClick={onToggleGridMenu}
          className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white/5 hover:bg-orange-500 hover:text-black border border-white/10 text-white/80 active:scale-95 transition-all group"
          title="All Screens & Navigation"
        >
          <span className="material-symbols-outlined text-[20px]">grid_view</span>
        </button>

        <div className="hidden sm:flex flex-col">
          <span className="text-[9px] uppercase tracking-[0.3em] text-orange-500 font-bold leading-none">
            Storage Grid OS
          </span>
          <span className="text-xs text-white/40 font-mono">NODE_SILO_3</span>
        </div>
      </div>

      <button
        onClick={() => onNavigate('home')}
        className="flex items-center gap-2 text-xl md:text-2xl font-semibold text-[#f0f0f0] tracking-tight hover:opacity-90 transition-opacity"
      >
        <span>CROPIQ</span>
        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-orange-500">
          v2.4
        </span>
      </button>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] uppercase tracking-widest text-white/40">
          <span>Status: Operational</span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>

        <button
          id="btn-notifications-top"
          onClick={() => onNavigate('alerts')}
          className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-white/5 hover:bg-orange-500 hover:text-black border border-white/10 text-white/80 active:scale-95 transition-all"
          title="Smart Alerts"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          {unreadAlertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-orange-500 rounded-full ring-2 ring-[#080808] animate-pulse" />
          )}
        </button>
      </div>
    </header>
  );
};
