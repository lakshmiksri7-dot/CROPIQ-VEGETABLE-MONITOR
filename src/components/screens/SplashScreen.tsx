import React from 'react';
import { ASSETS } from '../../data/mockData';
import { ScreenId } from '../../types';

interface SplashScreenProps {
  onProceed: (target?: ScreenId) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onProceed }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#ffffff] text-[#1a1c1c] flex flex-col items-center justify-between overflow-hidden">
      {/* Ambient Background Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#88d982]/20 blur-3xl opacity-50 animate-pulse" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-[#a5c8ff]/15 blur-3xl opacity-50" />
      </div>

      {/* Top Skip/Enter Direct button */}
      <div className="w-full z-20 flex justify-end p-4">
        <button
          onClick={() => onProceed('home')}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#f3f3f3] hover:bg-[#e8e8e8] text-[#40493d] transition-all"
        >
          Skip to Dashboard →
        </button>
      </div>

      {/* Main Content Canvas */}
      <main className="z-10 flex flex-col items-center justify-center w-full max-w-md px-4 flex-grow my-auto">
        <div className="flex flex-col items-center justify-center w-full text-center">
          <div className="w-48 h-48 md:w-56 md:h-56 mb-4 relative flex items-center justify-center">
            <img
              alt="CROPIQ Brand Logo"
              className="w-full h-full object-contain drop-shadow-xl"
              src={ASSETS.logo}
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-[#0d631b] tracking-tight mb-2">
            CROPIQ
          </h1>

          <p className="text-lg md:text-xl text-[#40493d] max-w-xs font-normal">
            Think Fresh. Store Smart. Grow More.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              onClick={() => onProceed('login')}
              className="w-full py-3.5 px-6 bg-[#0d631b] hover:bg-[#2e7d32] text-white font-semibold rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Illustration Section */}
      <div className="w-full relative h-[38vh] min-h-[260px] mt-auto flex-shrink-0 overflow-hidden">
        {/* Ground Gradient Line */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#2e7d32]/20 to-transparent z-10" />

        {/* Illustration Container */}
        <div className="absolute inset-0 w-full h-full flex items-end justify-center">
          <img
            src={ASSETS.solarFieldIllustration}
            alt="Modern solar-powered cold storage unit in lush agricultural farm"
            className="w-full h-full object-cover object-bottom"
          />
        </div>

        {/* Decorative loading indicator dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-[#0d631b] animate-bounce [animation-delay:0ms]" />
          <div className="w-2 h-2 rounded-full bg-[#0d631b] animate-bounce [animation-delay:150ms]" />
          <div className="w-2 h-2 rounded-full bg-[#0d631b] animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
};
