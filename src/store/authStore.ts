import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { saveToCookies } from './cookies'

interface AuthState {
  accessToken: string
  setAuth: (payload: SetAuthType) => void
  clearAuth: () => void
}

interface SetAuthType {
  accessToken: string
  refreshToken: string
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: '',
      setAuth: (payload: SetAuthType) => {
        set({ accessToken: payload.accessToken })
        saveToCookies('refreshToken', payload.refreshToken)
      },
      clearAuth: () => {
        set({ accessToken: '' })
        saveToCookies('refreshToken', '')
      }
    }),
    {
      name: 'auth-store'
    }
  )
)
