export type WheelGame = {
  id: string
  name: string
  /** Short lines drawn on the wheel segment */
  wheelLabel: string[]
  /** Round thumbnail shown on the wheel and result card */
  image: string
  tagline: string
  url: string
  /** Segment fill — pine / mint / sun brand trio */
  fill: string
  text: string
}

function envUrl(key: string, fallback: string): string {
  const value = (import.meta.env[key] as string | undefined)?.trim()
  return value || fallback
}

/** Canonical game list. URLs can be overridden via public/config.json or VITE_* env. */
export const DEFAULT_GAMES: WheelGame[] = [
  {
    id: 'flip-match',
    name: 'Flip & Match',
    wheelLabel: ['FLIP &', 'MATCH'],
    image: '/images/games/flip-match.jpg',
    tagline: 'FLIP • MATCH • WIN',
    url: envUrl('VITE_FLIP_MATCH_URL', 'http://127.0.0.1:5174/'),
    fill: '#037b79',
    text: '#ffffff',
  },
  {
    id: 'emoji',
    name: 'Emoji Challenge',
    wheelLabel: ['EMOJI', 'CHALLENGE'],
    image: '/images/games/emoji-challenge.jpg',
    tagline: 'DECODE • GUESS • WIN',
    url: envUrl('VITE_EMOJI_URL', 'http://127.0.0.1:5175/'),
    fill: '#ffd42d',
    text: '#024e4d',
  },
  {
    id: 'namma',
    name: 'Namma Karnataka',
    wheelLabel: ['NAMMA', 'KARNATAKA'],
    image: '/images/games/namma-karnataka.jpg',
    tagline: 'GUESS • LEARN • WIN',
    url: envUrl('VITE_NAMMA_URL', 'http://127.0.0.1:5173/'),
    fill: '#a7e2e1',
    text: '#024e4d',
  },
]

/**
 * Duplicate each game so the wheel has 6 even slices — fuller look,
 * same odds per game.
 */
export function buildWheelSegments(games: WheelGame[]): WheelGame[] {
  return [...games, ...games]
}

export function mergeGameUrls(
  games: WheelGame[],
  overrides: { id: string; url: string }[] | undefined,
): WheelGame[] {
  if (!overrides?.length) return games
  const map = new Map(overrides.map((o) => [o.id, o.url]))
  return games.map((g) => {
    const url = map.get(g.id)
    return url ? { ...g, url } : g
  })
}
