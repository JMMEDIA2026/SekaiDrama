"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { QrisPopupSettings } from "@/types/ads";

const FALLBACK_SETTINGS: QrisPopupSettings = {
  enabled: true,
  title: "Dukung Penambahan Platform Drama Lain!",
  description:
    "Donasi kamu sangat berarti untuk menambah platform drama lain dan membayar tagihan bulanan https://drama.sansekai.my.id (SekaiDrama) agar tetap aktif.",
  imageUrl: "/qris.jpg",
  footnote: "Yuk, dukung kami dengan scan QRIS di atas!",
  countdownSeconds: 10,
};

export default function QrisDonationPopup() {
  const { data } = useQuery({
    queryKey: ["ads", "qris"],
    queryFn: async () => {
      const res = await fetch("/api/ads/qris");
      const json = await res.json();
      return (json.settings as QrisPopupSettings) ?? FALLBACK_SETTINGS;
    },
    staleTime: 5 * 60 * 1000,
  });

  const settings = data ?? FALLBACK_SETTINGS;

  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(settings.countdownSeconds);

  useEffect(() => {
    // 설정을 아직 못 받아왔거나(첫 렌더) 관리자가 팝업을 꺼둔 경우 표시하지 않음
    if (!data || !settings.enabled) return;

    setIsVisible(true);
    setCountdown(settings.countdownSeconds);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [data, settings.enabled, settings.countdownSeconds]);

  if (!data || !settings.enabled || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col items-center p-6 border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-500">
        {/* Header content */}
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {settings.title}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
            {settings.description}
          </p>
        </div>

        {/* QRIS Image Box with subtle animation */}
        <div className="relative w-56 h-56 rounded-2xl overflow-hidden shadow-lg border-4 border-white dark:border-zinc-800 transition-transform hover:scale-105 duration-300 bg-white">
          {/* 관리자가 외부 URL을 입력할 수 있어 next/image 대신 일반 img 태그 사용 */}
          <img
            src={settings.imageUrl}
            alt="QRIS Donation"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500 font-medium">
          {settings.footnote}
        </p>

        {/* Close Button / Countdown */}
        <div className="mt-8 w-full">
          <button
            onClick={() => setIsVisible(false)}
            disabled={countdown > 0}
            className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
              countdown > 0
                ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1"
            }`}
          >
            {countdown > 0 ? (
              <>
                <svg className="animate-spin h-5 w-5 text-zinc-400 dark:text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Tutup dalam {countdown}s
              </>
            ) : (
              "Lanjut Nonton"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
