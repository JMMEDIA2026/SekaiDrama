import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const encryptedUrl = request.nextUrl.searchParams.get("url");

  if (!encryptedUrl) {
    return new NextResponse("Missing 'url' parameter", { status: 400 });
  }

  try {
    // 직접 복호화
    // @ts-ignore - JS 직접 호출
    const { decryptDramaboxVideo } = await import("@/lib/dramabox/dramabox.js");
    const { buffer } = await decryptDramaboxVideo(encryptedUrl);

    // Range 요청 처리
    const range = request.headers.get("range");
    const total = buffer.length;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : total - 1;
      const chunkSize = end - start + 1;

      const chunk = buffer.subarray(start, end + 1);
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(new Uint8Array(chunk));
          controller.close();
        },
      });

      return new NextResponse(stream, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${total}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize.toString(),
          "Content-Type": "video/mp4",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // 전체 응답
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(buffer));
        controller.close();
      },
    });

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": total.toString(),
        "Accept-Ranges": "bytes",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    console.error("Decrypt stream error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
