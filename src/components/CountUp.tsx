import React, { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';

/** Scroll-triggered count-up (e.g. 0 → 7, 0 → 100%). Instant when reduced motion. */
export const CountUp: React.FC<{
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}> = ({ to, suffix = '', duration = 1.6, className = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVal(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {Math.round(val)}
      {suffix}
    </span>
  );
};
