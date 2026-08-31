"use client";

import { DramaNovaSection } from "./DramaNovaSection";
import { InfiniteDramaNovaSection } from "./InfiniteDramaNovaSection";
import { useDramaNovaDrama18, useDramaNovaKomik } from "@/hooks/useDramaNova";
import { useI18n } from "@/i18n/LanguageContext";

export function DramaNovaHome() {
  const { t } = useI18n();
  const {
    data: drama18Data, 
    isLoading: loadingDrama18, 
    error: errorDrama18, 
    refetch: refetchDrama18 
  } = useDramaNovaDrama18();

  const { 
    data: komikData, 
    isLoading: loadingKomik, 
    error: errorKomik, 
    refetch: refetchKomik 
  } = useDramaNovaKomik();

  return (
    <div className="space-y-8 animate-fade-up">
      <DramaNovaSection
        title={t("sectionDrama18")}
        dramas={drama18Data}
        isLoading={loadingDrama18}
        error={!!errorDrama18}
        onRetry={() => refetchDrama18()}
      />
      <DramaNovaSection
        title={t("sectionKomik")}
        dramas={komikData}
        isLoading={loadingKomik}
        error={!!errorKomik}
        onRetry={() => refetchKomik()}
      />
      <InfiniteDramaNovaSection title={t("sectionMore")} />
    </div>
  );
}
