import { Article } from '../types';

// Uses window.location.origin at runtime so the app works on any domain
// without rebuilding. VITE_SITE_URL can override at build time if needed.
const siteUrl =
  import.meta.env?.VITE_SITE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'https://example.com');

export function formatNewsDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return isoString;
  }
}

export function formatTimeAgo(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  } catch {
    return isoString;
  }
}

export function generateRssFeed(articles: Article[]): string {
  const now = new Date().toUTCString();
  const items = articles
    .filter((a) => a.status === 'Published')
    .map((a) => {
      const pubDate = a.publishedAt ? new Date(a.publishedAt).toUTCString() : now;
      return `
        <item>
          <title>${escapeXml(a.title)}</title>
          <link>${siteUrl}/article/${a.slug}</link>
          <guid>${siteUrl}/article/${a.slug}</guid>
          <pubDate>${pubDate}</pubDate>
          <description>${escapeXml(a.deck)}</description>
          <category>${escapeXml(a.category)}</category>
        </item>
      `.trim();
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Critical Eye Blog</title>
    <link>${siteUrl}</link>
    <description>Ghanaian and African healthcare journalism with perspective and purpose.</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`.trim();
}

export function generateSitemapXml(articles: Article[]): string {
  const now = new Date().toISOString();
  const articleUrls = articles
    .filter((a) => a.status === 'Published')
    .map(
      (a) =>
        `    <url>\n      <loc>${siteUrl}/article/${a.slug}</loc>\n      <lastmod>${a.updatedAt || a.publishedAt || now}</lastmod>\n    </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>\n      <loc>${siteUrl}/</loc>\n    </url>
${articleUrls}
</urlset>`.trim();
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
