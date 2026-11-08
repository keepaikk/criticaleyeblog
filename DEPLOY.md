# Critical Eye Blog — Dokploy Production Deploy Guide

## What Was Fixed

| Issue | Fix |
|---|---|
| Images 404 in production | Moved `src/assets/images/` → `public/images/`. All refs updated to `/images/…`. |
| Dead dependencies | Removed `express`, `dotenv`, `@google/genai`, `@types/express`. |
| Nginx missing security headers | Added `Content-Security-Policy` + `HSTS`. |
| CMS stored in localStorage only | Added PostgreSQL + Express API. CMS now persists server-side. |
| Fake admin auth | Replaced with bcrypt + JWT. Env-based admin user auto-created on startup. |
| `.env.local` leaked in git | Removed from tracking. |

---

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Dokploy   │────→│   Node API  │────→│  PostgreSQL │
│  (reverse   │     │  (Express)  │     │   (data)    │
│   proxy)    │     │  serves SPA │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

- **Node API** (`server/index.js`) serves static files AND API routes.
- **PostgreSQL** stores articles, authors, corrections, brand settings, and admin users.
- **Seed data** auto-inserts on first startup if tables are empty.

---

## Dokploy UI Settings

### Step 1: Create PostgreSQL Database

1. In Dokploy dashboard, go to **Databases** → **Create Database**
2. **Type:** PostgreSQL
3. **Name:** `criticaleye-db`
4. **Username:** `criticaleye`
5. **Password:** Generate a strong password
6. **Database:** `criticaleye`
7. Click **Create** and wait for it to be ready

### Step 2: Create Application

1. **Applications** → **Create Application**
2. Name: `criticaleye-blog`
3. Source: **Git** → your repo → branch `main`
4. Build type: **Dockerfile**
5. Dockerfile path: `Dockerfile`
6. Click **Create**

### Step 3: Link Database to App

1. In your application, go to **Environment** tab
2. Dokploy should auto-populate `DATABASE_URL` if linked. If not, add:
   ```
   DATABASE_URL=postgres://criticaleye:DB_PASSWORD@db:5432/criticaleye
   ```
   (Replace `DB_PASSWORD` with the actual password from Step 1.)

### Step 4: Environment Variables

Add these in the Dokploy **Environment** tab (Runtime variables):

| Variable | Value | Notes |
|---|---|---|
| `DATABASE_URL` | `postgres://criticaleye:PASSWORD@db:5432/criticaleye` | Auto-filled if DB is linked |
| `JWT_SECRET` | `openssl rand -hex 32` | Generate fresh |
| `ADMIN_EMAIL` | `editor@criticaleye.org` | Your admin login |
| `ADMIN_PASSWORD` | Strong password | ≥ 12 characters |

Add in **Build Arguments** tab:

| Variable | Value | Notes |
|---|---|---|
| `VITE_ADMIN_PATH` | `/desk-xxxxxxxxxxxx` | Optional. `openssl rand -hex 6` |

### Step 5: Domains

1. **Domains** tab → **Add Domain**
2. Domain: `criticaleye.org`
3. Container Port: `80`
4. HTTPS: Enable
5. Save

### Step 6: Health Check

| Field | Value |
|---|---|
| Path | `/health` |
| Port | `80` |
| Interval | `30s` |
| Timeout | `5s` |
| Retries | `3` |

---

## Admin Access

1. Navigate to `https://your-domain.com/desk-xxxxxxxxxxxx`
   (the path you set in `VITE_ADMIN_PATH`)
2. Log in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`
3. JWT token is stored in browser localStorage for 24h

---

## Post-Deploy Verification

```bash
# Health check
curl -I https://your-domain.com/health

# API should return articles
curl -s https://your-domain.com/api/articles | head -c 200

# Images resolve
curl -I https://your-domain.com/images/critical_eye_banner_wide.jpg

# Security headers
curl -I https://your-domain.com/ | grep -i "strict-transport-security"
```

---

## Data Model

| Table | Purpose |
|---|---|
| `articles` | All stories with full content, metadata, corrections |
| `corrections` | Linked to articles (one-to-many) |
| `authors` | Staff bylines and bios |
| `brand_settings` | Single-row logo/banner/tagline config |
| `users` | Admin login (bcrypt + JWT) |

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| "Database connection refused" | Postgres not ready | Ensure `depends_on: db condition: service_healthy` in compose |
| "Invalid credentials" | Wrong ADMIN_PASSWORD | Check env var in Dokploy UI |
| Blank white page | Build failed | Check Dokploy build logs |
| Articles not showing | DB empty but not seeded | Server logs should show "Database seeded"; check `server/seed-data.json` exists in image |
| Admin route missing | VITE_ADMIN_PATH not set at build | Must be a **Build Arg**, not runtime env |

---

## Manual Clean Up

```bash
# Delete stale src/assets/images after confirming public/images works
rm -rf "src/assets/images"
git add -A && git commit -m "chore: remove stale src/assets/images"
```
