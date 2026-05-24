import { useTheme } from '../theme/ThemeContext'

interface Props { className?: string }

export default function LogoMark({ className }: Props) {
  const { theme } = useTheme()
  const src = theme === 'dark' ? '/rootlogo.png' : '/logo.png'
  return <img className={`logo-mark ${className || ''}`} src={src} alt="EcoAPI" />
}
