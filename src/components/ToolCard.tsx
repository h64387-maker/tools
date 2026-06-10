import { Link } from 'react-router-dom'
import type { Tool } from '../data/tools'

type ToolCardProps = {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      to={tool.path}
      className="focus-ring group rounded-[2rem] border border-toolbox-line bg-toolbox-white p-6 shadow-toolbox-soft transition-all duration-200 hover:-translate-y-1 hover:border-toolbox-cyan hover:shadow-toolbox-card"
    >
      <div className="flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="grid size-12 place-items-center rounded-2xl bg-toolbox-mist text-sm font-black text-toolbox-primary ring-1 ring-toolbox-cyan/50">
            {tool.name.slice(0, 2)}
          </div>
          <span className="rounded-full bg-toolbox-mist px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-toolbox-primary">
            {tool.slug}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-black tracking-tight text-toolbox-ink">{tool.name}</h3>
          <p className="mt-3 text-sm leading-6 text-toolbox-muted">{tool.description}</p>
        </div>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {tool.keywords.slice(0, 4).map((keyword) => (
            <span key={keyword} className="rounded-full border border-toolbox-line px-3 py-1 text-xs font-bold text-toolbox-muted">
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
