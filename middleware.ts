import { auth } from "@/lib/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user.role;

  if (pathname.startsWith("/host") && role !== "HOST" && role !== "ADMIN") {
    return Response.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return Response.redirect(new URL("/", req.url));
  }

  if ((pathname.startsWith("/bookings") || pathname.includes("/book/")) && !req.auth) {
    return Response.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: ["/host/:path*", "/admin/:path*", "/bookings/:path*", "/properties/:path*/book/:path*"],
};
