import { AppShell } from '@mantine/core'
import { AppHeader } from './AppHeader'
import { ChildProps } from '../../../utils/props'
import { AppSidebar } from './AppSidebar'
import { useDisclosure } from '@mantine/hooks'
import { GAuthGuard } from '../../common/GAuthGuard'
import { useAuthStore } from '../../../store/authStore'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useCallbackStore } from '../../../store/callbackStore'

interface Props {
  hideSearchInput?: boolean
}

export const AppLayout = ({
  children,
  hideSearchInput
}: ChildProps & Props) => {
  const [opended, { toggle }] = useDisclosure(true)
  const navigate = useNavigate()

  const { accessToken } = useAuthStore()
  const { setCallbackUrl } = useCallbackStore()

  useEffect(() => {
    if (!accessToken) {
      setCallbackUrl(window.location.pathname)
      navigate({ to: '/' })
    }
  }, [accessToken])

  return (
    <GAuthGuard>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: opended ? 250 : 40,
          breakpoint: 0
        }}
        padding="md"
      >
        <AppShell.Header>
          <AppHeader hideSearchInput={hideSearchInput} />
        </AppShell.Header>
        <AppShell.Navbar className="transition-all duration-300 ease-in-out">
          <AppSidebar toggle={toggle} opened={opended} />
        </AppShell.Navbar>
        <AppShell.Main bg={'gray.0'}>{children}</AppShell.Main>
      </AppShell>
    </GAuthGuard>
  )
}
