import React from 'react';
import { cn } from '../../lib/utils';

interface MarqueeProps {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  speed?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  className,
  reverse = false,
  pauseOnHover = true,
  children,
  vertical = false,
  repeat = 4,
  speed = '30s',
}) => {
  return (
    <div
      className={cn(
        'group relative flex overflow-hidden p-2 [--gap:1.5rem] [gap:var(--gap)]',
        {
          'flex-row': !vertical,
          'flex-col': vertical,
        },
        className
      )}
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      }}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={cn('flex shrink-0 justify-around [gap:var(--gap)]', {
            'animate-marquee flex-row': !vertical,
            'animate-marquee-vertical flex-col': vertical,
            'group-hover:[animation-play-state:paused]': pauseOnHover,
            '[animation-direction:reverse]': reverse,
          })}
          style={{ animationDuration: speed }}
        >
          {children}
        </div>
      ))}
    </div>
  );
};
