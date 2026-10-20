import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useAnimationFrame,
  useReducedMotion,
  useMotionValue,
} from 'motion/react';

/**
 * Awwwards-style velocity-reactive marquee.
 * Base cruise speed + scroll-velocity boost, transform-only (60fps),
 * static fallback when the user prefers reduced motion.
 */
export const VelocityRibbon: React.FC<{ items: string[]; className?: string }> = ({
  items,
  className = '',
}) => {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smoothVelocity, [0, 3000], [0, 26], { clamp: false });
  // Content is duplicated 2x, so 0 → -50% is a seamless loop
  const x = useTransform(baseX, (v) => `-${v}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const dt = Math.min(delta, 64) / 1000;
    const speed = 3.2 + Math.min(Math.abs(boost.get()), 26);
    baseX.set((baseX.get() + speed * dt) % 50);
  });

  const row = (copy: number, hidden: boolean) => (
    <div key={copy} className="flex items-center gap-10 shrink-0 pr-10" aria-hidden={hidden}>
      {items.map((item) => (
        <span key={`${copy}-${item}`} className="flex items-center gap-10">
          <span>{item}</span>
          <span className="text-[#D4AF37]/50">❖</span>
        </span>
      ))}
    </div>
  );

  if (reduce) {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-x-8 gap-y-1 px-4 ${className}`}>
        {items.map((item) => (
          <span key={item} className="flex items-center gap-8">
            <span>{item}</span>
            <span className="text-[#D4AF37]/50">❖</span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div style={{ x }} className="flex w-max items-center">
        {row(0, false)}
        {row(1, true)}
      </motion.div>
    </div>
  );
};
