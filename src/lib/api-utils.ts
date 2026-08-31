import { NextResponse } from "next/server";
import { encryptData } from "@/lib/crypto";

// Menambahkan parameter `lang` dari request masuk ke URL upstream,
// supaya konten (judul/deskripsi drama) datang dalam bahasa yang dipilih user.
export function withLang(url: string, request: Request): string {
  const lang = new URL(request.url).searchParams.get("lang");
  if (!lang) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}lang=${encodeURIComponent(lang)}`;
}

// Sama seperti withLang, tapi menambahkan lang langsung ke objek URL upstream
// (untuk route yang membangun target URL memakai `new URL(...)`).
export function appendLang(targetUrl: URL, request: Request): void {
  const lang = new URL(request.url).searchParams.get("lang");
  if (lang) targetUrl.searchParams.set("lang", lang);
}

export async function safeJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text || !text.trim()) {
    throw new Error(`Empty response from upstream: ${response.url}`);
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("JSON Parse Error:", error);
    console.error("Raw Text (truncated):", text.substring(0, 200));
    throw new Error("Invalid JSON response from upstream");
  }
}

export function encryptedResponse(data: any, status = 200) {
  const encrypted = encryptData(data);
  return NextResponse.json({ success: true, data: encrypted }, { status });
}
