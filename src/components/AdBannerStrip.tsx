"use client";

import { useQuery } from "@tanstack/react-query";
import type { Banner } from "@/types/ads";

export function AdBannerStrip() {
  const { data } = useQuery({
    queryKey: ["ads", "banners"],
    queryFn: async () => {
      const res = await fetch("/api/ads/banners");
      const json = await res.json();
      return (json.banners as Banner[]) ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const banners = data ?? [];
  if (banners.length === 0) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {banners.map((banner) => {
        const image = (
          <img
            src={banner.imageUrl}
            alt={banner.title ?? "배너 광고"}
            className="w-full h-24 sm:h-28 object-cover rounded-xl"
          />
        );
        return banner.linkUrl ? (
          <a
            key={banner.id}
            href={banner.linkUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block overflow-hidden rounded-xl transition-opacity hover:opacity-90"
          >
            {image}
          </a>
        ) : (
          <div key={banner.id} className="overflow-hidden rounded-xl">
            {image}
          </div>
        );
      })}
    </div>
  );
}
