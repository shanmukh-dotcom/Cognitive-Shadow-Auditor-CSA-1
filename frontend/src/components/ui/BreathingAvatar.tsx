import { motion } from 'framer-motion'
import { BrainCircuit, Scale } from 'lucide-react'

export type AIStatus = 'ANALYZING...' | 'SPEAKING' | 'RESTING' | 'CHALLENGING'

interface BreathingAvatarProps {
  type: 'primary' | 'shadow'
  status: AIStatus
}

export default function BreathingAvatar({ type, status }: BreathingAvatarProps) {
  const isPrimary = type === 'primary'
  const colorVar = isPrimary ? 'var(--csa-primary)' : 'var(--csa-shadow)'
  const Icon = isPrimary ? BrainCircuit : Scale

  const isSpeaking = status === 'SPEAKING' || status === 'CHALLENGING'
  const isAnalyzing = status === 'ANALYZING...'

  // Base state: soft slow breathing
  // Speaking: brighter, faster breathing
  const breathingDuration = isSpeaking ? 1.5 : isAnalyzing ? 2.5 : 4
  const breathingScale = isSpeaking ? [1, 1.05, 1] : [1, 1.02, 1]
  const glowOpacity = isSpeaking ? [0.3, 0.6, 0.3] : [0.1, 0.2, 0.1]

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Outer breathing ring */}
        <motion.div
          animate={{
            scale: breathingScale,
            opacity: glowOpacity
          }}
          transition={{
            repeat: Infinity,
            duration: breathingDuration,
            ease: "easeInOut"
          }}
          className="absolute inset-[-10px] rounded-full border-2"
          style={{
            borderColor: colorVar,
            boxShadow: `0 0 20px ${colorVar}`
          }}
        />

        {/* Inner solid avatar */}
        <div
          className="w-full h-full rounded-full flex items-center justify-center relative z-10 bg-csa-surface border border-csa-parchment/20 shadow-inner"
        >
          <Icon className="w-7 h-7 text-text-primary" />
        </div>

        {/* Status dots (only when analyzing) */}
        {isAnalyzing && (
          <div className="absolute -bottom-2 flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: colorVar }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-2 text-center">
        <div
          className="text-[10px] font-mono tracking-widest uppercase transition-colors duration-300"
          style={{ color: isSpeaking ? colorVar : 'var(--text-muted)' }}
        >
          {status}
        </div>
      </div>
    </div>
  )
}
