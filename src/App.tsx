import React, { useState, useEffect } from 'react';
import {
  ScreenId,
  UserProfile,
  BatchItem,
  StorageSilo,
  SmartAlert,
  CropPreset,
  AppLanguage
} from './types';
import {
  INITIAL_USER_PROFILE,
  INITIAL_BATCHES,
  INITIAL_SILOS,
  INITIAL_ALERTS
} from './data/mockData';

// Top and Bottom Nav
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { QuickScreenPicker } from './components/QuickScreenPicker';

// Screens
import { SplashScreen } from './components/screens/SplashScreen';
import { LoginSetupScreen } from './components/screens/LoginSetupScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { StorageScreen } from './components/screens/StorageScreen';
import { ConfigureStorageScreen } from './components/screens/ConfigureStorageScreen';
import { BatchesScreen } from './components/screens/BatchesScreen';
import { FreshnessScreen } from './components/screens/FreshnessScreen';
import { EnergyScreen } from './components/screens/EnergyScreen';
import { MarketReadinessScreen } from './components/screens/MarketReadinessScreen';
import { HistoryScreen } from './components/screens/HistoryScreen';
import { AlertsScreen } from './components/screens/AlertsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { CooperativeMultiUnitScreen } from './components/screens/CooperativeMultiUnitScreen';
import { MapLocationsScreen } from './components/screens/MapLocationsScreen';
import { HarvestTimelineScreen } from './components/screens/HarvestTimelineScreen';
import { AiVisualQualityScreen } from './components/screens/AiVisualQualityScreen';
import { EmergencyModeScreen } from './components/screens/EmergencyModeScreen';

// Modals
import { AddBatchModal } from './components/modals/AddBatchModal';
import { ScheduleTransportModal } from './components/modals/ScheduleTransportModal';
import { LiveCameraModal } from './components/modals/LiveCameraModal';
import { AdjustEnvModal } from './components/modals/AdjustEnvModal';
import { ChatSupportModal } from './components/modals/ChatSupportModal';
import { InstallAppModal } from './components/modals/InstallAppModal';
import { VoiceAssistantModal } from './components/modals/VoiceAssistantModal';
import { QrBatchScannerModal } from './components/modals/QrBatchScannerModal';

