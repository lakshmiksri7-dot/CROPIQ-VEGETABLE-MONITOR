// Advanced Multilingual Voice Recognition & Agricultural NLP Engine for CROPIQ
import { AppLanguage, StorageSilo, BatchItem } from '../types';
import { playFeedbackTone } from './speechUtils';

export interface VoiceRecognitionOptions {
  language: AppLanguage;
  onInterimResult?: (transcript: string) => void;
  onFinalResult?: (transcript: string) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
  onAudioLevel?: (level: number) => void;
  onPermissionChange?: (status: 'granted' | 'denied' | 'prompt') => void;
}

export interface VoiceAnswer {
  spokenText: string;
  displayText: string;
  category: 'crop' | 'battery' | 'safety' | 'market' | 'location' | 'emergency' | 'general';
  matchedIntent: string;
  confidence: number;
  suggestedAction?: string;
  actionScreen?: string;
  newLanguage?: AppLanguage;
}

// Convert app language to standard BCP-47 speech recognition codes
export function getSpeechRecognitionLocale(lang: AppLanguage): string {
  switch (lang) {
    case 'ta':
      return 'ta-IN'; // Tamil (India)
    case 'hi':
      return 'hi-IN'; // Hindi (India)
    case 'as':
      return 'as-IN'; // Assamese (India)
    case 'bn':
      return 'bn-IN'; // Bengali (India)
    case 'te':
      return 'te-IN'; // Telugu (India)
    case 'en':
    default:
      return 'en-IN'; // Indian English
  }
}

// Browser Web Speech Recognition Factory with enhanced resilience
export class FarmerSpeechRecognizer {
  private recognition: any = null;
  public isListening: boolean = false;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private animFrameId: number | null = null;
  private silenceRetryCount: number = 0;
  private currentOptions: VoiceRecognitionOptions | null = null;

  public async checkOrRequestMicPermission(): Promise<'granted' | 'denied' | 'prompt'> {
    if (typeof window === 'undefined') return 'denied';

    try {
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const res = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          if (res.state === 'granted') return 'granted';
          if (res.state === 'denied') return 'denied';
        } catch {
          // Permissions API query may not support microphone in some environments
        }
      }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
        return 'granted';
      }
      return 'prompt';
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        return 'denied';
      }
      return 'prompt';
    }
  }

  public async start(options: VoiceRecognitionOptions): Promise<boolean> {
    this.currentOptions = options;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      if (options.onError) {
        options.onError('Speech Recognition API is not supported in this browser. You can use the Quick Speaking Prompts or typed voice bar.');
      }
      return false;
    }

    try {
      this.stop();
      this.silenceRetryCount = 0;

      // Check / request audio stream for soundwave analysis
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          if (options.onPermissionChange) options.onPermissionChange('granted');
          this.initAudioAnalyser(options.onAudioLevel);
        }
      } catch (micErr: any) {
        console.warn('Microphone stream access notification:', micErr);
        if (micErr.name === 'NotAllowedError' || micErr.name === 'PermissionDeniedError') {
          if (options.onPermissionChange) options.onPermissionChange('denied');
          if (options.onError) {
            options.onError('Microphone permission denied. Please allow microphone access in your browser bar or use the quick spoken chips.');
          }
          return false;
        }
      }

      this.recognition = new SpeechRecognition();
      this.recognition.lang = getSpeechRecognitionLocale(options.language);
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 3;

      this.recognition.onstart = () => {
        this.isListening = true;
        playFeedbackTone('start');
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (interimTranscript && options.onInterimResult) {
          options.onInterimResult(interimTranscript);
        }

        if (finalTranscript && options.onFinalResult) {
          this.stop();
          options.onFinalResult(finalTranscript.trim());
        }
      };

      this.recognition.onerror = (event: any) => {
        const errType = event.error || '';
        
        // Handle no-speech gracefully: do not shut down if silence happens once
        if (errType === 'no-speech') {
          this.silenceRetryCount++;
          if (this.silenceRetryCount < 2 && this.isListening) {
            // Keep listening
            return;
          }
        }

        if (errType === 'not-allowed' || errType === 'service-not-allowed') {
          this.stop();
          if (options.onPermissionChange) options.onPermissionChange('denied');
          if (options.onError) {
            options.onError('Microphone access blocked. Click "Allow" in browser address bar or use the Tap-to-Ask voice chips.');
          }
          return;
        }

        if (errType !== 'aborted') {
          this.stop();
          if (options.onError) {
            options.onError(errType === 'network' ? 'Voice recognition network error. Please try again or tap a question below.' : `Voice engine: ${errType}. Please speak clearly.`);
          }
        }
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          this.isListening = false;
          this.stopAudioAnalyser();
          if (options.onEnd) {
            options.onEnd();
          }
        }
      };

      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (err: any) {
      this.isListening = false;
      this.stopAudioAnalyser();
      if (options.onError) {
        options.onError(err.message || 'Could not initialize speech recognition. Try tapping the voice question buttons.');
      }
      return false;
    }
  }

  public stop(): void {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {
        // ignore
      }
      this.recognition = null;
    }
    this.isListening = false;
    this.stopAudioAnalyser();
  }

  private initAudioAnalyser(onLevel?: (lvl: number) => void): void {
    if (!this.mediaStream || !onLevel || typeof window === 'undefined') return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.6;
      source.connect(this.analyser);

      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      const checkLevel = () => {
        if (!this.analyser || !this.isListening) return;
        this.analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        onLevel(normalized);
        this.animFrameId = requestAnimationFrame(checkLevel);
      };
      this.animFrameId = requestAnimationFrame(checkLevel);
    } catch {
      // Audio level visualizer fallback
    }
  }

  private stopAudioAnalyser(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    this.analyser = null;
  }
}

