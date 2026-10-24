import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function base(props: IconProps): IconProps {
  return {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    ...props,
  }
}

export function SpeakerIcon({ muted, ...props }: IconProps & { muted: boolean }) {
  return (
    <svg {...base(props)}>
      <path d="M4 10h3.2L12 6.2v11.6L7.2 14H4v-4Z" />
      {muted ? (
        <path d="m16 10 5 4M21 10l-5 4" />
      ) : (
        <path d="M16 9.5a3.5 3.5 0 0 1 0 5M18.2 7.2a6.5 6.5 0 0 1 0 9.6" />
      )}
    </svg>
  )
}
