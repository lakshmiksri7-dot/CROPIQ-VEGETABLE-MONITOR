import React, { useState } from 'react';
import { UserProfile, UserRole, AppLanguage, ScreenId } from '../../types';
import { ASSETS } from '../../data/mockData';
import { speakContent } from '../../utils/speechUtils';

interface LoginSetupScreenProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onProceed: (targetScreen: ScreenId) => void;
  onOpenVoiceModal?: () => void;
}

export const LoginSetupScreen: React.FC<LoginSetupScreenProps> = ({
  userProfile,
  onUpdateProfile,
  onProceed,
  onOpenVoiceModal
}) => {
  const [phoneNumber, setPhoneNumber] = useState(userProfile.phone || '9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('4829');
  const [selectedRole, setSelectedRole] = useState<UserRole>(userProfile.role || 'farmer');
  const [selectedLang, setSelectedLang] = useState<AppLanguage>(userProfile.language || 'en');
  const [isVerifying, setIsVerifying] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const handleLangChange = (lang: AppLanguage) => {
    setSelectedLang(lang);
    const spokenWelcome =
      lang === 'ta'
        ? 'மொழி மாற்றப்பட்டது: தமிழ்'
        : lang === 'hi'
        ? 'भाषा बदली गई: हिन्दी'
        : 'Language switched to English';
    speakContent(spokenWelcome, lang, 'login-lang-switch');
  };

  const handleGetOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    setOtpSent(true);
    setSuccessToast(`OTP sent to +91 ${phoneNumber}! (Auto-filled: 4829)`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleCompleteSetup = () => {
    setIsVerifying(true);
    setTimeout(() => {
      onUpdateProfile({
        phone: phoneNumber,
        role: selectedRole,
        language: selectedLang,
        isLoggedIn: true
      });
      setIsVerifying(false);
      onProceed('home');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-4 sm:p-6">
      {/* Top Bar for back or skip */}
      <div className="w-full max-w-md mx-auto flex justify-between items-center mb-2">
        <button
          onClick={() => onProceed('splash')}
          className="flex items-center text-sm font-bold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <span className="material-symbols-outlined text-base mr-1">arrow_back</span>
          Back
        </button>

        {onOpenVoiceModal && (
          <button
            onClick={onOpenVoiceModal}
            className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center gap-1 border border-emerald-300"
          >
            <span className="material-symbols-outlined text-sm">mic</span>
            <span>Voice Help</span>
          </button>
        )}
      </div>

      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-md flex flex-col space-y-5">
          {/* Header */}
          <header className="text-center space-y-1.5">
            <div className="w-20 h-20 mx-auto flex items-center justify-center">
              <img
                src={ASSETS.logo}
                alt="CROPIQ"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-900 tracking-tight">
              Welcome to CROPIQ
            </h1>
            <p className="text-sm font-semibold text-emerald-700">“Preserve. Predict. Prosper.”</p>
          </header>

          {/* Card Container */}
          <div className="bg-white rounded-3xl shadow-sm p-6 space-y-5 border border-slate-200">
            {/* Preferred Language Selection: English, Tamil, Hindi */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 font-mono">
                Select Language / மொழியை தேர்ந்தெடுக்கவும் / भाषा चुनें
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { code: 'en' as AppLanguage, label: 'English', sub: 'EN' },
                  { code: 'ta' as AppLanguage, label: 'தமிழ்', sub: 'Tamil' },
                  { code: 'hi' as AppLanguage, label: 'हिन्दी', sub: 'Hindi' }
                ].map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => handleLangChange(l.code)}
                    className={`py-2.5 px-2 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                      selectedLang === l.code
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs ring-2 ring-emerald-200'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium'
                    }`}
                  >
                    <span className="text-sm">{l.label}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{l.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 1: Login / Phone Number */}
            <div className="space-y-3" id="step-1-login">
              <div>
                <label
                  className="block text-sm font-bold text-slate-800 mb-1.5"
                  htmlFor="mobile-number"
                >
                  {selectedLang === 'ta'
                    ? 'கைபேசி எண்'
                    : selectedLang === 'hi'
                    ? 'मोबाइल नंबर'
                    : 'Mobile Number'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 text-base font-semibold">
                    +91
                  </span>
                  <input
                    id="mobile-number"
                    className="w-full pl-14 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-2xl text-base text-slate-900 font-medium outline-hidden transition-all"
                    placeholder="Enter 10-digit number"
                    type="tel"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              {!otpSent ? (
                <button
                  id="btn-get-otp"
                  onClick={handleGetOtp}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-md active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                  <span>
                    {selectedLang === 'ta'
                      ? 'OTP பெறுக'
                      : selectedLang === 'hi'
                      ? 'OTP प्राप्त करें'
                      : 'Get OTP / Continue'}
                  </span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              ) : (
                <div className="space-y-3 p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-900">Enter 4-digit OTP</span>
                    <button
                      onClick={() => setOtpSent(false)}
                      className="text-xs text-slate-500 underline hover:text-emerald-700 font-semibold"
                    >
                      Change Number
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full text-center tracking-widest text-2xl font-bold py-2 bg-white rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
                  />
                </div>
              )}
            </div>

            {successToast && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold text-center">
                {successToast}
              </div>
            )}

            {/* Step 2: Role Selection */}
            <div className="space-y-3 border-t border-slate-100 pt-4" id="step-2-setup">
              <label className="block text-sm font-bold text-slate-800">
                {selectedLang === 'ta' ? 'பயனர் வகை' : selectedLang === 'hi' ? 'आपकी भूमिका' : 'I am a...'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'farmer' as UserRole, label: 'Farmer', icon: 'agriculture' },
                  { id: 'cooperative' as UserRole, label: 'Cooperative', icon: 'groups' },
                  { id: 'collection' as UserRole, label: 'Hub Center', icon: 'warehouse' }
                ].map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`rounded-2xl border-2 p-3 flex flex-col items-center justify-center space-y-1 transition-all ${
                      selectedRole === role.id
                        ? 'border-emerald-600 bg-emerald-600 text-white font-bold shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">{role.icon}</span>
                    <span className="text-xs">{role.label}</span>
                  </button>
                ))}
              </div>

              {/* Complete Setup Action */}
              <button
                id="btn-complete-setup"
                onClick={handleCompleteSetup}
                disabled={isVerifying}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-md hover:shadow-lg active:scale-95 transition-all text-base flex items-center justify-center gap-2 mt-2"
              >
                {isVerifying ? (
                  <span>Entering Dashboard...</span>
                ) : (
                  <>
                    <span>
                      {selectedLang === 'ta'
                        ? 'உள்நுழையவும்'
                        : selectedLang === 'hi'
                        ? 'डैशबोर्ड में प्रवेश करें'
                        : 'Enter Dashboard'}
                    </span>
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer Terms */}
          <div className="text-center">
            <p className="text-xs text-slate-500">
              CROPIQ • Solar-Powered Cold Chain Intelligence
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
