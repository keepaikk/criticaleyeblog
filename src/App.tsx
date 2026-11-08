import React, { useState, useEffect } from 'react';
import { Article, Author, BrandSettings } from './types';
import {
  getStoredArticles,
  saveStoredArticles,
  getStoredAuthors,
  saveStoredAuthors,
  getBookmarks,
  toggleBookmark,
  getBrandSettings,
  saveBrandSettings,
} from './utils/storage';
import {
  ThemePreference,
  getStoredThemePreference,
  saveStoredThemePreference,
  applyTheme,
  isDaytimeNow,
} from './utils/theme';
import { Header } from './components/Header';
import { FeaturedLead } from './components/FeaturedLead';
import { LatestNewsRail } from './components/LatestNewsRail';
import { SectionHeader } from './components/SectionHeader';
import { ArticleCard } from './components/ArticleCard';
import { ArticleDetail } from './components/ArticleDetail';
import { SearchModal } from './components/SearchModal';
import { NewsletterSection } from './components/NewsletterSection';
import { StaticPages } from './components/StaticPages';
import { AdminAuth } from './admin/AdminAuth';
import { AdminCMS } from './components/AdminCMS';
import { BlogHub } from './components/BlogHub';
import { Footer } from './components/Footer';
import { ArrowLeft, Bookmark, Stethoscope, PenTool, ArrowRight } from 'lucide-react';

