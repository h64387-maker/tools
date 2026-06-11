type SearchInputProps = {
  value: string
  onChange: (value: string) => void
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="demo-command-focus rounded-[1.4rem] border border-cyan-300/20 bg-slate-950/80 p-3 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_30px_90px_-56px_rgb(34_211_238/0.7)]">
      <label htmlFor="tool-search" className="sr-only">
        搜索工具
      </label>
      <div className="flex items-center gap-3 rounded-[1rem] border border-white/10 bg-white/[0.045] px-4 py-4">
        <svg className="size-5 shrink-0 text-cyan-300" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m5 8 4 4-4 4m7 0h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <input
          id="tool-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="输入命令或搜索工具，例如 timestamp / json"
          className="focus-ring min-w-0 flex-1 rounded-xl border-0 bg-transparent px-1 py-2 text-base font-semibold text-slate-100 placeholder:text-slate-500 focus:outline-none"
        />
        <kbd className="hidden rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs font-black text-slate-500 sm:inline-flex">⌘ K</kbd>
      </div>
    </div>
  )
}
