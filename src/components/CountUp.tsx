import { useEffect, useRef, useState } from 'react'

interface Props {
  to: number
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
}

export default function CountUp({ to, decimals = 0, prefix = '', suffix = '', duration = 1.6 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const [val, setVal] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true
            const start = performance.now()
            const tick = (now: number) => {
              const p = Math.min((now - start) / (duration * 1000), 1)
              const eased = 1 - Math.pow(1 - p, 3)
              setVal(to * eased)
              if (p < 1) requestAnimationFrame(tick)
              else setVal(to)
            }
            requestAnimationFrame(tick)
          }
        })
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [to, duration])

  return (
    <span ref={ref}>
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  )
}
