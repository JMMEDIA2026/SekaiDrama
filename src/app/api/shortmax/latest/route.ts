import { encryptedResponse } from "@/lib/api-utils";
import { optimizeCover } from "@/lib/image-utils";
import { queryPage } from "@/lib/shortmax-client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await queryPage(1, 20);

    if (res.code !== 0 || !res.data) {
      return encryptedResponse({ success: false, data: [] });
    }

    const list = res.data.list || [];
    const dramas = list.map((item: any) => ({
      shortPlayId: item.shortPlayId,
      title: item.shortPlayName,
      cover: optimizeCover(item.coverId),
      totalEpisodes: item.totalEpisodes || 0,
      label: (item.labelList && item.labelList[0] && item.labelList[0].displayName) || "",
      collectNum: item.collectNum || 0,
    }));

    return encryptedResponse({
      success: true,
      data: dramas,
      total: res.data.total || dramas.length,
    });
  } catch (error) {
    console.error("ShortMax Latest Error:", error);
    return encryptedResponse({ success: false, data: [] });
  }
}
