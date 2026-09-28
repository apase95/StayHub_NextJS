import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-card border border-border bg-card p-8 shadow-sm text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="size-6" />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
          Xác thực mã OTP Email
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Giao diện nhập mã xác thực 6 số gửi qua hòm thư điện tử (theo
          TSK-019).
        </p>
        <div className="mt-6">
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Về trang Đăng nhập</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
