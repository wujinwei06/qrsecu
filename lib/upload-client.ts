'use client'

/**
 * 客户端文件上传工具
 *
 * 流程:
 * 1. 调用 POST /api/upload 获取预签名 URL
 * 2. 使用 PUT 方法直接上传文件到 R2（不经过服务器中转）
 * 3. 返回对象 Key 供数据库存储
 */

export interface UploadResult {
  key: string       // R2 对象 Key，保存到数据库
  contentType: string
  fileSize: number
}

export interface UploadProgress {
  loaded: number
  total: number
  percent: number
}

/**
 * 上传文件到 Cloudflare R2
 *
 * @param file 要上传的文件
 * @param onProgress 上传进度回调（可选）
 * @returns 上传结果，包含对象 Key
 */
export async function uploadFile(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  // 1. 获取预签名 URL
  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type || 'application/octet-stream',
      fileSize: file.size,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || '获取上传 URL 失败')
  }

  const { url, key } = await response.json()

  // 2. 使用预签名 URL 直接上传到 R2
  return new Promise<UploadResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    // 上传进度
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress({
          loaded: e.loaded,
          total: e.total,
          percent: Math.round((e.loaded / e.total) * 100),
        })
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({
          key,
          contentType: file.type || 'application/octet-stream',
          fileSize: file.size,
        })
      } else {
        reject(new Error(`上传失败: ${xhr.status} ${xhr.statusText}`))
      }
    }

    xhr.onerror = () => reject(new Error('网络错误，上传失败'))
    xhr.ontimeout = () => reject(new Error('上传超时'))

    xhr.open('PUT', url)
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')
    xhr.send(file)
  })
}

/**
 * 批量上传文件
 *
 * @param files 文件数组
 * @param onProgress 每个文件的上传进度回调（返回文件名和进度）
 * @returns 所有文件的上传结果
 */
export async function uploadFiles(
  files: File[],
  onProgress?: (filename: string, progress: UploadProgress) => void
): Promise<UploadResult[]> {
  const results: UploadResult[] = []

  for (const file of files) {
    const result = await uploadFile(file, (progress) => {
      onProgress?.(file.name, progress)
    })
    results.push(result)
  }

  return results
}
