-- SekaiDrama: users, ad settings, banners
-- Run via `npm run db:migrate` (requires POSTGRES_URL env var, e.g. from Vercel Postgres/Neon).

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ad_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  link_url TEXT,
  title TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO ad_settings (key, value)
VALUES (
  'qris_popup',
  '{
    "enabled": true,
    "title": "Dukung Penambahan Platform Drama Lain!",
    "description": "Donasi kamu sangat berarti untuk menambah platform drama lain dan membayar tagihan bulanan https://drama.sansekai.my.id (SekaiDrama) agar tetap aktif.",
    "imageUrl": "/qris.jpg",
    "footnote": "Yuk, dukung kami dengan scan QRIS di atas!",
    "countdownSeconds": 10
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

INSERT INTO ad_settings (key, value)
VALUES ('adsense_slots', '[]'::jsonb)
ON CONFLICT (key) DO NOTHING;
