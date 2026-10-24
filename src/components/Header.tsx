import { branding } from '../config'
import { SpeakerIcon } from './icons'

type HeaderProps = {
  muted: boolean
  onToggleMute: () => void
}

export function Header({ muted, onToggleMute }: HeaderProps) {
  return (
    <header className="site-header">
      <button
        type="button"
        className="icon-button absolute top-[clamp(4px,1vh,12px)] right-[clamp(8px,3vw,20px)] z-10"
        aria-label={muted ? 'Unmute sound' : 'Mute sound'}
        aria-pressed={muted}
        onClick={onToggleMute}
      >
        <SpeakerIcon muted={muted} className="h-[1.35rem] w-[1.35rem]" />
      </button>

      <p className="mark">{branding.mark}</p>
      <p className="zone">{branding.zone}</p>
      <p className="tagline">{branding.tagline}</p>
      <span className="accent mx-auto mt-[0.55vh] block h-[3px] w-[min(18%,72px)] rounded-full bg-sun" />
    </header>
  )
}
