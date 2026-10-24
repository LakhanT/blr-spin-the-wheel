import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { branding } from '../config'
import type { WheelGame } from '../data/games'
import { SpinWheel } from './SpinWheel'

export type WheelPhase = 'ready' | 'spinning' | 'landed'

type WheelScreenProps = {
  segments: WheelGame[]
  phase: WheelPhase
  rotation: number
  durationMs: number
  winner: WheelGame | null
  onSpin: () => void
  onSpinEnd: () => void
  onPlay: () => void
  onSpinAgain: () => void
}

export function WheelScreen({
  segments,
  phase,
  rotation,
  durationMs,
  winner,
  onSpin,
  onSpinEnd,
  onPlay,
  onSpinAgain,
}: WheelScreenProps) {
  const reduceMotion = useReducedMotion()
  const busy = phase === 'spinning'
  const landed = phase === 'landed' && winner

  return (
    <section className="game-panel wheel-screen relative" aria-label="Spin the wheel">
      <div className="wheel-copy relative z-10 shrink-0 text-center">
        <p className="text-[clamp(0.65rem,1.3vh,0.9rem)] font-bold tracking-[0.24em] text-pine">
          GAME PICKER
        </p>
        <h1 className="mt-[0.25vh]">
          <span className="block font-display text-[clamp(1rem,2.4vh,2rem)] font-semibold tracking-[0.2em] text-pine/80">
            {branding.productLine}
          </span>
          <span className="block font-display text-[clamp(1.85rem,5.2vh,4.4rem)] leading-[0.92] font-bold tracking-tight text-pine">
            {branding.productTitle}
          </span>
        </h1>
        <p className="mt-[0.4vh] text-[clamp(0.62rem,1.25vh,0.95rem)] font-bold tracking-[0.16em] text-pine">
          {branding.subtitle}
        </p>
        {!landed && (
          <p className="wheel-instruction mx-auto mt-[0.55vh] max-w-[34ch] text-[clamp(0.8rem,1.5vh,1.05rem)] text-ink/85">
            {branding.instruction}
          </p>
        )}

        <AnimatePresence mode="wait">
          {landed ? (
            <motion.div
              key="result"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="wheel-result well mt-[1vh] w-full max-w-[420px] px-3 py-2.5 text-center sm:px-4"
            >
              <p className="text-[clamp(0.62rem,1.2vh,0.85rem)] font-semibold tracking-[0.2em] text-muted">
                YOU GOT
              </p>
              <div className="result-row mt-1.5 flex items-center justify-center gap-2.5">
                <img
                  src={winner.image}
                  alt=""
                  draggable={false}
                  className="h-[clamp(40px,5.2vh,64px)] w-[clamp(40px,5.2vh,64px)] shrink-0 rounded-full border-[1.5px] border-pine/35 object-cover"
                />
                <p className="min-w-0 font-display text-[clamp(1.15rem,2.8vh,2.2rem)] font-bold leading-tight text-pine">
                  {winner.name}
                </p>
              </div>
              <p className="mt-1 text-[clamp(0.62rem,1.25vh,0.9rem)] font-bold tracking-[0.14em] text-pine">
                {winner.tagline}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="wheel-stage relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center py-[0.4vh]">
        <SpinWheel
          segments={segments}
          rotation={rotation}
          spinning={busy}
          durationMs={reduceMotion ? 0 : durationMs}
          onSpinEnd={onSpinEnd}
        />

        {!landed && (
          <p className="wheel-hint mt-[1vh] text-[clamp(0.68rem,1.35vh,0.95rem)] font-semibold tracking-[0.14em] text-muted">
            {busy ? 'GOOD LUCK…' : 'TAP SPIN TO BEGIN'}
          </p>
        )}
      </div>

      <div className="wheel-actions relative z-10 shrink-0 space-y-[0.7vh]">
        {landed ? (
          <>
            <button type="button" className="play-button" onClick={onPlay}>
              PLAY
            </button>
            <button
              type="button"
              className="mx-auto block min-h-11 px-3 text-[clamp(0.75rem,1.4vh,0.95rem)] font-bold tracking-[0.16em] text-pine underline-offset-4"
              onClick={onSpinAgain}
            >
              SPIN AGAIN
            </button>
          </>
        ) : (
          <button
            type="button"
            className="play-button"
            disabled={busy}
            onClick={onSpin}
            aria-busy={busy}
          >
            {busy ? 'SPINNING…' : 'SPIN'}
          </button>
        )}
      </div>
    </section>
  )
}
