import { createHash, timingSafeEqual } from 'node:crypto';
import { Router, json, raw } from 'express';
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

const supportedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/octet-stream'];
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function imageType(bytes) {
  if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes.length >= 24 && bytes.subarray(0, 8).equals(pngSignature)
    && bytes.toString('ascii', 12, 16) === 'IHDR') return 'image/png';
  if (bytes.length >= 16 && bytes.toString('ascii', 0, 4) === 'RIFF'
    && bytes.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
}

router.post('/images', requirePublisher, raw({ type: supportedImageTypes, limit: '8mb', inflate: false }), async (req, res) => {
  const bytes = req.body;
  const contentType = Buffer.isBuffer(bytes) && imageType(bytes);
  if (!contentType || !req.is([contentType, 'application/octet-stream'])) {
    return res.status(415).json({ error: 'Send raw JPEG, PNG, or WebP image bytes' });
  }

  const siteUrl = process.env.APP_URL?.replace(/\/+$/, '');
  if (!siteUrl || !/^https:\/\/[^/?#]+$/i.test(siteUrl)) {
    return res.status(503).json({ error: 'Set APP_URL to the public HTTPS website origin to enable image uploads' });
  }

  const id = digest(bytes).toString('hex');
  try {
    const result = await query(
      'INSERT INTO social_images (id, content_type, bytes) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
      [id, contentType, bytes]
    );
    return res.status(result.rowCount ? 201 : 200).json({
      url: `${siteUrl}/api/publish/images/${id}`,
      contentType,
      size: bytes.length,
    });
  } catch (error) {
    console.error('Social image upload failed:', error.code || error.name);
    return res.status(500).json({ error: 'Failed to store image' });
  }
});

router.get('/images/:id', async (req, res) => {
  const { id } = req.params;
  if (!/^[a-f0-9]{64}$/.test(id)) return res.sendStatus(404);
  try {
    const { rows: [image] } = await query('SELECT content_type, bytes FROM social_images WHERE id = $1', [id]);
    if (!image) return res.sendStatus(404);
    return res.set({
      'Content-Type': image.content_type,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, max-age=31536000, immutable',
    }).send(image.bytes);
  } catch (error) {
    console.error('Social image retrieval failed:', error.code || error.name);
    return res.sendStatus(500);
  }
});

function requireArticleJson(req, res, next) {
  const idempotencyKey = req.get('Idempotency-Key');
  if (!idempotencyKey || !/^[A-Za-z0-9:_.=+\/-]{1,240}$/.test(idempotencyKey)) {
    return res.status(400).json({ error: 'Provide a stable Idempotency-Key of up to 240 characters' });
  }

  if (!req.is('application/json')) {
    return res.status(415).json({ error: 'Send the article as a JSON object with Content-Type: application/json' });
  }
  next();
}

router.post('/', requirePublisher, requireArticleJson, json({ limit: '128kb' }), async (req, res) => {
  const idempotencyKey = req.get('Idempotency-Key');
  const body = req.body;
  if (!body || Array.isArray(body) || typeof body !== 'object') {
    return res.status(400).json({ error: 'The article body must be a JSON object' });
  }

  const title = cleanText(body.title, 200);
  const deck = cleanText(body.deck, 600);
  const requestedCategory = cleanText(body.category, 80).toLowerCase();
  const category = CATEGORIES.find((name) => name.toLowerCase() === requestedCategory);
  const requestedType = cleanText(body.articleType ?? 'News', 20).toLowerCase();
  const articleType = articleTypes.find((type) => type.toLowerCase() === requestedType);
  const content = Array.isArray(body.content) && body.content.length <= 80
    ? body.content.map((paragraph) => cleanText(paragraph, 8000))
    : [];

  const fields = {};
  if (!title) fields.title = 'Send the article title as text (1–200 characters)';
  if (!deck) fields.deck = 'Send the article summary as text (1–600 characters)';
  if (!category) fields.category = `Choose one of: ${CATEGORIES.join(', ')}`;
  if (!articleType) fields.articleType = `Choose one of: ${articleTypes.join(', ')}`;
  if (!content.length || content.some((part) => !part)) {
    fields.content = 'Send an array of 1–80 paragraph strings, each 1–8000 characters';
  }
  if (Object.keys(fields).length) {
    return res.status(400).json({ error: 'Invalid article fields', fields });
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
