import {
  ActionIcon,
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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotification } from '../../hooks/useNotification'
import { useMe } from '../../hooks/useMe'
import { useDark } from '../../hooks/useDark'

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
  const { data: meData } = useMe()
  const { markAsRead, markAllAsRead, markAsUnread } = useNotification()
  const queryClient = useQueryClient()

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

  const { mutate: markAll } = useMutation({
    mutationFn: () => markAllAsRead(meData?.id || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-notifications', meData?.id || '']
      })
    }
  })

  const { mutate: markUnread } = useMutation({
    mutationFn: (id: string) => markAsUnread(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-notifications', meData?.id || '']
      })
    }
  })

  const { mutate: markRead } = useMutation({
    mutationFn: (id: string) => markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-notifications', meData?.id || '']
      })
    }
  })

  const { isDark } = useDark()

  return (
    <Box w={'100%'} className="p-2">
      <Box className="mb-3 flex items-center justify-between">
        <Title order={4} className="flex items-center gap-2">
          <GIcon name="Bell" size={20} />
          Notifications
          {unreadCount > 0 && (
            <Badge color="red" variant="filled" size="sm" radius="xl">
              {unreadCount}
            </Badge>
          )}
        </Title>
        {hasNotifications && (
          <Button
            variant="subtle"
            size="compact-xs"
            onClick={() => markAll()}
            color="indigo"
          >
            Mark all as read
          </Button>
        )}
      </Box>

      <Divider mb="md" />

      <ScrollArea.Autosize mah={400} scrollbarSize={6}>
        {isLoading ? (
          <Box className="flex h-20 items-center justify-center">
            <Loader size="sm" color="indigo" />
          </Box>
        ) : (
          <Stack gap="sm">
            {hasNotifications ? (
              <>
                {notifications.map((notification) => (
                  <Box
                    key={notification.id}
                    className={`group relative rounded-md p-2 transition-colors duration-200 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${!notification.read ? `${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-indigo-50 hover:bg-indigo-100'}` : `${isDark ? 'border border-gray-700' : 'border border-gray-200'}`}`}
                    onClick={() => {
                      if (!notification.read) {
                        markRead(notification.id)
                      }
                    }}
                  >
                    <GNotification notification={notification} />
                    {notification.read && (
                      <ActionIcon
                        onClick={(e) => {
                          e.stopPropagation()
                          if (notification.read) {
                            markUnread(notification.id)
                          }
                        }}
                        variant="subtle"
                        size={'sm'}
                        color="indigo"
                        className="!absolute right-6 bottom-6 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >
                        {notification.read ? (
                          <GIcon name="EyeOff" size={14} />
                        ) : (
                          <GIcon name="Eye" size={14} />
                        )}
                      </ActionIcon>
                    )}
                  </Box>
                ))}

                <Divider my="sm" />

                <Button
                  component={Link}
                  to="/notifications"
                  variant="light"
                  color="indigo"
                  fullWidth
                  radius="md"
                  leftSection={<GIcon name="ListDetails" size={16} />}
                >
                  View all notifications
                </Button>
              </>
            ) : (
              <Box className="flex h-32 flex-col items-center justify-center gap-3 p-4 text-center">
                <GIcon name="InboxOff" size={36} color="gray" />
                <Text c="dimmed" size="sm">
                  There are no notifications yet.
                </Text>
              </Box>
            )}
          </Stack>
        )}
      </ScrollArea.Autosize>
    </Box>
  )
}
