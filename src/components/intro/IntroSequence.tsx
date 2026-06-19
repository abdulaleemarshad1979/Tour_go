import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE_CINEMATIC } from '../../utils/animations';
import gsap from 'gsap';

interface IntroSequenceProps {
  onComplete: () => void;
}

const scenes = [
  { text: "Some places aren't meant to stay hidden.", duration: 2000 },
  { text: "TOUR-GO", subtext: "TRAVEL BEYOND THE OBVIOUS", isLogo: true, duration: 2400 },
];

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const [currentScene, setCurrentScene] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Skip if intro has already been seen
    if (sessionStorage.getItem('tourgo_intro_seen') === 'true') {
      onComplete();
      return;
    }

    // GSAP parallax Ken Burns zoom on background video
    if (videoRef.current) {
      gsap.fromTo(videoRef.current,
        { scale: 1.1, opacity: 1.5 },
        { scale: 1.15, opacity: 0.4, duration: 8, ease: 'power1.inOut' }
      );
    }

    let timer: number;
    const playScene = (index: number) => {
      if (index >= scenes.length) {
        sessionStorage.setItem('tourgo_intro_seen', 'true');
        onComplete();
        return;
      }

      timer = window.setTimeout(() => {
        setCurrentScene(index + 1);
        playScene(index + 1);
      }, scenes[index].duration);
    };

    playScene(0);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem('tourgo_intro_seen', 'true');
    onComplete();
  };

  const scene = scenes[currentScene] || scenes[scenes.length - 1];

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: EASE_CINEMATIC }}
      className="fixed inset-0 z-50 bg-[#0B0F19] overflow-hidden flex items-center justify-center"
    >
      {/* Background Video Layer */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        loop
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay to make typography readable over any video */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-[1px]" />

      {/* Skip Button (always visible on mobile, glass style, appears after 1s delay) */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={handleSkip}
        className="absolute top-8 right-8 z-50 glass hover:bg-white/10 px-4 py-2 text-xs font-mono tracking-widest text-gray-300 hover:text-white transition-all uppercase rounded-full cursor-pointer"
      >
        Skip &rarr;
      </motion.button>

      {/* Progress Bar at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-accent/20 z-50">
        <motion.div
          className="h-full bg-brand-accent shadow-[0_0_8px_#FFD166]"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 8.4, ease: 'linear' }}
        />
      </div>

      {/* Cinematic Text Reveal */}
      <div className="relative z-10 px-6 max-w-4xl text-center select-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            initial={{ filter: "blur(20px)", opacity: 0, y: 30, scale: 0.95 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0, scale: 1 }}
            exit={{ filter: "blur(20px)", opacity: 0, y: -30, scale: 1.02 }}
            transition={{ duration: 0.8, ease: EASE_CINEMATIC }}
            className="flex flex-col items-center justify-center"
          >
            {scene.isLogo ? (
              <div className="flex flex-col items-center justify-center">
                <motion.h1
                  style={{ fontFamily: 'Playfair Display, serif' }}
                  className="font-black text-5xl md:text-8xl text-brand-accent drop-shadow-[0_0_35px_rgba(255,209,102,0.3)] uppercase select-none"
                  initial={{ letterSpacing: '0.05em', opacity: 0 }}
                  animate={{ letterSpacing: '0.25em', opacity: 1 }}
                  transition={{ duration: 2.0, ease: EASE_CINEMATIC }}
                >
                  {scene.text}
                </motion.h1>
                <motion.div
                  className="h-[1px] bg-brand-accent shadow-[0_0_8px_#FFD166] my-6"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '140px', opacity: 0.8 }}
                  transition={{ delay: 0.4, duration: 1.6, ease: EASE_CINEMATIC }}
                />
                <motion.p
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  className="font-medium text-xs md:text-sm text-gray-400 tracking-[0.4em] uppercase"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 1.2, ease: EASE_CINEMATIC }}
                >
                  {scene.subtext}
                </motion.p>
              </div>
            ) : (
              <>
                <h2 className="font-display font-bold text-3xl md:text-6xl text-white leading-tight mb-4 max-w-3xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  {scene.text}
                </h2>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
