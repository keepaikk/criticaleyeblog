import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
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

// SPA catch-all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

async function start() {
  try {
    await initDb();
    await seedDatabase();
    await initAdminUser();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
