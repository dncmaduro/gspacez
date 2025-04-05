import { ChildProps } from '../../utils/props'
import { useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import { GToast } from './GToast'
import { getCookie } from '../../utils/cookie'
import { useAuthStore } from '../../store/authStore'

export const GAuthGuard = ({ children }: ChildProps) => {
  const { accessToken } = useAuthStore()
  const navigate = useNavigate()
  const { setAuth, clearAuth } = useAuthStore()
  const refreshToken = getCookie('refreshToken') || ''

  const { introspect, refresh } = useAuth()

  const hasMounted = useRef(false)

  const { data } = useQuery({
    queryKey: ['introspect', accessToken],
    queryFn: () => introspect({ token: accessToken }),
    refetchIntervalInBackground: true,
    refetchInterval: 60000,
    enabled: !!accessToken
  })

  const { mutate: mutateRefresh } = useMutation({
    mutationFn: refresh,
    onSuccess: (response) => {
      setAuth({
        accessToken: response.data.result.token,
        refreshToken: response.data.result.refreshToken
      })
    },
    onError: () => {
      clearAuth()
      navigate({ to: '/' })
      GToast.error({
        title: 'You have been logged out!',
        subtitle: 'Something happen. Try logging in'
      })
    }
  })

  useEffect(() => {
    if (
      data &&
      !data?.data.result.valid &&
      hasMounted.current &&
      !!accessToken
    ) {
      mutateRefresh({
        accessTokenExpired: accessToken,
        refreshToken
      })
    }

    if (!accessToken && hasMounted.current) {
      navigate({ to: '/' })
    }
  }, [data?.data.result.valid])

  useEffect(() => {
    hasMounted.current = true
  }, [])

  return <>{children}</>
}
