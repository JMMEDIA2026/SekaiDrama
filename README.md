# JM Drama

DramaBox, GoodShort 등의 숏드라마(세로형 드라마) 콘텐츠를 한 곳에서 모아 볼 수 있는 Next.js 기반 스트리밍 플랫폼입니다. 회원가입/로그인, 관리자 광고 관리(QRIS 후원 팝업, 배너, 광고 슬롯) 기능을 포함합니다.

## 주요 기능

- **DramaBox / GoodShort 콘텐츠 열람**: 최신/인기/더보기 무한 스크롤, 검색, GoodShort 카테고리·핫태그 탐색
- **한국어 콘텐츠 우선 노출**: GoodShort 검색 API의 특성을 활용해 한국어 원작 드라마를 우선적으로 모아서 보여주는 홈 섹션 제공
- **SEO 친화적 상세 페이지 URL**: 각 플랫폼의 실제 URL 스타일을 흉내낸 슬러그 적용 (`/detail/dramabox/{ID}_{제목}`, `/detail/goodshort/{제목}-{ID}`)
- **회원 시스템**: 회원가입/로그인/로그아웃 (`/signup`, `/login`)
- **관리자 대시보드** (`/admin/ads`): QRIS 후원 팝업 on/off 및 문구·이미지 편집, 배너 이미지 관리, 광고 슬롯(예: Google AdSense) HTML 삽입

## 기술 스택

- [Next.js](https://nextjs.org/) 16 (App Router, Turbopack)
- TypeScript, Tailwind CSS
- [TanStack Query](https://tanstack.com/query) (React Query) — 데이터 페칭/캐싱
- [@vercel/postgres](https://vercel.com/docs/storage/vercel-postgres) — 회원/광고 설정 DB (Vercel Postgres 또는 Neon 등 호환 Postgres)
- `bcryptjs` (비밀번호 해시), `jose` (JWT 세션)

## 시작하기

### 1. 사전 준비물

- [Node.js](https://nodejs.org/) 18 LTS 이상 (20 LTS 권장)
- Git (선택)

### 2. 설치

```bash
git clone <이 저장소 주소>
cd SekaiDrama
npm install
```

### 3. 환경 변수 설정

`.env.example` 파일을 복사해 `.env`를 만들고 필요한 값을 채웁니다.

```bash
cp .env.example .env
```

| 변수 | 설명 |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | 드라마 콘텐츠 API 베이스 URL 기본값 그대로 사용 |
| `NEXT_PUBLIC_CRYPTO_SECRET` | API 응답 복호화용 키. 기본값 그대로 사용 |
| `POSTGRES_URL` | 회원가입/로그인/광고 관리 기능에 필요. Vercel Postgres를 연결하면 자동 주입됨 (로컬 개발 시에만 직접 입력) |
| `JWT_SECRET` | 로그인 세션(JWT) 서명용 비밀키. `openssl rand -base64 32`로 생성 |
| `ADMIN_USERNAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | 최초 관리자 계정 생성(seed) 시에만 사용. 실행 후 값 삭제 권장 |

회원가입/로그인/관리자 기능을 쓰지 않고 콘텐츠 열람만 확인하려면 `POSTGRES_URL`, `JWT_SECRET`, `ADMIN_*` 없이도 개발 서버는 실행됩니다 (해당 기능만 동작하지 않음).

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속.

## 스크립트 명령어

| 명령어 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 실행 (Turbopack) |
| `npm run build` | 프로덕션 빌드 생성 |
| `npm run start` | 프로덕션 빌드 실행 |
| `npm run lint` | 코드 스타일 검사 |
| `npm run db:migrate` | DB 스키마 마이그레이션 (`db/schema.sql` 적용) |
| `npm run db:seed` | 관리자 계정 최초 생성 (아래 참고) |

## 회원/관리자 기능 설정 (Postgres 필요)

### 1. 데이터베이스 연결

Vercel 대시보드에서 프로젝트에 **Vercel Postgres**(또는 Neon 등 호환 Postgres)를 연결하면 `POSTGRES_URL`이 자동으로 주입됩니다. 로컬 개발 시에는 해당 값을 `.env`에 직접 복사해 넣으세요.

### 2. 스키마 마이그레이션

```bash
npm run db:migrate
```

### 3. 관리자 계정 생성

비밀번호는 코드에 저장되지 않고, 실행 시 환경변수로만 전달됩니다.

```bash
ADMIN_USERNAME=관리자아이디 ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=원하는비밀번호 npm run db:seed
```

비밀번호는 자동으로 해시되어 DB에 저장됩니다. 성공 후 `/login`으로 로그인하고 `/admin/ads`에서 광고를 관리할 수 있습니다.

### 4. JWT_SECRET 설정

`JWT_SECRET`에 임의의 긴 문자열을 넣어주세요 (예: `openssl rand -base64 32`). 없으면 로그인/회원가입이 동작하지 않습니다.

## 폴더 구조

```text
src/
├── app/
│   ├── admin/ads/           # 관리자 광고 관리 페이지
│   ├── api/
│   │   ├── auth/            # 회원가입/로그인/로그아웃/me
│   │   ├── ads/, admin/ads/ # 광고 설정 조회(공개) / 관리(관리자)
│   │   ├── dramabox/        # DramaBox 콘텐츠 프록시 API
│   │   └── goodshort/       # GoodShort 콘텐츠 프록시 API
│   ├── detail/[platform]/   # 드라마 상세 페이지
│   ├── watch/[platform]/    # 드라마 시청(플레이어) 페이지
│   ├── login/, signup/      # 로그인/회원가입 페이지
│   └── layout.tsx           # 루트 레이아웃
├── components/              # UI 컴포넌트 (헤더, 카드, 배너, QRIS 팝업 등)
├── hooks/                   # 커스텀 훅 (useDramas, useGoodShort, useAuth 등)
├── lib/                     # DB, 인증, 슬러그, 암복호화 등 유틸
├── types/                   # TypeScript 타입 정의
└── styles/                  # 전역 스타일 (globals.css)

db/schema.sql                # Postgres 스키마 및 기본 시드 데이터
scripts/                     # migrate.ts, seed-admin.ts
```

> 참고: `dramanova`, `freereels`, `melolo`, `netshort`, `pinedrama`, `reelshort`, `shortmax` 등 다른 플랫폼 코드도 저장소에 남아 있지만, 현재 화면(플랫폼 선택 탭)에는 노출되지 않고 **DramaBox / GoodShort만 표시**됩니다.

## 커스터마이징

### QRIS 후원 팝업 끄기

상세 페이지 진입 시 나타나는 QRIS 후원 팝업은 관리자 대시보드(`/admin/ads`)에서 on/off 설정으로 끌 수 있습니다. DB 연결 없이 코드에서 완전히 제거하려면 `src/app/detail/layout.tsx`에서 아래처럼 주석 처리하세요.

```tsx
import QrisDonationPopup from '@/components/QrisDonationPopup';

export default function DetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      {/* <QrisDonationPopup /> */}
    </>
  );
}
```

### 노출 플랫폼 변경

플랫폼 선택 탭에 표시되는 플랫폼 목록은 `src/hooks/usePlatform.ts`의 `PLATFORMS` 배열에서 관리됩니다. 현재는 DramaBox/GoodShort만 활성화되어 있고, 나머지 플랫폼(PineDrama, ReelShort, ShortMax, NetShort, Melolo, FreeReels, DramaNova)은 주석 처리되어 숨겨진 상태입니다. 해당 항목의 주석을 해제하면 다시 노출됩니다 (API 라우트 자체는 이미 구현되어 있음).
