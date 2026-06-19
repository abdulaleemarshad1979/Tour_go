import React from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Sliders, Type, Database, Check, Play, Compass } from 'lucide-react';
import { EASE_CINEMATIC } from '../../utils/animations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeNiche: 'luxury' | 'modern' | 'eco';
  onNicheChange: (niche: 'luxury' | 'modern' | 'eco') => void;
  aiProvider: 'auto' | 'gemini' | 'groq' | 'openrouter';
  onProviderChange: (provider: 'auto' | 'gemini' | 'groq' | 'openrouter') => void;
  onReplayIntro: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  activeNiche,
  onNicheChange,
  aiProvider,
  onProviderChange,
  onReplayIntro,
}) => {
  if (!isOpen) return null;

  const niches = [
    {
      id: 'luxury' as const,
      name: 'Luxury & Boutique',
      fonts: 'Playfair Display + Inter',
      desc: 'Elegant editorial layouts tailored for high-end boutique retreats, colonial landmarks, and premium itineraries.',
    },
    {
      id: 'modern' as const,
      name: 'Modern & Adventure',
      fonts: 'Montserrat + Open Sans',
      desc: 'Sleek, geometric, high-contrast layouts built for extreme sports operators, worldly expeditions, and contemporary backpackers.',
    },
    {
      id: 'eco' as const,
      name: 'Eco-Tourism & Nature',
      fonts: 'Lora + Lato',
      desc: 'Warm, approachable, organic typography designed for botanical sanctuaries, wildlife corridors, and silent forest retreats.',
    },
  ];

  const providers = [
    {
      id: 'auto' as const,
      name: 'Smart Cascading (Auto)',
      desc: 'Blazing speeds and maximum reliability. Automatically cascades from Groq (Llama) to Gemini and OpenRouter if a key fails.',
    },
    {
      id: 'gemini' as const,
      name: 'Google Gemini 2.5 Pro',
      desc: 'High-reasoning model. Outstanding for deep geographic insights, accurate coordinate matching, and historical depth.',
    },
    {
      id: 'groq' as const,
      name: 'Groq Llama 3.3',
      desc: 'Ultra-low latency inference engine. Ideal for lightning-fast autocompletion and instantaneous structured data generation.',
    },
    {
      id: 'openrouter' as const,
      name: 'OpenRouter (Claude 3.5)',
      desc: 'Superior semantic consistency. Excellent for atmospheric, narrative-driven description cards and travel blogs.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#0B0F19]/80 backdrop-blur-md z-40 cursor-pointer"
      />

      {/* Panel */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: EASE_CINEMATIC }}
        className="bg-[#111827]/95 border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-50 flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-[#1F2937]/20">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brand-accent animate-pulse" />
            <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">
              Branding &amp; Engine Console
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-8 no-scrollbar">
          {/* Section 1: Typography Niche */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#FFD166] uppercase font-black">
              <Type className="w-4 h-4 shrink-0" />
              <span>1. Choose Travel Niche Typography</span>
            </div>
            <div className="flex flex-col gap-3">
              {niches.map((niche) => {
                const isActive = activeNiche === niche.id;
                return (
                  <button
                    key={niche.id}
                    onClick={() => onNicheChange(niche.id)}
                    className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1.5 ${isActive
                        ? 'bg-brand-accent/5 border-brand-accent/40 shadow-lg shadow-brand-accent/5'
                        : 'bg-white/2 border-white/5 hover:border-white/10 hover:bg-white/5'
                      }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-display font-bold text-sm text-white uppercase tracking-wider">
                        {niche.name}
                      </span>
                      {isActive && (
                        <div className="bg-brand-accent text-[#0B0F19] rounded-full p-0.5 shrink-0 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-brand-accent/90 uppercase tracking-widest">
                      {niche.fonts}
                    </span>
                    <p className="text-xs text-gray-400 font-sans leading-relaxed mt-0.5">
                      {niche.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: AI Scraper Provider */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#FFD166] uppercase font-black">
              <Database className="w-4 h-4 shrink-0" />
              <span>2. Select AI Intelligence Provider</span>
            </div>
            <div className="flex flex-col gap-3">
              {providers.map((prov) => {
                const isActive = aiProvider === prov.id;
                return (
                  <button
                    key={prov.id}
                    onClick={() => onProviderChange(prov.id)}
                    className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1.5 ${isActive
                        ? 'bg-brand-accent/5 border-brand-accent/40 shadow-lg shadow-brand-accent/5'
                        : 'bg-white/2 border-white/5 hover:border-white/10 hover:bg-white/5'
                      }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono text-sm text-white uppercase tracking-wider font-semibold">
                        {prov.name}
                      </span>
                      {isActive && (
                        <div className="bg-brand-accent text-[#0B0F19] rounded-full p-0.5 shrink-0 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 font-sans leading-relaxed mt-0.5">
                      {prov.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Cinematic Vibe Replay */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#FFD166] uppercase font-black">
              <Play className="w-4 h-4 shrink-0" />
              <span>3. Tour Go Experience</span>
            </div>
            <button
              onClick={onReplayIntro}
              className="w-full text-center p-4 rounded-2xl border border-dashed border-white/20 hover:border-brand-accent/40 bg-white/2 hover:bg-brand-accent/5 text-xs text-white font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-brand-accent animate-spin-[spin_10s_linear_infinite]" />
              <span>Replay Cinematic Intro Sequence</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 bg-[#1F2937]/10 flex items-center justify-between text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          <span>Persists in LocalStorage</span>
          <div className="flex items-center gap-1 text-brand-accent font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TOUR_GO Settings Console</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
