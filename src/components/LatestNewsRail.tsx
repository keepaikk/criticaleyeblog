import React from 'react';
import { Article } from '../types';
import { formatTimeAgo } from '../utils/formatters';
import { ChevronRight } from 'lucide-react';

interface LatestNewsRailProps {
  articles: Article[];
  onSelect: (article: Article) => void;
}

export const LatestNewsRail: React.FC<LatestNewsRailProps> = ({ articles, onSelect }) => {
  return (
    <div className="border-b border-stone-200 dark:border-stone-800 pb-8 mb-10 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <span className="w-2 h-2 bg-amber-800 dark:bg-amber-500 rounded-full" />
          <span>Latest Healthcare Dispatches</span>
        </h2>
        <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Real-Time Newsroom Wire</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.slice(0, 4).map((art) => (
          <div
            key={art.id}
            onClick={() => onSelect(art)}
            className="group cursor-pointer flex flex-col justify-between pt-2 border-t border-stone-200/80 dark:border-stone-800/80 hover:border-amber-800/60 dark:hover:border-amber-500/60 transition-colors"
          >
            <div>
              <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 mb-1.5 font-medium">
                <span className="text-amber-900 dark:text-amber-400 font-semibold">{art.category}</span>
                <span aria-hidden="true">·</span>
                <span>{formatTimeAgo(art.publishedAt)}</span>
              </div>
              <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-amber-900 dark:group-hover:text-amber-400 leading-snug line-clamp-2 transition-colors">
                {art.title}
              </h3>
              <p className="mt-1.5 text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                {art.deck}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-stone-400 dark:text-stone-500 group-hover:text-amber-900 dark:group-hover:text-amber-400 pt-2">
              <span>{art.readTime}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
