import { useSelector } from 'react-redux'
import { ChildProps } from '../../utils/props'
import { RootState, useAppDispatch } from '../../store/store'
import { useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import { logout, setAuth } from '../../store/authSlice'
import { GToast } from './GToast'
import { getCookie } from '../../utils/cookie'

export const GAuthGuard = ({ children }: ChildProps) => {
  const token = useSelector((state: RootState) => state.auth.token)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const refreshToken = getCookie('refreshToken') || ''

  const { introspect, refresh } = useAuth()

  const hasMounted = useRef(false)

  const { data } = useQuery({
    queryKey: ['introspect', token],
    queryFn: () => introspect({ token }),
    refetchIntervalInBackground: true,
    refetchInterval: 60000,
    enabled: !!token
  })

  const { mutate: mutateRefresh } = useMutation({
    mutationFn: refresh,
    onSuccess: (response) => {
      dispatch(setAuth({ token: response.data.token }))
    },
    onError: () => {
      dispatch(logout())
      navigate({ to: '/' })
      GToast.error({
        title: 'You have been logged out!',
        subtitle: 'Something happen. Try logging in'
      })
    }
  })

  useEffect(() => {
    if (data && !data?.data.result.valid && hasMounted.current && !!token) {
      console.log(data, hasMounted.current, token)
      mutateRefresh({
        accessTokenExpired: token,
        refreshToken
      })
    }

    if (!token && hasMounted.current) {
      navigate({ to: '/' })
    }
  }, [data?.data.result.valid])

  useEffect(() => {
    hasMounted.current = true
  }, [])

  return <>{children}</>
}
