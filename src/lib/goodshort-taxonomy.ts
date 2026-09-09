// GoodShort 카테고리/태그 매핑
//
// GoodShort 공식 API(api.sansekai.my.id/api/goodshort/*)는 실제로는 인도네시아어
// 값(typeTwoNames = 장르, labels = 태그)만 내려줍니다. 아래 목록은 실제 API 응답에서
// 관측된 값들을 goodshort.com 한국어 사이트와 동일한 명칭으로 매핑한 것으로,
// 화면에는 한국어(ko)를 보여주고 필터링은 실제 API 값(value)으로 수행합니다.

export interface GoodShortTaxonomyEntry {
  ko: string;
  value: string;
}

// 장르 카테고리 (item.typeTwoNames 기준)
export const GOODSHORT_GENRES: GoodShortTaxonomyEntry[] = [
  { ko: "판타지", value: "Fantasi" },
  { ko: "도시", value: "Urban" },
  { ko: "로맨스", value: "Romansa" },
  { ko: "고대", value: "Drama Kostum" },
  { ko: "초능력", value: "Superpower" },
];

// 핫태그 (item.labels 기준)
export const GOODSHORT_TAGS: GoodShortTaxonomyEntry[] = [
  { ko: "부활", value: "Kebangkitan" },
  { ko: "응징", value: "Pembalasan" },
  { ko: "달콤", value: "Manis" },
  { ko: "숨겨진 정체", value: "Identitas Tersembunyi" },
  { ko: "상처", value: "Sakit Hati" },
  { ko: "상속녀", value: "Pewaris Wanita" },
  { ko: "전남친 응징", value: "Menghukum Mantan Jahat" },
  { ko: "하렘", value: "Harem" },
  { ko: "이혼", value: "Perceraian" },
  { ko: "후회", value: "Penyesalan" },
  { ko: "마피아", value: "Mafia" },
  { ko: "CEO", value: "CEO" },
  { ko: "타임슬립", value: "Perjalanan Waktu" },
  { ko: "전신", value: "Dewa Perang" },
  { ko: "귀여운 아기", value: "Anak Lucu" },
  { ko: "결혼", value: "Pernikahan" },
  { ko: "강자의 귀환", value: "Pahlawan Kembali" },
  { ko: "파워커플", value: "Pasangan Kuat" },
  { ko: "귀족", value: "Bangsawan" },
  { ko: "가족", value: "Keluarga" },
  { ko: "강한 여주", value: "Wanita Kuat" },
  { ko: "가족과 나라의 갈등", value: "Konflik Keluarga dan Negara" },
  { ko: "시스템", value: "Sistem" },
  { ko: "소시민", value: "Orang Biasa" },
  { ko: "여성 CEO", value: "CEO Wanita" },
  { ko: "카리스마 남주", value: "Dominan" },
  { ko: "계약 결혼", value: "Nikah Kontrak" },
  { ko: "암투", value: "Penuh Intrik" },
  { ko: "복수", value: "Balas Dendam" },
  { ko: "선결혼 후연애", value: "Cinta Setelah Menikah" },
  { ko: "초고속 결혼", value: "Nikah Kilat" },
  { ko: "은둔고수의 하산", value: "Master Turun Gunung" },
  { ko: "운명적 사랑", value: "Takdir" },
  { ko: "재결합", value: "CLBK" },
  { ko: "밀당", value: "Saling Kejar" },
  { ko: "오해", value: "Salah Paham" },
  { ko: "환생", value: "Reinkarnasi" },
  { ko: "아내 되찾기", value: "Mengejar Istri" },
  { ko: "배신", value: "Pengkhianatan" },
  { ko: "원나잇", value: "Cinta Satu Malam" },
  { ko: "용", value: "Naga" },
  { ko: "알파", value: "Alpha" },
  { ko: "늑대인간", value: "Manusia Serigala" },
  { ko: "금지된 사랑", value: "Cinta Terlarang" },
  { ko: "짝사랑의 결실", value: "Cinta Diam-diam Jadi Kenyataan" },
  { ko: "바보인 척", value: "Pura-pura Bodoh" },
  { ko: "속죄", value: "Penebusan" },
  { ko: "캠퍼스", value: "Sekolah" },
  { ko: "베이비 어시스터", value: "Dibantu Bayi Lucu" },
  { ko: "대역", value: "Pengganti" },
  { ko: "삼각관계", value: "Cinta Segitiga" },
  { ko: "신데렐라", value: "Cinderella" },
  { ko: "여제", value: "Kaisar Wanita" },
  { ko: "임신", value: "Kehamilan" },
  { ko: "사냥꾼", value: "Pemburu" },
  { ko: "괴물", value: "Monster" },
  { ko: "억만장자", value: "Miliuner" },
  { ko: "SM", value: "SM" },
  { ko: "신분 오인", value: "Kesalahan Identitas" },
  { ko: "오피스 로맨스", value: "Romansa Kantor" },
];

export function findGenreLabel(value: string | null | undefined): string | null {
  if (!value) return null;
  return GOODSHORT_GENRES.find((g) => g.value === value)?.ko ?? null;
}

export function findTagLabel(value: string | null | undefined): string | null {
  if (!value) return null;
  return GOODSHORT_TAGS.find((t) => t.value === value)?.ko ?? null;
}
