/**
 * Airwallex（空中云汇）服务端 API 客户端
 *
 * 封装认证、付款意图、客户管理、Webhook 验签等服务端操作。
 * 所有方法均使用 fetch API，并从环境变量读取凭据：
 *   - AIRWALLEX_ENDPOINT     API 地址（Sandbox: https://api-demo.airwallex.com / Production: https://api.airwallex.com）
 *   - AIRWALLEX_CLIENT_ID    客户端 ID
 *   - AIRWALLEX_API_KEY      API Key
 *   - AIRWALLEX_WEBHOOK_SECRET  Webhook 签名密钥
 *
 * 文档：https://www.airwallex.com/docs/api
 */

import { createHmac } from 'node:crypto'

// ---- 环境配置 ----

/** Airwallex API 端点，默认使用 Sandbox */
const AIRWALLEX_ENDPOINT =
  process.env.AIRWALLEX_ENDPOINT || 'https://api-demo.airwallex.com'

/** 客户端 ID */
const CLIENT_ID = process.env.AIRWALLEX_CLIENT_ID || ''

/** API Key */
const API_KEY = process.env.AIRWALLEX_API_KEY || ''

/** Webhook 签名密钥 */
const WEBHOOK_SECRET = process.env.AIRWALLEX_WEBHOOK_SECRET || ''

// ---- 类型定义 ----

/** 认证令牌响应 */
interface TokenResponse {
  token: string
  expires_at?: string
}

/** 创建付款意图参数 */
export interface CreatePaymentIntentParams {
  /** 金额（最小货币单位，如美元则为美分） */
  amount: number
  /** 货币代码（ISO 4217，如 USD、CNY） */
  currency: string
  /** 商户订单 ID */
  merchantOrderId: string
  /** 客户信息（用于订阅场景关联客户） */
  customer?: {
    id?: string
    email?: string
    name?: string
  }
  /** 附加描述（账单显示） */
  descriptor?: string
  /** 是否为循环扣费（订阅场景） */
  recurring?: boolean
}

/** 付款意图对象 */
export interface PaymentIntent {
  id: string
  client_secret: string
  amount: number
  currency: string
  status: string
  latest_payment_attempt?: {
    client_secret?: string
  }
}

/** 创建客户参数 */
export interface CreateCustomerParams {
  /** 商户侧客户 ID（建议使用系统用户 ID） */
  merchant_customer_id: string
  email?: string
  name?: string
  phone?: string
}

/** Airwallex 客户对象 */
export interface AirwallexCustomer {
  id: string
  merchant_customer_id: string
  email?: string
  name?: string
}

// ---- 令牌管理 ----

/** 进程级令牌缓存，避免频繁登录 */
let cachedToken: { token: string; expiresAt: number } | null = null

/**
 * 获取 Airwallex API 访问令牌
 *
 * 使用 x-client-id 与 x-api-key 调用 /api/v1/authentication/login，
 * 返回 Bearer 令牌。令牌会缓存在内存中，提前 60 秒刷新。
 *
 * @returns 访问令牌字符串
 * @throws 缺少凭据或认证失败时抛出错误
 */
export async function getAccessToken(): Promise<string> {
  // 命中缓存且未过期（提前 60 秒刷新）
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token
  }

  if (!CLIENT_ID || !API_KEY) {
    throw new Error(
      '缺少 Airwallex 凭据，请配置 AIRWALLEX_CLIENT_ID 与 AIRWALLEX_API_KEY 环境变量'
    )
  }

  const res = await fetch(
    `${AIRWALLEX_ENDPOINT}/api/v1/authentication/login`,
    {
      method: 'POST',
      headers: {
        'x-client-id': CLIENT_ID,
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Airwallex 认证失败 (${res.status}): ${body}`)
  }

  const data: TokenResponse = await res.json()
  // Airwallex 令牌默认有效期约 30 分钟，保守缓存 25 分钟
  cachedToken = {
    token: data.token,
    expiresAt: Date.now() + 25 * 60 * 1000,
  }
  return cachedToken.token
}

/**
 * 带认证的请求封装，自动附加 Bearer 令牌
 * @param path 接口路径（以 /api 开头）
 * @param init fetch 初始化参数
 * @returns fetch 响应
 */
async function authedFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const token = await getAccessToken()
  return fetch(`${AIRWALLEX_ENDPOINT}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })
}

// ---- 付款意图 ----

/**
 * 创建付款意图（Payment Intent）
 *
 * 调用 POST /api/v1/pa/payment_intents/create，返回付款意图 ID 与 client_secret。
 * 前端使用 client_secret 跳转到 Airwallex 托管支付页（HPP）完成收款。
 *
 * @param params 付款意图参数
 * @returns 付款意图对象（含 id 与 client_secret）
 * @throws 创建失败时抛出错误
 */
