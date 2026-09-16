import { NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { auth } from '@/auth'
import { getR2Client, getR2BucketName, generateObjectKey, validateFileSize } from '@/lib/r2'

// 强制动态渲染（不缓存）
export const dynamic = 'force-dynamic'

// 预签名 URL 有效期（秒）
const PRESIGNED_URL_EXPIRY = 600 // 10 分钟

/**
 * POST /api/upload
 *
 * 生成 Cloudflare R2 预签名上传 URL
 *
 * 请求体:
 * {
 *   filename: string,       // 原始文件名
 *   contentType: string,    // MIME 类型，如 image/png
 *   fileSize: number,        // 文件大小（字节）
 *   packageId?: string       // 可选，关联的包裹 ID
 * }
 *
 * 响应:
 * {
 *   url: string,             // 预签名 PUT URL（客户端直接上传到 R2）
 *   key: string,              // R2 对象 Key（保存到数据库）
 *   publicUrl: string,        // 公共访问 URL（需开启 R2 公共访问）
 *   expiresIn: number,        // URL 有效期（秒）
 * }
 *
 * 错误响应:
 * - 401: 未登录
 * - 400: 参数缺失或文件大小超限
 * - 500: 服务器错误
 */
export async function POST(request: Request) {
  try {
    // 1. 认证检查
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未登录，请先登录', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // 2. 解析请求体
    const body = await request.json()
    const { filename, contentType, fileSize } = body

    // 3. 参数校验
    if (!filename || !contentType || !fileSize) {
      return NextResponse.json(
        { error: '缺少必要参数: filename, contentType, fileSize', code: 'MISSING_PARAMS' },
        { status: 400 }
      )
    }

    if (typeof fileSize !== 'number' || fileSize <= 0) {
      return NextResponse.json(
        { error: 'fileSize 必须是正数', code: 'INVALID_FILE_SIZE' },
        { status: 400 }
      )
    }

    // 4. 文件大小限制检查
    const sizeCheck = validateFileSize(fileSize, contentType)
    if (!sizeCheck.ok) {
      const limitMB = Math.round((sizeCheck.limit || 0) / (1024 * 1024))
      return NextResponse.json(
        {
          error: `文件大小超过限制: ${limitMB}MB（类型: ${sizeCheck.category}）`,
          code: 'FILE_TOO_LARGE',
          limit: sizeCheck.limit,
          category: sizeCheck.category,
        },
        { status: 400 }
      )
    }

    // 5. 生成唯一的 R2 对象 Key
    const key = generateObjectKey(userId, filename)

    // 6. 创建预签名 PUT URL
    const command = new PutObjectCommand({
      Bucket: getR2BucketName(),
      Key: key,
      ContentType: contentType,
      ContentLength: fileSize,
    })

    const url = await getSignedUrl(getR2Client(), command, {
      expiresIn: PRESIGNED_URL_EXPIRY,
    })

    // 7. 返回预签名 URL 和元数据
    return NextResponse.json({
      url,
      key,
      publicUrl: null, // 上传后通过对象 Key 访问，公共 URL 需开启 R2 公共访问
      expiresIn: PRESIGNED_URL_EXPIRY,
      contentType,
      fileSize,
    })
  } catch (error) {
    console.error('[Upload API] 生成预签名 URL 失败:', error)
    return NextResponse.json(
      { error: '生成上传 URL 失败，请稍后重试', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/upload
 *
 * 返回支持的文件类型和大小限制（供前端使用）
 */
export async function GET() {
  return NextResponse.json({
    limits: {
      image: { maxSize: 30 * 1024 * 1024, label: '30 MB' },
      audio: { maxSize: 50 * 1024 * 1024, label: '50 MB' },
      video: { maxSize: 100 * 1024 * 1024, label: '100 MB' },
      archive: { maxSize: 200 * 1024 * 1024, label: '200 MB' },
    },
    urlExpiry: PRESIGNED_URL_EXPIRY,
  })
}
