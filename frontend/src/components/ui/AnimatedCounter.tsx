import { useEffect, useRef, useState } from 'react'
import { useInView, useSpring, useMotionValue } from 'framer-motion'

interface AnimatedCounterProps {
  from: number
  to: number
  duration?: number
  suffix?: string
  prefix?: string
}

export default function AnimatedCounter({ from, to, suffix = '', prefix = '' }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })
  const [displayValue, setDisplayValue] = useState(from.toString())
  
  const motionValue = useMotionValue(from)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
    restDelta: 0.001
  })

  useEffect(() => {
    if (inView) {
      motionValue.set(to)
    }
  }, [motionValue, inView, to])

  useEffect(() => {
    return springValue.onChange((latest) => {
      if (ref.current) {
        setDisplayValue(Intl.NumberFormat('en-US').format(Math.floor(latest)))
      }
    })
  }, [springValue])

  return (
    <span ref={ref} className="font-mono">
      {prefix}{displayValue}{suffix}
    </span>
  )
}
