// src/middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // از توکن‌های JWT استفاده می‌کنیم
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // دریافت توکن از کوکی‌های درخواست
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  // اگر توکن وجود ندارد، به صفحه لاگین هدایت می‌شود
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // اگر توکن موجود است، دسترسی به صفحه داده می‌شود
  return NextResponse.next();
}

// تنظیم مسیرهایی که می‌خواهید این middleware برای آن‌ها فعال باشد
export const config = {
  matcher: ["/dashboard","/todo/:path*"], // مسیرهای محافظت‌شده
};
