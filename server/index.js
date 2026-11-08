import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
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

// API routes
app.use('/api/articles', articlesRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/auth', authRouter);

// Health check for Dokploy
app.get('/health', (req, res) => {
  res.type('text/plain').send('ok\n');
});

// Static files (built SPA + images)
app.use(express.static(path.join(__dirname, '../dist')));

// Read index.html template once and inject APP_URL
let htmlTemplate;
try {
  htmlTemplate = readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8');
} catch (err) {
  console.error('Could not read dist/index.html:', err.message);
  htmlTemplate = '<!doctype html><html><body>Build not found</body></html>';
}

const renderedHtml = APP_URL
  ? htmlTemplate.replace(/\{\{APP_URL\}\}/g, APP_URL)
  : htmlTemplate;

// SPA catch-all — serve injected HTML
app.get('*', (req, res) => {
  res.send(renderedHtml);
});

async function start() {
  try {
    await initDb();
    await seedDatabase();
    await initAdminUser();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`APP_URL: ${APP_URL || '(not set — SEO tags will have empty URLs)'}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