export default function App() {
  // App state
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [batches, setBatches] = useState<BatchItem[]>(INITIAL_BATCHES);
  const [silos, setSilos] = useState<Record<string, StorageSilo>>(INITIAL_SILOS);
  const [alerts, setAlerts] = useState<SmartAlert[]>(INITIAL_ALERTS);

  // Selected batch for AI freshness screen
  const [selectedBatch, setSelectedBatch] = useState<BatchItem>(INITIAL_BATCHES[0]);

  // Modal visibility states
  const [isGridMenuOpen, setIsGridMenuOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [isAdjustEnvOpen, setIsAdjustEnvOpen] = useState(false);
  const [isChatSupportOpen, setIsChatSupportOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [transportModalBatch, setTransportModalBatch] = useState<BatchItem | null>(null);

  // Listen for browser PWA install event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  // Update profile handler
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  // Add new batch handler
  const handleAddBatch = (newBatch: BatchItem) => {
    setBatches((prev) => [newBatch, ...prev]);
    setSelectedBatch(newBatch);
  };

  // Dismiss alert handler
  const handleDismissAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, dismissed: true } : a))
    );
  };

  // Apply storage preset handler
  const handleApplyPreset = (preset: CropPreset) => {
    setSilos((prev) => ({
      ...prev,
      'unit-01': {
        ...prev['unit-01'],
        cropName: preset.name,
        name: `Unit 01 – Jorhat Central (${preset.name})`,
        currentTemp: (preset.recTempMin + preset.recTempMax) / 2,
        currentHumidity: preset.recHumidity,
        targetTempRange: `${preset.recTempMin}-${preset.recTempMax}°C`,
        targetHumidityRange: `${preset.recHumidity - 5}-${preset.recHumidity + 5}%`,
        statusText: `Optimal Preset Applied for ${preset.name}`
      }
    }));
  };

  // Adjust climate parameters handler
  const handleSaveAdjustments = (newTemp: number, newHumidity: number) => {
    setSilos((prev) => ({
      ...prev,
      'unit-01': {
        ...prev['unit-01'],
        currentTemp: newTemp,
        currentHumidity: newHumidity,
        statusText: 'Optimal Conditions Maintained'
      }
    }));
  };

  // Schedule transport confirmation
  const handleConfirmSchedule = (batchId: string, details: string) => {
    setBatches((prev) =>
      prev.map((b) =>
        b.id === batchId ? { ...b, status: 'Cooling' } : b
      )
    );
    alert(`Shared Transport Scheduled Successfully:\n${details}`);
  };

  // Unread alerts count
  const unreadAlertCount = alerts.filter((a) => !a.dismissed).length;

  // Determine if standalone screen without standard headers/navbars (e.g. splash)
  const isSplash = currentScreen === 'splash';
  const isLogin = currentScreen === 'login';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-600 selection:text-white flex flex-col">
      {/* Top Application Bar */}
      {!isSplash && !isLogin && (
        <TopAppBar
          currentScreen={currentScreen}
          language={language}
          onSetLanguage={(l) => setLanguage(l)}
          onNavigate={(s) => setCurrentScreen(s)}
          onToggleGridMenu={() => setIsGridMenuOpen(true)}
          onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          unreadAlertCount={unreadAlertCount}
        />
      )}

      {/* Main Screen Content Viewport */}
      <main
        className={`flex-1 w-full ${
          !isSplash && !isLogin ? 'pt-16 pb-20' : ''
        }`}
      >
        {currentScreen === 'splash' && (
          <SplashScreen
            onProceed={(target) => setCurrentScreen(target || 'login')}
          />
        )}

        {currentScreen === 'login' && (
          <LoginSetupScreen
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onProceed={(target) => setCurrentScreen(target)}
          />
        )}

        {currentScreen === 'home' && (
          <HomeScreen
            batches={batches}
            silos={silos}
            language={language}
            onNavigate={(s) => setCurrentScreen(s)}
            onOpenAddBatch={() => setIsAddBatchOpen(true)}
            onOpenLiveCamera={() => setIsLiveCameraOpen(true)}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            onOpenQrScanner={() => setIsQrScannerOpen(true)}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
          />
        )}

        {currentScreen === 'storage' && (
          <StorageScreen
            silos={silos}
            onNavigate={(s) => setCurrentScreen(s)}
            onOpenAdjustEnv={() => setIsAdjustEnvOpen(true)}
          />
        )}

        {currentScreen === 'cooperative' && (
          <CooperativeMultiUnitScreen
            silos={silos}
            onNavigate={(s) => setCurrentScreen(s)}
            onOpenAdjustEnv={() => setIsAdjustEnvOpen(true)}
          />
        )}

        {currentScreen === 'map-locations' && (
          <MapLocationsScreen
            silos={silos}
            onNavigate={(s) => setCurrentScreen(s)}
            onSelectUnit={() => setCurrentScreen('storage')}
            language={language}
          />
        )}

        {currentScreen === 'configure-storage' && (
          <ConfigureStorageScreen
            language={language}
            onApplyProfile={handleApplyPreset}
            onNavigate={(s) => setCurrentScreen(s)}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          />
        )}

        {currentScreen === 'batches' && (
          <BatchesScreen
            batches={batches}
            onOpenAddBatch={() => setIsAddBatchOpen(true)}
            onSelectBatchForFreshness={(batch) => {
              setSelectedBatch(batch);
              setCurrentScreen('freshness');
            }}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        )}

        {currentScreen === 'timeline' && (
          <HarvestTimelineScreen
            batch={selectedBatch}
            onNavigate={(s) => setCurrentScreen(s)}
            onOpenQrScanner={() => setIsQrScannerOpen(true)}
          />
        )}

        {currentScreen === 'ai-quality' && (
          <AiVisualQualityScreen
            batch={selectedBatch}
            onNavigate={(s) => setCurrentScreen(s)}
            onScheduleTransport={(b) => setTransportModalBatch(b)}
          />
        )}

        {currentScreen === 'freshness' && (
          <FreshnessScreen
            batch={selectedBatch}
            onNavigate={(s) => setCurrentScreen(s)}
            onOpenAdjustEnv={() => setIsAdjustEnvOpen(true)}
            onOpenLiveCamera={() => setIsLiveCameraOpen(true)}
          />
        )}

        {currentScreen === 'energy' && (
          <EnergyScreen onNavigate={(s) => setCurrentScreen(s)} />
        )}

        {currentScreen === 'emergency' && (
          <EmergencyModeScreen
            language={language}
            activeSilo={silos['unit-01'] || Object.values(silos)[0]}
            onUpdateSilo={(updated) =>
              setSilos((prev) => ({ ...prev, [updated.id || 'unit-01']: updated }))
            }
            onNavigate={(s) => setCurrentScreen(s)}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          />
        )}

        {currentScreen === 'market' && (
          <MarketReadinessScreen
            batches={batches}
            onOpenScheduleTransport={(batch) => setTransportModalBatch(batch)}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        )}

        {currentScreen === 'history' && (
          <HistoryScreen onNavigate={(s) => setCurrentScreen(s)} />
        )}

        {currentScreen === 'alerts' && (
          <AlertsScreen
            alerts={alerts}
            onDismissAlert={handleDismissAlert}
            onNavigate={(s) => setCurrentScreen(s)}
            onOpenAdjustEnv={() => setIsAdjustEnvOpen(true)}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            userProfile={userProfile}
            language={language}
            onSetLanguage={(l) => setLanguage(l)}
            onUpdateProfile={handleUpdateProfile}
            onOpenChatSupport={() => setIsChatSupportOpen(true)}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        )}
      </main>

      {/* Persistent Bottom Navigation Bar */}
      {!isSplash && !isLogin && (
        <>
          <BottomNavBar
            currentScreen={currentScreen}
            onNavigate={(s) => setCurrentScreen(s)}
            unreadAlertCount={unreadAlertCount}
          />

          {/* Floating Farmer Voice Assistant Button */}
          {!isVoiceModalOpen && (
            <button
              id="btn-floating-voice-assistant"
              onClick={() => setIsVoiceModalOpen(true)}
              className="fixed bottom-20 right-4 sm:bottom-22 sm:right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3.5 sm:p-4 shadow-xl shadow-emerald-900/30 flex items-center gap-2 border-2 border-white ring-4 ring-emerald-400/30 hover:scale-105 active:scale-95 transition-all group animate-bounce duration-1000"
              title="Speak to CROPIQ AI Voice Assistant"
            >
              <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">
                mic
              </span>
              <span className="hidden sm:inline-block text-xs font-extrabold pr-1 tracking-wide">
                {language === 'ta' ? 'குரல் உதவி' : language === 'hi' ? 'बोलकर पूछें' : language === 'as' ? 'ভয়েচ' : 'Voice Agent'}
              </span>
            </button>
          )}
        </>
      )}

      {/* Screen Switcher Modal */}
      <QuickScreenPicker
        isOpen={isGridMenuOpen}
        onClose={() => setIsGridMenuOpen(false)}
        currentScreen={currentScreen}
        onSelectScreen={(s) => setCurrentScreen(s)}
      />

      {/* Voice-First Farmer Assistant Modal ⭐ */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        language={language}
        onSetLanguage={(l) => setLanguage(l)}
        onNavigate={(s) => setCurrentScreen(s)}
        silo={silos['unit-01'] || Object.values(silos)[0]}
        batches={batches}
      />

      {/* QR Batch Traceability Scanner Modal */}
      <QrBatchScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        batches={batches}
        language={language}
        onNavigate={(s) => setCurrentScreen(s)}
      />

      {/* Add Batch Modal */}
      <AddBatchModal
        isOpen={isAddBatchOpen}
        onClose={() => setIsAddBatchOpen(false)}
        onAddBatch={handleAddBatch}
      />

      {/* Schedule Transport Modal */}
      <ScheduleTransportModal
        isOpen={!!transportModalBatch}
        batch={transportModalBatch}
        onClose={() => setTransportModalBatch(null)}
        onConfirmSchedule={handleConfirmSchedule}
      />

      {/* Live Camera Feed Modal */}
      <LiveCameraModal
        isOpen={isLiveCameraOpen}
        onClose={() => setIsLiveCameraOpen(false)}
      />

      {/* Adjust Chamber Climate Modal */}
      <AdjustEnvModal
        isOpen={isAdjustEnvOpen}
        silo={silos['unit-01'] || Object.values(silos)[0]}
        onClose={() => setIsAdjustEnvOpen(false)}
        onSaveAdjustments={handleSaveAdjustments}
      />

      {/* Agri Support Chat Modal */}
      <ChatSupportModal
        isOpen={isChatSupportOpen}
        onClose={() => setIsChatSupportOpen(false)}
      />

      {/* Install CROPIQ Universal PWA Modal */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onInstallClick={handleInstallClick}
      />
    </div>
  );
}
