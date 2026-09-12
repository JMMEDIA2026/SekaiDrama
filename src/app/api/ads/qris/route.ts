import { NextResponse } from "next/server";
import { getAdSetting } from "@/lib/db";
import type { QrisPopupSettings } from "@/types/ads";

export const dynamic = "force-dynamic";

const DEFAULT_QRIS_SETTINGS: QrisPopupSettings = {
  enabled: true,
  title: "다른 플랫폼 추가를 응원해주세요!",
  description:
    "여러분의 후원은 다른 드라마 플랫폼을 추가하고 서버 운영비를 유지하는 데 큰 힘이 됩니다.",
  imageUrl: "/qris.jpg",
  footnote: "위 QR코드를 스캔해서 후원해주세요!",
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
