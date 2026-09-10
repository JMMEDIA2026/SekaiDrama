"use client";

import { UnifiedMediaCard } from "./UnifiedMediaCard";
import { UnifiedMediaCardSkeleton } from "./UnifiedMediaCardSkeleton";
import { UnifiedErrorDisplay } from "./UnifiedErrorDisplay";
import { useGoodShortSearch } from "@/hooks/useGoodShort";
import type { GoodShortItem } from "@/types/goodshort";
import { buildSuffixSlug } from "@/lib/slug";

interface GoodShortCatalogSectionProps {
  title: string;
  query: string;
}

export function GoodShortCatalogSection({ title, query }: GoodShortCatalogSectionProps) {
  const { data, isLoading, error, refetch } = useGoodShortSearch(query);

  const items: GoodShortItem[] = data || [];

  // 한국어 원작 드라마(한글 썸네일/제목)를 우선 노출
  const sorted = [...items].sort((a, b) => {
    const aKo = a.language === "KOREAN" ? 0 : 1;
    const bKo = b.language === "KOREAN" ? 0 : 1;
    return aKo - bKo;
  });

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="h-7 md:h-8 w-48 bg-white/10 rounded-lg animate-pulse mb-4" />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <UnifiedMediaCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h2 className="font-display font-bold text-xl md:text-2xl text-foreground mb-4">{title}</h2>
        <UnifiedErrorDisplay
          title={`${title} 불러오기 실패`}
          message={error.message || "오류가 발생했습니다"}
          onRetry={() => refetch()}
        />
      </section>
    );
  }

  return (
    <section>
      <h2 className="font-display font-bold text-xl md:text-2xl text-foreground mb-4">{title}</h2>

      {sorted.length === 0 ? (
        <p className="text-center text-muted-foreground py-16">해당 카테고리의 드라마가 아직 없습니다.</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
          {sorted.map((drama, index) => (
            <UnifiedMediaCard
              key={`${drama.bookId}-${index}`}
              index={index}
              title={drama.bookName}
              cover={drama.cover || ""}
              link={`/detail/goodshort/${buildSuffixSlug(drama.bookId, drama.bookName)}`}
              episodes={drama.chapterCount}
              topLeftBadge={
                drama.language === "KOREAN" ? { text: "한국어", color: "#E52E2E" } : null
              }
              topRightBadge={
                drama.viewCountDisplay
                  ? { text: drama.viewCountDisplay, isTransparent: true }
                  : null
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
