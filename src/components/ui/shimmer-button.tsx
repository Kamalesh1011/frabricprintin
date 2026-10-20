import React from 'react';
import { cn } from '../../lib/utils';
import { motion, type HTMLMotionProps } from 'motion/react';

interface ShimmerButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      children,
      shimmerColor = '#ffffff',
      shimmerSize = '0.1em',
      shimmerDuration = '2.5s',
      borderRadius = '9999px',
      background = 'linear-gradient(135deg, #0F100F 0%, #1c1d1c 100%)',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={
          {
            '--shimmer-color': shimmerColor,
            '--shimmer-size': shimmerSize,
            '--shimmer-duration': shimmerDuration,
            '--border-radius': borderRadius,
            '--background': background,
          } as React.CSSProperties
        }
        className={cn(
          'group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-6 py-3 text-white dark:text-[#0F100F] font-semibold text-sm shadow-md transition-all duration-300 [border-radius:var(--border-radius)]',
          'bg-[#0F100F] dark:bg-white',
          className
        )}
        {...props}
      >
        {/* Shimmer light sweep */}
        <div
          className="absolute inset-0 -z-30 overflow-visible opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 2.5s infinite linear',
          }}
        />

        {/* Ambient background glow on hover */}
        <div className="absolute inset-0 -z-20 bg-black/10 dark:bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Button Content */}
        <div className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </div>
      </motion.button>
    );
  }
);

ShimmerButton.displayName = 'ShimmerButton';
