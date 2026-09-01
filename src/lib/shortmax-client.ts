/**
 * ShortMax 공식 웹앱 API 직접 호출 클라이언트
 * AES-128-CBC 암호화 필수 (Key = IV = "shortwebapiaesen")
 */
import crypto from "crypto";

const API_BASE = "https://shortweb.shorttv.live/app-api/app";
const KEY = Buffer.from("shortwebapiaesen", "utf8");

function encrypt(obj: any): string {
  const c = crypto.createCipheriv("aes-128-cbc", KEY, KEY);
  c.setAutoPadding(true);
  return c.update(JSON.stringify(obj), "utf8", "base64") + c.final("base64");
}

function decrypt(b64: string): any {
  const d = crypto.createDecipheriv("aes-128-cbc", KEY, KEY);
  d.setAutoPadding(true);
  return JSON.parse(d.update(b64, "base64", "utf8") + d.final("utf8"));
}

async function shortmaxApi(path: string, body: any, lang = "en"): Promise<any> {
  const resp = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Encrypted": "true",
      "Language-Code": lang,
      Referer: "https://shorttv.live/",
      Origin: "https://shorttv.live",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    },
    body: encrypt(body),
    cache: "no-store",
  });

  if (!resp.ok) {
    throw new Error(`ShortMax API HTTP ${resp.status}`);
  }

  const text = await resp.text();
  return decrypt(text);
}

// 드라마 목록 (홈)
export async function queryPage(pageNum = 1, pageSize = 20, classId?: number) {
  const body: any = { pageSize, pageNum };
  if (classId) body.classId = classId;
  return shortmaxApi("/cmsShortPlay/queryPage", body);
}

// 드라마 상세 + 에피소드 목록
export async function queryDetail(shortPlayId: number, lang = "en") {
  return shortmaxApi("/cmsShortPlay/queryDetail", { shortPlayId }, lang);
}

// 추천 목록
export async function recommend(pageNum = 1, pageSize = 10, lang = "en") {
  return shortmaxApi(
    "/cmsShortPlay/recommend",
    { pageSize, pageNum, languageCode: lang },
    lang
  );
}

// 검색
export async function searchPage(searchText: string, pageNum = 1, pageSize = 12) {
  return shortmaxApi("/search/searchPage", { pageSize, pageNum, searchText });
}

// 핫 검색어
export async function searchHot() {
  return shortmaxApi("/search/searchHot", {});
}
