"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  Star,
  ShieldCheck,
  CreditCard,
  QrCode,
  Lock,
  AlertCircle,
} from "lucide-react";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function BookContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const propertyId = params?.id as string;
  const property =
    MOCK_PROPERTIES.find((p) => p.id === propertyId) || MOCK_PROPERTIES[0];

  const checkIn = searchParams.get("checkIn") || "2026-10-15";
  const checkOut = searchParams.get("checkOut") || "2026-10-18";
  const guests = parseInt(searchParams.get("guests") || "2", 10);
  const nights = parseInt(searchParams.get("nights") || "3", 10);

  // Form State (Guest Details - Table 5.10)
  const [fullName, setFullName] = React.useState("Trần Đức Anh");
  const [email, setEmail] = React.useState("ducanh@gmail.com");
  const [phone, setPhone] = React.useState("0912345678");
  const [paymentMethod, setPaymentMethod] = React.useState<"VNPAY_QR" | "VNPAY_CARD">("VNPAY_QR");
  const [isProcessing, setIsProcessing] = React.useState(false);

  const basePrice = property.pricePerNight * nights;
  const totalPrice = basePrice + property.cleaningFee + property.serviceFee;

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing then redirect to return page
    setTimeout(() => {
      router.push(
        `/payments/vnpay/return?vnp_ResponseCode=00&vnp_TxnRef=BK-88219&vnp_Amount=${totalPrice * 100}`
      );
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Header Back Button */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href={`/properties/${property.id}`}
          className="flex size-9 items-center justify-center rounded-full border border-border text-foreground hover:bg-muted transition-colors"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Xác nhận và thanh toán (Confirm & Pay)
        </h1>
      </div>

      {/* 2. Main Grid: Left Column (Guest Details & Payment) vs Right Column (Booking Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Trip Details Section (Table 5.10 - Item 1) */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-foreground">Chuyến đi của bạn (Trip Details)</h2>
            <div className="grid grid-cols-2 gap-4 divide-x divide-border">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Thời gian</p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {checkIn} đến {checkOut} ({nights} đêm)
                </p>
              </div>
              <div className="pl-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Khách lưu trú</p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {guests} người lớn
                </p>
              </div>
            </div>
          </div>

          {/* Guest Details Form (Table 5.10 - Item 2) */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-foreground">Thông tin liên hệ (Guest Details)</h2>
            <p className="text-xs text-muted-foreground">
              Thông tin này sẽ được dùng để gửi xác nhận đặt phòng và mã QR nhận phòng
            </p>

            <form id="booking-form" onSubmit={handleSubmitPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                  Họ và tên khách đại diện *
                </label>
                <Input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Trần Đức Anh"
                  className="rounded-xl h-11"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                    Địa chỉ Email nhận vé *
                  </label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="rounded-xl h-11"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                    Số điện thoại liên lạc *
                  </label>
                  <Input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912345678"
                    className="rounded-xl h-11"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Payment Method Section (Table 5.10 - Item 4) */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Phương thức thanh toán</h2>
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <Lock className="size-3.5" />
                <span>Mã hóa SSL 256-bit</span>
              </div>
            </div>

            <div className="space-y-3">
              {/* Option 1: VNPay QR */}
              <label
                className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                  paymentMethod === "VNPAY_QR"
                    ? "border-primary bg-primary/5 shadow-xs"
                    : "border-border hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "VNPAY_QR"}
                    onChange={() => setPaymentMethod("VNPAY_QR")}
                    className="size-4 accent-primary"
                  />
                  <div>
                    <p className="text-sm font-bold text-foreground">Cổng VNPay (Quét mã VNPAY-QR)</p>
                    <p className="text-xs text-muted-foreground">
                      Hỗ trợ hơn 40 ứng dụng ngân hàng và ví VNPAY
                    </p>
                  </div>
                </div>
                <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                  <QrCode className="size-5" />
                </div>
              </label>

              {/* Option 2: Credit / ATM Card */}
              <label
                className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                  paymentMethod === "VNPAY_CARD"
                    ? "border-primary bg-primary/5 shadow-xs"
                    : "border-border hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "VNPAY_CARD"}
                    onChange={() => setPaymentMethod("VNPAY_CARD")}
                    className="size-4 accent-primary"
                  />
                  <div>
                    <p className="text-sm font-bold text-foreground">Thẻ ATM nội địa / Thẻ quốc tế Visa, Mastercard</p>
                    <p className="text-xs text-muted-foreground">
                      Thanh toán trực tiếp qua cổng bảo mật VNPay
                    </p>
                  </div>
                </div>
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <CreditCard className="size-5" />
                </div>
              </label>
            </div>

            {/* Cancellation Policy */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                <AlertCircle className="size-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Bằng cách nhấn nút xác nhận bên dưới, bạn đồng ý với Điều khoản dịch vụ và Chính sách hoàn tiền của StayHub. Bạn được miễn phí hủy phòng trước 48 giờ so với giờ check-in.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Summary Card (Table 5.10 - Item 3) */}
        <div className="lg:col-span-5">
          <div className="sticky top-[100px] rounded-3xl border border-border bg-card p-6 shadow-xl space-y-6">
            {/* Property Summary Header */}
            <div className="flex items-start gap-4 pb-6 border-b border-border">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-muted shadow-xs">
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  fill
                  className="size-full object-cover"
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                  {property.propertyTypeName}
                </p>
                <h3 className="line-clamp-2 text-sm font-bold text-foreground mt-0.5">
                  {property.title}
                </h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Star className="size-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                  <span className="font-bold text-foreground">{property.rating.toFixed(2)}</span>
                  <span>({property.reviewCount})</span>
                  {property.isSuperhost && <span>· Superhost</span>}
                </div>
              </div>
            </div>

            {/* Price Details (Table 5.10 - Item 3) */}
            <div className="space-y-3 text-xs">
              <h4 className="text-sm font-bold text-foreground">Chi tiết giá (Price Details)</h4>

              <div className="flex justify-between text-muted-foreground">
                <span>
                  {property.pricePerNight.toLocaleString("vi-VN")}₫ $\times$ {nights} đêm
                </span>
                <span className="text-foreground font-medium">
                  {basePrice.toLocaleString("vi-VN")}₫
                </span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Phí dọn dẹp</span>
                <span className="text-foreground font-medium">
                  {property.cleaningFee.toLocaleString("vi-VN")}₫
                </span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Phí dịch vụ sàn StayHub</span>
                <span className="text-foreground font-medium">
                  {property.serviceFee.toLocaleString("vi-VN")}₫
                </span>
              </div>

              <div className="flex justify-between border-t border-border pt-4 text-base font-extrabold text-foreground">
                <span>Tổng tiền cần thanh toán</span>
                <span className="text-primary">{totalPrice.toLocaleString("vi-VN")}₫</span>
              </div>
            </div>

            {/* Confirm & Pay Button */}
            <Button
              form="booking-form"
              type="submit"
              disabled={isProcessing}
              size="lg"
              className="w-full rounded-2xl bg-primary text-primary-foreground font-bold shadow-md hover:opacity-95 text-base py-6 cursor-pointer"
            >
              {isProcessing ? "Đang xử lý kết nối VNPay..." : "Xác nhận & Thanh toán (Confirm & Pay)"}
            </Button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>Giao dịch được bảo hộ 100% bởi StayHub & VNPay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm font-semibold text-muted-foreground">
              Đang tải thông tin đặt phòng...
            </p>
          </div>
        </div>
      }
    >
      <BookContent />
    </React.Suspense>
  );
}
