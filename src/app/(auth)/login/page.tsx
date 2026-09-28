import Link from "next/link";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-card border border-border bg-card p-8 shadow-sm text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <LogIn className="size-6" />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
          Đăng nhập vào StayHub
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Form đăng nhập với Credentials và Google OAuth (theo TSK-018).
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button asChild className="w-full">
            <Link href="/">Về Trang chủ</Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
