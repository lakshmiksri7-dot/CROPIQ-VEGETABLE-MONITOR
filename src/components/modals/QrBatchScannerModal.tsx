import React, { useState } from 'react';
import { BatchItem, AppLanguage } from '../../types';

interface QrBatchScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  batches: BatchItem[];
  language: AppLanguage;
  onNavigate: (screen: any) => void;
}

export const QrBatchScannerModal: React.FC<QrBatchScannerModalProps> = ({
  isOpen,
  onClose,
  batches,
  language,
  onNavigate
}) => {
  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || 'b-102');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const selectedBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Pick random next batch
      const other = batches.find((b) => b.id !== selectedBatchId) || batches[0];
      setSelectedBatchId(other.id);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#121212] border border-emerald-500/30 rounded-[2.5rem] w-full max-w-lg overflow-hidden flex flex-col shadow-2xl shadow-emerald-950/40 max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-emerald-950/40 via-[#121212] to-[#121212]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                {language === 'as' ? 'QR বেচ ট্ৰেকিং' : language === 'hi' ? 'क्यूआर बैच ट्रैकिंग' : 'QR Batch Traceability'}
              </h3>
              <p className="text-xs text-emerald-400/80 font-mono">
                Instant Cold Storage & Mandi Pass
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-all"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col items-center gap-5 overflow-y-auto">
          {/* Simulated QR Code Canvas */}
          <div className="relative p-5 bg-white rounded-3xl flex flex-col items-center justify-center shadow-xl">
            {/* Real SVG QR Pattern */}
            <svg
              className="w-44 h-44"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Corner position markers */}
              <rect x="5" y="5" width="26" height="26" rx="4" fill="#047857" />
              <rect x="9" y="9" width="18" height="18" fill="white" />
              <rect x="13" y="13" width="10" height="10" fill="#047857" />

              <rect x="69" y="5" width="26" height="26" rx="4" fill="#047857" />
              <rect x="73" y="9" width="18" height="18" fill="white" />
              <rect x="77" y="13" width="10" height="10" fill="#047857" />

              <rect x="5" y="69" width="26" height="26" rx="4" fill="#047857" />
              <rect x="9" y="73" width="18" height="18" fill="white" />
              <rect x="13" y="77" width="10" height="10" fill="#047857" />

              {/* Data matrix dots */}
              <rect x="36" y="8" width="6" height="6" fill="#111827" />
              <rect x="46" y="8" width="6" height="6" fill="#111827" />
              <rect x="56" y="8" width="6" height="6" fill="#111827" />

              <rect x="36" y="18" width="6" height="6" fill="#111827" />
              <rect x="56" y="18" width="6" height="6" fill="#111827" />

              <rect x="8" y="36" width="6" height="6" fill="#111827" />
              <rect x="18" y="36" width="6" height="6" fill="#111827" />
              <rect x="28" y="36" width="6" height="6" fill="#111827" />
              <rect x="38" y="36" width="6" height="6" fill="#111827" />
              <rect x="48" y="36" width="6" height="6" fill="#111827" />
              <rect x="68" y="36" width="6" height="6" fill="#111827" />
              <rect x="78" y="36" width="6" height="6" fill="#111827" />
              <rect x="88" y="36" width="6" height="6" fill="#111827" />

              <rect x="8" y="46" width="6" height="6" fill="#111827" />
              <rect x="28" y="46" width="6" height="6" fill="#111827" />
              <rect x="48" y="46" width="6" height="6" fill="#047857" />
              <rect x="68" y="46" width="6" height="6" fill="#111827" />
              <rect x="88" y="46" width="6" height="6" fill="#111827" />

              <rect x="8" y="56" width="6" height="6" fill="#111827" />
              <rect x="18" y="56" width="6" height="6" fill="#111827" />
              <rect x="38" y="56" width="6" height="6" fill="#111827" />
              <rect x="58" y="56" width="6" height="6" fill="#111827" />
              <rect x="78" y="56" width="6" height="6" fill="#111827" />

              <rect x="36" y="68" width="6" height="6" fill="#111827" />
              <rect x="46" y="68" width="6" height="6" fill="#111827" />
              <rect x="66" y="68" width="6" height="6" fill="#111827" />
              <rect x="86" y="68" width="6" height="6" fill="#111827" />

              <rect x="46" y="78" width="6" height="6" fill="#111827" />
              <rect x="56" y="78" width="6" height="6" fill="#111827" />
              <rect x="76" y="78" width="6" height="6" fill="#111827" />

              <rect x="36" y="88" width="6" height="6" fill="#111827" />
              <rect x="56" y="88" width="6" height="6" fill="#111827" />
              <rect x="66" y="88" width="6" height="6" fill="#111827" />
              <rect x="86" y="88" width="6" height="6" fill="#111827" />
            </svg>

            <span className="font-mono text-black font-bold text-xs mt-2">
              {selectedBatch.qrCodeValue || `CROPIQ-${selectedBatch.batchCode}`}
            </span>
          </div>

          {/* Batch Selector Dropdown */}
          <div className="w-full flex items-center justify-between gap-2">
            <span className="text-xs text-white/50 font-mono">Select Batch:</span>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="bg-white/10 border border-white/10 text-white rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-emerald-500"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id} className="bg-[#121212] text-white">
                  Batch {b.batchCode} - {b.crop} ({b.quantityKg}kg)
                </option>
              ))}
            </select>
          </div>

          {/* Traceability Details Card */}
          <div className="w-full bg-[#181818] border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div>
                <span className="text-[10px] text-white/40 font-mono uppercase block">Batch Product</span>
                <span className="text-base font-bold text-white">
                  {selectedBatch.crop} ({selectedBatch.variety})
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/40 font-mono uppercase block">Freshness</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {selectedBatch.freshnessPercent}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/5 rounded-xl p-2.5">
                <span className="text-[10px] text-white/40 font-mono uppercase block">Farmer</span>
                <span className="font-semibold text-white">{selectedBatch.farmerName}</span>
                <span className="text-[10px] text-white/50 block font-mono">{selectedBatch.farmerPhone}</span>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5">
                <span className="text-[10px] text-white/40 font-mono uppercase block">Stored Location</span>
                <span className="font-semibold text-white">{selectedBatch.silo}</span>
                <span className="text-[10px] text-white/50 block font-mono">Since {selectedBatch.storedDate}</span>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5">
                <span className="text-[10px] text-white/40 font-mono uppercase block">Optimal Target</span>
                <span className="font-semibold text-emerald-300 font-mono">{selectedBatch.targetTemp}</span>
                <span className="text-[10px] text-white/50 block font-mono">RH: {selectedBatch.targetHumidity}</span>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5">
                <span className="text-[10px] text-white/40 font-mono uppercase block">Transport Target</span>
                <span className="font-semibold text-emerald-400">{selectedBatch.transportRecommendation}</span>
                <span className="text-[10px] text-white/50 block font-mono">{selectedBatch.targetMandi}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="w-full flex gap-3">
            <button
              onClick={handleSimulateScan}
              disabled={isScanning}
              className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-sm">
                {isScanning ? 'sync' : 'camera_alt'}
              </span>
              <span>{isScanning ? 'Scanning QR...' : 'Scan New QR Code'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onNavigate('timeline');
              }}
              className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20"
            >
              <span className="material-symbols-outlined text-sm">timeline</span>
              <span>View Full Timeline</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
