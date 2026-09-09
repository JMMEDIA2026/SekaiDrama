import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (session?.role !== "admin") {
    redirect("/login?redirect=/admin");
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-semibold">JM Drama 관리자</span>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            사이트로 돌아가기
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
