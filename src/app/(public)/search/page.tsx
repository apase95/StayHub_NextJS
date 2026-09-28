"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { FilterToolbar, FilterState } from "@/components/property/FilterToolbar";
import { PropertyCard } from "@/components/property/PropertyCard";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import { Search, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialLocation = searchParams.get("location") || "";

  const [filters, setFilters] = React.useState<FilterState>({
    priceRange: [0, 5000000],
    propertyTypes: [],
    amenities: [],
    sortBy: "recommended",
  });

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 6;

  // Filter properties logic
  const filteredProperties = React.useMemo(() => {
    return MOCK_PROPERTIES.filter((prop) => {
      // 1. Location match
      if (initialLocation && !prop.city.toLowerCase().includes(initialLocation.toLowerCase()) && !prop.title.toLowerCase().includes(initialLocation.toLowerCase())) {
        return false;
      }
      // 2. Price match
      if (prop.pricePerNight < filters.priceRange[0] || prop.pricePerNight > filters.priceRange[1]) {
        return false;
      }
      // 3. Property type match
      if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(prop.propertyType)) {
        return false;
      }
      // 4. Amenities match
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every((a) => prop.amenities.includes(a));
        if (!hasAllAmenities) return false;
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "price_asc") return a.pricePerNight - b.pricePerNight;
      if (filters.sortBy === "price_desc") return b.pricePerNight - a.pricePerNight;
      if (filters.sortBy === "rating") return b.rating - a.rating;
      return 0; // recommended
    });
  }, [initialLocation, filters]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage) || 1;
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleClearAll = () => {
    setFilters({
      priceRange: [0, 5000000],
      propertyTypes: [],
      amenities: [],
      sortBy: "recommended",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Filter Toolbar (Figure 5.9 & Table 5.6) */}
      <FilterToolbar
        totalResults={filteredProperties.length}
        locationName={initialLocation}
        filters={filters}
        onFilterChange={setFilters}
        onClearAll={handleClearAll}
      />

      {/* 2. Listings Grid Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full flex-1">
        {paginatedProperties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="rounded-full"
                >
                  <ChevronLeft className="size-4 mr-1" />
                  Trang trước
                </Button>

                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex size-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                        currentPage === page
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-full"
                >
                  Trang sau
                  <ChevronRight className="size-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Empty Results State */
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border p-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Search className="size-7" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-foreground">
              Không tìm thấy chỗ ở phù hợp
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Hãy thử nới lỏng khoảng giá, bỏ bớt tiện nghi hoặc tìm kiếm với địa điểm khác.
            </p>
            <Button
              onClick={handleClearAll}
              variant="outline"
              className="mt-6 rounded-full"
            >
              <RotateCcw className="size-4 mr-2" />
              Xóa toàn bộ bộ lọc
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm font-semibold text-muted-foreground">
              Đang tải kết quả tìm kiếm...
            </p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </React.Suspense>
  );
}
