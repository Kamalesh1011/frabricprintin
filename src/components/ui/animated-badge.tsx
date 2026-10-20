import React from 'react';
import { cn } from '../../lib/utils';

interface AnimatedBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'gold' | 'emerald' | 'neutral';
  pulse?: boolean;
}

export const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({
  children,
  icon,
  variant = 'gold',
  pulse = true,
  className = '',
  ...props
}) => {
  const variantStyles = {
    gold: {
      badge: 'border-[#AC7900]/25 dark:border-[#D4AF37]/30 bg-amber-500/10 dark:bg-amber-400/10 text-[#AC7900] dark:text-[#D4AF37]',
      dot: 'bg-[#AC7900] dark:bg-[#D4AF37]',
      ping: 'bg-[#AC7900] dark:bg-[#D4AF37]',
    },
    emerald: {
      badge: 'border-emerald-500/25 dark:border-emerald-400/30 bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-300',
      dot: 'bg-emerald-500',
      ping: 'bg-emerald-400',
    },
    neutral: {
      badge: 'border-black/10 dark:border-white/15 bg-white/80 dark:bg-white/5 text-[#0F100F] dark:text-white',
      dot: 'bg-slate-500',
      ping: 'bg-slate-400',
    },
  };

  const v = variantStyles[variant];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold backdrop-blur-md transition-all duration-300 shadow-sm hover:scale-[1.02]',
        v.badge,
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', v.ping)} />
          <span className={cn('relative inline-flex rounded-full h-2 w-2', v.dot)} />
        </span>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="leading-none">{children}</span>
    </div>
  );
};
