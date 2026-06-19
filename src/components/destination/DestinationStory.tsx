import React from 'react';
import { motion } from 'motion/react';
import { Quote, Sparkles } from 'lucide-react';
import { City } from '../../types';
import { sectionReveal } from '../../utils/animations';

interface DestinationStoryProps {
  city: City;
}

export const DestinationStory: React.FC<DestinationStoryProps> = ({ city }) => {
  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="w-full py-24 border-t border-b border-white/5 select-none relative"
    >
      {/* Background soft ambient blur */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-green/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
        {/* LEFT COLUMN: Large Playfair Display Pull Quote (5-cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5 text-left">
          <div className="flex items-center gap-2">
            <Quote className="w-8 h-8 text-brand-accent/40 rotate-180" />
            <span className="font-mono text-[9px] text-[#FFD166] uppercase tracking-widest font-black">Sensory Chapters</span>
          </div>
          <h2 className="font-display font-black italic text-3xl md:text-5xl text-white leading-tight drop-shadow-md">
            "{city.tagline}"
          </h2>
          <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mt-2 block">
            &mdash; The Vibe of {city.name}
          </span>
        </div>

        {/* RIGHT COLUMN: Copywriting narrative (7-cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          {/* Thin gold decorative divider */}
          <div className="w-16 border-t-2 border-brand-accent/40 rounded-full" />
          
          <div className="flex flex-col gap-5">
            <p className="font-sans text-base md:text-lg text-gray-200 leading-relaxed font-light">
              {city.introParagraph1}
            </p>
            <p className="font-sans text-xs md:text-sm text-gray-400 leading-relaxed">
              {city.introParagraph2}
            </p>
          </div>

          {/* Bottom editorial stats separator line */}
          <hr className="border-white/8 my-6" />

          {/* Stat row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-mono tracking-wider text-gray-400">
            <div>
              <span className="text-gray-500 block uppercase text-[8px] font-black">Best Season</span>
              <span className="text-white mt-1.5 block font-semibold truncate" title={city.bestTimeToVisit}>
                {city.bestTimeToVisit.split(' (')[0]}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase text-[8px] font-black">Stay Anchor</span>
              <span className="text-white mt-1.5 block font-semibold truncate" title={city.idealDuration}>
                {city.idealDuration}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase text-[8px] font-black">Climate</span>
              <span className="text-white mt-1.5 block font-semibold truncate" title={city.climate}>
                {city.climate.split(';')[0]}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase text-[8px] font-black">Regional Secret</span>
              <span className="text-brand-accent mt-1.5 block font-semibold truncate" title={city.localSecretRecipe}>
                {city.localSecretRecipe}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
