import { NavLink, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#080b11] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_10%,rgb(34_211_238/0.16),transparent_24rem),radial-gradient(circle_at_84%_18%,rgb(34_197_94/0.12),transparent_22rem),linear-gradient(180deg,#080b11,#0b1018_42%,#07090d)]" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl grid-rows-[auto_1fr_auto] px-5 py-5 lg:px-8 lg:py-6">
        <header className="demo-page-in sticky top-5 z-20 rounded-[1.6rem] border border-white/10 bg-white/[0.035] shadow-[0_24px_80px_-56px_rgb(0_0_0/0.9)] backdrop-blur-xl">
          <nav className="flex items-center justify-between gap-4 px-4 py-3" aria-label="主导航">
            <NavLink to="/" className="focus-ring flex items-center gap-3 rounded-full" aria-label="回到工具箱首页">
              <span className="grid size-9 place-items-center rounded-xl bg-white text-sm font-black text-slate-950">
              TO
              </span>
              <span>
                <span className="block text-sm font-black tracking-tight text-white">本地工具箱</span>
                <span className="block text-xs font-semibold text-slate-500">Local Command Desk</span>
              </span>
            </NavLink>
            <div className="hidden items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-black text-emerald-200 sm:flex">
              <span className="size-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgb(110_231_183/0.8)]" />
              本地运行中
            </div>
          </nav>
        </header>

        <main className="py-6 lg:py-8">
          <Outlet />
        </main>

        <footer className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] px-4 py-4 text-sm text-slate-500 backdrop-blur-xl">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p>本地工具箱首页原型，当前仅提供工具入口与占位页。</p>
            <p>所有实际工具逻辑将在后续阶段实现。</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
