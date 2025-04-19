import {
  Badge,
  Box,
  Button,
  Divider,
  Loader,
  ScrollArea,
  Stack,
  Text,
  Title
} from '@mantine/core'
import { GNotification } from '../common/GNotification'
import { INotification } from '../../hooks/interface'
import { useEffect, useMemo } from 'react'
import { useNotificationStore } from '../../store/notificationStore'
import { GIcon } from '../common/GIcon'
import { Link } from '@tanstack/react-router'

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
  }, [size])

  const hasNotifications = useMemo(() => {
    return notifications && notifications.length > 0
  }, [notifications])

  const unreadCount = useMemo(() => {
    return (
      notifications?.filter((notification) => !notification.read).length || 0
    )
  }, [notifications])

  return (
    <Box w={350}>
      <Box className="mb-2 flex items-center justify-between px-2">
        <Title order={4} className="flex items-center gap-2">
          <GIcon name="Bell" size={20} />
          Notifications
          {unreadCount > 0 && (
            <Badge color="red" variant="filled" size="sm">
              {unreadCount}
            </Badge>
          )}
        </Title>
        {hasNotifications && (
          <Button variant="subtle" size="compact-xs">
            Mark all as read
          </Button>
        )}
      </Box>

      <Divider mb="sm" />

      <ScrollArea.Autosize mah={400} scrollbarSize={6}>
        {isLoading ? (
          <Box className="flex h-20 items-center justify-center">
            <Loader size="sm" />
          </Box>
        ) : (
          <Stack gap="xs">
            {hasNotifications ? (
              <>
                {notifications.map((notification) => (
                  <Box
                    key={notification.id}
                    className={`rounded-md transition-colors duration-200 ${!notification.read ? 'bg-indigo-50' : ''}`}
                  >
                    <GNotification notification={notification} />
                  </Box>
                ))}

                <Divider my="xs" />

                <Button
                  component={Link}
                  to="/notifications"
                  variant="light"
                  fullWidth
                  leftSection={<GIcon name="ListDetails" size={16} />}
                >
                  View all notifications
                </Button>
              </>
            ) : (
              <Box className="flex h-32 flex-col items-center justify-center gap-2 p-4 text-center">
                <GIcon name="InboxOff" size={32} color="gray" />
                <Text c="dimmed">There are no notifications yet.</Text>
              </Box>
            )}
          </Stack>
        )}
      </ScrollArea.Autosize>
    </Box>
  )
}
