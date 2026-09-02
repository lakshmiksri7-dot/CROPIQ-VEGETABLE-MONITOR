import React, { useState } from 'react';
import { StorageSilo, AppLanguage, ScreenId } from '../../types';
import { speakContent } from '../../utils/speechUtils';

interface EmergencyModeScreenProps {
  language: AppLanguage;
  activeSilo: StorageSilo;
  onUpdateSilo: (updated: StorageSilo) => void;
  onNavigate: (screen: ScreenId) => void;
  onOpenVoiceModal?: () => void;
}

export const EmergencyModeScreen: React.FC<EmergencyModeScreenProps> = ({
  language,
  activeSilo,
  onUpdateSilo,
  onNavigate,
  onOpenVoiceModal
}) => {
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(
    activeSilo.coolingSystem === 'EMERGENCY_OVERDRIVE'
  );
  const [actionNotice, setActionNotice] = useState<string>('');

  const triggerAction = (actionName: string, detailMsg: string) => {
    setActionNotice(`${actionName}: ${detailMsg}`);
    const spoken =
      language === 'ta'
        ? `${actionName} செயல்படுத்தப்பட்டது. ${detailMsg}`
        : language === 'hi'
        ? `${actionName} सक्रिय किया गया। ${detailMsg}`
        : `${actionName} activated. ${detailMsg}`;
    speakContent(spoken, language, `emergency-action-${actionName}`);

    setTimeout(() => {
      setActionNotice('');
    }, 4500);
  };

  const toggleEmergencyMode = () => {
    const nextState = !isEmergencyActive;
    setIsEmergencyActive(nextState);
    if (nextState) {
      triggerAction('Emergency Backup Cooling', 'Max cooling & PCM thermal cold discharge engaged.');
      onUpdateSilo({
        ...activeSilo,
        coolingSystem: 'EMERGENCY_OVERDRIVE',
        pcmStatus: 'DISCHARGING_COLD',
        safetyStatus: 'CRITICAL',
        statusText: 'Emergency Overdrive Active • PCM Cold Discharge'
      });
    } else {
      triggerAction('Standard Auto-Mode', 'Unit restored to normal solar thermostat cycle.');
      onUpdateSilo({
        ...activeSilo,
        coolingSystem: 'ACTIVE',
        pcmStatus: 'FULLY_CHARGED',
        safetyStatus: 'SAFE',
        statusText: 'Optimal Storage Safe • PCM Charged'
      });
    }
  };

  const handleWhatsAppAlert = () => {
    const text = encodeURIComponent(
      `[CROPIQ URGENT ALERT] ${activeSilo.name}: Temp ${activeSilo.currentTemp}°C, Battery ${activeSilo.batteryBackupPercent}%. Please check cold storage unit immediately.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
    triggerAction('WhatsApp Alert', 'Alert message drafted for local farmer group and coordinator.');
  };

  const handleCallTechnician = () => {
    window.location.href = 'tel:+919876543210';
    triggerAction('Call Technician', 'Connecting to 24x7 Solar Cold Room Support Desk (+91-9876543210)...');
  };

  const handleMoveProduce = () => {
    triggerAction('Move Produce', 'Nearby backup unit Silo #2 reserved with 1,200kg capacity.');
    setTimeout(() => {
      onNavigate('storage');
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pt-3 pb-36 flex flex-col gap-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center text-xs font-bold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs"
        >
          <span className="material-symbols-outlined text-sm mr-1">arrow_back</span>
          Home
        </button>

        <div className="flex items-center gap-2">
          {onOpenVoiceModal && (
            <button
              onClick={onOpenVoiceModal}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">mic</span>
              <span>Voice Help</span>
            </button>
          )}
        </div>
      </div>

      {/* Emergency Status Banner */}
      <section
        className={`w-full rounded-3xl border-2 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm transition-all ${
          isEmergencyActive
            ? 'bg-red-50 border-red-500 animate-pulse'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isEmergencyActive ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700 border border-red-200'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">emergency</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-red-700 block font-mono">
              24/7 FAILSAFE CLIMATE PROTECTION
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Alerts & Emergency Center
            </h2>
            <span className="text-xs text-slate-600 font-mono">
              {activeSilo.name} • Crop: <strong className="text-slate-900">{activeSilo.cropName}</strong>
            </span>
          </div>
        </div>

        <button
          onClick={toggleEmergencyMode}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95 shrink-0 ${
            isEmergencyActive
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          <span className="material-symbols-outlined text-base">
            {isEmergencyActive ? 'check_circle' : 'bolt'}
          </span>
          <span>{isEmergencyActive ? 'Normal Mode' : 'TRIGGER EMERGENCY COOLING'}</span>
        </button>
      </section>

      {actionNotice && (
        <div className="p-4 bg-emerald-600 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-md animate-fadeIn">
          <span className="material-symbols-outlined text-xl">info</span>
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 4 Explicit Alert Types Monitoring Cards */}
      <div>
        <h3 className="text-xs uppercase font-extrabold text-slate-500 font-mono mb-2 px-1">
          Active Sensor Alert Status
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* 1. Temperature Alert */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-500">Temp Status</span>
              <span className="material-symbols-outlined text-emerald-600 text-lg">thermostat</span>
            </div>
            <span className="text-lg font-extrabold text-slate-900 font-mono">{activeSilo.currentTemp}°C</span>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full mt-1 inline-block text-center border border-emerald-200">
              Optimal (Target {activeSilo.targetTempRange})
            </span>
          </div>

          {/* 2. Power Failure Alert */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-500">Solar Power</span>
              <span className="material-symbols-outlined text-emerald-600 text-lg">solar_power</span>
            </div>
            <span className="text-lg font-extrabold text-slate-900 font-mono">3.4 kW Solar</span>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full mt-1 inline-block text-center border border-emerald-200">
              Grid + Solar Normal
            </span>
          </div>

          {/* 3. Battery Low Alert */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-500">Battery Level</span>
              <span className="material-symbols-outlined text-emerald-600 text-lg">battery_charging_full</span>
            </div>
            <span className="text-lg font-extrabold text-slate-900 font-mono">{activeSilo.batteryBackupPercent}%</span>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full mt-1 inline-block text-center border border-emerald-200">
              18h Thermal Backup
            </span>
          </div>

          {/* 4. Door Left Open Alert */}
          <div
            className={`p-4 rounded-2xl border shadow-xs flex flex-col justify-between ${
              activeSilo.doorStatus === 'OPEN' ? 'bg-red-50 border-red-300' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-500">Door Sensor</span>
              <span
                className={`material-symbols-outlined text-lg ${
                  activeSilo.doorStatus === 'OPEN' ? 'text-red-600 animate-pulse' : 'text-emerald-600'
                }`}
              >
                sensor_door
              </span>
            </div>
            <span className="text-lg font-extrabold text-slate-900 font-mono">{activeSilo.doorStatus}</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block text-center ${
                activeSilo.doorStatus === 'OPEN'
                  ? 'text-red-800 bg-red-100 border border-red-200'
                  : 'text-emerald-800 bg-emerald-100 border border-emerald-200'
              }`}
            >
              {activeSilo.doorStatus === 'OPEN' ? 'Warning: Door Open' : 'Sealed Shut'}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Instant Emergency Action Buttons */}
      <div>
        <h3 className="text-xs uppercase font-extrabold text-slate-500 font-mono mb-2 px-1">
          Immediate Emergency Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Action 1: Start Backup Cooling */}
          <button
            onClick={toggleEmergencyMode}
            className="p-4 rounded-2xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 shadow-xs flex flex-col items-center justify-center text-center gap-2 active:scale-95 transition-all cursor-pointer min-h-[100px]"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">ac_unit</span>
            </div>
            <div>
              <span className="font-bold text-xs sm:text-sm text-slate-900 block">Start Backup Cooling</span>
              <span className="text-[10px] text-slate-500 font-mono">PCM discharge</span>
            </div>
          </button>

          {/* Action 2: Call Technician */}
          <button
            onClick={handleCallTechnician}
            className="p-4 rounded-2xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 shadow-xs flex flex-col items-center justify-center text-center gap-2 active:scale-95 transition-all cursor-pointer min-h-[100px]"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">call</span>
            </div>
            <div>
              <span className="font-bold text-xs sm:text-sm text-slate-900 block">Call Technician</span>
              <span className="text-[10px] text-slate-500 font-mono">Toll-free 24x7</span>
            </div>
          </button>

          {/* Action 3: Move Produce */}
          <button
            onClick={handleMoveProduce}
            className="p-4 rounded-2xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 shadow-xs flex flex-col items-center justify-center text-center gap-2 active:scale-95 transition-all cursor-pointer min-h-[100px]"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">move_up</span>
            </div>
            <div>
              <span className="font-bold text-xs sm:text-sm text-slate-900 block">Move Produce</span>
              <span className="text-[10px] text-slate-500 font-mono">Transfer to Silo 2</span>
            </div>
          </button>

          {/* Action 4: WhatsApp Alert */}
          <button
            onClick={handleWhatsAppAlert}
            className="p-4 rounded-2xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 shadow-xs flex flex-col items-center justify-center text-center gap-2 active:scale-95 transition-all cursor-pointer min-h-[100px]"
          >
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">chat</span>
            </div>
            <div>
              <span className="font-bold text-xs sm:text-sm text-slate-900 block">WhatsApp Alert</span>
              <span className="text-[10px] text-slate-500 font-mono">Message farmers</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
