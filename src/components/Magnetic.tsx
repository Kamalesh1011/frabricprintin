import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

/**
 * Magnetic hover wrapper — element leans toward the cursor and springs back.
 * Transform-only, disabled for touch / reduced-motion users.
 */
export const Magnetic: React.FC<{
  children: React.ReactNode;
  strength?: number;
  className?: string;
}> = ({ children, strength = 0.28, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 14, mass: 0.4 });

  const isCoarse =
    typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  const handleMove = (e: React.MouseEvent) => {
    if (reduce || isCoarse || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};
