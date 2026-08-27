import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { BatchItem } from '../../types';

interface ScheduleTransportModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: BatchItem | null;
  onConfirmSchedule: (batchId: string, details: string) => void;
}

export const ScheduleTransportModal: React.FC<ScheduleTransportModalProps> = ({
  isOpen,
  onClose,
  batch,
  onConfirmSchedule
}) => {
  const [vehicleType, setVehicleType] = useState('Refrigerated Reefer Van (2-8°C)');
  const [mandiMarket, setMandiMarket] = useState('Guwahati Wholesale APMC Mandi');
  const [scheduledDate, setScheduledDate] = useState('Tomorrow 06:00 AM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !batch) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.75 }
    });

    setTimeout(() => {
      onConfirmSchedule(batch.id, `${vehicleType} to ${mandiMarket} on ${scheduledDate}`);
      setIsSubmitting(false);
      onClose();
    }, 600);
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
            <span className="material-symbols-outlined text-orange-400">local_shipping</span>
            <h3 className="font-light text-lg text-[#f0f0f0]">Dispatch Logistics & Transit</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleConfirm} className="p-6 space-y-4">
          <div className="bg-orange-500/10 p-4 rounded-2xl border border-orange-500/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-orange-500 uppercase tracking-widest block">
                Target Payload
              </span>
              <span className="font-light text-base text-[#f0f0f0]">
                {batch.crop} #{batch.batchCode} ({batch.quantityKg} kg)
              </span>
            </div>
            <span className="text-xs font-mono font-bold bg-orange-500 text-black px-2.5 py-1 rounded-xl shadow-xs">
              {batch.freshnessPercent}% Fresh
            </span>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-orange-500 font-bold mb-1">
              Vehicle Type
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-mono text-white focus:border-orange-500 outline-hidden"
            >
              <option value="Refrigerated Reefer Van (2-8°C)" className="bg-[#121212]">
                Refrigerated Reefer Van (2-8°C)
              </option>
              <option value="Covered Insulated Truck (10-15°C)" className="bg-[#121212]">
                Covered Insulated Truck (10-15°C)
              </option>
              <option value="Farmer Cooperative Eco-Tempo" className="bg-[#121212]">
                Farmer Cooperative Eco-Tempo
              </option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-orange-500 font-bold mb-1">
              Destination Market / APMC Mandi
            </label>
            <select
              value={mandiMarket}
              onChange={(e) => setMandiMarket(e.target.value)}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-mono text-white focus:border-orange-500 outline-hidden"
            >
              <option value="Guwahati Wholesale APMC Mandi" className="bg-[#121212]">
                Guwahati Wholesale APMC Mandi (Peak Price: ₹38/kg)
              </option>
              <option value="Jorhat Agri Hub Market" className="bg-[#121212]">
                Jorhat Agri Hub Market (Peak Price: ₹35/kg)
              </option>
              <option value="Local Cooperative Collection Center" className="bg-[#121212]">
                Local Cooperative Collection Center (Guaranteed MSP)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-orange-500 font-bold mb-1">
              Pickup Schedule Window
            </label>
            <input
              type="text"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-mono text-white focus:border-orange-500 outline-hidden"
              placeholder="e.g. Tomorrow 06:00 AM"
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
              disabled={isSubmitting}
              className="flex-1 py-3 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">local_shipping</span>
              <span>{isSubmitting ? 'Booking...' : 'Confirm Dispatch'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
