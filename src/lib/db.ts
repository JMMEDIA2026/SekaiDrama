import { Pool, type QueryResultRow } from "pg";

// 표준 Postgres(로컬 Postgres, Docker, Neon, Vercel Postgres 등)에 연결합니다.
// POSTGRES_URL 예시: postgres://postgres:비밀번호@localhost:5433/postgres
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export interface SqlResult<T extends QueryResultRow = QueryResultRow> {
  rows: T[];
}

async function runQuery<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values: unknown[] = []
): Promise<SqlResult<T>> {
  const result = await pool.query<T>(text, values);
  return { rows: result.rows };
}

// @vercel/postgres의 `sql` 태그드 템플릿과 동일한 방식으로 쓸 수 있도록 만든 래퍼.
// 예: await sql`SELECT * FROM users WHERE id = ${id}`
function sql<T extends QueryResultRow = QueryResultRow>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<SqlResult<T>> {
  let text = strings[0];
  for (let i = 0; i < values.length; i++) {
    text += `$${i + 1}${strings[i + 1]}`;
  }
  return runQuery<T>(text, values);
}

sql.query = <T extends QueryResultRow = QueryResultRow>(
  text: string,
  values: unknown[] = []
): Promise<SqlResult<T>> => runQuery<T>(text, values);

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
