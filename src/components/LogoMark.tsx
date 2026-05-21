interface Props { className?: string }

export default function LogoMark({ className }: Props) {
  return (
    <svg className={`logo-mark ${className || ''}`} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#185fa5" />
          <stop offset="1" stopColor="#5dcaa5" />
        </linearGradient>
      </defs>
      <path d="M24 45C24 31 17 23.5 4 21.5 4 35.5 11 43 24 45Z" fill="url(#logoGrad)" />
      <path d="M24 45C24 29 31.5 21 44.5 19 44.5 33 37.5 43 24 45Z" fill="url(#logoGrad)" opacity="0.72" />
      <circle cx="24" cy="11" r="5.4" fill="url(#logoGrad)" />
    </svg>
  )
}
