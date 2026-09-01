import { encryptedResponse } from "@/lib/api-utils";
import { optimizeCover } from "@/lib/image-utils";
import { queryPage } from "@/lib/shortmax-client";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);

    const res = await queryPage(page, 20);

    if (res.code !== 0 || !res.data) {
      return encryptedResponse({ success: false, data: [], isEnd: true });
    }

    const list = res.data.list || [];
    const total = res.data.total || 0;
    const totalPages = Math.ceil(total / 20);
    const isEnd = page >= totalPages;

    const dramas = list.map((item: any) => ({
      shortPlayId: item.shortPlayId,
      title: item.shortPlayName,
      cover: optimizeCover(item.coverId),
      totalEpisodes: item.totalEpisodes || 0,
      playNum: item.playNum || 0,
      summary: item.summary || "",
    }));

    return encryptedResponse({
      success: true,
      data: dramas,
      page,
      isEnd,
      total,
    });
  } catch (error) {
    console.error("ShortMax ForYou Error:", error);
    return encryptedResponse({ success: false, data: [], isEnd: true });
  }
}
