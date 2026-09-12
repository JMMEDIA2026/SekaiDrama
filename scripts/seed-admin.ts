import "dotenv/config";
import bcrypt from "bcryptjs";
import { sql } from "../src/lib/db";

// 관리자 계정을 생성/갱신합니다. 비밀번호를 코드에 남기지 않기 위해
// ADMIN_USERNAME / ADMIN_EMAIL / ADMIN_PASSWORD 환경변수로만 값을 받습니다.
// 예: ADMIN_USERNAME=nkjoy ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=your-password npm run db:seed
async function main() {
  const username = process.env.ADMIN_USERNAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !email || !password) {
    console.error(
      "ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD 환경변수를 모두 설정한 뒤 다시 실행하세요."
    );
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await sql`
    INSERT INTO users (username, email, password_hash, role)
    VALUES (${username}, ${email}, ${passwordHash}, 'admin')
    ON CONFLICT (username)
    DO UPDATE SET email = EXCLUDED.email, password_hash = EXCLUDED.password_hash, role = 'admin'
  `;

  console.log(`관리자 계정(${username})이 생성/업데이트되었습니다.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("관리자 계정 생성 실패:", error);
    process.exit(1);
  });
