import { Loader, ScrollArea, Stack, Text } from '@mantine/core'
import { GNotification } from '../common/GNotification'
import { INotification } from '../../hooks/interface'
import { useEffect } from 'react'
import { useNotificationStore } from '../../store/notificationStore'

interface Props {
  notifications: INotification[]
  isLoading: boolean
  size: number
}

export const HeaderNotifications = ({
  notifications,
  isLoading,
  size
}: Props) => {
  const { setNotificationsQuantity } = useNotificationStore()

  useEffect(() => {
    setNotificationsQuantity(size)
  }, [])

  return (
    <Stack align="center">
      <ScrollArea.Autosize mah={600}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {notifications ? (
              notifications.map((notification) => (
                <GNotification
                  key={notification.id}
                  notification={notification}
                />
              ))
            ) : (
              <Text>There are no notifications.</Text>
            )}
          </>
        )}
      </ScrollArea.Autosize>
    </Stack>
  )
}
