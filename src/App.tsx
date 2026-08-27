import React, { useState } from 'react';
import {
  ScreenId,
  UserProfile,
  BatchItem,
  StorageSilo,
  SmartAlert,
  CropPreset
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

// Modals
import { AddBatchModal } from './components/modals/AddBatchModal';
import { ScheduleTransportModal } from './components/modals/ScheduleTransportModal';
import { LiveCameraModal } from './components/modals/LiveCameraModal';
import { AdjustEnvModal } from './components/modals/AdjustEnvModal';
import { ChatSupportModal } from './components/modals/ChatSupportModal';

export default function App() {
  // App state
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('splash');
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [batches, setBatches] = useState<BatchItem[]>(INITIAL_BATCHES);
  const [silos, setSilos] = useState<Record<string, StorageSilo>>(INITIAL_SILOS);
  const [alerts, setAlerts] = useState<SmartAlert[]>(INITIAL_ALERTS);

  // Selected batch for AI freshness screen
  const [selectedBatch, setSelectedBatch] = useState<BatchItem>(INITIAL_BATCHES[0]);

  // Modal visibility states
  const [isGridMenuOpen, setIsGridMenuOpen] = useState(false);
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [isAdjustEnvOpen, setIsAdjustEnvOpen] = useState(false);
  const [isChatSupportOpen, setIsChatSupportOpen] = useState(false);
  const [transportModalBatch, setTransportModalBatch] = useState<BatchItem | null>(null);

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
      'silo-3': {
        ...prev['silo-3'],
        name: `Silo 3: ${preset.name}s`,
        currentTemp: (preset.recTempMin + preset.recTempMax) / 2,
        currentHumidity: preset.recHumidity,
        targetTempRange: `Target: ${preset.recTempMin}-${preset.recTempMax}°C`,
        targetHumidityRange: `Target: ${preset.recHumidity - 5}-${preset.recHumidity + 5}%`,
        statusText: `Optimal Preset Applied for ${preset.name}`
      }
    }));
  };

  // Adjust climate parameters handler
  const handleSaveAdjustments = (newTemp: number, newHumidity: number) => {
    setSilos((prev) => ({
      ...prev,
      'silo-3': {
        ...prev['silo-3'],
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
    alert(`Transport Confirmed: ${details}`);
  };

  // Unread alerts count
  const unreadAlertCount = alerts.filter((a) => !a.dismissed).length;

  // Determine if standalone screen without standard headers/navbars (e.g. splash)
  const isSplash = currentScreen === 'splash';
  const isLogin = currentScreen === 'login';

  return (
    <div className="min-h-screen bg-[#080808] text-[#f0f0f0] font-sans antialiased selection:bg-orange-500 selection:text-black flex flex-col">
      {/* Top Application Bar (Shown on all screens except splash & login) */}
      {!isSplash && !isLogin && (
        <TopAppBar
          currentScreen={currentScreen}
          onNavigate={(s) => setCurrentScreen(s)}
          onToggleGridMenu={() => setIsGridMenuOpen(true)}
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
            onNavigate={(s) => setCurrentScreen(s)}
            onOpenAddBatch={() => setIsAddBatchOpen(true)}
            onOpenLiveCamera={() => setIsLiveCameraOpen(true)}
          />
        )}

        {currentScreen === 'storage' && (
          <StorageScreen
            silos={silos}
            onNavigate={(s) => setCurrentScreen(s)}
            onOpenAdjustEnv={() => setIsAdjustEnvOpen(true)}
          />
        )}

        {currentScreen === 'configure-storage' && (
          <ConfigureStorageScreen
            onApplyProfile={handleApplyPreset}
            onNavigate={(s) => setCurrentScreen(s)}
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
            onUpdateProfile={handleUpdateProfile}
            onOpenChatSupport={() => setIsChatSupportOpen(true)}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        )}
      </main>

      {/* Persistent Material Bottom Navigation Bar (Shown on all dashboard screens) */}
      {!isSplash && !isLogin && (
        <BottomNavBar
          currentScreen={currentScreen}
          onNavigate={(s) => setCurrentScreen(s)}
          unreadAlertCount={unreadAlertCount}
        />
      )}

      {/* Screen Switcher Modal (accessible via top-left grid icon) */}
      <QuickScreenPicker
        isOpen={isGridMenuOpen}
        onClose={() => setIsGridMenuOpen(false)}
        currentScreen={currentScreen}
        onSelectScreen={(s) => setCurrentScreen(s)}
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
        silo={silos['silo-3']}
        onClose={() => setIsAdjustEnvOpen(false)}
        onSaveAdjustments={handleSaveAdjustments}
      />

      {/* Agri Support Chat Modal */}
      <ChatSupportModal
        isOpen={isChatSupportOpen}
        onClose={() => setIsChatSupportOpen(false)}
      />
    </div>
  );
}
