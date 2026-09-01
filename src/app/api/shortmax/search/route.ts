import { encryptedResponse } from "@/lib/api-utils";
import { optimizeCover } from "@/lib/image-utils";
import { searchPage } from "@/lib/shortmax-client";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");

    if (!query) {
      return encryptedResponse({ success: true });
    }

    const res = await searchPage(query, 1, 20);

    if (res.code !== 0 || !res.data) {
      return encryptedResponse({ success: true });
    }

    const list = res.data.data || [];
    const results = list.map((item: any) => ({
      shortPlayId: item.shortPlayId,
      shortPlayCode: item.shortPlayCode,
      title: (item.shortPlayName || "").replace(/<\/?em>/g, ""),
      cover: optimizeCover(item.coverId),
      genre: (item.labelDisplayNames || item.classDisplayNames || []),
    }));

    return encryptedResponse({
      success: true,
      data: results,
      total: res.data.total || results.length,
    });
  } catch (error) {
    console.error("ShortMax Search Error:", error);
    return encryptedResponse({ success: true, data: [] });
  }
}
