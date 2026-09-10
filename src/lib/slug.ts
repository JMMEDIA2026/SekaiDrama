// 상세 페이지 URL을 각 플랫폼의 실제 사이트처럼 "제목 슬러그"가 포함된 형태로
// 만들기 위한 유틸. 실제 조회/재생에는 ID만 사용하고, 슬러그는 URL을 보기 좋게
// 만드는 장식용입니다.
//
// - GoodShort(goodshort.com): {제목-슬러그}-{ID}  예) 키스-전까지는-여자를-좋아했다-31001139655
// - DramaBox(dramabox.com):   {ID}_{제목-슬러그}  예) 41000106749_Masked-Magnate-The-Dominant-Son-in-Law-DUBBED

export function slugify(title: string): string {
  return title
    .normalize("NFKC")
    .trim()
    .replace(/[^\p{L}\p{N}\s-]+/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** GoodShort 스타일: 슬러그-ID (슬러그가 앞, ID가 뒤) */
export function buildSuffixSlug(id: string | number, title: string): string {
  const slug = slugify(title);
  return slug ? `${slug}-${id}` : String(id);
}

/** DramaBox 스타일: ID_슬러그 (ID가 앞, 슬러그가 뒤) */
export function buildPrefixSlug(id: string | number, title: string): string {
  const slug = slugify(title);
  return slug ? `${id}_${slug}` : String(id);
}

// URL 파라미터(예: "키스-전까지는-여자를-좋아했다-31001139655")에서
// 마지막 숫자 구간만 실제 ID로 추출. 슬러그 없이 순수 ID만 온 경우도 그대로 동작.
export function extractIdFromSuffixSlug(param: string): string {
  const match = param.match(/(\d+)$/);
  return match ? match[1] : param;
}

// URL 파라미터(예: "41000106749_Masked-Magnate-...")에서
// 맨 앞 숫자 구간만 실제 ID로 추출. 슬러그 없이 순수 ID만 온 경우도 그대로 동작.
export function extractIdFromPrefixSlug(param: string): string {
  const match = param.match(/^(\d+)/);
  return match ? match[1] : param;
}
