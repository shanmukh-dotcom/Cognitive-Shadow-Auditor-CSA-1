import { useState, useEffect } from 'react'

interface TypewriterProps {
  text: string
  speed?: number
  delay?: number
  onComplete?: () => void
}

export default function Typewriter({ text, speed = 18, delay = 0, onComplete }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [hasStarted, setHasStarted] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasStarted(true)
      setIsTyping(true)
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!hasStarted) return

    let i = 0
    // Reset if text changes
    setDisplayedText('')
    setIsTyping(true)

    const intervalId = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1))
      i++
      if (i >= text.length) {
        clearInterval(intervalId)
        setIsTyping(false)
        if (onComplete) onComplete()
      }
    }, speed)

    return () => clearInterval(intervalId)
  }, [text, speed, hasStarted, onComplete])

  return (
    <span className="font-mono text-[13px] text-csa-parchment/90 whitespace-pre-wrap">
      {displayedText}
      <span 
        className={`inline-block w-[0.6em] h-[1em] bg-current ml-1 align-middle transition-opacity duration-300 ${isTyping ? 'animate-pulse opacity-100' : 'opacity-0'}`} 
      />
    </span>
  )
}
