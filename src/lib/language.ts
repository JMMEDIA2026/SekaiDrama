export const en = "en"; // english
export const ja = "ja"; // japanese
export const ko = "ko"; // korean
export const es = "es"; // spanish
export const id = "id"; // indonesia
export const in_lang = "in"; // indonesia alias
export const fr = "fr"; // french
export const pt = "pt"; // portuguese
export const th = "th"; // thai
export const ar = "ar"; // arabic
export const de = "de"; // german
export const pl = "pl"; // polish
export const vi = "vi"; // vietnamese
export const it = "it"; // italian
export const tr = "tr"; // turkish
export const zh = "zh"; // chinese_traditional
export const zhHans = "zhHans"; // chinese_simplified
export const zh_tw = "zh_tw"; // chinese_traditional alias
export const zh_cn = "zh_cn"; // chinese_simplified alias

// 사용자 언어 코드 -> DramaBox API 언어 코드 매핑
export const dramaboxLangMap: Record<string, string> = {
  en: "en",
  ja: "ja",
  ko: "ko",
  es: "es",
  id: "in",
  in: "in",
  fr: "fr",
  pt: "pt",
  th: "th",
  ar: "ar",
  de: "de",
  pl: "pl",
  vi: "vi",
  it: "it",
  tr: "tr",
  zh: "zh",
  zhHans: "zhHans",
  zh_tw: "zh",
  zh_cn: "zhHans",
};

// 사용자가 요청할 수 있는 모든 유효한 언어 코드 목록
export const validLanguages = Object.keys(dramaboxLangMap);

// 사용자 언어 코드를 DramaBox 언어 코드로 변환
export function toDramaboxLang(lang: string): string {
  return dramaboxLangMap[lang] || lang;
}

// 유효한 언어 코드인지 확인
export function isValidLanguage(lang: string): boolean {
  return validLanguages.includes(lang);
}

// 사용자에게 보여줄 언어 목록 (영문 표기)
export function getAvailableLanguages(): Record<string, string> {
  return {
    en: "English",
    ja: "Japanese",
    ko: "Korean",
    es: "Spanish",
    id: "Indonesia (id / in)",
    fr: "French",
    pt: "Portuguese",
    th: "Thai",
    ar: "Arabic",
    de: "German",
    pl: "Polish",
    vi: "Vietnamese",
    it: "Italian",
    tr: "Turkish",
    zh: "Chinese Traditional (zh / zh_tw)",
    zhHans: "Chinese Simplified (zhHans / zh_cn)",
  };
}

export default {
  en,
  ja,
  ko,
  es,
  id,
  in: in_lang,
  fr,
  pt,
  th,
  ar,
  de,
  pl,
  vi,
  it,
  tr,
  zh,
  zhHans,
  zh_tw,
  zh_cn,
};
