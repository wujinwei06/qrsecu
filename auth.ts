/**
 * NextAuth.js v5 完整配置（Node.js Runtime）
 *
 * 此文件导入数据库模块（bcryptjs、crypto），
 * 仅用于 API 路由和 Server Components（Node.js Runtime），
 * 不可用于 middleware（Edge Runtime）。
 *
 * middleware 请使用 auth.config.ts（edge-safe）。
 */

import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import {
  getUserByEmail,
  getUserById,
  verifyPassword,
} from "@/lib/auth/db";

/**
 * 完整配置：在 edge-safe 基础上覆盖 authorize 和 jwt 回调，
 * 添加数据库调用。
 */
export const config = {
  ...authConfig,

  providers: [
    {
      ...authConfig.providers[0],
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = getUserByEmail(email);
        if (!user) {
          return null;
        }

        const isValid = await verifyPassword(password, user.hashedPassword);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          planTier: user.planTier,
        };
      },
    },
  ],

  callbacks: {
    ...authConfig.callbacks,

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        const dbUser = getUserById(user.id as string);
        if (dbUser) {
          token.planTier = dbUser.planTier;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.planTier = token.planTier as
          | "free"
          | "pro"
          | "enterprise";
      }
      return session;
    },

    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        if (!user?.id) {
          return false;
        }
      }
      return true;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
