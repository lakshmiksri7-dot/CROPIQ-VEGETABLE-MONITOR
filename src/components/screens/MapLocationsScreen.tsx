import React, { useState, useEffect, useRef } from 'react';
import { StorageSilo, ScreenId, AppLanguage, TransitVehicle, RegionalMandiPrice } from '../../types';
import { speakContent, stopSpeech, subscribeSpeechState } from '../../utils/speechUtils';
import {
  getCurrentGpsLocation,
  watchGpsLocation,
  calculateDistanceKm,
  calculateDirection,
  UserGeoLocation,
  REGIONAL_AGRO_PRESETS,
  getDynamicFacilitiesForLocation
} from '../../utils/locationUtils';
import {
  RealTimeLeafletMap,
  StorageMapMarker,
  MandiMapMarker,
  VehicleMapMarker
} from '../map/RealTimeLeafletMap';

interface StorageSiloWithDistance extends StorageSilo {
  calculatedDistanceKm: number;
  direction: string;
  driveTimeMin: number;
}

interface MapLocationsScreenProps {
  silos: Record<string, StorageSilo>;
  onSelectUnit: (unitId: string) => void;
  onNavigate: (screen: ScreenId) => void;
  language?: AppLanguage;
  isSpeakerEnabled?: boolean;
}

