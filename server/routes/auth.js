import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { generateToken } from '../middleware/auth.js';

const router = Router();

// Initialize admin user on first startup
export async function initAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set. CMS login disabled.');
    return;
  }
  const existing = await query('SELECT * FROM users WHERE email = $1', [email]);
  if (existing.rows.length === 0) {
    const hash = await bcrypt.hash(password, 12);
    await query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, hash]);
    console.log('Admin user created:', email);
  }
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = generateToken({ email: user.email, role: user.role });
  res.json({ token, user: { email: user.email, role: user.role } });
});

export default router;
