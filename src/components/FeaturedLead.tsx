import React from 'react';
import { Article } from '../types';
import { formatNewsDate } from '../utils/formatters';
import { ArrowRight, Bookmark } from 'lucide-react';

interface FeaturedLeadProps {
  article: Article;
  onSelect: (article: Article) => void;
  isBookmarked: boolean;
  onToggleBookmark: (articleId: string) => void;
}

export const FeaturedLead: React.FC<FeaturedLeadProps> = ({
  article,
  onSelect,
  isBookmarked,
  onToggleBookmark,
}) => {
  return (
    <article className="border-b border-stone-200 dark:border-stone-800 pb-10 mb-10 transition-colors">
      {/* Editorial Lead Section Kicker */}
      <div className="flex items-center justify-between gap-4 mb-4 text-xs font-semibold uppercase tracking-wider text-amber-900 dark:text-amber-400">
        <div className="flex items-center gap-2">
          <span>Lead Investigation & Policy Feature</span>
          <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">/</span>
          <span className="text-stone-600 dark:text-stone-400 font-normal normal-case">{article.category}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(article.id);
          }}
          className={`flex items-center gap-1.5 text-xs font-normal normal-case px-2.5 py-1 rounded transition-colors ${
            isBookmarked
              ? 'text-amber-900 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/70 font-medium border border-amber-300/40'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900'
          }`}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this story'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-800 dark:fill-amber-400 text-amber-800 dark:text-amber-400' : ''}`} />
          <span>{isBookmarked ? 'Saved' : 'Save story'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Hero Image with High Quality Framing */}
        <div
          className="lg:col-span-7 group cursor-pointer overflow-hidden rounded-sm bg-stone-200 dark:bg-stone-800"
          onClick={() => onSelect(article)}
        >
          <div className="relative aspect-16/9 overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
          {article.imageCaption && (
            <p className="mt-2 text-xs font-serif italic text-stone-500 dark:text-stone-400 line-clamp-2">
              {article.imageCaption}
              {article.imageCredit && (
                <span className="ml-1.5 not-italic text-stone-400 dark:text-stone-500 font-sans">
                  — Credit: {article.imageCredit}
                </span>
              )}
            </p>
          )}
        </div>

        {/* Right 5 Columns: Dominant Editorial Headline, Deck, Byline */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-2 font-medium">
              <span>{article.articleType}</span>
              <span aria-hidden="true">·</span>
              <span>{article.readTime}</span>
              <span aria-hidden="true">·</span>
              <span>{formatNewsDate(article.publishedAt)}</span>
            </div>

            <h1
              onClick={() => onSelect(article)}
              className="text-2xl sm:text-3xl lg:text-[2rem] font-serif font-bold text-stone-950 dark:text-stone-50 leading-snug tracking-tight hover:text-amber-900 dark:hover:text-amber-400 transition-colors cursor-pointer text-balance mb-3"
            >
              {article.title}
            </h1>

            <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
              {article.deck}
            </p>

            {/* Key Takeaways summary pill-free box */}
            {article.keyTakeaways && article.keyTakeaways.length > 0 && (
              <div className="bg-stone-100/70 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800/80 p-4 rounded-sm mb-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
                  Key Takeaways
                </h2>
                <ul className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
                  {article.keyTakeaways.slice(0, 2).map((takeaway, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-800 dark:text-amber-400 font-bold shrink-0">·</span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-stone-200/80 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
            <div>
              <span className="font-semibold text-stone-900 dark:text-stone-100">{article.author.name}</span>
              <span className="block text-[11px] text-stone-500 dark:text-stone-400">{article.author.role}</span>
            </div>

            <button
              onClick={() => onSelect(article)}
              className="inline-flex items-center gap-1.5 font-semibold text-amber-900 dark:text-amber-400 hover:text-amber-950 dark:hover:text-amber-300 group"
            >
              <span>Read Full Report</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
