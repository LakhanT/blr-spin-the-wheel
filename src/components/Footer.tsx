import { branding } from '../config'

export function Footer() {
  return (
    <footer className="site-footer">
      <img
        src="/images/blr-skyline.jpg"
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover object-[center_42%]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-pine-deep/80 via-pine-deep/45 to-pine-deep/15" />
      <p className="relative z-10 px-[3vw] pt-[clamp(6px,1.2vh,14px)] text-center text-[clamp(0.7rem,2.1vw,1.55rem)] leading-tight font-semibold tracking-[0.1em] text-white">
        {branding.footer}
      </p>
    </footer>
  )
}
