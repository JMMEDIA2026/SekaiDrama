"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { UnifiedMediaCard } from "./UnifiedMediaCard";
import { UnifiedMediaCardSkeleton } from "./UnifiedMediaCardSkeleton";
import { UnifiedErrorDisplay } from "./UnifiedErrorDisplay";
import { useInfiniteGoodShortForYou } from "@/hooks/useGoodShort";
import type { GoodShortItem } from "@/types/goodshort";

interface GoodShortCatalogSectionProps {
  title: string;
  genre?: string | null;
  tag?: string | null;
}

const MIN_RESULTS_BEFORE_AUTO_STOP = 18;

export function GoodShortCatalogSection({ title, genre, tag }: GoodShortCatalogSectionProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error, refetch } =
    useInfiniteGoodShortForYou();

  const allItems: GoodShortItem[] =
    data?.pages.flatMap((page) => page?.data?.records?.flatMap((record) => record.items || []) || []) || [];

  const seen = new Set<string>();
  const uniqueItems = allItems.filter((item) => {
    if (seen.has(item.bookId)) return false;
    seen.add(item.bookId);
    return true;
  });

  const filtered = uniqueItems.filter((item) => {
    if (genre) return item.typeTwoNames?.includes(genre);
    if (tag) return item.labels?.includes(tag);
    return true;
  });

  // 필터 적용 중 결과가 적으면 자동으로 다음 페이지를 이어서 불러옵니다.
  useEffect(() => {
    if ((genre || tag) && filtered.length < MIN_RESULTS_BEFORE_AUTO_STOP && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [genre, tag, filtered.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "pending") {
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

  if (status === "error") {
    return (
      <section>
        <h2 className="font-display font-bold text-xl md:text-2xl text-foreground mb-4">{title}</h2>
        <UnifiedErrorDisplay
          title={`Gagal Memuat ${title}`}
          message={error?.message || "Terjadi kesalahan"}
          onRetry={() => refetch()}
        />
      </section>
    );
  }

  return (
    <section>
      <h2 className="font-display font-bold text-xl md:text-2xl text-foreground mb-4">{title}</h2>

      {filtered.length === 0 ? (
        hasNextPage || isFetchingNextPage ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">불러오는 중...</p>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-16">해당 카테고리의 드라마가 아직 없습니다.</p>
        )
      ) : (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
            {filtered.map((drama, index) => (
              <UnifiedMediaCard
                key={`${drama.bookId}-${index}`}
                index={index}
                title={drama.bookName}
                cover={drama.cover || ""}
                link={`/detail/goodshort/${drama.bookId}`}
                episodes={drama.chapterCount}
                topRightBadge={
                  drama.viewCountDisplay
                    ? { text: drama.viewCountDisplay, isTransparent: true }
                    : null
                }
              />
            ))}
          </div>

          {hasNextPage && (
            <div className="py-8 flex justify-center">
              {isFetchingNextPage ? (
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              ) : (
                <button
                  onClick={() => fetchNextPage()}
                  className="px-6 py-2.5 rounded-full bg-muted/50 hover:bg-muted text-sm font-medium transition-colors"
                >
                  더 불러오기
                </button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
