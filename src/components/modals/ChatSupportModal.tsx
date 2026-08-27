import React, { useState } from 'react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

interface ChatSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'bot',
    text: 'Namaste Rajesh! I am your CROPIQ Agri-Support Assistant. How can I help you manage Silo 3, batch freshness, or mandi dispatch today?',
    time: 'Just now'
  }
];

export const ChatSupportModal: React.FC<ChatSupportModalProps> = ({
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = inputText.toLowerCase();
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let reply =
        'For best preservation in Silo 3, keep temperatures between 10-12°C and humidity at 85-90%. Your solar generation is currently optimal at 14.2 kW.';

      if (query.includes('tomato') || query.includes('roma')) {
        reply =
          'Tomato Batch T102 is currently at 91% freshness. We recommend dispatching within 24 hours to Guwahati APMC Mandi where wholesale prices are peaking at ₹38/kg.';
      } else if (query.includes('pepper') || query.includes('chilli')) {
        reply =
          'Pepper Batch P04 is currently holding for ripening. Estimated readiness is in 3 days. Keep temperature stable at 10°C.';
      } else if (query.includes('solar') || query.includes('battery') || query.includes('power')) {
        reply =
          'Your solar array is generating 14.2 kW with 87% battery charge. You can safely run intensive pre-cooling during daytime peak hours (10 AM - 3 PM).';
      } else if (query.includes('mandi') || query.includes('price') || query.includes('transport')) {
        reply =
          'Refrigerated Reefer vans are available for pickup tomorrow at 6:00 AM. Estimated transit time to Guwahati APMC Mandi is 3.5 hours.';
      }

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#121212] rounded-[2rem] w-full max-w-lg shadow-2xl border border-white/10 overflow-hidden flex flex-col h-[540px] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <div>
              <h3 className="font-light text-base text-[#f0f0f0]">CROPIQ Agri Intelligence</h3>
              <p className="text-[10px] font-mono text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                ONLINE • TELEMETRY SYNCED
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-[#0e0e0e]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-orange-500 text-black font-semibold rounded-br-xs'
                    : 'bg-[#181818] text-[#f0f0f0] rounded-bl-xs border border-white/5'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] font-mono text-white/30 mt-1 px-1">{m.time}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 bg-[#181818] border border-white/5 px-3 py-2 rounded-2xl w-max">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce [animation-delay:0ms]" />
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce [animation-delay:150ms]" />
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce [animation-delay:300ms]" />
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-[#121212] border-t border-white/5 flex gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => setInputText('What is the tomato batch shelf life?')}
            className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl whitespace-nowrap text-[11px] font-mono border border-white/5"
          >
            Tomato Shelf Life?
          </button>
          <button
            onClick={() => setInputText('How is today’s solar battery charging?')}
            className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl whitespace-nowrap text-[11px] font-mono border border-white/5"
          >
            Solar Charging?
          </button>
          <button
            onClick={() => setInputText('What is Guwahati mandi tomato price?')}
            className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl whitespace-nowrap text-[11px] font-mono border border-white/5"
          >
            Mandi Price?
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-white/5 bg-[#141414] flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask regarding microgrid, shelf-life or mandi rates..."
            className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-mono text-white focus:border-orange-500 outline-hidden"
          />
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-400 text-black px-4 py-2.5 rounded-2xl font-bold text-xs shadow-lg shadow-orange-500/20 flex items-center justify-center transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
