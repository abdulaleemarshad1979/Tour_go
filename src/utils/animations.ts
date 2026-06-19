export const EASE_CINEMATIC: [number, number, number, number] = [0.22, 1, 0.36, 1]; // Apple-style ease

export const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_CINEMATIC }
  }
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

export const scaleReveal = {
  hidden:  { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE_CINEMATIC }
  }
};

export const stagger = (delay = 0.08) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: delay } }
});

export const slideUp = {
  hidden:  { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_CINEMATIC }
  }
};

export const slideFromLeft = {
  hidden:  { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_CINEMATIC } }
};

// For page-level sections that animate on scroll
export const sectionReveal = {
  hidden:  { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_CINEMATIC }
  }
};

// Card hover micro-interaction
export const cardHover = {
  rest:  { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -6, transition: { duration: 0.3 } }
};

export const EASE_SPRING = { type: 'spring', stiffness: 300, damping: 30 };

export const heroReveal = {
  hidden:  { opacity: 0, y: 60, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.2, ease: EASE_CINEMATIC } }
};

export const cardReveal = (index: number) => ({
  hidden:  { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: index * 0.05, ease: EASE_CINEMATIC }
  }
});

export const drawerSlideUp = {
  hidden:  { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: EASE_CINEMATIC } },
  exit:    { y: '100%', opacity: 0, transition: { duration: 0.3 } }
};

export const drawerSlideRight = {
  hidden:  { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: EASE_CINEMATIC } },
  exit:    { x: '100%', opacity: 0, transition: { duration: 0.3 } }
};

