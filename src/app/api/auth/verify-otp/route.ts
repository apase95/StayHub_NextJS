import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { fail, ok } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { verifyOtpSchema } from "@/schemas/auth.schema";

export async function POST(request: Request) {
  const parsed = verifyOtpSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json(fail("Dữ liệu không hợp lệ"), { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) return NextResponse.json(fail("Không tìm thấy tài khoản"), { status: 404 });

  const token = await prisma.verificationToken.findFirst({
    where: { userId: user.id, usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!token || !(await bcrypt.compare(parsed.data.otp, token.otpHash))) {
    return NextResponse.json(fail("OTP không hợp lệ", "ERR_INVALID_OTP"), { status: 400 });
  }

  await prisma.$transaction([
    prisma.verificationToken.update({ where: { id: token.id }, data: { usedAt: new Date() } }),
    prisma.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } }),
  ]);

  return NextResponse.json(ok(null, "Xác minh email thành công"));
}
