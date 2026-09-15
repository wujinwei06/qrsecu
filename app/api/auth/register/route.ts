/**
 * 用户注册 API 路由
 *
 * POST /api/auth/register
 *
 * 请求体: { email: string, password: string, name?: string }
 * 成功响应: { success: true, user: { id, email, name, planTier, createdAt } }
 * 失败响应: { success: false, error: string }
 *
 * 验证规则：
 * - 邮箱格式校验
 * - 密码长度 >= 8 位
 * - 邮箱不可重复注册
 */

import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/auth/db";

/**
 * 邮箱格式正则表达式
 * 使用 RFC 5322 简化版本
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 最小密码长度 */
const MIN_PASSWORD_LENGTH = 8;

/**
 * POST /api/auth/register
 *
 * 处理用户注册请求
 */
export async function POST(request: Request) {
  try {
    // 解析请求体
    const body = await request.json();
    const { email, password, name } = body as {
      email?: string;
      password?: string;
      name?: string;
    };

    // 验证邮箱是否存在
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "请提供邮箱地址" },
        { status: 400 }
      );
    }

    // 验证密码是否存在
    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "请提供密码" },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: "邮箱格式不正确" },
        { status: 400 }
      );
    }

    // 验证密码长度
    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          error: `密码长度不能少于 ${MIN_PASSWORD_LENGTH} 位`,
        },
        { status: 400 }
      );
    }

    // 检查邮箱是否已被注册
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "该邮箱已被注册" },
        { status: 409 }
      );
    }

    // 创建用户（密码在 createUser 内部进行 bcrypt 哈希处理）
    const user = await createUser(email, password, name);

    // 返回成功响应（不含密码信息）
    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    // 处理 createUser 抛出的 "该邮箱已被注册" 错误
    if (error instanceof Error && error.message === "该邮箱已被注册") {
      return NextResponse.json(
        { success: false, error: "该邮箱已被注册" },
        { status: 409 }
      );
    }

    // 其他未知错误
    console.error("注册失败:", error);
    return NextResponse.json(
      { success: false, error: "注册失败，请稍后重试" },
      { status: 500 }
    );
  }
}
