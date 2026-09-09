import { NextResponse } from "next/server";
import { getAdSetting } from "@/lib/db";
import type { AdSenseSlot } from "@/types/ads";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const slots = (await getAdSetting<AdSenseSlot[]>("adsense_slots")) ?? [];
    return NextResponse.json({ slots: slots.filter((slot) => slot.enabled) });
  } catch (error) {
    console.error("Ad slots fetch error:", error);
    return NextResponse.json({ slots: [] });
  }
}
