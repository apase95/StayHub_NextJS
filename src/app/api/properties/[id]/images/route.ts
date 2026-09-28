import { NextResponse } from "next/server";

import { fail, ok } from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { deleteImage, uploadImage } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

async function canEdit(propertyId: string) {
  const session = await auth();
  if (!session) return { error: NextResponse.json(fail("Chưa đăng nhập"), { status: 401 }) };

  const property = await prisma.property.findUnique({ where: { id: propertyId }, select: { hostId: true } });
  if (!property) return { error: NextResponse.json(fail("Không tìm thấy property"), { status: 404 }) };
  if (session.user.role !== "ADMIN" && property.hostId !== session.user.id) {
    return { error: NextResponse.json(fail("Không có quyền"), { status: 403 }) };
  }

  return { session };
}

export async function POST(request: Request, { params }: Context) {
  const { id } = await params;
  const guard = await canEdit(id);
  if (guard.error) return guard.error;

  const file = (await request.formData()).get("file");
  if (!(file instanceof File)) return NextResponse.json(fail("Vui lòng chọn ảnh"), { status: 400 });
  if (!["image/jpeg", "image/png"].includes(file.type)) return NextResponse.json(fail("Chỉ hỗ trợ JPEG/PNG"), { status: 400 });
  if (file.size > Number(process.env.UPLOAD_MAX_FILE_SIZE ?? 5_242_880)) {
    return NextResponse.json(fail("Ảnh vượt quá dung lượng cho phép"), { status: 400 });
  }

  const count = await prisma.propertyImage.count({ where: { propertyId: id } });
  const uploaded = await uploadImage(Buffer.from(await file.arrayBuffer()), `properties/${id}`);
  const image = await prisma.propertyImage.create({
    data: { propertyId: id, imageUrl: uploaded.url, publicId: uploaded.publicId, displayOrder: count, isCover: count === 0 },
  });

  return NextResponse.json(ok(image, "Upload ảnh thành công"), { status: 201 });
}

export async function DELETE(request: Request, { params }: Context) {
  const { id } = await params;
  const guard = await canEdit(id);
  if (guard.error) return guard.error;

  const publicId = new URL(request.url).searchParams.get("publicId");
  if (!publicId) return NextResponse.json(fail("Thiếu publicId"), { status: 400 });

  await deleteImage(publicId);
  await prisma.propertyImage.deleteMany({ where: { propertyId: id, publicId } });
  return NextResponse.json(ok(null, "Xoá ảnh thành công"));
}

export async function PATCH(request: Request, { params }: Context) {
  const { id } = await params;
  const guard = await canEdit(id);
  if (guard.error) return guard.error;

  const { imageId } = (await request.json()) as { imageId?: string };
  if (!imageId) return NextResponse.json(fail("Thiếu imageId"), { status: 400 });

  await prisma.$transaction([
    prisma.propertyImage.updateMany({ where: { propertyId: id }, data: { isCover: false } }),
    prisma.propertyImage.update({ where: { id: imageId }, data: { isCover: true } }),
  ]);

  return NextResponse.json(ok(null, "Đã đặt ảnh cover"));
}
