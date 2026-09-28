import { NextResponse } from "next/server";

import { fail, ok } from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json(fail("Chưa đăng nhập"), { status: 401 });
  if (session.user.role !== "HOST" && session.user.role !== "ADMIN") return NextResponse.json(fail("Không có quyền"), { status: 403 });

  const activeProperties = await prisma.property.count({ where: { hostId: session.user.id, status: "ACTIVE" } });
  // ponytail: booking/revenue need Booking/Payment models from TSK-033/034.
  return NextResponse.json(ok({ totalBookings: 0, totalRevenue: 0, activeProperties }));
}
