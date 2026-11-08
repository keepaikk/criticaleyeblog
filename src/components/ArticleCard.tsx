import React from 'react';
import { Article } from '../types';
import { formatNewsDate } from '../utils/formatters';
import { Bookmark } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onSelect: (article: Article) => void;
  variant?: 'standard' | 'horizontal' | 'compact';
  isBookmarked?: boolean;
  onToggleBookmark?: (articleId: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelect,
  variant = 'standard',
  isBookmarked = false,
  onToggleBookmark,
}) => {
  if (variant === 'horizontal') {
    return (
      <article
        onClick={() => onSelect(article)}
        className="group cursor-pointer grid grid-cols-1 sm:grid-cols-12 gap-4 items-start pt-4 pb-5 border-b border-stone-200/80 dark:border-stone-800/80 hover:border-amber-800/40 dark:hover:border-amber-500/40 transition-colors"
      >
        <div className="sm:col-span-4 aspect-16/10 sm:aspect-4/3 overflow-hidden rounded-sm bg-stone-200 dark:bg-stone-800 shrink-0">
          <img
            src={article.imageUrl}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="sm:col-span-8 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1.5 font-medium">
              <div className="flex items-center gap-2">
                <span className="text-amber-900 dark:text-amber-400 font-semibold">{article.category}</span>
                <span aria-hidden="true">·</span>
                <span>{formatNewsDate(article.publishedAt)}</span>
              </div>
              {onToggleBookmark && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(article.id);
                  }}
                  className="p-1 text-stone-400 hover:text-amber-900 dark:hover:text-amber-400 transition-colors"
                  aria-label="Save article"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-800 dark:fill-amber-400 text-amber-800 dark:text-amber-400' : ''}`} />
                </button>
              )}
            </div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 group-hover:text-amber-900 dark:group-hover:text-amber-400 leading-snug transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
              {article.deck}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>By {article.author.name}</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article
        onClick={() => onSelect(article)}
        className="group cursor-pointer py-3 border-b border-stone-200/70 dark:border-stone-800/70 hover:border-amber-800/50 dark:hover:border-amber-500/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 mb-1 font-medium">
          <span className="text-amber-900 dark:text-amber-400 font-semibold">{article.category}</span>
          <span aria-hidden="true">·</span>
          <span>{formatNewsDate(article.publishedAt)}</span>
        </div>
        <h3 className="font-serif font-semibold text-sm text-stone-900 dark:text-stone-100 group-hover:text-amber-900 dark:group-hover:text-amber-400 leading-snug line-clamp-2 transition-colors">
          {article.title}
        </h3>
        <div className="mt-1 flex items-center justify-between text-[11px] text-stone-400 dark:text-stone-500">
          <span>{article.author.name}</span>
          <span>{article.readTime}</span>
        </div>
      </article>
    );
  }

  // Standard vertical card
  return (
    <article
      onClick={() => onSelect(article)}
      className="group cursor-pointer flex flex-col justify-between h-full bg-stone-50/50 dark:bg-stone-900/40 hover:bg-stone-100/50 dark:hover:bg-stone-900/80 p-2 sm:p-3 rounded-sm transition-colors border border-transparent hover:border-stone-200 dark:hover:border-stone-800"
    >
      <div>
        <div className="aspect-16/10 overflow-hidden rounded-sm bg-stone-200 dark:bg-stone-800 mb-3">
          <img
            src={article.imageUrl}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1.5 font-medium">
          <div className="flex items-center gap-2">
            <span className="text-amber-900 dark:text-amber-400 font-semibold">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span>{formatNewsDate(article.publishedAt)}</span>
          </div>
          {onToggleBookmark && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(article.id);
              }}
              className="p-1 text-stone-400 hover:text-amber-900 dark:hover:text-amber-400 transition-colors"
              aria-label="Save article"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-800 dark:fill-amber-400 text-amber-800 dark:text-amber-400' : ''}`} />
            </button>
          )}
        </div>

        <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 group-hover:text-amber-900 dark:group-hover:text-amber-400 leading-snug transition-colors line-clamp-2 mb-2">
          {article.title}
        </h3>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed mb-4">
          {article.deck}
        </p>
      </div>

      <div className="pt-3 border-t border-stone-200/70 dark:border-stone-800/70 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        <span className="font-medium text-stone-700 dark:text-stone-300">{article.author.name}</span>
        <span>{article.readTime}</span>
      </div>
    </article>
  );
};
