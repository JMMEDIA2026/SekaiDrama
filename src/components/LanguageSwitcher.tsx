"use client";

import { Globe, Check } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useI18n } from "@/i18n/LanguageContext";
import { SUPPORTED_LANGUAGES, NATIVE_LANGUAGE_NAMES, type UILang } from "@/i18n/translations";

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (next: UILang) => {
    setLang(next);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1.5 p-2.5 rounded-xl hover:bg-muted/50 transition-colors"
        aria-label="Language / 언어 선택"
      >
        <Globe className="w-5 h-5" />
        <span className="hidden sm:inline text-xs font-medium text-muted-foreground">
          {NATIVE_LANGUAGE_NAMES[lang]}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto bg-card rounded-xl shadow-lg border border-border overflow-x-hidden z-50">
          {SUPPORTED_LANGUAGES.map((code) => (
            <button
              key={code}
              onClick={() => handleSelect(code)}
              className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors ${
                lang === code ? "bg-primary/10 text-primary" : "hover:bg-muted/50 text-foreground"
              }`}
            >
              <span>{NATIVE_LANGUAGE_NAMES[code]}</span>
              {lang === code && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
