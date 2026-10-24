import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GamePlayScreen } from './components/GamePlayScreen'
import { KioskShell } from './components/KioskShell'
import { WheelScreen, type WheelPhase } from './components/WheelScreen'
import { branding } from './config'
import {
  buildWheelSegments,
  DEFAULT_GAMES,
  mergeGameUrls,
  type WheelGame,
} from './data/games'

const SPIN_MS = 4200
const EXTRA_TURNS = 5

type RuntimeConfig = {
  idleTimeoutSeconds?: number
  games?: { id: string; url: string }[]
}

function pickSegmentIndex(total: number): number {
  return Math.floor(Math.random() * total)
}

function targetRotation(current: number, segmentIndex: number, total: number): number {
  const sweep = 360 / total
  const mid = segmentIndex * sweep + sweep / 2
  const normalized = ((current % 360) + 360) % 360
  const desired = ((-mid % 360) + 360) % 360
  let delta = desired - normalized
  if (delta <= 0) delta += 360
  return current + EXTRA_TURNS * 360 + delta
}

async function probeGame(url: string): Promise<boolean> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), 2500)
  try {
    const res = await fetch(url, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store',
      signal: controller.signal,
    })
    // no-cors opaque responses still mean the host answered
    void res
    return true
  } catch {
    return false
  } finally {
    window.clearTimeout(timer)
  }
}

export default function App() {
  const [games, setGames] = useState<WheelGame[]>(DEFAULT_GAMES)
  const [idleTimeoutSeconds, setIdleTimeoutSeconds] = useState(45)
  const [muted, setMuted] = useState(false)
  const [phase, setPhase] = useState<WheelPhase>('ready')
  const [rotation, setRotation] = useState(0)
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [playUrl, setPlayUrl] = useState('')
  const [playLoading, setPlayLoading] = useState(false)
  const [playError, setPlayError] = useState<string | null>(null)
  const idleTimer = useRef<number | null>(null)
  const shellRef = useRef<HTMLDivElement>(null)

  const segments = useMemo(() => buildWheelSegments(games), [games])
  const winner =
    winnerIndex !== null ? (segments[winnerIndex] ?? null) : null

  useEffect(() => {
    document.title = branding.documentTitle
  }, [])

  useEffect(() => {
    void fetch('/config.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: RuntimeConfig | null) => {
        if (!data) return
        if (typeof data.idleTimeoutSeconds === 'number') {
          setIdleTimeoutSeconds(data.idleTimeoutSeconds)
        }
        setGames(mergeGameUrls(DEFAULT_GAMES, data.games))
      })
      .catch(() => {
        /* keep defaults */
      })
  }, [])

  const resetToReady = useCallback(() => {
    setPhase('ready')
    setWinnerIndex(null)
  }, [])

  const bumpIdle = useCallback(() => {
    if (playing) return
    if (idleTimer.current) window.clearTimeout(idleTimer.current)
    idleTimer.current = window.setTimeout(() => {
      resetToReady()
      setRotation((r) => r % 360)
    }, idleTimeoutSeconds * 1000)
  }, [idleTimeoutSeconds, resetToReady, playing])

  useEffect(() => {
    bumpIdle()
    const onActivity = () => bumpIdle()
    window.addEventListener('pointerdown', onActivity)
    window.addEventListener('keydown', onActivity)
    return () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current)
      window.removeEventListener('pointerdown', onActivity)
      window.removeEventListener('keydown', onActivity)
    }
  }, [bumpIdle])

  const spinEndTimer = useRef<number | null>(null)

  const handleSpinEnd = useCallback(() => {
    if (spinEndTimer.current) {
      window.clearTimeout(spinEndTimer.current)
      spinEndTimer.current = null
    }
    setPhase((p) => (p === 'spinning' ? 'landed' : p))
  }, [])

  const handleSpin = useCallback(() => {
    if (phase === 'spinning') return
    const index = pickSegmentIndex(segments.length)
    setWinnerIndex(index)
    setPhase('spinning')
    setRotation((current) => targetRotation(current, index, segments.length))

    if (spinEndTimer.current) window.clearTimeout(spinEndTimer.current)
    spinEndTimer.current = window.setTimeout(handleSpinEnd, SPIN_MS + 80)

    const el = shellRef.current
    if (el && !document.fullscreenElement) {
      void el.requestFullscreen?.().catch(() => undefined)
    }
  }, [phase, segments.length, handleSpinEnd])

  const openGame = useCallback(async (game: WheelGame) => {
    setPlaying(true)
    setPlayLoading(true)
    setPlayError(null)
    setPlayUrl('')

    const ok = await probeGame(game.url)
    if (!ok) {
      setPlayLoading(false)
      setPlayError(
        `${game.name} is not available right now. Check the game URL and try again.`,
      )
      return
    }

    // Open the game attract / start screen — guest taps PLAY there.
    setPlayUrl(game.url)
    window.setTimeout(() => setPlayLoading(false), 600)
  }, [])

  const handlePlay = useCallback(() => {
    if (!winner) return
    void openGame(winner)
  }, [winner, openGame])

  const handleBackFromGame = useCallback(() => {
    setPlaying(false)
    setPlayUrl('')
    setPlayError(null)
    setPlayLoading(false)
    resetToReady()
    setRotation((r) => r % 360)
  }, [resetToReady])

  return (
    <div ref={shellRef} className="relative h-full w-full">
      <KioskShell muted={muted} onToggleMute={() => setMuted((m) => !m)}>
        <WheelScreen
          segments={segments}
          phase={phase}
          rotation={rotation}
          durationMs={SPIN_MS}
          winner={winner}
          onSpin={handleSpin}
          onSpinEnd={handleSpinEnd}
          onPlay={handlePlay}
          onSpinAgain={resetToReady}
        />
      </KioskShell>

      {playing && winner ? (
        <GamePlayScreen
          name={winner.name}
          url={playUrl}
          loading={playLoading}
          error={playError}
          onBack={handleBackFromGame}
          onRetry={() => void openGame(winner)}
        />
      ) : null}
    </div>
  )
}
