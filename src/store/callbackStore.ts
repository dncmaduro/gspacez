import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CallbackStore {
  callbackUrl: string
  setCallbackUrl: (url: string) => void
  clearCallbackUrl: () => void
}

export const useCallbackStore = create<CallbackStore>()(
  persist(
    (set) => ({
      callbackUrl: '',
      setCallbackUrl: (url: string) => set({ callbackUrl: url }),
      clearCallbackUrl: () => set({ callbackUrl: '' })
    }),
    {
      name: 'callback-store'
    }
  )
)
