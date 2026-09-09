import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    if (typeof username !== "string" || !USERNAME_REGEX.test(username)) {
      return NextResponse.json(
        { error: "아이디는 영문/숫자/밑줄 3~20자로 입력해주세요." },
        { status: 400 }
      );
    }
    if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "올바른 이메일을 입력해주세요." }, { status: 400 });
    }
    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "비밀번호는 6자 이상이어야 합니다." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const { rows } = await sql`
      INSERT INTO users (username, email, password_hash, role)
      VALUES (${username}, ${email}, ${passwordHash}, 'user')
      RETURNING id, username, email, role
    `;

    const user = rows[0];
    const token = await createSessionToken({
      sub: String(user.id),
      username: user.username,
      role: user.role,
    });
    await setSessionCookie(token);

    return NextResponse.json({ user });
  } catch (error: any) {
    if (error?.code === "23505") {
      return NextResponse.json(
        { error: "이미 사용 중인 아이디 또는 이메일입니다." },
        { status: 409 }
      );
    }
    console.error("Signup error:", error);
    return NextResponse.json({ error: "회원가입에 실패했습니다." }, { status: 500 });
  }
}