export default function App() {
  const [articles, setArticles] = useState<Article[]>(() => getStoredArticles());
  const [authors, setAuthors] = useState<Author[]>(() => getStoredAuthors());
  const [bookmarks, setBookmarks] = useState<string[]>(() => getBookmarks());
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(() => getBrandSettings());
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const adminPath = import.meta.env.VITE_ADMIN_PATH;

  // Daytime & Nighttime Theme State
  const [themePreference, setThemePreference] = useState<ThemePreference>(() => getStoredThemePreference());
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() => applyTheme(getStoredThemePreference()));
  const [isDaytime, setIsDaytime] = useState<boolean>(() => isDaytimeNow());

  // Sync theme when preference changes or when time transitions between daytime & nighttime
  useEffect(() => {
    const eff = applyTheme(themePreference);
    setEffectiveTheme(eff);
    setIsDaytime(isDaytimeNow());

    // Timer check every 60 seconds for automatic day/night transitions
    const interval = setInterval(() => {
      const currentDaytime = isDaytimeNow();
      setIsDaytime(currentDaytime);
      if (themePreference === 'auto') {
        const nextEff = applyTheme('auto');
        setEffectiveTheme(nextEff);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [themePreference]);

  const handleCycleTheme = () => {
    setThemePreference((prev) => {
      const next: ThemePreference = prev === 'auto' ? 'light' : prev === 'light' ? 'dark' : 'auto';
      saveStoredThemePreference(next);
      return next;
    });
  };

  // Navigation state
  const [currentView, setCurrentView] = useState<'home' | 'article' | 'category' | 'page' | 'admin' | 'bookmarks' | 'blog'>('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Ghana Health');
  const [selectedPage, setSelectedPage] = useState<string>('about');

  // Search modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Private newsroom route from the build environment. With no VITE_ADMIN_PATH,
  // no admin route exists in the bundle and /admin style probes find nothing.
  useEffect(() => {
    if (adminPath && window.location.pathname === adminPath) {
      setCurrentView('admin');
    }
  }, [adminPath]);

  // Sync articles changes to localStorage
  const handleSaveArticle = (updatedArticle: Article) => {
    setArticles((prev) => {
      const exists = prev.some((a) => a.id === updatedArticle.id);
      const next = exists
        ? prev.map((a) => (a.id === updatedArticle.id ? updatedArticle : a))
        : [updatedArticle, ...prev];
      saveStoredArticles(next);
      return next;
    });

    if (selectedArticle && selectedArticle.id === updatedArticle.id) {
      setSelectedArticle(updatedArticle);
    }
  };

  const handleDeleteArticle = (id: string) => {
    setArticles((prev) => {
      const next = prev.filter((a) => a.id !== id);
      saveStoredArticles(next);
      return next;
    });
  };

  const handleUpdateAllArticles = (newArticles: Article[]) => {
    setArticles(newArticles);
    saveStoredArticles(newArticles);
  };

  const handleSaveAuthor = (author: Author) => {
    setAuthors((prev) => {
      const next = [...prev, author];
      saveStoredAuthors(next);
      return next;
    });
  };

  const handleSaveBrandSettings = (newSettings: BrandSettings) => {
    setBrandSettings(newSettings);
    saveBrandSettings(newSettings);
  };

  const handleToggleBookmarkArticle = (articleId: string) => {
    const updated = toggleBookmark(articleId);
    setBookmarks(updated);
  };

  // Navigation handlers
  const handleNavigate = (view: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view === 'home') {
      setCurrentView('home');
      setSelectedArticle(null);
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', '/');
      }
    } else if (view === 'category' && param) {
      setSelectedCategory(param);
      setCurrentView('category');
      setSelectedArticle(null);
    } else if (view === 'page' && param) {
      setSelectedPage(param);
      setCurrentView('page');
      setSelectedArticle(null);
    } else if (view === 'admin') {
      setCurrentView('admin');
      if (adminPath) {
        window.history.pushState({}, '', adminPath);
      }
    } else if (view === 'bookmarks') {
      setCurrentView('bookmarks');
      setSelectedArticle(null);
    } else if (view === 'blog') {
      setCurrentView('blog');
      setSelectedArticle(null);
    }
  };

  const handleSelectArticle = (article: Article) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedArticle(article);
    setCurrentView('article');
  };

  // Keyboard shortcut for search (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter published articles
  const publishedArticles = articles.filter((a) => a.status === 'Published');

  // Featured lead story
  const featuredArticle = publishedArticles.find((a) => a.featured) || publishedArticles[0];

  // Specific thematic slices for the homepage editorial order
  const ghanaHealthArticles = publishedArticles.filter(
    (a) => a.category === 'Ghana Health' || a.category === 'Hospitals & Healthcare'
  );

  const publicHealthArticles = publishedArticles.filter(
    (a) => a.category === 'Public Health' || a.category === 'Maternal & Child Health' || a.category === 'Medicines & Pharmaceuticals'
  );

  const policyArticles = publishedArticles.filter(
    (a) => a.category === 'Healthcare Policy' || a.category === 'Ghana Health'
  );

  const researchAndInnovationArticles = publishedArticles.filter(
    (a) => a.category === 'Medical Research' || a.category === 'Health Technology'
  );

  const africaAndGlobalArticles = publishedArticles.filter(
    (a) => a.category === 'Africa Health' || a.category === 'Global Health'
  );

  const analysisAndInvestigations = publishedArticles.filter(
    (a) => a.articleType === 'Analysis' || a.articleType === 'Investigation'
  );

  const blogArticles = publishedArticles.filter(
    (a) => a.isBlogPost || a.articleType === 'Opinion' || Boolean(a.blogSeries)
  );

  const bookmarkedArticles = publishedArticles.filter((a) => bookmarks.includes(a.id));

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-amber-100 dark:selection:bg-amber-950 selection:text-amber-900 dark:selection:text-amber-200 transition-colors">
      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        articles={publishedArticles}
        onSelectArticle={handleSelectArticle}
      />

      {/* Primary Header with dedicated Logo, Brand Banner, and Day/Night Theme space */}
      {currentView !== 'admin' && (
        <Header
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenSearch={() => setIsSearchOpen(true)}
          bookmarksCount={bookmarks.length}
          brandSettings={brandSettings}
          themePreference={themePreference}
          effectiveTheme={effectiveTheme}
          isDaytime={isDaytime}
          onCycleTheme={handleCycleTheme}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: ADMIN CMS STUDIO */}
        {currentView === 'admin' && !isAdminUnlocked && (
          <AdminAuth onUnlock={() => setIsAdminUnlocked(true)} />
        )}

        {currentView === 'admin' && isAdminUnlocked && (
          <AdminCMS
            articles={articles}
            authors={authors}
            brandSettings={brandSettings}
            onSaveBrandSettings={handleSaveBrandSettings}
            onSaveArticle={handleSaveArticle}
            onDeleteArticle={handleDeleteArticle}
            onUpdateArticles={handleUpdateAllArticles}
            onSaveAuthor={handleSaveAuthor}
            onExitAdmin={() => handleNavigate('home')}
            onPreviewArticle={(art) => {
              setSelectedArticle(art);
              setCurrentView('article');
            }}
          />
        )}

        {/* VIEW 2: ARTICLE DETAIL READING VIEW */}
        {currentView === 'article' && selectedArticle && (
          <ArticleDetail
            article={selectedArticle}
            allArticles={publishedArticles}
            onBack={() => handleNavigate('home')}
            onSelectArticle={handleSelectArticle}
            isBookmarked={bookmarks.includes(selectedArticle.id)}
            onToggleBookmark={handleToggleBookmarkArticle}
          />
        )}

        {/* VIEW 3: CATEGORY BROWSING VIEW */}
        {currentView === 'category' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-4 mb-8">
              <button
                onClick={() => handleNavigate('home')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 mb-3"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Homepage</span>
              </button>
              <div className="text-xs font-mono uppercase tracking-widest text-amber-900 dark:text-amber-400 font-semibold">
                Healthcare Category Archive
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-950 dark:text-stone-50 mt-1">
                {selectedCategory}
              </h1>
              <p className="text-stone-600 dark:text-stone-300 text-sm mt-1">
                Authoritative reporting, policy dispatches, and clinical investigations covering {selectedCategory}.
              </p>
            </div>

            {/* Articles in this Category */}
            {(() => {
              const categoryItems = publishedArticles.filter(
                (a) =>
                  a.category === selectedCategory ||
                  (selectedCategory === 'Analysis' && a.articleType === 'Analysis') ||
                  (selectedCategory === 'Medical Research' && (a.category === 'Medical Research' || a.category === 'Health Technology'))
              );

              if (categoryItems.length === 0) {
                return (
                  <div className="py-16 text-center text-stone-500 dark:text-stone-400 bg-white dark:bg-stone-900 rounded border border-stone-200 dark:border-stone-800">
                    <p className="text-base font-serif font-bold text-stone-700 dark:text-stone-200">No published dispatches in this category yet.</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">New reporting will appear here following newsroom editorial approval.</p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryItems.map((art) => (
                    <ArticleCard
                      key={art.id}
                      article={art}
                      onSelect={handleSelectArticle}
                      isBookmarked={bookmarks.includes(art.id)}
                      onToggleBookmark={handleToggleBookmarkArticle}
                    />
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* VIEW 4: BOOKMARKS / SAVED READING LIST */}
        {currentView === 'bookmarks' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-4 mb-8 flex items-center justify-between">
              <div>
                <button
                  onClick={() => handleNavigate('home')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 mb-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Homepage</span>
                </button>
                <h1 className="text-3xl font-serif font-bold text-stone-950 dark:text-stone-50 flex items-center gap-2">
                  <Bookmark className="w-6 h-6 text-amber-800 dark:text-amber-400" />
                  <span>Saved Reading List</span>
                </h1>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Articles saved locally in your browser for offline or deferred reading.
                </p>
              </div>
              <span className="text-xs font-semibold text-stone-600 dark:text-stone-300 bg-stone-200 dark:bg-stone-800 px-3 py-1 rounded">
                {bookmarkedArticles.length} stories saved
              </span>
            </div>

            {bookmarkedArticles.length === 0 ? (
              <div className="py-16 text-center text-stone-500 dark:text-stone-400 bg-white dark:bg-stone-900 rounded border border-stone-200 dark:border-stone-800">
                <p className="text-base font-serif font-bold text-stone-700 dark:text-stone-200">Your reading list is empty.</p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Click the bookmark icon on any article to save it for later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedArticles.map((art) => (
                  <ArticleCard
                    key={art.id}
                    article={art}
                    onSelect={handleSelectArticle}
                    isBookmarked={true}
                    onToggleBookmark={handleToggleBookmarkArticle}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: STATIC PAGES (About, Policy, Disclaimer, Contact, etc.) */}
        {currentView === 'page' && (
          <StaticPages
            pageId={selectedPage}
            onNavigatePage={(pId) => setSelectedPage(pId)}
            authors={authors}
          />
        )}

        {/* VIEW: HEALTHCARE BLOG HUB */}
        {currentView === 'blog' && (
          <BlogHub
            articles={publishedArticles}
            onSelectArticle={handleSelectArticle}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmarkArticle}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {/* VIEW 6: HOMEPAGE (Editorial Layout Order) */}
        {currentView === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {/* 1. FEATURED STORY (Lead Salience Tier) */}
            {featuredArticle && (
              <FeaturedLead
                article={featuredArticle}
                onSelect={handleSelectArticle}
                isBookmarked={bookmarks.includes(featuredArticle.id)}
                onToggleBookmark={handleToggleBookmarkArticle}
              />
            )}

            {/* 2. LATEST NEWS WIRE */}
            <LatestNewsRail
              articles={publishedArticles}
              onSelect={handleSelectArticle}
            />

            {/* 3. GHANA HEALTH */}
            <section className="mb-14">
              <SectionHeader
                number="03"
                title="Ghana Health"
                subtitle="National Healthcare Systems & Facility Reforms"
                onViewAll={() => handleNavigate('category', 'Ghana Health')}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ghanaHealthArticles.slice(0, 3).map((art) => (
                  <ArticleCard
                    key={art.id}
                    article={art}
                    onSelect={handleSelectArticle}
                    isBookmarked={bookmarks.includes(art.id)}
                    onToggleBookmark={handleToggleBookmarkArticle}
                  />
                ))}
              </div>
            </section>

            {/* 4. PUBLIC HEALTH */}
            <section className="mb-14">
              <SectionHeader
                number="04"
                title="Public Health"
                subtitle="Epidemic Prevention, Sanitation & Maternal Health"
                onViewAll={() => handleNavigate('category', 'Public Health')}
              />
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {publicHealthArticles[0] && (
                  <div className="md:col-span-7">
                    <ArticleCard
                      article={publicHealthArticles[0]}
                      onSelect={handleSelectArticle}
                      isBookmarked={bookmarks.includes(publicHealthArticles[0].id)}
                      onToggleBookmark={handleToggleBookmarkArticle}
                    />
                  </div>
                )}
                <div className="md:col-span-5 divide-y divide-stone-200">
                  {publicHealthArticles.slice(1, 4).map((art) => (
                    <ArticleCard
                      key={art.id}
                      article={art}
                      variant="compact"
                      onSelect={handleSelectArticle}
                      isBookmarked={bookmarks.includes(art.id)}
                      onToggleBookmark={handleToggleBookmarkArticle}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* 5. HEALTHCARE & POLICY */}
            <section className="mb-14">
              <SectionHeader
                number="05"
                title="Healthcare & Policy"
                subtitle="Financing, Governance, NHIS & Ministry Directives"
                onViewAll={() => handleNavigate('category', 'Healthcare Policy')}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {policyArticles.slice(0, 2).map((art) => (
                  <ArticleCard
                    key={art.id}
                    article={art}
                    variant="horizontal"
                    onSelect={handleSelectArticle}
                    isBookmarked={bookmarks.includes(art.id)}
                    onToggleBookmark={handleToggleBookmarkArticle}
                  />
                ))}
              </div>
            </section>

            {/* HEALTHCARE BLOG & PERSPECTIVES SHOWCASE */}
            <section className="mb-14 bg-amber-50/50 dark:bg-stone-900/60 border border-amber-200/80 dark:border-stone-800 rounded-lg p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-amber-200/70 dark:border-stone-800 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-900 dark:text-amber-400 font-bold">
                    <Stethoscope className="w-4 h-4 text-amber-800 dark:text-amber-500" />
                    <span>Critical Eye Healthcare Blog</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-black text-stone-950 dark:text-stone-50 mt-1">
                    Frontline Dispatches & Clinician Commentary
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1">
                    First-hand insights from Ghanaian doctors, rural midwives, pharmacists, and health policy advocates.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleNavigate('blog')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-400 hover:text-amber-950 dark:hover:text-amber-300 transition-colors group"
                  >
                    <span>Explore All Blog Dispatches</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {blogArticles.slice(0, 3).map((art) => (
                  <article
                    key={art.id}
                    onClick={() => handleSelectArticle(art)}
                    className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded overflow-hidden flex flex-col justify-between cursor-pointer group hover:border-amber-800/40 dark:hover:border-amber-500/40 shadow-2xs transition-all"
                  >
                    <div>
                      <div className="aspect-16/10 relative overflow-hidden bg-stone-100 dark:bg-stone-800">
                        <img
                          src={art.imageUrl}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2 bg-stone-950/85 backdrop-blur-xs text-amber-400 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-bold">
                          {art.blogSeries || 'Clinician Dispatch'}
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="text-[10px] font-semibold text-amber-900 dark:text-amber-400 uppercase tracking-wider mb-1">
                          {art.category} · {art.readTime}
                        </div>
                        <h4 className="font-serif font-bold text-sm text-stone-950 dark:text-stone-50 group-hover:text-amber-900 dark:group-hover:text-amber-400 leading-snug line-clamp-2">
                          {art.title}
                        </h4>
                        <p className="text-stone-600 dark:text-stone-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                          {art.deck}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-2 border-t border-stone-100 dark:border-stone-800/60 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                      <span className="font-medium text-stone-800 dark:text-stone-200">
                        {art.author.name}
                      </span>
                      <span>Read essay →</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* 6. RESEARCH & CLINICAL INNOVATION */}
            <section className="mb-14">
              <SectionHeader
                number="06"
                title="Research & Innovation"
                subtitle="Biomedical Science, Diagnostics & Aerial Logistics"
                onViewAll={() => handleNavigate('category', 'Medical Research')}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {researchAndInnovationArticles.slice(0, 3).map((art) => (
                  <ArticleCard
                    key={art.id}
                    article={art}
                    onSelect={handleSelectArticle}
                    isBookmarked={bookmarks.includes(art.id)}
                    onToggleBookmark={handleToggleBookmarkArticle}
                  />
                ))}
              </div>
            </section>

            {/* 7. AFRICA & GLOBAL HEALTH */}
            <section className="mb-14">
              <SectionHeader
                number="07"
                title="Africa & Global Health"
                subtitle="Continental Surveillance & Multilateral Accords"
                onViewAll={() => handleNavigate('category', 'Africa Health')}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {africaAndGlobalArticles.slice(0, 2).map((art) => (
                  <ArticleCard
                    key={art.id}
                    article={art}
                    variant="horizontal"
                    onSelect={handleSelectArticle}
                    isBookmarked={bookmarks.includes(art.id)}
                    onToggleBookmark={handleToggleBookmarkArticle}
                  />
                ))}
              </div>
            </section>

            {/* 8. ANALYSIS & INVESTIGATIONS */}
            <section className="mb-14">
              <SectionHeader
                number="08"
                title="Analysis & Investigations"
                subtitle="Deep Dives, Accountability Reporting & In-Depth Context"
                onViewAll={() => handleNavigate('category', 'Analysis')}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analysisAndInvestigations.slice(0, 3).map((art) => (
                  <ArticleCard
                    key={art.id}
                    article={art}
                    onSelect={handleSelectArticle}
                    isBookmarked={bookmarks.includes(art.id)}
                    onToggleBookmark={handleToggleBookmarkArticle}
                  />
                ))}
              </div>
            </section>

            {/* 9. NEWSLETTER SUBSCRIPTION */}
            <NewsletterSection />
          </div>
        )}
      </main>

      {/* Primary Footer */}
      {currentView !== 'admin' && (
        <Footer
          onNavigatePage={(pId) => handleNavigate('page', pId)}
          onNavigateCategory={(cat) => handleNavigate('category', cat)}
          onNavigateBlog={() => handleNavigate('blog')}
        />
      )}
    </div>
  );
}
