import { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import clsx from 'clsx'

interface TensionThermometerProps {
  score: number // 0-100
}

export default function TensionThermometer({ score }: TensionThermometerProps) {
  const [displayScore, setDisplayScore] = useState(0)

  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 18,
    stiffness: 80,
    restDelta: 0.001
  })

  useEffect(() => {
    // 1-second delay so it triggers after AI input text typing completes
    const timer = setTimeout(() => {
      motionValue.set(score)
    }, 1000)
    return () => clearTimeout(timer)
  }, [score, motionValue])

  useEffect(() => {
    return springValue.onChange((latest) => {
      setDisplayScore(Math.floor(latest))
    })
  }, [springValue])

  const getStatus = (val: number) => {
    if (val < 40) return { label: 'RESOLVED', color: 'text-csa-arbiter', glow: 'shadow-[0_0_15px_var(--csa-arbiter)]', bg: 'bg-csa-arbiter' }
    if (val < 70) return { label: 'CONTESTED', color: 'text-csa-parchment', glow: 'shadow-[0_0_15px_var(--csa-parchment)]', bg: 'bg-csa-parchment' }
    return { label: 'CONFLICT DETECTED', color: 'text-csa-shadow', glow: 'shadow-[0_0_20px_var(--csa-shadow)]', bg: 'bg-csa-shadow' }
  }

  const currentStatus = getStatus(displayScore)

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4 flex flex-col items-center">
        <span className="text-4xl font-mono text-text-primary">{displayScore}</span>
        <span className="text-[10px] uppercase tracking-widest text-text-muted mt-1 font-inter">Tension</span>
      </div>
      
      <div className="relative w-10 h-[300px] bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden p-1">
        <div className="absolute inset-1 overflow-hidden rounded-full flex items-end">
          <motion.div 
            className="w-full rounded-full relative overflow-hidden transition-colors duration-300"
            style={{ 
              height: springValue.get() + '%',
              backgroundColor: currentStatus.color.replace('text-', 'var(--') + ')' 
            }}
            animate={{ height: `${score}%` }}
            transition={{ type: "spring", damping: 18, stiffness: 80, delay: 1 }}
          >
             <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-transparent via-[rgba(255,255,255,0.4)] to-transparent translate-y-[100%] animate-[shimmer_2s_infinite]" />
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className={clsx(
          "mt-6 px-5 py-2 rounded border border-csa-parchment/20 bg-csa-surface text-sm font-cinzel font-bold text-center",
          currentStatus.color,
          score >= 70 ? 'animate-pulse' : ''
        )}
        style={{
          textShadow: `0 0 10px ${currentStatus.color.replace('text-', 'var(--')})`
        }}
      >
        {currentStatus.label}
      </motion.div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
      `}</style>
    </div>
  )
}
