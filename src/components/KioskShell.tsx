import { useEffect, type ReactNode } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'

type KioskShellProps = {
  muted: boolean
  onToggleMute: () => void
  children: ReactNode
}

export function KioskShell({ muted, onToggleMute, children }: KioskShellProps) {
  useEffect(() => {
    const blockPinch = (event: TouchEvent) => {
      if (event.touches.length > 1) event.preventDefault()
    }
    document.addEventListener('touchmove', blockPinch, { passive: false })
    return () => document.removeEventListener('touchmove', blockPinch)
  }, [])

  return (
    <div className="kiosk relative" onContextMenu={(event) => event.preventDefault()}>
      <Header muted={muted} onToggleMute={onToggleMute} />
      <main className="kiosk-main">{children}</main>
      <Footer />
    </div>
  )
}
