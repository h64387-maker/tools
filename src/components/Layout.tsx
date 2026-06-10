import { NavLink, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,var(--color-toolbox-mist),transparent_34rem),linear-gradient(180deg,var(--color-toolbox-white),var(--color-toolbox-surface))] text-toolbox-ink">
      <header className="sticky top-0 z-20 border-b border-toolbox-line/80 bg-toolbox-white/85 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center px-5 py-4 lg:px-8" aria-label="主导航">
          <NavLink to="/" className="focus-ring flex items-center gap-3 rounded-full" aria-label="回到工具箱首页">
            <span className="grid size-10 place-items-center rounded-2xl bg-toolbox-ink text-sm font-black text-toolbox-white shadow-toolbox-soft">
              TO
            </span>
            <span>
              <span className="block text-base font-black tracking-tight">本地工具箱</span>
              <span className="block text-xs font-semibold text-toolbox-muted">Local Toolbox</span>
            </span>
          </NavLink>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-toolbox-line bg-toolbox-white/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-sm text-toolbox-muted md:flex-row md:items-center md:justify-between lg:px-8">
          <p>本地工具箱首页原型，当前仅提供工具入口与占位页。</p>
          <p>所有实际工具逻辑将在后续阶段实现。</p>
        </div>
      </footer>
    </div>
  )
}
