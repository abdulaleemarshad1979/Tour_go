import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, CheckSquare, Square, Info, X, Clock, Wallet, Navigation, MapPin, ImageOff, Compass, Castle, Trees, Footprints, Building2, Utensils } from 'lucide-react';
import { SpotLocation } from '../types';

interface DiscoveryGridProps {
  locations: SpotLocation[];
  accentColorClass: string;
  pinnedIds: string[];
  onTogglePin: (id: string) => void;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const parseHighlightText = (text: string) => {
  const boldRegex = /\*\*(.*?)\*\*/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.substring(lastIndex, match.index));
    parts.push(
      <strong key={match.index} className="font-extrabold text-black bg-[#FFE600] px-1">
        {match[1]}
      </strong>
    );
    lastIndex = boldRegex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.substring(lastIndex));
  return parts.length > 0 ? parts : text;
};

// Opens native maps app on mobile, Google Maps on desktop
// If place has lat/lng, shows directions from user location; otherwise searches by name
function openDirections(place: SpotLocation, userLocation: GeolocationCoordinates | null) {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  const destination = place.lat && place.lng
    ? `${place.lat},${place.lng}`
    : encodeURIComponent(`${place.title} India`);

  const hasCoords = !!(place.lat && place.lng);
  const origin = userLocation
    ? `${userLocation.latitude},${userLocation.longitude}`
    : null;

  if (isIOS) {
    // Apple Maps deep link
    const dest = hasCoords ? `ll=${place.lat},${place.lng}&q=${encodeURIComponent(place.title)}` : `q=${encodeURIComponent(place.title)}`;
    const orig = origin ? `&saddr=${origin}` : '';
    window.open(`https://maps.apple.com/?${dest}${orig}&dirflg=d`, '_blank');
  } else if (isAndroid) {
    // Android: tries Google Maps app first via geo: URI, falls back to web
    const dest = hasCoords ? `${place.lat},${place.lng}` : encodeURIComponent(place.title);
    if (origin) {
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=driving`, '_blank');
    } else {
      window.open(`geo:0,0?q=${dest}`, '_blank');
    }
  } else {
    // Desktop → Google Maps web
    const dest = hasCoords ? `${place.lat},${place.lng}` : encodeURIComponent(`${place.title} India`);
    const orig = origin ? `&origin=${origin}` : '';
    window.open(`https://www.google.com/maps/dir/?api=1${orig}&destination=${dest}&travelmode=driving`, '_blank');
  }
}

// ─── Image with built-in fallback ─────────────────────────────────────────

const PlaceImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className = '' }) => {
  const [failed, setFailed] = useState(false);
  const isPlaceholder = src && src.startsWith('placeholder://');

  if (failed || !src || isPlaceholder) {
    const t = (alt || '').toLowerCase();
    let forcedCategory = '';
    if (isPlaceholder) {
      forcedCategory = src.replace('placeholder://', '');
    }

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
      <div className={`${className} bg-gradient-to-br ${gradientClass} relative overflow-hidden flex flex-col items-center justify-center p-4 text-center select-none border-b-4 border-black`}>
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:10px_10px]" />
        
        {/* Modern styled glass badge */}
        <div className="bg-black/85 text-white border-2 border-black px-4 py-3 rounded-xl flex flex-col items-center gap-1.5 shadow-[4px_4px_0px_#000] z-10 transition-transform duration-300 hover:scale-105">
          <IconComponent className="w-8 h-8 text-[#FFB800] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
          <span className="text-[10px] font-mono tracking-widest text-[#00F0FF] uppercase font-black">{category}</span>
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

// ─── Detail Modal ─────────────────────────────────────────────────────────

const DetailModal: React.FC<{
  loc: SpotLocation;
  isPinned: boolean;
  onTogglePin: (id: string) => void;
  onClose: () => void;
  userLocation: GeolocationCoordinates | null;
  locationLoading: boolean;
  onRequestLocation: () => void;
}> = ({ loc, isPinned, onTogglePin, onClose, userLocation, locationLoading, onRequestLocation }) => {
  const isGem = loc.type === 'gem';

  const handleDirections = () => {
    if (userLocation) {
      openDirections(loc, userLocation);
    } else {
      if (navigator.geolocation) {
        onRequestLocation();
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            openDirections(loc, pos.coords);
          },
          (err) => {
            console.warn('Geolocation query failed or denied:', err);
            openDirections(loc, null);
          },
          { timeout: 6000, enableHighAccuracy: true }
        );
      } else {
        openDirections(loc, null);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.18 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white border-4 border-black rounded-2xl overflow-hidden shadow-[10px_10px_0px_#000000] max-h-[88vh] overflow-y-auto"
      >
        {/* Hero Image */}
        <div className="relative h-48 w-full">
          <PlaceImage src={loc.image} alt={loc.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent"></div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center skeuo-btn shadow-[2px_2px_0px_#000]"
          >
            <X className="w-4 h-4 text-black" />
          </button>
          <span
            className={`absolute top-3 left-3 inline-block border-2 border-black font-display font-black text-[9px] uppercase px-2 py-1 tracking-tight rotate-[-2deg] shadow-[2px_2px_0px_#000] ${
              isGem ? 'bg-[#FFE600] text-black' : 'bg-[#cd7c64] text-white'
            }`}
          >
            {isGem ? 'HIDDEN GEM' : 'FAMOUS SPOT'}
          </span>
          <h4 className="absolute bottom-3 left-4 right-4 font-display font-black text-xl text-white uppercase tracking-tight leading-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            {loc.title}
          </h4>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <p className="font-sans text-sm text-slate-700 leading-relaxed">{loc.description}</p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#F6F1EB] border-2 border-black p-2 rounded-lg">
              <Star className="w-3.5 h-3.5 mx-auto text-[#cd7c64] fill-[#cd7c64]" />
              <span className="block font-display font-black text-sm text-slate-900 mt-1">{loc.rating.toFixed(1)}</span>
            </div>
            <div className="bg-[#F6F1EB] border-2 border-black p-2 rounded-lg">
              <Wallet className="w-3.5 h-3.5 mx-auto text-[#cd7c64]" />
              <span className="block font-sans font-bold text-[11px] text-slate-900 mt-1 leading-tight">{loc.cost}</span>
            </div>
            <div className="bg-[#F6F1EB] border-2 border-black p-2 rounded-lg">
              <Clock className="w-3.5 h-3.5 mx-auto text-[#cd7c64]" />
              <span className="block font-sans font-bold text-[11px] text-slate-900 mt-1 leading-tight">{loc.timeOfDay}</span>
            </div>
          </div>

          {/* Highlights */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="font-mono text-[9px] tracking-widest text-[#cd7c64] font-black uppercase">Highlights</span>
            <ul className="flex flex-col gap-2">
              {loc.highlights.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-800">
                  <span className="text-[#cd7c64] font-black mt-0.5 shrink-0">›</span>
                  <span>{parseHighlightText(bullet)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 mt-1">
            {/* Directions button */}
            <button
              onClick={handleDirections}
              className="w-full font-display font-black text-xs uppercase py-3 px-3 border-2 border-black rounded-lg bg-[#cd7c64] text-white shadow-[4px_4px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all flex items-center justify-center gap-2"
            >
              {locationLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Getting your location...
                </>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5" />
                  {userLocation ? 'Open Directions' : 'Get Directions'}
                </>
              )}
            </button>

            {/* Location status */}
            {userLocation && (
              <div className="flex items-center gap-1.5 text-[10px] text-green-700 font-mono font-bold">
                <MapPin className="w-3 h-3" />
                <span>Using your current location as origin</span>
              </div>
            )}

            {/* Add to trip */}
            <button
              onClick={() => onTogglePin(loc.id)}
              className={`w-full font-display font-black text-xs uppercase py-3 px-3 border-2 border-black rounded-lg transition-all skeuo-btn flex items-center justify-center gap-2 ${
                isPinned
                  ? 'bg-black text-white shadow-[1px_1px_0px_#000]'
                  : 'bg-white text-black shadow-[4px_4px_0px_#000]'
              }`}
            >
              {isPinned ? '✓ Added to your trip' : 'Add to your trip'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Discovery Card ───────────────────────────────────────────────────────

const DiscoveryCard: React.FC<{
  loc: SpotLocation;
  idx: number;
  isPinned: boolean;
  onTogglePin: (id: string) => void;
  onOpenDetails: (loc: SpotLocation) => void;
  showRibbon: 'adventure' | 'skeuo' | null;
}> = ({ loc, idx, isPinned, onTogglePin, onOpenDetails, showRibbon }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isGem = loc.type === 'gem';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((rect.height / 2 - y) / (rect.height / 2)) * 8;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    card.style.boxShadow = '10px 10px 0px #000000';
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    card.style.boxShadow = '6px 6px 0px #000000';
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, delay: idx * 0.035 }}
      style={{ transformStyle: 'preserve-3d', transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out' }}
      className="relative border-4 border-black rounded-2xl overflow-hidden shadow-[6px_6px_0px_#000000] select-none bg-black aspect-[4/5]"
    >
      <PlaceImage src={loc.image} alt={loc.title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/15 to-transparent"></div>

      <span className={`absolute top-3 left-3 inline-block border-2 border-black font-display font-black text-[8px] uppercase px-2 py-1 tracking-tight rotate-[-2deg] shadow-[2px_2px_0px_#000] z-10 ${isGem ? 'bg-[#FFE600] text-black' : 'bg-[#cd7c64] text-white'}`}>
        {isGem ? 'HIDDEN GEM' : 'FAMOUS SPOT'}
      </span>

      <button
        onClick={() => onOpenDetails(loc)}
        aria-label={`View details for ${loc.title}`}
        className="absolute top-3 right-3 w-7 h-7 bg-white/90 border-2 border-black rounded-full flex items-center justify-center skeuo-btn shadow-[2px_2px_0px_#000] z-10"
      >
        <Info className="w-3.5 h-3.5 text-black" />
      </button>

      <button
        onClick={() => onTogglePin(loc.id)}
        className={`absolute bottom-16 right-3 w-7 h-7 border-2 border-black rounded-md flex items-center justify-center skeuo-btn z-10 ${isPinned ? 'bg-[#cd7c64] text-white shadow-[1px_1px_0px_#000]' : 'bg-white/90 text-black shadow-[2px_2px_0px_#000]'}`}
        title={isPinned ? 'Remove from trip' : 'Add to trip'}
      >
        {isPinned ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
      </button>

      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h4 className="font-display font-black text-lg md:text-xl text-white uppercase tracking-tight leading-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          {loc.title}
        </h4>
        <p className="font-mono text-[9px] text-[#FFB800] uppercase font-bold tracking-wider mt-1 truncate">
          {loc.tagline}
        </p>
      </div>

      {showRibbon === 'adventure' && (
        <div className="absolute right-3 top-12 rotate-6 z-10 pointer-events-none">
          <div className="bg-[#FFE600] text-black border-2 border-black font-display font-black text-[8px] uppercase tracking-wider px-2 py-0.5 shadow-[2px_2px_0px_#000]">★ ADVENTURE READY</div>
        </div>
      )}
      {showRibbon === 'skeuo' && (
        <div className="absolute right-3 top-12 -rotate-2 z-10 pointer-events-none">
          <div className="bg-[#00F0FF] text-black border-2 border-black font-display font-black text-[8px] uppercase tracking-wider px-2 py-0.5 shadow-[2px_2px_0px_#000]">SKEUO-POWERED UI</div>
        </div>
      )}
    </motion.div>
  );
};

// ─── Main Grid ────────────────────────────────────────────────────────────

export const DiscoveryGrid: React.FC<DiscoveryGridProps> = ({ locations, pinnedIds, onTogglePin }) => {
  const [activeDetail, setActiveDetail] = useState<SpotLocation | null>(null);
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Silently pre-fetch location when grid mounts (non-blocking)
  React.useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation(pos.coords),
      () => { /* User denied — that's fine, directions still work without origin */ },
      { timeout: 8000, enableHighAccuracy: false }
    );
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation || locationLoading || userLocation) return;
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserLocation(pos.coords); setLocationLoading(false); },
      () => setLocationLoading(false),
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  if (locations.length === 0) {
    return (
      <div className="w-full text-center py-16 px-4 bg-white border-4 border-black rounded-2xl shadow-[6px_6px_0px_#000] flex flex-col items-center justify-center gap-3">
        <div className="w-14 h-14 bg-[#F6F1EB] border-2 border-black rounded-full flex items-center justify-center text-2xl">🔍</div>
        <div>
          <h4 className="font-display font-black text-lg uppercase text-slate-900">No spots match your search</h4>
          <p className="font-sans text-xs text-gray-500 mt-1 max-w-sm">Try a different keyword or switch the filter back to "All".</p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full flex flex-col gap-5 my-2 select-none">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h3 className="font-display font-black text-2xl uppercase tracking-tight text-slate-950">Discover the City</h3>
          <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
            {locations.filter(l => l.type === 'famous').length} Famous Spots · {locations.filter(l => l.type === 'gem').length} Hidden Gems
          </p>
        </div>
        <div className="flex gap-2 text-[10px] font-display font-black uppercase">
          <div className="flex items-center gap-1.5 bg-[#cd7c64] text-white border-2 border-black px-2.5 py-1 rounded-full">
            <span>★</span> FAMOUS SPOT
          </div>
          <div className="flex items-center gap-1.5 bg-[#FFE600] text-black border-2 border-black px-2.5 py-1 rounded-full">
            <span>◆</span> HIDDEN GEM
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
        {locations.map((loc, idx) => (
          <div key={loc.id} className="contents">
            <DiscoveryCard
              loc={loc}
              idx={idx}
              isPinned={pinnedIds.includes(loc.id)}
              onTogglePin={onTogglePin}
              onOpenDetails={setActiveDetail}
              showRibbon={idx === 0 ? 'adventure' : idx === 3 ? 'skeuo' : null}
            />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {activeDetail && (
          <DetailModal
            loc={activeDetail}
            isPinned={pinnedIds.includes(activeDetail.id)}
            onTogglePin={onTogglePin}
            onClose={() => setActiveDetail(null)}
            userLocation={userLocation}
            locationLoading={locationLoading}
            onRequestLocation={requestLocation}
          />
        )}
      </AnimatePresence>
    </section>
  );
};