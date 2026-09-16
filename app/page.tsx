import Link from 'next/link';
import Hero from './components/Hero';
import Features from './components/Features';
import UseCases from './components/UseCases';
import HowItWorks from './components/HowItWorks';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <UseCases />
      <HowItWorks />

      {/* 创建包裹入口 */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-headline text-gray-900 mb-4">
            立即创建你的安全二维码包裹
          </h2>
          <p className="text-gray-500 text-base mb-8 max-w-xl mx-auto">
            将文本、文件和媒体封装成自过期、密码保护的二维码包裹。你控制谁能打开、打开几次、有效期多长。
          </p>
          <Link href="/create-package" className="btn-primary inline-block">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              开始创建
            </span>
          </Link>
        </div>
      </section>

      <CTA />
      <Footer />
    </>
  );
}
