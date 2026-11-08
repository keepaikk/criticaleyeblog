import { Article, Author } from '../types';
import { AUTHORS, INITIAL_ARTICLES } from '../data/newsData';

const BOOKMARKS_KEY = 'critical_eye_news_bookmarks_v1';
const BRAND_SETTINGS_KEY = 'critical_eye_blog_brand_v2';

// Bookmarks remain local (per-browser preference)
export function getBookmarks(): string[] {
  try {
    const data = localStorage.getItem(BOOKMARKS_KEY);
    if (data) return JSON.parse(data);
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

// Brand settings fallback (will be overridden by API when available)
export const DEFAULT_BRAND_SETTINGS = {
  logoUrl: '/images/critical_eye_facebook_profile.jpg',
  bannerUrl: '/images/criticaleye-banner-high-quality.jpeg',
  tagline: 'Journalism with Perspective. Reporting with Purpose.',
  showBanner: true,
};

export function getBrandSettings() {
  try {
    const data = localStorage.getItem(BRAND_SETTINGS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
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

// Legacy: seed data for offline fallback
export { AUTHORS, INITIAL_ARTICLES };
