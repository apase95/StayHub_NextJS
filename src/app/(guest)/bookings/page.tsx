"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Eye,
  ArrowRight,
  X,
} from "lucide-react";
import { MOCK_USER_BOOKINGS, Booking } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BookingsPage() {
  const [activeTab, setActiveTab] = React.useState<"UPCOMING" | "PENDING" | "COMPLETED" | "CANCELLED">("UPCOMING");
  const [bookings, setBookings] = React.useState<Booking[]>(MOCK_USER_BOOKINGS);
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null);
  const [cancelModalBooking, setCancelModalBooking] = React.useState<Booking | null>(null);

  // Filter bookings by active tab
  const filteredBookings = bookings.filter((b) => b.status === activeTab);

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, status: "CANCELLED", paymentStatus: "REFUNDED" }
          : b
      )
    );
    setCancelModalBooking(null);
  };

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "UPCOMING":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold">
            <CheckCircle2 className="size-3 mr-1" />
            Sắp tới (Upcoming)
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold">
            <Clock className="size-3 mr-1" />
            Chờ duyệt (Pending)
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="secondary" className="font-bold">
            <CheckCircle2 className="size-3 mr-1" />
            Đã hoàn thành (Completed)
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="destructive" className="font-bold">
            <XCircle className="size-3 mr-1" />
            Đã hủy (Cancelled)
          </Badge>
        );
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* 1. Page Header (Table 5.12 - Item 1) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Chuyến đi của tôi (My Trips)
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quản lý và theo dõi lịch trình các đơn đặt phòng của bạn theo thời gian thực
          </p>
        </div>

        <Button asChild variant="outline" className="rounded-full">
          <Link href="/search" className="flex items-center gap-1.5 font-semibold">
            <span>Tìm kiếm kỳ nghỉ mới</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      {/* 2. 4 Status Tabs: Upcoming - Pending - Completed - Cancelled (Table 5.12 - Item 2) */}
      <div className="mt-6 flex overflow-x-auto gap-2 border-b border-border pb-px">
        {[
          { id: "UPCOMING", label: "Sắp tới (Upcoming)" },
          { id: "PENDING", label: "Chờ xác nhận (Pending)" },
          { id: "COMPLETED", label: "Đã hoàn thành (Completed)" },
          { id: "CANCELLED", label: "Đã hủy (Cancelled)" },
        ].map((tab) => {
          const count = bookings.filter((b) => b.status === tab.id).length;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`flex size-5 items-center justify-center rounded-full text-[11px] ${
                  isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Booking Cards List (Figure 5.18 & Table 5.12) */}
      <div className="mt-8 space-y-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col md:flex-row overflow-hidden rounded-3xl border border-border bg-card shadow-xs transition-all hover:shadow-md"
            >
              {/* Thumbnail Image (Table 5.12 - Item 3) */}
              <div className="relative md:w-80 h-52 md:h-auto shrink-0 bg-muted">
                <Image
                  src={booking.propertyImage}
                  alt={booking.propertyTitle}
                  fill
                  className="size-full object-cover"
                />
              </div>

              {/* Booking Information (Table 5.12 - Item 4) */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Mã đặt chỗ: {booking.id}
                    </span>
                    {getStatusBadge(booking.status)}
                  </div>

                  <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors">
                    <Link href={`/properties/${booking.propertyId}`}>
                      {booking.propertyTitle}
                    </Link>
                  </h3>

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-4 text-primary shrink-0" />
                    <span>{booking.propertyAddress}</span>
                  </div>

                  {/* Dates & Guests */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 border-t border-border text-xs">
                    <div>
                      <p className="text-muted-foreground">Nhận phòng</p>
                      <p className="font-bold text-foreground mt-0.5">{booking.checkIn}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Trả phòng</p>
                      <p className="font-bold text-foreground mt-0.5">{booking.checkOut}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Số khách</p>
                      <p className="font-bold text-foreground mt-0.5">{booking.guests} khách ({booking.nights} đêm)</p>
                    </div>
                  </div>
                </div>

                {/* Total & Action Buttons (Table 5.12 - Item 5) */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
                  <div>
                    <span className="text-xs text-muted-foreground">Tổng tiền thanh toán:</span>
                    <p className="text-xl font-black text-foreground">
                      {booking.totalPrice.toLocaleString("vi-VN")}₫
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Details Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedBooking(booking)}
                      className="rounded-full text-xs font-bold"
                    >
                      <Eye className="size-4 mr-1.5" />
                      Chi tiết (View Detail)
                    </Button>

                    {/* Cancel Booking Button (Only for UPCOMING or PENDING) */}
                    {(booking.status === "UPCOMING" || booking.status === "PENDING") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCancelModalBooking(booking)}
                        className="rounded-full text-xs font-bold text-destructive hover:bg-destructive/10"
                      >
                        Hủy đặt phòng
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border p-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Calendar className="size-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-foreground">
              Không có chuyến đi nào trong mục này
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Bạn chưa có đơn đặt phòng nào ở trạng thái này. Hãy khám phá các chỗ ở tuyệt vời trên StayHub!
            </p>
            <Button asChild className="mt-6 rounded-full font-bold">
              <Link href="/search">Khám phá ngay</Link>
            </Button>
          </div>
        )}
      </div>

      {/* 4. Detail Modal Popup */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in-0">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-lg font-bold text-foreground">Chi tiết đơn đặt phòng</h3>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-full p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4 py-4 text-xs">
              <div className="rounded-2xl bg-muted/40 p-3.5 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã đơn đặt phòng:</span>
                  <span className="font-bold text-foreground">{selectedBooking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <span>{getStatusBadge(selectedBooking.status)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chủ nhà hỗ trợ:</span>
                  <span className="font-semibold text-foreground">{selectedBooking.hostName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày đặt vé:</span>
                  <span className="font-semibold text-foreground">{selectedBooking.createdAt}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-1">Chỗ ở lưu trú</h4>
                <p className="font-semibold text-sm text-primary">{selectedBooking.propertyTitle}</p>
                <p className="text-muted-foreground mt-0.5">{selectedBooking.propertyAddress}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                <div>
                  <span className="text-muted-foreground">Check-in:</span>
                  <p className="font-bold text-sm text-foreground">{selectedBooking.checkIn} (sau 14:00)</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Check-out:</span>
                  <p className="font-bold text-sm text-foreground">{selectedBooking.checkOut} (trước 12:00)</p>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex justify-between items-center text-sm font-bold">
                <span>Tổng chi phí:</span>
                <span className="text-lg text-primary">{selectedBooking.totalPrice.toLocaleString("vi-VN")}₫</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <Button onClick={() => setSelectedBooking(null)} className="rounded-xl">
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Cancel Confirmation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in-0">
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertCircle className="size-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground">Xác nhận hủy đặt phòng?</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Bạn có chắc chắn muốn hủy đơn đặt phòng <span className="font-bold text-foreground">{cancelModalBooking.id}</span> tại <span className="font-bold text-foreground">{cancelModalBooking.propertyTitle}</span>? Số tiền sẽ được hoàn trả tự động theo chính sách hoàn tiền trong 48h.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setCancelModalBooking(null)}
                className="rounded-xl"
              >
                Giữ lại phòng
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleCancelBooking(cancelModalBooking.id)}
                className="rounded-xl font-bold"
              >
                Xác nhận hủy
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
