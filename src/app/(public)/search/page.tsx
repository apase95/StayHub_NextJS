import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border p-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Search className="size-6" />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
          Trang Tìm kiếm Chỗ ở
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Giao diện tìm kiếm với bộ lọc đa tiêu chí (địa điểm, ngày nhận/trả
          phòng, số lượng khách, mức giá và tiện nghi) đang được phát triển theo
          kế hoạch.
        </p>
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href="/">Quay về Trang chủ</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
