import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getSession();
  return session?.role === "admin";
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });
  }
  const { rows } = await sql`
    SELECT id, image_url, link_url, title, sort_order, is_active
    FROM banners
    ORDER BY sort_order ASC, id ASC
  `;
  return NextResponse.json({ banners: rows });
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const imageUrl = String(body.imageUrl ?? "").trim();
    if (!imageUrl) {
      return NextResponse.json({ error: "이미지 URL을 입력해주세요." }, { status: 400 });
    }
    const linkUrl = body.linkUrl ? String(body.linkUrl).trim() : null;
    const title = body.title ? String(body.title).trim() : null;
    const sortOrder = Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0;
    const isActive = body.isActive !== false;

    const { rows } = await sql`
      INSERT INTO banners (image_url, link_url, title, sort_order, is_active)
      VALUES (${imageUrl}, ${linkUrl}, ${title}, ${sortOrder}, ${isActive})
      RETURNING id, image_url, link_url, title, sort_order, is_active
    `;
    return NextResponse.json({ banner: rows[0] });
  } catch (error) {
    console.error("Banner create error:", error);
    return NextResponse.json({ error: "배너 추가에 실패했습니다." }, { status: 500 });
  }
}
