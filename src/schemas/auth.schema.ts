import { z } from "zod";

export const registerSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
  fullName: z.string().trim().min(1, "Vui lòng nhập họ tên"),
});

export const loginSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export const verifyOtpSchema = z.object({
  email: z.email().toLowerCase(),
  otp: z.string().regex(/^\d{6}$/, "OTP phải gồm 6 số"),
});
