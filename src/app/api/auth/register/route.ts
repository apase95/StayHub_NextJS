import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { fail, ok } from "@/lib/api-response";
import { sendOtpEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/schemas/auth.schema";

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json(fail("Dữ liệu không hợp lệ"), { status: 400 });

  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return NextResponse.json(fail("Email đã tồn tại", "ERR_EMAIL_EXISTS"), { status: 409 });

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      fullName: parsed.data.fullName,
      passwordHash: await bcrypt.hash(parsed.data.password, 10),
      tokens: {
        create: {
          otpHash: await bcrypt.hash(otp, 10),
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      },
    },
    select: { id: true, email: true, fullName: true, role: true },
  });

  await sendOtpEmail(user.email, otp);

  return NextResponse.json(ok(user, "Đăng ký thành công"), { status: 201 });
}
