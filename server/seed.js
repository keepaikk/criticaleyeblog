import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import pool, { query } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function insertArticle(client, a) {
  await client.query(`INSERT INTO articles (
    id, slug, title, deck, category, article_type, status, featured,
    author_name, author_role, author_avatar, published_at, updated_at,
    read_time, image_url, image_caption, image_credit, content, key_takeaways,
    pull_quote_text, pull_quote_attribution, sources, medical_reviewer,
    is_blog_post, blog_series
  ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)
  ON CONFLICT (id) DO NOTHING`, [
    a.id, a.slug, a.title, a.deck, a.category, a.article_type, a.status, a.featured,
    a.author_name, a.author_role, a.author_avatar, a.published_at, a.updated_at,
    a.read_time, a.image_url, a.image_caption, a.image_credit, a.content, a.key_takeaways,
    a.pull_quote_text, a.pull_quote_attribution, a.sources, a.medical_reviewer,
    a.is_blog_post, a.blog_series,
  ]);
}

export async function seedDatabase() {
  console.log('Seeding database...');
  let data;
  try {
    const raw = readFileSync(path.join(__dirname, 'seed-data.json'), 'utf-8');
    data = JSON.parse(raw);
  } catch (err) {
    console.warn('seed-data.json not found, skipping seed:', err.message);
    return;
  }

  const existing = await query('SELECT COUNT(*) FROM articles');
  const isFresh = parseInt(existing.rows[0].count) === 0;

  if (isFresh) {
    for (const a of data.authors || []) {
      await query(`INSERT INTO authors (id, name, role, bio, email, articles_count)
        VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING`,
        [a.id, a.name, a.role, a.bio, a.email, a.articles_count]);
    }

    for (const a of data.articles || []) {
      await insertArticle({ query }, a);
    }
    console.log('Database seeded:', data.articles?.length || 0, 'articles,', data.authors?.length || 0, 'authors');
  } else {
    console.log('Database already seeded, skipping articles/authors...');
  }

  if (data.archiveArticles?.length) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const applied = await client.query(
        'INSERT INTO editorial_imports (id) VALUES ($1) ON CONFLICT DO NOTHING RETURNING id',
        ['archive-2023-2025'],
      );
      if (applied.rowCount) {
        for (const article of data.archiveArticles) {
          await insertArticle(client, article);
        }
      }
      const photos = data.archiveArticles.filter((article) => article.image_url);
      if (photos.length) {
        await client.query(`
          WITH migration AS (
            INSERT INTO editorial_imports (id)
            VALUES ('archive-editorial-photos')
            ON CONFLICT DO NOTHING
            RETURNING id
          )
          UPDATE articles AS article
          SET image_url = photo.image_url, image_caption = photo.image_caption, image_credit = photo.image_credit
          FROM migration, jsonb_to_recordset($1::jsonb)
            AS photo(id text, image_url text, image_caption text, image_credit text)
          WHERE article.id = photo.id AND COALESCE(article.image_url, '') = ''
        `, [JSON.stringify(photos.map(({ id, image_url, image_caption, image_credit }) => ({
          id, image_url, image_caption, image_credit,
        })))]);
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  // Always update brand_settings so banner/logo changes take effect on redeploy
  await query(`INSERT INTO brand_settings (id, logo_url, banner_url, tagline, show_banner)
    VALUES (1, $1, $2, $3, $4)
    ON CONFLICT (id) DO UPDATE SET
      logo_url = EXCLUDED.logo_url,
      banner_url = EXCLUDED.banner_url,
      tagline = EXCLUDED.tagline,
      show_banner = EXCLUDED.show_banner`, [
    '/images/critical_eye_facebook_profile.jpg',
    '/images/criticaleye-banner-high-quality.jpeg',
    'Journalism with Perspective. Reporting with Purpose.',
    true,
  ]);
  console.log('Brand settings updated');
}
