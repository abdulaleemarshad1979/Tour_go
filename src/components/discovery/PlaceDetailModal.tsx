import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X, Star, Bookmark, Navigation, Check } from 'lucide-react';
import { SpotLocation } from '../../types';
import { PlaceImage, openDirections } from './PlaceCard';
import { EASE_CINEMATIC } from '../../utils/animations';
import L from 'leaflet';

interface PlaceDetailModalProps {
  location: SpotLocation | null;
  isPinned: boolean;
  onTogglePin: (id: string) => void;
  onClose: () => void;
}

const parseHighlightText = (text: string) => {
  const boldRegex = /\*\*(.*?)\*\*/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <strong key={match.index} className="font-mono text-brand-accent">
        {match[1]}
      </strong>
    );
    lastIndex = boldRegex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts.length > 0 ? parts : text;
};

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  location,
  isPinned,
  onTogglePin,
  onClose,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize and clean up Leaflet map instance
  useEffect(() => {
    if (location?.lat && location?.lng && mapContainerRef.current) {
      if (mapRef.current) {
        mapRef.current.remove();
      }

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        touchZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        dragging: false,
      }).setView([location.lat, location.lng], 13);

      mapRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      const markerColor = location.type === 'gem' ? '#FFD166' : '#52B788';
      const customIcon = L.divIcon({
        html: `<div style="background-color: ${markerColor}; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid #0B0F19; box-shadow: 0 0 12px ${markerColor}; animate: pulse 2s infinite;"></div>`,
        className: 'custom-leaflet-marker',
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      L.marker([location.lat, location.lng], { icon: customIcon }).addTo(map);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [location, isMobile]);

  if (!location) return null;
  const isGem = location.type === 'gem';

  // Desktop vs Mobile motion variants
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
      {/* Dimmed Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#0B0F19]/80 backdrop-blur-md z-40 cursor-pointer"
      />

      {/* Main Drawer Shell */}
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
        className={`bg-[#111827] border-white/10 z-50 overflow-hidden flex flex-col shadow-2xl relative select-none ${
          isMobile 
            ? 'w-full h-[90dvh] rounded-t-[2.5rem] border-t'
            : 'w-[480px] h-full border-l'
        }`}
      >
        {/* Mobile Swipe handle indicator */}
        {isMobile && (
          <div className="w-12 h-1 bg-white/20 rounded-full mx-auto my-3 shrink-0" />
        )}

        {/* HERO IMAGE */}
        <div className="relative h-60 sm:h-72 w-full shrink-0">
          <PlaceImage src={location.image} alt={location.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/40 to-transparent z-10" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/40 border border-white/10 text-white rounded-full hover:bg-black/60 hover:text-white transition-all cursor-pointer z-20"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Type Badge */}
          <span
            className={`absolute bottom-4 left-6 inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur-md border z-20 ${
              isGem
                ? 'bg-[#FFD166]/15 border-[#FFD166]/30 text-[#FFD166]'
                : 'bg-[#52B788]/15 border-[#52B788]/30 text-[#52B788]'
            }`}
          >
            {isGem ? '✦ Gem' : '★ Famous'}
          </span>
        </div>

        {/* DRAWER DETAILS BODY */}
        <div className="p-6 md:p-8 overflow-y-auto flex-grow flex flex-col gap-6 no-scrollbar">
          <div>
            <h3 className="font-display font-black text-2xl md:text-3xl text-white leading-tight uppercase">
              {location.title}
            </h3>
            <p className="font-sans italic text-gray-400 mt-1.5 text-xs md:text-sm">
              "{location.tagline}"
            </p>
          </div>

          <hr className="border-white/8" />

          {/* Highlights */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[9px] tracking-wider uppercase text-gray-500">What Makes It Special</span>
            <ul className="flex flex-col gap-3">
              {location.highlights.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs md:text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0 mt-2" />
                  <span>{parseHighlightText(bullet)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[9px] tracking-wider uppercase text-gray-500">Editorial Log</span>
            <p className="font-sans text-xs md:text-sm text-gray-300 leading-relaxed">
              {location.description}
            </p>
          </div>

          {/* Map Preview widget */}
          {location.lat && location.lng && (
            <div className="flex flex-col gap-2.5">
              <span className="font-mono text-[9px] tracking-wider uppercase text-gray-500">Coordinate Anchor Map</span>
              <div
                ref={mapContainerRef}
                className="w-full h-36 rounded-2xl overflow-hidden border border-white/10 relative z-25 shadow-lg bg-[#0B0F19]"
              />
            </div>
          )}

          {/* Info Details Row */}
          <div className="grid grid-cols-3 gap-3 text-center text-[10px] md:text-xs pt-2">
            <div className="bg-white/3 border border-white/6 p-3 rounded-xl flex flex-col items-center justify-center gap-1">
              <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500">Rating</span>
              <span className="font-display font-black text-sm text-[#FFD166] flex items-center gap-0.5">
                ★ {location.rating.toFixed(1)}
              </span>
            </div>
            <div className="bg-white/3 border border-white/6 p-3 rounded-xl flex flex-col items-center justify-center gap-1">
              <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500">Cost</span>
              <span className="font-sans font-bold text-gray-250 truncate max-w-full" title={location.cost}>
                {location.cost}
              </span>
            </div>
            <div className="bg-white/3 border border-white/6 p-3 rounded-xl flex flex-col items-center justify-center gap-1">
              <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500">Best Time</span>
              <span className="font-sans font-bold text-gray-250 truncate max-w-full" title={location.timeOfDay}>
                {location.timeOfDay}
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTIONS BAR */}
        <div className="p-4 bg-[#111827] border-t border-white/10 shrink-0 grid grid-cols-2 gap-3">
          <button
            onClick={() => openDirections(location)}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 text-[10px] font-mono tracking-widest font-black uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Navigation className="w-4 h-4 text-brand-accent" />
            <span>Directions</span>
          </button>

          <button
            onClick={() => onTogglePin(location.id)}
            className={`w-full text-[10px] font-mono tracking-widest uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isPinned
                ? 'bg-brand-accent text-[#0B0F19] hover:bg-brand-accent/90 shadow-md font-bold'
                : 'bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 text-gray-200'
            }`}
          >
            {isPinned ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 animate-pulse" />
                <span>Save Spot</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
