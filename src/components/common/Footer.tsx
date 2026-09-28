import Link from "next/link";
import { Globe, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card text-foreground">
      {/* Main Links Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Column 1: Về StayHub */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Về StayHub
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors"
                >
                  Giới thiệu StayHub
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors"
                >
                  Cơ hội nghề nghiệp
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors"
                >
                  Tin tức & Báo chí
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors"
                >
                  Tính năng mới
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors"
                >
                  Nhà đầu tư
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Khám phá điểm đến */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Khám phá</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/search?location=Đà Nẵng"
                  className="hover:text-foreground transition-colors"
                >
                  Homestay tại Đà Nẵng
                </Link>
              </li>
              <li>
                <Link
                  href="/search?location=Hà Nội"
                  className="hover:text-foreground transition-colors"
                >
                  Căn hộ tại Hà Nội
                </Link>
              </li>
              <li>
                <Link
                  href="/search?location=Đà Lạt"
                  className="hover:text-foreground transition-colors"
                >
                  Villa nghỉ dưỡng Đà Lạt
                </Link>
              </li>
              <li>
                <Link
                  href="/search?location=Phú Quốc"
                  className="hover:text-foreground transition-colors"
                >
                  Biệt thự biển Phú Quốc
                </Link>
              </li>
              <li>
                <Link
                  href="/search?location=Hồ Chí Minh"
                  className="hover:text-foreground transition-colors"
                >
                  Căn hộ TP. Hồ Chí Minh
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Đón tiếp khách (Hosting) */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Đón tiếp khách
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/host"
                  className="hover:text-foreground transition-colors"
                >
                  Cho thuê chỗ ở trên StayHub
                </Link>
              </li>
              <li>
                <Link
                  href="/host"
                  className="hover:text-foreground transition-colors"
                >
                  StayCover bảo vệ Chủ nhà
                </Link>
              </li>
              <li>
                <Link
                  href="/host"
                  className="hover:text-foreground transition-colors"
                >
                  Tài nguyên đón tiếp khách
                </Link>
              </li>
              <li>
                <Link
                  href="/host"
                  className="hover:text-foreground transition-colors"
                >
                  Diễn đàn cộng đồng
                </Link>
              </li>
              <li>
                <Link
                  href="/host"
                  className="hover:text-foreground transition-colors"
                >
                  Tiêu chuẩn chỗ ở an toàn
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Hỗ trợ & Trợ năng */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Hỗ trợ</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors"
                >
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors"
                >
                  Hỗ trợ người khuyết tật
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors"
                >
                  Các tùy chọn hủy phòng
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors"
                >
                  Biện pháp ứng phó sự cố
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors"
                >
                  Báo cáo quan ngại khu dân cư
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Settings */}
        <div className="mt-12 border-t border-border pt-8 flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:justify-start">
            <span>© 2026 StayHub, Inc.</span>
            <span>·</span>
            <Link href="/" className="hover:underline">
              Quyền riêng tư
            </Link>
            <span>·</span>
            <Link href="/" className="hover:underline">
              Điều khoản
            </Link>
            <span>·</span>
            <Link href="/" className="hover:underline">
              Sơ đồ trang web
            </Link>
            <span>·</span>
            <Link href="/" className="hover:underline">
              Thông tin công ty
            </Link>
          </div>

          <div className="flex items-center gap-6 font-medium text-foreground">
            <button
              type="button"
              className="flex items-center gap-1.5 hover:underline"
            >
              <Globe className="size-4" />
              <span>Tiếng Việt (VN)</span>
            </button>
            <button type="button" className="hover:underline">
              <span>₫ VND</span>
            </button>
            <span className="flex items-center gap-1 text-muted-foreground text-[11px]">
              Made with <Heart className="size-3 text-primary fill-primary" />{" "}
              by StayHub Team
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
