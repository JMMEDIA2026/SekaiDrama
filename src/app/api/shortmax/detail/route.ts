import { encryptedResponse } from "@/lib/api-utils";
import { optimizeCover } from "@/lib/image-utils";
import { queryDetail } from "@/lib/shortmax-client";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const shortPlayId = searchParams.get("shortPlayId");

    if (!shortPlayId) {
      return encryptedResponse(
        { success: false, error: "shortPlayId is required" },
        400
      );
    }

    const res = await queryDetail(Number(shortPlayId));

    if (res.code !== 0 || !res.data) {
      return encryptedResponse(
        { success: false, error: "Failed to fetch detail" }
      );
    }

    const data = res.data;
    const labels = (data.labelList || []).map((l: any) => l.displayName);

    return encryptedResponse({
      success: true,
      shortPlayId: data.shortPlayId,
      shortPlayCode: data.shortPlayCode,
      title: data.shortPlayName,
      cover: optimizeCover(data.coverId),
      description: data.summary || "",
      labels,
      totalEpisodes: (data.episodeList || []).length || data.totalEpisodes || 0,
      updateEpisode: data.updateEpisode || 0,
      lockBegin: data.lockBegin || 0,
      collectNum: data.collectNum || 0,
    });
  } catch (error) {
    console.error("ShortMax Detail Error:", error);
    return encryptedResponse(
      { success: false, error: "Internal server error" }
    );
  }
}
