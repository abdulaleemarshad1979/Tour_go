import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Compass, Sparkles, MapPin, ChevronDown } from 'lucide-react';
import { City } from '../../types';
import { EASE_CINEMATIC, heroReveal } from '../../utils/animations';
import { fetchPexelsImage } from '../../utils/pexels';

interface HeroSectionProps {
  selectedCity: City;
  onSelectCityName: (name: string) => void;
  isScraping: boolean;
  filterType: 'all' | 'famous' | 'gem';
  onFilterChange: (type: 'all' | 'famous' | 'gem') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCity,
  onSelectCityName,
  isScraping,
  filterType,
  onFilterChange,
  searchQuery,
  onSearchChange,
}) => {
  const [typedInput, setTypedInput] = useState('');
  const [bgImage, setBgImage] = useState<string>('');

  // Handle dynamic Pexels image lookup if heroImage is empty or a placeholder
  useEffect(() => {
    let active = true;
    const resolveBg = async () => {
      if (selectedCity.heroImage && !selectedCity.heroImage.startsWith('placeholder://')) {
        setBgImage(selectedCity.heroImage);
        return;
      }

      const pexelsImg = await fetchPexelsImage(`${selectedCity.name} ${selectedCity.country} travel`);
      if (active) {
        setBgImage(
          pexelsImg ||
          `https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=1920`
        );
      }
    };
    resolveBg();
    return () => {
      active = false;
    };
  }, [selectedCity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedInput.trim().length > 0) {
      onSelectCityName(typedInput.trim());
      setTypedInput('');
    }
  };

  const handleQuickFilter = (type: 'all' | 'famous' | 'gem') => {
    onFilterChange(type);
    onSearchChange('');
  };

  const scrollToDiscover = () => {
    document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden select-none bg-[#0B0F19]">
      {/* Background Image Layer (Pexels or Fallback, no mp4 video leak) */}
      <div className="absolute inset-0 z-0">
        {bgImage && (
          <motion.img
            key={bgImage}
            initial={{ scale: 1.08, opacity: 2 }}
            animate={{ scale: 1, opacity: 2 }}
            transition={{ duration: 1.8, ease: EASE_CINEMATIC }}
            src={bgImage}
            alt={selectedCity.name}
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.4] contrast-[1.1]"
            referrerPolicy="no-referrer"
          />
        )}
        {/* Cinematic gradient fade layout */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-[#0B0F19]/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19]/25 via-transparent to-[#0B0F19]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-4xl px-6 text-center flex flex-col items-center gap-6 mt-8">
        {/* Country Badge Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_CINEMATIC }}
          className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#FFD166] backdrop-blur-md shadow-lg"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{selectedCity.country}</span>
        </motion.div>

        {/* City Title in massive Playfair Display italic */}
        <motion.h1
          variants={heroReveal}
          initial="hidden"
          animate="visible"
          className="font-display font-black text-5xl md:text-8xl text-white uppercase tracking-tight leading-none drop-shadow-[0_8px_32px_rgba(0,0,0,0.7)] italic"
        >
          {selectedCity.name}
        </motion.h1>

        {/* Tagline in Inter 300 letter-spaced */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE_CINEMATIC }}
          className="font-sans font-light tracking-wide text-sm md:text-lg text-gray-300 max-w-2xl leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
        >
          {selectedCity.tagline}
        </motion.p>

        {/* Search Bar Console */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE_CINEMATIC }}
          onSubmit={handleSubmit}
          className="w-full max-w-2xl mt-4 glass rounded-full h-14 flex items-center pl-5 pr-2 focus-within:border-brand-accent/30 focus-within:shadow-[0_0_30px_rgba(255,209,102,0.15)] transition-all duration-500"
        >
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={typedInput}
            onChange={(e) => {
              setTypedInput(e.target.value);
              onSearchChange(e.target.value);
            }}
            placeholder={`Search spots in ${selectedCity.name} or explore any city globally...`}
            className="flex-grow bg-transparent text-white placeholder:text-gray-500 font-sans text-xs md:text-sm font-medium outline-none px-4"
          />
          <button
            type="submit"
            disabled={isScraping}
            className="h-10 w-10 bg-brand-accent hover:bg-brand-accent/90 text-[#0B0F19] rounded-full flex items-center justify-center font-bold shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 shrink-0"
            title="Discover Region"
          >
            &rarr;
          </button>
        </motion.form>

        {/* Quick Category Filter Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-2.5 justify-center mt-4 max-w-xl text-[10px] md:text-xs"
        >
          <button
            onClick={() => handleQuickFilter('all')}
            className={`px-5 py-2 rounded-full font-mono uppercase tracking-wider transition-all cursor-pointer ${filterType === 'all' && !searchQuery
              ? 'bg-brand-accent text-[#0B0F19] font-black shadow-lg scale-105'
              : 'bg-white/5 border border-white/8 text-gray-300 hover:text-white hover:bg-white/10'
              }`}
          >
            All Locations
          </button>
          <button
            onClick={() => handleQuickFilter('famous')}
            className={`px-5 py-2 rounded-full font-mono uppercase tracking-wider transition-all cursor-pointer ${filterType === 'famous'
              ? 'bg-[#52B788] text-[#0B0F19] font-black shadow-lg scale-105'
              : 'bg-white/5 border border-white/8 text-gray-300 hover:text-white hover:bg-white/10'
              }`}
          >
            ★ Famous Places
          </button>
          <button
            onClick={() => handleQuickFilter('gem')}
            className={`px-5 py-2 rounded-full font-mono uppercase tracking-wider transition-all cursor-pointer ${filterType === 'gem'
              ? 'bg-brand-accent/90 text-[#0B0F19] font-black shadow-lg scale-105'
              : 'bg-white/5 border border-white/8 text-gray-300 hover:text-white hover:bg-white/10'
              }`}
          >
            ✦ Hidden Gems
          </button>
        </motion.div>

        {/* AI SCRAPING STATUS HUD */}
        {isScraping && (
          <div className="flex items-center gap-2 mt-4 font-mono text-[10px] tracking-widest text-brand-accent uppercase animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>Scanning coordinates &amp; weather indicators...</span>
          </div>
        )}
      </div>

      {/* Scroll indicator: Animated ↓ Arrow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1">
        <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">Explore Discoveries</span>
        <motion.button
          onClick={scrollToDiscover}
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Scroll Down"
        >
          <ChevronDown className="w-5 h-5 text-brand-accent" />
        </motion.button>
      </div>
    </section>
  );
};
