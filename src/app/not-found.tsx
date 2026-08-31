"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/LanguageContext";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold font-display gradient-text mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-foreground mb-2">{t("notFoundTitle")}</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        {t("notFoundDesc")}
      </p>
      <Link
        href="/"
        className="px-8 py-3 rounded-full font-semibold text-primary-foreground transition-all hover:scale-105 shadow-lg"
        style={{ background: "var(--gradient-primary)" }}
      >
        {t("backToHome")}
      </Link>
    </main>
  );
}
