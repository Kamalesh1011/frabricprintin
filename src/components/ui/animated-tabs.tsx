import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface AnimatedTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  tabClassName?: string;
  layoutId?: string;
}

export const AnimatedTabs: React.FC<AnimatedTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  tabClassName = '',
  layoutId = 'active-tab-pill',
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center p-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative z-10 px-4 py-2 rounded-full text-xs font-bold transition-colors duration-200 flex items-center gap-1.5 whitespace-nowrap',
              isActive
                ? 'text-white dark:text-[#0F100F]'
                : 'text-[#71717A] dark:text-[#A1A1AA] hover:text-[#0F100F] dark:hover:text-white',
              tabClassName
            )}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 bg-[#0F100F] dark:bg-white rounded-full shadow-md -z-10"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none',
                  isActive
                    ? 'bg-white/20 dark:bg-black/15 text-white dark:text-black'
                    : 'bg-black/10 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
