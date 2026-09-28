import { NextResponse } from "next/server";

import { fail, ok } from "@/lib/api-response";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json(fail("Chưa đăng nhập"), { status: 401 });
  if (session.user.role !== "HOST" && session.user.role !== "ADMIN") return NextResponse.json(fail("Không có quyền"), { status: 403 });

  // ponytail: return real booking requests after Booking model lands in TSK-033.
  return NextResponse.json(ok([]));
}
