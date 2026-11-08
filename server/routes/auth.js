import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { generateToken } from '../middleware/auth.js';

const router = Router();

// Simple login password — override via env for security, defaults to 'criticaleye'
const SIMPLE_PASSWORD = process.env.SIMPLE_ADMIN_PASSWORD || 'criticaleye';

// Initialize admin user on first startup (legacy bcrypt path, still works)
export async function initAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set. Using simple login only.');
    return;
  }
  const existing = await query('SELECT * FROM users WHERE email = $1', [email]);
  const hash = await bcrypt.hash(password, 12);

  if (existing.rows.length === 0) {
    await query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, hash]);
    console.log('Admin user created:', email);
  } else {
    await query('UPDATE users SET password_hash = $1 WHERE email = $2', [hash, email]);
    console.log('Admin password updated:', email);
  }
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  // SIMPLE LOGIN: if password matches SIMPLE_ADMIN_PASSWORD, accept any email
  if (password === SIMPLE_PASSWORD) {
    const token = generateToken({ email: email || 'admin', role: 'admin' });
    return res.json({ token, user: { email: email || 'admin', role: 'admin' } });
  }

  // FALLBACK: check against bcrypt-hashed user in database
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
