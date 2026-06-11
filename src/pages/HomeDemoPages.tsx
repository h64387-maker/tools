import { Link } from 'react-router-dom'

type DemoVariant = 'command' | 'ops' | 'personal'

type HomeDemoPageProps = {
  variant: DemoVariant
}

const demoLinks = [
  { label: 'Command Desk', path: '/demos/home-1' },
  { label: 'Ops Grid', path: '/demos/home-2' },
  { label: 'Personal Stack', path: '/demos/home-3' },
]

const tools = ['Date Time', 'Hash MD5', 'Base64', 'JSON Lens']

const gradients = {
  command: 'from-cyan-400/20 via-sky-500/10 to-emerald-400/20',
  ops: 'from-violet-400/20 via-slate-700/10 to-cyan-300/20',
  personal: 'from-emerald-300/20 via-slate-700/10 to-amber-300/20',
}

function DemoShell({ variant, children }: HomeDemoPageProps & { children: React.ReactNode }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080b11] text-slate-100">
      <div className={`pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_10%,rgb(34_211_238/0.16),transparent_24rem),radial-gradient(circle_at_84%_18%,rgb(34_197_94/0.12),transparent_22rem),linear-gradient(180deg,#080b11,#0b1018_42%,#07090d)]`} />
      <div className="relative mx-auto grid min-h-screen max-w-7xl grid-rows-[auto_1fr] px-6 py-6 lg:px-8">
        <header className="demo-page-in flex items-center justify-between rounded-[1.6rem] border border-white/10 bg-white/[0.035] px-4 py-3 shadow-[0_24px_80px_-56px_rgb(0_0_0/0.9)] backdrop-blur-xl">
          <Link to="/" className="focus-ring flex items-center gap-3 rounded-full" aria-label="返回当前首页">
            <span className="grid size-9 place-items-center rounded-xl bg-white text-sm font-black text-slate-950">TO</span>
            <span>
              <span className="block text-sm font-black tracking-tight">Local Toolbox</span>
              <span className="block text-xs font-semibold text-slate-500">Hacker desktop demos</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1" aria-label="Demo 页面">
            {demoLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`focus-ring rounded-full px-3 py-2 text-xs font-black transition-colors duration-200 ${
                  link.path.endsWith(variant === 'command' ? '1' : variant === 'ops' ? '2' : '3')
                    ? 'border border-cyan-300/30 bg-cyan-300/15 text-cyan-100 shadow-[0_14px_40px_-24px_rgb(34_211_238/0.9)]'
                    : 'text-slate-400 hover:bg-white/10 hover:text-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </header>
        <section className={`demo-page-in relative mt-6 self-start rounded-[2rem] border border-white/10 bg-gradient-to-br ${gradients[variant]} p-px shadow-[0_40px_120px_-64px_rgb(34_211_238/0.55)]`}>
          <div className="rounded-[2rem] bg-[#0a0f17]/95 p-5 lg:p-7">
            {children}
            <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 md:grid-cols-[1fr_auto] md:items-center">
              <div className="flex flex-wrap gap-2">
                {['local-only', 'command-ready', 'private runtime', 'no cloud sync'].map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-black text-slate-400">
                    {item}
                  </span>
                ))}
              </div>
              <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-black text-emerald-200">
                desktop status: armed
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function CommandSearch() {
  return (
    <div className="demo-command-focus rounded-[1.4rem] border border-cyan-300/20 bg-slate-950/80 p-3 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_30px_90px_-56px_rgb(34_211_238/0.7)]">
      <div className="flex items-center gap-3 rounded-[1rem] border border-white/10 bg-white/[0.045] px-4 py-4">
        <svg className="size-5 text-cyan-300" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m5 8 4 4-4 4m7 0h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="flex-1 text-sm font-semibold text-slate-300">输入命令或搜索工具，例如 convert timestamp</span>
        <kbd className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs font-black text-slate-400">⌘ K</kbd>
      </div>
    </div>
  )
}

function ToolPill({ name }: { name: string }) {
  return <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-black text-slate-300">{name}</span>
}

export function HomeDemoPage({ variant }: HomeDemoPageProps) {
  if (variant === 'ops') {
    return (
      <DemoShell variant="ops">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-5">
            <div className="demo-breathing-border rounded-[1.8rem] border border-white/10 bg-[#0f1623] p-7">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">Ops Grid</p>
              <h1 className="mt-4 max-w-3xl text-5xl font-black tracking-tight text-white">把常用工具编排成一张开发者控制台。</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">面向工作流而不是工具清单，所有卡片围绕运行状态、最近动作和快速命令组织。</p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {['最近使用', '本地执行', '无需后端'].map((item, index) => (
                <div key={item} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 transition-transform duration-200 hover:-translate-y-1">
                  <span className="text-3xl font-black text-white">0{index + 1}</span>
                  <p className="mt-5 text-sm font-black text-slate-200">{item}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{index === 0 ? '最近一次工具会话随手继续。' : index === 1 ? '输入即执行，结果保留在本地。' : '无需账号、接口或云端同步。'}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-5">
            <CommandSearch />
            <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm font-black text-slate-300">Tool Router</p>
              <div className="mt-5 grid gap-3">
                {tools.map((tool) => (
                  <div key={tool} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
                    <span className="font-black text-white">{tool}</span>
                    <span className="text-xs font-black text-emerald-300">ready</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DemoShell>
    )
  }

  if (variant === 'personal') {
    return (
      <DemoShell variant="personal">
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[1.8rem] border border-white/10 bg-[#101712] p-7">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-300">Personal Stack</p>
            <h1 className="mt-4 text-5xl font-black tracking-tight text-white">像个人黑客桌面一样启动工具。</h1>
            <p className="mt-4 text-base leading-7 text-slate-400">暗色桌面、个性化状态和轻量 Bento 卡片，强调“我的工具栈”。</p>
            <div className="mt-7 flex flex-wrap gap-2">{tools.map((tool) => <ToolPill key={tool} name={tool} />)}</div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="demo-breathing-border rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-6 md:col-span-2">
              <CommandSearch />
            </div>
            {['时间转换会话', 'Hash Scratchpad', 'JSON 观察台', 'Base64 Pipe'].map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-white/10 bg-slate-950/65 p-5 transition-transform duration-200 hover:-translate-y-1">
                <p className="font-black text-white">{item}</p>
                <p className="mt-3 text-sm leading-6 text-slate-500">保留最后一次上下文，下一次打开直接继续。</p>
              </div>
            ))}
          </div>
        </div>
      </DemoShell>
    )
  }

  return (
    <DemoShell variant="command">
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-5">
          <div className="rounded-[1.8rem] border border-white/10 bg-[#0d121c] p-8">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">Command Desk</p>
            <h1 className="mt-5 max-w-4xl text-6xl font-black tracking-tight text-white">不是工具列表，是你的本地命令桌面。</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">把日期、Hash、编码、JSON 处理收束到一个 Raycast 式入口，打开即输入，结果在本地完成。</p>
          </div>
          <CommandSearch />
        </div>
        <div className="grid gap-5">
          <div className="demo-breathing-border rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm font-black text-slate-300">Bento Launchpad</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {tools.map((tool) => (
                <div key={tool} className="min-h-28 rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4 transition-transform duration-200 hover:-translate-y-1">
                  <p className="font-black text-white">{tool}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">local first</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm font-black text-slate-300">Session</p>
            <p className="mt-4 text-4xl font-black text-white">04</p>
            <p className="mt-2 text-sm text-slate-500">tools pinned for today</p>
          </div>
        </div>
      </div>
    </DemoShell>
  )
}
