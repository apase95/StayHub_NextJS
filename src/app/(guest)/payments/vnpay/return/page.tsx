import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VNPayReturnPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg rounded-card border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
          <CheckCircle2 className="size-6" />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
          Kết quả giao dịch VNPay
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Xác minh giao dịch thanh toán từ cổng VNPay và cập nhật trạng thái đơn
          đặt phòng (theo TSK-044).
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button asChild className="w-full">
            <Link href="/bookings">Xem chuyến đi của bạn</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Về Trang chủ</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
