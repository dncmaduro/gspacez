import { useComputedColorScheme } from '@mantine/core'
import LogoLight from '../public/Logo.png'
import LogoDark from '../public/Logo_dark.png'

export const useLogo = () => {
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true
  })

  return {
    logo: computedColorScheme === 'dark' ? LogoDark : LogoLight,
    darkLogo: LogoDark,
    lightLogo: LogoLight
  }
}
