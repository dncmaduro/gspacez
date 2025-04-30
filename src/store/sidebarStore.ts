import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SidebarStore {
  opened: boolean
  toggle: () => void
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set, get) => ({
      opened: true,
      toggle: () => set({ opened: !get().opened })
    }),
    {
      name: 'sidebar-store'
    }
  )
)
