import { NextResponse } from "next/server";

import { fail, ok } from "@/lib/api-response";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json(fail("Chưa đăng nhập"), { status: 401 });
  if (session.user.role !== "ADMIN") return NextResponse.json(fail("Không có quyền"), { status: 403 });

  const { searchParams } = new URL(request.url);
  const page = Math.max(Number(searchParams.get("page") ?? 1), 1);

  // ponytail: booking schema lands in TSK-033; replace with real search/filter/pagination then.
  return NextResponse.json(ok({ bookings: [], total: 0, page, totalPages: 0 }));
}
