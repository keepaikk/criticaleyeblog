import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM brand_settings WHERE id = 1');
    if (result.rows.length === 0) {
      return res.json({
        logoUrl: '/images/critical_eye_facebook_profile.jpg',
        bannerUrl: '/images/criticaleye-banner-high-quality.jpeg',
        tagline: 'Journalism with Perspective. Reporting with Purpose.',
        showBanner: true,
      });
    }
    const row = result.rows[0];
    res.json({
      logoUrl: row.logo_url,
      bannerUrl: row.banner_url,
      tagline: row.tagline,
      showBanner: row.show_banner,
    });
  } catch (err) {
    console.error('GET /settings error:', err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.put('/', requireAuth, async (req, res) => {
  try {
    const s = req.body;
    await query(`
      INSERT INTO brand_settings (id, logo_url, banner_url, tagline, show_banner)
      VALUES (1, $1, $2, $3, $4)
      ON CONFLICT (id) DO UPDATE SET
        logo_url = EXCLUDED.logo_url, banner_url = EXCLUDED.banner_url,
        tagline = EXCLUDED.tagline, show_banner = EXCLUDED.show_banner
    `, [s.logoUrl, s.bannerUrl, s.tagline, s.showBanner]);
    res.json(s);
  } catch (err) {
    console.error('PUT /settings error:', err);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

export default router;
