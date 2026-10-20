import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  badge,
  onClick,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
  onClick?: () => void;
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={cn(
        'row-span-1 rounded-3xl group/bento hover:shadow-2xl transition duration-300 shadow-sm p-5 bg-white/80 dark:bg-[#161716]/80 backdrop-blur-md border border-black/[0.08] dark:border-white/10 justify-between flex flex-col space-y-4 relative overflow-hidden',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-1 transition duration-200">
        <div className="flex items-center justify-between mb-2">
          {icon && <div className="p-2 rounded-2xl bg-amber-500/10 text-[#AC7900] dark:text-[#D4AF37]">{icon}</div>}
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/5 dark:bg-white/10 text-[#0F100F] dark:text-white">
              {badge}
            </span>
          )}
        </div>
        <div className="font-editorial font-bold text-[#0F100F] dark:text-white mb-1 mt-2 text-base sm:text-lg">
          {title}
        </div>
        <div className="font-normal text-[#71717A] dark:text-[#A1A1AA] text-xs leading-relaxed">
          {description}
        </div>
      </div>
    </motion.div>
  );
};
