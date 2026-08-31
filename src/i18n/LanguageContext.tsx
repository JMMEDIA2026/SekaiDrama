"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DEFAULT_LANG, HTML_LANG_TAGS, dictionaries, type UILang } from "./translations";

const STORAGE_KEY = "sekaidrama-lang";

interface LanguageContextValue {
  lang: UILang;
  setLang: (lang: UILang) => void;
  t: (key: keyof (typeof dictionaries)["ko"], vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isUILang(value: string | null): value is UILang {
  return !!value && value in dictionaries;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<UILang>(DEFAULT_LANG);
  const queryClient = useQueryClient();
  const isFirstRun = useRef(true);

  // 저장된 사용자 언어 설정을 불러옵니다 (없으면 한국어 기본값 유지)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isUILang(saved)) setLangState(saved);
    } catch {
      // localStorage 접근 불가 시 기본 언어(한국어) 유지
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = HTML_LANG_TAGS[lang];
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // 저장 실패는 무시 (시크릿 모드 등)
    }

    // 언어를 바꾸면 이미 캐시된 드라마 데이터(제목/설명 등)를
    // 새 언어로 다시 가져오도록 React Query 캐시를 초기화합니다.
    if (isFirstRun.current) {
      isFirstRun.current = false;
    } else {
      queryClient.invalidateQueries();
    }
  }, [lang, queryClient]);

  const setLang = useCallback((next: UILang) => setLangState(next), []);

  const t = useCallback(
    (key: keyof (typeof dictionaries)["ko"], vars?: Record<string, string | number>) => {
      const dict = dictionaries[lang] ?? dictionaries[DEFAULT_LANG];
      let str: string = (dict as Record<string, string>)[key] ?? dictionaries[DEFAULT_LANG][key] ?? String(key);
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.split(`{${k}}`).join(String(v));
        }
      }
      return str;
    },
    [lang]
  );

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used within a LanguageProvider");
  return ctx;
}
