import { createHash, timingSafeEqual } from 'node:crypto';
import { Router, json } from 'express';
import { CATEGORIES } from '../categories.js';
import { query } from '../db.js';

const router = Router();
const articleTypes = ['News', 'Analysis', 'Investigation', 'Opinion', 'Feature'];
const digest = (value) => createHash('sha256').update(value).digest();
const cleanText = (value, limit) =>
  typeof value === 'string' && value.trim().length <= limit && !value.includes('\0')
    ? value.trim()
    : '';

function requirePublisher(req, res, next) {
  const key = process.env.SOCIAL_PUBLISH_KEY;
  if (!key) return res.status(503).json({ error: 'Social publishing is disabled' });

  const authorization = req.get('Authorization');
  if (!authorization?.startsWith('Bearer ') || !timingSafeEqual(digest(authorization.slice(7)), digest(key))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

router.post('/', requirePublisher, json({ limit: '128kb' }), async (req, res) => {
  const idempotencyKey = req.get('Idempotency-Key');
  if (!idempotencyKey || !/^[A-Za-z0-9:_.=+\/-]{1,240}$/.test(idempotencyKey)) {
    return res.status(400).json({ error: 'Provide a stable Idempotency-Key of up to 240 characters' });
  }

  const body = req.body ?? {};
  const title = cleanText(body.title, 200);
  const deck = cleanText(body.deck, 600);
  const category = CATEGORIES.find((name) => name.toLowerCase() === cleanText(body.category, 80).toLowerCase());
  const articleType = body.articleType ?? 'News';
  const content = Array.isArray(body.content) && body.content.length <= 80
    ? body.content.map((paragraph) => cleanText(paragraph, 8000))
    : [];
  if (!title || !deck || !category || !articleTypes.includes(articleType) || !content.length || content.some((part) => !part)) {
    return res.status(400).json({ error: 'Provide title, deck, a valid category and articleType, and a nonempty array of paragraphs' });
  }

  const imageUrl = cleanText(body.imageUrl, 2048);
  const imageCaption = cleanText(body.imageCaption, 500);
  const imageCredit = cleanText(body.imageCredit, 200);
  if (body.imageUrl) {
    let url;
    try {
      url = new URL(imageUrl);
    } catch {
      return res.status(400).json({ error: 'imageUrl must be a public HTTPS URL' });
    }
    if (url.protocol !== 'https:' || url.username || url.password || !imageCredit) {
      return res.status(400).json({ error: 'Provide a public HTTPS imageUrl with an imageCredit' });
    }
  }

  const hash = digest(idempotencyKey).toString('hex');
  const id = `social-${hash}`;
  const titleSlug = title.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').slice(0, 75).replace(/^-+|-+$/g, '');
  const slug = `${titleSlug || 'story'}-${hash.slice(0, 16)}`;
  const publishedAt = new Date().toISOString();
  const words = content.join(' ').trim().split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(words / 220))} min read`;
  const author = cleanText(body.author, 120) || 'Critical Eye Editorial';

  try {
    const result = await query(`
      WITH publication AS (
        INSERT INTO social_publications (article_id) VALUES ($1)
        ON CONFLICT DO NOTHING
        RETURNING article_id
      )
      INSERT INTO articles (
        id, slug, title, deck, category, article_type, status, featured,
        author_name, author_role, published_at, read_time,
        image_url, image_caption, image_credit, content, is_blog_post
      )
      SELECT article_id,$2,$3,$4,$5,$6,'Published',FALSE,$7,'Contributor',$8,$9,$10,$11,$12,$13,TRUE
      FROM publication
      RETURNING id, slug, status
    `, [id, slug, title, deck, category, articleType, author, publishedAt, readTime, imageUrl, imageCaption, imageCredit, content]);
    const article = result.rows[0] ?? (await query('SELECT id, slug, status FROM articles WHERE id = $1', [id])).rows[0];
    if (!article || article.status !== 'Published') {
      return res.status(409).json({ error: 'This message key belongs to an article that is no longer published' });
    }

    const path = `/article/${encodeURIComponent(article.slug)}`;
    const siteUrl = process.env.APP_URL?.replace(/\/+$/, '') || '';
    return res.status(result.rowCount ? 201 : 200).json({ ...article, url: siteUrl + path });
  } catch (error) {
    console.error('Social publishing failed:', error.code || error.name);
    return res.status(500).json({ error: 'Failed to publish article' });
  }
});

export default router;
