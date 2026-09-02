import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CROP_PRESETS } from '../../data/mockData';
import { CropPreset, ScreenId, AppLanguage } from '../../types';
import { speakContent } from '../../utils/speechUtils';

interface ConfigureStorageScreenProps {
  onApplyProfile: (preset: CropPreset) => void;
  onNavigate: (screen: ScreenId) => void;
  language?: AppLanguage;
  onOpenVoiceModal?: () => void;
}

export const ConfigureStorageScreen: React.FC<ConfigureStorageScreenProps> = ({
  onApplyProfile,
  onNavigate,
  language = 'en',
  onOpenVoiceModal
}) => {
  const [selectedCropId, setSelectedCropId] = useState<string>('tomato');
  const [quantityKg, setQuantityKg] = useState<number>(450);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedNotification, setAppliedNotification] = useState('');

  // Primary crops requested: Tomato, Cabbage, Cauliflower, Chilli, Carrot, Beans, Other
  const targetCropOrder = ['tomato', 'cabbage', 'cauliflower', 'chilli', 'carrot', 'beans', 'other'];
  const orderedPresets = targetCropOrder
    .map((id) => CROP_PRESETS.find((c) => c.id === id))
    .filter((c): c is CropPreset => !!c);

  const selectedPreset =
    CROP_PRESETS.find((c) => c.id === selectedCropId) || CROP_PRESETS[0];

  const handleSelectCrop = (crop: CropPreset) => {
    setSelectedCropId(crop.id);
    const spoken =
      language === 'ta'
        ? `${crop.name} தேர்ந்தெடுக்கப்பட்டது. தானியங்கி பரிந்துரைக்கப்பட்ட வெப்பநிலை ${crop.recTempMin} முதல் ${crop.recTempMax} டிகிரி செல்சியஸ் மற்றும் ஈரப்பதம் ${crop.recHumidity} சதவீதம்.`
        : language === 'hi'
        ? `${crop.name} चुना गया। अनुशंसित तापमान ${crop.recTempMin} से ${crop.recTempMax} डिग्री और नमी ${crop.recHumidity} प्रतिशत सेट की गई है।`
        : `Selected ${crop.name}. Automated cold storage setting loaded: ${crop.recTempMin} to ${crop.recTempMax} degrees Celsius, ${crop.recHumidity}% humidity.`;
    speakContent(spoken, (language || 'en') as AppLanguage, `crop-select-${crop.id}`);
  };

  const handleApply = () => {
    setIsApplying(true);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#059669', '#10b981', '#ffffff', '#34d399']
    });

    const successSpoken =
      language === 'ta'
        ? `${quantityKg} கிலோ ${selectedPreset.name} சேமிப்பகம் வெற்றிகரமாக தொடங்கியது!`
        : language === 'hi'
        ? `${quantityKg} किलो ${selectedPreset.name} का स्टोरेज सफलतापूर्वक शुरू हुआ!`
        : `Smart storage activated for ${quantityKg} kg of ${selectedPreset.name}! Cooling active.`;
    speakContent(successSpoken, (language || 'en') as AppLanguage, 'store-success');

    setTimeout(() => {
      onApplyProfile(selectedPreset);
      setIsApplying(false);
      setAppliedNotification(
        `✓ ${quantityKg} kg of ${selectedPreset.name} stored! Auto-cooling set to ${selectedPreset.recTempMin}-${selectedPreset.recTempMax}°C.`
      );
      setTimeout(() => {
        setAppliedNotification('');
        onNavigate('storage');
      }, 1400);
    }, 400);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pt-3 pb-36 space-y-4">
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
              <span>Voice</span>
            </button>
          )}
        </div>
      </div>

      {/* Screen Title & Instruction */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
        <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-800 font-bold block mb-1 font-mono">
          STEP 1: SELECT PRODUCE
        </span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {language === 'ta'
            ? 'சேமிக்க வேண்டிய காய்கறியைத் தேர்ந்தெடுக்கவும்'
            : language === 'hi'
            ? 'भंडारण के लिए फसल चुनें'
            : 'Select Crop to Store'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {language === 'ta'
            ? 'வெப்பநிலை மற்றும் ஈரப்பதம் தானாகவே தீர்மானிக்கப்படும்.'
            : language === 'hi'
            ? 'तापमान और नमी स्वचालित रूप से सेट हो जाएगी। किसान को तकनीकी मान दर्ज करने की आवश्यकता नहीं है।'
            : 'Tap any vegetable below. CROPIQ automatically loads ideal temperature and humidity.'}
        </p>
      </div>

      {appliedNotification && (
        <div className="p-4 bg-emerald-600 text-white font-bold rounded-2xl text-sm flex items-center justify-between shadow-lg shadow-emerald-600/25 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">check_circle</span>
            <span>{appliedNotification}</span>
          </div>
        </div>
      )}

      {/* Crop Selection Grid - Large Visual Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {orderedPresets.map((crop) => {
          const isSelected = selectedCropId === crop.id;
          return (
            <button
              key={crop.id}
              id={`crop-preset-${crop.id}`}
              onClick={() => handleSelectCrop(crop)}
              className={`group relative flex flex-col items-center rounded-3xl overflow-hidden transition-all duration-200 text-left w-full cursor-pointer border-2 bg-white ${
                isSelected
                  ? 'border-emerald-600 shadow-lg shadow-emerald-600/15 ring-2 ring-emerald-300 scale-[1.02]'
                  : 'border-slate-200 hover:border-emerald-300 hover:shadow-md'
              }`}
            >
              {/* Selected Checkmark Badge */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md z-10 font-bold">
                  <span className="material-symbols-outlined text-base font-bold">check</span>
                </div>
              )}

              <div className="w-full aspect-[4/3] bg-slate-100 relative overflow-hidden">
                <img
                  src={crop.image}
                  alt={crop.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              <div
                className={`w-full py-3 px-3 text-center border-t transition-colors ${
                  isSelected ? 'bg-emerald-50/80 border-emerald-200' : 'bg-white border-slate-100'
                }`}
              >
                <span
                  className={`text-sm sm:text-base font-bold block ${
                    isSelected ? 'text-emerald-900' : 'text-slate-800'
                  }`}
                >
                  {crop.name}
                </span>
                <span className="block text-[11px] font-mono text-emerald-700 font-bold mt-0.5">
                  {crop.recTempMin}–{crop.recTempMax}°C • {crop.recHumidity}% RH
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Step 2: Quantity in KG */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-800 font-bold block font-mono">
              STEP 2: HARVEST QUANTITY
            </span>
            <h3 className="font-bold text-slate-900 text-base">
              {language === 'ta'
                ? 'அளவு (கிலோகிராமில்)'
                : language === 'hi'
                ? 'मात्रा (किलोग्राम में)'
                : 'Quantity in Kilograms (kg)'}
            </h3>
          </div>
          <span className="text-2xl font-extrabold text-emerald-700 font-mono">
            {quantityKg} <span className="text-sm font-normal text-slate-500">kg</span>
          </span>
        </div>

        {/* Quick Stepper Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQuantityKg(Math.max(50, quantityKg - 50))}
            className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xl flex items-center justify-center active:scale-95 transition-all"
          >
            -
          </button>
          <input
            type="range"
            min="50"
            max="2000"
            step="25"
            value={quantityKg}
            onChange={(e) => setQuantityKg(Number(e.target.value))}
            className="flex-1 accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
          <button
            type="button"
            onClick={() => setQuantityKg(Math.min(5000, quantityKg + 50))}
            className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xl flex items-center justify-center active:scale-95 transition-all"
          >
            +
          </button>
        </div>

        {/* Quick preset chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[100, 250, 450, 750, 1000, 1500].map((kg) => (
            <button
              key={kg}
              type="button"
              onClick={() => setQuantityKg(kg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                quantityKg === kg
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {kg} kg
            </button>
          ))}
        </div>
      </div>

      {/* Automatic Preset Parameters Box - Zero Manual Complexity */}
      <div className="p-4 sm:p-5 bg-emerald-50 rounded-3xl border border-emerald-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-700 text-lg">auto_awesome</span>
          <h4 className="font-bold text-sm text-emerald-950">
            Automated Climate Calibration for {selectedPreset.name}
          </h4>
        </div>
        <p className="text-xs text-emerald-900/90 leading-relaxed">
          {selectedPreset.description}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
          <div className="bg-white p-2.5 rounded-2xl border border-emerald-200">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">Target Temp</span>
            <span className="text-base font-extrabold text-emerald-800 font-mono">
              {selectedPreset.recTempMin}–{selectedPreset.recTempMax}°C
            </span>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-emerald-200">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">Target Humidity</span>
            <span className="text-base font-extrabold text-emerald-800 font-mono">
              {selectedPreset.recHumidity}% RH
            </span>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-emerald-200 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">Safe Shelf Life</span>
            <span className="text-base font-extrabold text-emerald-800 font-mono">
              ~{selectedPreset.optimalDays} Days
            </span>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Panel */}
      <div className="fixed bottom-[64px] left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 p-4 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="flex-1">
            <span className="text-[11px] text-slate-500 font-mono block">
              {quantityKg} kg • {selectedPreset.name}
            </span>
            <span className="text-xs font-bold text-emerald-800">
              Auto: {selectedPreset.recTempMin}–{selectedPreset.recTempMax}°C
            </span>
          </div>

          <button
            id="btn-apply-storage-profile"
            onClick={handleApply}
            disabled={isApplying}
            className="py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-600/25 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isApplying ? (
              <span>Calibrating Unit...</span>
            ) : (
              <>
                <span>
                  {language === 'ta'
                    ? 'சேமிப்பைத் தொடங்குக'
                    : language === 'hi'
                    ? 'स्टोरेज शुरू करें'
                    : 'Start Smart Storage'}
                </span>
                <span className="material-symbols-outlined text-base">ac_unit</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
