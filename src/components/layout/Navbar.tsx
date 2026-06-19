import React, { useState } from 'react';
import { Backpack, Compass, Menu, X, Globe, Settings } from 'lucide-react';
import { City } from '../../types';
import { useScrolled } from '../../hooks/useScrolled';

interface NavbarProps {
  selectedCity: City;
  onSelectCityName: (name: string) => void;
  isScraping: boolean;
  pinnedCount: number;
  onOpenTripBag: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCity,
  onSelectCityName,
  isScraping,
  pinnedCount,
  onOpenTripBag,
  onOpenSettings,
}) => {
  const isScrolled = useScrolled(80);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const seedCities = ['Delhi', 'Jaipur', 'Madurai', 'Pondicherry', 'Varanasi', 'Agra', 'Goa'];

  const handleCitySelect = (name: string) => {
    onSelectCityName(name);
    setMobileMenuOpen(false);
  };

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 h-16 z-40 transition-all duration-500 select-none ${
        isScrolled
          ? 'bg-[#0B0F19]/80 backdrop-blur-md border-b border-white/8 shadow-xl'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-4 md:px-8 flex items-center justify-between">
        {/* LEFT: Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Compass className="w-5 h-5 text-brand-accent group-hover:rotate-45 transition-transform duration-500" />
          <span className="font-display font-extrabold text-xl tracking-tight text-white italic">
            TOUR_GO
          </span>
          <span className="w-1 h-1 rounded-full bg-brand-accent animate-pulse" />
        </div>

        {/* CENTER: Desktop Destinations */}
        <div className="hidden md:flex items-center gap-6">
          {seedCities.map((cityName) => {
            const isActive = selectedCity.name.toLowerCase() === cityName.toLowerCase();
            return (
              <button
                key={cityName}
                onClick={() => handleCitySelect(cityName)}
                className={`text-[10px] font-mono uppercase tracking-widest transition-all relative py-1 cursor-pointer ${
                  isActive ? 'text-brand-accent font-semibold' : 'text-gray-400 hover:text-white'
                }`}
              >
                {cityName}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-4">
          {/* Trip bag icon */}
          <button
            onClick={onOpenTripBag}
            className="relative p-2 text-gray-300 hover:text-brand-accent transition-colors cursor-pointer"
            title="Trip Bag"
          >
            <Backpack className="w-5 h-5" />
            {pinnedCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-brand-accent text-[#0B0F19] text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
                {pinnedCount}
              </span>
            )}
          </button>

          {/* Settings icon */}
          <button
            onClick={onOpenSettings}
            className="relative p-2 text-gray-300 hover:text-brand-accent transition-colors cursor-pointer"
            title="Branding & Settings Console"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Explore CTA */}
          <button
            onClick={() => handleScrollToSection('discover')}
            className="hidden sm:inline-block glass hover:bg-brand-accent hover:text-[#0B0F19] hover:border-brand-accent text-xs font-display italic font-semibold px-5 py-2 text-brand-accent rounded-full transition-all duration-300 cursor-pointer"
          >
            Explore &rarr;
          </button>

          {/* Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-[#0B0F19]/95 backdrop-blur-lg border-b border-white/10 px-6 py-8 flex flex-col gap-6 z-40">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">Destinations</span>
            <div className="grid grid-cols-2 gap-3">
              {seedCities.map((cityName) => {
                const isActive = selectedCity.name.toLowerCase() === cityName.toLowerCase();
                return (
                  <button
                    key={cityName}
                    onClick={() => handleCitySelect(cityName)}
                    className={`text-left py-2 px-3 text-xs uppercase tracking-wider rounded-lg border transition-all ${
                      isActive
                        ? 'bg-brand-accent/10 border-brand-accent/30 text-brand-accent font-semibold'
                        : 'border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cityName}
                  </button>
                );
              })}
            </div>
          </div>
          <button
            onClick={() => handleScrollToSection('discover')}
            className="w-full bg-brand-accent hover:bg-brand-accent/90 text-[#0B0F19] font-medium py-3 rounded-xl transition-colors text-center text-sm font-semibold uppercase tracking-wider cursor-pointer"
          >
            Explore Destinations
          </button>
        </div>
      )}
    </nav>
  );
};
