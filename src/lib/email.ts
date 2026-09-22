import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT ?? 587),
  secure: Number(process.env.MAIL_PORT) === 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
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
