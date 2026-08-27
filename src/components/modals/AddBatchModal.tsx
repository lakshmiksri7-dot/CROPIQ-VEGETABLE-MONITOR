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
  const [siloId, setSiloId] = useState('silo-3');
  const [targetTemp, setTargetTemp] = useState('12°C');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantityKg, 10) || 40;
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
      freshnessPercent: 95,
      spoilageRisk: 'LOW',
      shelfLifeDays: 5,
      targetTemp,
      targetHumidity: '85%',
      silo: siloId,
      marketDemand: 'High',
      readyStatus: 'Ready for Transport',
      recommendedDate: 'In 3 Days'
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
        className="bg-[#121212] rounded-[2rem] w-full max-w-md shadow-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-[#141414]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-400">add_circle</span>
            <h3 className="font-light text-lg text-[#f0f0f0]">Register Crop Intake</h3>
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
              <label className="block text-[10px] font-mono uppercase tracking-widest text-orange-500 font-bold mb-1">
                Crop Type
              </label>
              <select
                value={crop}
                onChange={(e) => {
                  setCrop(e.target.value);
                  if (e.target.value === 'Tomato') {
                    setVariety('Roma');
                    setTargetTemp('12°C');
                  } else if (e.target.value === 'Lettuce') {
                    setVariety('Romaine');
                    setTargetTemp('4°C');
                  } else if (e.target.value === 'Potato') {
                    setVariety('Russet');
                    setTargetTemp('8°C');
                  } else if (e.target.value === 'Pepper') {
                    setVariety('Bell Green');
                    setTargetTemp('10°C');
                  }
                }}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-mono text-white focus:border-orange-500 outline-hidden"
              >
                <option value="Tomato" className="bg-[#121212]">Tomato</option>
                <option value="Lettuce" className="bg-[#121212]">Lettuce</option>
                <option value="Potato" className="bg-[#121212]">Potato</option>
                <option value="Pepper" className="bg-[#121212]">Pepper / Chilli</option>
                <option value="Cabbage" className="bg-[#121212]">Cabbage</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-orange-500 font-bold mb-1">
                Variety / Spec
              </label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="e.g. Roma, Hybrid"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-mono text-white focus:border-orange-500 outline-hidden"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-orange-500 font-bold mb-1">
                Quantity (kg)
              </label>
              <input
                type="number"
                min={1}
                max={5000}
                value={quantityKg}
                onChange={(e) => setQuantityKg(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-mono text-white focus:border-orange-500 outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-orange-500 font-bold mb-1">
                Target Silo
              </label>
              <select
                value={siloId}
                onChange={(e) => setSiloId(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-mono text-white focus:border-orange-500 outline-hidden"
              >
                <option value="silo-3" className="bg-[#121212]">Silo 3 (Climate Control)</option>
                <option value="silo-1" className="bg-[#121212]">Silo 1 (Cold Room)</option>
                <option value="silo-2" className="bg-[#121212]">Silo 2 (Roots Barn)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-orange-500 font-bold mb-1">
              Target Thermal Equilibrium
            </label>
            <input
              type="text"
              value={targetTemp}
              onChange={(e) => setTargetTemp(e.target.value)}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-mono text-white focus:border-orange-500 outline-hidden"
            />
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
              className="flex-1 py-3 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">check</span>
              <span>Register Intake</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
