import React, { useState, useEffect } from 'react';
import { StorageSilo, ScreenId, AppLanguage } from '../../types';
import { speakContent, subscribeSpeechState } from '../../utils/speechUtils';

interface StorageScreenProps {
  silos: Record<string, StorageSilo>;
  onNavigate: (screen: ScreenId) => void;
  onOpenAdjustEnv: () => void;
  language?: AppLanguage;
}

export const StorageScreen: React.FC<StorageScreenProps> = ({
  silos,
  onNavigate,
  onOpenAdjustEnv,
  language = 'en'
}) => {
  const [selectedSiloKey, setSelectedSiloKey] = useState<string>('unit-01');
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const silo = silos[selectedSiloKey] || Object.values(silos)[0];

  const isDoorOpen = silo.doorStatus === 'OPEN';

  useEffect(() => {
    const unsubscribe = subscribeSpeechState((speaking, textId) => {
      setActiveSpeakingId(speaking && textId ? textId : null);
    });
    return unsubscribe;
  }, []);

  const handleSpeakSilo = () => {
    const textEn = `Storage ${silo.name}. Current crop is ${silo.cropName}. Chamber temperature is ${silo.currentTemp} degrees Celsius, target range is ${silo.targetTempRange}. Humidity is ${silo.currentHumidity} percent. Phase change thermal battery is at ${silo.pcmStoragePercent} percent, providing 8 hours of zero-power backup. Door is ${silo.doorStatus}. Overall status is ${silo.safetyStatus}.`;
    const textHi = `कोल्ड स्टोरेज ${silo.name}। फसल ${silo.cropName} है। तापमान ${silo.currentTemp} डिग्री और आर्द्रता ${silo.currentHumidity} प्रतिशत है। पीसीएम थर्मल बैटरी ${silo.pcmStoragePercent} प्रतिशत चार्ज है। दरवाज़ा ${silo.doorStatus === 'OPEN' ? 'खुला' : 'बंद'} है। स्थिति पूरी तरह सुरक्षित है।`;
    const textAs = `ক’ল্ড ষ্টোৰেজ ${silo.name}। শস্য ${silo.cropName}। তাপমাত্ৰা ${silo.currentTemp} ডিগ্ৰী আৰু আৰ্দ্ৰতা ${silo.currentHumidity} শতাংশ। পিচিএম থাৰ্মেল বেটাৰী ${silo.pcmStoragePercent} শতাংশ ফুল। দুৱাৰ ${silo.doorStatus === 'OPEN' ? 'খোলা' : 'বন্ধ'}। অৱস্থা সম্পূৰ্ণ সুৰক্ষিত।`;

    speakContent(
      language === 'as' ? textAs : language === 'hi' ? textHi : textEn,
      (language || 'en') as AppLanguage,
      `silo-${selectedSiloKey}`
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pt-4 pb-28 space-y-4">
      {/* Unit Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {Object.keys(silos).map((key) => {
          const s = silos[key];
          const isSelected = selectedSiloKey === key;
          const isWarn = s.safetyStatus === 'WARNING';
          const isCrit = s.safetyStatus === 'CRITICAL';

          return (
            <button
              key={key}
              id={`tab-silo-${key}`}
              onClick={() => setSelectedSiloKey(key)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border shadow-xs ${
                isSelected
                  ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-md shadow-emerald-600/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isWarn ? 'bg-amber-500' : isCrit ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
                }`}
              />
              <span>{s.name.split('–')[0].trim()}</span>
            </button>
          );
        })}

        <button
          onClick={() => onNavigate('configure-storage')}
          className="ml-auto flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold whitespace-nowrap transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-sm">tune</span>
          <span>Configure Presets</span>
        </button>
      </div>

      {/* Header Section */}
      <section className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm bg-gradient-to-r from-emerald-50 via-white to-white">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-800 font-extrabold block mb-0.5">
            Climate Chamber Telemetry • {silo.locationName}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {silo.name}
          </h2>
          <span className="text-xs text-slate-600 font-mono">
            Crop: <strong className="text-slate-900">{silo.cropName}</strong> • Cluster: {silo.cluster}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleSpeakSilo}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${
              activeSpeakingId === `silo-${selectedSiloKey}`
                ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
                : 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {activeSpeakingId === `silo-${selectedSiloKey}` ? 'graphic_eq' : 'volume_up'}
            </span>
            <span>{activeSpeakingId === `silo-${selectedSiloKey}` ? 'Speaking...' : 'Listen Status'}</span>
          </button>

          <button
            onClick={() => onNavigate('emergency')}
            className="px-3.5 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-xs font-bold font-mono flex items-center gap-1 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-sm text-red-600">emergency</span>
            <span>Emergency Mode</span>
          </button>
        </div>
      </section>

      {/* Door-Open Intelligence & Sensor Alert Card ⭐ */}
      <div
        className={`rounded-3xl border p-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all shadow-sm ${
          isDoorOpen
            ? 'bg-red-50 border-red-300 ring-2 ring-red-200'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl shadow-xs ${
              isDoorOpen
                ? 'bg-red-600 text-white'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            <span className="material-symbols-outlined text-3xl">
              {isDoorOpen ? 'door_open' : 'sensor_door'}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-emerald-800">
                ⭐ Door-Open Intelligence & Cold Seal
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                  isDoorOpen ? 'bg-red-600 text-white' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {silo.doorStatus}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
              {isDoorOpen
                ? `Door Open Duration: ${silo.doorOpenDurationSeconds} seconds • Auto Boost Active`
                : 'Chamber Hermetically Sealed • Zero Cold Air Infiltration'}
            </h4>
            <p className="text-xs text-slate-600">
              Opened {silo.doorOpenCountToday} times today • Air curtain auto-activates when opened &gt;3 min
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 font-semibold">
            Laminar Air Curtain: {isDoorOpen ? 'Active' : 'Standby'}
          </span>
        </div>
      </div>

      {/* Current Readings Grids (Crisp Bento Style) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Temperature Gauge */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col items-center relative overflow-hidden group hover:border-emerald-300 shadow-sm transition-all">
          <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-800 font-bold mb-1">
            Temperature
          </span>

          <div className="relative w-28 h-20 my-1 flex items-center justify-center">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 55">
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="rgba(0,0,0,0.06)"
                strokeLinecap="round"
                strokeWidth="8"
              />
              <path
                d="M 10 50 A 40 40 0 0 1 72 16"
                fill="none"
                stroke="#059669"
                strokeLinecap="round"
                strokeWidth="8"
              />
            </svg>
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <span className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
                {silo.currentTemp}°C
              </span>
            </div>
          </div>

          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full mt-1 font-bold">
            Target: {silo.targetTempRange}
          </span>
        </div>

        {/* Humidity Gauge */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col items-center relative overflow-hidden group hover:border-emerald-300 shadow-sm transition-all">
          <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-700 font-bold mb-1">
            Humidity
          </span>

          <div className="relative w-28 h-20 my-1 flex items-center justify-center">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 55">
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="rgba(0,0,0,0.06)"
                strokeLinecap="round"
                strokeWidth="8"
              />
              <path
                d="M 10 50 A 40 40 0 0 1 85 22"
                fill="none"
                stroke="#0284c7"
                strokeLinecap="round"
                strokeWidth="8"
              />
            </svg>
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <span className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
                {silo.currentHumidity}%
              </span>
            </div>
          </div>

          <span className="text-[10px] font-mono text-cyan-800 bg-cyan-100 border border-cyan-300 px-2.5 py-1 rounded-full mt-1 font-bold">
            Target: {silo.targetHumidityRange}
          </span>
        </div>

        {/* PCM Thermal Battery Level */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col items-center relative overflow-hidden group hover:border-emerald-300 shadow-sm transition-all">
          <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-800 font-bold mb-1">
            PCM Thermal Battery
          </span>

          <div className="my-3 flex flex-col items-center">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">{silo.pcmStoragePercent}%</span>
            <span className="text-[10px] text-cyan-800 font-mono font-bold mt-0.5">8h zero-power cold</span>
          </div>

          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full font-bold">
            {silo.pcmStatus}
          </span>
        </div>

        {/* System Inverter Mode */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-800 font-bold">
            Compressor Drive
          </span>

          <div>
            <span className="text-xl font-extrabold text-slate-900 font-mono">{silo.coolingSystem}</span>
            <p className="text-xs text-slate-600 mt-1">Powered by {silo.powerSource}</p>
          </div>

          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg font-bold">
            DC Inverter Modulating
          </span>
        </div>
      </section>

      {/* 24h Thermal Profile */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-900">24h Thermal Chamber History</h3>
          <button
            onClick={onOpenAdjustEnv}
            className="text-xs text-emerald-800 font-bold hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-xs"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            <span>Adjust Parameters</span>
          </button>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold">
              Hourly Chamber Temperature (°C)
            </span>
            <span className="text-xs font-mono text-emerald-800 font-bold">Mean: 8.5°C (Stable)</span>
          </div>

          {/* Bar chart */}
          <div className="h-36 w-full flex items-end justify-between px-2 pb-2 border-b border-slate-200 relative">
            {silo.tempTrend.map((t, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 group w-1/6">
                <span className="text-[10px] font-mono text-emerald-700 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {t.temp}°C
                </span>
                <div
                  className="w-full max-w-[36px] rounded-t-lg bg-emerald-600 transition-all duration-300 shadow-xs"
                  style={{ height: `${t.heightPercent}%` }}
                />
                <span className="text-[10px] text-slate-500 font-mono mt-1 font-semibold">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
