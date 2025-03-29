import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useAuth } from '../../hooks/useAuth'
import { useEffect, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAppDispatch } from '../../store/store'
import { setAuth } from '../../store/authSlice'
import { GToast } from '../../components/common/GToast'

export const Route = createFileRoute('/integration/callback')({
  component: RouteComponent
})

function RouteComponent() {
  const { code } = useSearch({ from: '/integration/callback' })
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { loginWithGoogle } = useAuth()

  const hasMounted = useRef(false)

  const { mutate } = useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: (response) => {
      dispatch(
        setAuth({
          token: response.data.result.token
        })
      )
      navigate({ to: '/app' })
    },
    onError: () => {
      navigate({ to: '/' })
      GToast.error({
        title: 'Login with Google failed!'
      })
    }
  })

  useEffect(() => {
    if (hasMounted.current) {
      mutate(code)
    }
  }, [code])

  useEffect(() => {
    hasMounted.current = true
  }, [])

  return <></>
}
