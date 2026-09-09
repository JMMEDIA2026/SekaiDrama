import { NextRequest, NextResponse } from "next/server";
import { getAdSetting, setAdSetting } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { QrisPopupSettings } from "@/types/ads";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getSession();
  return session?.role === "admin";
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });
  }
  const settings = await getAdSetting<QrisPopupSettings>("qris_popup");
  return NextResponse.json({ settings });
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const settings: QrisPopupSettings = {
      enabled: Boolean(body.enabled),
      title: String(body.title ?? "").slice(0, 200),
      description: String(body.description ?? "").slice(0, 2000),
      imageUrl: String(body.imageUrl ?? "").slice(0, 500),
      footnote: String(body.footnote ?? "").slice(0, 300),
      countdownSeconds: Math.min(Math.max(Number(body.countdownSeconds) || 0, 0), 60),
    };

    await setAdSetting("qris_popup", settings);
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("QRIS settings update error:", error);
    return NextResponse.json({ error: "설정 저장에 실패했습니다." }, { status: 500 });
  }
}
