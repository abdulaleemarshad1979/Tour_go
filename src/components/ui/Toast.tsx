import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 glass bg-[#111827]/95 border-[#FFD166]/30 px-5 py-3 rounded-full flex items-center gap-2.5 text-xs text-white shadow-2xl pointer-events-none"
        >
          <MapPin className="w-4 h-4 text-[#FFD166] animate-bounce" />
          <span className="font-mono uppercase tracking-widest text-[9px] font-bold text-gray-300">
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
