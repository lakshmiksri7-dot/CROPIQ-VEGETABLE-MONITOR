import React, { useState } from 'react';
import { ASSETS } from '../../data/mockData';
import { ScreenId, AppLanguage } from '../../types';
import { speakContent } from '../../utils/speechUtils';

interface SplashScreenProps {
  onProceed: (target?: ScreenId) => void;
  language?: AppLanguage;
  onSetLanguage?: (lang: AppLanguage) => void;
  onOpenVoiceModal?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onProceed,
  language = 'en',
  onSetLanguage,
  onOpenVoiceModal
}) => {
  const [selectedLang, setSelectedLang] = useState<AppLanguage>(language);

  const handleLangChange = (lang: AppLanguage) => {
    setSelectedLang(lang);
    if (onSetLanguage) {
      onSetLanguage(lang);
    }
    const welcomeText =
      lang === 'ta'
        ? 'CROPIQ-க்கு வரவேற்கிறோம். பாதுகாக்கவும். கணிக்கவும். செழிக்கவும்.'
        : lang === 'hi'
        ? 'CROPIQ में आपका स्वागत है। सुरक्षित रखें। भविष्यवाणी करें। समृद्ध बनें।'
        : 'Welcome to CROPIQ. Preserve. Predict. Prosper.';
    speakContent(welcomeText, lang, 'splash-welcome');
  };

  return (
    <div className="relative min-h-screen w-full bg-emerald-50/50 text-slate-900 flex flex-col items-center justify-between overflow-hidden">
      {/* Ambient Background Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[15%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-emerald-200/40 blur-3xl opacity-60" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-teal-200/30 blur-3xl opacity-60" />
      </div>

      {/* Top Header with Language Selector and Skip */}
      <header className="w-full z-20 flex items-center justify-between p-4 max-w-xl mx-auto">
        {/* Language Selection: English, Tamil, Hindi */}
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm p-1 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="material-symbols-outlined text-emerald-700 text-sm ml-1.5">language</span>
          {[
            { code: 'en' as AppLanguage, label: 'EN' },
            { code: 'ta' as AppLanguage, label: 'தமிழ்' },
            { code: 'hi' as AppLanguage, label: 'हिन्दी' }
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLangChange(lang.code)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                selectedLang === lang.code
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-800'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Quick Skip button */}
        <button
          onClick={() => onProceed('home')}
          className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-emerald-800 border border-emerald-200 shadow-xs transition-all flex items-center gap-1"
        >
          <span>Dashboard</span>
          <span className="material-symbols-outlined text-xs">arrow_forward</span>
        </button>
      </header>

      {/* Main Content Canvas */}
      <main className="z-10 flex flex-col items-center justify-center w-full max-w-md px-4 flex-grow my-auto text-center">
        {/* CROPIQ Logo */}
        <div className="w-40 h-40 sm:w-48 sm:h-48 mb-3 relative flex items-center justify-center">
          <img
            alt="CROPIQ Logo"
            className="w-full h-full object-contain drop-shadow-lg"
            src={ASSETS.logo}
          />
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-900 tracking-tight mb-1">
          CROPIQ
        </h1>

        {/* Official Tagline */}
        <p className="text-base sm:text-lg font-semibold text-emerald-700 max-w-xs font-sans tracking-wide mb-1">
          “Preserve. Predict. Prosper.”
        </p>
        <p className="text-xs text-slate-500 max-w-xs font-mono">
          Solar-Powered Smart Cold Storage for Farmers
        </p>

        {/* Action Buttons */}
        <div className="mt-7 flex flex-col gap-3 w-full max-w-xs">
          {/* Simple Login / Continue Button */}
          <button
            id="btn-splash-continue"
            onClick={() => onProceed('login')}
            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 text-base"
          >
            <span>
              {selectedLang === 'ta'
                ? 'தொடரவும் / உள்நுழைய'
                : selectedLang === 'hi'
                ? 'आगे बढ़ें / लॉगिन'
                : 'Continue / Login'}
            </span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>

          {/* Voice Assistance Option */}
          {onOpenVoiceModal && (
            <button
              id="btn-splash-voice"
              onClick={onOpenVoiceModal}
              className="w-full py-3 px-5 bg-white hover:bg-emerald-50 text-emerald-800 border-2 border-emerald-300 font-bold rounded-2xl shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-emerald-600 text-xl animate-pulse">mic</span>
              <span>
                {selectedLang === 'ta'
                  ? 'குரல் உதவியாளர்'
                  : selectedLang === 'hi'
                  ? 'वॉयस असिस्टेंट'
                  : 'Voice Assistant'}
              </span>
            </button>
          )}
        </div>
      </main>

      {/* Bottom Illustration Section */}
      <footer className="w-full relative h-[32vh] min-h-[220px] mt-auto flex-shrink-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 to-transparent z-10" />
        <div className="absolute inset-0 w-full h-full flex items-end justify-center">
          <img
            src={ASSETS.solarFieldIllustration}
            alt="Solar cold storage in lush green fields"
            className="w-full h-full object-cover object-bottom"
          />
        </div>
        {/* Visual Loading Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full border border-emerald-200">
          <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0ms]" />
          <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:150ms]" />
          <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:300ms]" />
        </div>
      </footer>
    </div>
  );
};
