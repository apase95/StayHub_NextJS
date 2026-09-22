CREATE TYPE "UserRole" AS ENUM ('GUEST', 'HOST', 'ADMIN');
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'LOCKED');
CREATE TYPE "UserLoginProvider" AS ENUM ('LOCAL', 'GOOGLE');

CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password_hash" TEXT,
  "full_name" TEXT NOT NULL,
  "phone" TEXT,
  "role" "UserRole" NOT NULL DEFAULT 'GUEST',
  "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
  "provider" "UserLoginProvider" NOT NULL DEFAULT 'LOCAL',
  "email_verified" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
