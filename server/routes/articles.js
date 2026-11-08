import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function dbRowToArticle(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    deck: row.deck,
    category: row.category,
    articleType: row.article_type,
    status: row.status,
    featured: row.featured,
    author: {
      name: row.author_name,
      role: row.author_role,
      avatar: row.author_avatar,
    },
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    readTime: row.read_time,
    imageUrl: row.image_url,
    imageCaption: row.image_caption,
    imageCredit: row.image_credit,
    content: row.content || [],
    keyTakeaways: row.key_takeaways || [],
    pullQuote: row.pull_quote_text ? {
      text: row.pull_quote_text,
      attribution: row.pull_quote_attribution,
    } : undefined,
    sources: row.sources || [],
    medicalReviewer: row.medical_reviewer,
    isBlogPost: row.is_blog_post,
    blogSeries: row.blog_series,
    corrections: [],
  };
}

// Public: list all articles with corrections
router.get('/', async (req, res) => {
  try {
    const articlesRes = await query(`
      SELECT * FROM articles ORDER BY created_at DESC
    `);
    const correctionsRes = await query(`
      SELECT * FROM corrections ORDER BY date DESC
    `);

    const articles = articlesRes.rows.map(dbRowToArticle);
    const correctionsByArticle = {};
    for (const c of correctionsRes.rows) {
      if (!correctionsByArticle[c.article_id]) correctionsByArticle[c.article_id] = [];
      correctionsByArticle[c.article_id].push({
        id: c.id,
        date: c.date,
        note: c.note,
        editor: c.editor,
      });
    }
    for (const a of articles) {
      a.corrections = correctionsByArticle[a.id] || [];
    }

    res.json(articles);
  } catch (err) {
    console.error('GET /articles error:', err);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Protected: create or update article
router.post('/', requireAuth, async (req, res) => {
  try {
    const a = req.body;
    await query(`
      INSERT INTO articles (
        id, slug, title, deck, category, article_type, status, featured,
        author_name, author_role, author_avatar, published_at, updated_at,
        read_time, image_url, image_caption, image_credit, content, key_takeaways,
        pull_quote_text, pull_quote_attribution, sources, medical_reviewer,
        is_blog_post, blog_series
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug, title = EXCLUDED.title, deck = EXCLUDED.deck,
        category = EXCLUDED.category, article_type = EXCLUDED.article_type,
        status = EXCLUDED.status, featured = EXCLUDED.featured,
        author_name = EXCLUDED.author_name, author_role = EXCLUDED.author_role,
        author_avatar = EXCLUDED.author_avatar, published_at = EXCLUDED.published_at,
        updated_at = EXCLUDED.updated_at, read_time = EXCLUDED.read_time,
        image_url = EXCLUDED.image_url, image_caption = EXCLUDED.image_caption,
        image_credit = EXCLUDED.image_credit, content = EXCLUDED.content,
        key_takeaways = EXCLUDED.key_takeaways, pull_quote_text = EXCLUDED.pull_quote_text,
        pull_quote_attribution = EXCLUDED.pull_quote_attribution, sources = EXCLUDED.sources,
        medical_reviewer = EXCLUDED.medical_reviewer, is_blog_post = EXCLUDED.is_blog_post,
        blog_series = EXCLUDED.blog_series
      RETURNING *
    `, [
      a.id, a.slug, a.title, a.deck, a.category, a.articleType, a.status, a.featured,
      a.author?.name, a.author?.role, a.author?.avatar,
      a.publishedAt, a.updatedAt || new Date().toISOString(), a.readTime,
      a.imageUrl, a.imageCaption, a.imageCredit, a.content || [], a.keyTakeaways || [],
      a.pullQuote?.text, a.pullQuote?.attribution, a.sources || [], a.medicalReviewer,
      a.isBlogPost, a.blogSeries,
    ]);

    // Handle corrections
    if (a.corrections?.length > 0) {
      await query('DELETE FROM corrections WHERE article_id = $1', [a.id]);
      for (const c of a.corrections) {
        await query('INSERT INTO corrections (id, article_id, date, note, editor) VALUES ($1,$2,$3,$4,$5)',
          [c.id, a.id, c.date, c.note, c.editor]);
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error('POST /articles error:', err);
    res.status(500).json({ error: 'Failed to save article' });
  }
});

// Protected: delete article
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await query('DELETE FROM corrections WHERE article_id = $1', [req.params.id]);
    await query('DELETE FROM articles WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /articles error:', err);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// Protected: bulk update articles (e.g., set featured)
router.put('/bulk', requireAuth, async (req, res) => {
  try {
    const { articles } = req.body;
    await query('BEGIN');
    for (const a of articles) {
      await query('UPDATE articles SET featured = $1, updated_at = $2 WHERE id = $3',
        [a.featured, new Date().toISOString(), a.id]);
    }
    await query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await query('ROLLBACK');
    console.error('PUT /articles/bulk error:', err);
    res.status(500).json({ error: 'Failed to update articles' });
  }
});

export default router;
