import { NextResponse } from "next/server";

import { fail, ok } from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json(fail("Chưa đăng nhập"), { status: 401 });
  if (session.user.role !== "ADMIN") return NextResponse.json(fail("Không có quyền"), { status: 403 });

  const [totalUsers, activeHosts] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "HOST", status: "ACTIVE" } }),
  ]);

  // ponytail: booking/payment schema lands in TSK-033/034; replace zeros with Prisma aggregates then.
  return NextResponse.json(ok({ totalUsers, activeHosts, bookingsToday: 0, platformRevenue: 0 }));
}
