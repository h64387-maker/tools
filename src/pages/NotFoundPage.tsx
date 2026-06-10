import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="rounded-[2.5rem] border border-toolbox-line bg-toolbox-white p-6 text-center shadow-toolbox-card md:p-10">
      <p className="text-sm font-black uppercase tracking-[0.26em] text-toolbox-primary">404</p>
      <h1 className="mt-4 text-4xl font-black tracking-tight text-toolbox-ink md:text-5xl">页面不存在</h1>
      <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-toolbox-muted">
        当前地址没有对应页面。请返回首页，从已确认的四个工具入口继续浏览。
      </p>
      <Link
        to="/"
        className="focus-ring mt-8 inline-flex items-center justify-center rounded-full bg-toolbox-ink px-6 py-3 text-sm font-black text-toolbox-white transition-colors duration-200 hover:bg-toolbox-primary"
      >
        回到首页
      </Link>
    </section>
  )
}
