import { useEffect, useRef } from 'react'
import './CustomCursor.css'

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isDesktop = window.matchMedia('(pointer: fine)').matches
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (!isDesktop || prefersReducedMotion) return

    const dot = dotRef.current
    const ring = ringRef.current

    if (!dot || !ring) return

    document.documentElement.classList.add('custom-cursor-active')

    const handleMouseMove = (event: PointerEvent) => {
      const { clientX, clientY } = event

      dot.style.transform =
        `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`

      ring.style.transform =
        `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`
    }

    const handleMouseDown = () => {
      ring.classList.add('cursor-clicking')
    }

    const handleMouseUp = () => {
      ring.classList.remove('cursor-clicking')
    }

    const handlePointerOver = (event: PointerEvent) => {
      const target = event.target

      if (
        target instanceof Element &&
        target.closest(
          'a, button, input, textarea, select, [role="button"], [data-cursor-hover]',
        )
      ) {
        ring.classList.add('cursor-hovering')
      }
    }

    const handlePointerOut = (event: PointerEvent) => {
      const target = event.target

      if (
        target instanceof Element &&
        target.closest(
          'a, button, input, textarea, select, [role="button"], [data-cursor-hover]',
        )
      ) {
        ring.classList.remove('cursor-hovering')
      }
    }

    window.addEventListener('pointermove', handleMouseMove)
    window.addEventListener('pointerdown', handleMouseDown)
    window.addEventListener('pointerup', handleMouseUp)
    document.addEventListener('pointerover', handlePointerOver)
    document.addEventListener('pointerout', handlePointerOut)

    return () => {
      window.removeEventListener('pointermove', handleMouseMove)
      window.removeEventListener('pointerdown', handleMouseDown)
      window.removeEventListener('pointerup', handleMouseUp)
      document.removeEventListener('pointerover', handlePointerOver)
      document.removeEventListener('pointerout', handlePointerOut)

      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="custom-cursor-ring" aria-hidden="true" />
    </>
  )
}

export default CustomCursor