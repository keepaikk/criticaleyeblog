import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM authors ORDER BY name');
    res.json(result.rows.map(row => ({
      id: row.id,
      name: row.name,
      role: row.role,
      bio: row.bio,
      email: row.email,
      articlesCount: row.articles_count,
    })));
  } catch (err) {
    console.error('GET /authors error:', err);
    res.status(500).json({ error: 'Failed to fetch authors' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const a = req.body;
    const result = await query(`
      INSERT INTO authors (id, name, role, bio, email, articles_count)
      VALUES ($1,$2,$3,$4,$5,$6)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name, role = EXCLUDED.role, bio = EXCLUDED.bio,
        email = EXCLUDED.email, articles_count = EXCLUDED.articles_count
      RETURNING *
    `, [a.id, a.name, a.role, a.bio, a.email, a.articlesCount || 0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('POST /authors error:', err);
    res.status(500).json({ error: 'Failed to save author' });
  }
});

export default router;
