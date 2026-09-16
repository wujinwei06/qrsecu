/**
 * Creem 支付平台服务端 API 客户端
 *
 * 封装结账会话创建、Webhook 验签等服务端操作。
 * 所有方法均使用 fetch API，并从环境变量读取凭据：
 *   - CREEM_API_KEY        API Key（生产 creem_ 前缀，测试 creem_test_ 前缀）
 *   - CREEM_WEBHOOK_SECRET  Webhook 签名验证密钥
 *
 * 文档：https://docs.creem.io/api-reference/introduction
 */

import { createHmac, timingSafeEqual } from 'node:crypto'

// ---- 环境配置 ----

/**
 * Creem API 端点
 * 测试环境：https://test-api.creem.io/v1
 * 生产环境：https://api.creem.io/v1
 */
const CREEM_BASE_URL =
  process.env.CREEM_BASE_URL ||
  (process.env.CREEM_API_KEY?.startsWith('creem_test_')
    ? 'https://test-api.creem.io/v1'
    : 'https://api.creem.io/v1')

/** Creem API Key */
const API_KEY = process.env.CREEM_API_KEY || ''

/** Creem Webhook 签名验证密钥 */
const WEBHOOK_SECRET = process.env.CREEM_WEBHOOK_SECRET || ''

// ---- 类型定义 ----

/** 创建结账会话参数 */
export interface CreateCheckoutParams {
  /** Creem 产品 ID（在 Dashboard 中创建产品后获取） */
  productId: string
  /** 自定义引用 ID，用于跟踪订单（可选） */
  requestId?: string
  /** 支付成功后的跳转 URL */
  successUrl?: string
  /** 数量/席位数，默认 1 */
  units?: number
  /** 客户信息（预填充） */
  customer?: {
    id?: string
    email?: string
    name?: string
  }
  /** 任意元数据，会传递到 webhook */
  metadata?: Record<string, string>
  /** 折扣码 */
  discountCode?: string
}

/** 结账会话响应 */
export interface CheckoutSession {
  /** 结账会话 ID */
  id: string
  /** 跳转到 Creem 托管支付页的 URL */
  checkout_url: string
  /** 产品 ID */
  product_id: string
  /** 会话状态 */
  status: string
}

// ---- API 请求封装 ----

/**
 * 发起 Creem API 请求
 *
 * 自动附加 x-api-key 认证头。
 *
 * @param path 接口路径（以 / 开头，会拼接在 base URL 之后）
 * @param init fetch 初始化参数
 * @returns fetch 响应
 * @throws 缺少凭据时抛出错误
 */
async function creemFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  if (!API_KEY) {
    throw new Error(
      '缺少 Creem API Key，请配置 CREEM_API_KEY 环境变量'
    )
  }

  const url = `${CREEM_BASE_URL}${path}`
  return fetch(url, {
    ...init,
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })
}

// ---- 结账会话 ----

/**
 * 创建结账会话（Checkout Session）
 *
 * 调用 POST /v1/checkouts，返回结账会话 ID 与 checkout_url。
 * 前端使用 checkout_url 跳转到 Creem 托管支付页完成收款。
 *
 * @param params 结账会话参数
 * @returns 结账会话对象（含 id 与 checkout_url）
 * @throws 创建失败时抛出错误
 */
export async function createCheckout(
  params: CreateCheckoutParams
): Promise<CheckoutSession> {
  const body: Record<string, unknown> = {
    product_id: params.productId,
  }

  if (params.requestId) body.request_id = params.requestId
  if (params.successUrl) body.success_url = params.successUrl
  if (params.units) body.units = params.units
  if (params.discountCode) body.discount_code = params.discountCode

  if (params.customer) {
    const customer: Record<string, string> = {}
    if (params.customer.id) customer.id = params.customer.id
    if (params.customer.email) customer.email = params.customer.email
    if (params.customer.name) customer.name = params.customer.name
    if (Object.keys(customer).length > 0) body.customer = customer
  }

  if (params.metadata) {
    body.metadata = params.metadata
  }

  const res = await creemFetch('/checkouts', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`创建结账会话失败 (${res.status}): ${text}`)
  }

  const data = await res.json()
  return {
    id: data.id,
    checkout_url: data.checkout_url,
    product_id: data.product_id,
    status: data.status,
  }
}

/**
 * 查询结账会话状态
 *
 * 调用 GET /v1/checkouts?id={id}，返回结账会话详情。
 *
 * @param id 结账会话 ID
 * @returns 结账会话详情
 * @throws 查询失败时抛出错误
 */
export async function getCheckout(id: string): Promise<Record<string, unknown>> {
  const res = await creemFetch(`/checkouts?id=${encodeURIComponent(id)}`, {
    method: 'GET',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`查询结账会话失败 (${res.status}): ${text}`)
  }

  return res.json()
}

// ---- Webhook 验签 ----

/**
 * 验证 Creem Webhook 签名
 *
 * Creem 在 Webhook 请求头中附带 creem-signature，签名为
 * HMAC-SHA256(rawBody, webhook_secret)。
 * 本方法重新计算签名并与请求头中的签名做时间安全比较。
 *
 * @param rawBody 原始请求体字符串
 * @param signature 请求头 creem-signature 中的签名字符串
 * @returns 验证是否通过
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  if (!WEBHOOK_SECRET) {
    console.warn('未配置 CREEM_WEBHOOK_SECRET，跳过 Webhook 签名验证')
    return false
  }

  if (!signature) return false

  // 计算期望签名：HMAC-SHA256(rawBody)
  const computed = createHmac('sha256', WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex')

  // 时间安全比较，防止时序攻击
  return safeEqual(computed, signature)
}

/**
 * 时间安全字符串比较
 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b))
  } catch {
    // fallback：逐字节比较
    let diff = 0
    for (let i = 0; i < a.length; i++) {
      diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }
    return diff === 0
  }
}
