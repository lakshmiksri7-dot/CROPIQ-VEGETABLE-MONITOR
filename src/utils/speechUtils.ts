import { AppLanguage } from '../types';

let currentUtterance: SpeechSynthesisUtterance | null = null;
let activeListeners: Set<(isSpeaking: boolean, textId?: string) => void> = new Set();
let currentTextId: string | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];
let keepAliveTimer: any = null;

// Initialize voices cache and handle async voice list loading
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    try {
      cachedVoices = window.speechSynthesis.getVoices();
    } catch {
      // ignore
    }
  };

  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
}

export const subscribeSpeechState = (listener: (isSpeaking: boolean, textId?: string) => void) => {
  activeListeners.add(listener);
  return () => {
    activeListeners.delete(listener);
  };
};

const notifyListeners = (isSpeaking: boolean, textId?: string) => {
  activeListeners.forEach((listener) => {
    try {
      listener(isSpeaking, textId);
    } catch {
      // ignore
    }
  });
};

export const isSpeechAvailable = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

// Convert Tamil Unicode script to clear phonetic Latin script for browsers lacking native Tamil voice pack
export function tamilToPhoneticText(text: string): string {
  // Pre-mapped standard phrases for pristine pronunciation when using fallback voice
  const phraseMap: Record<string, string> = {
    'வணக்கம்': 'Vanakkam',
    'CROPIQ': 'Crop I Q',
    'தக்காளி': 'thakkali',
    'பயிர்': 'payir',
    'சேமிப்பு': 'semippu',
    'குளிர்': 'kulir',
    'சூரிய': 'sooriya',
    'பேட்டரி': 'battery',
    'சந்தை': 'santhai',
    'விலை': 'vilai',
    'பாதுகாப்பானது': 'paadhukaapaanathu',
    'பாதுகாப்பு': 'paadhukaappu',
    'வெப்பநிலை': 'veppanilai',
    'ஈரப்பதம்': 'eerappadham',
    'மணிநேரம்': 'manineram',
    'கிலோ': 'kilo',
    'ரூபாய்': 'roobai'
  };

  let mapped = text;
  // If the text contains Tamil script characters
  const hasTamilChars = /[\u0B80-\u0BFF]/.test(text);
  if (!hasTamilChars) return text;

  // Key phrase replacements
  for (const [k, v] of Object.entries(phraseMap)) {
    mapped = mapped.split(k).join(v);
  }

  // Tamil phonetic mapping
  const tamilCharMap: Record<string, string> = {
    'அ': 'a', 'ஆ': 'aa', 'இ': 'i', 'ஈ': 'ee', 'உ': 'u', 'ஊ': 'oo',
    'எ': 'e', 'ஏ': 'ae', 'ஐ': 'ai', 'ஒ': 'o', 'ஓ': 'oa', 'ஔ': 'au',
    'க': 'ka', 'ங': 'nga', 'ச': 'sa', 'ஞ': 'nya', 'ட': 'ta', 'ண': 'na',
    'த': 'tha', 'ந': 'na', 'ப': 'pa', 'ம': 'ma', 'ய': 'ya', 'ர': 'ra',
    'ல': 'la', 'வ': 'va', 'ழ': 'zha', 'ள': 'la', 'ற': 'ra', 'ன': 'na',
    'க்': 'k', 'ங்': 'ng', 'ச்': 'ch', 'ஞ்': 'nj', 'ட்': 't', 'ண்': 'n',
    'த்': 'th', 'ந்': 'n', 'ப்': 'p', 'ம்': 'm', 'ய்': 'y', 'ர்': 'r',
    'ல்': 'l', 'வ்': 'v', 'ழ்': 'zh', 'ள்': 'l', 'ற்': 'r', 'ன்': 'n',
    'ா': 'aa', 'ி': 'i', 'ீ': 'ee', 'ு': 'u', 'ூ': 'oo',
    'ெ': 'e', 'ே': 'ae', 'ை': 'ai', 'ொ': 'o', 'ோ': 'oa', 'ௌ': 'au',
    '்': ''
  };

  let result = '';
  for (let i = 0; i < mapped.length; i++) {
    const char = mapped[i];
    if (tamilCharMap[char] !== undefined) {
      result += tamilCharMap[char];
    } else {
      result += char;
    }
  }

  return result.replace(/\s+/g, ' ').trim();
}

