import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getSession();
  return session?.role === "admin";
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });
  }

  const { id } = await params;
  const bannerId = Number(id);
  if (!Number.isInteger(bannerId)) {
    return NextResponse.json({ error: "잘못된 배너 ID입니다." }, { status: 400 });
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
      UPDATE banners SET
        image_url = ${imageUrl},
        link_url = ${linkUrl},
        title = ${title},
        sort_order = ${sortOrder},
        is_active = ${isActive}
      WHERE id = ${bannerId}
      RETURNING id, image_url, link_url, title, sort_order, is_active
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: "배너를 찾을 수 없습니다." }, { status: 404 });
    }
    return NextResponse.json({ banner: rows[0] });
  } catch (error) {
    console.error("Banner update error:", error);
    return NextResponse.json({ error: "배너 수정에 실패했습니다." }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });
  }

  const { id } = await params;
  const bannerId = Number(id);
  if (!Number.isInteger(bannerId)) {
    return NextResponse.json({ error: "잘못된 배너 ID입니다." }, { status: 400 });
  }

  await sql`DELETE FROM banners WHERE id = ${bannerId}`;
  return NextResponse.json({ success: true });
}
