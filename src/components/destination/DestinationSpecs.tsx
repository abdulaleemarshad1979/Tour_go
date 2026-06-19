import React from 'react';
import { Calendar, Compass, Clock, Thermometer, Coffee, Info } from 'lucide-react';
import { City } from '../../types';

interface DestinationSpecsProps {
  city: City;
}

export const DestinationSpecs: React.FC<DestinationSpecsProps> = ({ city }) => {
  const specs = [
    {
      icon: Calendar,
      label: 'Best Time to Visit',
      value: city.bestTimeToVisit,
    },
    {
      icon: Clock,
      label: 'Ideal Duration',
      value: city.idealDuration,
    },
    {
      icon: Compass,
      label: 'How to Reach',
      value: city.howToReach,
    },
    {
      icon: Thermometer,
      label: 'Climate Ambient',
      value: city.climate,
    },
    {
      icon: Coffee,
      label: 'Local Secret Recipe',
      value: city.localSecretRecipe,
    },
    {
      icon: Info,
      label: 'Practicalities Tip',
      value: city.practicalities?.transitTip || 'Hail local auto-rickshaws. Confirm fare rate before boarding.',
    },
  ];

  return (
    <section className="w-full my-12 select-none text-left">
      <div className="flex flex-col gap-3 mb-6">
        <span className="font-mono text-xs text-[#FFD166] font-black uppercase tracking-widest">
          Logistics Console
        </span>
        <h3 className="font-display font-black text-2xl uppercase tracking-tight text-white">
          Essential Destination Specs
        </h3>
      </div>

      {/* Grid: 2x3 layout on desktop, horizontal scroll on mobile */}
      <div className="flex overflow-x-auto pb-4 gap-6 no-scrollbar md:grid md:grid-cols-3 md:overflow-x-visible md:pb-0">
        {specs.map((spec, index) => {
          const Icon = spec.icon;
          return (
            <div
              key={index}
              className="glass glass-hover p-6 rounded-2xl flex flex-col justify-between gap-5 min-w-[260px] md:min-w-0 h-48 hover:border-[#FFD166]/30 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">
                  Spec 0{index + 1}
                </span>
                <Icon className="w-5 h-5 text-[#FFD166] group-hover:scale-110 transition-transform duration-350" />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                  {spec.label}
                </span>
                <p className="font-sans text-xs md:text-sm font-semibold text-white leading-relaxed line-clamp-3 group-hover:text-brand-accent transition-colors duration-300">
                  {spec.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
