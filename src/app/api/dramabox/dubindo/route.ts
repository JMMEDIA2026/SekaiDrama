import { encryptedResponse } from "@/lib/api-utils";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let classify = searchParams.get("classify") || "terbaru";
  const page = parseInt(searchParams.get("page") || "1", 10);

  classify = classify.toLowerCase();

  let classifyCode;
  if (classify === "terpopuler") {
    classifyCode = 1;
  } else if (classify === "terbaru") {
    classifyCode = 2;
  } else {
    return NextResponse.json(
      { error: "Parameter classify harus terpopuler atau terbaru" },
      { status: 400 }
    );
  }

  try {
    // @ts-ignore - JS 직접 호출
    const { dubindo } = await import("@/lib/dramabox/dramabox.js");
    const data = await dubindo(classifyCode, page);

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
