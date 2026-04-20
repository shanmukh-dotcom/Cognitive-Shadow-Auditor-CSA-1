import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface CircularGaugeProps {
  value: number // 0-100
  baseColor: string
  label?: string
  isDynamic?: boolean // if true, uses red->gold->primary transition
}

export default function CircularGauge({ value, baseColor, label, isDynamic = false }: CircularGaugeProps) {
  const size = 130
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (value / 100) * circumference
  
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 2000
    const startTime = performance.now()

    const animateValue = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3) 
      const currentVal = Math.floor(easeOut * value)
      setDisplayValue(currentVal)

      if (progress < 1) {
        requestAnimationFrame(animateValue)
      }
    }
    requestAnimationFrame(animateValue)
  }, [value])

  const dynamicColor = displayValue < 40 ? '#FF4757' : displayValue < 70 ? '#C9A84C' : '#7B6FFF'
  const currentColor = isDynamic ? dynamicColor : baseColor

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg fill="none" viewBox={`0 0 ${size} ${size}`} className="absolute top-0 left-0 -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="stroke-csa-parchment/10"
          />
          {/* Animated Foreground Circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={currentColor}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{ transition: 'stroke 0.3s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[28px] font-mono text-text-primary" style={{ color: currentColor }}>{displayValue}%</span>
        </div>
      </div>
      {label && <span className="mt-4 text-[11px] font-cinzel uppercase tracking-wider text-text-muted">{label}</span>}
    </div>
  )
}
