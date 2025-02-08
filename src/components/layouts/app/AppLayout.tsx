import { AppShell } from '@mantine/core'
import { AppHeader } from './AppHeader'
import { ChildProps } from '../../../utils/props'
import { AppSidebar } from './AppSidebar'
import { useDisclosure } from '@mantine/hooks'

export const AppLayout = ({ children }: ChildProps) => {
  const [opended, { toggle }] = useDisclosure(true)

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: opended ? 250 : 40,
        breakpoint: 0
      }}
      padding="md"
    >
      <AppShell.Header>
        <AppHeader />
      </AppShell.Header>
      <AppShell.Navbar className="transition-all duration-300 ease-in-out">
        <AppSidebar toggle={toggle} opened={opended} />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
