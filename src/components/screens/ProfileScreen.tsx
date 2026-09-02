import React from 'react';
import { ASSETS } from '../../data/mockData';
import { UserProfile, AppLanguage, ScreenId } from '../../types';

interface ProfileScreenProps {
  userProfile: UserProfile;
  language: AppLanguage;
  onSetLanguage: (lang: AppLanguage) => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenChatSupport: () => void;
  onOpenInstallModal?: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProfile,
  language,
  onSetLanguage,
  onUpdateProfile,
  onOpenChatSupport,
  onOpenInstallModal,
  onNavigate
}) => {
  const handleLanguageChange = (lang: AppLanguage) => {
    onSetLanguage(lang);
    onUpdateProfile({ language: lang });
  };

  const handleSignOut = () => {
    onUpdateProfile({ isLoggedIn: false });
    onNavigate('login');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-4 pb-28 space-y-5 md:grid md:grid-cols-12 md:gap-4 md:space-y-0">
      {/* Profile Header Card */}
      <div className="md:col-span-12 bg-[#121212] rounded-[2.5rem] p-6 border border-emerald-500/30 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden bg-gradient-to-r from-emerald-950/20 via-[#121212] to-[#121212]">
        {/* Profile Avatar */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0">
          <img
            alt="Farmer Profile"
            className="w-full h-full object-cover rounded-3xl border-2 border-emerald-500/40 shadow-xl"
            src={ASSETS.farmerProfilePhoto}
          />
          <button
            onClick={() => alert('Farmer profile photo manager')}
            className="absolute -bottom-2 -right-2 bg-emerald-500 text-black rounded-xl w-8 h-8 flex items-center justify-center shadow-lg hover:bg-emerald-400 transition-colors"
            title="Edit Photo"
          >
            <span className="material-symbols-outlined text-base font-bold">edit</span>
          </button>
        </div>

        {/* Info */}
        <div className="text-center md:text-left flex-1 relative z-10">
          <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-bold block mb-1">
            Registered Progressive Farmer / FPO Leader
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {userProfile.name}
          </h1>
          <p className="text-xs font-mono text-emerald-400/80 mt-0.5">
            Farmer ID: {userProfile.memberId} • Mobile: +91 94350-12844
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
            <span className="bg-white/5 border border-white/10 text-white/80 px-3.5 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-400 text-[16px]">
                location_on
              </span>
              <span>{userProfile.location}</span>
            </span>

            <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-400 text-[16px]">
                warehouse
              </span>
              <span>Primary Unit: {userProfile.storageUnit}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Left Column: Language & Notifications */}
      <div className="md:col-span-7 space-y-4">
        {/* Language Settings */}
        <section className="bg-[#121212] rounded-[2rem] p-6 border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-emerald-400">language</span>
            <h2 className="text-base font-bold text-white">Language / ভাষা / भाषा</h2>
          </div>

          <div className="space-y-2.5">
            {/* Assamese */}
            <label
              onClick={() => handleLanguageChange('as')}
              className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                language === 'as'
                  ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-md'
                  : 'border-white/5 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🇮🇳</span>
                <span className="text-xs font-bold">Assamese (অসমীয়া) - উত্তৰ-পূব আঞ্চলিক</span>
              </div>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  language === 'as'
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-white/20'
                }`}
              >
                {language === 'as' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                )}
              </div>
            </label>

            {/* Hindi */}
            <label
              onClick={() => handleLanguageChange('hi')}
              className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                language === 'hi'
                  ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-md'
                  : 'border-white/5 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🇮🇳</span>
                <span className="text-xs font-bold">Hindi (हिंदी) - किसान इंटरफ़ेस</span>
              </div>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  language === 'hi'
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-white/20'
                }`}
              >
                {language === 'hi' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                )}
              </div>
            </label>

            {/* English */}
            <label
              onClick={() => handleLanguageChange('en')}
              className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                language === 'en'
                  ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-md'
                  : 'border-white/5 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🌐</span>
                <span className="text-xs font-mono font-bold">English (Standard)</span>
              </div>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  language === 'en'
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-white/20'
                }`}
              >
                {language === 'en' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                )}
              </div>
            </label>
          </div>
        </section>

        {/* Alert Preferences */}
        <section className="bg-[#121212] rounded-[2rem] p-6 border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-emerald-400">
              notifications_active
            </span>
            <h2 className="text-base font-bold text-white">Farmer Alert Channels</h2>
          </div>

          <div className="space-y-4 divide-y divide-white/5">
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-sm font-bold text-white">Critical Door & Cooling Incident SMS</p>
                <p className="text-xs font-mono text-white/40">Automated SMS to registered farmer mobile</p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={userProfile.smsAlerts}
                  onChange={(e) => onUpdateProfile({ smsAlerts: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
              </label>
            </div>

            <div className="flex items-center justify-between pt-3.5">
              <div>
                <p className="text-sm font-bold text-white">App Push & Telemetry Digest</p>
                <p className="text-xs font-mono text-white/40">Daily microgrid solar & mandi price alerts</p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={userProfile.appAlerts}
                  onChange={(e) => onUpdateProfile({ appAlerts: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
              </label>
            </div>
          </div>
        </section>
      </div>

      {/* Right Column: Help & Support */}
      <div className="md:col-span-5 space-y-4">
        <section className="bg-[#121212] rounded-[2rem] p-6 border border-white/5 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-emerald-400">help</span>
              <h2 className="text-base font-bold text-white">NER Agri-Cold Support</h2>
            </div>
            <p className="text-xs text-white/60 mb-6 leading-relaxed">
              24/7 dedicated engineering support for solar mini cold storage, PCM cooling maintenance, and e-NAM mandi dispatch assistance.
            </p>
          </div>

          <div className="space-y-3 mt-4">
            <button
              onClick={() => alert('Calling CROPIQ Farmer Support Helpline: 1800-CROPIQ-NER')}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all text-xs uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-lg">call</span>
              <span>Toll-Free Farmer Hotline</span>
            </button>

            <button
              id="btn-chat-with-us"
              onClick={onOpenChatSupport}
              className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all text-xs uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-lg text-emerald-400">chat</span>
              <span>AI CropIQ Assistant</span>
            </button>

            {onOpenInstallModal && (
              <button
                id="btn-install-app-profile"
                onClick={onOpenInstallModal}
                className="w-full bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500 text-emerald-400 hover:text-black font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all text-xs uppercase tracking-wider group"
              >
                <span className="material-symbols-outlined text-lg">install_mobile</span>
                <span>Install Mobile PWA App</span>
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Logout / Switch User */}
      <div className="md:col-span-12 flex justify-center pt-3">
        <button
          onClick={handleSignOut}
          className="text-red-400 hover:bg-red-500/10 font-mono text-xs flex items-center gap-2 px-6 py-3 rounded-2xl transition-all active:scale-95 border border-red-500/20"
        >
          <span className="material-symbols-outlined text-base">logout</span>
          <span>Disconnect Session</span>
        </button>
      </div>
    </div>
  );
};
