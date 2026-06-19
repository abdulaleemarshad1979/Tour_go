import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, BedDouble, Info, ChevronDown, Sparkles } from 'lucide-react';
import { City } from '../../types';
import { EASE_CINEMATIC } from '../../utils/animations';

interface DestinationGuidesProps {
  city: City;
  onOpenTripBag?: () => void;
}

export const DestinationGuides: React.FC<DestinationGuidesProps> = ({ city, onOpenTripBag }) => {
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  const recreation = city.recreation || [];
  const accommodations = city.accommodations || [];
  const practicalities = city.practicalities || {
    transitTip: 'Hail local regional auto-rickshaws. Settle on a clear rate before boarding.',
    dialectTip: 'Locals respond beautifully to polite greetings. Try incorporating a warm verbal inquiry.',
    currencyTip: 'Always carry low-denomination physical paper notes for quick street transactions.',
    languagePhrase: 'Namaste (Greeting meaning: "I bow to the divine in you")'
  };
  const bookingSteps = city.bookingSteps || [
    'Add places you love to your Trip Bag using the bookmarks on discover cards.',
    'Open the Trip Bag checklist from the header or mobile nav bar to see your pinned list.',
    'Copy the itinerary list or customize your choices to plan your daily guide walkthroughs.'
  ];

  const sections = [
    {
      title: 'Recreation & Activities',
      icon: Compass,
      description: 'Hand-picked local routes designed to awaken your senses.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {recreation.length > 0 ? (
            recreation.map((rec, i) => (
              <div key={i} className="glass p-5 rounded-xl flex flex-col justify-between gap-3 bg-white/3 hover:border-[#FFD166]/20 transition-all text-left">
                <div>
                  <span className="font-mono text-[9px] text-brand-accent uppercase tracking-widest block font-black">
                    Activity {i + 1} &middot; {rec.duration}
                  </span>
                  <h5 className="font-display font-bold text-sm md:text-base text-white mt-1 uppercase">
                    {rec.title}
                  </h5>
                  <p className="font-sans text-xs text-gray-400 mt-1.5 leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-455 text-left">No recreational activities listed for this city.</p>
          )}
        </div>
      ),
    },
    {
      title: 'Local Stays & Resorts',
      icon: BedDouble,
      description: 'Character-filled resting bays steeped in local architectural charm.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {accommodations.length > 0 ? (
            accommodations.map((acc, i) => (
              <div key={i} className="glass p-5 rounded-xl flex flex-col justify-between gap-3 bg-white/3 hover:border-[#FFD166]/20 transition-all text-left">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="font-mono text-[9px] text-[#52B788] uppercase tracking-widest font-black">
                      {acc.type}
                    </span>
                    <h5 className="font-display font-bold text-sm md:text-base text-white mt-1 uppercase">
                      {acc.name}
                    </h5>
                  </div>
                  <span className="font-mono text-[9px] bg-white/10 text-gray-300 px-2 py-0.5 rounded shrink-0">
                    {acc.priceRange}
                  </span>
                </div>
                <p className="font-sans text-xs text-gray-400 italic leading-relaxed">
                  "{acc.tagline}"
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-455 text-left">No accommodation recommendations listed for this city.</p>
          )}
        </div>
      ),
    },
    {
      title: 'Practicalities & Language',
      icon: Info,
      description: 'Essential field codes to navigate local transit, commerce, and dialects easily.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 text-left">
          <div className="flex flex-col gap-4">
            <div className="border-l-2 border-[#FFD166] pl-3 py-0.5">
              <span className="font-mono text-[9px] font-black text-gray-500 uppercase tracking-wider">Transit Network</span>
              <p className="text-gray-300 text-xs mt-1 leading-relaxed">{practicalities.transitTip}</p>
            </div>
            <div className="border-l-2 border-[#FFD166] pl-3 py-0.5">
              <span className="font-mono text-[9px] font-black text-gray-500 uppercase tracking-wider">Dialect & Customs</span>
              <p className="text-gray-300 text-xs mt-1 leading-relaxed">{practicalities.dialectTip}</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="border-l-2 border-[#FFD166] pl-3 py-0.5">
              <span className="font-mono text-[9px] font-black text-gray-500 uppercase tracking-wider">Cash & Commerce</span>
              <p className="text-gray-300 text-xs mt-1 leading-relaxed">{practicalities.currencyTip}</p>
            </div>
            <div className="bg-[#FFD166]/5 border border-[#FFD166]/20 p-4 rounded-xl font-mono text-[10px] text-brand-accent flex flex-col gap-1.5 shadow-inner">
              <span className="font-black tracking-wider">🔤 KEY DIALECT PHRASE:</span>
              <span className="text-white font-sans text-xs mt-0.5">{practicalities.languagePhrase}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'How to Discover Offbeat Paths',
      icon: ChevronDown,
      description: 'Simple walkthrough guidelines to utilize the discover platform.',
      content: (
        <div className="flex flex-col gap-4 pt-2 text-left">
          {bookingSteps.map((step, idx) => (
            <div key={idx} className="flex gap-3.5 items-start text-xs md:text-sm text-gray-300">
              <span className="w-6 h-6 rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center font-mono font-black text-[10px] text-brand-accent shrink-0">
                0{idx + 1}
              </span>
              <p className="leading-relaxed mt-0.5 select-all">
                {step}
              </p>
            </div>
          ))}

          {onOpenTripBag && (
            <div className="mt-4 max-w-xs self-start">
              <button
                onClick={onOpenTripBag}
                className="w-full py-3 bg-brand-accent hover:bg-brand-accent/90 text-[#0B0F19] font-mono text-[10px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-2 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open Trip Bag Checklist</span>
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  return (
    <section className="w-full my-12 select-none">
      <div className="flex flex-col gap-3 mb-6 text-left">
        <span className="font-mono text-xs text-[#FFD166] font-black uppercase tracking-widest">
          Field Manual
        </span>
        <h3 className="font-display font-black text-2xl uppercase tracking-tight text-white">
          Tourism Guidelines &amp; Manuals
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === index;

          return (
            <div
              key={index}
              className="glass rounded-2xl overflow-hidden border border-white/8 bg-white/2 transition-all duration-300"
            >
              {/* ACCORDION HEADER */}
              <button
                onClick={() => toggleSection(index)}
                className="w-full px-6 py-4.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/3 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center text-brand-accent shrink-0">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base md:text-lg text-white uppercase tracking-wide">
                      {section.title}
                    </h4>
                    <p className="hidden md:block font-sans text-xs text-gray-500 mt-0.5">
                      {section.description}
                    </p>
                  </div>
                </div>

                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: EASE_CINEMATIC }}
                  className="text-gray-400"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </button>

              {/* ACCORDION CONTENT */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE_CINEMATIC }}
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-white/6 bg-black/10 flex flex-col gap-4">
                      {/* Mobile-only descriptive caption */}
                      <p className="md:hidden font-sans text-xs text-gray-500 italic text-left">
                        {section.description}
                      </p>
                      {section.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};
