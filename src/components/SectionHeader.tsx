import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  number: string;
  title: string;
  subtitle?: string;
  onViewAll?: () => void;
  viewAllLabel?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  number,
  title,
  subtitle,
  onViewAll,
  viewAllLabel = 'Explore Category',
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-3 mb-6 transition-colors">
      <div className="flex items-baseline gap-3">
        <span className="text-xs font-mono font-semibold text-amber-900 dark:text-amber-400 tracking-wider">
          {number}
        </span>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <span className="hidden md:inline text-xs text-stone-500 dark:text-stone-400 font-sans">
            — {subtitle}
          </span>
        )}
      </div>

      {onViewAll && (
        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 dark:text-amber-400 hover:text-amber-950 dark:hover:text-amber-300 group self-start sm:self-auto transition-colors"
        >
          <span>{viewAllLabel}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};
