import { Link, Navigate, useParams } from 'react-router-dom'
import { tools } from '../data/tools'

export function ToolPlaceholderPage() {
  const { slug } = useParams()
  const tool = tools.find((item) => item.slug === slug)

  if (!tool) {
    return <Navigate to="/404" replace />
  }

  const placeholderDescription = tool.slug === 'json'
    ? 'JSON 工具已在首页卡片中提供弹窗体验。当前直达路由保留为导航占位，请返回首页打开 JSON 卡片使用。'
    : `${tool.description}。该工具尚未实现，当前页面仅用于验证路由、导航与视觉方向。`

  return (
    <section className="rounded-[2.5rem] border border-toolbox-line bg-toolbox-white p-6 shadow-toolbox-card md:p-10">
      <p className="inline-flex rounded-full border border-toolbox-cyan/70 bg-toolbox-mist px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-toolbox-primary">
        占位页
      </p>
      <h1 className="mt-6 text-4xl font-black tracking-tight text-toolbox-ink md:text-5xl">{tool.name}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-toolbox-muted">
        {placeholderDescription}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/"
          className="focus-ring inline-flex items-center justify-center rounded-full bg-toolbox-ink px-6 py-3 text-sm font-black text-toolbox-white transition-colors duration-200 hover:bg-toolbox-primary"
        >
          返回首页
        </Link>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="focus-ring inline-flex cursor-pointer items-center justify-center rounded-full border border-toolbox-line bg-toolbox-white px-6 py-3 text-sm font-black text-toolbox-ink transition-colors duration-200 hover:bg-toolbox-mist"
        >
          返回上一页
        </button>
      </div>
    </section>
  )
}
