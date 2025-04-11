import { AppShell } from '@mantine/core'
import { ReactNode } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { useDisclosure } from '@mantine/hooks'

interface Props {
  children: ReactNode
}

export const AdminLayout = ({ children }: Props) => {
  const [opended, { toggle }] = useDisclosure(true)
  return (
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
  )
}
