import React from 'react';
import { motion } from 'motion/react';
import { Compass, Map, Sparkles, Backpack, Settings } from 'lucide-react';

interface BottomNavProps {
  pinnedCount: number;
  onExplore: () => void;
  onMap: () => void;
  onGems: () => void;
  onOpenTripBag: () => void;
  onSettings: () => void;
  activeTab: 'explore' | 'map' | 'gems' | 'trip' | 'settings';
}

export const BottomNav: React.FC<BottomNavProps> = ({
  pinnedCount,
  onExplore,
  onMap,
  onGems,
  onOpenTripBag,
  onSettings,
  activeTab,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F19]/90 border-t border-brand-accent/20 backdrop-blur-lg pb-[env(safe-area-inset-bottom)] select-none">
      <div className="h-16 flex items-center justify-around px-2">
        {/* Explore */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onExplore}
          className={`flex flex-col items-center justify-center gap-1.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'explore' ? 'text-brand-accent' : 'text-gray-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[9px] font-mono uppercase tracking-wider">Explore</span>
        </motion.button>

        {/* Map */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onMap}
          className={`flex flex-col items-center justify-center gap-1.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'map' ? 'text-brand-accent' : 'text-gray-400'
          }`}
        >
          <Map className="w-5 h-5" />
          <span className="text-[9px] font-mono uppercase tracking-wider">Map</span>
        </motion.button>

        {/* Gems */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onGems}
          className={`flex flex-col items-center justify-center gap-1.5 py-1 px-3 rounded-xl transition-all cursor-pointer relative ${
            activeTab === 'gems' ? 'text-brand-accent' : 'text-gray-400'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[9px] font-mono uppercase tracking-wider">Gems</span>
        </motion.button>

        {/* Trip Bag */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onOpenTripBag}
          className={`flex flex-col items-center justify-center gap-1.5 py-1 px-3 rounded-xl transition-all cursor-pointer relative ${
            activeTab === 'trip' ? 'text-brand-accent' : 'text-gray-400'
          }`}
        >
          <Backpack className="w-5 h-5" />
          <span className="text-[9px] font-mono uppercase tracking-wider">Trip Bag</span>
          {pinnedCount > 0 && (
            <span className="absolute top-0.5 right-3 bg-brand-accent text-[#0B0F19] text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(255,209,102,0.4)]">
              {pinnedCount}
            </span>
          )}
        </motion.button>

        {/* Settings */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onSettings}
          className={`flex flex-col items-center justify-center gap-1.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'settings' ? 'text-brand-accent' : 'text-gray-400'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[9px] font-mono uppercase tracking-wider">Settings</span>
        </motion.button>
      </div>
    </div>
  );
};
