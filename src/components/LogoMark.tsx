import { useTheme } from '../theme/ThemeContext'

interface Props { className?: string }

export default function LogoMark({ className }: Props) {
  const { theme } = useTheme()
  const src = theme === 'dark' ? '/superxblack.png' : '/superxwhite.png'
  return <img className={`logo-mark ${className || ''}`} src={src} alt="SuperAPI" />
}
