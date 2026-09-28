"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Calendar, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

function ReturnContent() {
  const searchParams = useSearchParams();
  const txnRef = searchParams.get("vnp_TxnRef") || "BK-88219";
  const amountStr = searchParams.get("vnp_Amount") || "895000000";
  const amount = parseInt(amountStr, 10) / 100;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-xl space-y-6">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
          <CheckCircle2 className="size-9" />
        </div>

        <div>
          <span className="inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600">
            Thanh toán thành công qua VNPay
          </span>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground">
            Đặt phòng thành công!
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Mã giao dịch đã được hệ thống ghi nhận và gửi thông tin xác nhận về email của bạn.
          </p>
        </div>

        {/* Transaction Receipt Card */}
        <div className="rounded-2xl border border-border bg-muted/30 p-4 text-left space-y-2.5 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mã đơn đặt phòng (Booking ID):</span>
            <span className="font-bold text-foreground">{txnRef}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phương thức thanh toán:</span>
            <span className="font-semibold text-foreground">Cổng thanh toán VNPay-QR</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Thời gian giao dịch:</span>
            <span className="font-semibold text-foreground">{new Date().toLocaleString("vi-VN")}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-sm">
            <span className="font-bold text-foreground">Tổng tiền thanh toán:</span>
            <span className="font-black text-primary">{amount.toLocaleString("vi-VN")}₫</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <Button asChild size="lg" className="w-full rounded-2xl bg-primary font-bold">
            <Link href="/bookings">
              <Calendar className="size-4 mr-2" />
              Xem Chuyến đi của tôi (My Trips)
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="w-full rounded-2xl">
            <Link href="/">
              <Home className="size-4 mr-2" />
              Quay về Trang chủ
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function VNPayReturnPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <ReturnContent />
    </React.Suspense>
  );
}
