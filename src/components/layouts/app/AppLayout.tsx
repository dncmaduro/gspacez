import { AppShell } from '@mantine/core'
import { AppHeader } from './AppHeader'
import { ChildProps } from '../../../utils/props'
import { AppSidebar } from './AppSidebar'
import { GAuthGuard } from '../../common/GAuthGuard'
import { useAuthStore } from '../../../store/authStore'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useCallbackStore } from '../../../store/callbackStore'
import { useStompClient } from '../../../hooks/useStompClient'
import { INotification } from '../../../hooks/interface'
import { useMe } from '../../../hooks/useMe'
import { GToast } from '../../common/GToast'
import renderNotiContent from '../../../utils/getNoti'
import { useQueryClient } from '@tanstack/react-query'
import { useSidebarStore } from '../../../store/sidebarStore'
import { useMedia } from '../../../hooks/useMedia'

interface Props {
  hideSearchInput?: boolean
}

export const AppLayout = ({
  children,
  hideSearchInput
}: ChildProps & Props) => {
  const { data: meData } = useMe()
  const { opened, toggle } = useSidebarStore()
  const navigate = useNavigate()
  const { accessToken } = useAuthStore()
  const { setCallbackUrl } = useCallbackStore()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!accessToken) {
      setCallbackUrl(window.location.pathname)
      navigate({ to: '/' })
    }
  }, [accessToken])

  useStompClient<INotification>({
    url: 'wss://gspacez.tech/api/v1/notification/ws',
    token: accessToken,
    topic: `/queue/notifications/${meData?.id}`,
    onMessage: (notification: INotification) => {
      const renderContent = renderNotiContent(notification)
      GToast.information({
        title: renderContent.title,
        subtitle: renderContent.subtitle
      })
      queryClient.invalidateQueries({
        queryKey: ['get-notifications', meData?.id || '']
      })
    }
  })

  const { isMobile } = useMedia()

  return (
    <GAuthGuard>
      <AppShell
        header={{
          height: {
            base: 50,
            sm: 60,
            md: 60,
            lg: 60,
            xl: 60
          }
        }}
        navbar={{
          width: isMobile ? 0 : opened ? 250 : 40,
          breakpoint: 0
        }}
        padding="md"
        transitionDuration={300}
        transitionTimingFunction="ease"
      >
        <AppShell.Header>
          <AppHeader hideSearchInput={hideSearchInput} />
        </AppShell.Header>
        <AppShell.Navbar className="transition-all duration-300 ease-in-out">
          <AppSidebar toggle={toggle} opened={opened} />
        </AppShell.Navbar>
        <AppShell.Main bg={'gray.0'}>{children}</AppShell.Main>
      </AppShell>
    </GAuthGuard>
  )
}
