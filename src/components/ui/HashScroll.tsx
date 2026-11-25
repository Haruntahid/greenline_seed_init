
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function HashScroll() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(
        decodeURIComponent(hash.slice(1)),
      )

      target?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })

    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}

export default HashScroll
