import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPortalPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border p-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Shield className="size-6" />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
          Cổng Quản trị Hệ thống (Admin Portal)
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Bảng tổng quan số liệu toàn sàn (users, hosts, bookings, platform
          revenue) và quản lý tài khoản/giao dịch (theo TSK-021).
        </p>
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href="/">Về Trang chủ</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
