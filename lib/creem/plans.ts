/**
 * Creem 支付套餐定义
 *
 * 定义所有可购买的订阅套餐，供结账页与服务端路由共用。
 * 套餐价格仅作展示用，实际扣款金额由 Creem Dashboard 中的产品定价决定。
 *
 * 重要：每个套餐需在 Creem Dashboard 中预先创建对应的产品，
 * 并将返回的 product_id 填入对应的 creemProductId 字段或环境变量。
 *
 * 套餐体系（2026-09 修订）：
 * - pro_monthly：专业版，$2.49/月，按月订阅
 * - storage：储存空间订阅，$0.9/GB/月，按需购买、可累计、可随时取消部分容量
 */

/** 套餐计费周期类型 */
export type PlanInterval = 'monthly' | 'onetime' | 'custom'

/** 套餐接口定义 */
export interface Plan {
  /** 套餐唯一标识 */
  id: string
  /** 套餐名称 */
  name: string
  /** 展示价格（主货币单位） */
  price: number | null
  /** 货币代码（ISO 4217，如 USD） */
  currency: string
  /** 计费周期 */
  interval: PlanInterval
  /** 套餐描述 */
  description: string
  /** Creem 产品 ID（在 Dashboard 中创建产品后获取，格式如 prod_xxx） */
  creemProductId: string
  /** 是否为储存订阅（按 GB 计费的弹性订阅） */
  isStorage?: boolean
  /** 储存订阅每 GB 单价（仅 isStorage 为 true 时有效） */
  pricePerGB?: number
}

/**
 * 所有可用套餐
 * - pro_monthly：专业版，$2.49/月，按月订阅
 * - storage：储存空间订阅，$0.9/GB/月，可累计叠加，按需增减
 *
 * 注意：creemProductId 为占位值，请替换为 Creem Dashboard 中的真实产品 ID。
 */
export const PLANS: Plan[] = [
  {
    id: 'pro_monthly',
    name: '专业版',
    price: 2.49,
    currency: 'USD',
    interval: 'monthly',
    description:
      '按月订阅，创作者与自由职业者首选。无限加密包裹、1 GB 储存空间、回收箱保留 28 天，可购买额外储存空间，随时取消。',
    creemProductId: process.env.CREEM_PRODUCT_PRO_MONTHLY || 'prod_pro_monthly',
  },
  {
    id: 'storage',
    name: '储存空间',
    price: 0.9,
    currency: 'USD',
    interval: 'monthly',
    description:
      '按需购买储存空间，每 1 GB 收 $0.9/月。容量可累计叠加，下月用量减少时可随时取消部分容量，灵活控制成本。',
    creemProductId: process.env.CREEM_PRODUCT_STORAGE || 'prod_storage',
    isStorage: true,
    pricePerGB: 0.9,
  },
]

/** 套餐 ID 联合类型 */
export type PlanId = (typeof PLANS)[number]['id']

/**
 * 根据套餐 ID 查找套餐
 * @param id 套餐 ID
 * @returns 套餐对象，未找到返回 undefined
 */
export function getPlanById(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id)
}

/**
 * 获取所有可直接购买的套餐
 * @returns 可购买套餐列表
 */
export function getPurchasablePlans(): Plan[] {
  return PLANS.filter((p) => p.price !== null)
}

/**
 * 获取储存订阅套餐
 * @returns 储存订阅套餐，未找到返回 undefined
 */
export function getStoragePlan(): Plan | undefined {
  return PLANS.find((p) => p.isStorage === true)
}

/**
 * 计算指定 GB 数的储存月费
 * @param gb GB 数量
 * @returns 月费金额（美元）
 */
export function calcStorageCost(gb: number): number {
  const plan = getStoragePlan()
  const unitPrice = plan?.pricePerGB ?? 0.9
  return Math.round(gb * unitPrice * 100) / 100
}
