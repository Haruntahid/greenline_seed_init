
import type { ReactNode } from 'react'
import SiteHeader from './SiteHeader'
import Footer from './Footer'
import FloatingAssistant from '../components/chat/FloatingAssistant'

interface PublicLayoutProps {
  children: ReactNode
}

function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <SiteHeader />

      <main>{children}</main>

      <Footer />

      <FloatingAssistant />
    </>
  )
}

export default PublicLayout
