import { NextRequest, NextResponse } from "next/server";
import { getAdSetting, setAdSetting } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { AdSenseSlot, AdSlotPlacement } from "@/types/ads";

export const dynamic = "force-dynamic";

const VALID_PLACEMENTS: AdSlotPlacement[] = ["home_top", "home_bottom", "detail_top"];

async function requireAdmin() {
  const session = await getSession();
  return session?.role === "admin";
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });
  }
  const slots = (await getAdSetting<AdSenseSlot[]>("adsense_slots")) ?? [];
  return NextResponse.json({ slots });
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!Array.isArray(body.slots)) {
      return NextResponse.json({ error: "slots 배열이 필요합니다." }, { status: 400 });
    }

    const slots: AdSenseSlot[] = body.slots.map((slot: any, index: number) => ({
      id: String(slot.id ?? `slot-${index}-${Date.now()}`),
      name: String(slot.name ?? "").slice(0, 100),
      placement: VALID_PLACEMENTS.includes(slot.placement) ? slot.placement : "home_top",
      code: String(slot.code ?? "").slice(0, 5000),
      enabled: Boolean(slot.enabled),
    }));

    await setAdSetting("adsense_slots", slots);
    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Ad slots update error:", error);
    return NextResponse.json({ error: "저장에 실패했습니다." }, { status: 500 });
  }
}
