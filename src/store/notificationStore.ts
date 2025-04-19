import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface NotificationStore {
  notificationsQuantity: number
  setNotificationsQuantity: (quantity: number) => void
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      notificationsQuantity: 0,
      setNotificationsQuantity: (quantity: number) => {
        set({ notificationsQuantity: quantity })
      }
    }),
    {
      name: 'notification-store'
    }
  )
)
