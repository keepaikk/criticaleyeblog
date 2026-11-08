import { Article } from '../types';

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
    const past = new Date(isoString).getTime();
    const now = Date.now();
    const diffHours = Math.round((now - past) / (1000 * 60 * 60));
    if (diffHours <= 0) return 'Just now';
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.round(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatNewsDate(isoString);
  } catch {
    return formatNewsDate(isoString);
  }
}

export function generateRssFeed(articles: Article[]): string {
  const published = articles.filter((a) => a.status === 'Published');
  const items = published
    .map(
      (a) => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>https://criticaleyenews.org/article/${a.slug}</link>
      <guid isPermaLink="true">https://criticaleyenews.org/article/${a.slug}</guid>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <author>${a.author.name}</author>
      <category><![CDATA[${a.category}]]></category>
      <description><![CDATA[${a.deck}]]></description>
    </item>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Critical Eye</title>
    <link>https://criticaleye.org</link>
    <description>Journalism with Perspective. Reporting with Purpose. Independent Ghanaian and African healthcare journalism.</description>
    <language>en-gh</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://criticaleyenews.org/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;
}

export function generateSitemapXml(articles: Article[]): string {
  const staticUrls = [
    { loc: 'https://criticaleyenews.org/', priority: '1.0', changefreq: 'hourly' },
    { loc: 'https://criticaleyenews.org/ghana-health', priority: '0.9', changefreq: 'daily' },
    { loc: 'https://criticaleyenews.org/africa-health', priority: '0.9', changefreq: 'daily' },
    { loc: 'https://criticaleyenews.org/global-health', priority: '0.8', changefreq: 'daily' },
    { loc: 'https://criticaleyenews.org/research-innovation', priority: '0.8', changefreq: 'daily' },
    { loc: 'https://criticaleyenews.org/analysis', priority: '0.8', changefreq: 'daily' },
    { loc: 'https://criticaleyenews.org/about', priority: '0.6', changefreq: 'monthly' },
    { loc: 'https://criticaleyenews.org/editorial-policy', priority: '0.5', changefreq: 'monthly' },
    { loc: 'https://criticaleyenews.org/corrections-policy', priority: '0.5', changefreq: 'monthly' },
    { loc: 'https://criticaleyenews.org/medical-disclaimer', priority: '0.5', changefreq: 'monthly' },
  ];

  const articleUrls = articles
    .filter((a) => a.status === 'Published')
    .map(
      (a) => `
  <url>
    <loc>https://criticaleyenews.org/article/${a.slug}</loc>
    <lastmod>${a.updatedAt || a.publishedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('');

  const staticXml = staticUrls
    .map(
      (u) => `
  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${staticXml}
  ${articleUrls}
</urlset>`;
}
