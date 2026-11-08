import { Article, Author, BrandSettings } from '../types';

const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('ce_admin_token');
}

function headers(json = true): HeadersInit {
  const h: HeadersInit = {};
  if (json) h['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

// ─── Articles ───
export async function fetchArticles(): Promise<Article[]> {
  const res = await fetch(`${API_BASE}/articles`);
  if (!res.ok) throw new Error('Failed to fetch articles');
  return res.json();
}

export async function saveArticleApi(article: Article): Promise<Article> {
  const res = await fetch(`${API_BASE}/articles`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(article),
  });
  if (res.status === 401) throw new Error('Session expired. Please log in again.');
  if (!res.ok) throw new Error('Failed to save article');
  return res.json();
}

export async function deleteArticleApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/articles/${id}`, {
    method: 'DELETE',
    headers: headers(false),
  });
  if (res.status === 401) throw new Error('Session expired. Please log in again.');
  if (!res.ok) throw new Error('Failed to delete article');
}

export async function updateArticlesBulkApi(articles: Article[]): Promise<void> {
  const res = await fetch(`${API_BASE}/articles/bulk`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({ articles: articles.map(a => ({ id: a.id, featured: a.featured })) }),
  });
  if (res.status === 401) throw new Error('Session expired. Please log in again.');
  if (!res.ok) throw new Error('Failed to update articles');
}

// ─── Authors ───
export async function fetchAuthors(): Promise<Author[]> {
  const res = await fetch(`${API_BASE}/authors`);
  if (!res.ok) throw new Error('Failed to fetch authors');
  return res.json();
}

export async function saveAuthorApi(author: Author): Promise<Author> {
  const res = await fetch(`${API_BASE}/authors`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(author),
  });
  if (res.status === 401) throw new Error('Session expired. Please log in again.');
  if (!res.ok) throw new Error('Failed to save author');
  return res.json();
}

// ─── Settings ───
export async function fetchSettings(): Promise<BrandSettings> {
  const res = await fetch(`${API_BASE}/settings`);
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

export async function saveSettingsApi(settings: BrandSettings): Promise<BrandSettings> {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(settings),
  });
  if (res.status === 401) throw new Error('Session expired. Please log in again.');
  if (!res.ok) throw new Error('Failed to save settings');
  return res.json();
}

// ─── Auth ───
export async function loginApi(email: string, password: string): Promise<{ token: string; user: { email: string; role: string } }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Invalid credentials');
  }
  return res.json();
}

export function logoutApi(): void {
  localStorage.removeItem('ce_admin_token');
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
