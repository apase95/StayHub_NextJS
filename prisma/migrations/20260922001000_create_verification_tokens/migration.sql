CREATE TABLE "verification_tokens" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "otp_hash" TEXT NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "used_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "verification_tokens_user_id_idx" ON "verification_tokens"("user_id");

ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
