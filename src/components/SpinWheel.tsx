import { useId, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { WheelGame } from '../data/games'

type SpinWheelProps = {
  segments: WheelGame[]
  rotation: number
  spinning: boolean
  durationMs: number
  onSpinEnd: () => void
}

const SIZE = 360
const CX = SIZE / 2
const CY = SIZE / 2
const R = 168
const THUMB = 38
const THUMB_Y = CY - R * 0.72

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

function slicePath(index: number, total: number): string {
  const sweep = 360 / total
  const start = index * sweep
  const end = start + sweep
  const a = polar(CX, CY, R, start)
  const b = polar(CX, CY, R, end)
  const large = sweep > 180 ? 1 : 0
  return `M ${CX} ${CY} L ${a.x} ${a.y} A ${R} ${R} 0 ${large} 1 ${b.x} ${b.y} Z`
}

function labelTransform(index: number, total: number): string {
  const sweep = 360 / total
  const mid = index * sweep + sweep / 2
  return `rotate(${mid} ${CX} ${CY})`
}

export function SpinWheel({
  segments,
  rotation,
  spinning,
  durationMs,
  onSpinEnd,
}: SpinWheelProps) {
  const reduceMotion = useReducedMotion()
  const uid = useId().replace(/:/g, '')
  const total = segments.length

  const labels = useMemo(
    () =>
      segments.map((game, i) => ({
        game,
        transform: labelTransform(i, total),
        clipId: `${uid}-thumb-${i}`,
      })),
    [segments, total, uid],
  )

  return (
    <div className="wheel-frame">
      <div
        className="absolute left-1/2 top-0 z-20 w-[clamp(28px,8%,36px)] -translate-x-1/2 -translate-y-[18%]"
        aria-hidden
      >
        <svg viewBox="0 0 36 44" className="h-auto w-full">
          <path
            d="M18 42 L4 8 Q18 0 32 8 Z"
            fill="#ffd42d"
            stroke="#024e4d"
            strokeWidth="2.5"
          />
          <circle cx="18" cy="14" r="4" fill="#037b79" />
        </svg>
      </div>

      <motion.div
        className="wheel-ring h-full w-full"
        animate={{ rotate: rotation }}
        transition={
          reduceMotion || !spinning
            ? { duration: 0 }
            : {
                duration: durationMs / 1000,
                ease: [0.12, 0.75, 0.18, 1],
              }
        }
        onAnimationComplete={() => {
          if (spinning) onSpinEnd()
        }}
      >
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-full w-full"
          role="img"
          aria-label="Game prize wheel"
        >
          <defs>
            <radialGradient id={`${uid}-wash`} cx="50%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#024e4d" stopOpacity="0.06" />
            </radialGradient>
          </defs>

          <circle cx={CX} cy={CY} r={R + 6} fill="#024e4d" />
          <circle cx={CX} cy={CY} r={R + 2} fill="#ffffff" />

          {segments.map((game, i) => (
            <path
              key={`${game.id}-${i}`}
              d={slicePath(i, total)}
              fill={game.fill}
              stroke="#ffffff"
              strokeWidth="2.5"
            />
          ))}

          <circle cx={CX} cy={CY} r={R} fill={`url(#${uid}-wash)`} />

          {labels.map(({ game, transform, clipId }, i) => (
            <g key={`label-${game.id}-${i}`} transform={transform}>
              <defs>
                <clipPath id={clipId}>
                  <circle cx={CX} cy={THUMB_Y} r={THUMB / 2} />
                </clipPath>
              </defs>
              <circle
                cx={CX}
                cy={THUMB_Y}
                r={THUMB / 2 + 2.5}
                fill="#ffffff"
                stroke="rgba(2, 78, 77, 0.4)"
                strokeWidth="1.5"
              />
              <image
                href={game.image}
                x={CX - THUMB / 2}
                y={THUMB_Y - THUMB / 2}
                width={THUMB}
                height={THUMB}
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#${clipId})`}
              />
              <text
                x={CX}
                y={CY - R * 0.48}
                textAnchor="middle"
                fill={game.text}
                style={{
                  fontFamily: 'Gotham, Segoe UI, sans-serif',
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: '0.04em',
                }}
              >
                {game.wheelLabel[0]}
              </text>
              <text
                x={CX}
                y={CY - R * 0.48 + 13}
                textAnchor="middle"
                fill={game.text}
                style={{
                  fontFamily: 'Gotham, Segoe UI, sans-serif',
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: '0.04em',
                }}
              >
                {game.wheelLabel[1]}
              </text>
            </g>
          ))}

          <circle cx={CX} cy={CY} r={42} fill="#ffffff" stroke="#037b79" strokeWidth="3" />
          <circle cx={CX} cy={CY} r={34} fill="#ffd42d" />
          <text
            x={CX}
            y={CY + 5}
            textAnchor="middle"
            fill="#024e4d"
            style={{
              fontFamily: 'Gotham, Segoe UI, sans-serif',
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: '0.12em',
            }}
          >
            SPIN
          </text>
        </svg>
      </motion.div>
    </div>
  )
}
