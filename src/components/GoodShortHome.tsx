"use client";

import { GoodShortSection } from "./GoodShortSection";
import { InfiniteGoodShortSection } from "./InfiniteGoodShortSection";
import { useGoodShortLatest, useGoodShortTrending } from "@/hooks/useGoodShort";
import { useI18n } from "@/i18n/LanguageContext";

export function GoodShortHome() {
  const { t } = useI18n();
  const {
    data: latestData, 
    isLoading: loadingLatest, 
    error: errorLatest, 
    refetch: refetchLatest 
  } = useGoodShortLatest();

  const { 
    data: trendingData, 
    isLoading: loadingTrending, 
    error: errorTrending, 
    refetch: refetchTrending 
  } = useGoodShortTrending();

  return (
    <div className="space-y-8 animate-fade-up">
      <GoodShortSection
        title={t("sectionLatest")}
        dramas={latestData}
        isLoading={loadingLatest}
        error={!!errorLatest}
        onRetry={() => refetchLatest()}
      />
      <GoodShortSection
        title={t("sectionTrending")}
        dramas={trendingData}
        isLoading={loadingTrending}
        error={!!errorTrending}
        onRetry={() => refetchTrending()}
      />
      <InfiniteGoodShortSection title={t("sectionMore")} />
    </div>
  );
}
