import React, { useState, useEffect, useRef } from 'react';
import { Article } from '../types';
import { Search, X, ArrowRight } from 'lucide-react';
import { formatNewsDate } from '../utils/formatters';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  articles,
  onSelectArticle,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = articles.filter((a) => {
    if (a.status !== 'Published') return false;
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
    if (!matchesCategory) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.deck.toLowerCase().includes(q) ||
      a.author.name.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.content.some((p) => p.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-stone-900/60 dark:bg-stone-950/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-stone-50 dark:bg-stone-900 rounded-lg shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center gap-3 bg-white dark:bg-stone-950">
          <Search className="w-5 h-5 text-stone-400 dark:text-stone-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Ghanaian & African health news, policy, clinical trials..."
            className="w-full bg-transparent text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 rounded"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 rounded border border-stone-200 dark:border-stone-700"
          >
            Esc
          </button>
        </div>

        {/* Quick Filter Bar */}
        <div className="px-4 py-2 border-b border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-stone-500 dark:text-stone-400 shrink-0 font-medium">Filter:</span>
          {['all', 'Ghana Health', 'Medical Research', 'Health Technology', 'Maternal & Child Health'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded text-xs whitespace-nowrap font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-amber-900 dark:bg-amber-500 text-white dark:text-stone-950 font-bold'
                    : 'bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
                }`}
              >
                {cat === 'all' ? 'All Coverage' : cat}
              </button>
            )
          )}
        </div>

        {/* Results Stream */}
        <div className="overflow-y-auto p-4 divide-y divide-stone-200 dark:divide-stone-800 space-y-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-stone-500 dark:text-stone-400 text-sm">
              No healthcare dispatches match “{query}”.
            </div>
          ) : (
            filtered.map((art) => (
              <div
                key={art.id}
                onClick={() => {
                  onSelectArticle(art);
                  onClose();
                }}
                className="pt-2 pb-3 group cursor-pointer hover:bg-amber-50/50 dark:hover:bg-amber-950/30 p-2 rounded transition-colors"
              >
                <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 mb-1">
                  <span className="font-semibold text-amber-900 dark:text-amber-400">{art.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{formatNewsDate(art.publishedAt)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{art.readTime}</span>
                </div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 group-hover:text-amber-900 dark:group-hover:text-amber-400 flex items-center justify-between">
                  <span>{art.title}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-amber-900 dark:text-amber-400 shrink-0 ml-2" />
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-1 mt-0.5">
                  {art.deck}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900/90 text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
          <span>{filtered.length} stories found</span>
          <span>Critical Eye Archive</span>
        </div>
      </div>
    </div>
  );
};
