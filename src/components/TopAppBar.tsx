import React from 'react';
import { ScreenId, AppLanguage } from '../types';
import { speakContent, stopSpeech } from '../utils/speechUtils';

interface TopAppBarProps {
  currentScreen: ScreenId;
  language: AppLanguage;
  onSetLanguage: (lang: AppLanguage) => void;
  onNavigate: (screen: ScreenId) => void;
  onToggleGridMenu: () => void;
  onOpenVoiceModal: () => void;
  onOpenInstallModal?: () => void;
  unreadAlertCount: number;
  isSpeakerEnabled?: boolean;
  onToggleSpeaker?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentScreen: _currentScreen,
  language,
  onSetLanguage,
  onNavigate,
  onToggleGridMenu,
  onOpenVoiceModal,
  onOpenInstallModal,
  unreadAlertCount,
  isSpeakerEnabled = true,
  onToggleSpeaker
}) => {
  const handleSpeakerClick = () => {
    if (onToggleSpeaker) {
      onToggleSpeaker();
    }
    if (!isSpeakerEnabled) {
      const msg = language === 'as'
        ? 'স্পীকাৰ অন কৰা হ’ল। এতিয়া সকলো তথ্য আপুনি শুনিব পাৰিব।'
        : language === 'hi'
        ? 'स्पीकर चालू किया गया। अब आप सभी जानकारी सुन सकते हैं।'
        : 'Voice Speaker Enabled. Tap any speaker icon to hear readout.';
      speakContent(msg, language, 'speaker-toggle');
    } else {
      stopSpeech();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-3 sm:px-6 h-16 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm text-slate-800 transition-all">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          id="btn-grid-menu"
          onClick={onToggleGridMenu}
          className="flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-200 text-emerald-800 active:scale-95 transition-all group shadow-sm"
          title="All 17 Screens & Navigation"
        >
          <span className="material-symbols-outlined text-[22px]">grid_view</span>
        </button>

        <div className="hidden sm:flex flex-col">
          <span className="text-[9px] uppercase tracking-[0.25em] text-emerald-700 font-bold leading-none">
            CROPIQ NER GRID
          </span>
          <span className="text-[11px] text-slate-500 font-mono">SOLAR_COLD_OS</span>
        </div>
      </div>

      {/* Brand logo & name */}
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center gap-2 text-xl md:text-2xl font-bold text-slate-900 tracking-tight hover:opacity-90 transition-opacity"
      >
        <div className="w-8 h-8 rounded-xl overflow-hidden border border-emerald-300 bg-emerald-50 shadow-sm flex items-center justify-center p-0.5">
          <img
            src="/icon-192.png"
            alt="CROPIQ"
            className="w-full h-full object-cover rounded-lg"
            referrerPolicy="no-referrer"
          />
        </div>
        <span className="font-extrabold tracking-tight text-emerald-800">CROP<span className="text-emerald-500">IQ</span></span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold hidden xs:inline-block">
          SOLAR
        </span>
      </button>

      {/* Action controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* User Speaker Enable / Toggle Button ⭐ */}
        <button
          id="btn-speaker-toggle-top"
          onClick={handleSpeakerClick}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border transition-all active:scale-95 shadow-sm ${
            isSpeakerEnabled
              ? 'bg-emerald-100 border-emerald-300 text-emerald-800 font-bold hover:bg-emerald-200'
              : 'bg-slate-100 border-slate-300 text-slate-400 hover:bg-slate-200'
          }`}
          title={isSpeakerEnabled ? 'Speaker Enabled (Click to Mute)' : 'Speaker Muted (Click to Enable)'}
        >
          <span className={`material-symbols-outlined text-[18px] ${isSpeakerEnabled ? 'animate-pulse text-emerald-700' : ''}`}>
            {isSpeakerEnabled ? 'volume_up' : 'volume_off'}
          </span>
          <span className="text-[11px] font-mono font-bold hidden md:inline">
            {isSpeakerEnabled ? 'Speaker ON' : 'Speaker OFF'}
          </span>
        </button>

        {/* Language selector toggle */}
        <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5 text-[11px] font-mono">
          <button
            onClick={() => onSetLanguage('en')}
            className={`px-1.5 sm:px-2 py-1 rounded-lg transition-all text-xs ${
              language === 'en' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-emerald-700'
            }`}
            title="English Language"
          >
            EN
          </button>
          <button
            onClick={() => onSetLanguage('ta')}
            className={`px-1.5 sm:px-2 py-1 rounded-lg transition-all text-xs ${
              language === 'ta' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-emerald-700'
            }`}
            title="Tamil Language"
          >
            தமிழ்
          </button>
          <button
            onClick={() => onSetLanguage('hi')}
            className={`px-1.5 sm:px-2 py-1 rounded-lg transition-all text-xs ${
              language === 'hi' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-emerald-700'
            }`}
            title="Hindi Language"
          >
            हिन्दी
          </button>
          <button
            onClick={() => onSetLanguage('as')}
            className={`px-1.5 sm:px-2 py-1 rounded-lg transition-all text-xs ${
              language === 'as' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-emerald-700'
            }`}
            title="Assamese Language"
          >
            অসমীয়া
          </button>
        </div>

        {/* Voice Assistant Trigger */}
        <button
          onClick={onOpenVoiceModal}
          className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition-all"
          title="Voice-First Farmer Interface"
        >
          <span className="material-symbols-outlined text-[17px] animate-pulse">mic</span>
          <span className="hidden sm:inline">Voice</span>
        </button>

        {onOpenInstallModal && (
          <button
            id="btn-install-app-top"
            onClick={onOpenInstallModal}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 text-xs font-mono active:scale-95 transition-all"
            title="Install CROPIQ as an App"
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-600">install_mobile</span>
            <span>Install</span>
          </button>
        )}

        {/* Notifications */}
        <button
          id="btn-notifications-top"
          onClick={() => onNavigate('alerts')}
          className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 border border-slate-200 text-slate-700 active:scale-95 transition-all shadow-xs"
          title="Smart Alerts"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          {unreadAlertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>
      </div>
    </header>
  );
};

