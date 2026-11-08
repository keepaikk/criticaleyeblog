import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      deck TEXT,
      category TEXT,
      article_type TEXT,
      status TEXT DEFAULT 'Draft',
      featured BOOLEAN DEFAULT FALSE,
      author_name TEXT,
      author_role TEXT,
      author_avatar TEXT,
      published_at TEXT,
      updated_at TEXT,
      read_time TEXT,
      image_url TEXT,
      image_caption TEXT,
      image_credit TEXT,
      content TEXT[],
      key_takeaways TEXT[],
      pull_quote_text TEXT,
      pull_quote_attribution TEXT,
      sources TEXT[],
      medical_reviewer TEXT,
      is_blog_post BOOLEAN DEFAULT FALSE,
      blog_series TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS corrections (
      id TEXT PRIMARY KEY,
      article_id TEXT REFERENCES articles(id) ON DELETE CASCADE,
      date TEXT,
      note TEXT,
      editor TEXT
    );

    CREATE TABLE IF NOT EXISTS authors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT,
      bio TEXT,
      email TEXT,
      articles_count INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS brand_settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      logo_url TEXT,
      banner_url TEXT,
      tagline TEXT,
      show_banner BOOLEAN DEFAULT TRUE,
      CONSTRAINT single_row CHECK (id = 1)
    );

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

export async function query(text, params) {
  return pool.query(text, params);
}

export default pool;
