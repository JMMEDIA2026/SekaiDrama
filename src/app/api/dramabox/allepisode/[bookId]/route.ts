import { encryptedResponse } from "@/lib/api-utils";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  const { bookId } = await params;

  try {
    // @ts-ignore - JS 직접 호출
    const { linkStream } = await import("@/lib/dramabox/dramabox.js");
    const data = await linkStream(bookId);
    return encryptedResponse(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
