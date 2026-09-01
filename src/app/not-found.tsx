import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold font-display gradient-text mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-foreground mb-2">페이지를 찾을 수 없습니다</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        죄송합니다. 찾으시는 페이지가 존재하지 않습니다.
      </p>
      <Link
        href="/"
        className="px-8 py-3 rounded-full font-semibold text-primary-foreground transition-all hover:scale-105 shadow-lg"
        style={{ background: "var(--gradient-primary)" }}
      >
        홈으로 돌아가기
      </Link>
    </main>
  );
}
