/**
 * NextAuth.js v5 路由处理器
 *
 * 该文件将 NextAuth 的 handlers 导出为 GET 和 POST 方法，
 * 用于处理 /api/auth/* 下的所有认证请求（登录、登出、回调、session 等）。
 *
 * NextAuth v5 App Router 使用方式：
 * - GET: 处理 session 查询、CSRF token 获取、OAuth 回调等
 * - POST: 处理登录、登出、邮箱验证等状态变更请求
 */

import { handlers } from "@/auth";

// 导出 GET 和 POST 路由处理器
export const { GET, POST } = handlers;