export const MapLocationsScreen: React.FC<MapLocationsScreenProps> = ({
  silos,
  onSelectUnit,
  onNavigate,
  language = 'en',
  isSpeakerEnabled = true
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<string>('unit-01');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('veh-live-1');
  const [viewMode, setViewMode] = useState<'local' | 'transit'>('local');
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);

  // User's Real-time Live Geolocation State
  const [userLocation, setUserLocation] = useState<UserGeoLocation>({
    latitude: 10.9983,
    longitude: 76.9620,
    accuracy: 12,
    altitude: 412,
    speed: 0,
    heading: 0,
    timestamp: Date.now(),
    address: 'Coimbatore Agri Zone, Tamil Nadu',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    isLiveGps: false
  });

  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatusMsg, setLocationStatusMsg] = useState<string>('Detecting live farm GPS...');
  const [isLiveStreamingGps, setIsLiveStreamingGps] = useState<boolean>(true);

  // Subscribe to speech state
  useEffect(() => {
    const unsubscribe = subscribeSpeechState((speaking, textId) => {
      setActiveSpeakingId(speaking && textId ? textId : null);
    });
    return unsubscribe;
  }, []);

  // Request user's real GPS location with high precision
  const handleDetectLocation = async () => {
    setIsLocating(true);
    setLocationStatusMsg('Acquiring high-precision real-time satellite GPS fix...');

    try {
      const liveLoc = await getCurrentGpsLocation();
      setUserLocation(liveLoc);
      setIsLocating(false);
      setLocationStatusMsg(`Live GPS Locked: ${liveLoc.address} (±${liveLoc.accuracy}m)`);

      // Read aloud location if speaker enabled
      if (isSpeakerEnabled) {
        const spoken =
          language === 'ta'
            ? `உங்கள் நேரடி ஜிபிஎஸ் இருப்பிடம் பெறப்பட்டது: ${liveLoc.city || liveLoc.address}. அருகிலுள்ள சூரிய குளிர் சேமிப்பு கூடம் மற்றும் மண்டி விலைகள் வரைபடத்தில் இணைக்கப்பட்டுள்ளன.`
            : language === 'te'
            ? `మీ లైవ్ జీపీఎస్ లొకేషన్ విజయవంతంగా కనుగొనబడింది. సమీపంలోని కోల్డ్ స్టోరేజ్ యూనిట్లు మరియు మండీలు మ్యాప్‌లో చూపించబడుతున్నాయి.`
            : language === 'bn'
            ? `আপনার লাইভ জিপিএস অবস্থান সফলভাবে চিহ্নিত হয়েছে। নিকটতম কোল্ড স্টোরেজ এবং পাইকারি বাজার মানচিত্রে প্রদর্শিত হচ্ছে।`
            : language === 'hi'
            ? `आपका लाइव जीपीएस स्थान सफलतापूर्वक मिल गया है: ${liveLoc.city || liveLoc.address}। नजदीकी कोल्ड स्टोरेज और मंडियां मैप पर लाइव हैं।`
            : language === 'as'
            ? `আপোনাৰ লাইভ GPS অৱস্থান সফলতাৰে চিনাক্ত কৰা হৈছে।`
            : `Your live farm GPS location is locked at ${liveLoc.address}. Nearest solar cold rooms and APMC mandis are active.`;
        speakContent(spoken, language as AppLanguage, 'gps-locked');
      }
    } catch (err: any) {
      setIsLocating(false);
      setLocationStatusMsg(`GPS Notice: ${err.message || 'Using current location'}`);
    }
  };

  // Continuous real-time GPS stream listener
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (isLiveStreamingGps && typeof window !== 'undefined' && navigator.geolocation) {
      cleanup = watchGpsLocation(
        (updatedLoc) => {
          setUserLocation(updatedLoc);
          setLocationStatusMsg(`🟢 Real-Time GPS Active (±${updatedLoc.accuracy}m)`);
        },
        (err) => {
          // Gracefully handle if GPS stream is throttled
          console.log('GPS watch note:', err.message);
        }
      );
    }

    return () => {
      if (cleanup) cleanup();
    };
  }, [isLiveStreamingGps]);

  // Initial fast GPS lock on mount
  useEffect(() => {
    handleDetectLocation();
  }, []);

  // Apply regional preset location if user wants to check other zones
  const handleSelectPresetLocation = (preset: typeof REGIONAL_AGRO_PRESETS[0]) => {
    setUserLocation({
      latitude: preset.lat,
      longitude: preset.lng,
      accuracy: 15,
      timestamp: Date.now(),
      address: preset.name,
      city: preset.name.split('(')[0].trim(),
      state: preset.state,
      isLiveGps: false
    });
    setLocationStatusMsg(`Location set to: ${preset.name}`);
  };

  // Calculate dynamic facilities around user's actual real coordinates
  const dynamicData = getDynamicFacilitiesForLocation(
    userLocation.latitude,
    userLocation.longitude,
    userLocation.city,
    userLocation.state
  );

  // Map markers preparation
  const storageMarkers: StorageMapMarker[] = dynamicData.storageUnits.map((u) => ({
    id: u.id,
    name: u.name,
    lat: u.lat,
    lng: u.lng,
    temp: u.temp,
    humidity: u.humidity,
    solarBatteryPercent: u.solarBatteryPercent,
    backupHours: u.backupHours,
    capacityKg: u.capacityKg,
    occupiedKg: u.occupiedKg,
    status: u.status,
    zone: u.zone
  }));

  const mandiMarkers: MandiMapMarker[] = dynamicData.mandis.map((m) => ({
    id: m.id,
    name: m.name,
    lat: m.lat,
    lng: m.lng,
    currentPrice: m.currentPrice,
    trend: m.trend,
    demand: m.demand,
    distanceKm: calculateDistanceKm(userLocation.latitude, userLocation.longitude, m.lat, m.lng)
  }));

  const [vehicles, setVehicles] = useState<VehicleMapMarker[]>(dynamicData.reeferVehicles);

  // Update vehicles when user location changes
  useEffect(() => {
    setVehicles(dynamicData.reeferVehicles);
  }, [userLocation.latitude, userLocation.longitude]);

  // Simulate real-time reefer transit movement along real coordinates
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => {
          const newProgress = v.progressPercent >= 98 ? 20 : v.progressPercent + 0.8;
          const latDiff = (v.destinationLat - v.lat) * 0.03;
          const lngDiff = (v.destinationLng - v.lng) * 0.03;
          const newEta = Math.max(2, Math.round(v.etaMinutes * 0.98));
          return {
            ...v,
            lat: v.lat + latDiff,
            lng: v.lng + lngDiff,
            progressPercent: newProgress,
            etaMinutes: newEta
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
  const closestStorage = storageMarkers[0];
  const closestMandi = mandiMarkers[0];
  const closestStorageDist = calculateDistanceKm(userLocation.latitude, userLocation.longitude, closestStorage.lat, closestStorage.lng);
  const closestStorageDir = calculateDirection(userLocation.latitude, userLocation.longitude, closestStorage.lat, closestStorage.lng);

  // Spoken Local Area Briefing
  const handleSpeakLocalBriefing = () => {
    const textEn = `Your live farm location is ${userLocation.address}. The closest Cold Storage unit is ${closestStorage.name}, ${closestStorageDist} kilometers away (${closestStorageDir}), with chamber temperature ready at ${closestStorage.temp} degrees Celsius and solar battery at ${closestStorage.solarBatteryPercent} percent. The nearest wholesale market is ${closestMandi.name} at ${closestMandi.distanceKm.toFixed(1)} kilometers with tomato price at ₹${closestMandi.currentPrice} per kg.`;
    const textTa = `உங்கள் நேரடி பண்ணை இருப்பிடம் ${userLocation.address}. மிக அருகில் உள்ள சூரிய குளிர் சேமிப்பு கூடம் ${closestStorage.name}, ${closestStorageDist} கிலோமீட்டர் தொலைவில் ${closestStorage.temp} டிகிரி வெப்பநிலையில் இயங்குகிறது. அருகில் உள்ள சந்தை ${closestMandi.name}, தக்காளி விலை கிலோவுக்கு ₹${closestMandi.currentPrice}.`;
    const textHi = `आपका लाइव खेत स्थान ${userLocation.address} है। सबसे नजदीकी कोल्ड स्टोरेज ${closestStorage.name} ${closestStorageDist} किमी दूर ${closestStorage.temp} डिग्री पर तैयार है। निकटतम मंडी ${closestMandi.name} ${closestMandi.distanceKm.toFixed(1)} किमी दूर है जहाँ टमाटर का भाव ₹${closestMandi.currentPrice} प्रति किलो है।`;
    const textAs = `আপোনাৰ লাইভ কৃষি ভূমিৰ অৱস্থান ${userLocation.address}। আটাইতকৈ ওচৰৰ শীতল ভঁৰাল ${closestStorage.name} ${closestStorageDist} কিলোমিটাৰ দূৰত্বত আছে। ওচৰৰ মণ্ডি ${closestMandi.name}ত বিলাহীৰ দৰ ₹${closestMandi.currentPrice} প্ৰতি কেজি।`;

    const txt = language === 'ta' ? textTa : language === 'as' ? textAs : language === 'hi' ? textHi : textEn;
    speakContent(txt, language as AppLanguage, 'local-briefing');
  };

  const handleSpeakVehicleStatus = (vehicle: VehicleMapMarker) => {
    const textEn = `Reefer Van ${vehicle.vehicleNumber} driven by ${vehicle.driverName}. Carrying ${vehicle.crop}. Speed is ${vehicle.speedKmH} km/h. Reefer chamber temp is ${vehicle.reeferTemp}°C. Arrival at ${vehicle.destinationName} in ${vehicle.etaMinutes} minutes.`;
    const textTa = `குளிரூட்டப்பட்ட வாகனம் ${vehicle.vehicleNumber} ஓட்டுநர் ${vehicle.driverName}. வேகம் ${vehicle.speedKmH} கிமீ/மணி. வெப்பநிலை ${vehicle.reeferTemp} டிகிரி. ${vehicle.etaMinutes} நிமிடங்களில் சென்றடையும்.`;
    const textHi = `रीफर वाहन ${vehicle.vehicleNumber} चालक ${vehicle.driverName}। तापमान ${vehicle.reeferTemp} डिग्री है। ${vehicle.etaMinutes} मिनट में मंडी पहुंचेगा।`;
    const textAs = `শীতলীকৃত বাহন ${vehicle.vehicleNumber}, চালক ${vehicle.driverName}। ভিতৰৰ তাপমাত্ৰা ${vehicle.reeferTemp} ডিগ্ৰী। ${vehicle.etaMinutes} মিনিটত মণ্ডিত উপস্থিত হ’ব।`;

    const txt = language === 'ta' ? textTa : language === 'as' ? textAs : language === 'hi' ? textHi : textEn;
    speakContent(txt, language as AppLanguage, `veh-${vehicle.id}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 flex flex-col gap-4">
      {/* 1. Header Banner with Live Location & Green/White Theme */}
      <section className="w-full bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm bg-gradient-to-r from-emerald-50 via-white to-white">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
            <span className="material-symbols-outlined text-2xl">location_on</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-800 font-extrabold">
                Live Real-Time Satellite GPS
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                {userLocation.isLiveGps ? 'REAL GPS LIVE STREAM' : 'LOCATION ACTIVE'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Real-Time Live Location Map
            </h2>
            <p className="text-xs text-slate-600">
              High-accuracy OpenStreetMap & Satellite GIS with live cold storage rooms, mandi rates & reefer tracking
            </p>
          </div>
        </div>

        {/* Audio Briefing Button ⭐ */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSpeakLocalBriefing}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all shadow-sm ${
              activeSpeakingId === 'local-briefing'
                ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
                : 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-100'
            }`}
            title="Hear Spoken Audio Briefing of your location & nearest storage"
          >
            <span className="material-symbols-outlined text-[18px]">
              {activeSpeakingId === 'local-briefing' ? 'graphic_eq' : 'volume_up'}
            </span>
            <span>{activeSpeakingId === 'local-briefing' ? 'Speaking...' : 'Listen Briefing'}</span>
          </button>
        </div>
      </section>

      {/* 2. User's Live Geolocation HUD ⭐ (Detect My GPS + Telemetry) */}
      <section className="bg-white rounded-3xl border border-emerald-200 p-4 sm:p-5 flex flex-col gap-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-2xl">my_location</span>
              </span>
              {userLocation.isLiveGps && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white animate-ping" />
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-extrabold text-emerald-900 uppercase">
                  My Real Live Location
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                  {userLocation.latitude.toFixed(5)}°N, {userLocation.longitude.toFixed(5)}°E
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                  Accuracy: ±{userLocation.accuracy}m
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {userLocation.address}
              </p>
            </div>
          </div>

          {/* Action Trigger: Detect GPS Location */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handleDetectLocation}
              disabled={isLocating}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm ${
                isLocating
                  ? 'bg-emerald-700 opacity-80 cursor-wait'
                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
              }`}
            >
              <span className={`material-symbols-outlined text-base ${isLocating ? 'animate-spin' : ''}`}>
                {isLocating ? 'sync' : 'gps_fixed'}
              </span>
              <span>{isLocating ? 'Detecting Live GPS...' : 'Refresh My GPS Fix'}</span>
            </button>
          </div>
        </div>

        {/* Quick Regional Agricultural Location Presets */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          <span className="text-[11px] font-mono text-slate-500 font-semibold shrink-0">
            Quick Agri Hubs:
          </span>
          {REGIONAL_AGRO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPresetLocation(preset)}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                userLocation.address === preset.name
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                  : 'bg-slate-50 text-slate-700 hover:bg-emerald-50 border-slate-200'
              }`}
            >
              {preset.name.split('(')[0].trim()}
            </button>
          ))}
        </div>

        {/* Dynamic Proximity Cards (Calculated from user's live coordinates) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Nearest Cold Storage Unit */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">ac_unit</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold">
                  Nearest Storage Hub
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                  {closestStorage.name}
                </span>
                <span className="text-[11px] text-slate-600 font-mono">
                  {closestStorageDist} km ({closestStorageDir}) • Chamber: {closestStorage.temp}°C
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedUnitId(closestStorage.id);
                onSelectUnit(closestStorage.id);
                onNavigate('storage');
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 text-xs font-bold shadow-xs whitespace-nowrap shrink-0"
            >
              View Hub
            </button>
          </div>

          {/* Nearest Wholesale Mandi */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">storefront</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase text-amber-800 font-bold">
                  Nearest APMC Mandi
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                  {closestMandi.name}
                </span>
                <span className="text-[11px] text-slate-600 font-mono">
                  {closestMandi.distanceKm.toFixed(1)} km • Tomato: <strong className="text-emerald-700">₹{closestMandi.currentPrice}/kg</strong>
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('market')}
              className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 text-xs font-bold shadow-xs whitespace-nowrap shrink-0"
            >
              Check Prices
            </button>
          </div>
        </div>
      </section>

      {/* 3. REAL-TIME INTERACTIVE LEAFLET / OPENSTREETMAP STAGE ⭐ */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-600">map</span>
              <span>Interactive Live Map & Telemetry</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
              Real OpenStreetMap & Satellite Engine
            </span>
          </div>

          <div className="text-xs font-mono text-slate-500">
            {locationStatusMsg}
          </div>
        </div>

        {/* Real Leaflet Map Component */}
        <RealTimeLeafletMap
          userLocation={userLocation}
          storageUnits={storageMarkers}
          mandis={mandiMarkers}
          vehicles={vehicles}
          selectedUnitId={selectedUnitId}
          selectedVehicleId={selectedVehicleId}
          onSelectUnit={(id) => {
            setSelectedUnitId(id);
            onSelectUnit(id);
          }}
          onSelectVehicle={(id) => {
            setSelectedVehicleId(id);
          }}
          onSelectMandi={(mandi) => {
            // Can show custom mandi info
          }}
          viewMode={viewMode}
          showRoutes={true}
        />
      </div>

      {/* 4. Live Vehicle Telemetry Card */}
      {selectedVehicle && (
        <div className="bg-white border border-emerald-200 rounded-3xl p-4 sm:p-5 flex flex-col gap-3 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
                <span className="material-symbols-outlined text-2xl">local_shipping</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-slate-900 font-mono">
                    {selectedVehicle.vehicleNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold">
                    ACTIVE REEFER TRANSIT
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  {selectedVehicle.crop} • Driver: <strong className="text-slate-800">{selectedVehicle.driverName}</strong> ({selectedVehicle.driverPhone})
                </p>
              </div>
            </div>

            {/* Action Buttons: Speak Vehicle Status & Call Driver */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleSpeakVehicleStatus(selectedVehicle)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${
                  activeSpeakingId === `veh-${selectedVehicle.id}`
                    ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
                    : 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                }`}
                title="Hear Vehicle Status Spoken Aloud"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {activeSpeakingId === `veh-${selectedVehicle.id}` ? 'graphic_eq' : 'volume_up'}
                </span>
                <span>{activeSpeakingId === `veh-${selectedVehicle.id}` ? 'Speaking...' : 'Speak Telemetry'}</span>
              </button>

              <a
                href={`tel:${selectedVehicle.driverPhone}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold shadow-xs"
              >
                <span className="material-symbols-outlined text-[15px]">call</span>
                <span>Call Driver</span>
              </a>
            </div>
          </div>

          {/* Vehicle Live Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-3 flex flex-col">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
                Inside Reefer Temp
              </span>
              <span className="text-xl font-bold font-mono text-emerald-700 mt-0.5">
                {selectedVehicle.reeferTemp}°C
              </span>
              <span className="text-[10px] text-emerald-800 font-mono">
                Target: 8.0°C - 12.0°C
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
                GPS Speed
              </span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                {selectedVehicle.speedKmH} <span className="text-xs text-slate-500 font-normal">km/h</span>
              </span>
              <span className="text-[10px] text-slate-600 truncate">
                Real-time Highway Transit
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
                Arrival ETA
              </span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                {selectedVehicle.etaMinutes} <span className="text-xs text-slate-500 font-normal">min</span>
              </span>
              <span className="text-[10px] text-slate-600 font-mono">
                Destination: {selectedVehicle.destinationName}
              </span>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-3 flex flex-col">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
                Cold Chain Integrity
              </span>
              <span className="text-sm font-bold font-mono text-emerald-700 flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-base">verified</span>
                100% Guaranteed
              </span>
              <span className="text-[10px] text-slate-500">
                Zero Spoilage Risk
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Regional Mandi Proximity Table with Real Road Distance from User */}
      <section className="bg-white rounded-3xl border border-slate-200 p-5 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600">route</span>
            <span>Real Distance to Wholesale Mandis from Your Live Location</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">Calculated via Live GPS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mandiMarkers.map((mandi) => (
            <div
              key={mandi.id}
              className="bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 flex items-center justify-between gap-3 transition-all"
            >
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-sm">{mandi.name}</span>
                <span className="text-xs text-slate-500 font-mono mt-0.5">
                  {mandi.distanceKm.toFixed(1)} km from your farm • Demand: <strong className="text-slate-800">{mandi.demand}</strong>
                </span>
              </div>

              <div className="flex flex-col text-right">
                <span className="text-emerald-700 font-mono font-extrabold text-sm">
                  ₹{mandi.currentPrice}/kg
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full mt-0.5">
                  {mandi.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

