import { NextResponse } from "next/server";
import { getAdSetting } from "@/lib/db";
import type { QrisPopupSettings } from "@/types/ads";

export const dynamic = "force-dynamic";

const DEFAULT_QRIS_SETTINGS: QrisPopupSettings = {
  enabled: true,
  title: "Dukung Penambahan Platform Drama Lain!",
  description:
    "Donasi kamu sangat berarti untuk menambah platform drama lain dan membayar tagihan bulanan https://drama.sansekai.my.id (SekaiDrama) agar tetap aktif.",
  imageUrl: "/qris.jpg",
  footnote: "Yuk, dukung kami dengan scan QRIS di atas!",
  countdownSeconds: 10,
};

export async function GET() {
  try {
    const settings = await getAdSetting<QrisPopupSettings>("qris_popup");
    return NextResponse.json({ settings: settings ?? DEFAULT_QRIS_SETTINGS });
  } catch (error) {
    console.error("QRIS settings fetch error:", error);
    return NextResponse.json({ settings: DEFAULT_QRIS_SETTINGS });
  }
}
