import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { BatchItem } from '../../types';

interface AddBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBatch: (batch: BatchItem) => void;
}

export const AddBatchModal: React.FC<AddBatchModalProps> = ({
  isOpen,
  onClose,
  onAddBatch
}) => {
  const [crop, setCrop] = useState('Tomato');
  const [variety, setVariety] = useState('Roma');
  const [quantityKg, setQuantityKg] = useState('50');
  const [siloId, setSiloId] = useState('Unit 01 – Jorhat Central');
  const [targetTemp, setTargetTemp] = useState('8-12°C');
  const [farmerName, setFarmerName] = useState('Pranjal Saikia');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantityKg, 10) || 50;
    const randomCodeNum = Math.floor(100 + Math.random() * 900);
    const codeLetter = crop.charAt(0).toUpperCase();
    const batchCode = `${codeLetter}${randomCodeNum}`;

    const newBatch: BatchItem = {
      id: `batch-${Date.now()}`,
      batchCode,
      crop,
      variety: variety || 'Standard',
      quantityKg: qty,
      storedDate: 'Today',
      status: 'Stable',
      freshnessPercent: 96,
      spoilageRisk: 'LOW',
      shelfLifeDays: 5,
      targetTemp,
      targetHumidity: '85-90%',
      silo: siloId,
      farmerName,
      farmerPhone: '+91 94350-12844',
      transportRecommendation: 'Transport Today',
      transportReason: 'High market demand at Pamohi Wholesale Mandi (₹44/kg). Optimal dispatch window.',
      targetMandi: 'Guwahati (Pamohi Mandi)',
      marketPriceEstimate: 44,
      marketDemand: 'High',
      readyStatus: 'Ready for Transport',
      recommendedDate: 'Tomorrow Morning',
      qrCodeValue: `CROPIQ-${batchCode}-${Date.now().toString().slice(-4)}`
    };

    onAddBatch(newBatch);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#121212] rounded-[2.5rem] w-full max-w-md shadow-2xl border border-emerald-500/30 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">add_circle</span>
            </div>
            <h3 className="font-bold text-lg text-white">Register Crop Intake & QR Pass</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold mb-1">
                Crop Type
              </label>
              <select
                value={crop}
                onChange={(e) => {
                  setCrop(e.target.value);
                  if (e.target.value === 'Tomato') {
                    setVariety('Roma');
                    setTargetTemp('8-12°C');
                  } else if (e.target.value === 'Bhut Jolokia') {
                    setVariety('Naga King Chilli');
                    setTargetTemp('7-10°C');
                  } else if (e.target.value === 'Ginger') {
                    setVariety('Nadia Fresh Rhizome');
                    setTargetTemp('12-14°C');
                  } else if (e.target.value === 'Broccoli') {
                    setVariety('Green Magic');
                    setTargetTemp('1-3°C');
                  }
                }}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-mono text-white focus:border-emerald-500 outline-none"
              >
                <option value="Tomato" className="bg-[#121212]">Tomato (Assam Local)</option>
                <option value="Bhut Jolokia" className="bg-[#121212]">Bhut Jolokia (King Chilli)</option>
                <option value="Ginger" className="bg-[#121212]">Organic Ginger (Karbi)</option>
                <option value="Broccoli" className="bg-[#121212]">Broccoli (Green Magic)</option>
                <option value="Cabbage" className="bg-[#121212]">Cabbage / Green Leaf</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold mb-1">
                Variety / Cultivar
              </label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="e.g. Roma, Hybrid"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-mono text-white focus:border-emerald-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold mb-1">
                Quantity (kg)
              </label>
              <input
                type="number"
                min={1}
                max={5000}
                value={quantityKg}
                onChange={(e) => setQuantityKg(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-mono text-white focus:border-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold mb-1">
                Farmer / Grower
              </label>
              <input
                type="text"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-mono text-white focus:border-emerald-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold mb-1">
              Storage Chamber Unit
            </label>
            <select
              value={siloId}
              onChange={(e) => setSiloId(e.target.value)}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-mono text-white focus:border-emerald-500 outline-none"
            >
              <option value="Unit 01 – Jorhat Central" className="bg-[#121212]">Unit 01 – Jorhat Central (Solanaceous)</option>
              <option value="Unit 02 – Golaghat FPO Hub" className="bg-[#121212]">Unit 02 – Golaghat FPO Hub (Rhizomes)</option>
              <option value="Unit 03 – Dimapur Collection Centre" className="bg-[#121212]">Unit 03 – Dimapur Collection Centre</option>
              <option value="Unit 04 – Shillong High-Altitude Unit" className="bg-[#121212]">Unit 04 – Shillong High-Altitude Unit</option>
            </select>
          </div>

          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white/70 font-mono text-xs rounded-2xl transition-colors border border-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">qr_code</span>
              <span>Generate Batch Pass</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
