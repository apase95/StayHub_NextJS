"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  Share2,
  Heart,
  MapPin,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.id as string;

  // Find property or fallback to prop-1
  const property =
    MOCK_PROPERTIES.find((p) => p.id === propertyId) || MOCK_PROPERTIES[0];

  const [isSaved, setIsSaved] = React.useState(false);
  const [checkIn, setCheckIn] = React.useState("2026-10-15");
  const [checkOut, setCheckOut] = React.useState("2026-10-18");
  const [guests, setGuests] = React.useState(2);
  const [isCopied, setIsCopied] = React.useState(false);

  // Calculate nights
  const nights = React.useMemo(() => {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24));
    return diff > 0 ? diff : 3;
  }, [checkIn, checkOut]);

  const basePrice = property.pricePerNight * nights;
  const totalPrice = basePrice + property.cleaningFee + property.serviceFee;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleReserve = () => {
    const query = new URLSearchParams({
      checkIn,
      checkOut,
      guests: guests.toString(),
      nights: nights.toString(),
    });
    router.push(`/properties/${property.id}/book?${query.toString()}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Header Navigation & Breadcrumbs */}
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-4" />
          <span>Quay lại kết quả tìm kiếm</span>
        </Link>

        {/* Share & Save Actions (Matching Figure 5.12 & Table 5.8) */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-full text-xs font-semibold"
          >
            <Share2 className="size-4 text-foreground" />
            <span>{isCopied ? "Đã sao chép link!" : "Chia sẻ (Share)"}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSaved(!isSaved)}
            className="flex items-center gap-1.5 rounded-full text-xs font-semibold"
          >
            <Heart
              className={`size-4 ${
                isSaved ? "fill-[#ff4d4d] text-[#ff4d4d]" : "text-foreground"
              }`}
            />
            <span>{isSaved ? "Đã lưu" : "Lưu (Save)"}</span>
          </Button>
        </div>
      </div>

      {/* 2. Title & Metadata */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          {property.title}
        </h1>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-foreground">
          <div className="flex items-center gap-1 font-bold">
            <Star className="size-4 fill-[#f59e0b] text-[#f59e0b]" />
            <span>{property.rating.toFixed(2)}</span>
            <span className="font-normal text-muted-foreground underline">
              ({property.reviewCount} đánh giá)
            </span>
          </div>

          <span className="text-muted-foreground">·</span>

          {property.isSuperhost && (
            <>
              <div className="flex items-center gap-1 font-semibold text-primary">
                <Award className="size-4" />
                <span>Superhost</span>
              </div>
              <span className="text-muted-foreground">·</span>
            </>
          )}

          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="size-4 text-primary shrink-0" />
            <span className="underline">{property.address}</span>
          </div>
        </div>
      </div>

      {/* 3. 5-Photo Gallery Grid (Matching Section 5.3.3) */}
      <section className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-2.5 overflow-hidden rounded-2xl h-[340px] sm:h-[460px]">
        {/* Main Large Image (2 cols on md) */}
        <div className="relative md:col-span-2 size-full overflow-hidden bg-muted">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            priority
            className="size-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* 4 Small Images (2 cols, 2 rows) */}
        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2.5 size-full">
          {property.images.slice(1, 5).map((img, idx) => (
            <div key={idx} className="relative size-full overflow-hidden bg-muted">
              <Image
                src={img}
                alt={`${property.title} - ảnh ${idx + 2}`}
                fill
                sizes="25vw"
                className="size-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Main Content: Left Column (Details) & Right Column (Sticky Booking Card) */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column (Details) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Host Profile & Room Specs */}
          <div className="flex items-center justify-between border-b border-border pb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {property.propertyTypeName} · Chủ nhà: {property.host.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tối đa {property.maxGuests} khách · {property.bedrooms} phòng ngủ · {property.beds} giường · {property.bathrooms} phòng tắm
              </p>
            </div>

            <div className="relative size-14 overflow-hidden rounded-full border-2 border-primary/20 shadow-xs">
              <Image
                src={property.host.avatar}
                alt={property.host.name}
                fill
                className="size-full object-cover"
              />
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-4 border-b border-border pb-6">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Trải nghiệm nhận phòng thuận tiện</h3>
                <p className="text-xs text-muted-foreground">
                  98% khách gần đây đã đánh giá quy trình nhận phòng 5 sao.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Award className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Chủ nhà xuất sắc (Superhost)</h3>
                <p className="text-xs text-muted-foreground">
                  Chủ nhà giàu kinh nghiệm, phản hồi {property.host.responseRate} trong {property.host.responseTime}.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Miễn phí hủy trong 48 giờ</h3>
                <p className="text-xs text-muted-foreground">
                  Hoàn tiền 100% nếu hủy trước ngày nhận phòng ít nhất 48 tiếng.
                </p>
              </div>
            </div>
          </div>

          {/* About this place (Mô tả chi tiết) */}
          <div className="border-b border-border pb-6">
            <h2 className="text-lg font-bold text-foreground mb-3">
              Mô tả chi tiết (About this place)
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities Grid (Tiện nghi) */}
          <div className="border-b border-border pb-6">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Nơi này có những gì cho bạn? (Tiện nghi)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {property.amenities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-foreground">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location Info */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-2">
              Vị trí chỗ ở
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {property.address}
            </p>
            <div className="relative aspect-[16/7] w-full overflow-hidden rounded-2xl border border-border bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <div className="text-center p-6">
                <MapPin className="size-8 text-primary mx-auto mb-2 animate-bounce" />
                <p className="text-sm font-semibold text-foreground">{property.city}</p>
                <p className="text-xs text-muted-foreground">Bản đồ vị trí chính xác sẽ hiển thị sau khi hoàn tất đặt phòng</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking Card (Matching Figure 5.12 & Table 5.8) */}
        <div className="lg:col-span-1">
          <div className="sticky top-[100px] rounded-3xl border border-border bg-card p-6 shadow-xl space-y-5">
            {/* Price Header */}
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-foreground">
                  {property.pricePerNight.toLocaleString("vi-VN")}₫
                </span>
                <span className="text-xs text-muted-foreground"> / đêm</span>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
                <Star className="size-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                <span>{property.rating.toFixed(2)}</span>
                <span className="text-muted-foreground">({property.reviewCount})</span>
              </div>
            </div>

            {/* Date & Guest Input Box */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
              {/* Checkin / Checkout */}
              <div className="grid grid-cols-2 divide-x divide-border">
                <div className="p-3">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Nhận phòng
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="mt-1 w-full bg-transparent text-xs font-semibold text-foreground outline-hidden cursor-pointer"
                  />
                </div>

                <div className="p-3">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Trả phòng
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="mt-1 w-full bg-transparent text-xs font-semibold text-foreground outline-hidden cursor-pointer"
                  />
                </div>
              </div>

              {/* Guest Selector */}
              <div className="p-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Khách lưu trú
                </label>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">{guests} khách</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={guests <= 1}
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="flex size-6 items-center justify-center rounded-full border border-border text-xs hover:bg-muted disabled:opacity-40"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      disabled={guests >= property.maxGuests}
                      onClick={() => setGuests((g) => Math.min(property.maxGuests, g + 1))}
                      className="flex size-6 items-center justify-center rounded-full border border-border text-xs hover:bg-muted disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Reserve Button (Action) */}
            <Button
              onClick={handleReserve}
              size="lg"
              className="w-full rounded-2xl bg-primary text-primary-foreground font-bold shadow-md hover:opacity-95 text-base py-6 cursor-pointer"
            >
              Đặt phòng ngay (Reserve)
            </Button>

            <p className="text-center text-[11px] text-muted-foreground">
              Bạn vẫn chưa bị trừ tiền ở bước này
            </p>

            {/* Price Breakdown */}
            <div className="space-y-2.5 pt-3 border-t border-border text-xs">
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
                <span>Phí dịch vụ StayHub</span>
                <span className="text-foreground font-medium">
                  {property.serviceFee.toLocaleString("vi-VN")}₫
                </span>
              </div>

              <div className="flex justify-between border-t border-border pt-3 text-sm font-bold text-foreground">
                <span>Tổng trước thuế</span>
                <span>{totalPrice.toLocaleString("vi-VN")}₫</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
