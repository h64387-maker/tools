import { type MouseEvent, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type DateTimeToolModalProps = {
  onClose: () => void
}

type TimestampUnit = 'seconds' | 'milliseconds'
type TimeZoneMode = 'local' | 'utc'
type SelectId = 'unit' | 'timeZone'

type SelectOption<T extends string> = {
  label: string
  value: T
}

type Toast = {
  message: string
  type: 'error' | 'success'
}

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
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [now, setNow] = useState(() => new Date())
  const [unit, setUnit] = useState<TimestampUnit>('seconds')
  const [timeZone, setTimeZone] = useState<TimeZoneMode>('local')
  const [openSelect, setOpenSelect] = useState<SelectId | null>(null)
  const [timestampInput, setTimestampInput] = useState('')
  const [timestampOutput, setTimestampOutput] = useState('')
  const [dateInput, setDateInput] = useState('')
  const [dateOutput, setDateOutput] = useState('')
  const [toast, setToast] = useState<Toast | null>(null)
  const [toastExiting, setToastExiting] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousBodyOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    window.setTimeout(() => closeButtonRef.current?.focus(), 0)

    return () => {
      document.body.style.overflow = previousBodyOverflow
      previouslyFocusedElement?.focus()
    }
  }, [])

  useEffect(() => {
    const getFocusableElements = () => {
      const panel = panelRef.current

      if (!panel) {
        return []
      }

      return Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusableElements = getFocusableElements()

      if (focusableElements.length === 0) {
        event.preventDefault()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
        return
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
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

  useEffect(() => {
    if (!toast) {
      return
    }

    const fadeTimer = window.setTimeout(() => setToastExiting(true), 1800)
    const removeTimer = window.setTimeout(() => setToast(null), 2200)

    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(removeTimer)
    }
  }, [toast])

  const currentTimestamp = useMemo(() => {
    const milliseconds = now.getTime()

    return unit === 'seconds' ? Math.floor(milliseconds / 1000).toString() : milliseconds.toString()
  }, [now, unit])

  const currentTimeText = useMemo(() => formatDate(now, timeZone), [now, timeZone])

  const clearToast = () => {
    setToast(null)
    setToastExiting(false)
  }
  const showToast = (type: Toast['type'], message: string) => {
    setToastExiting(false)
    setToast({ type, message })
  }

  const handleTimestampToDate = () => {
    clearToast()

    if (!timestampInput.trim()) {
      setTimestampOutput('')
      showToast('error', '请输入需要转换的时间戳')
      return
    }

    const timestamp = Number(timestampInput.trim())

    if (!Number.isFinite(timestamp)) {
      setTimestampOutput('')
      showToast('error', '时间戳只能包含数字')
      return
    }

    const milliseconds = unit === 'seconds' ? timestamp * 1000 : timestamp
    const date = new Date(milliseconds)

    if (Number.isNaN(date.getTime())) {
      setTimestampOutput('')
      showToast('error', '时间戳超出可解析范围')
      return
    }

    setTimestampOutput(formatDate(date, timeZone))
  }

  const handleDateToTimestamp = () => {
    clearToast()

    if (!dateInput.trim()) {
      setDateOutput('')
      showToast('error', '请输入需要转换的日期')
      return
    }

    const milliseconds = parseDateInput(dateInput, timeZone)

    if (Number.isNaN(milliseconds)) {
      setDateOutput('')
      showToast('error', '日期格式无法识别，请使用 YYYY-MM-DD HH:mm:ss')
      return
    }

    setDateOutput(unit === 'seconds' ? Math.floor(milliseconds / 1000).toString() : milliseconds.toString())
  }

  const handleUseCurrentTimestamp = () => {
    setTimestampInput(currentTimestamp)
    clearToast()
  }

  const handleUseCurrentDate = () => {
    setDateInput(timeZone === 'utc' ? now.toISOString().slice(0, 19).replace('T', ' ') : currentTimeText)
    clearToast()
  }

  const handleCopy = async (value: string, label: string) => {
    if (!value) {
      showToast('error', label === '日期' ? '没有可复制的日期结果' : '没有可复制的时间戳结果')
      return
    }

    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = value
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.append(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
    }

    showToast('success', `${label}结果已复制`)
  }

  const handleClearTimestampForm = () => {
    setTimestampInput('')
    setTimestampOutput('')
    clearToast()
  }

  const handleClearDateForm = () => {
    setDateInput('')
    setDateOutput('')
    clearToast()
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
      <div className="relative grid gap-2 text-sm font-bold text-slate-500">
        <span>{label}</span>
        <button
          type="button"
          onClick={() => setOpenSelect((current) => (current === id ? null : id))}
          className="focus-ring flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/80 py-2.5 pl-4 pr-4 text-left text-base font-black text-slate-100 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_18px_44px_-34px_rgb(34_211_238/0.75)] transition-all duration-200 hover:border-cyan-300/40 focus:border-cyan-300/50 focus:outline-none focus:ring-4 focus:ring-cyan-300/15"
          aria-haspopup="listbox"
          aria-expanded={openSelect === id}
        >
          <span>{selectedOption?.label}</span>
          <svg className={`size-4 text-cyan-300 transition-transform duration-200 ${openSelect === id ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {openSelect === id && (
          <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#0d121c] p-1.5 shadow-[0_28px_80px_-48px_rgb(0_0_0/0.95)]" role="listbox">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setOpenSelect(null)
                }}
                className={`flex w-full cursor-pointer items-center rounded-xl px-4 py-2.5 text-left text-sm font-black transition-colors duration-200 ${
                  option.value === value ? 'bg-cyan-300/15 text-cyan-100' : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
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

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return createPortal(
    <div className="toolbox-modal-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-6 backdrop-blur-xl sm:px-6" onClick={handleBackdropClick} role="presentation">
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="date-time-tool-title"
        className="toolbox-modal-panel relative max-h-[calc(100dvh-3rem)] w-full max-w-7xl overflow-y-auto rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/20 via-sky-500/10 to-emerald-400/20 p-px shadow-[0_40px_120px_-64px_rgb(34_211_238/0.55)]"
      >
        {toast && (
          <div
            className={`pointer-events-none absolute left-1/2 top-1/2 z-30 w-[min(calc(100%-2rem),26rem)] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${
              toastExiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
            }`}
            role="status"
            aria-live="polite"
          >
            <p
              className={`rounded-2xl border px-5 py-4 text-center text-sm font-black shadow-[0_28px_80px_-36px_rgb(0_0_0/0.95)] backdrop-blur-xl ${
                toast.type === 'success'
                  ? 'border-emerald-300/25 bg-emerald-300/15 text-emerald-100'
                  : 'border-red-400/25 bg-red-400/15 text-red-100'
              }`}
            >
              {toast.message}
            </p>
          </div>
        )}
        <div className="rounded-[2rem] bg-[#0a0f17]/95 p-4 pb-6 lg:p-5 lg:pb-6">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">Command Runner</p>
              <h2 id="date-time-tool-title" className="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
                日期时间工具
              </h2>
              <span className="mt-2 block text-sm font-semibold text-slate-500">查看当前时间，完成时间戳与日期互转</span>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="focus-ring inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition-colors duration-200 hover:bg-white/10 hover:text-white"
              aria-label="关闭日期时间工具"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="mt-4 grid gap-4">
            <div className="grid items-start gap-4 lg:grid-cols-[0.95fr_2.05fr]">
              <aside className="demo-breathing-border rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300">当前时间</p>
              <p className="mt-3 break-all text-2xl font-black tracking-tight text-white md:text-3xl">{currentTimeText}</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 shadow-[0_18px_44px_-34px_rgb(34_211_238/0.5)]">
                  <p className="text-sm font-bold text-slate-500">时间戳</p>
                  <p className="mt-2 break-all text-xl font-black text-slate-100">{currentTimestamp}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 shadow-[0_18px_44px_-34px_rgb(34_211_238/0.5)]">
                  <p className="text-sm font-bold text-slate-500">显示</p>
                  <p className="mt-2 text-xl font-black text-slate-100">{timeZone === 'local' ? '本地' : 'UTC'}</p>
                </div>
              </div>
              </aside>

              <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-3 shadow-[0_20px_60px_-48px_rgb(0_0_0/0.95)]">
                <span className="text-base font-black text-white">全局选项</span>
                <div className="grid gap-3 md:grid-cols-2">
                  {renderSelectField('unit', '时间戳单位', unit, unitOptions, setUnit)}
                  {renderSelectField('timeZone', '时区显示', timeZone, timeZoneOptions, setTimeZone)}
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
                <section className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_60px_-48px_rgb(0_0_0/0.95)]" aria-labelledby="timestamp-to-date-title">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Timestamp to Date</p>
                    <h3 id="timestamp-to-date-title" className="mt-2 text-xl font-black text-white">时间戳转日期</h3>
                  </div>

                  <label className="grid gap-2 text-sm font-bold text-slate-500">
                    时间戳输入
                    <input
                      value={timestampInput}
                      onChange={(event) => {
                        setTimestampInput(event.target.value)
                        clearToast()
                      }}
                      placeholder="例如：1704067200 或 1704067200000"
                      className="focus-ring rounded-[1.35rem] border border-white/10 bg-slate-950/80 px-5 py-3 text-base font-semibold text-slate-100 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_16px_42px_-34px_rgb(34_211_238/0.65)] transition-all duration-200 placeholder:text-slate-600 hover:border-cyan-300/40 focus:border-cyan-300/50 focus:outline-none focus:ring-4 focus:ring-cyan-300/15"
                    />
                  </label>

                  <div className="grid gap-2">
                    <button
                      type="button"
                      onClick={handleTimestampToDate}
                      className="focus-ring inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-black text-slate-950 transition-colors duration-200 hover:bg-cyan-200"
                    >
                      转换为日期
                    </button>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={handleUseCurrentTimestamp}
                        className="focus-ring inline-flex cursor-pointer items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2.5 text-sm font-black text-cyan-100 transition-colors duration-200 hover:bg-cyan-300/15"
                      >
                        填入当前时间戳
                      </button>
                      <button
                        type="button"
                        onClick={handleClearTimestampForm}
                        className="focus-ring inline-flex cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-black text-slate-200 transition-colors duration-200 hover:bg-white/10 hover:text-white"
                      >
                        清空
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-2 text-sm font-bold text-slate-500">
                    <span>日期结果</span>
                    <div className="relative">
                      <input
                        value={timestampOutput}
                        readOnly
                        placeholder="日期结果会显示在这里"
                        className="focus-ring w-full rounded-[1.35rem] border border-white/10 bg-slate-950/80 px-5 py-3 text-base font-black text-slate-100 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] transition-all duration-200 placeholder:text-slate-600 hover:border-cyan-300/40 focus:border-cyan-300/50 focus:outline-none focus:ring-4 focus:ring-cyan-300/15"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy(timestampOutput, '日期')}
                        className="absolute right-3 top-1/2 inline-flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 transition-colors duration-200 hover:bg-white/10 hover:text-white"
                        aria-label="复制日期结果"
                      >
                        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </section>

                <section className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_60px_-48px_rgb(0_0_0/0.95)]" aria-labelledby="date-to-timestamp-title">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">Date to Timestamp</p>
                    <h3 id="date-to-timestamp-title" className="mt-2 text-xl font-black text-white">日期转时间戳</h3>
                  </div>

                  <label className="grid gap-2 text-sm font-bold text-slate-500">
                    日期输入
                    <input
                      value={dateInput}
                      onChange={(event) => {
                        setDateInput(event.target.value)
                        clearToast()
                      }}
                      placeholder="例如：2024-01-01 08:00:00"
                      className="focus-ring rounded-[1.35rem] border border-white/10 bg-slate-950/80 px-5 py-3 text-base font-semibold text-slate-100 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_16px_42px_-34px_rgb(34_211_238/0.65)] transition-all duration-200 placeholder:text-slate-600 hover:border-cyan-300/40 focus:border-cyan-300/50 focus:outline-none focus:ring-4 focus:ring-cyan-300/15"
                    />
                  </label>

                  <div className="grid gap-2">
                    <button
                      type="button"
                      onClick={handleDateToTimestamp}
                      className="focus-ring inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-black text-slate-950 transition-colors duration-200 hover:bg-cyan-200"
                    >
                      转换为时间戳
                    </button>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={handleUseCurrentDate}
                        className="focus-ring inline-flex cursor-pointer items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2.5 text-sm font-black text-cyan-100 transition-colors duration-200 hover:bg-cyan-300/15"
                      >
                        填入当前日期
                      </button>
                      <button
                        type="button"
                        onClick={handleClearDateForm}
                        className="focus-ring inline-flex cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-black text-slate-200 transition-colors duration-200 hover:bg-white/10 hover:text-white"
                      >
                        清空
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-2 text-sm font-bold text-slate-500">
                    <span>时间戳结果</span>
                    <div className="relative">
                      <input
                        value={dateOutput}
                        readOnly
                        placeholder="时间戳结果会显示在这里"
                        className="focus-ring w-full rounded-[1.35rem] border border-white/10 bg-slate-950/80 px-5 py-3 text-base font-black text-slate-100 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] transition-all duration-200 placeholder:text-slate-600 hover:border-cyan-300/40 focus:border-cyan-300/50 focus:outline-none focus:ring-4 focus:ring-cyan-300/15"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy(dateOutput, '时间戳')}
                        className="absolute right-3 top-1/2 inline-flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 transition-colors duration-200 hover:bg-white/10 hover:text-white"
                        aria-label="复制时间戳结果"
                      >
                        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </section>
            </div>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  )
}
