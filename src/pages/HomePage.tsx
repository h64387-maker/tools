import { useMemo, useState } from 'react'
import { SearchInput } from '../components/SearchInput'
import { ToolCard } from '../components/ToolCard'
import { tools } from '../data/tools'

export function HomePage() {
  const [query, setQuery] = useState('')

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()

    if (!normalizedQuery) {
      return tools
    }

    return tools.filter((tool) => {
      const searchableText = [tool.name, tool.description, ...tool.keywords]
        .join(' ')
        .toLocaleLowerCase()

      return searchableText.includes(normalizedQuery)
    })
  }, [query])

  return (
    <div className="grid gap-8">
      <section className="grid gap-6" aria-labelledby="tool-list-title">
        <div className="grid gap-4 md:grid-cols-[1fr_minmax(20rem,28rem)] md:items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-toolbox-ink md:text-4xl">
              开发者工具箱
            </h1>
            <p className="mt-2 text-sm leading-6 text-toolbox-muted">
              简洁高效的在线工具集合，数据本地处理，无需服务器，即开即用。
            </p>
          </div>
          <SearchInput value={query} onChange={setQuery} />
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-toolbox-cyan bg-toolbox-mist/70 p-8 text-center">
            <h3 className="text-xl font-black text-toolbox-ink">未找到匹配工具</h3>
            <p className="mt-3 text-sm text-toolbox-muted">请尝试其他关键词或清空搜索</p>
          </div>
        )}
      </section>
    </div>
  )
}
