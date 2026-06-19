import React, { useState } from 'react';
import { Star, Bookmark, Navigation, Compass, Castle, Trees, Footprints, Building2, Utensils } from 'lucide-react';
import { SpotLocation } from '../../types';
import { motion } from 'motion/react';
import { cardReveal, EASE_CINEMATIC } from '../../utils/animations';

interface PlaceCardProps {
  location: SpotLocation;
  isPinned: boolean;
  onTogglePin: (id: string) => void;
  onClick: (location: SpotLocation) => void;
  index: number;
}

export const PlaceImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className = '' }) => {
  const [failed, setFailed] = useState(false);
  const isPlaceholder = src && src.startsWith('placeholder://');

  if (failed || !src || isPlaceholder) {
    const t = (alt || '').toLowerCase();
    let forcedCategory = isPlaceholder ? src.replace('placeholder://', '') : '';
    let IconComponent = Compass;
    let gradientClass = 'from-[#ff7e5f] to-[#feb47b]'; // warm sunset
    let category = 'explore';

    const cat = forcedCategory || t;

    if (cat.includes('spiritual') || /temple|spiritual|mosque|church|ashram|shrine|sanctum|monastery/.test(cat)) {
      IconComponent = Building2;
      gradientClass = 'from-[#8a2be2] to-[#4a00e0]'; // deep violet
      category = 'spiritual';
    } else if (cat.includes('historical') || /fort|palace|mahal|museum|heritage|archaeology|ruins|qila|bastion|tomb|monument/.test(cat)) {
      IconComponent = Castle;
      gradientClass = 'from-[#a1c4fd] to-[#c2e9fb]'; // historic steel blue
      category = 'historical';
    } else if (cat.includes('coastal') || /beach|sea|coast|port|lagoon|island|lighthouse|waterfall|falls|lake|river|dam|canal/.test(cat)) {
      IconComponent = Trees;
      gradientClass = 'from-[#4facfe] to-[#00f2fe]'; // coastal blue
      category = 'coastal/water';
    } else if (cat.includes('nature') || /wildlife|sanctuary|park|garden|hills|nature|forest|valley|mount|peak|climb/.test(cat)) {
      IconComponent = Trees;
      gradientClass = 'from-[#11998e] to-[#38ef7d]'; // lush green
      category = 'nature';
    } else if (cat.includes('adventure') || /adventure|trek|camping|safari|walk|hike|trail/.test(cat)) {
      IconComponent = Footprints;
      gradientClass = 'from-[#f12711] to-[#f5af19]'; // adventure flame
      category = 'adventure';
    } else if (cat.includes('culinary') || /market|bazaar|street|food|recipe|restaurant|cafe|sweet|bites|dine|hotel/.test(cat)) {
      IconComponent = Utensils;
      gradientClass = 'from-[#ff416c] to-[#ff4b2b]'; // culinary red
      category = 'culinary/bazaar';
    }

    return (
      <div className={`${className} bg-gradient-to-br ${gradientClass} relative overflow-hidden flex flex-col items-center justify-center p-4 text-center select-none`}>
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:10px_10px]" />
        <div className="bg-black/80 text-white border border-white/10 px-3 py-2 rounded-xl flex flex-col items-center gap-1.5 shadow-lg z-10">
          <IconComponent className="w-6 h-6 text-brand-accent" />
          <span className="text-[9px] font-mono tracking-widest text-[#FFD166] uppercase font-bold">{category}</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
};

export const openDirections = (place: SpotLocation) => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const destination = place.lat && place.lng
    ? `${place.lat},${place.lng}`
    : encodeURIComponent(`${place.title} India`);

  if (isIOS) {
    window.open(`https://maps.apple.com/?q=${destination}`, '_blank');
  } else {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
  }
};

export const PlaceCard: React.FC<PlaceCardProps> = ({
  location,
  isPinned,
  onTogglePin,
  onClick,
  index,
}) => {
  const isGem = location.type === 'gem';

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePin(location.id);
  };

  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDirections(location);
  };

  // Symmetrical rhythm: alternate heights for Pinterest columns
  const aspectClass = index % 2 === 0 ? 'aspect-[4/5]' : 'aspect-[4/3]';

  return (
    <motion.div
      variants={cardReveal(index)}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: EASE_CINEMATIC }}
      onClick={() => onClick(location)}
      className={`relative w-full overflow-hidden rounded-3xl glass glass-hover cursor-pointer group ${aspectClass}`}
    >
      {/* FULL BLEED BACKGROUND IMAGE */}
      <div className="absolute inset-0 w-full h-full">
        <PlaceImage
          src={location.image}
          alt={location.title}
          className="w-full h-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-105"
        />
        {/* Soft color masks for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/40 to-transparent z-10" />
      </div>

      {/* TOP PILLS: Badges layer */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
        <span
          className={`inline-flex items-center gap-1 text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full backdrop-blur-md border ${
            isGem
              ? 'bg-[#FFD166]/15 border-[#FFD166]/30 text-[#FFD166]'
              : 'bg-[#52B788]/15 border-[#52B788]/30 text-[#52B788]'
          }`}
        >
          {isGem ? '✦ Gem' : '★ Famous'}
        </span>

        <button
          onClick={handlePin}
          className={`pointer-events-auto p-2 rounded-full backdrop-blur-md border transition-all hover:scale-110 active:scale-95 cursor-pointer ${
            isPinned
              ? 'bg-[#FFD166]/30 border-[#FFD166]/50 text-[#FFD166]'
              : 'bg-black/40 border-white/10 text-gray-300 hover:text-white'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isPinned ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* BOTTOM PANEL: Narrative Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-20 flex flex-col justify-end text-left">
        {/* Rating and meta row */}
        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono mb-1.5">
          <span className="flex items-center gap-0.5 text-[#FFD166] font-bold">
            ★ {location.rating.toFixed(1)}
          </span>
          <span>·</span>
          <span className="truncate max-w-[90px]" title={location.cost}>{location.cost}</span>
          <span>·</span>
          <span className="truncate max-w-[90px]" title={location.timeOfDay}>{location.timeOfDay}</span>
        </div>

        <h4 className="font-display font-extrabold text-lg md:text-xl text-white leading-tight uppercase group-hover:text-brand-accent transition-colors duration-300">
          {location.title}
        </h4>
        
        <p className="font-sans text-xs italic text-gray-400 mt-1 line-clamp-1">
          {location.tagline}
        </p>

        {/* Dynamic Slide-Up Description on Hover */}
        <div className="overflow-hidden max-h-0 group-hover:max-h-20 opacity-0 group-hover:opacity-100 transition-all duration-[600ms] ease-in-out">
          <p className="font-sans text-[11px] leading-relaxed text-gray-300 mt-2 line-clamp-3">
            {location.description}
          </p>
        </div>

        {/* Directions button */}
        <div className="mt-3.5">
          <button
            onClick={handleDirections}
            className="w-full bg-white/5 hover:bg-brand-accent hover:text-[#0B0F19] border border-white/8 hover:border-brand-accent text-[9px] font-mono tracking-widest font-black uppercase py-2 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Navigation className="w-3 h-3 text-[#FFD166] group-hover:text-[#0B0F19]" />
            <span>Directions</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
