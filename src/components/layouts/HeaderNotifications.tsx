import { useQuery } from '@tanstack/react-query'
import { useMe } from '../../hooks/useMe'
import { useProfile } from '../../hooks/useProfile'
import { Loader, ScrollArea, Stack, Text } from '@mantine/core'
import { GNotification } from '../common/GNotification'

export const HeaderNotifications = () => {
  const { data: meData } = useMe()
  const { getNotifications } = useProfile()

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['get-notifications', meData?.id || ''],
    queryFn: () => getNotifications(meData?.id || ''),
    select: (data) => {
      return data.data.result
    }
  })

  return (
    <Stack align="center">
      <ScrollArea.Autosize mah={600}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {notificationsData ? (
              notificationsData.map((notification) => (
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
