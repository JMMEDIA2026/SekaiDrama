"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useI18n } from "@/i18n/LanguageContext";

interface UnifiedErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
  title?: string;
  retryLabel?: string;
}

export function UnifiedErrorDisplay({
  message,
  title,
  onRetry,
  retryLabel,
}: UnifiedErrorDisplayProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center space-y-6 bg-[#1a1625] rounded-2xl border border-white/5 mx-auto max-w-4xl w-full">
      <div className="rounded-full bg-red-500/10 p-4 ring-1 ring-red-500/20">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <div className="space-y-2">
        <h3 className="font-display font-bold text-lg md:text-xl text-white">{title ?? t("loadFailed")}</h3>
        <p className="text-sm text-white/60 max-w-sm mx-auto">
          {message ?? t("genericError")}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#3D2942] text-purple-300 text-sm font-medium hover:bg-[#4D3453] transition-colors hover:text-purple-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{retryLabel ?? t("retry")}</span>
        </button>
      )}
    </div>
  );
}
