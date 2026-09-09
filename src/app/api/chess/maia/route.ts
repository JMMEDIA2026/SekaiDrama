import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MAIA_API_URL = "https://puruboy.kozow.com/api/chess/maia";

// Maia(KDD 2200) 체스 다음 수 예측 프록시.
// body: { notasi: string[] } - UCI 표기법 수 목록 (예: ["e2e4", "e7e5"])
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const notasi = body?.notasi;

    if (!Array.isArray(notasi) || notasi.some((move) => typeof move !== "string")) {
      return NextResponse.json(
        { error: 'notasi는 UCI 표기법 문자열 배열이어야 합니다. 예: ["e2e4", "e7e5"]' },
        { status: 400 }
      );
    }

    const upstreamRes = await fetch(MAIA_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notasi }),
    });

    const data = await upstreamRes.json().catch(() => null);

    if (!upstreamRes.ok) {
      return NextResponse.json(
        { error: data?.error || "Maia API 요청에 실패했습니다." },
        { status: upstreamRes.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Maia chess API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
