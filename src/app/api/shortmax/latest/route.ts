import { safeJson, encryptedResponse, withLang } from "@/lib/api-utils";
import { optimizeCover } from "@/lib/image-utils";
import { NextRequest } from "next/server";

const UPSTREAM_API = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.sansekai.my.id/api") + "/shortmax";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(withLang(`${UPSTREAM_API}/latest`, request), {
      cache: 'no-store',
    });

    if (!response.ok) {
      return encryptedResponse({ success: false, data: [] });
    }

    const data = await safeJson<any>(response);

    const dramas = (data.results || []).map((item: any) => ({
      shortPlayId: item.shortPlayId,
      title: item.name,
      cover: optimizeCover(item.cover),
      totalEpisodes: item.totalEpisodes || 0,
      label: item.label || "",
      collectNum: item.collectNum || 0,
    }));

    return encryptedResponse({
      success: true,
      data: dramas,
      total: data.total || dramas.length,
    });
  } catch (error) {
    console.error("ShortMax Latest Error:", error);
    return encryptedResponse({ success: false, data: [] });
  }
}
