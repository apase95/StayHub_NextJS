import { NextResponse } from "next/server";

import { fail, ok } from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { propertyQuerySchema, propertySchema } from "@/schemas/property.schema";
import { createProperty, listProperties } from "@/services/property.service";

export async function GET(request: Request) {
  const query = propertyQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams));
  const where = {
    ...(query.city ? { city: { contains: query.city, mode: "insensitive" as const } } : {}),
    ...(query.type ? { type: query.type } : {}),
    ...(query.guests ? { maxGuests: { gte: query.guests } } : {}),
  };

  return NextResponse.json(ok(await listProperties(where, query.page, query.featured ? 6 : query.limit)));
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json(fail("Chưa đăng nhập"), { status: 401 });
  if (session.user.role !== "HOST" && session.user.role !== "ADMIN") {
    return NextResponse.json(fail("Không có quyền"), { status: 403 });
  }

  const parsed = propertySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json(fail("Dữ liệu không hợp lệ"), { status: 400 });

  return NextResponse.json(ok(await createProperty(session.user.id, parsed.data), "Tạo property thành công"), { status: 201 });
}
