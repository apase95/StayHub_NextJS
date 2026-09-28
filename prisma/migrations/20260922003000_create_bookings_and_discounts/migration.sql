CREATE TYPE "BookingStatus" AS ENUM ('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
CREATE TYPE "DiscountType" AS ENUM ('PERCENT', 'FIXED');

CREATE TABLE "discount_codes" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "type" "DiscountType" NOT NULL,
  "value" DECIMAL(12,2) NOT NULL,
  "cap" DECIMAL(12,2),
  "minimum_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "start_date" TIMESTAMP(3),
  "end_date" TIMESTAMP(3),
  "usage_limit" INTEGER,
  "used_count" INTEGER NOT NULL DEFAULT 0,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "discount_codes_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "discount_value_positive" CHECK ("value" > 0),
  CONSTRAINT "discount_used_count_non_negative" CHECK ("used_count" >= 0)
);

CREATE TABLE "bookings" (
  "id" TEXT NOT NULL,
  "property_id" TEXT NOT NULL,
  "guest_id" TEXT NOT NULL,
  "check_in_date" DATE NOT NULL,
  "check_out_date" DATE NOT NULL,
  "guests" INTEGER NOT NULL,
  "nightly_price" DECIMAL(12,2) NOT NULL,
  "cleaning_fee" DECIMAL(12,2) NOT NULL,
  "service_fee" DECIMAL(12,2) NOT NULL,
  "subtotal_price" DECIMAL(12,2) NOT NULL,
  "discount_code_id" TEXT,
  "discount_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "total_price" DECIMAL(12,2) NOT NULL,
  "status" "BookingStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
  "cancelled_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "bookings_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "booking_date_range" CHECK ("check_out_date" > "check_in_date")
);

CREATE UNIQUE INDEX "discount_codes_code_key" ON "discount_codes"("code");
CREATE INDEX "bookings_property_id_check_in_date_check_out_date_idx" ON "bookings"("property_id", "check_in_date", "check_out_date");
CREATE INDEX "bookings_guest_id_idx" ON "bookings"("guest_id");

ALTER TABLE "bookings" ADD CONSTRAINT "bookings_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_discount_code_id_fkey" FOREIGN KEY ("discount_code_id") REFERENCES "discount_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
