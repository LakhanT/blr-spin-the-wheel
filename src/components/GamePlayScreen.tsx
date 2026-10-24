type GamePlayScreenProps = {
  name: string
  url: string
  loading: boolean
  error: string | null
  onBack: () => void
  onRetry: () => void
}

export function GamePlayScreen({
  name,
  url,
  loading,
  error,
  onBack,
  onRetry,
}: GamePlayScreenProps) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-page">
      <div className="flex shrink-0 items-center gap-3 border-b border-pine/20 bg-white px-[3vw] py-[0.8vh]">
        <button
          type="button"
          className="icon-button"
          aria-label="Back to spin wheel"
          onClick={onBack}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M15 6 9 12l6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[clamp(0.65rem,1.2vh,0.8rem)] font-semibold tracking-[0.18em] text-muted">
            NOW PLAYING
          </p>
          <p className="truncate font-display text-[clamp(1rem,2.2vh,1.4rem)] font-bold text-pine">
            {name}
          </p>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 bg-[#e7f4f3]">
        {error ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="font-display text-[clamp(1.4rem,3vh,2rem)] font-bold text-pine">
              Game unavailable
            </p>
            <p className="max-w-[36ch] text-[clamp(0.9rem,1.8vh,1.1rem)] text-ink/85">
              {error}
            </p>
            <button type="button" className="play-button max-w-[320px]" onClick={onRetry}>
              TRY AGAIN
            </button>
            <button
              type="button"
              className="min-h-11 text-[clamp(0.8rem,1.5vh,0.95rem)] font-bold tracking-[0.16em] text-pine"
              onClick={onBack}
            >
              BACK TO WHEEL
            </button>
          </div>
        ) : (
          <>
            {loading ? (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#e7f4f3]">
                <p className="font-display text-[clamp(1.2rem,2.6vh,1.8rem)] font-bold tracking-[0.08em] text-pine">
                  LOADING GAME…
                </p>
              </div>
            ) : null}
            <iframe
              key={url}
              title={name}
              src={url}
              className="h-full w-full border-0 bg-white"
              allow="fullscreen"
            />
          </>
        )}
      </div>
    </div>
  )
}
