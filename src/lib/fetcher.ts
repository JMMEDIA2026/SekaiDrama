import { decryptData } from "@/lib/crypto";
import { toDramaboxLang } from "@/lib/language";

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

const LANG_STORAGE_KEY = "sekaidrama-lang";

// Menyisipkan bahasa UI yang sedang aktif ke setiap request API,
// supaya konten drama (judul/deskripsi) ikut datang dalam bahasa tersebut.
export function withCurrentLang(url: string): string {
  if (typeof window === "undefined") return url;

  let lang: string | null = null;
  try {
    lang = localStorage.getItem(LANG_STORAGE_KEY);
  } catch {
    // localStorage tidak tersedia (mis. mode privat) -> lewati
  }
  if (!lang) return url;

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}lang=${encodeURIComponent(toDramaboxLang(lang))}`;
}

export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(withCurrentLang(url), options);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    
    // Throw error with status to be caught by React Query
    throw new ApiError(
        errorData?.error || errorData?.message || "An error occurred", 
        response.status, 
        errorData
    );
  }

  const json = await response.json();
  if (json.data && typeof json.data === "string") {
    return decryptData(json.data);
  }
  return json;
}
