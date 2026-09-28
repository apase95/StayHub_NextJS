import type { Session } from "next-auth";

import { buildPaymentUrl } from "@/lib/vnpay";
import { prisma } from "@/lib/prisma";
import { validateDiscount } from "@/services/discount.service";

export type CreateBookingInput = {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  discountCode?: string;
};

export class BookingConflictError extends Error {}

export async function checkOverlap(propertyId: string, checkIn: string | Date, checkOut: string | Date) {
  return prisma.booking.findFirst({
    where: {
      propertyId,
      status: { in: ["PENDING_PAYMENT", "CONFIRMED"] },
      checkInDate: { lt: new Date(checkOut) },
      checkOutDate: { gt: new Date(checkIn) },
    },
  });
}

export function calculatePrice(property: { pricePerNight: unknown; cleaningFee: unknown }, checkIn: string | Date, checkOut: string | Date) {
  const nights = Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000));
  const nightlyPrice = Number(property.pricePerNight);
  const cleaningFee = Number(property.cleaningFee);
  const serviceFee = Math.round(nightlyPrice * nights * 0.1);
  const subtotalPrice = nightlyPrice * nights + cleaningFee + serviceFee;
  return { nightlyPrice, nights, cleaningFee, serviceFee, subtotalPrice, totalPrice: subtotalPrice };
}

export async function createBooking(data: CreateBookingInput, session: Session) {
  const property = await prisma.property.findUnique({ where: { id: data.propertyId } });
  if (!property || property.status !== "ACTIVE") throw new Error("Property not found");
  if (data.guests > property.maxGuests) throw new Error("Too many guests");
  if (await checkOverlap(data.propertyId, data.checkIn, data.checkOut)) throw new BookingConflictError("Chỗ ở không còn trống trong khoảng ngày này");

  const price = calculatePrice(property, data.checkIn, data.checkOut);
  const discount = data.discountCode ? await validateDiscount(data.discountCode, price.subtotalPrice) : null;
  const discountAmount = discount?.discountAmount ?? 0;
  const totalPrice = price.subtotalPrice - discountAmount;

  const booking = await prisma.$transaction(async (tx) => {
    const created = await tx.booking.create({
      data: {
        propertyId: data.propertyId,
        guestId: session.user.id,
        checkInDate: new Date(data.checkIn),
        checkOutDate: new Date(data.checkOut),
        guests: data.guests,
        nightlyPrice: price.nightlyPrice,
        cleaningFee: price.cleaningFee,
        serviceFee: price.serviceFee,
        subtotalPrice: price.subtotalPrice,
        discountCodeId: discount?.discount.id,
        discountAmount,
        totalPrice,
      },
    });

    await tx.payment.create({
      data: { bookingId: created.id, amount: totalPrice, paymentMethod: "VNPAY", status: "PENDING", providerTxnRef: created.id },
    });

    return created;
  });

  return {
    bookingId: booking.id,
    vnpayUrl: buildPaymentUrl({
      vnp_Amount: Math.round(totalPrice * 100),
      vnp_TxnRef: booking.id,
      vnp_OrderInfo: `Thanh toan booking ${booking.id}`,
      vnp_OrderType: "other",
      vnp_CreateDate: formatVnpayDate(new Date()),
      vnp_IpAddr: "127.0.0.1",
    }),
  };
}

export async function cancelBooking(bookingId: string, userId: string, isAdmin = false) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new Error("Booking not found");
  if (!isAdmin && booking.guestId !== userId) throw new Error("Forbidden");
  if (!["PENDING_PAYMENT", "CONFIRMED"].includes(booking.status)) throw new Error("Invalid booking state");

  return prisma.booking.update({ where: { id: bookingId }, data: { status: "CANCELLED", cancelledAt: new Date() } });
}

function formatVnpayDate(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}
