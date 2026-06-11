import { useEffect, useMemo, useRef, useState } from 'react'

type DateTimeToolModalProps = {
  onClose: () => void
}

type ConvertMode = 'timestamp-to-date' | 'date-to-timestamp'
type TimestampUnit = 'seconds' | 'milliseconds'
type TimeZoneMode = 'local' | 'utc'
type SelectId = 'mode' | 'unit' | 'timeZone'

type SelectOption<T extends string> = {
  label: string
  value: T
}

const modeOptions: SelectOption<ConvertMode>[] = [
  { label: '时间戳转日期', value: 'timestamp-to-date' },
  { label: '日期转时间戳', value: 'date-to-timestamp' },
]

const unitOptions: SelectOption<TimestampUnit>[] = [
  { label: '秒级', value: 'seconds' },
  { label: '毫秒级', value: 'milliseconds' },
]

const timeZoneOptions: SelectOption<TimeZoneMode>[] = [
  { label: '本地时间', value: 'local' },
  { label: 'UTC 时间', value: 'utc' },
]

const dateTimeFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

function formatDate(date: Date, timeZone: TimeZoneMode) {
  if (timeZone === 'utc') {
    return date.toISOString().replace('T', ' ').replace('.000Z', ' UTC')
  }

  return dateTimeFormatter.format(date)
}

function parseDateInput(value: string, timeZone: TimeZoneMode) {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return Number.NaN
  }

  const hasTimeZone = /(?:z|[+-]\d{2}:?\d{2})$/i.test(trimmedValue)
  const normalizedValue = trimmedValue.includes('T') ? trimmedValue : trimmedValue.replace(' ', 'T')

  if (timeZone === 'utc' && !hasTimeZone) {
    return new Date(`${normalizedValue}Z`).getTime()
  }

  return new Date(normalizedValue).getTime()
}

