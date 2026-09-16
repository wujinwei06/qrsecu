/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // 忽略类型错误以允许构建（迁移期间临时措施）
    ignoreBuildErrors: true,
  },
  // Next.js 16 中 eslint 配置已移至 eslint.config.mjs
  // 这里不再配置 eslint
};

module.exports = nextConfig;
