import React, { useState, useEffect } from 'react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstallClick: () => void;
}

export function InstallAppModal({
  isOpen,
  onClose,
  deferredPrompt,
  onInstallClick
}: InstallAppModalProps) {
  const [deviceTab, setDeviceTab] = useState<'android' | 'ios' | 'desktop'>('android');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Auto detect user agent
    const ua = navigator.userAgent || '';
    if (/iPad|iPhone|iPod/.test(ua)) {
      setDeviceTab('ios');
    } else if (/Android/.test(ua)) {
      setDeviceTab('android');
    } else {
      setDeviceTab('desktop');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const appUrl = window.location.origin || 'https://ais-pre-qlankom4hlj6xwvjmoazht-289854368138.asia-southeast1.run.app';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(appUrl)}&bgcolor=121212&color=f97316&margin=1`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = `Open and Install CROPIQ Smart Cold Storage: ${appUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#121212] rounded-[2rem] w-full max-w-lg shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-500/15 border border-orange-500/30 overflow-hidden flex items-center justify-center p-0.5 shrink-0">
              <img
                src="/icon-192.png"
                alt="CROPIQ App Icon"
                className="w-full h-full object-cover rounded-[14px]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="font-light text-lg text-[#f0f0f0]">Install CROPIQ</h3>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                Official Home Screen App & Logo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Install Banner if browser supports native prompt */}
          {deferredPrompt && (
            <div className="bg-orange-500/15 border border-orange-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-orange-400">1-Tap Direct Install Ready</h4>
                <p className="text-xs text-white/70 mt-0.5">Your browser allows installing CROPIQ immediately.</p>
              </div>
              <button
                onClick={() => {
                  onInstallClick();
                  onClose();
                }}
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all whitespace-nowrap"
              >
                Install Now
              </button>
            </div>
          )}

          {/* OS Selector Tabs */}
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setDeviceTab('android')}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                deviceTab === 'android'
                  ? 'bg-orange-500 text-black shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">android</span>
              <span>Android</span>
            </button>
            <button
              onClick={() => setDeviceTab('ios')}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                deviceTab === 'ios'
                  ? 'bg-orange-500 text-black shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">phone_iphone</span>
              <span>iPhone / iPad</span>
            </button>
            <button
              onClick={() => setDeviceTab('desktop')}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                deviceTab === 'desktop'
                  ? 'bg-orange-500 text-black shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">laptop</span>
              <span>Computer</span>
            </button>
          </div>

          {/* Android Guide */}
          {deviceTab === 'android' && (
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold">
                Android Instructions (Chrome, Edge, Samsung Internet)
              </h4>
              <div className="space-y-2.5">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono font-bold text-orange-400 shrink-0">
                    1
                  </div>
                  <p className="text-xs text-white/80">
                    Open this website in <strong className="text-white">Google Chrome</strong> or your default browser.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono font-bold text-orange-400 shrink-0">
                    2
                  </div>
                  <div className="text-xs text-white/80">
                    Tap the <strong className="text-white">three dots menu (⋮)</strong> in the top right corner of Chrome.
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono font-bold text-orange-400 shrink-0">
                    3
                  </div>
                  <div className="text-xs text-white/80">
                    Tap <strong className="text-orange-400">"Install app"</strong> or <strong className="text-orange-400">"Add to Home screen"</strong>.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* iOS Guide */}
          {deviceTab === 'ios' && (
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold">
                iPhone / iPad Instructions (Safari)
              </h4>
              <div className="space-y-2.5">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono font-bold text-orange-400 shrink-0">
                    1
                  </div>
                  <p className="text-xs text-white/80">
                    Open this link in <strong className="text-white">Safari</strong> on your iPhone.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono font-bold text-orange-400 shrink-0">
                    2
                  </div>
                  <p className="text-xs text-white/80">
                    Tap the <strong className="text-white">Share button</strong> <span className="text-base">⎋</span> (square with arrow pointing up at the bottom).
                  </p>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono font-bold text-orange-400 shrink-0">
                    3
                  </div>
                  <p className="text-xs text-white/80">
                    Scroll down and tap <strong className="text-orange-400">"Add to Home Screen" ⊕</strong>, then tap <strong className="text-white">Add</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Guide & Phone QR Code */}
          {deviceTab === 'desktop' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl">
                <div className="w-32 h-32 bg-[#181818] p-2 rounded-xl border border-white/10 flex items-center justify-center shrink-0">
                  <img
                    src={qrCodeUrl}
                    alt="Scan QR code with phone camera to install"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                <div className="space-y-1.5 text-center sm:text-left">
                  <h5 className="text-xs font-mono font-bold uppercase text-orange-400">
                    Scan with Phone Camera
                  </h5>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Point your phone camera at this QR code to open and install CROPIQ directly on your mobile device.
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono font-bold text-orange-400 shrink-0">
                  ★
                </div>
                <p className="text-xs text-white/80">
                  <strong>On PC / Mac:</strong> Click the <strong className="text-orange-400">Install icon (⊕ or 💻)</strong> on the right side of Chrome/Edge address bar to run it as a desktop app.
                </p>
              </div>
            </div>
          )}

          {/* Quick Actions: Copy Link & WhatsApp Share */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleCopyLink}
              className="flex-1 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-mono text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-base text-orange-400">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Link Copied to Clipboard!' : 'Copy App Link'}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="bg-green-600 hover:bg-green-500 text-white font-mono text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-base">share</span>
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 bg-[#141414] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
