import { Avatar, Box, Group, Stack, Text, Flex } from '@mantine/core'
import { useMemo } from 'react'
import { INotification } from '../../hooks/interface'
import { GIcon } from './GIcon'
import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import renderNotiContent from '../../utils/getNoti'

interface Props {
  notification: INotification
}

export const GNotification = ({ notification }: Props) => {
  const notiContent = useMemo(() => {
    return renderNotiContent(notification)
  }, [notification])

  return (
    <Link to={notiContent.href}>
      <Box className="rounded-lg p-3 transition-colors duration-200">
        <Group justify="apart" align="center">
          <Flex align="center" gap="sm">
            <Avatar
              size="md"
              src={notification.entity.sender.profileImageUrl}
              className="border border-gray-300"
            />
            <Stack gap={4}>
              {notiContent.title}
              <Flex align="center" gap={6}>
                <GIcon name="Clock" size={14} color="gray" />
                <Text size="xs" c="dimmed">
                  {format(new Date(notification.createdAt), 'PP')}
                </Text>
              </Flex>
            </Stack>
          </Flex>
        </Group>
      </Box>
    </Link>
  )
}
