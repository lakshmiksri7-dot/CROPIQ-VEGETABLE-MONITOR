import React, { useState, useEffect, useRef } from 'react';
import { AppLanguage, StorageSilo, BatchItem } from '../../types';
import { speakContent, stopSpeech, subscribeSpeechState, playFeedbackTone } from '../../utils/speechUtils';
import { FarmerSpeechRecognizer, answerFarmerQuery, VoiceAnswer } from '../../utils/voiceNlp';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onSetLanguage: (lang: AppLanguage) => void;
  onNavigate: (screen: any) => void;
  silo?: StorageSilo;
  batches?: BatchItem[];
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  onSetLanguage,
  onNavigate,
  silo,
  batches
}) => {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState<string>('');
  const [activeQuery, setActiveQuery] = useState<string>('');
  const [textInput, setTextInput] = useState<string>('');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [micPermissionState, setMicPermissionState] = useState<'granted' | 'prompt' | 'denied' | 'checking'>('prompt');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMode, setSpeakingMode] = useState<'tap' | 'hold'>('tap');
  const [lastAnswer, setLastAnswer] = useState<VoiceAnswer | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const recognizerRef = useRef<FarmerSpeechRecognizer | null>(null);
  const holdTimeoutRef = useRef<any>(null);

  function getGreeting(lang: AppLanguage): string {
    if (lang === 'ta') {
      return 'வணக்கம்! உங்கள் தக்காளி நிலை, சூரிய பேட்டரி, உறைவிப்பான் இருப்பிடம் அல்லது சந்தை விலை குறித்து நீங்கள் கேட்கலாம்.';
    }
    if (lang === 'hi') {
      return 'नमस्ते! आप फसल ताजगी, सोलर बैटरी, कोल्ड स्टोरेज सुरक्षा या नजदीकी मंडी भाव के बारे में पूछ सकते हैं।';
    }
    if (lang === 'as') {
      return 'নমস্কাৰ! আপোনাৰ শস্য, বেটাৰী, শীতল ভঁৰালৰ অৱস্থান বা বজাৰৰ দৰৰ বিষয়ে সোধক।';
    }
    if (lang === 'te') {
      return 'నమస్కారం! పంట తాజాదనం, సోలార్ బ్యాటరీ, కోల్డ్ స్టోరేజ్ స్థానం లేదా మార్కెట్ ధర గురించి అడగండి.';
    }
    if (lang === 'bn') {
      return 'নমস্কার! ফসলের সতেজতা, সৌর ব্যাটারি, কোল্ড স্টোরেজের অবস্থান বা বাজারের দর সম্পর্কে জিজ্ঞাসা করুন।';
    }
    return 'Hello! I am your CROPIQ Farm Voice Agent. You can speak or tap below to ask about crop freshness, solar battery, storage safety, GPS location, or mandi rates.';
  }

  const [spokenResponse, setSpokenResponse] = useState<string>(() => getGreeting(language));

  // Check microphone permissions on open
  useEffect(() => {
    if (isOpen) {
      if (!recognizerRef.current) {
        recognizerRef.current = new FarmerSpeechRecognizer();
      }
      recognizerRef.current.checkOrRequestMicPermission().then((status) => {
        setMicPermissionState(status);
      });
    }
  }, [isOpen]);

  // Update greeting when language changes
  useEffect(() => {
    setSpokenResponse(getGreeting(language));
  }, [language]);

  // Track speech synthesizer state
  useEffect(() => {
    const unsubscribe = subscribeSpeechState((speaking) => {
      setIsSpeaking(speaking);
    });
    return unsubscribe;
  }, []);

  // Initialize Speech Recognizer
  useEffect(() => {
    recognizerRef.current = new FarmerSpeechRecognizer();
    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      stopSpeech();
    };
  }, []);

  // Process user question and synthesize response
  const processQuery = (queryText: string) => {
    if (!queryText || !queryText.trim()) return;

    setActiveQuery(queryText);
    setInterimText('');
    setVoiceError(null);

    const answer = answerFarmerQuery(queryText, language, { silo, batches });
    setLastAnswer(answer);
    setSpokenResponse(answer.displayText);

    if (answer.newLanguage && answer.newLanguage !== language) {
      onSetLanguage(answer.newLanguage);
    }

    playFeedbackTone('success');
    speakContent(answer.spokenText, answer.newLanguage || language, `voice-agent-${Date.now()}`);
  };

  // Start Voice Listening
  const startListening = () => {
    setVoiceError(null);
    stopSpeech();
    setIsSpeaking(false);
    setIsListening(true);
    setInterimText('');

    if (!recognizerRef.current) {
      recognizerRef.current = new FarmerSpeechRecognizer();
    }

    recognizerRef.current.start({
      language,
      onInterimResult: (interim) => {
        setInterimText(interim);
      },
      onFinalResult: (final) => {
        setIsListening(false);
        setAudioLevel(0);
        processQuery(final);
      },
      onAudioLevel: (lvl) => {
        setAudioLevel(lvl);
      },
      onPermissionChange: (status) => {
        setMicPermissionState(status);
      },
      onError: (err) => {
        setIsListening(false);
        setAudioLevel(0);
        setVoiceError(
          err.includes('denied') || err.includes('not-allowed')
            ? 'Microphone permission was denied. Please allow microphone access or use the quick spoken question buttons below.'
            : `Voice capture: ${err}`
        );
      },
      onEnd: () => {
        setIsListening(false);
        setAudioLevel(0);
      }
    });
  };

  // Stop Voice Listening
  const stopListening = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stop();
    }
    setIsListening(false);
    setAudioLevel(0);
  };

  // Toggle listening for tap mode
  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Push-to-Talk touch/mouse handlers
  const handleHoldStart = () => {
    if (speakingMode === 'hold') {
      startListening();
    }
  };

  const handleHoldEnd = () => {
    if (speakingMode === 'hold' && isListening) {
      // Small delay before stopping so final words are captured
      holdTimeoutRef.current = setTimeout(() => {
        stopListening();
      }, 500);
    }
  };

  // Grant Mic Permission Action
  const handleGrantMicPermission = async () => {
    setMicPermissionState('checking');
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
        setMicPermissionState('granted');
        setVoiceError(null);
        playFeedbackTone('success');
      } else {
        setVoiceError('Microphone API is not supported in this browser.');
      }
    } catch (err: any) {
      setMicPermissionState('denied');
      setVoiceError('Microphone permission denied. Please grant microphone access in your browser settings.');
    }
  };

  // Stop everything on modal close
  useEffect(() => {
    if (!isOpen) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      stopSpeech();
      setIsListening(false);
      setIsSpeaking(false);
      setInterimText('');
      setVoiceError(null);
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Preset question buttons
  const quickQuestions: {
    id: string;
    en: string;
    hi: string;
    as: string;
    ta: string;
    te: string;
    bn: string;
    icon: string;
    targetScreen: string;
  }[] = [
    {
      id: 'loc',
      en: 'Where is my nearest Cold Storage and Mandi?',
      hi: 'मेरा नजदीकी कोल्ड स्टोरेज और मंडी कहाँ है?',
      as: 'মোৰ নিকটতম শীতল ভঁৰাল আৰু মণ্ডি ক’ত আছে?',
      ta: 'எனக்கு அருகில் உள்ள குளிர் சேமிப்பு கூடம் எங்குள்ளது?',
      te: 'నా దగ్గరలోని కోల్డ్ స్టోరేజ్ మరియు మార్కెట్ ఎక్కడ ఉంది?',
      bn: 'আমার নিকটতম কোল্ড স্টোরেজ এবং বাজার কোথায়?',
      icon: 'pin_drop',
      targetScreen: 'map-locations'
    },
    {
      id: 'crop',
      en: 'What is my tomato freshness and shelf life?',
      hi: 'मेरे टमाटर की ताजगी और शेल्फ लाइफ क्या है?',
      as: 'মোৰ বিলাহীৰ সতেজতা আৰু স্থায়িত্ব কিমান?',
      ta: 'என் தக்காளி புத்துணர்ச்சி மற்றும் ஆயுள் என்ன?',
      te: 'నా టమోటా తాజాదనం మరియు నిల్వ కాలం ఎంత?',
      bn: 'আমার টমেটোর সতেজতা এবং শেলফ লাইফ কত?',
      icon: 'eco',
      targetScreen: 'freshness'
    },
    {
      id: 'bat',
      en: 'How much solar battery backup is remaining?',
      hi: 'कितना सोलर बैटरी बैकअप बचा है?',
      as: 'সৌৰ বেটাৰীৰ বেকআপ কিমান সময় চলিব?',
      ta: 'சூரிய பேட்டரி இன்னும் எவ்வளவு நேரம் வரும்?',
      te: 'సోలార్ బ్యాటరీ బ్యాకప్ ఇంకా ఎంత సమయం వస్తుంది?',
      bn: 'সৌর ব্যাটারির ব্যাকআপ কতটা অবশিষ্ট আছে?',
      icon: 'bolt',
      targetScreen: 'energy'
    },
    {
      id: 'temp',
      en: 'Is storage temperature safe and door closed?',
      hi: 'क्या स्टोरेज का तापमान सुरक्षित है और दरवाजा बंद है?',
      as: 'ভঁৰালৰ তাপমাত্ৰা সুৰক্ষিত আৰু দুৱাৰ বন্ধ আছেনে?',
      ta: 'சேமிப்பு வெப்பநிலை பாதுகாப்பாக உள்ளதா?',
      te: 'నిల్వ ఉష్ణోగ్రత సురక్షితంగా మరియు తలుపు మూసి ఉందా?',
      bn: 'স্টোরেজ তাপমাত্রা কি নিরাপদ এবং দরজা বন্ধ আছে?',
      icon: 'thermostat',
      targetScreen: 'storage'
    },
    {
      id: 'mandi',
      en: 'What is the current mandi market rate?',
      hi: 'वर्तमान मंडी का भाव क्या है?',
      as: 'বৰ্তমান মণ্ডিৰ দৰ কিমান?',
      ta: 'இன்றைய சந்தை விலை என்ன?',
      te: 'ప్రస్తుత మార్కెట్ ధర ఎంత?',
      bn: 'বর্তমান বাজার দর কত?',
      icon: 'storefront',
      targetScreen: 'market'
    },
    {
      id: 'emergency',
      en: 'What happens during a power cut or blackout?',
      hi: 'बिजली कट या ब्लैकआउट होने पर क्या होगा?',
      as: 'বিদ্যুৎ কৰ্তন হ’লে কি হ’ব?',
      ta: 'மின் தடை ஏற்பட்டால் என்ன ஆகும்?',
      te: 'కరెంట్ పోయినప్పుడు ఏమి జరుగుతుంది?',
      bn: 'বিদ্যুৎ চলে গেলে কি ঘটবে?',
      icon: 'warning',
      targetScreen: 'emergency'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white border-2 border-emerald-300 rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-lg overflow-hidden flex flex-col shadow-2xl max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-white to-white">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md transition-all ${
              isListening ? 'bg-red-600 text-white animate-pulse' : isSpeaking ? 'bg-emerald-600 text-white ring-4 ring-emerald-200' : 'bg-emerald-600 text-white'
            }`}>
              <span className="material-symbols-outlined text-2xl">
                {isListening ? 'mic' : isSpeaking ? 'graphic_eq' : 'smart_toy'}
              </span>
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight flex items-center gap-2">
                <span>
                  {language === 'ta'
                    ? 'விவசாய குரல் உதவியாளர்'
                    : language === 'hi'
                    ? 'किसान वॉयस असिस्टेंट'
                    : language === 'as'
                    ? 'কৃষক ভয়েচ সহায়ক'
                    : 'Farmer Voice AI Agent'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                  LIVE
                </span>
              </h3>
              <p className="text-[11px] text-emerald-800 font-mono font-bold">
                CROPIQ Multilingual Speech & Farm Intelligence
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all"
            title="Close voice assistant"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Multilingual Selector with Tamil, Hindi, Assamese, English, Telugu, Bengali */}
        <div className="px-4 py-2.5 flex items-center justify-between gap-1.5 border-b border-slate-100 bg-slate-50 overflow-x-auto">
          <span className="text-[11px] text-slate-600 font-mono font-bold shrink-0">
            {language === 'ta' ? 'மொழி:' : language === 'hi' ? 'भाषा:' : language === 'as' ? 'ভাষা:' : 'Speech Lang:'}
          </span>
          <div className="flex gap-1 overflow-x-auto py-0.5 scrollbar-none">
            {[
              { code: 'en' as AppLanguage, label: 'English' },
              { code: 'ta' as AppLanguage, label: 'தமிழ் (Tamil)' },
              { code: 'hi' as AppLanguage, label: 'हिन्दी (Hindi)' },
              { code: 'as' as AppLanguage, label: 'অসমীয়া (Assamese)' },
              { code: 'te' as AppLanguage, label: 'తెలుగు (Telugu)' },
              { code: 'bn' as AppLanguage, label: 'বাংলা (Bengali)' },
            ].map((item) => (
              <button
                key={item.code}
                onClick={() => {
                  onSetLanguage(item.code);
                  playFeedbackTone('start');
                  // Trigger greeting speech immediately
                  const greeting = getGreeting(item.code);
                  setSpokenResponse(greeting);
                  speakContent(greeting, item.code, `lang-switch-${item.code}-${Date.now()}`);
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  language === item.code
                    ? 'bg-emerald-600 text-white font-bold shadow-xs ring-2 ring-emerald-300'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Microphone Permission Status Banner */}
        {micPermissionState === 'denied' && (
          <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 flex items-center justify-between gap-2 text-xs text-amber-900">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-amber-700 text-sm shrink-0">mic_off</span>
              <span className="font-medium">Microphone access is currently blocked in browser.</span>
            </div>
            <button
              onClick={handleGrantMicPermission}
              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition-all shadow-xs"
            >
              Grant Access
            </button>
          </div>
        )}

        {/* Central Audio & Interactive Conversation Canvas */}
        <div className="p-4 sm:p-5 flex flex-col items-center gap-3.5 overflow-y-auto max-h-[60vh]">
          {/* Speaking Mode Selector: Tap to Speak vs Push & Hold */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full max-w-xs">
            <button
              onClick={() => setSpeakingMode('tap')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                speakingMode === 'tap'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-sm">touch_app</span>
              <span>Tap to Speak</span>
            </button>
            <button
              onClick={() => setSpeakingMode('hold')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                speakingMode === 'hold'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-sm">front_hand</span>
              <span>Push & Hold</span>
            </button>
          </div>

          {/* Main Large Glowing Mic Button with Live Audio Soundwave */}
          <div className="relative my-1 flex flex-col items-center">
            {/* Dynamic Wave Ring */}
            {isListening && (
              <div
                className="absolute -inset-4 rounded-full bg-red-400/30 animate-ping pointer-events-none"
                style={{ transform: `scale(${1 + audioLevel * 0.015})` }}
              />
            )}
            {isSpeaking && (
              <div className="absolute -inset-4 rounded-full bg-emerald-400/30 animate-pulse pointer-events-none" />
            )}

            <button
              id="btn-voice-assistant-mic"
              onClick={speakingMode === 'tap' ? handleToggleListening : undefined}
              onMouseDown={speakingMode === 'hold' ? handleHoldStart : undefined}
              onMouseUp={speakingMode === 'hold' ? handleHoldEnd : undefined}
              onTouchStart={speakingMode === 'hold' ? handleHoldStart : undefined}
              onTouchEnd={speakingMode === 'hold' ? handleHoldEnd : undefined}
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center relative z-10 transition-all shadow-xl select-none ${
                isListening
                  ? 'bg-red-600 text-white scale-105 shadow-red-600/30 ring-4 ring-red-300'
                  : isSpeaking
                  ? 'bg-emerald-600 text-white scale-105 shadow-emerald-600/30 ring-4 ring-emerald-300'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105 shadow-emerald-600/30 ring-4 ring-emerald-100 active:scale-95'
              }`}
            >
              <span className="material-symbols-outlined text-4xl">
                {isListening ? 'graphic_eq' : isSpeaking ? 'volume_up' : 'mic'}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider mt-0.5">
                {isListening
                  ? 'Listening...'
                  : isSpeaking
                  ? 'Speaking...'
                  : speakingMode === 'hold'
                  ? 'Hold to Talk'
                  : 'Tap to Talk'}
              </span>
            </button>

            {/* Audio Equalizer & Decibel Meter when listening */}
            {isListening && (
              <div className="flex flex-col items-center gap-1.5 mt-3">
                <div className="flex items-center gap-1">
                  {[12, 24, 16, 32, 20, 28, 14].map((h, i) => (
                    <span
                      key={i}
                      className="w-1.5 bg-red-500 rounded-full transition-all duration-75"
                      style={{
                        height: `${Math.max(6, (h * audioLevel) / 50)}px`,
                      }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-600">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>Mic Level: {audioLevel}% • Speak now in {language.toUpperCase()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Real-time Interim Captions (Shows what is heard word-by-word) */}
          {interimText && (
            <div className="w-full bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 text-xs font-mono text-amber-900 flex items-center gap-2 animate-fadeIn shadow-xs">
              <span className="material-symbols-outlined text-amber-700 text-sm animate-pulse">hearing</span>
              <span className="italic font-bold">Hearing: "{interimText}"...</span>
            </div>
          )}

          {/* Error notice if voice fails */}
          {voiceError && (
            <div className="w-full bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 flex items-start gap-2">
              <span className="material-symbols-outlined text-red-600 text-sm mt-0.5 shrink-0">info</span>
              <div className="flex flex-col gap-1">
                <span>{voiceError}</span>
                <span className="font-semibold text-red-900">
                  Tip: You can also type your question or tap any quick question below.
                </span>
              </div>
            </div>
          )}

          {/* Spoken Response AI Card */}
          <div className="w-full bg-emerald-50/90 border-2 border-emerald-200 rounded-2xl p-4 flex flex-col gap-2.5 shadow-sm">
            {activeQuery && (
              <div className="flex items-center gap-2 text-xs text-slate-700 font-mono pb-2 border-b border-emerald-200 font-semibold">
                <span className="material-symbols-outlined text-emerald-700 text-sm">record_voice_over</span>
                <span className="italic">Farmer: "{activeQuery}"</span>
              </div>
            )}

            <div className="flex items-start gap-2.5 pt-0.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <span className="material-symbols-outlined text-base">smart_toy</span>
              </div>
              <p className="text-slate-900 text-sm sm:text-base leading-relaxed font-medium">
                {spokenResponse}
              </p>
            </div>

            {/* Action Bar with Listen Again, Direct Navigation & Copy */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-200/70">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-800 font-bold">
                <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-emerald-600 animate-ping' : 'bg-slate-400'}`} />
                <span>{isSpeaking ? 'Agent Speaking...' : 'Audio Ready'}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {lastAnswer?.actionScreen && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigate(lastAnswer.actionScreen);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-all shadow-xs"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    <span>{lastAnswer.suggestedAction || 'Open'}</span>
                  </button>
                )}

                <button
                  onClick={() => speakContent(spokenResponse, language, 'modal-repeat')}
                  className="px-2.5 py-1 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-1 transition-all shadow-xs"
                  title="Listen again"
                >
                  <span className="material-symbols-outlined text-sm">volume_up</span>
                  <span>{language === 'ta' ? 'மீண்டும் கேள்' : language === 'hi' ? 'फिर सुनें' : 'Listen'}</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(spokenResponse);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  }}
                  className="px-2 py-1 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1 transition-all"
                  title="Copy response"
                >
                  <span className="material-symbols-outlined text-sm">
                    {isCopied ? 'check' : 'content_copy'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Typed Input Fallback (Allows typing questions seamlessly) */}
          <div className="w-full flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200 transition-all shadow-xs">
            <span className="material-symbols-outlined text-slate-400 text-lg ml-1.5">keyboard</span>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && textInput.trim()) {
                  processQuery(textInput);
                  setTextInput('');
                }
              }}
              placeholder={
                language === 'ta'
                  ? 'உங்கள் கேள்வியை தட்டச்சு செய்யவும்...'
                  : language === 'hi'
                  ? 'अपना प्रश्न यहाँ टाइप करें...'
                  : language === 'as'
                  ? 'আপোনাৰ প্ৰশ্ন লিখক...'
                  : 'Type your farming question here...'
              }
              className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 outline-hidden py-1 px-1 font-medium"
            />
            <button
              onClick={() => {
                if (textInput.trim()) {
                  processQuery(textInput);
                  setTextInput('');
                }
              }}
              disabled={!textInput.trim()}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs disabled:opacity-40 hover:bg-emerald-700 transition-all shrink-0"
            >
              Ask Agent
            </button>
          </div>

          {/* One-Tap Voice Prompt Chips for Low-Literacy Farmers */}
          <div className="w-full flex flex-col gap-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-emerald-800 font-extrabold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">touch_app</span>
                <span>
                  {language === 'ta'
                    ? 'விரைவு கேள்விகள் (தொட்டு கேட்கவும்):'
                    : language === 'hi'
                    ? 'त्वरित प्रश्न (टैप करें):'
                    : language === 'as'
                    ? 'দ্ৰুত প্ৰশ্নসমূহ (স্পৰ্শ কৰক):'
                    : 'Farmer Spoken Questions (1-Tap):'}
                </span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Tap chip to ask</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {quickQuestions.map((q) => {
                const label =
                  language === 'ta'
                    ? q.ta
                    : language === 'hi'
                    ? q.hi
                    : language === 'as'
                    ? q.as
                    : language === 'te'
                    ? q.te
                    : language === 'bn'
                    ? q.bn
                    : q.en;
                return (
                  <div
                    key={q.id}
                    className="w-full bg-slate-50 hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-300 rounded-xl p-2 flex items-center justify-between gap-2 transition-all group shadow-xs"
                  >
                    <button
                      onClick={() => processQuery(label)}
                      className="flex-1 text-left flex items-center gap-2.5 outline-hidden"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-base group-hover:scale-110 transition-transform">
                          {q.icon}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-900 line-clamp-1">
                        {label}
                      </span>
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => processQuery(label)}
                        className="px-2 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-[11px] font-bold flex items-center gap-1 transition-all"
                        title="Ask this question to Agent"
                      >
                        <span className="material-symbols-outlined text-xs">record_voice_over</span>
                        <span>Ask</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer with Voice Engine Status & Navigation Shortcut */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>CROPIQ Farm Voice Agent • Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
          >
            {language === 'ta' ? 'முடிந்தது' : language === 'hi' ? 'बंद करें' : language === 'as' ? 'বন্ধ কৰক' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};

