import { AppShell } from '@mantine/core'
import { AppHeader } from './AppHeader'
import { ChildProps } from '../../../utils/props'

export const AppLayout = ({ children }: ChildProps) => {
  return (
    <AppShell>
      <AppShell.Header>
        <AppHeader />
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
