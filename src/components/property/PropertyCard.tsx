"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Property } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [activeImageIdx, setActiveImageIdx] = React.useState(0);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        className
      )}
    >
      {/* 1. Image Container with Carousel Dots & Favorite Button */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Link href={`/properties/${property.id}`} className="block size-full">
          <Image
            src={property.images[activeImageIdx] || property.images[0]}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />
        </Link>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={toggleFavorite}
          aria-label={isFavorite ? "Bỏ lưu yêu thích" : "Lưu vào yêu thích"}
          className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-black/25 backdrop-blur-md transition-all hover:scale-110 active:scale-95"
        >
          <Heart
            className={cn(
              "size-5 transition-colors",
              isFavorite
                ? "fill-[#ff4d4d] text-[#ff4d4d]"
                : "text-white fill-none stroke-[2]"
            )}
          />
        </button>

        {/* Superhost Badge */}
        {property.isSuperhost && (
          <div className="absolute left-3 top-3 z-10">
            <Badge
              variant="secondary"
              className="bg-card/90 font-semibold text-foreground backdrop-blur-md shadow-xs text-xs"
            >
              Superhost
            </Badge>
          </div>
        )}

        {/* Carousel Image Indicator Dots */}
        {property.images.length > 1 && (
          <div className="absolute bottom-2.5 inset-x-0 z-10 flex justify-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
            {property.images.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveImageIdx(idx);
                }}
                aria-label={`Xem ảnh ${idx + 1}`}
                className={cn(
                  "size-1.5 rounded-full transition-all",
                  activeImageIdx === idx
                    ? "w-4 bg-white"
                    : "bg-white/60 hover:bg-white"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. Property Metadata */}
      <Link href={`/properties/${property.id}`} className="flex flex-1 flex-col p-4">
        {/* City and Rating */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {property.city} · {property.propertyTypeName}
          </p>
          <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
            <Star className="size-3.5 fill-[#f59e0b] text-[#f59e0b]" />
            <span>{property.rating.toFixed(2)}</span>
            <span className="text-muted-foreground">({property.reviewCount})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-1.5 line-clamp-1 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
          {property.title}
        </h3>

        {/* Room Specs */}
        <p className="mt-1 text-xs text-muted-foreground">
          {property.maxGuests} khách · {property.bedrooms} phòng ngủ · {property.bathrooms} phòng tắm
        </p>

        {/* Price & Night */}
        <div className="mt-4 flex items-baseline justify-between border-t border-border pt-3">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-foreground">
              {property.pricePerNight.toLocaleString("vi-VN")}₫
            </span>
            <span className="text-xs text-muted-foreground">/ đêm</span>
          </div>

          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            Miễn phí hủy trong 48h
          </span>
        </div>
      </Link>
    </div>
  );
}
