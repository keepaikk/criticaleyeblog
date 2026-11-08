import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';
import { initDb } from './db.js';
import { seedDatabase } from './seed.js';
import { initAdminUser } from './routes/auth.js';
import articlesRouter from './routes/articles.js';
import authorsRouter from './routes/authors.js';
import settingsRouter from './routes/settings.js';
import authRouter from './routes/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 80;
const APP_URL = process.env.APP_URL || '';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Request logging for debug
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// API routes
app.use('/api/articles', articlesRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/auth', authRouter);

// Health check for Dokploy
app.get('/health', (req, res) => {
  res.type('text/plain').send('ok\n');
});

// Static files (images, assets) — do NOT serve index.html here
app.use(express.static(path.join(__dirname, '../dist'), { index: false }));

// Read and template index.html
const indexPath = path.join(__dirname, '../dist/index.html');
let renderedHtml;

if (existsSync(indexPath)) {
  const htmlTemplate = readFileSync(indexPath, 'utf-8');
  renderedHtml = APP_URL
    ? htmlTemplate.replace(/\{\{APP_URL\}\}/g, APP_URL)
    : htmlTemplate;
  console.log('index.html loaded and templated');
} else {
  console.error('CRITICAL: dist/index.html not found at', indexPath);
  renderedHtml = '<!doctype html><html><body>Build not found</body></html>';
}

// SPA catch-all — serve injected HTML for ALL non-API, non-static routes
app.get('*', (req, res) => {
  res.send(renderedHtml);
});

async function start() {
  try {
    await initDb();
    await seedDatabase();
    await initAdminUser();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
      console.log(`APP_URL: ${APP_URL || '(not set)'}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
