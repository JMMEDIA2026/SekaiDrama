import { encryptedResponse, appendLang } from "@/lib/api-utils";

const UPSTREAM_API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.sansekai.my.id/api";

export async function GET(request: Request) {
  try {
    const targetUrl = new URL(`${UPSTREAM_API}/dramanova/drama18`);
    targetUrl.searchParams.set("page", "1");
    appendLang(targetUrl, request);

    const res = await fetch(targetUrl.toString(), {
      headers: {
        "User-Agent": "okhttp/4.12.0",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch drama18: ${res.status}`);
    }

    const data = await res.json();
    return encryptedResponse(data);
  } catch (error) {
    console.error("DramaNova drama18 fetch error:", error);
    return encryptedResponse(
      { code: 500, msg: "Failed to fetch from DramaNova", data: [] },
      500
    );
  }
}
