import React, { useState } from 'react';
import { SmartAlert, ScreenId } from '../../types';

interface AlertsScreenProps {
  alerts: SmartAlert[];
  onDismissAlert: (id: string) => void;
  onNavigate: (screen: ScreenId) => void;
  onOpenAdjustEnv: () => void;
}

export const AlertsScreen: React.FC<AlertsScreenProps> = ({
  alerts,
  onDismissAlert,
  onNavigate,
  onOpenAdjustEnv
}) => {
  const [smsSent, setSmsSent] = useState<boolean>(false);
  const activeAlerts = alerts.filter((a) => !a.dismissed);

  const handleSendSmsAlert = () => {
    setSmsSent(true);
    setTimeout(() => {
      setSmsSent(false);
    }, 4000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-4 pb-28 space-y-6">
      {/* Header */}
      <section className="w-full bg-[#121212] rounded-[2rem] border border-emerald-500/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden bg-gradient-to-r from-emerald-950/30 via-[#121212] to-[#121212]">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-bold">
            Cold Chain Safety Guardian
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Smart Alerts & Diagnostics
          </h2>
          <span className="text-xs text-white/50 font-mono">
            Automated sensor monitoring for door leaks, solar depletion & cooling faults
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('emergency')}
            className="px-4 py-2 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 hover:bg-red-900/50 text-xs font-bold font-mono flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-sm text-red-400">emergency</span>
            <span>Emergency Mode</span>
          </button>
          <span className="text-xs font-mono font-bold px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-xl">
            {activeAlerts.length} Active Events
          </span>
        </div>
      </section>

      {/* 3-Tier Status Banner for Farmers ⭐ */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Tier 1: Safe */}
        <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">verified</span>
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 block">🟢 STORAGE SAFE</span>
            <span className="text-[11px] text-white/60">Unit 01 (Jorhat) & Unit 02 (Golaghat)</span>
          </div>
        </div>

        {/* Tier 2: Low Backup */}
        <div className="bg-yellow-950/20 border border-yellow-500/40 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">battery_alert</span>
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-yellow-400 block">🟡 LOW BACKUP</span>
            <span className="text-[11px] text-white/60">Unit 04 (Shillong) - 2h battery remaining</span>
          </div>
        </div>

        {/* Tier 3: Cooling Problem */}
        <div className="bg-red-950/20 border border-red-500/40 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">error</span>
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-red-400 block">🔴 COOLING ALERT</span>
            <span className="text-[11px] text-white/60">Unit 03 (Dimapur) - Door open &gt;3 mins</span>
          </div>
        </div>
      </section>

      {/* Voice/SMS Broadcast Banner */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-2xl text-emerald-400">cell_tower</span>
          <div>
            <h4 className="text-sm font-bold text-white">Farmer Cooperative SMS & IVR Broadcast</h4>
            <p className="text-xs text-white/60">
              Send automated Assamese / Hindi voice phone call alerts to registered village farmers
            </p>
          </div>
        </div>

        <button
          onClick={handleSendSmsAlert}
          disabled={smsSent}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shrink-0 transition-all shadow-md flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base">
            {smsSent ? 'check_circle' : 'sms'}
          </span>
          <span>{smsSent ? 'Voice SMS Dispatched!' : 'Send SMS / Voice Alert'}</span>
        </button>
      </div>

      {activeAlerts.length === 0 ? (
        <div className="bg-[#121212] rounded-[2.5rem] p-8 text-center border border-white/5 space-y-3">
          <span className="material-symbols-outlined text-5xl text-emerald-400">
            verified
          </span>
          <h3 className="text-lg font-bold text-white">All Mini Cold Storage Units Operating Optimally</h3>
          <p className="text-xs font-mono text-white/40">
            Zero anomalies detected across thermal chambers, battery packs, and Phase Change Material buffers.
          </p>
        </div>
      ) : (
        <div className="space-y-4 flex flex-col">
          {activeAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isAttention = alert.severity === 'attention';

            return (
              <div
                key={alert.id}
                id={`alert-card-${alert.id}`}
                className={`bg-[#121212] rounded-[2.5rem] p-5 sm:p-6 flex flex-col gap-3 relative overflow-hidden transition-all ${
                  isCritical
                    ? 'border border-red-500/50 shadow-lg shadow-red-500/10'
                    : isAttention
                    ? 'border border-yellow-500/40 shadow-lg shadow-yellow-500/5'
                    : 'border border-white/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Severity Icon */}
                  <div
                    className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${
                      isCritical
                        ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                        : isAttention
                        ? 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-400'
                        : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">
                      {isCritical
                        ? 'emergency_home'
                        : isAttention
                        ? 'battery_alert'
                        : 'sensor_door'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase tracking-widest ${
                          isCritical
                            ? 'text-red-400'
                            : isAttention
                            ? 'text-yellow-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {isCritical
                          ? '🔴 CRITICAL ANOMALY'
                          : isAttention
                          ? '🟡 THRESHOLD ATTENTION'
                          : '🟢 SYSTEM INFO'}
                      </span>
                      <span className="text-[10px] font-mono text-white/40">
                        {alert.timeAgo}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                      {alert.title}
                    </h3>

                    <p className="text-xs text-white/70 mb-4 leading-relaxed">
                      {alert.description}
                    </p>

                    {/* Action buttons */}
                    {isCritical ? (
                      <div className="flex gap-2.5">
                        <button
                          onClick={() => onNavigate('emergency')}
                          className="bg-red-500 hover:bg-red-400 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex-1 flex items-center justify-center gap-1.5 shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                        >
                          <span className="material-symbols-outlined text-base">emergency</span>
                          <span>Activate Emergency PCM Mode</span>
                        </button>
                        <button
                          onClick={() => onDismissAlert(alert.id)}
                          className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-semibold text-xs py-2.5 px-4 rounded-xl flex-1 flex items-center justify-center active:scale-95 transition-all"
                        >
                          Acknowledge
                        </button>
                      </div>
                    ) : isAttention ? (
                      <div className="flex gap-2.5">
                        <button
                          onClick={() => onNavigate('energy')}
                          className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs py-2.5 px-4 rounded-xl flex-1 flex items-center justify-center active:scale-95 transition-all"
                        >
                          Check Solar & Battery
                        </button>
                        <button
                          onClick={() => onDismissAlert(alert.id)}
                          className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 font-semibold text-xs py-2.5 px-4 rounded-xl flex-1 flex items-center justify-center active:scale-95 transition-all"
                        >
                          Dismiss
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <button
                          onClick={() => onDismissAlert(alert.id)}
                          className="bg-white/5 hover:bg-white/10 text-white/60 font-semibold text-xs py-1.5 px-4 rounded-lg flex items-center justify-center active:scale-95 transition-all"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
