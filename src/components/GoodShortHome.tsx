"use client";

import { useState } from "react";
import { GoodShortSection } from "./GoodShortSection";
import { InfiniteGoodShortSection } from "./InfiniteGoodShortSection";
import { GoodShortCategoryMenu } from "./GoodShortCategoryMenu";
import { GoodShortCatalogSection } from "./GoodShortCatalogSection";
import { useGoodShortLatest, useGoodShortTrending } from "@/hooks/useGoodShort";

export function GoodShortHome() {
  const [selected, setSelected] = useState<string | null>(null);

  const {
    data: latestData,
    isLoading: loadingLatest,
    error: errorLatest,
    refetch: refetchLatest,
  } = useGoodShortLatest();

  const {
    data: trendingData,
    isLoading: loadingTrending,
    error: errorTrending,
    refetch: refetchTrending,
  } = useGoodShortTrending();

  return (
    <div className="space-y-8 animate-fade-up">
      <GoodShortCategoryMenu selected={selected} onSelect={setSelected} />

      {selected ? (
        <GoodShortCatalogSection title={selected} query={selected} />
      ) : (
        <>
          <GoodShortSection
            title="최신"
            dramas={latestData}
            isLoading={loadingLatest}
            error={!!errorLatest}
            onRetry={() => refetchLatest()}
          />
          <GoodShortSection
            title="인기"
            dramas={trendingData}
            isLoading={loadingTrending}
            error={!!errorTrending}
            onRetry={() => refetchTrending()}
          />
          <InfiniteGoodShortSection title="더보기" />
        </>
      )}
    </div>
  );
}
