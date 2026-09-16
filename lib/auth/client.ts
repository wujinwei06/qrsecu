"use client";

/**
 * 客户端认证工具
 *
 * 提供 React Hook 和辅助函数，方便在客户端组件中使用认证功能。
 *
 * 导出内容：
 * - useAuth: useSession 的包装 Hook，提供会话状态和登录/登出方法
 * - registerUser: 注册新用户的函数
 * - getCurrentUser: 获取当前登录用户信息的函数
 */

import {
  useSession as useNextAuthSession,
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
} from "next-auth/react";
import type { Session } from "next-auth";

/**
 * 用户信息类型（不含敏感字段）
 */
export interface CurrentUser {
  id: string;
  email: string;
  name?: string | null;
  planTier: "free" | "pro" | "enterprise";
}

/**
 * 注册请求参数
 */
export interface RegisterParams {
  email: string;
  password: string;
  name?: string;
}

/**
 * 注册响应类型
 */
export interface RegisterResponse {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    name: string | null;
    planTier: "free" | "pro" | "enterprise";
    createdAt: string;
  };
}

/**
 * 登录请求参数
 */
export interface LoginParams {
  email: string;
  password: string;
  callbackUrl?: string;
}

/**
 * 登录响应类型
 */
export interface LoginResponse {
  ok: boolean;
  error?: string;
}

/**
 * useAuth - useSession 的包装 Hook
 *
 * 在 next-auth useSession 基础上提供便捷的登录/登出方法。
 *
 * @returns 会话状态、用户信息以及登录/登出方法
 */
export function useAuth() {
  const session = useNextAuthSession();

  /**
   * 使用邮箱密码登录
   *
   * @param params - 登录参数
   * @returns 登录结果
   */
  const login = async ({
    email,
    password,
    callbackUrl,
  }: LoginParams): Promise<LoginResponse> => {
    try {
      const result = await nextAuthSignIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: callbackUrl ?? "/packages",
      });

      if (result?.error) {
        return { ok: false, error: "邮箱或密码错误" };
      }

      return { ok: true };
    } catch {
      return { ok: false, error: "登录失败，请稍后重试" };
    }
  };

  /**
   * 登出当前用户
   *
   * @param callbackUrl - 登出后跳转的页面
   */
  const logout = async (callbackUrl?: string) => {
    await nextAuthSignOut({
      callbackUrl: callbackUrl ?? "/auth",
      redirect: true,
    });
  };

  return {
    // 会话数据
    session: session.data,
    // 加载状态
    status: session.status,
    // 是否已登录
    isAuthenticated: session.status === "authenticated",
    // 当前用户信息（快捷访问）
    user: session.data?.user ?? null,
    // 登录方法
    login,
    // 登出方法
    logout,
    // 更新会话方法
    update: session.update,
  };
}

/**
 * registerUser - 注册新用户
 *
 * 调用 /api/auth/register 接口创建新用户账号。
 *
 * @param email - 用户邮箱
 * @param password - 用户密码（明文，通过 HTTPS 传输）
 * @param name - 可选的显示名称
 * @returns 注册结果
 */
export async function registerUser(
  email: string,
  password: string,
  name?: string
): Promise<RegisterResponse> {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error ?? "注册失败",
      };
    }

    return data as RegisterResponse;
  } catch {
    return {
      success: false,
      error: "网络错误，请检查网络连接后重试",
    };
  }
}

/**
 * getCurrentUser - 获取当前登录用户信息
 *
 * 通过 NextAuth 的 session 接口获取当前会话用户。
 * 适用于客户端组件中需要获取当前用户的场景。
 *
 * @returns 当前用户信息或 null（未登录时）
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const response = await fetch("/api/auth/session");
    if (!response.ok) {
      return null;
    }

    const session: Session | null = await response.json();

    if (!session?.user) {
      return null;
    }

    return {
      id: session.user.id as string,
      email: session.user.email as string,
      name: session.user.name,
      planTier: (session.user as { planTier?: "free" | "pro" | "enterprise" })
        .planTier ?? "free",
    };
  } catch {
    return null;
  }
}
