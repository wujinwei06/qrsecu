/**
 * Airwallex（空中云汇）支付套餐定义
 *
 * 定义所有可购买的订阅 / 买断套餐，供结账页与服务端路由共用。
 * 套餐价格以「主货币单位」存储（如美元 $2.49），服务端创建付款意图时
 * 再转换为最小货币单位（如美分 249）。
 */

/** 套餐计费周期类型 */
export type PlanInterval = 'monthly' | 'onetime' | 'custom'

/** 套餐接口定义 */
export interface Plan {
  /** 套餐唯一标识 */
  id: string
  /** 套餐名称 */
  name: string
  /** 价格（主货币单位，企业版为 null 表示需联系销售） */
  price: number | null
  /** 货币代码（ISO 4217，如 USD） */
  currency: string
  /** 计费周期 */
  interval: PlanInterval
  /** 套餐描述 */
  description: string
}

/**
 * 所有可用套餐
 * - pro_monthly：专业版，$2.49/月，按月订阅
 * - lifelong：终身买断版，$49 一次性买断
 * - enterprise：企业版，联系销售获取定制报价
 */
export const PLANS: Plan[] = [
  {
    id: 'pro_monthly',
    name: '专业版',
    price: 2.49,
    currency: 'USD',
    interval: 'monthly',
    description:
      '按月订阅，创作者与自由职业者首选。无限加密包裹、3 GB 储存空间、回收箱保留 15 天，可购买额外储存空间，随时取消。',
  },
  {
    id: 'lifelong',
    name: '终身买断版',
    price: 49,
    currency: 'USD',
    interval: 'onetime',
    description:
      '一次付费，永久使用。原价 $79，限时优惠 $49 买断，功能与专业版相同，享 30 天无理由退款。',
  },
  {
    id: 'enterprise',
    name: '企业版',
    price: null,
    currency: 'USD',
    interval: 'custom',
    description:
      '团队协作与品牌定制。最多 20 账号、100 GB 储存空间、回收箱保留 30 天、自定义品牌，请联系销售获取定制报价。',
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
 * 获取所有可直接购买的套餐（排除需联系销售的企业版）
 * @returns 可购买套餐列表
 */
export function getPurchasablePlans(): Plan[] {
  return PLANS.filter((p) => p.price !== null)
}

/**
 * 将主货币单位金额转换为最小货币单位（如美元转美分）
 * @param price 主货币单位金额（如 2.49）
 * @returns 最小货币单位金额（如 249）
 */
export function toMinorUnit(price: number): number {
  return Math.round(price * 100)
}