export async function createPaymentIntent(
  params: CreatePaymentIntentParams
): Promise<PaymentIntent> {
  const body: Record<string, unknown> = {
    // request_id 用于幂等，避免重复创建
    request_id: `${params.merchantOrderId}-${Date.now()}`,
    amount: params.amount,
    currency: params.currency,
    merchant_order_id: params.merchantOrderId,
    descriptor: params.descriptor || 'Qrsecu',
  }

  if (params.customer?.id) {
    body.customer_id = params.customer.id
  }
  if (params.customer?.email) {
    body.email = params.customer.email
  }
  if (params.customer?.name) {
    body.name = params.customer.name
  }

  // 循环扣费场景标记订阅信息
  if (params.recurring) {
    body.metadata = { subscription: 'true' }
  }

  const res = await authedFetch('/api/v1/pa/payment_intents/create', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`创建付款意图失败 (${res.status}): ${text}`)
  }

  const data = await res.json()
  // client_secret 可能在顶层或 latest_payment_attempt 中
  const clientSecret =
    data.client_secret || data.latest_payment_attempt?.client_secret

  return {
    id: data.id,
    client_secret: clientSecret,
    amount: data.amount,
    currency: data.currency,
    status: data.status,
    latest_payment_attempt: data.latest_payment_attempt,
  }
}

/**
 * 确认付款意图（用于循环扣费 / 后台扣款）
 *
 * 调用 POST /api/v1/pa/payment_intents/{id}/confirm，使用已保存的付款授权
 * （consent_id）完成扣款，无需用户再次输入支付信息。
 *
 * @param intentId 付款意图 ID
 * @param consentId 付款授权同意 ID（Cardholder Consent）
 * @returns 更新后的付款意图对象
 * @throws 确认失败时抛出错误
 */
export async function confirmPaymentIntent(
  intentId: string,
  consentId: string
): Promise<PaymentIntent> {
  const res = await authedFetch(
    `/api/v1/pa/payment_intents/${intentId}/confirm`,
    {
      method: 'POST',
      body: JSON.stringify({
        consent_id: consentId,
      }),
    }
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`确认付款意图失败 (${res.status}): ${text}`)
  }

  const data = await res.json()
  return {
    id: data.id,
    client_secret: data.client_secret,
    amount: data.amount,
    currency: data.currency,
    status: data.status,
  }
}

// ---- 客户管理 ----

/**
 * 创建 Airwallex 客户（用于订阅与循环扣费）
 *
 * 调用 POST /api/v1/customers/create，将系统用户关联为 Airwallex 客户，
 * 后续可用于保存支付方式并执行自动续费。
 *
 * @param params 客户参数
 * @returns Airwallex 客户对象
 * @throws 创建失败时抛出错误
 */
export async function createCustomer(
  params: CreateCustomerParams
): Promise<AirwallexCustomer> {
  const body: Record<string, unknown> = {
    merchant_customer_id: params.merchant_customer_id,
  }
  if (params.email) body.email = params.email
  if (params.name) body.name = params.name
  if (params.phone) body.phone = params.phone

  const res = await authedFetch('/api/v1/customers/create', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`创建客户失败 (${res.status}): ${text}`)
  }

  const data = await res.json()
  return {
    id: data.id,
    merchant_customer_id: data.merchant_customer_id,
    email: data.email,
    name: data.name,
  }
}

// ---- Webhook 验签 ----

/**
 * 验证 Airwallex Webhook 签名
 *
 * Airwallex 在 Webhook 请求头中附带时间戳与签名，签名为
 * HMAC-SHA256(`${timestamp}.${rawBody}`, webhook_secret)。
 * 本方法重新计算签名并与请求头中的签名做时间安全比较，同时校验时间戳
 * 新鲜度（超过 5 分钟视为重放攻击）以确认请求来源可信。
 *
 * @param rawBody 原始请求体字符串
 * @param signature 请求头中的签名字符串（可为 "t=xxx,v1=yyy" 或纯签名）
 * @param timestamp 请求头中的时间戳字符串
 * @returns 验证是否通过
 */
export async function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  timestamp: string
): Promise<boolean> {
  if (!WEBHOOK_SECRET) {
    console.warn('未配置 AIRWALLEX_WEBHOOK_SECRET，跳过 Webhook 签名验证')
    return false
  }

  // 校验时间戳新鲜度，拒绝过期请求（防重放）
  const ts = Number(timestamp)
  if (!Number.isFinite(ts) || Math.abs(Date.now() - ts) > 5 * 60 * 1000) {
    return false
  }

  // 兼容 "t=xxx,v1=yyy" 格式与纯签名格式
  const sigParts = signature.split(',').reduce<Record<string, string>>(
    (acc, part) => {
      const idx = part.indexOf('=')
      if (idx > 0) {
        acc[part.slice(0, idx).trim()] = part.slice(idx + 1).trim()
      }
      return acc
    },
    {}
  )
  const expectedSig = sigParts.v1 || signature

  // 计算期望签名：HMAC-SHA256(timestamp + "." + rawBody)
  const signedPayload = `${timestamp}.${rawBody}`
  const computed = createHmac('sha256', WEBHOOK_SECRET)
    .update(signedPayload)
    .digest('hex')

  // 时间安全比较，防止时序攻击
  return timingSafeEqualString(computed, expectedSig)
}

/**
 * 时间安全字符串比较，防止时序攻击
 * @param a 计算得到的签名
 * @param b 期望的签名
 * @returns 是否相等
 */
function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}
