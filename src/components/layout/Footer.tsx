import React, { useState } from 'react';
import { Compass, Twitter, Instagram, Github, Youtube, Send, Heart } from 'lucide-react';

interface FooterProps {
  onSelectFilter?: (type: 'all' | 'famous' | 'gem') => void;
  onOpenTripBag?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectFilter,
  onOpenTripBag,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLinkClick = (type: 'all' | 'famous' | 'gem') => {
    if (onSelectFilter) {
      onSelectFilter(type);
    }
    handleScrollTo('discover');
  };

  return (
    <footer className="w-full bg-[#090C14] text-gray-400 py-16 px-6 mt-16 rounded-t-3xl border-t border-white/5 select-none text-left">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        {/* COLUMN 1: Logo & Brand */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Compass className="w-6 h-6 text-brand-accent animate-pulse" />
            <span className="font-display font-black text-2xl italic text-white tracking-wider">
              TOUR_GO
            </span>
          </div>
          <p className="font-sans text-sm text-gray-450 leading-relaxed max-w-sm">
            TRAVEL BEYOND THE OBVIOUS. A travel discovery platform showcasing regional sensory corridors, famous landmarks, and off-grid coordinates most people never know.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a href="#" className="hover:text-brand-accent transition-colors" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-brand-accent transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-brand-accent transition-colors" aria-label="Github">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-brand-accent transition-colors" aria-label="Youtube">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* COLUMN 2: Quick Links */}
        <div className="flex flex-col gap-4">
          <h4 className="font-mono text-xs text-[#FFD166] uppercase tracking-widest font-black">
            Quick Navigation
          </h4>
          <div className="flex flex-col gap-2.5 text-sm font-medium">
            <button
              onClick={() => handleLinkClick('all')}
              className="hover:text-white transition-colors cursor-pointer text-left w-fit"
            >
              Explore Discoveries
            </button>
            <button
              onClick={() => handleLinkClick('gem')}
              className="hover:text-white transition-colors cursor-pointer text-left w-fit"
            >
              Hidden Gems
            </button>
            <button
              onClick={() => handleLinkClick('famous')}
              className="hover:text-white transition-colors cursor-pointer text-left w-fit"
            >
              Famous Places
            </button>
            <button
              onClick={() => handleScrollTo('map-section')}
              className="hover:text-white transition-colors cursor-pointer text-left w-fit"
            >
              Interactive Map Explorer
            </button>
            {onOpenTripBag && (
              <button
                onClick={onOpenTripBag}
                className="hover:text-white transition-colors cursor-pointer text-left w-fit"
              >
                My Trip Bag Checklist
              </button>
            )}
          </div>
        </div>

        {/* COLUMN 3: Newsletter */}
        <div className="flex flex-col gap-4">
          <h4 className="font-mono text-xs text-[#FFD166] uppercase tracking-widest font-black">
            The Journal Newsletter
          </h4>
          <p className="font-sans text-sm text-gray-450 leading-relaxed max-w-sm">
            Subscribe to receive coordinates of monthly hidden gems, sensory reviews, and offbeat travel maps directly.
          </p>
          <form onSubmit={handleSubscribe} className="flex bg-white/5 border border-white/10 rounded-full h-11 p-1 items-center max-w-sm mt-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-grow bg-transparent text-white placeholder:text-gray-500 font-sans text-xs outline-none px-4"
            />
            <button
              type="submit"
              className="bg-brand-accent hover:bg-brand-accent/90 text-[#0B0F19] text-xs font-mono font-bold tracking-wider px-4 py-2 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
            >
              {subscribed ? 'Subscribed' : (
                <>
                  <span>Discover</span>
                  <Send className="w-3 h-3" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <hr className="w-full border-white/5 mb-8" />

      {/* BOTTOM BAR */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-gray-650 uppercase tracking-widest">
        <span>&copy; 2026 TOUR_GO Inc. All rights reserved. &middot; Privacy &middot; Terms</span>
        <div className="flex items-center gap-1.5 font-bold">
          <span>Built with</span>
          <Heart className="w-3 h-3 text-[#52B788] fill-[#52B788]" />
          <span>for curious explorers</span>
        </div>
      </div>
    </footer>
  );
};
