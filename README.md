# SekaiDrama

[![License](https://img.shields.io/github/license/Sansekai/SekaiDrama)](https://github.com/Sansekai/SekaiDrama/blob/main/LICENSE)
[![Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/Sansekai/SekaiDrama)

![Preview](public/preview.png)

SekaiDrama adalah platform streaming drama pendek (vertical drama) modern yang menampilkan konten dari bebebrapa platform populer. Dibangun dengan teknologi web terkini untuk performa maksimal dan pengalaman pengguna yang premium.

## Persyaratan Sistem
Sebelum memulai, pastikan komputer Anda sudah terinstall:
- [Node.js](https://nodejs.org/) (Versi 18 LTS atau 20 LTS disarankan)
- Git (Opsional)

## Panduan Instalasi (Localhost)

Ikuti langkah-langkah berikut untuk menjalankan project ini di komputer Anda:

### 1. Clone Repository
1.  Buka terminal (Command Prompt/PowerShell).
2.  Clone repository ini ke komputer Anda:
    ```bash
    git clone https://github.com/Sansekai/SekaiDrama.git
    ```
3.  Masuk ke folder project:
    ```bash
    cd SekaiDrama
    ```

### 2. Install Dependencies
Install semua library yang dibutuhkan project ini:
```bash
npm install
# atau jika menggunakan yarn
yarn install
# atau pnpm
pnpm install
```

### 3. Konfigurasi Environment Variable
Salin file bernama `.env.example` menjadi `.env`

### 4. Jalankan Development Server
Mulai server lokal untuk pengembangan:
```bash
npm run dev
```

Buka browser dan kunjungi [http://localhost:3000](http://localhost:3000).

## Script Perintah
| Command | Fungsi |
|---------|--------|
| `npm run dev` | Menjalankan server development |
| `npm run build` | Membuat build production |
| `npm run start` | Menjalankan build production |
| `npm run lint` | Cek error coding style (Linting) |

## Struktur Folder
```text
src/
├── app/                    # Halaman & Routing (Next.js App Router)
│   ├── (auth)/             # Route Group untuk fitur Login/Register
│   ├── (main)/             # Route Group untuk konten utama (Home, Search)
│   ├── api/                # API Routes untuk integrasi backend
│   ├── drama/              # Halaman detail & Video player
│   └── layout.tsx          # Root layout aplikasi
├── components/             # Reusable UI Components
│   ├── ui/                 # Base components (Shadcn UI)
│   ├── player/             # Komponen khusus video player
│   ├── cards/              # Komponen card drama/koleksi
│   └── layouts/            # Navbar, Sidebar, Footer
├── hooks/                  # Custom React Hooks (useAuth, usePlayer, dll)
├── lib/                    # Helper functions & konfigurasi library (Prisma, Axios)
├── services/               # Logic fetching data & business logic
├── types/                  # TypeScript interfaces & types definitions
└── styles/                 # Global CSS & Tailwind configuration
```

## Kustomisasi

### Popup Donasi QRIS

Popup donasi QRIS yang sebelumnya muncul di halaman detail sebelum menonton (`QrisDonationPopup`) telah dihapus dari aplikasi ini, sehingga mengklik thumbnail langsung membuka video tanpa popup apa pun.

---

## 📄 업로드된 `language.js` 파일 분석 (한국어)

사용자가 업로드한 `language.js`는 이 프로젝트의 **다국어(i18n) 언어 코드 정의 및 매핑 파일**입니다. 실행 코드가 아니라 "설정용 데이터/유틸 모듈"이며, 크게 3가지 역할을 합니다.

### 1) 언어 코드 상수 정의 (1~19행)

```js
export const en = 'en';   // 영어
export const ko = 'ko';   // 한국어
export const ja = 'ja';   // 일본어
...
```

ISO 639-1 기반 언어 코드를 문자열 상수로 export합니다. 총 18개 언어(영어, 일본어, 한국어, 스페인어, 인도네시아어, 프랑스어, 포르투갈어, 태국어, 아랍어, 독일어, 폴란드어, 베트남어, 이탈리아어, 터키어, 중국어 번체/간체 등)와 `in`(인도네시아어 alias), `zh_tw`/`zh_cn`(중국어 번체/간체 alias)을 포함합니다.

### 2) `dramaboxLangMap` — 사용자 언어 → DramaBox API 언어 매핑 (22~42행)

이 파일의 핵심입니다. **DramaBox**(이 레포에서 연동 중인 숏폼 드라마 플랫폼 API)는 인도네시아어를 `id`가 아니라 `in`으로, 중국어 간체/번체를 각각 `zhHans`/`zh`로 표기하는 등 표준과 다른 코드 체계를 씁니다. 이 맵은 "사용자가 요청한 언어 코드"를 "DramaBox API가 이해하는 코드"로 변환하는 테이블입니다.

- `id`, `in` → `in` (인도네시아어는 항상 `in`으로 정규화)
- `zh_tw` → `zh`, `zh_cn` → `zhHans` (별칭을 표준 코드로 정규화)
- 나머지 언어는 1:1 그대로 매핑

### 3) 유틸리티 함수 (44~77행)

| 함수 | 역할 |
|---|---|
| `toDramaboxLang(lang)` | 사용자 언어 코드를 DramaBox API 코드로 변환 (매핑에 없으면 입력값 그대로 반환) |
| `isValidLanguage(lang)` | 해당 코드가 지원 목록(`validLanguages`)에 있는지 확인 |
| `getAvailableLanguages()` | UI에 표시할 "코드 → 언어명(영문)" 딕셔너리 반환 |

### 4) 결론 — "이 파일은 언어(다국어) 설정 파일이 맞습니다"

말씀하신 대로 이 `language.js`는 **다국어 지원을 위한 언어 코드/매핑 정의 파일**입니다. 다만 원본은 SekaiDrama 웹사이트의 **화면 UI 문구**를 번역하는 용도가 아니라, 백엔드 API(DramaBox)에 "어떤 언어로 응답해달라"고 요청할 때 쓰는 파라미터 변환용이었습니다. 이번 작업에서는 이 파일을 그대로 이식하면서(`src/lib/language.ts`), **웹사이트 화면 전체를 다국어로 전환하는 새로운 i18n 시스템의 언어 코드 기준표**로 재사용했습니다.

---

## 🌍 다국어(i18n) 홈페이지 시스템

이번 업데이트로 SekaiDrama 홈페이지 **기본 언어가 한국어(🇰🇷)**로 설정되었고, 헤더 우측의 **지구본(🌐) 아이콘**을 눌러 언제든 다른 언어로 전환할 수 있는 **다국어 홈페이지**가 되었습니다.

### 지원 언어 (16개)

한국어(기본) · English · 日本語 · Español · Bahasa Indonesia · Français · Português · ไทย · العربية · Deutsch · Polski · Tiếng Việt · Italiano · Türkçe · 繁體中文 · 简体中文

`src/lib/language.ts`에 정의된 언어 코드 체계를 그대로 UI 언어 목록의 기준으로 사용합니다.

### 새로 추가된 파일

| 파일 | 역할 |
|---|---|
| `src/lib/language.ts` | 업로드된 `language.js`를 TypeScript로 이식 (DramaBox API 언어 매핑) |
| `src/i18n/translations.ts` | 16개 언어별 UI 번역 사전 (검색, 오류 메시지, 섹션 제목 등) |
| `src/i18n/LanguageContext.tsx` | React Context 기반 `useI18n()` 훅 — 현재 언어(`lang`), 언어 변경(`setLang`), 번역 함수(`t`) 제공. 선택한 언어는 `localStorage`에 저장되어 재방문 시에도 유지됨 |
| `src/components/LanguageSwitcher.tsx` | 헤더에 있는 언어 선택 드롭다운 UI |

### 동작 방식

1. 처음 방문 시 기본 언어는 **한국어**이며, `<html lang="ko">`로 설정됩니다.
2. 사용자가 언어를 변경하면 `localStorage`에 저장되고, 다음 방문 시 자동으로 유지됩니다.
3. 아랍어(`ar`) 선택 시 `<html dir="rtl">`이 자동 적용됩니다.
4. 검색창 placeholder, "검색 중:", 검색 결과 없음 안내, 각 플랫폼(DramaBox/ReelShort/ShortMax/NetShort/Melolo/FreeReels/DramaNova/GoodShort/PineDrama)의 섹션 제목("최신"/"트렌딩"/"더보기" 등), 데이터 로딩 실패/재시도 문구, 푸터, 404 페이지 등 **홈페이지 전체 UI 문구**가 번역 시스템(`t()`)을 통해 렌더링됩니다.

### 적용 범위 안내

이번 작업은 **홈페이지(메인 화면 및 플랫폼별 목록 화면)** 전체에 다국어를 적용했습니다. 드라마 상세 페이지(`/detail/...`)와 시청 페이지(`/watch/...`)의 일부 버튼 문구(예: "다시 시도")는 이번 범위에 포함되지 않았습니다 — 필요하시면 동일한 `useI18n()` 패턴으로 손쉽게 확장할 수 있습니다.

### 새 언어를 추가하려면

1. `src/i18n/translations.ts`의 `SUPPORTED_LANGUAGES` 배열에 언어 코드를 추가
2. `NATIVE_LANGUAGE_NAMES`, `HTML_LANG_TAGS`에 표기 추가
3. `dictionaries` 객체에 해당 언어의 번역 키-값을 모두 채우면 끝
