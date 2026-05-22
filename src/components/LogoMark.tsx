interface Props { className?: string }

export default function LogoMark({ className }: Props) {
  return <img className={`logo-mark ${className || ''}`} src="/logo.png" alt="EcoAPI" />
}
