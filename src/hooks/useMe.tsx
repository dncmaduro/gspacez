import { useQuery } from '@tanstack/react-query'
import { useProfile } from './useProfile'

export const useMe = () => {
  const { getMe } = useProfile()

  const { data, isLoading } = useQuery({
    queryKey: ['medata'],
    queryFn: () => getMe()
  })

  return {
    data: data?.data.result,
    isLoading
  }
}
