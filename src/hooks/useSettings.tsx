import { useQuery } from '@tanstack/react-query'
import { useProfile } from './useProfile'

export const useSettings = () => {
  const { getSettings } = useProfile()

  const { data, isLoading } = useQuery({
    queryKey: ['get-settings'],
    queryFn: () => getSettings()
  })

  return {
    data: data?.data.result,
    isLoading
  }
}
