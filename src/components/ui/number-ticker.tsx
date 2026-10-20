import React, { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'motion/react';
import { cn } from '../../lib/utils';

interface NumberTickerProps {
  value: number;
  direction?: 'up' | 'down';
  className?: string;
  delay?: number; // in seconds
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
}

export const NumberTicker: React.FC<NumberTickerProps> = ({
  value,
  direction = 'up',
  delay = 0,
  className,
  decimalPlaces = 0,
  prefix = '',
  suffix = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === 'down' ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: '0px' });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(direction === 'down' ? 0 : value);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(() => {
    return springValue.on('change', (latest) => {
      if (ref.current) {
        const num = typeof latest === 'number' ? latest : parseFloat(String(latest)) || 0;
        const formatted = Intl.NumberFormat('en-IN', {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(Number(num.toFixed(decimalPlaces)));
        ref.current.textContent = `${prefix}${formatted}${suffix}`;
      }
    });
  }, [springValue, decimalPlaces, prefix, suffix]);

  return (
    <span
      ref={ref}
      className={cn('inline-block tabular-nums tracking-tight', className)}
    >
      {prefix}
      {direction === 'down'
        ? value.toLocaleString('en-IN')
        : (0).toLocaleString('en-IN')}
      {suffix}
    </span>
  );
};
