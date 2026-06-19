import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Compass, Sparkles, Plus } from 'lucide-react';
import { SpotLocation } from '../../types';
import { PlaceCard } from './PlaceCard';
import { PlaceDetailModal } from './PlaceDetailModal';

interface DiscoveryGridProps {
  locations: SpotLocation[];
  accentColorClass: string;
  pinnedIds: string[];
  onTogglePin: (id: string) => void;
}

export const DiscoveryGrid: React.FC<DiscoveryGridProps> = ({
  locations,
  pinnedIds,
  onTogglePin,
}) => {
  const [activeDetail, setActiveDetail] = useState<SpotLocation | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(locations.length, prev + 12));
  };

  const visibleLocations = locations.slice(0, visibleCount);
  const hasMore = locations.length > visibleCount;

  if (locations.length === 0) {
    return (
      <div className="w-full text-center py-20 px-6 glass rounded-2xl flex flex-col items-center justify-center gap-4 select-none">
        <div className="w-16 h-16 bg-white/5 border border-white/8 rounded-full flex items-center justify-center text-3xl">
          <Compass className="w-8 h-8 text-brand-accent animate-pulse" />
        </div>
        <div>
          <h4 className="font-display font-black text-xl uppercase tracking-wider text-white">
            No secrets found
          </h4>
          <p className="font-sans text-sm text-gray-400 mt-1 max-w-sm">
            Try adjusting your search criteria or explore another region.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full flex flex-col gap-6 my-4 select-none">
      {/* HEADER ROW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/8 pb-4">
        <div>
          <h3 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tight text-white flex items-center gap-2">
            <span>Discover Spots</span>
            <Sparkles className="w-5 h-5 text-brand-accent animate-pulse" />
          </h3>
          <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mt-1">
            {locations.filter((l) => l.type === 'famous').length} Famous landmarks · {locations.filter((l) => l.type === 'gem').length} Hidden gems discovered
          </p>
        </div>

        <div className="flex gap-2 text-[9px] md:text-[10px] font-mono tracking-widest uppercase">
          <span className="flex items-center gap-1.5 bg-[#52B788]/10 border border-[#52B788]/30 px-3 py-1 rounded-full text-[#52B788]">
            ★ Famous Place
          </span>
          <span className="flex items-center gap-1.5 bg-[#FFD166]/10 border border-[#FFD166]/30 px-3 py-1 rounded-full text-[#FFD166]">
            ✦ Hidden Gem
          </span>
        </div>
      </div>

      {/* MASONRY/GRID CONTAINER */}
      <div className="masonry-grid">
        {visibleLocations.map((loc, idx) => (
          <div key={loc.id} className="masonry-item">
            <PlaceCard
              location={loc}
              isPinned={pinnedIds.includes(loc.id)}
              onTogglePin={onTogglePin}
              onClick={setActiveDetail}
              index={idx}
            />
          </div>
        ))}
      </div>

      {/* LOAD MORE ACTION */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="glass hover:bg-brand-accent hover:text-[#0B0F19] hover:border-brand-accent text-xs font-semibold uppercase tracking-wider py-3.5 px-8 rounded-full flex items-center gap-2 transition-all duration-300 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Load More Secrets ({locations.length - visibleCount} left)</span>
          </button>
        </div>
      )}

      {/* Place Detail Overlay */}
      <AnimatePresence>
        {activeDetail && (
          <PlaceDetailModal
            location={activeDetail}
            isPinned={pinnedIds.includes(activeDetail.id)}
            onTogglePin={onTogglePin}
            onClose={() => setActiveDetail(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
