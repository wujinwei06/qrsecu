import type { Metadata } from "next";
import Providers from "./providers";
import Navbar from "./components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qrsecu - 安全二维码生成器",
  description: "将你的数据加密为带有密码保护和有效追踪的安全二维码",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
