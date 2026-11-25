import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  duration?: number
}

function AnimatedCounter({
  value,
  suffix = '',
  duration = 2000,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = counterRef.current

    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

if (prefersReducedMotion) {
  const animationFrame = requestAnimationFrame(() => {
    setCount(value)
  })

  return () => cancelAnimationFrame(animationFrame)
}

    let animationFrame = 0
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1,
      )

      const easedProgress = 1 - Math.pow(1 - progress, 4)

      setCount(Math.floor(easedProgress * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [isVisible, value, duration])

  return (
    <span ref={counterRef}>
      {count}
      {suffix}
    </span>
  )
}

export default AnimatedCounter