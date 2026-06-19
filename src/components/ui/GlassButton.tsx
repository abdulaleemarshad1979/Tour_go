import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface GlassButtonProps extends HTMLMotionProps<'button'> {
  active?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  active = false,
  className = '',
  ...props
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`glass px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest font-black transition-all cursor-pointer select-none ${
        active
          ? 'bg-brand-accent text-[#0B0F19] border-brand-accent'
          : 'bg-white/5 border-white/8 text-gray-300 hover:text-white hover:bg-white/10'
      } ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
