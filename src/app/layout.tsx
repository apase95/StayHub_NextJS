import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Providers } from "./providers";
import { Navbar, Footer } from "@/components/common";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "StayHub — Đặt phòng Homestay, Căn hộ & Biệt thự nghỉ dưỡng",
  description:
    "Tìm kiếm và đặt phòng homestay, căn hộ dịch vụ và biệt thự nghỉ dưỡng tuyệt vời cùng StayHub.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${inter.variable} antialiased bg-background text-foreground flex min-h-screen flex-col`}
      >
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
