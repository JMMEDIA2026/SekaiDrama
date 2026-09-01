import { encryptedResponse } from "@/lib/api-utils";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return encryptedResponse([]);
  }

  try {
    // @ts-ignore - JS 직접 호출
    const { search } = await import("@/lib/dramabox/dramabox.js");
    const data = await search(query);

    const filtered = Array.isArray(data)
      ? data.filter((item: any) => item.bookId)
      : data;

    return encryptedResponse(filtered);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
