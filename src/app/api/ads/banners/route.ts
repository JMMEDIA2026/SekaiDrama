import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT id, image_url, link_url, title, sort_order, is_active
      FROM banners
      WHERE is_active = true
      ORDER BY sort_order ASC, id ASC
    `;
    const banners = rows.map((row) => ({
      id: row.id,
      imageUrl: row.image_url,
      linkUrl: row.link_url,
      title: row.title,
      sortOrder: row.sort_order,
      isActive: row.is_active,
    }));
    return NextResponse.json({ banners });
  } catch (error) {
    console.error("Banners fetch error:", error);
    return NextResponse.json({ banners: [] });
  }
}
