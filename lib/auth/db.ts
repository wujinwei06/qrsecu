/**
 * 用户数据库操作层
 *
 * 当前实现使用内存 Map 作为开发环境存储。
 * 生产环境应替换为 D1 (Cloudflare) 或 PostgreSQL 等持久化数据库。
 *
 * 迁移说明：
 * - 将 usersMap 替换为数据库查询（如 D1 的 env.DB.prepare()）
 * - 保持 createUser / getUserByEmail / getUserById 方法签名不变
 * - bcryptjs 哈希逻辑可保留在应用层，或迁移到数据库存储层
 */

import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

/**
 * 用户类型接口
 */
export interface User {
  /** 用户唯一 ID */
  id: string;
  /** 邮箱地址（唯一） */
  email: string;
  /** 显示名称 */
  name: string | null;
  /** 订阅套餐等级：free | pro | enterprise */
  planTier: "free" | "pro" | "enterprise";
  /** 创建时间（ISO 字符串） */
  createdAt: string;
  /** 哈希后的密码（仅存储，不对外暴露） */
  hashedPassword: string;
}

/**
 * 数据库行类型（包含 hashedPassword 的完整记录）
 * 用于内部存储，对外暴露时会移除 hashedPassword
 */
type UserRecord = User;

/**
 * 内存用户存储
 *
 * 注意：开发环境下使用，服务重启后数据会丢失。
 * 生产环境请替换为持久化数据库。
 */
const usersMap = new Map<string, UserRecord>();

/** 邮箱到用户 ID 的索引，方便按邮箱快速查找 */
const emailIndex = new Map<string, string>();

/** bcrypt 加密轮数（10 是推荐值，兼顾安全与性能） */
const SALT_ROUNDS = 10;

/**
 * 创建新用户
 *
 * @param email - 用户邮箱
 * @param password - 明文密码（函数内部会进行哈希处理）
 * @param name - 可选的显示名称
 * @returns 创建的用户对象（不含 hashedPassword）
 */
export async function createUser(
  email: string,
  password: string,
  name?: string
): Promise<Omit<User, "hashedPassword">> {
  // 检查邮箱是否已注册
  if (getUserByEmail(email)) {
    throw new Error("该邮箱已被注册");
  }

  // 使用 bcryptjs 哈希密码
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const now = new Date().toISOString();
  const user: UserRecord = {
    id: randomUUID(),
    email: email.toLowerCase(),
    name: name ?? null,
    planTier: "free",
    createdAt: now,
    hashedPassword,
  };

  // 写入内存存储
  usersMap.set(user.id, user);
  emailIndex.set(user.email, user.id);

  // 返回时移除 hashedPassword，避免泄露
  const { hashedPassword: _, ...safeUser } = user;
  return safeUser;
}

/**
 * 根据邮箱获取用户（包含 hashedPassword，用于登录验证）
 *
 * @param email - 用户邮箱
 * @returns 用户记录（含密码哈希）或 null
 */
export function getUserByEmail(email: string): UserRecord | null {
  const normalizedEmail = email.toLowerCase();
  const userId = emailIndex.get(normalizedEmail);
  if (!userId) return null;
  return usersMap.get(userId) ?? null;
}

/**
 * 根据用户 ID 获取用户（包含 hashedPassword，用于内部验证）
 *
 * @param id - 用户 ID
 * @returns 用户记录（含密码哈希）或 null
 */
export function getUserById(id: string): UserRecord | null {
  return usersMap.get(id) ?? null;
}

/**
 * 根据用户 ID 获取安全用户信息（不含密码哈希）
 *
 * @param id - 用户 ID
 * @returns 安全的用户对象或 null
 */
export function getSafeUserById(
  id: string
): Omit<User, "hashedPassword"> | null {
  const user = usersMap.get(id);
  if (!user) return null;
  const { hashedPassword: _, ...safeUser } = user;
  return safeUser;
}

/**
 * 验证密码是否匹配
 *
 * @param password - 明文密码
 * @param hashedPassword - 哈希后的密码
 * @returns 是否匹配
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
