type SearchInputProps = {
  value: string
  onChange: (value: string) => void
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="rounded-[1.75rem] border border-toolbox-line bg-toolbox-white p-2 shadow-toolbox-soft">
      <label htmlFor="tool-search" className="sr-only">
        搜索工具
      </label>
      <div className="flex items-center gap-3 rounded-[1.35rem] bg-toolbox-mist/70 px-4 py-3 ring-1 ring-toolbox-line">
        <svg className="size-5 shrink-0 text-toolbox-primary" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m20 20-4.2-4.2m1.2-5.3a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          id="tool-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="搜索工具名称、说明或关键词，例如 json"
          className="focus-ring min-w-0 flex-1 rounded-xl border-0 bg-transparent px-1 py-2 text-base font-semibold text-toolbox-ink placeholder:text-toolbox-muted/75 focus:outline-none"
        />
      </div>
    </div>
  )
}
