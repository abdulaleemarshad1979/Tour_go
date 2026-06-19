import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Cloud, CloudRain, CloudLightning, Wind, Droplets, AlertCircle } from 'lucide-react';
import { WeatherData } from '../../types';
import { fadeIn } from '../../utils/animations';

interface WeatherWidgetProps {
  weather: WeatherData;
  cityName: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, cityName }) => {
  const [metricTab, setMetricTab] = useState<'hourly' | 'weekly'>('hourly');

  const getWeatherIcon = (cond: string, className = "w-8 h-8") => {
    const c = cond.toLowerCase();
    if (c.includes('sun') || c.includes('clear') || c.includes('warm') || c.includes('sunny')) {
      return <Sun className={`${className} text-[#FFD166]`} />;
    }
    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower') || c.includes('rainy')) {
      return <CloudRain className={`${className} text-blue-400`} />;
    }
    if (c.includes('thunder') || c.includes('storm') || c.includes('thunderstorm')) {
      return <CloudLightning className={`${className} text-purple-400`} />;
    }
    if (c.includes('wind') || c.includes('draft') || c.includes('breeze') || c.includes('windy')) {
      return <Wind className={`${className} text-teal-400`} />;
    }
    return <Cloud className={`${className} text-gray-400`} />;
  };

  const isSunny = /sun|clear|warm|sunny/i.test(weather.condition);
  const isRainy = /rain|drizzle|shower|thunder|storm|rainy/i.test(weather.condition);
  
  let gradientBg = 'from-gray-800/40 to-slate-900/30'; // cloudy/default
  if (isSunny) {
    gradientBg = 'from-amber-900/30 to-orange-900/20';
  } else if (isRainy) {
    gradientBg = 'from-blue-900/40 to-slate-900/30';
  }

  return (
    <section className="w-full my-12 select-none text-left">
      <div className="flex flex-col gap-3 mb-6">
        <span className="font-mono text-xs text-[#FFD166] font-black uppercase tracking-widest">
          Atmospheric Feed
        </span>
        <h3 className="font-display font-black text-2xl uppercase tracking-tight text-white">
          Real-Time Climate Outlook
        </h3>
      </div>

      <div className={`glass w-full rounded-3xl overflow-hidden p-6 md:p-8 flex flex-col gap-8 bg-gradient-to-br ${gradientBg} transition-all duration-[1000ms]`}>
        {/* TOP BLOCK: City, condition, big Inter 300 temp index */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/5 border border-white/8 rounded-2xl flex items-center justify-center shrink-0">
              {getWeatherIcon(weather.condition, "w-12 h-12")}
            </div>
            <div>
              <span className="font-mono text-[9px] text-[#FFD166] uppercase tracking-widest font-black">
                Current Condition
              </span>
              <h4 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-wide mt-0.5">
                {cityName}
              </h4>
              <p className="font-sans text-xs text-gray-300 mt-1 flex items-center gap-1.5">
                <span>{weather.condition}</span>
                <span>&middot;</span>
                <span className="font-mono text-[10px] text-gray-500">Forecast Synced</span>
              </p>
            </div>
          </div>

          {/* Large Temperature Index (Inter 300, no unit clutter) */}
          <div className="flex items-baseline md:text-right self-stretch md:self-auto justify-between border-t border-white/8 md:border-t-0 pt-4 md:pt-0">
            <div className="md:hidden flex flex-col">
              <span className="font-mono text-[8px] text-gray-500 uppercase">Ambient Index</span>
              <span className="font-sans text-xs text-gray-300 font-bold uppercase mt-0.5">Live Calibrated</span>
            </div>
            <div className="flex items-baseline">
              <span className="font-sans font-light text-6xl md:text-8xl text-white tracking-tighter">
                {weather.temp}
              </span>
              <span className="font-display font-extrabold text-2xl text-brand-accent ml-1">&deg;</span>
            </div>
          </div>
        </div>

        {/* METEOROLOGICAL STATS BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          {[
            { label: 'Precipitation', value: weather.precipitation, emoji: '💧' },
            { label: 'Humidity', value: weather.humidity, emoji: '💦' },
            { label: 'Wind Velocity', value: weather.wind, emoji: '🌬️' },
            { label: 'UV Index', value: weather.uvIndex, emoji: '☀️' },
            { label: 'Air Quality', value: weather.airQuality.split(' (')[0], emoji: '🌿' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-black/20 border border-white/6 p-3.5 rounded-xl flex flex-col justify-between h-20 hover:border-brand-accent/25 transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest font-black">
                  {stat.label}
                </span>
                <span className="text-xs">{stat.emoji}</span>
              </div>
              <span className="font-sans font-black text-xs md:text-sm text-white mt-1">
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* FORECAST OUTLOOK STRIP */}
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center border-b border-white/8 pb-3">
            <div className="flex gap-2">
              {(['hourly', 'weekly'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMetricTab(tab)}
                  className={`px-4 py-1.5 rounded-full font-mono text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
                    metricTab === tab
                      ? 'bg-brand-accent text-[#0B0F19] font-black shadow-md'
                      : 'bg-white/5 border border-white/8 text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab === 'hourly' ? '⏱️ Hourly Feed' : '📅 5-Day Outlook'}
                </button>
              ))}
            </div>
            <span className="hidden sm:inline font-mono text-[9px] text-brand-accent uppercase tracking-widest font-black">
              Vector Calibrated
            </span>
          </div>

          <div className="relative overflow-hidden min-h-[110px]">
            <AnimatePresence mode="wait">
              {metricTab === 'hourly' ? (
                <motion.div
                  key="hourly"
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="w-full overflow-x-auto pb-2 scrollbar-none"
                >
                  <div className="flex gap-4 min-w-max py-1">
                    {weather.hourly.map((item, index) => {
                      const isActive = index === 0; // Highlight current hour
                      return (
                        <div
                          key={index}
                          className={`glass p-4 rounded-2xl flex flex-col items-center justify-center gap-2.5 min-w-[95px] transition-all duration-300 ${
                            isActive
                              ? 'border-brand-accent/40 bg-brand-accent/5 shadow-[0_0_15px_rgba(255,209,102,0.15)] scale-102'
                              : 'bg-black/10 border-white/5'
                          }`}
                        >
                          <span className="font-mono text-[9px] text-gray-500 uppercase font-black">
                            {item.time}
                          </span>
                          <div className="my-0.5">
                            {getWeatherIcon(item.icon, "w-6 h-6")}
                          </div>
                          <span className="font-sans font-black text-sm text-white">
                            {item.temp}&deg;
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="weekly"
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="w-full flex flex-col gap-2.5"
                >
                  {weather.weekly.map((item, index) => (
                    <div
                      key={index}
                      className="bg-black/10 border border-white/5 p-3.5 px-5 rounded-xl flex items-center justify-between gap-4 hover:border-brand-accent/20 transition-all text-xs"
                    >
                      <span className="font-mono text-[10px] font-black uppercase text-gray-450 block w-16">
                        {item.day}
                      </span>
                      <div className="flex items-center gap-2">
                        {getWeatherIcon(item.cond, "w-4.5 h-4.5")}
                        <span className="font-mono text-[9px] text-gray-500 uppercase font-bold">
                          {item.cond}
                        </span>
                      </div>
                      <span className="font-sans font-black text-sm text-white">
                        {item.temp}&deg;C
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Advisory banner */}
        <div className="bg-black/20 border border-white/8 rounded-2xl p-4 flex items-start gap-3.5 text-xs leading-relaxed text-gray-300">
          <AlertCircle className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
          <div>
            <strong className="text-brand-accent uppercase font-mono text-[9px] tracking-widest block mb-0.5 font-black">
              METEOROLOGICAL ADVICE
            </strong>
            Currently {weather.temp}&deg;C with {weather.condition}. {weather.temp > 28 ? 'We highly recommend lightweight breathable clothing and seeking shaded vectors during peak sun hours. Schedule exploration landmarks for early sunrise or late twilight intervals.' : 'Optimal conditions for extended walking explorations. Cool breezes are perfect for outdoor discovery lanes, scenic walks, and temple wanderings.'}
          </div>
        </div>
      </div>
    </section>
  );
};
