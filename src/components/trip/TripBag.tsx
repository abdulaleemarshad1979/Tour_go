import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Backpack, X, ClipboardCopy, Check, Info } from 'lucide-react';
import { SpotLocation, City } from '../../types';
import { EASE_CINEMATIC } from '../../utils/animations';

interface TripBagProps {
  selectedCity: City;
  pinnedLocations: SpotLocation[];
  onTogglePin: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const TripBag: React.FC<TripBagProps> = ({
  selectedCity,
  pinnedLocations,
  onTogglePin,
  isOpen,
  onClose,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCopyItinerary = () => {
    if (pinnedLocations.length === 0) return;
    
    const header = `🎒 TOURGO ITINERARY: ${selectedCity.name.toUpperCase()}, ${selectedCity.country.toUpperCase()}\n`;
    const details = pinnedLocations
      .map((loc, idx) => `${idx + 1}. [${loc.type.toUpperCase()}] ${loc.title}\n   - Tagline: ${loc.tagline}\n   - Best Time: ${loc.timeOfDay}\n   - Cost: ${loc.cost}`)
      .join('\n\n');
    const footer = `\n\nGenerated via TourGo Discovery System (2026)`;
    
    navigator.clipboard.writeText(header + details + footer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  const drawerVariants = isMobile
    ? {
        hidden: { y: '100%', opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: EASE_CINEMATIC } },
        exit: { y: '100%', opacity: 0, transition: { duration: 0.3 } }
      }
    : {
        hidden: { x: '100%', opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: EASE_CINEMATIC } },
        exit: { x: '100%', opacity: 0, transition: { duration: 0.3 } }
      };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-stretch justify-end">
      {/* Drawer Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#0B0F19]/80 backdrop-blur-md z-40 cursor-pointer"
      />

      {/* Main Drawer Panel */}
      <motion.div
        variants={drawerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        drag={isMobile ? "y" : false}
        dragConstraints={{ top: 0 }}
        dragElastic={{ top: 0.1, bottom: 0.8 }}
        onDragEnd={(e, info) => {
          if (isMobile && info.offset.y > 150) {
            onClose();
          }
        }}
        className={`bg-[#111827] border-white/10 z-50 overflow-hidden flex flex-col shadow-2xl select-none ${
          isMobile
            ? 'w-full h-[85dvh] rounded-t-[2.5rem] border-t'
            : 'w-[480px] h-full border-l'
        }`}
      >
        {/* Swipe Handle Indicator (Mobile) */}
        {isMobile && (
          <div className="w-12 h-1 bg-white/20 rounded-full mx-auto my-3 shrink-0" />
        )}

        {/* Drawer Header */}
        <div className="p-6 border-b border-white/8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Backpack className="w-5 h-5 text-brand-accent animate-pulse" />
            <h3 className="font-display font-black text-xl uppercase tracking-tight text-white flex items-center gap-2">
              <span>Trip Bag</span>
              <span className="bg-brand-accent/15 border border-brand-accent/30 text-brand-accent font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">
                {pinnedLocations.length}
              </span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-6 no-scrollbar">
          {pinnedLocations.length > 0 ? (
            <div className="border-2 border-dashed border-brand-accent/20 rounded-3xl p-6 bg-white/2 relative overflow-hidden flex flex-col gap-5">
              {/* Ticket Top Layout cut-outs */}
              <div className="absolute top-1/2 -left-3.5 w-7 h-7 bg-[#111827] rounded-full border border-white/8" />
              <div className="absolute top-1/2 -right-3.5 w-7 h-7 bg-[#111827] rounded-full border border-white/8" />

              {/* Boarding Pass header */}
              <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div>
                  <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest block font-black">
                    Manifest Destination
                  </span>
                  <h4 className="font-display font-black text-lg text-white uppercase tracking-wider mt-0.5 italic">
                    {selectedCity.name}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest block font-black">
                    Regional Class
                  </span>
                  <span className="font-mono text-[9px] text-brand-accent uppercase tracking-wider font-bold">
                    Curated Explore
                  </span>
                </div>
              </div>

              {/* Checklist Places Row */}
              <div className="flex flex-col gap-3.5 py-2">
                {pinnedLocations.map((loc) => {
                  const isGem = loc.type === 'gem';
                  return (
                    <div
                      key={loc.id}
                      className="flex items-center justify-between gap-3 bg-white/3 border border-white/5 p-3 rounded-xl hover:border-brand-accent/15 transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Checkbox item */}
                        <button
                          onClick={() => onTogglePin(loc.id)}
                          className="w-4.5 h-4.5 rounded bg-black/40 border border-white/10 flex items-center justify-center text-brand-accent hover:border-brand-accent/40 active:scale-95 transition-all cursor-pointer"
                        >
                          <Check className="w-3 h-3 text-brand-accent" />
                        </button>
                        <div className="min-w-0 text-left">
                          <h5 className="font-display font-bold text-xs uppercase text-white truncate max-w-[240px]">
                            {loc.title}
                          </h5>
                          <span
                            className={`text-[8px] font-mono tracking-widest uppercase block mt-0.5 ${
                              isGem ? 'text-[#FFD166]' : 'text-[#52B788]'
                            }`}
                          >
                            {isGem ? '✦ Gem' : '★ Famous'}
                          </span>
                        </div>
                      </div>

                      {/* Remove X item */}
                      <button
                        onClick={() => onTogglePin(loc.id)}
                        className="p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Remove Spot"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Simulated Barcode */}
              <div className="border-t border-dashed border-white/8 pt-5 text-center flex flex-col items-center gap-1 mt-2">
                <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest font-black">
                  Security Authentication Code
                </span>
                <div className="text-brand-accent/70 tracking-tighter leading-none h-6 font-mono font-bold break-all select-none opacity-80 mt-1 select-none">
                  ████  █  ██  █ ████  ████  █  ██
                </div>
                <span className="text-[7px] font-mono text-gray-650 mt-1 uppercase tracking-wider">
                  TG_manifest_secure_v4.0
                </span>
              </div>
            </div>
          ) : (
            // EMPTY STATE ILLUSTRATION BOARDING PASS
            <div className="border border-dashed border-white/5 rounded-3xl p-8 bg-white/2 flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden py-16">
              <div className="w-14 h-14 bg-white/3 border border-white/5 rounded-full flex items-center justify-center text-2xl animate-pulse">
                🖨️
              </div>
              <div className="flex flex-col gap-1.5 max-w-xs">
                <h5 className="font-display font-black text-sm uppercase text-white tracking-widest">
                  Boarding pass empty
                </h5>
                <p className="font-sans text-xs text-gray-400 leading-relaxed">
                  No places pinned yet. Wander through discoveries, bookmark spots you want to explore, and they will load on this ticket.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM ACTIONS BAR */}
        <div className="p-4 bg-[#111827] border-t border-white/10 shrink-0">
          <button
            onClick={handleCopyItinerary}
            disabled={pinnedLocations.length === 0}
            className={`w-full text-xs font-mono tracking-widest uppercase py-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              copied
                ? 'bg-[#52B788] text-[#0B0F19] font-bold shadow-lg'
                : pinnedLocations.length === 0
                ? 'bg-white/3 text-gray-500 cursor-not-allowed border border-white/5'
                : 'bg-brand-accent text-[#0B0F19] hover:bg-brand-accent/90 shadow-md font-black hover:scale-[1.01]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <ClipboardCopy className="w-4 h-4" />
                <span>Copy Itinerary</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
