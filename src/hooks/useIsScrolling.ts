import { useEffect, useRef, useState } from 'react';

/**
 * Returns true while the user is actively scrolling (plus a short settle
 * period afterwards). Used to dim floating overlay buttons on mobile so they
 * stop drawing attention over headings and content while scrolling.
 */
export function useIsScrolling(idleMs = 900): boolean {
  const [scrolling, setScrolling] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onActivity = () => {
      setScrolling(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setScrolling(false), idleMs);
    };
    window.addEventListener('scroll', onActivity, { passive: true });
    window.addEventListener('touchmove', onActivity, { passive: true });
    return () => {
      window.removeEventListener('scroll', onActivity);
      window.removeEventListener('touchmove', onActivity);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [idleMs]);

  return scrolling;
}
