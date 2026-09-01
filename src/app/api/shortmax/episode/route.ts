import { encryptedResponse } from "@/lib/api-utils";
import { queryDetail } from "@/lib/shortmax-client";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const shortPlayId = searchParams.get("shortPlayId");
    const episodeNumber = searchParams.get("episodeNumber");

    if (!shortPlayId || !episodeNumber) {
      return encryptedResponse(
        { success: false, error: "shortPlayId and episodeNumber are required" },
        400
      );
    }

    const res = await queryDetail(Number(shortPlayId));

    if (res.code !== 0 || !res.data) {
      return encryptedResponse({ success: false, error: "Failed to fetch episode" });
    }

    const data = res.data;
    const epNum = Number(episodeNumber);
    const ep = (data.episodeList || []).find((e: any) => e.episodeNum === epNum);

    if (!ep) {
      return encryptedResponse({ success: false, error: "Episode not found" });
    }

    // Parse encryptedVideoUrl JSON string
    let videoUrl: Record<string, string> = {};
    if (ep.encryptedVideoUrl) {
      try {
        const parsed = JSON.parse(ep.encryptedVideoUrl);
        for (const [quality, url] of Object.entries(parsed)) {
          if (typeof url === "string" && url) {
            videoUrl[quality] = url;
          }
        }
      } catch {
        videoUrl = {};
      }
    }

    const locked = epNum > (data.lockBegin || 0);

    return encryptedResponse({
      success: true,
      shortPlayId: data.shortPlayId,
      shortPlayName: data.shortPlayName,
      totalEpisodes: (data.episodeList || []).length,
      episode: {
        episodeNum: ep.episodeNum,
        id: ep.episodeNum,
        duration: ep.duration || 0,
        locked,
        cover: ep.coverId || "",
        videoUrl,
      },
    });
  } catch (error) {
    console.error("ShortMax Episode Error:", error);
    return encryptedResponse({ success: false, error: "Internal server error" });
  }
}
