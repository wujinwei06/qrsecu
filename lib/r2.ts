import { S3Client } from '@aws-sdk/client-s3'

/**
 * Cloudflare R2 存储客户端配置
 *
 * R2 兼容 S3 API，使用 AWS SDK 进行操作。
 * 环境变量在 .env.local 中配置。
 */

// R2 配置（从环境变量读取）
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!
const R2_ENDPOINT = process.env.R2_ENDPOINT!

// R2 使用 "auto" 区域
const R2_REGION = 'auto'

// 单例 S3 客户端（避免重复创建）
let _client: S3Client | null = null

/**
 * 获取 R2 S3 客户端单例
 */
export function getR2Client(): S3Client {
  if (!_client) {
    _client = new S3Client({
      region: R2_REGION,
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
      // R2 不支持 SHA-256 签名中的 payload 验证，需要关闭
      // https://developers.cloudflare.com/r2/api/s3/presigned-urls/
    })
  }
  return _client
}

/**
 * 获取 R2 存储桶名称
 */
export function getR2BucketName(): string {
  return R2_BUCKET_NAME
}

/**
 * 生成 R2 对象的公共访问 URL
 * 需要在 Cloudflare R2 设置中开启公共访问（绑定自定义域名）
 */
export function getR2PublicUrl(key: string): string {
  // 如果配置了自定义域名，使用自定义域名
  const publicDomain = process.env.R2_PUBLIC_DOMAIN
  if (publicDomain) {
    return `${publicDomain.replace(/\/$/, '')}/${key}`
  }
  // 否则使用默认的 R2 公共 URL 格式
  return `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${key}`
}

/**
 * 文件大小限制（字节）
 * 与前端 CreatePackage 页面保持一致
 */
export const FILE_SIZE_LIMITS: Record<string, number> = {
  image: 30 * 1024 * 1024,    // 30 MB
  audio: 50 * 1024 * 1024,    // 50 MB
  video: 100 * 1024 * 1024,   // 100 MB
  archive: 200 * 1024 * 1024, // 200 MB
  default: 200 * 1024 * 1024, // 默认 200 MB
} as const

/**
 * 根据 MIME 类型判断文件类别
 */
export function getFileCategory(mimeType: string): keyof typeof FILE_SIZE_LIMITS {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z') || mimeType.includes('tar') || mimeType.includes('gz') || mimeType.includes('pdf')) return 'archive'
  return 'default'
}

/**
 * 验证文件大小是否在限制范围内
 */
export function validateFileSize(fileSize: number, mimeType: string): { ok: boolean; limit?: number; category?: string } {
  const category = getFileCategory(mimeType)
  const limit = FILE_SIZE_LIMITS[category]
  if (fileSize > limit) {
    return { ok: false, limit, category }
  }
  return { ok: true, limit, category }
}

/**
 * 生成唯一的 R2 对象 Key
 * 格式: uploads/{userId}/{timestamp}-{randomId}/{filename}
 */
export function generateObjectKey(userId: string, filename: string): string {
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 10)
  // 清理文件名中的非法字符
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  return `uploads/${userId}/${timestamp}-${randomId}/${safeName}`
}
