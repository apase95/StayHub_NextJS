"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  Calendar,
  DollarSign,
  Download,
  FileBarChart,
  LayoutDashboard,
  Home,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { MOCK_ADMIN_KPIS, MOCK_ADMIN_RECENT_BOOKINGS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = React.useState<"dashboard" | "users" | "hosts" | "bookings" | "reports">("dashboard");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const filteredBookings = MOCK_ADMIN_RECENT_BOOKINGS.filter(
    (b) =>
      b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    setToastMessage("Đang trích xuất toàn bộ dữ liệu giao dịch ra file Excel (.xlsx)...");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGenerate = () => {
    setToastMessage("Đang tạo báo cáo doanh thu tài chính định kỳ theo chu kỳ tháng...");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex min-h-[calc(100vh-72px)] bg-muted/20">
      {/* 1. Admin Left Sidebar (Figure 5.24 & Table 5.16) */}
      <aside className="w-64 shrink-0 border-r border-border bg-card p-6 hidden md:flex md:flex-col justify-between">
        <div className="space-y-6">
          {/* Admin Profile (Table 5.16 - Item 7) */}
          <div className="flex items-center gap-3 pb-6 border-b border-border">
            <div className="flex size-11 items-center justify-center rounded-full bg-slate-900 text-white font-black text-sm">
              AD
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Hồ Đặng Thái Duy</h2>
              <Badge className="bg-red-500/10 text-red-600 border-red-500/20 text-[10px] font-bold">
                Super Admin
              </Badge>
            </div>
          </div>

          {/* Navigation Links (Table 5.16 - Items 2,3,4,5,6) */}
          <nav className="space-y-1.5 text-xs font-semibold">
            {[
              { id: "dashboard", label: "Tổng quan nền tảng", icon: LayoutDashboard },
              { id: "users", label: "Quản lý Người dùng", icon: Users },
              { id: "hosts", label: "Quản lý Đối tác Chủ nhà", icon: Building2 },
              { id: "bookings", label: "Quản lý Đơn đặt phòng", icon: Calendar },
              { id: "reports", label: "Báo cáo & Hoa hồng", icon: DollarSign },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as typeof activeTab)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all text-left ${
                    isActive
                      ? "bg-slate-900 text-white font-bold shadow-xs dark:bg-primary dark:text-primary-foreground"
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
            <span>Về trang chủ StayHub</span>
          </Link>
        </div>
      </aside>

      {/* 2. Main Admin Dashboard Content (Table 5.16 - Items 1, 8, 9, 10, 11, 12) */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 space-y-8 overflow-y-auto">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-xs font-bold text-blue-600 animate-in fade-in-0">
            {toastMessage}
          </div>
        )}

        {/* Header Platform Overview (Table 5.16 - Item 1) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Bảng điều khiển Quản trị (Admin Dashboard)
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Góc nhìn toàn cảnh hệ sinh thái StayHub: Giám sát tài khoản, doanh số và hoa hồng sàn
            </p>
          </div>

          {/* Action Buttons: Export & Generate Report (Table 5.16 - Items 8, 9) */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="rounded-xl text-xs font-bold"
            >
              <Download className="size-4 mr-1.5 text-blue-600" />
              Xuất dữ liệu (Export)
            </Button>
            <Button
              size="sm"
              onClick={handleGenerate}
              className="rounded-xl bg-slate-900 text-white dark:bg-primary font-bold text-xs"
            >
              <FileBarChart className="size-4 mr-1.5" />
              Tạo báo cáo (Generate)
            </Button>
          </div>
        </div>

        {/* 4 Macro KPI Cards (Table 5.16 - Item 10) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Tổng người dùng
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                <Users className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-black text-foreground">
              {MOCK_ADMIN_KPIS.totalUsers.toLocaleString("vi-VN")}
            </p>
            <p className="mt-1 text-xs text-emerald-600 font-semibold">+124 người dùng mới hôm nay</p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Chủ nhà tích cực
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Building2 className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-black text-emerald-600">
              {MOCK_ADMIN_KPIS.activeHosts.toLocaleString("vi-VN")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">94.2% tỷ lệ phòng sẵn sàng</p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Doanh thu toàn sàn
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <DollarSign className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-2xl font-black text-primary">
              {MOCK_ADMIN_KPIS.platformRevenue.toLocaleString("vi-VN")}₫
            </p>
            <p className="mt-1 text-xs text-emerald-600 font-semibold">Hoa hồng sàn: ~15.680.000₫</p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Tổng đơn đặt phòng
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Calendar className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-black text-foreground">
              {MOCK_ADMIN_KPIS.totalBookings.toLocaleString("vi-VN")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Tỷ lệ hoàn tất 96.8%</p>
          </div>
        </div>

        {/* Recent Platform Bookings Table (Table 5.16 - Item 11) */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Giao dịch đặt phòng toàn hệ thống (Recent Bookings)
              </h2>
              <p className="text-xs text-muted-foreground">
                Danh sách các giao dịch phát sinh trên toàn bộ nền tảng StayHub
              </p>
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm mã đơn, tên khách..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/40 py-2 pl-9 pr-3 text-xs outline-hidden focus:border-primary"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5 font-bold">Mã Booking</th>
                  <th className="p-3.5 font-bold">Khách thuê</th>
                  <th className="p-3.5 font-bold">Chủ nhà</th>
                  <th className="p-3.5 font-bold">Chỗ ở</th>
                  <th className="p-3.5 font-bold">Thời gian</th>
                  <th className="p-3.5 font-bold">Tổng tiền</th>
                  <th className="p-3.5 font-bold">Hoa hồng (10%)</th>
                  <th className="p-3.5 font-bold text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3.5 font-bold text-primary">{b.id}</td>
                    <td className="p-3.5 font-semibold text-foreground">{b.guestName}</td>
                    <td className="p-3.5 text-muted-foreground">{b.hostName}</td>
                    <td className="p-3.5 font-medium text-foreground max-w-[200px] truncate">
                      {b.propertyName}
                    </td>
                    <td className="p-3.5 text-muted-foreground whitespace-nowrap">{b.dates}</td>
                    <td className="p-3.5 font-bold text-foreground whitespace-nowrap">
                      {b.amount.toLocaleString("vi-VN")}₫
                    </td>
                    <td className="p-3.5 font-bold text-emerald-600 whitespace-nowrap">
                      +{b.commission.toLocaleString("vi-VN")}₫
                    </td>
                    <td className="p-3.5 text-center whitespace-nowrap">
                      {b.status === "CONFIRMED" && (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-bold">
                          Đã thanh toán
                        </Badge>
                      )}
                      {b.status === "PENDING" && (
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] font-bold">
                          Chờ duyệt
                        </Badge>
                      )}
                      {b.status === "CANCELLED" && (
                        <Badge variant="destructive" className="text-[10px] font-bold">
                          Đã hủy
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination (Table 5.16 - Item 12) */}
          <div className="flex items-center justify-between pt-4 border-t border-border text-xs">
            <span className="text-muted-foreground">
              Hiển thị {filteredBookings.length} trên tổng số {MOCK_ADMIN_KPIS.totalBookings} đơn
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="size-8 p-0 rounded-xl"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="font-bold text-foreground">Trang {page} / 12</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                className="size-8 p-0 rounded-xl"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
