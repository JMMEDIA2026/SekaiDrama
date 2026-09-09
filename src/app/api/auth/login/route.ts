import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyPassword, createSessionToken, setSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();

    if (
      typeof identifier !== "string" ||
      typeof password !== "string" ||
      !identifier ||
      !password
    ) {
      return NextResponse.json(
        { error: "아이디와 비밀번호를 입력해주세요." },
        { status: 400 }
      );
    }

    const { rows } = await sql`
      SELECT id, username, email, password_hash, role FROM users
      WHERE username = ${identifier} OR email = ${identifier}
      LIMIT 1
    `;
    const user = rows[0];

    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return NextResponse.json(
        { error: "아이디 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    const token = await createSessionToken({
      sub: String(user.id),
      username: user.username,
      role: user.role,
    });
    await setSessionCookie(token);

    return NextResponse.json({
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "로그인에 실패했습니다." }, { status: 500 });
  }
}
