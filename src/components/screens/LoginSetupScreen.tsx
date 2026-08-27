import React, { useState } from 'react';
import { UserProfile, UserRole, AppLanguage, ScreenId } from '../../types';

interface LoginSetupScreenProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onProceed: (targetScreen: ScreenId) => void;
}

export const LoginSetupScreen: React.FC<LoginSetupScreenProps> = ({
  userProfile,
  onUpdateProfile,
  onProceed
}) => {
  const [phoneNumber, setPhoneNumber] = useState(userProfile.phone || '9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('4829');
  const [selectedRole, setSelectedRole] = useState<UserRole>(userProfile.role || 'farmer');
  const [selectedLang, setSelectedLang] = useState<AppLanguage>(userProfile.language || 'en');
  const [isVerifying, setIsVerifying] = useState(false);
  const [successToast, setSuccessToast] = useState('');

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
    <div className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c] flex flex-col justify-between p-4 md:p-8">
      {/* Top Bar for back or skip */}
      <div className="w-full max-w-md mx-auto flex justify-between items-center mb-2">
        <button
          onClick={() => onProceed('splash')}
          className="flex items-center text-sm font-medium text-[#40493d] hover:text-[#0d631b] transition-colors"
        >
          <span className="material-symbols-outlined text-base mr-1">arrow_back</span>
          Back
        </button>
        <button
          onClick={() => onProceed('home')}
          className="text-xs font-semibold px-3 py-1 rounded-full bg-[#eeeeee] hover:bg-[#e2e2e2] text-[#40493d]"
        >
          Explore Demo
        </button>
      </div>

      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-md flex flex-col space-y-6">
          {/* Header */}
          <header className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <span className="material-symbols-outlined text-6xl text-[#0d631b] filled-icon">
                eco
              </span>
            </div>
            <h1 className="text-3xl font-bold text-[#1a1c1c] tracking-tight">
              Welcome to CROPIQ
            </h1>
            <p className="text-base text-[#40493d]">Secure your harvest, smartly.</p>
          </header>

          {/* Card Container */}
          <div className="bg-[#ffffff] rounded-2xl shadow-sm p-6 space-y-6 border border-[#eeeeee]">
            {/* Step 1: Login / OTP */}
            <div className="space-y-4" id="step-1-login">
              <div>
                <label
                  className="block text-sm font-semibold text-[#1a1c1c] mb-2"
                  htmlFor="mobile-number"
                >
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#40493d] text-base font-medium">
                    +91
                  </span>
                  <input
                    id="mobile-number"
                    className="w-full pl-14 pr-4 py-3 bg-[#eeeeee] border border-transparent focus:border-[#0d631b] focus:bg-white focus:ring-1 focus:ring-[#0d631b] rounded-xl text-base text-[#1a1c1c] font-medium outline-hidden transition-all"
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
                  className="w-full py-3.5 bg-[#0d631b] hover:bg-[#2e7d32] text-white rounded-xl font-semibold shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Get OTP</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              ) : (
                <div className="space-y-3 p-3 bg-[#f3f3f3] rounded-xl border border-[#e2e2e2]">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-[#0d631b]">Enter 4-digit OTP</span>
                    <button
                      onClick={() => setOtpSent(false)}
                      className="text-xs text-[#40493d] underline hover:text-[#0d631b]"
                    >
                      Change Number
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full text-center tracking-widest text-xl font-bold py-2 bg-white rounded-lg border border-[#bfcaba] focus:ring-2 focus:ring-[#0d631b] outline-hidden"
                  />
                </div>
              )}
            </div>

            {successToast && (
              <div className="p-3 bg-[#2e7d32]/10 border border-[#0d631b] rounded-lg text-xs text-[#0d631b] font-medium text-center">
                {successToast}
              </div>
            )}

            {/* Step 2: Account Setup */}
            <div className="space-y-5 border-t border-[#e2e2e2] pt-5" id="step-2-setup">
              <h2 className="text-xl font-semibold text-[#1a1c1c]">Account Setup</h2>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#1a1c1c]">
                  I am a...
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {/* Farmer */}
                  <label
                    onClick={() => setSelectedRole('farmer')}
                    className="cursor-pointer"
                  >
                    <div
                      className={`rounded-xl border-2 p-3 flex flex-col items-center justify-center space-y-1 transition-all ${
                        selectedRole === 'farmer'
                          ? 'border-[#0d631b] bg-[#2e7d32] text-[#cbffc2]'
                          : 'border-[#e2e2e2] bg-[#f9f9f9] hover:bg-[#f3f3f3] text-[#40493d]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-3xl">agriculture</span>
                      <span className="text-xs font-semibold text-center">Farmer</span>
                    </div>
                  </label>

                  {/* Cooperative */}
                  <label
                    onClick={() => setSelectedRole('cooperative')}
                    className="cursor-pointer"
                  >
                    <div
                      className={`rounded-xl border-2 p-3 flex flex-col items-center justify-center space-y-1 transition-all ${
                        selectedRole === 'cooperative'
                          ? 'border-[#0d631b] bg-[#2e7d32] text-[#cbffc2]'
                          : 'border-[#e2e2e2] bg-[#f9f9f9] hover:bg-[#f3f3f3] text-[#40493d]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-3xl">groups</span>
                      <span className="text-xs font-semibold text-center">Cooperative</span>
                    </div>
                  </label>

                  {/* Collection Centre */}
                  <label
                    onClick={() => setSelectedRole('collection')}
                    className="cursor-pointer"
                  >
                    <div
                      className={`rounded-xl border-2 p-3 flex flex-col items-center justify-center space-y-1 transition-all ${
                        selectedRole === 'collection'
                          ? 'border-[#0d631b] bg-[#2e7d32] text-[#cbffc2]'
                          : 'border-[#e2e2e2] bg-[#f9f9f9] hover:bg-[#f3f3f3] text-[#40493d]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-3xl">warehouse</span>
                      <span className="text-[11px] font-semibold text-center leading-tight">
                        Collection Centre
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Preferred Language */}
              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold text-[#1a1c1c]"
                  htmlFor="language-select"
                >
                  Preferred Language
                </label>
                <div className="relative">
                  <select
                    id="language-select"
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value as AppLanguage)}
                    className="w-full pl-4 pr-10 py-3 bg-[#eeeeee] border border-transparent focus:border-[#0d631b] focus:bg-white focus:ring-1 focus:ring-[#0d631b] rounded-xl text-base text-[#1a1c1c] font-medium appearance-none transition-all outline-hidden cursor-pointer"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi (हिन्दी)</option>
                    <option value="as">Assamese (অসমীয়া)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#40493d]">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
              </div>

              {/* Complete Setup Action */}
              <button
                id="btn-complete-setup"
                onClick={handleCompleteSetup}
                disabled={isVerifying}
                className="w-full py-4 bg-[#0d631b] hover:bg-[#2e7d32] text-white rounded-xl font-bold shadow-md hover:shadow-lg active:scale-95 transition-all text-base flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <span>Configuring Workspace...</span>
                ) : (
                  <>
                    <span>Complete Setup</span>
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer Terms */}
          <div className="text-center">
            <p className="text-xs text-[#707a6c]">
              By continuing, you agree to our{' '}
              <a href="#terms" className="text-[#0d631b] font-medium hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#privacy" className="text-[#0d631b] font-medium hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
