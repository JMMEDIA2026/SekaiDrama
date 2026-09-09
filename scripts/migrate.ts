import "dotenv/config";
import { readFileSync } from "fs";
import { join } from "path";
import { sql } from "@vercel/postgres";

async function main() {
  const schemaPath = join(process.cwd(), "db", "schema.sql");
  const schema = readFileSync(schemaPath, "utf-8");

  const statements = schema
    .split(";")
    .map((statement) => statement.trim())
    .filter((statement) => statement.replace(/--.*$/gm, "").trim().length > 0);

  for (const statement of statements) {
    await sql.query(statement);
  }

  console.log(`마이그레이션 완료: ${statements.length}개 구문 실행됨.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("마이그레이션 실패:", error);
    process.exit(1);
  });
