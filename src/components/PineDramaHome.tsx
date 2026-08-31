"use client";

import { PineDramaSection } from "./PineDramaSection";
import { InfinitePineDramaSection } from "./InfinitePineDramaSection";
import { usePineDramaTrending } from "@/hooks/usePineDrama";
import { useI18n } from "@/i18n/LanguageContext";

export function PineDramaHome() {
  const { t } = useI18n();
  const {
    data: trendingData,
    isLoading: loadingTrending,
    error: errorTrending,
    refetch: refetchTrending
  } = usePineDramaTrending();

  return (
    <div className="space-y-8 animate-fade-up">
      <PineDramaSection
        title={t("sectionTrending")}
        dramas={trendingData}
        isLoading={loadingTrending}
        error={!!errorTrending}
        onRetry={() => refetchTrending()}
      />
      <InfinitePineDramaSection title={t("sectionMore")} />
    </div>
  );
}
