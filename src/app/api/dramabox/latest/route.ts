import { encryptedResponse } from "@/lib/api-utils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // @ts-ignore - JS 직접 호출
    const { latest } = await import("@/lib/dramabox/dramabox.js");
    const data = await latest();

    const filteredData = Array.isArray(data)
      ? data.filter((item: any) => item && item.bookId)
      : [];

    return encryptedResponse(filteredData);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
