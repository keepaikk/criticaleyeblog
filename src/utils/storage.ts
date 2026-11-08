import { Article, Author } from '../types';
import { AUTHORS, INITIAL_ARTICLES } from '../data/newsData';

const ARTICLES_KEY = 'critical_eye_news_articles_v1';
const AUTHORS_KEY = 'critical_eye_news_authors_v1';
const BOOKMARKS_KEY = 'critical_eye_news_bookmarks_v1';

export function getStoredArticles(): Article[] {
  try {
    const data = localStorage.getItem(ARTICLES_KEY);
    if (data) {
      const parsed: Article[] = JSON.parse(data);
      const existingIds = new Set(parsed.map((a) => a.id));
      const missing = INITIAL_ARTICLES.filter((a) => !existingIds.has(a.id));
      if (missing.length > 0) {
        const merged = [...parsed, ...missing];
        localStorage.setItem(ARTICLES_KEY, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load articles from localStorage', e);
  }
  return INITIAL_ARTICLES;
}

export function saveStoredArticles(articles: Article[]): void {
  try {
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
  } catch (e) {
    console.error('Failed to save articles to localStorage', e);
  }
}

export function getStoredAuthors(): Author[] {
  try {
    const data = localStorage.getItem(AUTHORS_KEY);
    if (data) {
      const parsed: Author[] = JSON.parse(data);
      const existingIds = new Set(parsed.map((a) => a.id));
      const missing = AUTHORS.filter((a) => !existingIds.has(a.id));
      if (missing.length > 0) {
        const merged = [...parsed, ...missing];
        localStorage.setItem(AUTHORS_KEY, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load authors from localStorage', e);
  }
  return AUTHORS;
}

export function saveStoredAuthors(authors: Author[]): void {
  try {
    localStorage.setItem(AUTHORS_KEY, JSON.stringify(authors));
  } catch (e) {
    console.error('Failed to save authors to localStorage', e);
  }
}

export function getBookmarks(): string[] {
  try {
    const data = localStorage.getItem(BOOKMARKS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load bookmarks', e);
  }
  return [];
}

export function toggleBookmark(articleId: string): string[] {
  const current = getBookmarks();
  const exists = current.includes(articleId);
  const updated = exists ? current.filter((id) => id !== articleId) : [...current, articleId];
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update bookmarks', e);
  }
  return updated;
}

const BRAND_SETTINGS_KEY = 'critical_eye_blog_brand_v2';

export const DEFAULT_BRAND_SETTINGS = {
  logoUrl: '/src/assets/images/critical_eye_facebook_profile.jpg',
  bannerUrl: '/src/assets/images/critical_eye_banner_wide.jpg',
  tagline: 'Journalism with Perspective. Reporting with Purpose.',
  showBanner: true,
};

export function getBrandSettings() {
  try {
    const data = localStorage.getItem(BRAND_SETTINGS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Migrate if user has an old banner url with "news" or previous asset id
      if (
        !parsed.bannerUrl ||
        parsed.bannerUrl.includes('1793830458439') ||
        parsed.bannerUrl.includes('critical_eye_brand_banner') ||
        parsed.bannerUrl.includes('1794121499771') ||
        parsed.bannerUrl.includes('critical_eye_facebook_cover')
      ) {
        parsed.bannerUrl = DEFAULT_BRAND_SETTINGS.bannerUrl;
      }
      if (
        !parsed.logoUrl ||
        parsed.logoUrl.includes('1793830473154') ||
        parsed.logoUrl.includes('critical_eye_logo_emblem') ||
        parsed.logoUrl.includes('1794121515245')
      ) {
        parsed.logoUrl = DEFAULT_BRAND_SETTINGS.logoUrl;
      }
      return { ...DEFAULT_BRAND_SETTINGS, ...parsed };
    }
    // Also check older v1 storage key to migrate user preferences
    const oldData = localStorage.getItem('critical_eye_news_brand_v1');
    if (oldData) {
      const parsed = JSON.parse(oldData);
      parsed.bannerUrl = DEFAULT_BRAND_SETTINGS.bannerUrl;
      parsed.logoUrl = DEFAULT_BRAND_SETTINGS.logoUrl;
      localStorage.setItem(BRAND_SETTINGS_KEY, JSON.stringify(parsed));
      return { ...DEFAULT_BRAND_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load brand settings', e);
  }
  return DEFAULT_BRAND_SETTINGS;
}

export function saveBrandSettings(settings: typeof DEFAULT_BRAND_SETTINGS): void {
  try {
    localStorage.setItem(BRAND_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save brand settings', e);
  }
}
