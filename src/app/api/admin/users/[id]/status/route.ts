import { NextResponse } from "next/server";
import { z } from "zod";

import { fail, ok } from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const statusSchema = z.object({ status: z.enum(["ACTIVE", "LOCKED"]) });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json(fail("Chưa đăng nhập"), { status: 401 });
  if (session.user.role !== "ADMIN") return NextResponse.json(fail("Không có quyền"), { status: 403 });

  const parsed = statusSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json(fail("Dữ liệu không hợp lệ"), { status: 400 });

  const { id } = await params;
  const user = await prisma.user.update({
    where: { id },
    data: { status: parsed.data.status },
    select: { id: true, email: true, fullName: true, status: true },
  });

  return NextResponse.json(ok(user, "Cập nhật trạng thái tài khoản thành công"));
}
