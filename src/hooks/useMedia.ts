import { useMediaQuery } from '@mantine/hooks'

export const useMedia = () => {
  return {
    isMobile: useMediaQuery('(max-width: 768px)'),
    isTablet: useMediaQuery('(max-width: 1024px)')
  }
}
