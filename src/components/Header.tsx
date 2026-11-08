import React, { useState } from 'react';
import { Search, Menu, X, Bookmark, Sun, Moon, Sparkles } from 'lucide-react';
import { BrandSettings } from '../types';
import { ThemePreference } from '../utils/theme';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenSearch: () => void;
  bookmarksCount: number;
  brandSettings: BrandSettings;
  themePreference: ThemePreference;
  effectiveTheme: 'light' | 'dark';
  isDaytime: boolean;
  onCycleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
  bookmarksCount,
  brandSettings,
  themePreference,
  effectiveTheme,
  isDaytime,
  onCycleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Ghana Health', view: 'category', param: 'Ghana Health' },
    { label: 'Africa Health', view: 'category', param: 'Africa Health' },
    { label: 'Global Health', view: 'category', param: 'Global Health' },
    { label: 'Healthcare Blog', view: 'blog' },
    { label: 'Research & Innovation', view: 'category', param: 'Medical Research' },
    { label: 'Analysis', view: 'category', param: 'Analysis' },
    { label: 'About', view: 'page', param: 'about' },
  ];

  const handleNavClick = (view: string, param?: string) => {
    onNavigate(view, param);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 transition-colors">
      {/* 1. Top Utility Micro-Bar */}
      <div className="border-b border-stone-200/80 dark:border-stone-800/80 bg-stone-100/80 dark:bg-stone-900/80 py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-400 font-medium">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-stone-800 dark:text-stone-200">Accra & West Africa Edition</span>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">|</span>
            <span className="hidden sm:inline">Wednesday, 4 November 2026</span>
            <span aria-hidden="true" className="hidden sm:inline text-stone-300 dark:text-stone-700">|</span>
            <span className="hidden md:inline text-stone-500 dark:text-stone-400">ISSN 2958-482X</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Daytime & Nighttime Theme Switcher */}
            <button
              onClick={onCycleTheme}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-stone-200/70 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors"
              title={`Current: ${
                themePreference === 'auto'
                  ? `Auto (${isDaytime ? 'Daytime 6am-6pm' : 'Nighttime 6pm-6am'})`
                  : themePreference === 'light'
                  ? 'Manual Day'
                  : 'Manual Night'
              }. Click to toggle Day/Night/Auto.`}
            >
              {effectiveTheme === 'dark' ? (
                <Moon className="w-3 h-3 text-amber-400 fill-amber-400/20" />
              ) : (
                <Sun className="w-3 h-3 text-amber-600 fill-amber-600/20" />
              )}
              <span className="font-semibold text-[10px]">
                {themePreference === 'auto' ? (
                  <>Auto ({effectiveTheme === 'dark' ? 'Night' : 'Day'})</>
                ) : themePreference === 'dark' ? (
                  <>Night</>
                ) : (
                  <>Day</>
                )}
              </span>
            </button>

            <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">|</span>

            <button
              onClick={() => handleNavClick('bookmarks')}
              className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              title="Saved reading list"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved ({bookmarksCount})</span>
            </button>

            <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">|</span>

            <span className="font-semibold text-stone-400 font-mono text-[10px] uppercase tracking-widest">ISSN 2958-482X</span>
          </div>
        </div>
      </div>

      {/* 2. DEDICATED BRAND MASTHEAD & BANNER ARTWORK SPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Official Brand Logo & Identity Lockup */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-4 cursor-pointer group text-center lg:text-left shrink-0"
          >
            {/* Logo Emblem Space */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden bg-white dark:bg-stone-900 shadow-sm border border-stone-200 dark:border-stone-800 shrink-0 p-1 group-hover:border-amber-800 dark:group-hover:border-amber-500 transition-colors">
              <img
                src={brandSettings.logoUrl}
                alt="Critical Eye Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Publication Title & Purpose */}
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight text-stone-950 dark:text-stone-50 group-hover:text-amber-900 dark:group-hover:text-amber-400 transition-colors">
                  CRITICAL EYE BLOG
                </span>
              </div>
              <p className="text-xs sm:text-sm font-serif italic text-amber-900 dark:text-amber-400 font-medium mt-0.5">
                {brandSettings.tagline}
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-[11px] text-stone-500 dark:text-stone-400 mt-1 font-medium">
                <span>Ghanaian Healthcare</span>
                <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
                <span>African Public Health</span>
                <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
                <span>Global Medical Policy</span>
              </div>
            </div>
          </div>

          {/* Official Brand Banner Artwork Slot */}
          {brandSettings.showBanner && (
            <div className="w-full lg:max-w-lg xl:max-w-xl shrink-0">
              <div
                onClick={() => handleNavClick('home')}
                className="relative cursor-pointer group overflow-hidden rounded border border-stone-300/80 dark:border-stone-800 shadow-xs hover:border-amber-800 dark:hover:border-amber-500 transition-all bg-stone-900"
              >
                <div className="relative aspect-[1024/180] overflow-hidden">
                  <img
                    src={brandSettings.bannerUrl}
                    alt="Critical Eye Blog Official Banner"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. MAIN NAVIGATION BAR (Sticky, clean typography) */}
      <div className="sticky top-0 z-40 bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-6">
          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-stone-800 dark:text-stone-200 tracking-wide">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.view, item.param)}
                className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                  currentView === item.view && (!item.param || item.label === 'Home' || item.label === 'Healthcare Blog')
                    ? 'border-amber-900 dark:border-amber-500 text-amber-900 dark:text-amber-400 font-bold'
                    : 'border-transparent text-stone-700 dark:text-stone-300 hover:text-amber-900 dark:hover:text-amber-400 hover:border-amber-800/40'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Compact brand text for mobile view */}
          <div className="lg:hidden flex items-center gap-2">
            <img
              src={brandSettings.logoUrl}
              alt="Logo"
              className="w-6 h-6 object-contain rounded"
            />
            <span className="font-serif font-black text-sm text-stone-900 dark:text-stone-100">
              CRITICAL EYE BLOG
            </span>
          </div>

          {/* Action Zone (Search, Theme quick button, Mobile Drawer trigger) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-200 bg-stone-200/80 dark:bg-stone-800 hover:bg-stone-300/80 dark:hover:bg-stone-700 rounded transition-colors"
              aria-label="Search articles"
            >
              <Search className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
              <span className="hidden sm:inline">Search Archive</span>
              <kbd className="hidden sm:inline text-[10px] bg-white dark:bg-stone-900 text-stone-500 dark:text-stone-400 px-1 py-0.5 rounded border border-stone-300 dark:border-stone-700">
                ⌘K
              </kbd>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 px-4 pt-3 pb-6 space-y-2 shadow-lg">
            <div className="flex flex-col gap-1">
              {navLinks.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.view, item.param)}
                  className="text-left px-3 py-2 text-sm font-semibold text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 rounded"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800 mt-2 space-y-1">
                <button
                  onClick={onCycleTheme}
                  className="w-full text-left px-3 py-2 text-sm font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 rounded flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    {effectiveTheme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-600" />}
                    <span>Theme: {themePreference === 'auto' ? `Auto (${effectiveTheme})` : effectiveTheme}</span>
                  </span>
                  <span className="text-xs text-stone-500">Tap to switch</span>
                </button>
                <button
                  onClick={() => handleNavClick('bookmarks')}
                  className="w-full text-left px-3 py-2 text-sm font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 rounded flex items-center gap-2"
                >
                  <Bookmark className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                  <span>Saved Articles ({bookmarksCount})</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
