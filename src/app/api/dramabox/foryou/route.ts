import { encryptedResponse } from "@/lib/api-utils";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);

    // @ts-ignore - JS 직접 호출
    const { foryouPage } = await import("@/lib/dramabox/dramabox.js");
    const data = await foryouPage(page);

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
