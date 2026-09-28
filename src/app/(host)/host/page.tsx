"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Calendar,
  MessageSquare,
  DollarSign,
  PlusCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  LayoutDashboard,
  Check,
  X,
  Home,
} from "lucide-react";
import { MOCK_HOST_KPIS, MOCK_HOST_BOOKING_REQUESTS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HostDashboardPage() {
  const [activeMenu, setActiveMenu] = React.useState<"dashboard" | "properties" | "requests" | "messages" | "revenue">("dashboard");
  const [requests, setRequests] = React.useState(MOCK_HOST_BOOKING_REQUESTS);
  const [notification, setNotification] = React.useState<string | null>(null);

  const handleAction = (id: string, action: "ACCEPT" | "DECLINE") => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? { ...req, status: action === "ACCEPT" ? "CONFIRMED" : "DECLINED" }
          : req
      )
    );
    setNotification(
      action === "ACCEPT"
        ? `Đã phê duyệt yêu cầu đặt phòng ${id} thành công!`
        : `Đã từ chối yêu cầu đặt phòng ${id}.`
    );
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="flex min-h-[calc(100vh-72px)] bg-muted/20">
      {/* 1. Host Left Sidebar (Figure 5.21 & Table 5.14) */}
      <aside className="w-64 shrink-0 border-r border-border bg-card p-6 hidden md:flex md:flex-col justify-between">
        <div className="space-y-6">
          {/* Host Profile Header (Table 5.14 - Item 8) */}
          <div className="flex items-center gap-3 pb-6 border-b border-border">
            <div className="relative size-11 overflow-hidden rounded-full border border-primary/20 bg-muted">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Host Avatar"
                fill
                className="size-full object-cover"
              />
            </div>
            <div className="flex-1 overflow-hidden">
              <h2 className="text-sm font-bold text-foreground truncate">Thái Duy & Đức Anh</h2>
              <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary font-bold">
                Superhost
              </Badge>
            </div>
          </div>

          {/* Add New Listing Button (Table 5.14 - Item 2) */}
          <Button
            onClick={() => setNotification("Mở biểu mẫu khởi tạo tin đăng mới (Add New Listing)...")}
            className="w-full rounded-2xl bg-primary text-primary-foreground font-bold shadow-sm hover:opacity-95"
          >
            <PlusCircle className="size-4 mr-2" />
            Thêm chỗ ở mới
          </Button>

          {/* Navigation Links (Table 5.14 - Items 3,4,5,6,7) */}
          <nav className="space-y-1.5 text-xs font-semibold">
            {[
              { id: "dashboard", label: "Tổng quan (Dashboard)", icon: LayoutDashboard },
              { id: "properties", label: "Danh sách chỗ ở (My Properties)", icon: Building2 },
              { id: "requests", label: "Yêu cầu đặt phòng (Requests)", icon: Calendar },
              { id: "messages", label: "Tin nhắn với khách (Messages)", icon: MessageSquare },
              { id: "revenue", label: "Báo cáo doanh thu (Revenue)", icon: DollarSign },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id as typeof activeMenu)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all text-left ${
                    isActive
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Link */}
        <div className="pt-6 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="size-4" />
            <span>Quay về trang chủ StayHub</span>
          </Link>
        </div>
      </aside>

      {/* 2. Main Dashboard Content (Table 5.14 - Items 1, 9, 10) */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 space-y-8 overflow-y-auto">
        {/* Notification Toast */}
        {notification && (
          <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-xs font-bold text-primary flex items-center justify-between animate-in fade-in-0 slide-in-from-top-2">
            <span>{notification}</span>
            <button onClick={() => setNotification(null)}>
              <X className="size-4" />
            </button>
          </div>
        )}

        {/* Dashboard Title Header (Table 5.14 - Item 1) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Bảng điều khiển Chủ nhà (Host Dashboard)
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Theo dõi tình hình kinh doanh, công suất phòng và các đơn đặt chỗ mới nhất
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => setNotification("Đang chuẩn bị file báo cáo tài chính tháng...")}
            className="rounded-2xl text-xs font-bold shrink-0"
          >
            <FileSpreadsheet className="size-4 mr-2 text-emerald-600" />
            Xuất báo cáo (Export Report)
          </Button>
        </div>

        {/* KPI Cards Grid (Table 5.14 - Item 9) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Tổng chỗ ở
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                <Building2 className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-black text-foreground">
              {MOCK_HOST_KPIS.totalProperties}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Tất cả đang hoạt động tốt</p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Chờ duyệt
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Clock className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-black text-amber-600">
              {MOCK_HOST_KPIS.pendingRequests}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Cần phản hồi trong 24h</p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Đã xác nhận
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-black text-emerald-600">
              {MOCK_HOST_KPIS.confirmedBookings}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Lượt khách trong tháng</p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Doanh thu tháng
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <TrendingUp className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-2xl font-black text-primary">
              {MOCK_HOST_KPIS.monthlyRevenue.toLocaleString("vi-VN")}₫
            </p>
            <p className="mt-1 text-xs text-emerald-600 font-semibold">+18.5% so với tháng trước</p>
          </div>
        </div>

        {/* Recent Booking Requests Table (Table 5.14 - Item 10) */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Yêu cầu đặt phòng gần đây (Recent Booking Requests)
              </h2>
              <p className="text-xs text-muted-foreground">
                Duyệt hoặc từ chối yêu cầu từ khách lưu trú để xác nhận giữ chỗ
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5 font-bold">Khách thuê</th>
                  <th className="p-3.5 font-bold">Chỗ ở</th>
                  <th className="p-3.5 font-bold">Thời gian</th>
                  <th className="p-3.5 font-bold">Khách</th>
                  <th className="p-3.5 font-bold">Tổng tiền</th>
                  <th className="p-3.5 font-bold text-center">Trạng thái</th>
                  <th className="p-3.5 font-bold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3.5 font-semibold text-foreground">
                      <div className="flex items-center gap-2.5">
                        <div className="relative size-8 rounded-full overflow-hidden bg-muted">
                          <Image
                            src={req.guestAvatar}
                            alt={req.guestName}
                            fill
                            className="size-full object-cover"
                          />
                        </div>
                        <span>{req.guestName}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-medium text-foreground max-w-[200px] truncate">
                      {req.propertyTitle}
                    </td>
                    <td className="p-3.5 text-muted-foreground whitespace-nowrap">
                      {req.dates}
                    </td>
                    <td className="p-3.5 text-muted-foreground">
                      {req.guests} khách
                    </td>
                    <td className="p-3.5 font-bold text-foreground whitespace-nowrap">
                      {req.totalAmount.toLocaleString("vi-VN")}₫
                    </td>
                    <td className="p-3.5 text-center whitespace-nowrap">
                      {req.status === "PENDING" && (
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] font-bold">
                          Chờ duyệt
                        </Badge>
                      )}
                      {req.status === "CONFIRMED" && (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-bold">
                          Đã duyệt
                        </Badge>
                      )}
                      {req.status === "DECLINED" && (
                        <Badge variant="destructive" className="text-[10px] font-bold">
                          Đã từ chối
                        </Badge>
                      )}
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      {req.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            onClick={() => handleAction(req.id, "ACCEPT")}
                            className="h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-2.5"
                          >
                            <Check className="size-3.5 mr-1" />
                            Duyệt
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction(req.id, "DECLINE")}
                            className="h-8 rounded-xl text-destructive hover:bg-destructive/10 font-bold text-xs px-2.5"
                          >
                            <X className="size-3.5 mr-1" />
                            Từ chối
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-[11px] italic">Đã xử lý</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