// Find best matching voice for the target language
export function findBestVoice(lang: AppLanguage): { voice: SpeechSynthesisVoice | null; isNative: boolean } {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { voice: null, isNative: false };
  }

  if (cachedVoices.length === 0) {
    try {
      cachedVoices = window.speechSynthesis.getVoices();
    } catch {
      // ignore
    }
  }

  const voices = cachedVoices;
  if (!voices || voices.length === 0) {
    return { voice: null, isNative: false };
  }

  if (lang === 'ta') {
    // 1. Check for dedicated Tamil voices (e.g. Google தமிழ், Microsoft Valluvar, ta-IN, ta_IN, ta)
    const tamilVoice = voices.find((v) => {
      const vLang = (v.lang || '').toLowerCase();
      const vName = (v.name || '').toLowerCase();
      return (
        vLang.startsWith('ta') ||
        vLang.includes('ta-in') ||
        vLang.includes('ta_in') ||
        vLang.includes('ta-') ||
        vName.includes('tamil') ||
        vName.includes('தமிழ்') ||
        vName.includes('valluvar') ||
        vName.includes('lekha')
      );
    });

    if (tamilVoice) {
      return { voice: tamilVoice, isNative: true };
    }

    // 2. Fallback to Indian English / Hindi voice for phonetics
    const indianVoice = voices.find((v) => {
      const vLang = (v.lang || '').toLowerCase();
      const vName = (v.name || '').toLowerCase();
      return (
        vLang.includes('en-in') ||
        vLang.includes('hi-in') ||
        vLang.includes('te-in') ||
        vName.includes('india') ||
        vName.includes('hindi') ||
        vName.includes('rishi') ||
        vName.includes('veena') ||
        vName.includes('heera') ||
        vName.includes('neerja')
      );
    });

    return { voice: indianVoice || voices[0] || null, isNative: false };
  }

  if (lang === 'hi') {
    const hindiVoice = voices.find((v) => {
      const vLang = (v.lang || '').toLowerCase();
      const vName = (v.name || '').toLowerCase();
      return vLang.startsWith('hi') || vName.includes('hindi') || vName.includes('हिन्दी') || vName.includes('kalpana') || vName.includes('hemant');
    });
    if (hindiVoice) return { voice: hindiVoice, isNative: true };
  }

  if (lang === 'te') {
    const teluguVoice = voices.find((v) => {
      const vLang = (v.lang || '').toLowerCase();
      const vName = (v.name || '').toLowerCase();
      return vLang.startsWith('te') || vName.includes('telugu') || vName.includes('తెలుగు') || vName.includes('mohan');
    });
    if (teluguVoice) return { voice: teluguVoice, isNative: true };
  }

  if (lang === 'bn') {
    const bengaliVoice = voices.find((v) => {
      const vLang = (v.lang || '').toLowerCase();
      const vName = (v.name || '').toLowerCase();
      return vLang.startsWith('bn') || vName.includes('bengali') || vName.includes('বাংলা') || vName.includes('tapan') || vName.includes('bashkar');
    });
    if (bengaliVoice) return { voice: bengaliVoice, isNative: true };
  }

  if (lang === 'as') {
    const assameseVoice = voices.find((v) => {
      const vLang = (v.lang || '').toLowerCase();
      const vName = (v.name || '').toLowerCase();
      return vLang.startsWith('as') || vLang.startsWith('bn') || vName.includes('assamese') || vName.includes('bengali');
    });
    if (assameseVoice) return { voice: assameseVoice, isNative: true };
  }

  // Default English / Indian English match
  const englishVoice = voices.find((v) => {
    const vLang = (v.lang || '').toLowerCase();
    const vName = (v.name || '').toLowerCase();
    return vLang.includes('en-in') || vName.includes('india') || vLang.startsWith('en');
  });

  return { voice: englishVoice || voices[0] || null, isNative: true };
}

