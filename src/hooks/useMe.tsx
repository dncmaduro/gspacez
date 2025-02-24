import { useQuery } from '@tanstack/react-query'
import { useProfile } from './useProfile'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

export const useMe = () => {
  const { getMe } = useProfile()
  const token = useSelector((state: RootState) => state.auth.token)

  const data = useQuery({
    queryKey: ['medata', token],
    queryFn: () => getMe(token)
  })

  return data.data?.data.result
}
