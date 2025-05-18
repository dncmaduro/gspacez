import { AppShell } from '@mantine/core'
import { ReactNode, useEffect } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { useDisclosure } from '@mantine/hooks'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '../../../store/authStore'
import { GAuthGuard } from '../../common/GAuthGuard'

interface Props {
  children: ReactNode
}

export const AdminLayout = ({ children }: Props) => {
  const navigate = useNavigate()
  const { accessToken } = useAuthStore()

  useEffect(() => {
    if (!accessToken) {
      navigate({ to: '/auth' })
    }
  }, [accessToken])

  const [opended, { toggle }] = useDisclosure(true)

  return (
    <GAuthGuard>
      <AppShell
        navbar={{
          width: opended ? 250 : 40,
          breakpoint: 0
        }}
      >
        <AppShell.Navbar>
          <AdminSidebar toggle={toggle} opened={opended} />
        </AppShell.Navbar>
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </GAuthGuard>
  )
}