// Play a short pleasant audio tone via Web Audio API to confirm mic activation/agent response
export const playFeedbackTone = (type: 'start' | 'success' | 'alert' = 'start') => {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'start') {
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'success') {
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.18); // A5
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else {
      osc.frequency.setValueAtTime(300, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 400);
  } catch {
    // ignore audio context restrictions
  }
};

export const stopSpeech = () => {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }

  if (isSpeechAvailable()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
  currentUtterance = null;
  currentTextId = null;
  notifyListeners(false);
};

export const speakContent = (
  text: string,
  lang: AppLanguage = 'en',
  textId: string = 'general',
  onFinish?: () => void
): boolean => {
  if (!isSpeechAvailable() || !text || !text.trim()) return false;

  try {
    // If same text is already being spoken, toggle stop
    if (currentTextId === textId && window.speechSynthesis.speaking) {
      stopSpeech();
      return false;
    }

    stopSpeech();

    // Ensure speech synthesis is actively resumed (fix Chrome stuck paused state)
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    // Refresh voices
    if (cachedVoices.length === 0) {
      cachedVoices = window.speechSynthesis.getVoices();
    }

    const { voice: selectedVoice, isNative } = findBestVoice(lang);

    // Determine target spoken text and target language code
    let textToSpeak = text;
    let targetLangCode = 'en-IN';

    if (lang === 'ta') {
      if (isNative && selectedVoice) {
        // Native Tamil voice available - speak pure Tamil Unicode
        textToSpeak = text;
        targetLangCode = selectedVoice.lang || 'ta-IN';
      } else {
        // No native Tamil voice in OS - convert to phonetic Tamil so Indian English/Hindi voice speaks it intelligibly
        textToSpeak = tamilToPhoneticText(text);
        targetLangCode = selectedVoice?.lang || 'en-IN';
      }
    } else if (lang === 'hi') {
      targetLangCode = isNative ? (selectedVoice?.lang || 'hi-IN') : 'hi-IN';
    } else if (lang === 'te') {
      targetLangCode = isNative ? (selectedVoice?.lang || 'te-IN') : 'te-IN';
    } else if (lang === 'bn' || lang === 'as') {
      targetLangCode = isNative ? (selectedVoice?.lang || 'bn-IN') : 'bn-IN';
    } else {
      targetLangCode = selectedVoice?.lang || 'en-IN';
    }

    // Delay slightly to prevent Chromium dropping the utterance immediately after cancel()
    setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = targetLangCode;

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        utterance.rate = lang === 'ta' ? 0.92 : 0.96;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        currentUtterance = utterance;
        currentTextId = textId;

        // Keep-alive tick to prevent Chrome from auto-stopping after 15 seconds
        if (keepAliveTimer) clearInterval(keepAliveTimer);
        keepAliveTimer = setInterval(() => {
          if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          } else {
            if (keepAliveTimer) clearInterval(keepAliveTimer);
          }
        }, 10000);

        utterance.onstart = () => {
          notifyListeners(true, textId);
        };

        utterance.onend = () => {
          if (keepAliveTimer) {
            clearInterval(keepAliveTimer);
            keepAliveTimer = null;
          }
          currentTextId = null;
          currentUtterance = null;
          notifyListeners(false);
          if (onFinish) onFinish();
        };

        utterance.onerror = (e) => {
          if (keepAliveTimer) {
            clearInterval(keepAliveTimer);
            keepAliveTimer = null;
          }
          if (e.error !== 'interrupted' && e.error !== 'canceled') {
            console.warn('Speech synthesis notification:', e.error);
          }
          currentTextId = null;
          currentUtterance = null;
          notifyListeners(false);
        };

        // Resume and speak
        window.speechSynthesis.resume();
        window.speechSynthesis.speak(utterance);
      } catch (innerErr) {
        console.warn('Inner SpeechSynthesis error:', innerErr);
      }
    }, 20);

    return true;
  } catch (err) {
    console.warn('SpeechSynthesis error:', err);
    currentTextId = null;
    notifyListeners(false);
    return false;
  }
};


