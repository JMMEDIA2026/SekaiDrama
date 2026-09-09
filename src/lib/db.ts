import { sql } from "@vercel/postgres";

export { sql };

export interface UserRow {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: "user" | "admin";
  created_at: string;
}

export interface BannerRow {
  id: number;
  image_url: string;
  link_url: string | null;
  title: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface AdSettingRow {
  key: string;
  value: unknown;
  updated_at: string;
}

export async function getAdSetting<T>(key: string): Promise<T | null> {
  const { rows } = await sql<AdSettingRow>`SELECT key, value, updated_at FROM ad_settings WHERE key = ${key}`;
  return rows[0] ? (rows[0].value as T) : null;
}

export async function setAdSetting(key: string, value: unknown): Promise<void> {
  await sql`
    INSERT INTO ad_settings (key, value, updated_at)
    VALUES (${key}, ${JSON.stringify(value)}::jsonb, now())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
  `;
}
