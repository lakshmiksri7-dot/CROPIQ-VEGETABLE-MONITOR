import React, { useState, useEffect } from 'react';
import { ASSETS } from '../../data/mockData';
import { BatchItem, ScreenId, StorageSilo, AppLanguage } from '../../types';
import { speakContent, stopSpeech, subscribeSpeechState } from '../../utils/speechUtils';

interface HomeScreenProps {
  batches: BatchItem[];
  silos: Record<string, StorageSilo>;
  language: AppLanguage;
  onNavigate: (screen: ScreenId) => void;
  onOpenAddBatch: () => void;
  onOpenLiveCamera: () => void;
  onOpenVoiceModal: () => void;
  onOpenQrScanner: () => void;
  onOpenInstallModal?: () => void;
  isSpeakerEnabled?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  batches,
  silos,
  language,
  onNavigate,
  onOpenAddBatch,
  onOpenLiveCamera,
  onOpenVoiceModal,
  onOpenQrScanner,
  onOpenInstallModal,
  isSpeakerEnabled = true
}) => {
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeSpeechState((speaking, textId) => {
      setActiveSpeakingId(speaking && textId ? textId : null);
    });
    return unsubscribe;
  }, []);

  const totalWeightKg = batches.reduce((acc, b) => acc + b.quantityKg, 0);
  const activeSilo = silos['unit-01'] || Object.values(silos)[0];
  const primaryBatch = batches[0];

  const isSafe = activeSilo.safetyStatus === 'SAFE';
  const isWarning = activeSilo.safetyStatus === 'WARNING';
  const isCritical = activeSilo.safetyStatus === 'CRITICAL';

  const handleSpeak = (e: React.MouseEvent, textEn: string, textHi: string, textAs: string, id: string) => {
    e.stopPropagation();
    const text = language === 'as' ? textAs : language === 'hi' ? textHi : textEn;
    speakContent(text, language, id);
  };

  const handleReadFullSummary = (e: React.MouseEvent) => {
    e.stopPropagation();
    const summaryEn = `CROPIQ Storage Overview. Your cold storage unit is SAFE at ${activeSilo.currentTemp} degrees Celsius and ${activeSilo.currentHumidity} percent humidity. Solar battery has ${activeSilo.estimatedBackupHours} hours of backup remaining. Total produce in storage is ${totalWeightKg} kilograms across ${batches.length} batches. Roma tomatoes are 91 percent fresh. Market recommendation is to transport to Guwahati Mandi for 44 rupees per kilogram.`;
    const summaryHi = `क्रॉप आईक्यू कोल्ड स्टोरेज विवरण। आपका कोल्ड स्टोरेज यूनिट ${activeSilo.currentTemp} डिग्री सेल्सियस और ${activeSilo.currentHumidity} प्रतिशत नमी पर पूरी तरह सुरक्षित है। सौर बैटरी में ${activeSilo.estimatedBackupHours} घंटे का बैकअप उपलब्ध है। कुल ${totalWeightKg} किलो उपज सुरक्षित है। टमाटर 91 प्रतिशत ताजे हैं। गुवाहाटी मंडी में 44 रुपये प्रति किलो का भाव मिल रहा है।`;
    const summaryAs = `ক্ৰপআইকিউ ক’ল্ড ষ্টোৰেজ অৱস্থা। আপোনাৰ ষ্টোৰেজ ইউনিট ${activeSilo.currentTemp} ডিগ্ৰী চেলচিয়াছ আৰু ${activeSilo.currentHumidity} শতাংশ আৰ্দ্ৰতাত সুৰক্ষিত আছে। সৌৰ বেটাৰীত ${activeSilo.estimatedBackupHours} ঘণ্টাৰ বেকআপ মজুত আছে। মুঠ ${totalWeightKg} কেজি শস্য মজুত আছে। বিলাহী ৯১ শতাংশ সতেজ। গুৱাহাটী মণ্ডিত ৪৪ টকাত বিক্ৰী কৰাৰ পৰামৰ্শ।`;
    const summaryTa = `CROPIQ சேமிப்பக சுருக்கம். உங்கள் குளிர் சேமிப்பு கூடம் ${activeSilo.currentTemp} டிகிரி செல்சியஸ் மற்றும் ${activeSilo.currentHumidity} சதவீத ஈரப்பதத்தில் பாதுகாப்பாக உள்ளது. சூரிய மின்கலனில் ${activeSilo.estimatedBackupHours} மணிநேர காப்பு உள்ளது. மொத்தம் ${totalWeightKg} கிலோ பயிர் சேமிக்கப்பட்டுள்ளது. தக்காளி 91 சதவீதம் புத்துணர்ச்சியுடன் உள்ளது. சந்தை விலை 44 ரூபாய்.`;
    const summaryTe = `CROPIQ నిల్వ సారాంశం. మీ కోల్డ్ స్టోరేజ్ యూనిట్ ${activeSilo.currentTemp} డిగ్రీల సెల్సియస్ మరియు ${activeSilo.currentHumidity} శాతం తేమతో సురక్షితంగా ఉంది. సోలార్ బ్యాటరీలో ${activeSilo.estimatedBackupHours} గంటల బ్యాకప్ ఉంది. మొత్తం ${totalWeightKg} కిలోల పంట నిల్వ చేయబడింది. టమాటాలు 91 శాతం తాజాగా ఉన్నాయి. మార్కెట్ ధర ₹44 గా ఉంది.`;
    const summaryBn = `CROPIQ স্টোরেজ বিবরণ। আপনার কোল্ড স্টোরেজ ইউনিট ${activeSilo.currentTemp} ডিগ্রি সেলসিয়াস এবং ${activeSilo.currentHumidity} শতাংশ আর্দ্রতায় সম্পূর্ণ নিরাপদ। সৌর ব্যাটারিতে ${activeSilo.estimatedBackupHours} ঘণ্টার ব্যাকআপ রয়েছে। মোট ${totalWeightKg} কেজি ফসল সংগৃহীত আছে। টমেটো ৯১ শতাংশ সতেজ। পাইকারি বাজার দর ₹৪৪।`;

    let textToSpeak = summaryEn;
    if (language === 'ta') textToSpeak = summaryTa;
    else if (language === 'te') textToSpeak = summaryTe;
    else if (language === 'bn') textToSpeak = summaryBn;
    else if (language === 'hi') textToSpeak = summaryHi;
    else if (language === 'as') textToSpeak = summaryAs;

    speakContent(textToSpeak, language, 'home-full-summary');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 flex flex-col gap-4">
      {/* 1. Offline-First Synchronization Status Bar */}
      <div className="w-full bg-white rounded-2xl border border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs font-mono shadow-xs">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isOfflineMode ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'
            }`}
          />
          <span className="text-slate-700 font-medium">
            {isOfflineMode
              ? (language === 'as' ? 'অফলাইন – অন্তিম সিঙ্ক ১৫ মিনিট আগতে' : language === 'hi' ? 'ऑफलाइन – अंतिम सिंक 15 मिनट पहले' : 'Offline – Last synchronized 15 mins ago')
              : (language === 'as' ? 'অনলাইন • লাইভ এআই ক্লাউড সিঙ্ক সক্রিয়' : language === 'hi' ? 'ऑनलाइन • लाइव एआई क्लाउड सिंक' : 'Online • Real-Time Edge & Cloud Sync Active')}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Speak Summary Button ⭐ */}
          <button
            onClick={handleReadFullSummary}
            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg border transition-all ${
              activeSpeakingId === 'home-full-summary'
                ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
            title="Read Complete Storage Briefing Aloud"
          >
            <span className="material-symbols-outlined text-[15px]">
              {activeSpeakingId === 'home-full-summary' ? 'graphic_eq' : 'volume_up'}
            </span>
            <span className="hidden xs:inline">
              {activeSpeakingId === 'home-full-summary' ? 'Speaking...' : 'Audio Briefing'}
            </span>
          </button>

          <button
            onClick={() => setIsOfflineMode(!isOfflineMode)}
            className="text-[11px] text-slate-500 hover:text-emerald-700 underline underline-offset-2 flex items-center gap-1"
          >
            <span>{isOfflineMode ? 'Connect' : 'Simulate Offline'}</span>
            <span className="material-symbols-outlined text-xs">
              {isOfflineMode ? 'wifi' : 'wifi_off'}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Voice-First Farmer Interface Banner ⭐ */}
      <section
        id="btn-voice-mode"
        onClick={onOpenVoiceModal}
        className="w-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 rounded-3xl border border-emerald-500 p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer shadow-lg shadow-emerald-900/10 hover:shadow-emerald-900/20 active:scale-[0.99] transition-all group text-white"
      >
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white text-emerald-700 flex flex-col items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-3xl animate-pulse">mic</span>
            <span className="text-[8px] font-extrabold uppercase tracking-wider text-emerald-800">VOICE AI</span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-emerald-200">
                Voice-First Farmer Interface
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-mono font-bold">
                தமிழ் • অসমীয়া • हिन्दी • EN
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold tracking-tight mt-0.5">
              {language === 'ta'
                ? 'பேசவும்: "என் தக்காளி நிலை எப்படி உள்ளது?"'
                : language === 'as'
                ? 'কথা পাতক: "মোৰ বিলাহী কেনেকুৱা আছে?"'
                : language === 'hi'
                ? 'बोलकर पूछें: "मेरे टमाटर की स्थिति कैसी है?"'
                : 'Tap to Speak: "What is my tomato condition?"'}
            </h3>
            <p className="text-xs text-emerald-100 mt-0.5">
              Spoken advice for crop freshness, solar battery & mandi dispatch
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 bg-white text-emerald-800 px-3.5 py-2 rounded-xl font-bold text-xs group-hover:bg-emerald-50 transition-colors shrink-0 shadow-sm">
          <span>Speak Now</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </div>
      </section>

      {/* 3. Five Core Questions Farmer Decision HUD ⭐ */}
      <section className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">psychology</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {language === 'as' ? 'কৃষক সিদ্ধান্ত কেন্দ্ৰ (৫টা মূল প্ৰশ্ন)' : language === 'hi' ? 'किसान निर्णय केंद्र (5 मुख्य प्रश्न)' : '5 Core Farmer Decision HUD'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Click speaker on any card to hear answers spoken aloud
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isSafe
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : isWarning
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-red-100 text-red-800 border border-red-300 animate-pulse'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isSafe ? 'bg-emerald-600' : isWarning ? 'bg-amber-600' : 'bg-red-600'}`} />
            <span>{isSafe ? 'STORAGE SAFE' : isWarning ? 'WARNING TEMP' : 'CRITICAL ALERT'}</span>
          </span>
        </div>

        {/* 5 Core Question Answer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* Q1: Is my produce safe? */}
          <div
            onClick={() => onNavigate('storage')}
            className="bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 flex flex-col justify-between gap-2 cursor-pointer transition-all group relative"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-emerald-800 font-bold">
                1. Is Produce Safe?
              </span>
              <button
                onClick={(e) =>
                  handleSpeak(
                    e,
                    "Your produce is safe. Cold room is at 8.5 degrees Celsius and 84 percent humidity. Freshness is 91 percent.",
                    "आपकी फसल सुरक्षित है। कोल्ड रूम 8.5 डिग्री और 84 प्रतिशत नमी पर है।",
                    "আপোনাৰ শস্য সুৰক্ষিত আছে। ক’ল্ড ৰূম ৮.৫ ডিগ্ৰী চেলচিয়াছত চলি আছে।",
                    'hud-q1'
                  )
                }
                className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
                  activeSpeakingId === 'hud-q1'
                    ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
                    : 'bg-white text-emerald-700 border-slate-200 hover:bg-emerald-100'
                }`}
                title="Hear Answer Aloud"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {activeSpeakingId === 'hud-q1' ? 'graphic_eq' : 'volume_up'}
                </span>
              </button>
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-xl">check_circle</span>
                YES • 91% Fresh
              </span>
              <p className="text-xs text-slate-600 mt-0.5">
                Chamber at 8.5°C & 84% RH. Zero spoilage risk detected.
              </p>
            </div>
          </div>

          {/* Q2: How long can I store it? */}
          <div
            onClick={() => onNavigate('freshness')}
            className="bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 flex flex-col justify-between gap-2 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-emerald-800 font-bold">
                2. Storage Days
              </span>
              <button
                onClick={(e) =>
                  handleSpeak(
                    e,
                    "You can store this produce safely for 4 more days without loss of quality.",
                    "आप इस फसल को 4 और दिनों तक सुरक्षित रख सकते हैं।",
                    "আপুনি এই শস্য আৰু ৪ দিন সুৰক্ষিতভাৱে ৰাখিব পাৰিব।",
                    'hud-q2'
                  )
                }
                className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
                  activeSpeakingId === 'hud-q2'
                    ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
                    : 'bg-white text-emerald-700 border-slate-200 hover:bg-emerald-100'
                }`}
                title="Hear Answer Aloud"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {activeSpeakingId === 'hud-q2' ? 'graphic_eq' : 'volume_up'}
                </span>
              </button>
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-xl">calendar_month</span>
                4 Days Safe
              </span>
              <p className="text-xs text-slate-600 mt-0.5">
                Optimal chilling window extends marketable shelf-life.
              </p>
            </div>
          </div>

          {/* Q3: Will it spoil soon? */}
          <div
            onClick={() => onNavigate('ai-quality')}
            className="bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 flex flex-col justify-between gap-2 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-emerald-800 font-bold">
                3. Spoilage Risk
              </span>
              <button
                onClick={(e) =>
                  handleSpeak(
                    e,
                    "Spoilage risk is very low at 4 percent. AI camera verified firm skin and green stems.",
                    "खराब होने का जोखिम बहुत कम है, केवल 4 प्रतिशत।",
                    "শস্য নষ্ট হোৱাৰ সম্ভাৱনা মাত্ৰ ৪ শতাংশ। অতি সুৰক্ষিত।",
                    'hud-q3'
                  )
                }
                className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
                  activeSpeakingId === 'hud-q3'
                    ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
                    : 'bg-white text-emerald-700 border-slate-200 hover:bg-emerald-100'
                }`}
                title="Hear Answer Aloud"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {activeSpeakingId === 'hud-q3' ? 'graphic_eq' : 'volume_up'}
                </span>
              </button>
            </div>
            <div>
              <span className="text-lg font-bold text-emerald-700 font-mono flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-xl">verified_user</span>
                LOW RISK (4%)
              </span>
              <p className="text-xs text-slate-600 mt-0.5">
                AI Vision verified: intact calyx, zero mold spotted.
              </p>
            </div>
          </div>

          {/* Q4: When to transport/sell? */}
          <div
            onClick={() => onNavigate('market')}
            className="bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 flex flex-col justify-between gap-2 cursor-pointer transition-all group sm:col-span-2 md:col-span-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-emerald-800 font-bold">
                4. Transport Recommendation & Market Price
              </span>
              <button
                onClick={(e) =>
                  handleSpeak(
                    e,
                    "Recommendation: Transport today to Guwahati Pamohi Mandi. Price is 44 rupees per kg with 15 percent price surge. Best dispatch window is before 10 AM.",
                    "सिफारिश: आज गुवाहाटी पमोही मंडी भेजें। 44 रुपये प्रति किलो का भाव मिल रहा है।",
                    "পৰামৰ্শ: আজি গুৱাহাটী পামহী মণ্ডিলৈ পঠিয়াওক। প্ৰতি কেজিত ৪৪ টকা দৰ পাব।",
                    'hud-q4'
                  )
                }
                className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
                  activeSpeakingId === 'hud-q4'
                    ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
                    : 'bg-white text-emerald-700 border-slate-200 hover:bg-emerald-100'
                }`}
                title="Hear Answer Aloud"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {activeSpeakingId === 'hud-q4' ? 'graphic_eq' : 'volume_up'}
                </span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-emerald-800 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-600 text-xl">local_shipping</span>
                  TRANSPORT TODAY (Guwahati Mandi)
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  ₹44/kg rate (+15% surge). Best dispatch window is tomorrow before 10 AM.
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shrink-0 font-mono shadow-xs">
                ₹44/KG
              </span>
            </div>
          </div>

          {/* Q5: Storage operating efficiently? */}
          <div
            onClick={() => onNavigate('energy')}
            className="bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 flex flex-col justify-between gap-2 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-emerald-800 font-bold">
                5. System Efficiency
              </span>
              <button
                onClick={(e) =>
                  handleSpeak(
                    e,
                    "Storage is operating at 100 percent solar power. Battery backup has 6.5 hours remaining. PCM thermal reserve is 92 percent full.",
                    "कोल्ड स्टोरेज 100 प्रतिशत सौर ऊर्जा पर चल रहा है। बैटरी बैकअप 6.5 घंटे का है।",
                    "ষ্টোৰেজ ১০০ শতাংশ সৌৰ শক্তিত চলি আছে। বেটাৰীত ৬.৫ ঘণ্টাৰ শক্তি আছে।",
                    'hud-q5'
                  )
                }
                className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
                  activeSpeakingId === 'hud-q5'
                    ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
                    : 'bg-white text-emerald-700 border-slate-200 hover:bg-emerald-100'
                }`}
                title="Hear Answer Aloud"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {activeSpeakingId === 'hud-q5' ? 'graphic_eq' : 'volume_up'}
                </span>
              </button>
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-xl">solar_power</span>
                100% SOLAR • 6.5h
              </span>
              <p className="text-xs text-slate-600 mt-0.5">
                PCM reserve 92% charged. Zero grid draw.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Telemetry Status Bento Grid (White & Green Theme) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
        {/* Temperature */}
        <div
          onClick={() => onNavigate('storage')}
          className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all shadow-xs"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-800 font-bold">
              TEMP
            </span>
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[9px] px-2 py-0.5 rounded-full uppercase font-bold">
              AUTO COOL
            </span>
          </div>

          <div className="my-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tighter font-mono">
              {activeSilo.currentTemp}
              <span className="text-xl font-light text-slate-500 ml-1">°C</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Target</span>
            <span className="text-emerald-700 font-mono font-bold text-[11px]">{activeSilo.targetTempRange}</span>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-100">
            <div className="h-full bg-emerald-500 w-[45%]" />
          </div>
        </div>

        {/* Humidity */}
        <div
          onClick={() => onNavigate('storage')}
          className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all shadow-xs"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-800 font-bold">
              HUMIDITY
            </span>
            <span className="material-symbols-outlined text-emerald-600 text-base">water_drop</span>
          </div>

          <div className="my-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tighter font-mono">
              {activeSilo.currentHumidity}
              <span className="text-xl font-light text-slate-500 ml-1">%</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Target Range</span>
            <span className="text-slate-800 font-mono font-bold text-[11px]">{activeSilo.targetHumidityRange}</span>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-100">
            <div className="h-full bg-emerald-500 w-[84%]" />
          </div>
        </div>

        {/* Solar Battery & Estimated Backup */}
        <div
          onClick={() => onNavigate('energy')}
          className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all shadow-xs"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-800 font-bold">
              BATTERY
            </span>
            <span className="bg-emerald-100 text-emerald-800 font-mono text-[9px] px-2 py-0.5 rounded-full uppercase font-bold">
              {activeSilo.estimatedBackupHours}H BACKUP
            </span>
          </div>

          <div className="my-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tighter font-mono">
              {activeSilo.batteryBackupPercent}
              <span className="text-xl font-light text-slate-500 ml-1">%</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>LiFePO4 Health</span>
            <span className="text-emerald-700 font-mono font-bold text-[11px]">SoH {activeSilo.batteryHealthSoH}%</span>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-100">
            <div className="h-full bg-emerald-500 w-[76%]" />
          </div>
        </div>

        {/* Door Intelligence & Sensor */}
        <div
          onClick={() => onNavigate('storage')}
          className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all shadow-xs"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-800 font-bold">
              DOOR SENSOR
            </span>
            <span className="material-symbols-outlined text-emerald-600 text-base">sensor_door</span>
          </div>

          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-mono">
              {activeSilo.doorStatus}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Opened Today</span>
            <span className="text-emerald-700 font-mono font-bold text-[11px]">{activeSilo.doorOpenCountToday} times</span>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-100">
            <div className="h-full bg-emerald-500 w-[100%]" />
          </div>
        </div>
      </section>

      {/* 5. Weather-Aware Solar Optimization Notice */}
      <section className="bg-emerald-50 border border-emerald-200 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shrink-0">
            <span className="material-symbols-outlined text-2xl">sunny</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-950">Weather-Aware Solar Management Active</h4>
            <p className="text-xs text-emerald-800/80">
              {activeSilo.weatherNotice} • PCM thermal reservoir pre-chilled
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('energy')}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shrink-0 hover:bg-emerald-700 transition-all font-mono shadow-xs"
        >
          Energy Flow
        </button>
      </section>

      {/* 6. Advanced Farmer Action Cards (2x4 Grid) */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full">
        {/* GPS Live Map Tracking ⭐ */}
        <button
          id="btn-map-locations"
          onClick={() => onNavigate('map-locations')}
          className="bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 font-semibold text-xs sm:text-sm py-3.5 px-3 rounded-2xl active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1.5 min-h-[72px] shadow-xs"
        >
          <span className="material-symbols-outlined text-2xl text-emerald-600">map</span>
          <span className="font-bold">Live Map & Transit</span>
        </button>

        {/* Cooperative Hub Multi-Unit */}
        <button
          id="btn-cooperative-mode"
          onClick={() => onNavigate('cooperative')}
          className="bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 font-semibold text-xs sm:text-sm py-3.5 px-3 rounded-2xl active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1.5 min-h-[72px] shadow-xs"
        >
          <span className="material-symbols-outlined text-2xl text-emerald-600">hub</span>
          <span>Cooperative Units</span>
        </button>

        {/* AI Visual Quality Check */}
        <button
          id="btn-ai-quality"
          onClick={() => onNavigate('ai-quality')}
          className="bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 font-semibold text-xs sm:text-sm py-3.5 px-3 rounded-2xl active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1.5 min-h-[72px] shadow-xs"
        >
          <span className="material-symbols-outlined text-2xl text-emerald-600">photo_camera</span>
          <span>AI Visual Check</span>
        </button>

        {/* QR Batch Scanner */}
        <button
          id="btn-qr-scan"
          onClick={onOpenQrScanner}
          className="bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 font-semibold text-xs sm:text-sm py-3.5 px-3 rounded-2xl active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1.5 min-h-[72px] shadow-xs"
        >
          <span className="material-symbols-outlined text-2xl text-emerald-600">qr_code_scanner</span>
          <span>QR Batch Pass</span>
        </button>

        {/* Harvest-to-Market Timeline */}
        <button
          id="btn-timeline"
          onClick={() => onNavigate('timeline')}
          className="bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 font-semibold text-xs sm:text-sm py-3.5 px-3 rounded-2xl active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1.5 min-h-[72px] shadow-xs"
        >
          <span className="material-symbols-outlined text-2xl text-emerald-600">timeline</span>
          <span>Harvest Timeline</span>
        </button>

        {/* Market Decision */}
        <button
          id="btn-market-readiness"
          onClick={() => onNavigate('market')}
          className="bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 font-semibold text-xs sm:text-sm py-3.5 px-3 rounded-2xl active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1.5 min-h-[72px] shadow-xs"
        >
          <span className="material-symbols-outlined text-2xl text-emerald-600">trending_up</span>
          <span>Mandi Decisions</span>
        </button>

        {/* Emergency Mode */}
        <button
          id="btn-emergency-mode"
          onClick={() => onNavigate('emergency')}
          className="bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 font-semibold text-xs sm:text-sm py-3.5 px-3 rounded-2xl active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1.5 min-h-[72px] shadow-xs"
        >
          <span className="material-symbols-outlined text-2xl text-red-600">emergency</span>
          <span>Emergency Mode</span>
        </button>

        {/* Add Batch */}
        <button
          id="btn-add-batch-quick"
          onClick={onOpenAddBatch}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3.5 px-3 rounded-2xl active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1.5 min-h-[72px] shadow-md shadow-emerald-600/20"
        >
          <span className="material-symbols-outlined text-2xl">add_circle</span>
          <span>Add Batch</span>
        </button>
      </section>

      {/* 7. Live Camera Feed Card */}
      <section
        id="home-live-feed-card"
        onClick={onOpenLiveCamera}
        className="w-full h-52 sm:h-60 rounded-3xl overflow-hidden relative border border-slate-200 cursor-pointer group bg-slate-900 shadow-sm"
      >
        <img
          src={ASSETS.crateTomatoesInColdRoom}
          alt="Close up photography of fresh vibrant tomatoes in green crates in modern cold room"
          className="w-full h-full object-cover object-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />

        <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-400 font-bold block mb-1">
              Live Cold Room Sensor Feed
            </span>
            <p className="text-slate-300 text-xs font-mono mb-0.5">
              Updated Real-Time • {activeSilo.name}
            </p>
            <h4 className="text-white text-lg sm:text-xl font-bold">
              {primaryBatch ? `${primaryBatch.crop} (${primaryBatch.variety})` : 'Active Stored Produce'}
            </h4>
          </div>

          <span className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-2xl flex items-center gap-2 border border-emerald-400 shadow-md">
            <span className="material-symbols-outlined text-[16px] animate-pulse">
              videocam
            </span>
            <span>Live Camera</span>
          </span>
        </div>
      </section>

      {/* 8. Install CROPIQ Banner */}
      {onOpenInstallModal && (
        <section
          onClick={onOpenInstallModal}
          className="bg-white border border-emerald-200 hover:border-emerald-400 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer active:scale-[0.99] transition-all group shadow-xs"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 overflow-hidden flex items-center justify-center p-0.5 shrink-0">
              <img
                src="/icon-192.png"
                alt="CROPIQ App Icon"
                className="w-full h-full object-cover rounded-[12px]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                Install CROPIQ Mobile PWA
              </h4>
              <p className="text-[11px] text-slate-500 font-mono">
                Official Green Leaf-Circuit App Icon & Offline Edge Storage Support
              </p>
            </div>
          </div>
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-[11px] font-mono uppercase tracking-wider shrink-0 hidden sm:inline-block shadow-xs">
            Install
          </span>
        </section>
      )}
    </div>
  );
};

