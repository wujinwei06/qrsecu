# Qrsecu Vercel 部署指南

## 一、Vercel 项目设置

在 Vercel 后台 → Settings → General 中确认：

| 设置项 | 正确值 |
|--------|--------|
| Framework Preset | Next.js |
| Root Directory | （留空，使用根目录）|
| Build Command | 留空（使用默认 `next build`）|
| Output Directory | 留空（使用默认 `.next`）|
| Install Command | 留空（使用默认 `npm install`）|
| Node.js Version | 20.x 或 22.x |

> 如果 Framework Preset 显示为 "Vite" 或其他，请手动改为 "Next.js"。

## 二、环境变量

在 Vercel 后台 → Settings → Environment Variables 中添加：

### 必须配置（网站才能正常打开）

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `AUTH_SECRET` | NextAuth.js 加密密钥 | 随机32位字符串（可用 `openssl rand -base64 32` 生成） |
| `AUTH_URL` | 认证回调 URL | `https://qrsecu.com` |
| `DATABASE_URL` | PostgreSQL 数据库连接字符串 | `postgresql://user:pass@host:port/dbname` |

### Cloudflare R2 存储（上传功能）

| 变量名 | 说明 |
|--------|------|
| `R2_ACCOUNT_ID` | Cloudflare 账户 ID |
| `R2_ACCESS_KEY_ID` | R2 API Token Access Key ID |
| `R2_SECRET_ACCESS_KEY` | R2 API Token Secret Key |
| `R2_BUCKET_NAME` | R2 存储桶名称（如 `qrsecu`） |
| `R2_PUBLIC_URL` | R2 公开访问域名（如 `https://pub-xxx.r2.dev`） |

### Creem 支付（订阅功能）

| 变量名 | 说明 |
|--------|------|
| `CREEM_API_KEY` | Creem API Key（生产 `creem_` 前缀，测试 `creem_test_` 前缀） |
| `CREEM_WEBHOOK_SECRET` | Creem Webhook 签名验证密钥 |
| `CREEM_PRODUCT_PRO_MONTHLY` | 专业版月度订阅产品 ID |
| `CREEM_PRODUCT_STORAGE` | 储存空间订阅产品 ID |

> 测试环境使用 `https://test-api.creem.io/v1`，生产环境使用 `https://api.creem.io/v1`。
> 如果设置了 `CREEM_BASE_URL`，会覆盖自动检测。

### Next.js 公开变量（前端可访问）

| 变量名 | 说明 |
|--------|------|
| `NEXT_PUBLIC_R2_PUBLIC_URL` | R2 公开访问域名（同 `R2_PUBLIC_URL`） |
| `NEXT_PUBLIC_CREEM_PRODUCT_PRO_MONTHLY` | 专业版产品 ID（同 `CREEM_PRODUCT_PRO_MONTHLY`） |
| `NEXT_PUBLIC_CREEM_PRODUCT_STORAGE` | 储存产品 ID（同 `CREEM_PRODUCT_STORAGE`） |

## 三、DNS 配置（阿里云）

在阿里云域名控制台 → 解析设置中：

| 记录类型 | 主机记录 | 记录值 |
|---------|---------|--------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

> 删除所有旧的指向阿里云 CDN（昆仑架构）或秒哒的 CNAME 记录。
> 邮箱相关的 MX、SPF、mail、smtp、pop3、imap 记录保留不动。

## 四、Vercel 自定义域名

在 Vercel 项目 → Settings → Domains 中添加：
1. `qrsecu.com` → 308 重定向到 www
2. `www.qrsecu.com` → Production 分支

## 五、部署检查清单

- [ ] Vercel Framework Preset 设置为 Next.js
- [ ] `AUTH_SECRET` 已配置
- [ ] `DATABASE_URL` 已配置
- [ ] DNS 已指向 Vercel（A 记录 + CNAME）
- [ ] Vercel 自定义域名已添加
- [ ] SSL 证书已自动签发（DNS 生效后自动）
- [ ] Creem 支付变量已配置（可选，网站可先上线）
- [ ] Cloudflare R2 变量已配置（可选，上传功能需要）
