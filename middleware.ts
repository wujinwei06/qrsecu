/**
 * NextAuth.js v5 路由保护中间件（Edge Runtime）
 *
 * 使用 edge-safe 的 auth.config.ts（不含数据库导入），
 * 仅验证 JWT token，不访问数据库。
 *
 * 受保护路由：
 * - /packages          - 二维码包管理
 * - /create-package    - 创建二维码包
 * - /generate-success  - 生成成功页
 * - /enterprise        - 企业管理后台
 * - /recycle-bin       - 回收站
 * - /checkout          - 结账
 * - /dashboard         - 账户后台（储存管理等）
 */

import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const protectedPaths = [
  "/packages",
  "/create-package",
  "/generate-success",
  "/enterprise",
  "/recycle-bin",
  "/checkout",
  "/dashboard",
];

function isProtectedPath(pathname: string): boolean {
  return protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  if (!req.auth) {
    const loginUrl = new URL("/auth", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
