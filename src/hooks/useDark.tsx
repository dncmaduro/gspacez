import { useComputedColorScheme, useMantineColorScheme } from '@mantine/core'

export const useDark = () => {
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true
  })
  const { setColorScheme } = useMantineColorScheme()

  return {
    isDark: computedColorScheme === 'dark',
    toggleTheme: () => {
      setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')
    }
  }
}
