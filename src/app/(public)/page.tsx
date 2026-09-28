import Link from "next/link";
import { Search, Shield, Building2, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-semibold text-primary shadow-xs">
          <Sparkles className="size-3.5" />
          <span>Nền tảng đặt phòng Homestay thế hệ mới</span>
        </div>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
          Trải nghiệm kỳ nghỉ hoàn hảo cùng{" "}
          <span className="text-primary">StayHub</span>
        </h1>

        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Khám phá hàng nghìn homestay, căn hộ nghỉ dưỡng và biệt thự sang trọng
          trên khắp Việt Nam với giá tốt nhất và thanh toán an toàn qua VNPay.
        </p>

        {/* Quick Action Links */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-full px-6 shadow-sm">
            <Link href="/search">
              <Search className="mr-2 size-4" />
              Khám phá chỗ ở
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-6"
          >
            <Link href="/host">
              <Building2 className="mr-2 size-4" />
              Trở thành Chủ nhà
            </Link>
          </Button>
        </div>
      </section>

      {/* Feature Pillars Preview */}
      <section className="mx-auto mt-16 grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-card border border-border bg-card p-6 shadow-xs">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Search className="size-5" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">
            Tìm kiếm linh hoạt
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Lọc theo địa điểm, khoảng ngày, mức giá và tiện nghi yêu thích.
          </p>
        </div>

        <div className="rounded-card border border-border bg-card p-6 shadow-xs">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Calendar className="size-5" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">
            Đặt phòng tức thì
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Kiểm tra phòng trống theo thời gian thực và thanh toán VNPay tiện
            lợi.
          </p>
        </div>

        <div className="rounded-card border border-border bg-card p-6 shadow-xs">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="size-5" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">
            Dành cho Chủ nhà
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Dễ dàng đăng tin, quản lý lịch đặt và tối ưu doanh thu thông minh.
          </p>
        </div>

        <div className="rounded-card border border-border bg-card p-6 shadow-xs">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Shield className="size-5" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">
            An tâm & Bảo mật
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Xác thực người dùng, bảo mật thanh toán và hỗ trợ đồng hành 24/7.
          </p>
        </div>
      </section>
    </div>
  );
}
