import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useAuth } from '../../hooks/useAuth'
import { useEffect, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { GToast } from '../../components/common/GToast'
import { useAuthStore } from '../../store/authStore'

export const Route = createFileRoute('/integration/callback')({
  component: RouteComponent
})

function RouteComponent() {
  const { code } = useSearch({ from: '/integration/callback' })
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const processedCode = useRef<string | null>(null)

  const { loginWithGoogle } = useAuth()

  const { mutate } = useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: (response) => {
      setAuth({
        accessToken: response.data.result.token,
        refreshToken: response.data.result.refreshToken
      })
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
    // Check if code exists and hasn't been processed yet ???
    if (code && code !== processedCode.current) {
      processedCode.current = code
      mutate(code)
    }
  }, [code, mutate])

  return <></>
}