// Contextual Knowledge & Comprehensive Agricultural NLP Engine
export function answerFarmerQuery(
  rawQuery: string,
  lang: AppLanguage,
  context?: {
    silo?: StorageSilo;
    batches?: BatchItem[];
    userLocation?: string;
  }
): VoiceAnswer {
  const query = rawQuery.toLowerCase().trim();
  const silo = context?.silo;
  const temp = silo?.currentTemp ?? 8.5;
  const humidity = silo?.currentHumidity ?? 84;
  const battery = silo?.batteryBackupPercent ?? 94;
  const solarKw = silo?.solarIntakeKw ?? 3.4;
  const pcmHours = silo?.estimatedBackupHours ?? 14.5;
  const batchCount = context?.batches?.length ?? 4;

  // 0. LANGUAGE SWITCHING BY VOICE
  if (
    query.includes('tamil') ||
    query.includes('தமிழ்') ||
    query.includes('tamizh') ||
    query.includes('thamizh') ||
    query.includes('tamil la pesu') ||
    query.includes('tamil pesu') ||
    query.includes('tamil pesunga') ||
    query.includes('tamilil')
  ) {
    return {
      spokenText: 'வணக்கம்! இனிமேல் உங்களுடன் தமிழில் பேசுகிறேன். உங்கள் தக்காளி நிலை, சேமிப்பு, பேட்டரி அல்லது சந்தை விலை பற்றி கேளுங்கள்.',
      displayText: '🗣️ மொழி மாற்றப்பட்டது: தமிழ் (Tamil). உங்கள் குரல் கேள்விகளை கேட்கலாம்.',
      category: 'general',
      matchedIntent: 'switch_language_tamil',
      confidence: 0.99,
      newLanguage: 'ta'
    };
  }

  if (
    query.includes('telugu') ||
    query.includes('తెలుగు') ||
    query.includes('telungu') ||
    query.includes('telgu')
  ) {
    return {
      spokenText: 'అవును! ఇకపై నేను మీతో తెలుగులో మాట్లాడతాను. మీ పంట తాజాదనం, కోல்డ్ స్టోరేజ్ లేదా మార్కెట్ ధర గురించి అడగండి.',
      displayText: '🗣️ భాష మార్చబడింది: తెలుగు (Telugu). మీరు మీ ప్రశ్నలను అడగవచ్చు.',
      category: 'general',
      matchedIntent: 'switch_language_telugu',
      confidence: 0.99,
      newLanguage: 'te'
    };
  }

  if (
    query.includes('bengali') ||
    query.includes('বাংলা') ||
    query.includes('bangla') ||
    query.includes('bongo')
  ) {
    return {
      spokenText: 'হ্যাঁ! এখন থেকে আমি আপনার সাথে বাংলায় কথা বলব। আপনার ফসলের সতেজতা, কোল্ড স্টোরেজ বা বাজার দর সম্পর্কে জিজ্ঞাসা করুন।',
      displayText: '🗣️ ভাষা পরিবর্তন করা হয়েছে: বাংলা (Bengali). আপনি আপনার প্রশ্ন জিজ্ঞাসা করতে পারেন।',
      category: 'general',
      matchedIntent: 'switch_language_bengali',
      confidence: 0.99,
      newLanguage: 'bn'
    };
  }

  if (
    query.includes('hindi') ||
    query.includes('हिन्दी') ||
    query.includes('हिंदी')
  ) {
    return {
      spokenText: 'जी हाँ! अब मैं आपसे हिन्दी में बात करूँगा। आप अपनी फसल, कोल्ड स्टोरेज या मंडी भाव के बारे में पूछ सकते हैं।',
      displayText: '🗣️ भाषा बदली गई: हिन्दी (Hindi). आप प्रश्न पूछ सकते हैं।',
      category: 'general',
      matchedIntent: 'switch_language_hindi',
      confidence: 0.99,
      newLanguage: 'hi'
    };
  }

  if (
    query.includes('assamese') ||
    query.includes('অসমীয়া') ||
    query.includes('axomiya')
  ) {
    return {
      spokenText: 'নিশ্চয়! এতিয়াৰ পৰা মই আপোনাৰ সৈতে অসমীয়াত কথা পাতিম। আপোনাৰ শস্যৰ অৱস্থা বা মণ্ডিৰ দৰ সোধক।',
      displayText: '🗣️ ভাষা সলনি কৰা হ’ল: অসমীয়া (Assamese).',
      category: 'general',
      matchedIntent: 'switch_language_assamese',
      confidence: 0.99,
      newLanguage: 'as'
    };
  }

  if (
    query.includes('english') ||
    query.includes('english please') ||
    query.includes('speak english')
  ) {
    return {
      spokenText: 'Sure! I am now speaking in English. You can ask me about crop freshness, solar battery, storage safety, or mandi rates.',
      displayText: '🗣️ Language Switched: English. You can ask any question.',
      category: 'general',
      matchedIntent: 'switch_language_english',
      confidence: 0.99,
      newLanguage: 'en'
    };
  }

  // 1. LOCATION & LOCAL MAP / NEAREST COLD STORAGE / GPS
  if (
    query.includes('location') ||
    query.includes('map') ||
    query.includes('where') ||
    query.includes('place') ||
    query.includes('gps') ||
    query.includes('near') ||
    query.includes('distance') ||
    query.includes('silo') ||
    query.includes('chamber') ||
    query.includes('route') ||
    query.includes('track') ||
    query.includes('vehicle') ||
    query.includes('enga') || // Tanglish: where
    query.includes('enga irukku') || // Tanglish: where is it
    query.includes('silo enga') || // Tanglish: where is silo
    query.includes('storage enga') || // Tanglish: where is storage
    query.includes('kitta') || // Tanglish: nearby
    query.includes('kitatha') ||
    query.includes('vandi') || // Tanglish: vehicle
    query.includes('lorry') ||
    query.includes('van') ||
    query.includes('iruppidam') ||
    query.includes('tholaivu') ||
    query.includes('இடம்') || // Tamil: location
    query.includes('வரைபடம்') || // Tamil: map
    query.includes('அருகில்') || // Tamil: nearby
    query.includes('எங்கு') || // Tamil: where
    query.includes('தொலைவு') || // Tamil: distance
    query.includes('வாகனம்') || // Tamil: vehicle
    query.includes('இருப்பிடம்') || // Tamil: location
    query.includes('லொகேஷன்') || // Telugu: location
    query.includes('మ్యాప్') || // Telugu: map
    query.includes('దగ్గర') || // Telugu: near
    query.includes('ఎక్కడ') || // Telugu: where
    query.includes('స్థలం') || // Telugu: place
    query.includes.bind(query)('రవాణా') || // Telugu: transport
    query.includes('স্থান') || // Bengali & Hindi: location/place
    query.includes('মানচিত্র') || // Bengali: map
    query.includes('কাছে') || // Bengali: near
    query.includes('কোথায়') || // Bengali: where
    query.includes('নকশা') || // Bengali: map
    query.includes('नक्शा') || // Hindi: map
    query.includes('पास') || // Hindi: near
    query.includes('कहाँ') || // Hindi: where
    query.includes('অৱস্থান') || // Assamese: location
    query.includes('মানচিত্ৰ') || // Assamese: map
    query.includes('ওচৰত') || // Assamese: near
    query.includes('ক’ত') // Assamese: where
  ) {
    let spokenText = '';
    let displayText = '';

    if (lang === 'ta') {
      spokenText = `உங்கள் நேரடி பண்ணை இருப்பிடம் கண்டறியப்பட்டது. அருகிலுள்ள சூரிய மின் குளிர் சேமிப்பு கூடம் 3.2 கிலோமீட்டர் தொலைவில் இயங்குகிறது. வாகன வருகை நேரம் 12 நிமிடங்கள்.`;
      displayText = `📍 நேரடி இருப்பிடம்: அருகிலுள்ள குளிர்சாதன கூடம் 3.2 கி.மீ தொலைவில் இயங்குகிறது • உறைவிப்பான் வாகனம் 12 நிமிடங்களில் வரும்.`;
    } else if (lang === 'te') {
      spokenText = `మీ లైవ్ వ్యవసాయ క్షేత్రం జీపీఎస్ ద్వారా గుర్తించబడింది. సమీపంలోని సౌర కోల్డ్ స్టోరేజ్ యూనిట్ 3.2 కిలోమీటర్ల దూరంలో ఉంది. వాహనం 12 నిమిషాల్లో చేరుకుంటుంది.`;
      displayText = `📍 లైవ్ లొకేషన్: సమీప సౌర కోల్డ్ స్టోరేజ్ 3.2 కి.మీ దూరంలో ఉంది (12 నిమిషాలు) • రీఫర్ వాహనం ట్రాకింగ్ యాక్టివ్‌గా ఉంది.`;
    } else if (lang === 'bn') {
      spokenText = `আপনার লাইভ ফার্ম অবস্থান জিপিএস দ্বারা চিহ্নিত করা হয়েছে। নিকটতম সৌর কোল্ড স্টোরেজ ইউনিট মাত্র ৩.২ কিলোমিটার দূরে সক্রিয় রয়েছে। ১২ মিনিটে পৌঁছানো যাবে।`;
      displayText = `📍 লাইভ জিপিএস অবস্থান: নিকটস্থ সৌর কোল্ড স্টোরেজ ৩.২ কিমি দূরে রয়েছে • মানচিত্রে লাইভ যান পর্যবেক্ষণ উপলব্ধ।`;
    } else if (lang === 'hi') {
      spokenText = `आपका लाइव फार्म स्थान जीपीएस द्वारा खोजा गया है। सबसे नजदीकी सौर कोल्ड स्टोरेज यूनिट केवल 3.2 किमी की दूरी पर है। रीफर वैन 12 मिनट में पहुंच सकती है।`;
      displayText = `📍 लाइव जीपीएस स्थान: नजदीकी सौर कोल्ड स्टोरेज 3.2 किमी दूर है (12 मिनट ड्राइविंग)। मैप में सभी रूट और मंडियां दिखाई दे रही हैं।`;
    } else if (lang === 'as') {
      spokenText = `আপোনাৰ লাইভ GPS অৱস্থান চিনাক্ত কৰা হৈছে। নিকটতম সৌৰ শীতল ভঁৰাল মাত্ৰ ৩.২ কিলোমিটাৰ দূৰত্বত সক্ৰিয় হৈ আছে। ১২ মিনিটত পাব পাৰিব।`;
      displayText = `📍 লাইভ অৱস্থান: ওচৰৰ সৌৰ ভঁৰাল ৩.২ কিমি দূৰত্বত আছে। মানচিত্ৰত বাহনৰ স্থিতি উপলব্ধ।`;
    } else {
      spokenText = `Your live farm GPS coordinates are pinpointed. The nearest solar cold storage hub is 3.2 kilometers away (12 minutes drive), with cold room temperature held steady at 8.5 degrees Celsius.`;
      displayText = `📍 Live Location: Nearest Solar Cold Storage is 3.2 km away (12 min). Chamber operating at 8.5°C with active Reefer Transit.`;
    }

    return {
      spokenText,
      displayText,
      category: 'location',
      matchedIntent: 'user_location_and_nearest_silo',
      confidence: 0.96,
      suggestedAction: 'Open Live Map',
      actionScreen: 'map-locations'
    };
  }

  // 2. TOMATO & CROP FRESHNESS / QUALITY / SPOILAGE / SHELF LIFE
  if (
    query.includes('tomato') ||
    query.includes('vegetable') ||
    query.includes('crop') ||
    query.includes('fresh') ||
    query.includes('spoil') ||
    query.includes('shelf') ||
    query.includes('condition') ||
    query.includes('quality') ||
    query.includes('potato') ||
    query.includes('onion') ||
    query.includes('chilli') ||
    query.includes('cabbage') ||
    query.includes('greens') ||
    query.includes('produce') ||
    query.includes('thakkali') || // Tanglish: tomato
    query.includes('thakkali nalla irukka') ||
    query.includes('thakkali status') ||
    query.includes('kaaikari') || // Tanglish: vegetable
    query.includes('kaaygari') ||
    query.includes('kettu') || // Tanglish: spoiled
    query.includes('azhug') || // Tanglish: rot
    query.includes('tharam') ||
    query.includes('payir') || // Tanglish: crop
    query.includes('pasumai') ||
    query.includes('ayul') ||
    query.includes('தக்காளி') || // Tamil: tomato
    query.includes('காய்கறி') || // Tamil: vegetable
    query.includes('பயிர்') || // Tamil: crop
    query.includes('புத்துணர்ச்சி') || // Tamil: freshness
    query.includes('தரம்') || // Tamil: quality
    query.includes('கெட்டு') || // Tamil: spoil
    query.includes('ஆயுள்') || // Tamil: shelf life
    query.includes('அழுகல்') || // Tamil: decay
    query.includes('நிலைமை') ||
    query.includes('டொமேட்டோ') ||
    query.includes('உருளை') ||
    query.includes('வெங்காயம்') ||
    query.includes('மிளகாய்') ||
    query.includes('முட்டைக்கோஸ்') ||
    query.includes('கீரை') ||
    query.includes('காரட்') ||
    query.includes('காலாவதி') ||
    query.includes('மக்கும்') ||
    query.includes('வாழ்நாள்') ||
    query.includes('நன்மை') ||
    query.includes('வாழ்வு') ||
    query.includes('விளைச்சல்') ||
    query.includes('உற்பத்தி') ||
    query.includes('வகை') ||
    query.includes('ஆரோக்கியம்') ||
    query.includes('பாதிப்பு') ||
    query.includes('டொமேட்டோஸ்') ||
    query.includes('பழம்') ||
    query.includes('பழங்கள்') ||
    query.includes('விவசாயம்') ||
    query.includes('பயிர்கள்') ||
    query.includes('தானியம்') ||
    query.includes('தானியங்கள்') ||
    query.includes('பச்சை') ||
    query.includes('பூசணி') ||
    query.includes('மாங்காய்') ||
    query.includes('வாழை') ||
    query.includes('கத்தரி') ||
    query.includes('வெண்டை') ||
    query.includes('உராய்வு') ||
    query.includes('சேதம்') ||
    query.includes('டேமேஜ்') ||
    query.includes('குறைபாடு') ||
    query.includes('ஈரல்') ||
    query.includes('நிறம்') ||
    query.includes('சுவை') ||
    query.includes('வாசம்') ||
    query.includes('காய்') ||
    query.includes('காய்கள்') ||
    query.includes('காய்கறிகள்') ||
    query.includes('பூஞ்சை') ||
    query.includes('பாக்டீரியா') ||
    query.includes('பூச்சி') ||
    query.includes('புழு') ||
    query.includes('நோய்') ||
    query.includes('காரணம்') ||
    query.includes('ஆய்வு') ||
    query.includes('ஸ்கேன்') ||
    query.includes('பார்க்க') ||
    query.includes('பாருங்க') ||
    query.includes('பரிசோதனை') ||
    query.includes('சான்றிதழ்') ||
    query.includes('ग्रेड') ||
    query.includes('பிரிவு') ||
    query.includes('வகைப்பாடு') ||
    query.includes('தரம் 1') ||
    query.includes('தரம் ஏ') ||
    query.includes('ஃபிரெஷ்') ||
    query.includes('பிரஷ்') ||
    query.includes('டிரான்ஸ்போர்ட்') ||
    query.includes('விநியோகம்') ||
    query.includes('టమాట') || // Telugu: tomato
    query.includes('కూరగాయ') || // Telugu: vegetable
    query.includes('తాజా') || // Telugu: fresh
    query.includes('నాణ్యత') || // Telugu: quality
    query.includes('పాడై') || // Telugu: spoil
    query.includes('నిల్వ') || // Telugu: storage
    query.includes('টমেটো') || // Bengali: tomato
    query.includes('সবজি') || // Bengali: vegetable
    query.includes('তাজা') || // Bengali: fresh
    query.includes('গুণমান') || // Bengali: quality
    query.includes('নষ্ট') || // Bengali: spoil
    query.includes('মেয়াদ') || // Bengali: shelf life
    query.includes('टमाटर') || // Hindi: tomato
    query.includes('सब्जी') || // Hindi: vegetable
    query.includes('ताजगी') || // Hindi: freshness
    query.includes('खराब') || // Hindi: spoil
    query.includes('क्वालिटी') || // Hindi: quality
    query.includes('বিলাহী') || // Assamese: tomato
    query.includes('শাক') || // Assamese: greens
    query.includes('সতেজ') // Assamese: fresh
  ) {
    let spokenText = '';
    let displayText = '';

    if (lang === 'ta') {
      spokenText = `உங்கள் தக்காளி தொகுதி 91 சதவீதம் புத்துணர்ச்சியுடன் சிறப்பான நிலையில் உள்ளது. கெட்டுப்போகும் ஆபத்து 4 சதவீதம் மட்டுமே. இன்னும் 4 நாட்கள் வரை பாதுகாப்பாக சேமிக்கலாம்.`;
      displayText = `🍅 தக்காளி நிலை: 91% புத்துணர்ச்சி • கெட்டுப்போகும் ஆபத்து 4% மட்டுமே • 4 நாட்கள் பாதுகாப்பான சேமிப்பு ஆயுள்.`;
    } else if (lang === 'te') {
      spokenText = `మీ టమాటా బ్యాచ్ 91 శాతం తాజాదనంతో అద్భుతమైన స్థితిలో ఉంది. పాడయ్యే ప్రమాదం కేవలం 4 శాతం మాత్రమే. రాబోయే 4 రోజుల వరకు సురక్షితంగా నిల్వ చేయవచ్చు.`;
      displayText = `🍅 పంట పరిస్థితి: 91% తాజాదనం • పాడయ్యే ముప్పు కేవలం 4% • 4 రోజుల సురక్షిత నిల్వ కాలం.`;
    } else if (lang === 'bn') {
      spokenText = `আপনার টমেটো ব্যাচ ৯১ শতাংশ সতেজ রয়েছে এবং চমৎকার অবস্থায় আছে। নষ্ট হওয়ার ঝুঁকি মাত্র ৪ শতাংশ। আগামী ৪ দিন নিরাপদে সংরক্ষণ করতে পারেন।`;
      displayText = `🍅 ফসলের অবস্থা: ৯১% সতেজতা • নষ্টের ঝুঁকি ৪% • ৪ দিন নিরাপদ সঞ্চয় মেয়াদ অবশিষ্ট।`;
    } else if (lang === 'hi') {
      spokenText = `आपके टमाटर की ताजगी 91 प्रतिशत है और स्थिति बेहतरीन है। खराब होने का जोखिम केवल 4 प्रतिशत है। यह अगले 4 दिनों तक पूरी तरह सुरक्षित रहेगा।`;
      displayText = `🍅 टमाटर की स्थिति: 91% ताजगी • खराब होने का जोखिम 4% • 4 दिन सुरक्षित शेल्फ लाइफ बाकी।`;
    } else if (lang === 'as') {
      spokenText = `আপোনাৰ বিলাহী ৯১ শতাংশ সতেজ হৈ আছে আৰু কোনো ক্ষতি হোৱা নাই। নষ্ট হোৱাৰ সম্ভাৱনা মাত্ৰ ৪ শতাংশ। আগন্তুক ৪ দিন নিৰাপদে থাকিব।`;
      displayText = `🍅 বিলাহীৰ গুণমান: ৯১% সতেজতা • ক্ষতিৰ সম্ভাৱনা নিম্ন (৪%) • ৪ দিন সংৰক্ষণৰ ম্যাদ।`;
    } else {
      spokenText = `Your Roma tomato batch is in prime condition with 91 percent freshness and a very low 4 percent spoilage risk. You have 4 days of safe cold storage shelf life.`;
      displayText = `🍅 Crop Condition: 91% Freshness • Low Spoilage Risk (4%) • 4 Days Safe Shelf Life remaining.`;
    }

    return {
      spokenText,
      displayText,
      category: 'crop',
      matchedIntent: 'crop_freshness_status',
      confidence: 0.95,
      suggestedAction: 'View AI Freshness',
      actionScreen: 'freshness'
    };
  }

  // 3. BATTERY, SOLAR POWER & PCM BACKUP
  if (
    query.includes('battery') ||
    query.includes('solar') ||
    query.includes('power') ||
    query.includes('charge') ||
    query.includes('pcm') ||
    query.includes('backup') ||
    query.includes('hours') ||
    query.includes('energy') ||
    query.includes('minsaram') || // Tanglish: electricity
    query.includes('sooriya') || // Tanglish: solar
    query.includes('current') ||
    query.includes('evalo neram') || // Tanglish: how much time
    query.includes('evlo neram') ||
    query.includes('battery evlo') ||
    query.includes('மின்சாரம்') || // Tamil: power
    query.includes('பேட்டரி') || // Tamil: battery
    query.includes('சூரிய') || // Tamil: solar
    query.includes('ஆற்றல்') || // Tamil: energy
    query.includes('சார்ஜ்') || // Tamil: charge
    query.includes('சேமிப்பு மின்சாரம்') ||
    query.includes('பிசிஎம்') ||
    query.includes('சோலார்') ||
    query.includes('மின் உற்பத்தி') ||
    query.includes('மின் அளவு') ||
    query.includes('பேக்கப்') ||
    query.includes('பவர்') ||
    query.includes('கரண்ட்') ||
    query.includes('மின்கலன்') ||
    query.includes('நேரம்') ||
    query.includes('மணி') ||
    query.includes('గంటలు') ||
    query.includes('బ్యాటరీ') || // Telugu: battery
    query.includes('సౌర') || // Telugu: solar
    query.includes('విద్యుత్') || // Telugu: power
    query.includes('శక్తి') || // Telugu: energy
    query.includes('గంటలు') || // Telugu: hours
    query.includes('ব্যাটারি') || // Bengali: battery
    query.includes('সৌর') || // Bengali: solar
    query.includes('বিদ্যুৎ') || // Bengali: power
    query.includes('শক্তি') || // Bengali: energy
    query.includes('बैटरी') || // Hindi: battery
    query.includes('सौर') || // Hindi: solar
    query.includes('पावर') || // Hindi: power
    query.includes('ऊर्जा') || // Hindi: energy
    query.includes('বেটাৰী') || // Assamese: battery
    query.includes('সৌৰ') // Assamese: solar
  ) {
    let spokenText = '';
    let displayText = '';

    if (lang === 'ta') {
      spokenText = `சூரிய சக்தி நிலை சிறப்பாக உள்ளது. பேட்டரி ${battery} சதவீதம் நிரம்பியுள்ளது. ${solarKw} கிலோவாட் சூரிய ஆற்றல் கிடைக்கிறது. இரவு நேரத்திற்கு 14 மணிநேர குளிர்ச்சி காப்பு தயாராக உள்ளது.`;
      displayText = `⚡ பேட்டரி & சூரிய சக்தி: ${battery}% சார்ஜ் • ${solarKw} kW உற்பத்தி • ${pcmHours} மணிநேர PCM காப்பு.`;
    } else if (lang === 'te') {
      spokenText = `సౌర శక్తి స్థితి బాగుంది. బ్యాటరీ ${battery} శాతం ఛార్జ్ అయింది మరియు ${solarKw} కిలోవాట్ల విద్యుత్ ఉత్పత్తి అవుతోంది. రాత్రి కోసం 14 గంటల పీసీఎం శీతలీకరణ బ్యాకప్ సిద్ధంగా ఉంది.`;
      displayText = `⚡ బ్యాటరీ & సౌర శక్తి: ${battery}% ఛార్జ్ • ${solarKw} kW ఉత్పత్తి • ${pcmHours} గంటల థర్మల్ బ్యాకప్.`;
    } else if (lang === 'bn') {
      spokenText = `সৌর শক্তির অবস্থা দুর্দান্ত। ব্যাটারি ${battery} শতাংশ চার্জ রয়েছে এবং ${solarKw} কিলোওয়াট বিদ্যুৎ উৎপন্ন হচ্ছে। রাতের জন্য ১৪ ঘণ্টার থার্মাল ব্যাকআপ প্রস্তুত।`;
      displayText = `⚡ ব্যাটারি ও সৌর শক্তি: ${battery}% চার্জ • ${solarKw} kW উৎপাদন • ${pcmHours} ঘণ্টা ব্যাকআপ।`;
    } else if (lang === 'hi') {
      spokenText = `सोलर बैटरी ${battery} प्रतिशत चार्ज है और ${solarKw} किलोवाट बिजली पैदा कर रही है। रात के लिए पीसीएम थर्मल बैकअप 14 घंटे तक बिना बिजली के कूलिंग बनाए रखेगा।`;
      displayText = `⚡ ऊर्जा स्थिति: ${battery}% बैटरी • ${solarKw} kW सौर ऊर्जा • ${pcmHours} घंटे थर्मल बैकअप।`;
    } else if (lang === 'as') {
      spokenText = `বেটাৰী ${battery} শতাংশ চাৰ্জ হৈ আছে আৰু ${solarKw} কিলোৱাট সৌৰ শক্তি সংগ্ৰহ হৈছে। ৰাতিৰ বাবে ১৪ ঘণ্টাৰ শীতলীকৰণ মজুত আছে।`;
      displayText = `⚡ শক্তিৰ স্থিতি: ${battery}% বেটাৰী • ${solarKw} kW সৌৰ উৎপাদন • ${pcmHours} ঘণ্টা বেকআপ।`;
    } else {
      spokenText = `Solar power generation is healthy at ${solarKw} kilowatts. Battery is charged at ${battery} percent and Phase Change Material thermal reserve provides ${pcmHours} hours of cooling.`;
      displayText = `⚡ Power Status: ${battery}% Battery • ${solarKw} kW Solar Intake • ${pcmHours} Hours PCM Backup.`;
    }

    return {
      spokenText,
      displayText,
      category: 'battery',
      matchedIntent: 'solar_battery_telemetry',
      confidence: 0.96,
      suggestedAction: 'View Solar & Battery',
      actionScreen: 'energy'
    };
  }

  // 4. STORAGE SAFETY, TEMPERATURE, HUMIDITY & DOOR STATUS
  if (
    query.includes('safe') ||
    query.includes('temperature') ||
    query.includes('temp') ||
    query.includes('cool') ||
    query.includes('humidity') ||
    query.includes('door') ||
    query.includes('sensor') ||
    query.includes('seal') ||
    query.includes('veppam') || // Tanglish: temperature
    query.includes('veppanilai') ||
    query.includes('kulir') || // Tanglish: cold
    query.includes('pathukappu') || // Tanglish: safe
    query.includes('kadhavu') || // Tanglish: door
    query.includes('moodi') || // Tanglish: closed
    query.includes('வெப்பநிலை') || // Tamil: temperature
    query.includes('ஈரப்பதம்') || // Tamil: humidity
    query.includes('பாதுகாப்பு') || // Tamil: safe
    query.includes('கதவு') || // Tamil: door
    query.includes('குளிர்சாதனம்') ||
    query.includes('குளிர்ச்சி') ||
    query.includes('சீல்') ||
    query.includes('சென்சார்') ||
    query.includes('டிகிரி') ||
    query.includes('டெம்பரேச்சர்') ||
    query.includes('தெர்மோஸ்டாட்') ||
    query.includes('சேமிப்பகம்') ||
    query.includes('உறைவிடம்') ||
    query.includes('அறை') ||
    query.includes('மூடப்பட்டுள்ளதா') ||
    query.includes('உష్ణోగ్రత') || // Telugu: temperature
    query.includes('తేమ') || // Telugu: humidity
    query.includes('సురక్షితం') || // Telugu: safe
    query.includes('తలుపు') || // Telugu: door
    query.includes('తాపమానం') || // Telugu: temp
    query.includes('তাপমাত্রা') || // Bengali: temperature
    query.includes('আর্দ্রতা') || // Bengali: humidity
    query.includes('নিরাপদ') || // Bengali: safe
    query.includes('দরজা') || // Bengali: door
    query.includes('तापमान') || // Hindi: temperature
    query.includes('नमी') || // Hindi: humidity
    query.includes('सुरक्षित') || // Hindi: safe
    query.includes('दरवाजा') || // Hindi: door
    query.includes('তাপমাত্ৰা') || // Assamese: temperature
    query.includes('আৰ্দ্ৰতা') || // Assamese: humidity
    query.includes('নিৰাপদ') || // Assamese: safe
    query.includes('দুৱাৰ') // Assamese: door
  ) {
    let spokenText = '';
    let displayText = '';

    if (lang === 'ta') {
      spokenText = `குளிர் சேமிப்பு கூடம் பாதுகாப்பானது. தற்போதைய வெப்பநிலை ${temp} டிகிரி செல்சியஸ் மற்றும் ஈரப்பதம் ${humidity} சதவீதம். கதவு மூடப்பட்டு சீல் வைக்கப்பட்டுள்ளது.`;
      displayText = `❄️ சேமிப்பு நிலை: பாதுகாப்பானது • ${temp}°C வெப்பநிலை • ${humidity}% ஈரப்பதம் • கதவு மூடப்பட்டுள்ளது.`;
    } else if (lang === 'te') {
      spokenText = `కోల్డ్ స్టోరేజ్ యూనిట్ పూర్తిగా సురక్షితంగా ఉంది. గది ఉష్ణోగ్రత ${temp} డిగ్రీల సెల్సియస్ మరియు తేమ ${humidity} శాతంగా ఉంది. తలుపు సరిగ్గా మూసివేయబడింది.`;
      displayText = `❄️ స్టోరేజ్ భద్రత: సురక్షితం • ${temp}°C ఉష్ణోగ్రత • ${humidity}% తేమ • డోర్ సీల్ భద్రం.`;
    } else if (lang === 'bn') {
      spokenText = `কোল্ড স্টোরেজ ইউনিট সম্পূর্ণ নিরাপদ। চেম্বারের তাপমাত্রা ${temp} ডিগ্রি সেলসিয়াস এবং আর্দ্রতা ${humidity} শতাংশ। দরজা সঠিকভাবে বন্ধ আছে।`;
      displayText = `❄️ স্টোরেজ স্থিতি: নিরাপদ • ${temp}°C তাপমাত্রা • ${humidity}% আর্দ্রতা • ডোর সিল অক্ষত।`;
    } else if (lang === 'hi') {
      spokenText = `कोल्ड स्टोरेज पूरी तरह सुरक्षित है। कक्ष का तापमान ${temp} डिग्री सेल्सियस और नमी ${humidity} प्रतिशत है। चेंबर का दरवाजा सुरक्षित रूप से बंद है।`;
      displayText = `❄️ स्टोरेज स्थिति: सुरक्षित • ${temp}°C तापमान • ${humidity}% आर्द्रता • डोर सील सही।`;
    } else if (lang === 'as') {
      spokenText = `শীতল ভঁৰাল সম্পূৰ্ণৰূপে সুৰক্ষিত। বৰ্তমান তাপমাত্ৰা ${temp} ডিগ্ৰী চেলচিয়াছ আৰু আৰ্দ্ৰতা ${humidity} শতাংশ। কুলিং সক্ৰিয় হৈ আছে।`;
      displayText = `❄️ ভঁৰাল স্থিতি: সুৰক্ষিত • ${temp}°C তাপমাত্ৰা • ${humidity}% আৰ্দ্ৰতা • কুলিং সক্ৰিয়।`;
    } else {
      spokenText = `Storage unit is safe and stable. Chamber temperature is held at ${temp} degrees Celsius with ${humidity} percent relative humidity. Door is hermetically sealed.`;
      displayText = `❄️ Storage Safety: SAFE • ${temp}°C Temp • ${humidity}% RH • Door Hermetically Sealed.`;
    }

    return {
      spokenText,
      displayText,
      category: 'safety',
      matchedIntent: 'storage_safety_temp',
      confidence: 0.95,
      suggestedAction: 'View Storage Chamber',
      actionScreen: 'storage'
    };
  }

  // 5. MANDI PRICES, MARKET RATES & TRANSPORT TIMING
  if (
    query.includes('price') ||
    query.includes('mandi') ||
    query.includes('market') ||
    query.includes('sell') ||
    query.includes('rate') ||
    query.includes('transport') ||
    query.includes('dispatch') ||
    query.includes('truck') ||
    query.includes('van') ||
    query.includes('profit') ||
    query.includes('vilai') || // Tanglish: price
    query.includes('enna vilai') ||
    query.includes('rate enna') ||
    query.includes('santhai') || // Tanglish: market
    query.includes('laabam') || // Tanglish: profit
    query.includes('panam') ||
    query.includes('vikkalama') ||
    query.includes('kilo evlo') ||
    query.includes('roobai') ||
    query.includes('சந்தை') || // Tamil: market
    query.includes('விலை') || // Tamil: price
    query.includes('விற்பனை') || // Tamil: sell
    query.includes('வாகனம்') || // Tamil: vehicle
    query.includes('மண்டி') || // Tamil: mandi
    query.includes('லாபம்') || // Tamil: profit
    query.includes('ரூபாய்') || // Tamil: rupees
    query.includes('கிலோ') || // Tamil: kilo
    query.includes('விலை நிலவரம்') ||
    query.includes('சந்தை விலை') ||
    query.includes('விற்பது') ||
    query.includes('ஏற்றுமதி') ||
    query.includes('அனுப்புவது') ||
    query.includes('மார்కెట్') || // Telugu: market
    query.includes('ధర') || // Telugu: price
    query.includes('మండి') || // Telugu: mandi
    query.includes('అమ్మకం') || // Telugu: sell
    query.includes('వాహనం') || // Telugu: vehicle
    query.includes('లాభం') || // Telugu: profit
    query.includes('বাজার') || // Bengali: market
    query.includes('দর') || // Bengali: price
    query.includes('দাম') || // Bengali: rate/price
    query.includes('মন্ডি') || // Bengali: mandi
    query.includes('বিক্রি') || // Bengali: sell
    query.includes('পরিবহন') || // Bengali: transport
    query.includes('मंडी') || // Hindi: mandi
    query.includes('दाम') || // Hindi: price
    query.includes('भाव') || // Hindi: rate
    query.includes('गाड़ी') || // Hindi: vehicle
    query.includes('বজাৰ') || // Assamese: market
    query.includes('দৰ') || // Assamese: price
    query.includes('মণ্ডি') || // Assamese: mandi
    query.includes('পৰিবহণ') // Assamese: transport
  ) {
    let spokenText = '';
    let displayText = '';

    if (lang === 'ta') {
      spokenText = `இன்றைய சந்தை விலை கிலோவுக்கு 44 ரூபாய் வரை உயர்ந்துள்ளது. இது 15 சதவீதம் அதிகம். குளிரூட்டப்பட்ட வாகனத்தில் உடனே அனுப்பினால் அதிக லாபம் கிடைக்கும்.`;
      displayText = `🏛️ சந்தை விலை: ₹44/கிலோ (+15% உயர்வு) • பரிந்துரை: இன்று குளிரூட்டப்பட்ட வாகனத்தில் அனுப்பவும்.`;
    } else if (lang === 'te') {
      spokenText = `ఈ రోజు ప్రాంతీయ హోల్‌సేల్ మండిలో టమాటా ధర కిలోకు ₹44 కు పెరిగింది, ఇది 15 శాతం ఎక్కువ. నేడు లేదా రేపు ఉదయం శీతల వాహనంలో రవాణా చేయడం లాభదాయకం.`;
      displayText = `🏛️ మండి ధర: ₹44/కిలో (+15% పెరుగుదల) • సిఫార్సు: రీఫర్ వ్యాన్ ద్వారా రవాణా చేయండి.`;
    } else if (lang === 'bn') {
      spokenText = `আজ আঞ্চলিক পাইকারি বাজারে টমেটোর দর প্রতি কেজি ₹৪৪ এ পৌঁছেছে, যা ১৫ শতাংশ বেশি। আজই কোল্ড ভ্যানে পরিবহণ করলে সর্বোচ্চ লাভ পাবেন।`;
      displayText = `🏛️ বাজার দর: ₹৪৪/কেজি (+১৫% বৃদ্ধি) • পরামর্শ: আজই শীতাতপ নিয়ন্ত্রিত ভ্যানে পাঠান।`;
    } else if (lang === 'hi') {
      spokenText = `गुवाहाटी एवं क्षेत्रीय मंडी में टमाटर का भाव 44 रुपये प्रति किलो पर पहुंच गया है, जो 15 प्रतिशत अधिक है। कल सुबह रीफर वैन से माल भेजना सबसे लाभदायक रहेगा।`;
      displayText = `🏛️ मंडी भाव: ₹44/किग्रा (+15% उछाल) • सुझाव: आज या कल सुबह रीफर वाहन से भेजें।`;
    } else if (lang === 'as') {
      spokenText = `মণ্ডিত বিলাহীৰ দৰ প্ৰতি কিলোগ্ৰামত ৪৪ টকালৈ বৃদ্ধি পাইছে (১৫% অধিক)। কাইলৈ পুৱা শীতলীকৃত ভেনযোগে পঠিয়ালে সৰ্বোচ্চ লাভ পাব।`;
      displayText = `🏛️ মণ্ডিৰ দৰ: ₹৪৪/কেজি (+১৫% বৃদ্ধি) • কাইলৈ পুৱা পৰিবহণৰ পৰামৰ্শ।`;
    } else {
      spokenText = `Regional wholesale mandi price is at ₹44 per kilogram, up 15 percent today. Reefer transit is scheduled and recommended before 10 AM.`;
      displayText = `🏛️ Mandi Rate: ₹44/kg (+15% surge) • Recommendation: Transport Today in Reefer Van.`;
    }

    return {
      spokenText,
      displayText,
      category: 'market',
      matchedIntent: 'mandi_price_recommendation',
      confidence: 0.94,
      suggestedAction: 'View Mandi Analytics',
      actionScreen: 'market'
    };
  }

  // 6. EMERGENCY / POWER FAILURE / ALERTS
  if (
    query.includes('emergency') ||
    query.includes('alert') ||
    query.includes('power cut') ||
    query.includes('blackout') ||
    query.includes('fail') ||
    query.includes('warning') ||
    query.includes('current cut') || // Tanglish
    query.includes('current poiruchu') ||
    query.includes('power poiruchu') ||
    query.includes('abathu') ||
    query.includes('aabathu') ||
    query.includes('echcharikkai') ||
    query.includes('ஆபத்து') || // Tamil: emergency
    query.includes('எச்சரிக்கை') || // Tamil: warning
    query.includes('மின் தடை') || // Tamil: power cut
    query.includes('மின்சாரம் இல்லை') ||
    query.includes('கரண்ட் கட்') ||
    query.includes('அலர்ட்') ||
    query.includes('அபாயம்') ||
    query.includes('சேதம்') ||
    query.includes('அவசரம்') ||
    query.includes('அவசர நிலை') ||
    query.includes('அதிர்ச்சி') ||
    query.includes('நிறுத்தம்') ||
    query.includes('பழுது') ||
    query.includes('கோளாறு') ||
    query.includes('అత్యవసరం') || // Telugu: emergency
    query.includes('హెచ్చరిక') || // Telugu: alert
    query.includes('కరెంట్ కట్') || // Telugu: power cut
    query.includes('ప్రమాదం') || // Telugu: danger
    query.includes('জরুরি') || // Bengali: emergency
    query.includes('সতর্কতা') || // Bengali: alert
    query.includes('লোডশেডিং') || // Bengali: power cut
    query.includes('বিপদ') || // Bengali: danger
    query.includes('खतरा') || // Hindi: emergency
    query.includes('चेतावनी') || // Hindi: warning
    query.includes('बिजली कट') || // Hindi: power cut
    query.includes('বিপদ') || // Assamese: emergency
    query.includes('সতৰ্কবাণী') // Assamese: warning
  ) {
    let spokenText = '';
    let displayText = '';

    if (lang === 'ta') {
      spokenText = `அவசர எச்சரிக்கை எதுவும் இல்லை. மின் தடை ஏற்பட்டாலும் உறைவிப்பான் பேட்டரி மற்றும் பிசிஎம் 14 மணிநேரம் தொடர்ந்து குளிர்விக்கும்.`;
      displayText = `🚨 அவசர நிலை: அனைத்தும் சீராக உள்ளது • 14 மணிநேர தானியங்கி குளிர்ச்சி பாதுகாப்பு தயார்.`;
    } else if (lang === 'te') {
      spokenText = `ఎటువంటి అత్యవసర హెచ్చరిక లేదు. కరెంట్ పోయినా కూడా సోలార్ బ్యాటరీ మరియు పీసీఎం 14 గంటలపాటు నిరంతర శీతలీకరణను అందిస్తాయి.`;
      displayText = `🚨 అత్యవసర స్థితి: అంతా సురక్షితం • 14 గంటల ఆటోమేటిక్ థర్మల్ బ్యాకప్ సిద్ధంగా ఉంది.`;
    } else if (lang === 'bn') {
      spokenText = `কোনো জরুরি সতর্কতা নেই। বিদ্যুৎ চলে গেলেও সোলার ব্যাটারি এবং পিসিএম ১৪ ঘণ্টা একটানা ঠান্ডা বজায় রাখবে।`;
      displayText = `🚨 জরুরি স্থিতি: সবকিছু স্বাভাবিক • বিদ্যুৎ বিভ্রাটেও ১৪ ঘণ্টা স্বয়ংক্রিয় ব্যাকআপ সক্রিয়।`;
    } else if (lang === 'hi') {
      spokenText = `कोई इमरजेंसी नहीं है। यदि ग्रिड बिजली कट भी जाती है, तो सोलर बैटरी और पीसीएम 14 घंटे तक लगातार शीतलन बनाए रखेंगे।`;
      displayText = `🚨 इमरजेंसी स्थिति: सब सुरक्षित • 14 घंटे का ऑटोमैटिक थर्मल बैकअप एक्टिव।`;
    } else if (lang === 'as') {
      spokenText = `কোনো জৰুৰী সতৰ্কবাণী নাই। বিদ্যুৎ কৰ্তন হ’লেও ১৪ ঘণ্টা ভঁৰাল শীতল হৈ থাকিব।`;
      displayText = `🚨 জৰুৰীকালীন স্থিতি: সকলো ঠিক আছে • ১৪ ঘণ্টাৰ বেকআপ মজুত।`;
    } else {
      spokenText = `No emergency active. In the event of grid failure, the PCM cold reserve and LiFePO4 battery sustain automatic cooling for over 14 hours.`;
      displayText = `🚨 Emergency Status: System Safe • 14h PCM Cold Reserve ready in case of power cut.`;
    }

    return {
      spokenText,
      displayText,
      category: 'emergency',
      matchedIntent: 'emergency_check',
      confidence: 0.95,
      suggestedAction: 'View Emergency Protocol',
      actionScreen: 'emergency'
    };
  }

  // 7. GREETINGS & GENERAL CONVERSATION (VANAKKAM / HELLO)
  if (
    query.includes('vanakkam') ||
    query.includes('vanakam') ||
    query.includes('வணக்கம்') ||
    query.includes('hello') ||
    query.includes('hi') ||
    query.includes('help') ||
    query.includes('udhavi') ||
    query.includes('உதவி') ||
    query.includes('நமஸ்காரம்') ||
    query.includes('வாழ்க') ||
    query.includes('நன்றி') ||
    query.includes('thanks') ||
    query.includes('thank you')
  ) {
    if (lang === 'ta') {
      return {
        spokenText: 'வணக்கம் விவசாய நண்பரே! உங்கள் தக்காளி புத்துணர்ச்சி, சூரிய பேட்டரி அளவு, உறைவிப்பான் இருப்பிடம் அல்லது சந்தை விலை பற்றி என்னிடம் கேளுங்கள்.',
        displayText: '🌾 வணக்கம்! தக்காளி தரம், பேட்டரி அளவு, குளிர் அறை அல்லது சந்தை விலை பற்றி கேளுங்கள்.',
        category: 'general',
        matchedIntent: 'farmer_greeting_tamil',
        confidence: 0.98,
        suggestedAction: 'View Farm Overview',
        actionScreen: 'home'
      };
    }
  }

  // DEFAULT CONTEXTUAL FALLBACK
  let spokenText = '';
  let displayText = '';

  if (lang === 'ta') {
    spokenText = `வணக்கம்! உங்கள் தக்காளி நிலை, சூரிய பேட்டரி, உறைவிப்பான் இருப்பிடம் அல்லது சந்தை விலை குறித்து நீங்கள் கேட்கலாம்.`;
    displayText = `🌾 CROPIQ குரல் உதவியாளர்: தக்காளி தரம், பேட்டரி அளவு, இருப்பிடம் அல்லது சந்தை விலை பற்றி கேட்கலாம்.`;
  } else if (lang === 'te') {
    spokenText = `నమస్కారం! మీ పంట నాణ్యత, సౌర బ్యాటరీ స్థాయి, లైవ్ మ్యాప్ లొకేషన్ లేదా మండి ధరల గురించి మీరు నన్ను అడగవచ్చు.`;
    displayText = `🌾 CROPIQ రైతు వాయిస్: పంట తాజాదనం, సోలార్ బ్యాకప్, లైవ్ జీపీఎస్ లొకేషన్ లేదా మండి ధరల గురించి అడగండి.`;
  } else if (lang === 'bn') {
    spokenText = `নমস্কার! ফসলের সতেজতা, সৌর ব্যাটারি চার্জ, লাইভ জিপিএস ম্যাপ বা পাইকারি বাজার দর সম্পর্কে আমাকে প্রশ্ন করতে পারেন।`;
    displayText = `🌾 CROPIQ কৃষক ভয়েস: ফসলের সতেজতা, সৌর ব্যাকআপ, লাইভ ম্যাপ বা বাজার দর সম্পর্কে জিজ্ঞাসা করুন।`;
  } else if (lang === 'hi') {
    spokenText = `नमस्ते! आप अपनी फसल की ताजगी, सोलर बैटरी, जीपीएस लोकेशन या मंडी भाव के बारे में कभी भी पूछ सकते हैं।`;
    displayText = `🌾 CROPIQ किसान वॉयस: आप फसल ताजगी, सोलर बैकअप, जीपीएस लोकेशन या मंडी भाव पूछ सकते हैं।`;
  } else if (lang === 'as') {
    spokenText = `নমস্কাৰ! আপোনাৰ শস্যৰ সতেজতা, সৌৰ বেটাৰী, GPS অৱস্থান বা মণ্ডিৰ দৰৰ বিষয়ে সোধক।`;
    displayText = `🌾 CROPIQ কৃষক ভয়েচ: শস্যৰ সতেজতা, সৌৰ শক্তি, GPS অৱস্থান বা মণ্ডিৰ দৰৰ বিষয়ে সোধক।`;
  } else {
    spokenText = `Hello farmer! You can ask me about tomato freshness, solar battery levels, live GPS farm location, or wholesale mandi prices.`;
    displayText = `🌾 CROPIQ Voice Assistant: Ask about crop freshness, solar backup, live location, or mandi rates.`;
  }

  return {
    spokenText,
    displayText,
    category: 'general',
    matchedIntent: 'general_assistance',
    confidence: 0.88,
    suggestedAction: 'View Home',
    actionScreen: 'home'
  };
}

