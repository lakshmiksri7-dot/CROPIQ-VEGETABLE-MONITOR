import React from 'react';
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
  const activeAlerts = alerts.filter((a) => !a.dismissed);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pt-4 pb-28 space-y-6">
      {/* Header */}
      <div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold block mb-1">
              Automated Incident Diagnostics
            </span>
            <h2 className="text-2xl sm:text-3xl font-light text-[#f0f0f0] tracking-tight">Smart Alerts</h2>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 bg-orange-500/15 border border-orange-500/30 text-orange-400 rounded-full">
            {activeAlerts.length} Active Incidents
          </span>
        </div>
        <p className="text-xs font-mono text-white/40 mt-1">
          Review sensor threshold excursions and chamber telemetry exceptions.
        </p>
      </div>

      {activeAlerts.length === 0 ? (
        <div className="bg-[#121212] rounded-[2rem] p-8 text-center border border-white/5 shadow-xs space-y-3">
          <span className="material-symbols-outlined text-5xl text-green-400">
            verified
          </span>
          <h3 className="text-lg font-light text-[#f0f0f0]">All Systems Operating Within Parameters</h3>
          <p className="text-xs font-mono text-white/40">
            No active chamber anomalies. Thermal gradients, relative humidity, and gas sensors are optimal.
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
                className={`bg-[#121212] rounded-[2rem] p-5 sm:p-6 flex flex-col gap-3 relative overflow-hidden transition-all ${
                  isCritical
                    ? 'border border-red-500/40 shadow-lg shadow-red-500/5'
                    : isAttention
                    ? 'border border-orange-500/40 shadow-lg shadow-orange-500/5'
                    : 'border border-white/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Severity Icon */}
                  <div
                    className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center ${
                      isCritical
                        ? 'bg-red-500/15 border border-red-500/30 text-red-400'
                        : isAttention
                        ? 'bg-orange-500/15 border border-orange-500/30 text-orange-400'
                        : 'bg-white/5 border border-white/10 text-white/50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {isCritical
                        ? 'thermostat'
                        : isAttention
                        ? 'water_drop'
                        : alert.title.includes('Battery')
                        ? 'battery_charging_full'
                        : 'door_open'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase tracking-widest ${
                          isCritical
                            ? 'text-red-400'
                            : isAttention
                            ? 'text-orange-400'
                            : 'text-white/40'
                        }`}
                      >
                        {isCritical
                          ? 'CRITICAL DEVIATION'
                          : isAttention
                          ? 'THRESHOLD ATTENTION'
                          : 'SYSTEM INFO'}
                      </span>
                      <span className="text-[10px] font-mono text-white/40">
                        {alert.timeAgo}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-light text-[#f0f0f0] mb-1">
                      {alert.title}
                    </h3>

                    <p className="text-xs text-white/70 mb-4 leading-relaxed font-sans">
                      {alert.description}
                    </p>

                    {/* Action buttons */}
                    {isCritical ? (
                      <div className="flex gap-2.5">
                        <button
                          onClick={() => {
                            onNavigate('storage');
                            onOpenAdjustEnv();
                          }}
                          className="bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs py-2.5 px-4 rounded-xl flex-1 flex items-center justify-center shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                        >
                          Calibrate Chamber
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
                          onClick={() => onNavigate('storage')}
                          className="bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex-1 flex items-center justify-center active:scale-95 transition-all"
                        >
                          View Chamber
                        </button>
                        <button
                          onClick={() => onDismissAlert(alert.id)}
                          className="bg-white/5 hover:bg-white/10 text-white/60 font-semibold text-xs py-2.5 px-4 rounded-xl flex-1 flex items-center justify-center active:scale-95 transition-all"
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
