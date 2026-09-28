import nodemailer from "nodemailer";

type BookingEmailDetails = {
  bookingId: string;
  propertyTitle: string;
  checkInDate: string | Date;
  checkOutDate: string | Date;
  totalPrice: number | string;
};

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT ?? 587),
  secure: Number(process.env.MAIL_PORT) === 465,
  auth: {
    user: process.env.MAIL_USER ?? process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASS ?? process.env.MAIL_PASSWORD,
  },
});

export function sendOtpEmail(to: string, otp: string) {
  return transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: "StayHub OTP xác minh email",
    html: `<p>Mã OTP của bạn là <b>${otp}</b>. Mã hết hạn sau 10 phút.</p>`,
  });
}

export function sendBookingConfirmed(to: string, booking: BookingEmailDetails) {
  return transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: "StayHub xác nhận đặt phòng",
    html: bookingHtml("Đặt phòng đã được xác nhận", booking),
  });
}

export function sendBookingCancelled(to: string, booking: BookingEmailDetails) {
  return transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: "StayHub thông báo huỷ đặt phòng",
    html: bookingHtml("Đặt phòng đã bị huỷ", booking),
  });
}

function bookingHtml(title: string, booking: BookingEmailDetails) {
  return `<h2>${title}</h2>
    <p>Mã booking: <b>${booking.bookingId}</b></p>
    <p>Chỗ ở: ${booking.propertyTitle}</p>
    <p>Ngày: ${formatDate(booking.checkInDate)} → ${formatDate(booking.checkOutDate)}</p>
    <p>Tổng tiền: <b>${Number(booking.totalPrice).toLocaleString("vi-VN")}₫</b></p>`;
}

function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("vi-VN").format(new Date(value));
}
