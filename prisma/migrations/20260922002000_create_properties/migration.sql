CREATE TYPE "PropertyType" AS ENUM ('APARTMENT', 'HOUSE', 'VILLA', 'HOTEL_ROOM', 'HOMESTAY', 'RESORT');
CREATE TYPE "PropertyStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DRAFT');

CREATE TABLE "properties" (
  "id" TEXT NOT NULL,
  "host_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "property_type" "PropertyType" NOT NULL,
  "city" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "price_per_night" DECIMAL(12,2) NOT NULL,
  "cleaning_fee" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "max_guests" INTEGER NOT NULL,
  "bedrooms" INTEGER NOT NULL,
  "beds" INTEGER NOT NULL,
  "bathrooms" INTEGER NOT NULL,
  "rating_avg" DECIMAL(3,2) NOT NULL DEFAULT 0,
  "status" "PropertyStatus" NOT NULL DEFAULT 'DRAFT',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "property_images" (
  "id" TEXT NOT NULL,
  "property_id" TEXT NOT NULL,
  "image_url" TEXT NOT NULL,
  "public_id" TEXT,
  "display_order" INTEGER NOT NULL,
  "is_cover" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "property_images_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "amenities" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "icon" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "amenities_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "property_amenities" (
  "property_id" TEXT NOT NULL,
  "amenity_id" TEXT NOT NULL,

  CONSTRAINT "property_amenities_pkey" PRIMARY KEY ("property_id", "amenity_id")
);

CREATE INDEX "properties_host_id_idx" ON "properties"("host_id");
CREATE INDEX "properties_city_status_idx" ON "properties"("city", "status");
CREATE INDEX "property_images_property_id_idx" ON "property_images"("property_id");
CREATE UNIQUE INDEX "property_images_property_id_display_order_key" ON "property_images"("property_id", "display_order");
CREATE UNIQUE INDEX "property_images_one_cover_per_property" ON "property_images"("property_id") WHERE "is_cover" = true;
CREATE UNIQUE INDEX "amenities_name_key" ON "amenities"("name");

ALTER TABLE "properties" ADD CONSTRAINT "properties_host_id_fkey"
  FOREIGN KEY ("host_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "property_images" ADD CONSTRAINT "property_images_property_id_fkey"
  FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "property_amenities" ADD CONSTRAINT "property_amenities_property_id_fkey"
  FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "property_amenities" ADD CONSTRAINT "property_amenities_amenity_id_fkey"
  FOREIGN KEY ("amenity_id") REFERENCES "amenities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
