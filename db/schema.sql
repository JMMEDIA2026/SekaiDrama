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
    "title": "다른 플랫폼 추가를 응원해주세요!",
    "description": "여러분의 후원은 다른 드라마 플랫폼을 추가하고 서버 운영비를 유지하는 데 큰 힘이 됩니다.",
    "imageUrl": "/qris.jpg",
    "footnote": "위 QR코드를 스캔해서 후원해주세요!",
    "countdownSeconds": 10
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

INSERT INTO ad_settings (key, value)
VALUES ('adsense_slots', '[]'::jsonb)
ON CONFLICT (key) DO NOTHING;
