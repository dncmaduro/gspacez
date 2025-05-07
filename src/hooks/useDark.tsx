import { useComputedColorScheme } from '@mantine/core'

export const useDark = () => {
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true
  })

  return {
    isDark: computedColorScheme === 'dark'
  }
}
