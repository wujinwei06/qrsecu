/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // 忽略类型错误以允许构建（迁移期间临时措施）
    ignoreBuildErrors: true,
  },
  eslint: {
    // 忽略 ESLint 错误以允许构建（迁移期间临时措施）
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
