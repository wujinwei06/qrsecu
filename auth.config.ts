import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Edge Runtime 安全的 NextAuth 配置
 *
 * 此文件不导入任何 Node.js 专用模块（如 crypto、bcryptjs），
 * 可安全用于 middleware（Edge Runtime）。
 *
 * 数据库相关的 authorize 回调在 auth.ts 中覆盖。
 */

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      planTier: "free" | "pro" | "enterprise";
    };
  }

  interface JWT {
    id: string;
    planTier: "free" | "pro" | "enterprise";
  }
}

export const authConfig = {
  // 如果未设置 AUTH_SECRET 环境变量，使用 fallback 防止崩溃
  // 生产环境请务必设置 AUTH_SECRET 环境变量
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "qrsecu-fallback-secret-please-set-AUTH_SECRET",

  providers: [
    Credentials({
      id: "credentials",
      name: "邮箱密码登录",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      // 占位实现，真正逻辑在 auth.ts 中覆盖
      async authorize() {
        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },

    async signIn() {
      return true;
    },
  },
} satisfies NextAuthConfig;
