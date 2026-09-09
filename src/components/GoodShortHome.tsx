"use client";

import { useState } from "react";
import { GoodShortSection } from "./GoodShortSection";
import { InfiniteGoodShortSection } from "./InfiniteGoodShortSection";
import { GoodShortCategoryMenu } from "./GoodShortCategoryMenu";
import { GoodShortCatalogSection } from "./GoodShortCatalogSection";
import { useGoodShortLatest, useGoodShortTrending } from "@/hooks/useGoodShort";
import { findGenreLabel, findTagLabel } from "@/lib/goodshort-taxonomy";

export function GoodShortHome() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

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

  const hasFilter = !!selectedGenre || !!selectedTag;
  const filterLabel = findGenreLabel(selectedGenre) ?? findTagLabel(selectedTag) ?? "결과";

  return (
    <div className="space-y-8 animate-fade-up">
      <GoodShortCategoryMenu
        selectedGenre={selectedGenre}
        selectedTag={selectedTag}
        onSelectGenre={setSelectedGenre}
        onSelectTag={setSelectedTag}
      />

      {hasFilter ? (
        <GoodShortCatalogSection title={filterLabel} genre={selectedGenre} tag={selectedTag} />
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
