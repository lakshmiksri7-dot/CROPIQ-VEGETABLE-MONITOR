import React from 'react';
import { ASSETS } from '../../data/mockData';
import { UserProfile, AppLanguage, ScreenId } from '../../types';

interface ProfileScreenProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenChatSupport: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProfile,
  onUpdateProfile,
  onOpenChatSupport,
  onNavigate
}) => {
  const handleLanguageChange = (lang: AppLanguage) => {
    onUpdateProfile({ language: lang });
  };

  const handleSignOut = () => {
    onUpdateProfile({ isLoggedIn: false });
    onNavigate('login');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-4 pb-28 space-y-5 md:grid md:grid-cols-12 md:gap-4 md:space-y-0">
      {/* Profile Header Card */}
      <div className="md:col-span-12 bg-[#121212] rounded-[2rem] p-6 border border-white/5 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        {/* Profile Avatar */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0">
          <img
            alt="Farmer Profile"
            className="w-full h-full object-cover rounded-2xl border-2 border-white/10"
            src={ASSETS.farmerProfilePhoto}
          />
          <button
            onClick={() => alert('Profile photo change dialog')}
            className="absolute -bottom-2 -right-2 bg-orange-500 text-black rounded-xl w-8 h-8 flex items-center justify-center shadow-lg hover:bg-orange-400 transition-colors"
            title="Edit Photo"
          >
            <span className="material-symbols-outlined text-base font-bold">edit</span>
          </button>
        </div>

        {/* Info */}
        <div className="text-center md:text-left flex-1 relative z-10">
          <span className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold block mb-1">
            Registered Operator
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-[#f0f0f0]">
            {userProfile.name}
          </h1>
          <p className="text-xs font-mono text-white/50 mt-0.5">
            Facility ID: {userProfile.memberId}
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
            <span className="bg-white/5 border border-white/10 text-white/80 px-3.5 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5">
              <span className="material-symbols-outlined text-orange-400 text-[16px]">
                location_on
              </span>
              <span>{userProfile.location}</span>
            </span>

            <span className="bg-orange-500/15 border border-orange-500/30 text-orange-400 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-orange-400 text-[16px]">
                warehouse
              </span>
              <span>Unit: {userProfile.storageUnit}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Left Column: Language & Notifications */}
      <div className="md:col-span-7 space-y-4">
        {/* Language Settings */}
        <section className="bg-[#121212] rounded-[2rem] p-6 border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-orange-400">language</span>
            <h2 className="text-base font-medium text-[#f0f0f0]">Language Localization</h2>
          </div>

          <div className="space-y-2.5">
            {/* English */}
            <label
              onClick={() => handleLanguageChange('en')}
              className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                userProfile.language === 'en'
                  ? 'border-orange-500 bg-orange-500/10 text-white'
                  : 'border-white/5 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <span className="text-xs font-mono">English (International)</span>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  userProfile.language === 'en'
                    ? 'border-orange-500 bg-orange-500'
                    : 'border-white/20'
                }`}
              >
                {userProfile.language === 'en' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                )}
              </div>
            </label>

            {/* Hindi */}
            <label
              onClick={() => handleLanguageChange('hi')}
              className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                userProfile.language === 'hi'
                  ? 'border-orange-500 bg-orange-500/10 text-white'
                  : 'border-white/5 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <span className="text-xs font-mono">Hindi (हिंदी)</span>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  userProfile.language === 'hi'
                    ? 'border-orange-500 bg-orange-500'
                    : 'border-white/20'
                }`}
              >
                {userProfile.language === 'hi' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                )}
              </div>
            </label>

            {/* Assamese */}
            <label
              onClick={() => handleLanguageChange('as')}
              className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                userProfile.language === 'as'
                  ? 'border-orange-500 bg-orange-500/10 text-white'
                  : 'border-white/5 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <span className="text-xs font-mono">
                Assamese (অসমীয়া)
              </span>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  userProfile.language === 'as'
                    ? 'border-orange-500 bg-orange-500'
                    : 'border-white/20'
                }`}
              >
                {userProfile.language === 'as' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                )}
              </div>
            </label>
          </div>
        </section>

        {/* Alert Preferences */}
        <section className="bg-[#121212] rounded-[2rem] p-6 border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-orange-400">
              notifications_active
            </span>
            <h2 className="text-base font-medium text-[#f0f0f0]">Alert Channels</h2>
          </div>

          <div className="space-y-4 divide-y divide-white/5">
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-sm font-light text-[#f0f0f0]">Critical Incident SMS</p>
                <p className="text-xs font-mono text-white/40">Thermal / relative humidity spike dispatch</p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={userProfile.smsAlerts}
                  onChange={(e) => onUpdateProfile({ smsAlerts: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500" />
              </label>
            </div>

            <div className="flex items-center justify-between pt-3.5">
              <div>
                <p className="text-sm font-light text-[#f0f0f0]">App Push Telemetry</p>
                <p className="text-xs font-mono text-white/40">Daily microgrid & storage digests</p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={userProfile.appAlerts}
                  onChange={(e) => onUpdateProfile({ appAlerts: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500" />
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
              <span className="material-symbols-outlined text-orange-400">help</span>
              <h2 className="text-base font-medium text-[#f0f0f0]">Agronomy & Tech Support</h2>
            </div>
            <p className="text-xs text-white/60 mb-6 leading-relaxed">
              24/7 cold storage engineering support for solar microgrid or climate calibration questions.
            </p>
          </div>

          <div className="space-y-3 mt-4">
            <button
              onClick={() => alert('Initiating direct support call: +91 1800-CROPIQ-HELP')}
              className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all text-xs uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-lg">call</span>
              <span>Direct Hotline</span>
            </button>

            <button
              id="btn-chat-with-us"
              onClick={onOpenChatSupport}
              className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all text-xs uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-lg text-orange-400">chat</span>
              <span>AI CropIQ Assistant</span>
            </button>
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
