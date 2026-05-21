interface Props { className?: string }

export default function LogoMark({ className }: Props) {
  return (
    <svg className={`logo-mark ${className || ''}`} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {/* two interlocking leaf swirls — green + blue */}
      <path d="M24 4a20 20 0 0 1 0 40 12 12 0 0 0 0-24 8 8 0 0 1 0-16Z" fill="#5dcaa5" />
      <path d="M24 44a20 20 0 0 1 0-40 12 12 0 0 0 0 24 8 8 0 0 1 0 16Z" fill="#185fa5" />
    </svg>
  )
}