export function DateTimeToolModal({ onClose }: DateTimeToolModalProps) {
  const panelRef = useRef<HTMLElement>(null)
  const [now, setNow] = useState(() => new Date())
  const [mode, setMode] = useState<ConvertMode>('timestamp-to-date')
  const [unit, setUnit] = useState<TimestampUnit>('seconds')
  const [timeZone, setTimeZone] = useState<TimeZoneMode>('local')
  const [openSelect, setOpenSelect] = useState<SelectId | null>(null)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copyStatus, setCopyStatus] = useState('')

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) {
        setOpenSelect(null)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)

    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  const currentTimestamp = useMemo(() => {
    const milliseconds = now.getTime()

    return unit === 'seconds' ? Math.floor(milliseconds / 1000).toString() : milliseconds.toString()
  }, [now, unit])

  const currentTimeText = useMemo(() => formatDate(now, timeZone), [now, timeZone])

  const inputPlaceholder = mode === 'timestamp-to-date' ? '例如：1704067200 或 1704067200000' : '例如：2024-01-01 08:00:00'

  const handleConvert = () => {
    setError('')
    setCopyStatus('')

    if (!input.trim()) {
      setOutput('')
      setError('请输入需要转换的内容')
      return
    }

    if (mode === 'timestamp-to-date') {
      const timestamp = Number(input.trim())

      if (!Number.isFinite(timestamp)) {
        setOutput('')
        setError('时间戳只能包含数字')
        return
      }

      const milliseconds = unit === 'seconds' ? timestamp * 1000 : timestamp
      const date = new Date(milliseconds)

      if (Number.isNaN(date.getTime())) {
        setOutput('')
        setError('时间戳超出可解析范围')
        return
      }

      setOutput(formatDate(date, timeZone))
      return
    }

    const milliseconds = parseDateInput(input, timeZone)

    if (Number.isNaN(milliseconds)) {
      setOutput('')
      setError('日期格式无法识别，请使用 YYYY-MM-DD HH:mm:ss')
      return
    }

    setOutput(unit === 'seconds' ? Math.floor(milliseconds / 1000).toString() : milliseconds.toString())
  }

  const handleUseNow = () => {
    setError('')
    setCopyStatus('')

    if (mode === 'timestamp-to-date') {
      setInput(currentTimestamp)
      return
    }

    setInput(timeZone === 'utc' ? now.toISOString().slice(0, 19).replace('T', ' ') : currentTimeText)
  }

  const handleCopy = async () => {
    if (!output) {
      setCopyStatus('')
      setError('没有可复制的结果')
      return
    }

    try {
      await navigator.clipboard.writeText(output)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = output
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.append(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
    }

    setError('')
    setCopyStatus('结果已复制')
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
    setCopyStatus('')
  }

  const renderSelectField = <T extends string>(
    id: SelectId,
    label: string,
    value: T,
    options: SelectOption<T>[],
    onChange: (value: T) => void,
  ) => {
    const selectedOption = options.find((option) => option.value === value)

    return (
      <div className="relative grid gap-2 text-sm font-bold text-toolbox-muted">
        <span>{label}</span>
        <button
          type="button"
          onClick={() => setOpenSelect((current) => (current === id ? null : id))}
          className="focus-ring flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border border-toolbox-line bg-[linear-gradient(180deg,var(--color-toolbox-white),var(--color-toolbox-mist))] py-3 pl-4 pr-4 text-left text-base font-black text-toolbox-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.95),0_16px_36px_-30px_rgb(8_145_178/0.8)] transition-all duration-200 hover:border-toolbox-cyan focus:border-toolbox-cyan focus:outline-none focus:ring-4 focus:ring-toolbox-cyan/20"
          aria-haspopup="listbox"
          aria-expanded={openSelect === id}
        >
          <span>{selectedOption?.label}</span>
          <svg className={`size-4 text-toolbox-primary transition-transform duration-200 ${openSelect === id ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {openSelect === id && (
          <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-toolbox-line bg-toolbox-white p-1.5 shadow-toolbox-card" role="listbox">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setOpenSelect(null)
                }}
                className={`flex w-full cursor-pointer items-center rounded-xl px-4 py-2.5 text-left text-sm font-black transition-colors duration-200 ${
                  option.value === value ? 'bg-toolbox-ink text-toolbox-white' : 'text-toolbox-ink hover:bg-toolbox-mist'
                }`}
                role="option"
                aria-selected={option.value === value}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="toolbox-modal-backdrop fixed inset-0 z-50 grid place-items-center bg-toolbox-ink/35 px-6 py-6 backdrop-blur-sm" role="presentation">
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="date-time-tool-title"
        className="toolbox-modal-panel w-full max-w-6xl rounded-[2rem] border border-toolbox-line bg-toolbox-white p-6 shadow-toolbox-card"
      >
        <div className="flex items-center justify-between border-b border-toolbox-line pb-4">
          <div className="flex items-end gap-4">
            <h2 id="date-time-tool-title" className="text-3xl font-black tracking-tight text-toolbox-ink">
              日期时间工具
            </h2>
            <span className="pb-1 text-sm font-semibold text-toolbox-muted">查看当前时间，完成时间戳与日期互转</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="focus-ring inline-flex size-10 cursor-pointer items-center justify-center rounded-xl border border-toolbox-line bg-toolbox-white text-toolbox-muted transition-colors duration-200 hover:bg-toolbox-mist hover:text-toolbox-ink"
            aria-label="关闭日期时间工具"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="mt-4 grid items-start gap-6 lg:grid-cols-[0.95fr_1.45fr]">
          <aside className="rounded-[1.5rem] border border-toolbox-line bg-[linear-gradient(145deg,var(--color-toolbox-mist),var(--color-toolbox-white))] p-5 shadow-[inset_0_1px_0_rgb(255_255_255/0.9)]">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-toolbox-primary">当前时间</p>
            <p className="mt-3 break-all text-3xl font-black tracking-tight text-toolbox-ink">{currentTimeText}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-toolbox-white/85 p-4 shadow-[0_18px_40px_-32px_rgb(8_145_178/0.65)] ring-1 ring-toolbox-line">
                <p className="text-sm font-bold text-toolbox-muted">时间戳</p>
                <p className="mt-2 break-all text-xl font-black text-toolbox-ink">{currentTimestamp}</p>
              </div>
              <div className="rounded-2xl bg-toolbox-white/85 p-4 shadow-[0_18px_40px_-32px_rgb(8_145_178/0.65)] ring-1 ring-toolbox-line">
                <p className="text-sm font-bold text-toolbox-muted">显示</p>
                <p className="mt-2 text-xl font-black text-toolbox-ink">{timeZone === 'local' ? '本地' : 'UTC'}</p>
              </div>
            </div>
          </aside>

          <div className="grid gap-4">
            <div className="grid gap-3 rounded-[1.5rem] border border-toolbox-line bg-[linear-gradient(180deg,var(--color-toolbox-white),var(--color-toolbox-surface))] p-4 shadow-[0_20px_50px_-42px_rgb(8_145_178/0.75)]">
              <span className="text-base font-black text-toolbox-ink">选项</span>
              <div className="grid grid-cols-3 gap-3">
                {renderSelectField('mode', '转换类型', mode, modeOptions, (value) => {
                  setMode(value)
                  handleClear()
                })}
                {renderSelectField('unit', '时间戳单位', unit, unitOptions, setUnit)}
                {renderSelectField('timeZone', '时区显示', timeZone, timeZoneOptions, setTimeZone)}
              </div>
            </div>

            <label className="grid gap-2 text-sm font-bold text-toolbox-muted">
              输入框
              <input
                value={input}
                onChange={(event) => {
                  setInput(event.target.value)
                  setError('')
                  setCopyStatus('')
                }}
                placeholder={inputPlaceholder}
                className="focus-ring rounded-[1.35rem] border border-toolbox-line bg-[linear-gradient(180deg,var(--color-toolbox-white),var(--color-toolbox-surface))] px-5 py-4 text-base font-semibold text-toolbox-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.95),0_16px_36px_-32px_rgb(8_145_178/0.7)] transition-all duration-200 placeholder:text-toolbox-muted/70 hover:border-toolbox-cyan focus:border-toolbox-cyan focus:outline-none focus:ring-4 focus:ring-toolbox-cyan/20"
              />
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleConvert}
                className="focus-ring inline-flex cursor-pointer items-center justify-center rounded-full bg-toolbox-ink px-6 py-3 text-base font-black text-toolbox-white transition-colors duration-200 hover:bg-toolbox-primary"
              >
                开始转换
              </button>
              <button
                type="button"
                onClick={handleUseNow}
                className="focus-ring inline-flex cursor-pointer items-center justify-center rounded-full border border-toolbox-cyan bg-toolbox-mist px-6 py-3 text-base font-black text-toolbox-primary transition-colors duration-200 hover:bg-toolbox-cyan/20"
              >
                填入当前时间
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="focus-ring inline-flex cursor-pointer items-center justify-center rounded-full border border-toolbox-line bg-toolbox-white px-6 py-3 text-base font-black text-toolbox-ink transition-colors duration-200 hover:bg-toolbox-mist"
              >
                清空内容
              </button>
            </div>

            {(error || copyStatus) && (
              <p className={`rounded-2xl px-4 py-3 text-sm font-bold ${error ? 'bg-red-50 text-red-700 ring-1 ring-red-100' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'}`}>
                {error || copyStatus}
              </p>
            )}

            <label className="grid gap-2 text-sm font-bold text-toolbox-muted">
              输出框
              <textarea
                value={output}
                readOnly
                placeholder="转换结果会显示在这里"
                className="focus-ring min-h-24 resize-y rounded-[1.35rem] border border-toolbox-line bg-[linear-gradient(180deg,var(--color-toolbox-mist),var(--color-toolbox-white))] px-5 py-4 text-base font-black text-toolbox-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.95)] transition-all duration-200 placeholder:text-toolbox-muted/70 hover:border-toolbox-cyan focus:border-toolbox-cyan focus:outline-none focus:ring-4 focus:ring-toolbox-cyan/20"
              />
            </label>

            <button
              type="button"
              onClick={handleCopy}
              className="focus-ring inline-flex w-fit cursor-pointer items-center justify-center rounded-full bg-toolbox-green px-6 py-3 text-base font-black text-toolbox-white transition-colors duration-200 hover:bg-emerald-600"
            >
              复制结果
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
